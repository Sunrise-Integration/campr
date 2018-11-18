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

  createPullRequest(headRef, baseRef, repoId, title) {
    return `
      mutation CreatePullRequest {
          createPullRequest(input: { baseRefName: "${baseRef}", title: "${title}", repositoryId: "${repoId}", headRefName: "${headRef}" }) {
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
