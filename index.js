#!/usr/bin/env node
const dotenv = require("dotenv");
let config = dotenv.config();
if (!config.error) config = config.parsed;

const { prompt } = require("enquirer");

const queries = require("./queries");
const axios = require("axios");
const args = require("yargs").argv;

const PRName = args.prName || args._[0] || "PR from Campr";

const API_URL = `https://api.github.com/graphql`;

const repoOwner = config.repoOwner || "";
const repoName = config.repoName || "";
const baseRef = config.baseRef;
const headRefName = config.headRef;

const repositoryId = config.repoId;

// configure axios
axios.defaults.headers.common["Authorization"] = `Bearer ${config.token}`;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["user-agent"] = "node.js";
axios.defaults.headers.common["Accept"] =
  "application/vnd.github.ocelot-preview+json";

const questions = [
  {
    type: "input",
    name: "repoName",
    message: "What's the name of the repository?",
    default: config.repoName
  },
  {
    type: "input",
    name: "headRef",
    message: "What's the name of the branch to merge from?",
    default: config.headRef
  },
  {
    type: "input",
    name: "baseRef",
    message: "What's the name of the branch to merge into?",
    default: config.baseRef
  },
  {
    type: "input",
    name: "pullRequestName",
    message: "Pull request title?",
    default: PRName
  }
];

const main = async () => {
  console.log("Awaitiong");

  const input = await prompt(questions);

  console.log(input.pullRequestName);
  const getRepoQuery = queries.getRepository(repoOwner, input.repoName);

  console.log("Fetching repository... " + input.repoName);
  let data = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: getRepoQuery
    }
  });

  if (data.status === 200) {
    console.log(
      "Creating pull request... " + `${input.headRef} --> ${input.baseRef}`
    );
    let createPR = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: queries.createPullRequest(
          input.headRef,
          input.baseRef,
          data.data.data.repository.id,
          input.pullRequestName
        )
      }
    });

    if (createPR.status === 200) {
      let CPRData = createPR.data;
      if (CPRData.errors) return console.error(CPRData.errors[0].message);

      if (
        typeof CPRData.data.createPullRequest.pullRequest.id !== "undefined"
      ) {
        const lowerCase = s => s.toLowerCase();
        const hasBranchMods = d => d.includes("branch was modified");

        let prId = CPRData.data.createPullRequest.pullRequest.id;
        console.log("PR Id: " + prId);
        console.log("Merging pull request..");
        let mergePR = await axios({
          url: API_URL,
          method: "POST",
          data: {
            query: queries.mergePullRequest(prId)
          }
        });

        if (mergePR.data.errors) {
          if (hasBranchMods(lowerCase(mergePR.data.errors[0].message))) {
            console.log("Retrying");
            let mergeRetry = await axios({
              url: API_URL,
              method: "POST",
              data: {
                query: queries.mergePullRequest(prId)
              }
            });

            console.log(JSON.stringify(mergeRetry.data));
          }
        }
      }
    }
  }
};

main();
