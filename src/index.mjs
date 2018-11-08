import dotenv from "dotenv";
let config = dotenv.config();
if (!config.error) config = config.parsed;
import https from "https";
import fs from "fs";

const API_URL = `https://api.github.com/graphql`;

const createPR = {
  query: `
  mutation CreatePullRequest {
    createPullRequest(input: { baseRefName: "master", title: "api pull request", repositoryId: "MDEwOlJlcG9zaXRvcnkxNTM1NDMxNzg=", headRefName: "develop" }) {
      pullRequest {
        title
        id
      }
  }
}`
};

const mergePR = {
  query: `
  mutation MergePullRequest {
    mergePullRequest(input: { pullRequestId: "{{id}}" }) {
      pullRequest {
        title
        id
      }
  }
}`
};
console.log(config.token);
const postData = JSON.stringify(createPR);
let mergePostData = JSON.stringify(mergePR);

const options = {
  host: "api.github.com",
  path: "/graphql",
  method: "POST",
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${config.token}`,
    "user-agent": "node.js",
    Accept: "application/vnd.github.ocelot-preview+json"
  }
};
const request = https.request(options, res => {
  res.setEncoding("utf8");
  console.log(res.statusCode);
  res.on("data", chunk => {
    chunk = JSON.parse(chunk);
    if (res.statusCode === 200) {
      const { createPullRequest } = chunk.data;
      const PRId = createPullRequest.pullRequest.id;
      mergePostData = mergePostData.replace("{{id}}", PRId);

      const mergeRequest = https.request(options, mergeRes => {
        console.log(mergeRes.statusCode);

        mergeRes.on("data", mergeChunk => {
          mergeChunk = JSON.parse(mergeChunk);

          console.log(mergeChunk);
        });
      });

      mergeRequest.on("error", e => {
        console.error(`${e.message}`);
      });
      mergeRequest.write(mergePostData);
      mergeRequest.end();
    }
  });
});

request.on("error", e => {
  console.error(`${e.message}`);
});
request.write(postData);
request.end();
