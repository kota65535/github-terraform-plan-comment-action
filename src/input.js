const core = require("@actions/core");
const { initOctokit } = require("./github");

const getInputs = () => {
  const jobName = core.getInput("plan-job", { required: true });
  const stepName = core.getInput("plan-step", { required: true });
  const index = Number(core.getInput("plan-index"));
  const workspace = core.getInput("workspace");
  let githubToken = core.getInput("github-token");
  const defaultGithubToken = core.getInput("default-github-token");

  githubToken = githubToken || process.env.GITHUB_TOKEN || defaultGithubToken;
  if (!githubToken) {
    throw new Error("No GitHub token provided");
  }

  initOctokit(githubToken);

  return {
    jobName,
    stepName,
    index,
    workspace,
    githubToken,
  };
};

module.exports = {
  getInputs,
};
