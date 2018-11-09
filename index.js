#!/usr/bin/env node
const dotenv = require("dotenv");
let config = dotenv.config();
if (!config.error) config = config.parsed;

const queries = require("./queries");
const axios = require("axios");
const args = require("yargs").argv;

const PRName = args.prName || args._[0] || "PR from GithubGraphQL";

const API_URL = `https://api.github.com/graphql`;

const repoOwner = config.repoOwner || "";
const repoName = config.repoName || "";

const getRepoQuery = queries.getRepository(repoOwner, repoName);

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
    name: "commitName",
    message: "Enter commit name"
  },
  {
    type: "input",
    name: "prName",
    message: "Enter pull request name"
  }
];

const main = async () => {
  console.log("Fetching repository...");
  let data = await axios({
    url: API_URL,
    method: "POST",
    data: {
      query: getRepoQuery
    }
  });

  if (data.status === 200) {
    console.log("Creating pull request..");
    let createPR = await axios({
      url: API_URL,
      method: "POST",
      data: {
        query: queries.createPullRequest(data.data.data.repository.id, PRName)
      }
    });

    if (createPR.status === 200) {
      let CPRData = createPR.data;
      if (CPRData.errors) return console.error(CPRData.errors[0].message);

      if (
        typeof CPRData.data.createPullRequest.pullRequest.id !== "undefined"
      ) {
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
        console.log(mergePR.status);
        console.log(JSON.stringify(mergePR.data));
      }
    }
  }
};

main();
