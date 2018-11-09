export const getRepository = (owner, name) => {
  return `
          query {
            repository(owner: "${owner}", name: "${name}") {
                id
            }
          }
        `;
};

export const createPullRequest = (repoId, title) => {
  return `
    mutation CreatePullRequest {
        createPullRequest(input: { baseRefName: "develop", title: "${title}", repositoryId: "${repoId}", headRefName: "dev-matthew" }) {
          pullRequest {
            title
            id
          }
      }
    }`;
};

export const mergePullRequest = prId => {
  return `
    mutation MergePullRequest {
        mergePullRequest(input: { pullRequestId: "${prId}" }) {
        pullRequest {
            title
            id
        }
    }
  }`;
};

export default { getRepository, createPullRequest, mergePullRequest };
