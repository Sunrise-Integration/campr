import dotenv from "dotenv";
let config = dotenv.config();
if (!config.error) config = config.parsed;
import rp from "request-promise";
import queries from "./queries";

const API_URL = `https://api.github.com/graphql`;

const repoOwner = "Sunrise-Integration";
const repoName = "tasklauncher";

const getRepoQuery = queries.getRepository(repoOwner, repoName);

let options = {
  uri: "https://api.github.com/graphql",
  body: {
    query: getRepoQuery
  },
  json: true,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${config.token}`,
    "user-agent": "node.js",
    Accept: "application/vnd.github.ocelot-preview+json"
  }
};

const main = async () => {
  let data = await rp.post(options);

  const repositoryId = data.data.repository.id;
  const createPRQuery = queries.createPullRequest(repositoryId, "UI fixes");

  const newOptions = JSON.parse(JSON.stringify(options));
  newOptions.query = createPRQuery;

  console.log(newOptions);

  let pullRequestData = await rp.post(newOptions);
};

main();

// const request = https.request(options, res => {
//   res.setEncoding("utf8");
//   console.log(res.statusCode);
//   res.on("data", chunk => {
//     chunk = JSON.parse(chunk);
//     if (res.statusCode === 200) {
//       const { createPullRequest } = chunk.data;
//       const PRId = createPullRequest.pullRequest.id;
//       mergePostData = mergePostData.replace("{{id}}", PRId);

//       const mergeRequest = https.request(options, mergeRes => {
//         console.log(mergeRes.statusCode);

//         mergeRes.on("data", mergeChunk => {
//           mergeChunk = JSON.parse(mergeChunk);

//           console.log(mergeChunk);
//         });
//       });

//       mergeRequest.on("error", e => {
//         console.error(`${e.message}`);
//       });
//       mergeRequest.write(mergePostData);
//       mergeRequest.end();
//     }
//   });
// });

// request.on("error", e => {
//   console.error(`${e.message}`);
// });
// request.write(postData);
// request.end();
