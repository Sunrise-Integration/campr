const config = require("dotenv").config().parsed;
const baseRef = config.baseRef;
const headRefName = config.headRef;
class QueryBuilder {
  getRepository(owner, name) {
    return `
    query {
      repository(owner: \"${owner}\", name: \"${name}\") {
          id
      }
    }
  `;
  }

  createPullRequest(repoId, title) {
    return `
      mutation CreatePullRequest {
          createPullRequest(input: { baseRefName: "${baseRef}", title: "${title}", repositoryId: "${repoId}", headRefName: "${headRefName}" }) {
            pullRequest {
              title
              id
            }
        }
      }`;
  }

  mergePullRequest(prId) {
    return `
    mutation MergePullRequest {
        mergePullRequest(input: { pullRequestId: "${prId}" }) {
        pullRequest {
            title
            id
        }
    }
  }`;
  }
}

const queries = new QueryBuilder();
module.exports = queries;
