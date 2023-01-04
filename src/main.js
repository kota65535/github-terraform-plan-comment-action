const core = require("@actions/core");
const { context } = require("@actions/github");
const parse = require("./parser");
const { jsonString } = require("./util");
const { getStepLogs, getPlanStepUrl, initOctokit, createPrComment } = require("./github");
const { createComment } = require("./github_comment");

const main = async () => {
  const jobName = core.getInput("plan-job").trim();
  const stepName = core.getInput("plan-step").trim();
  const workspace = core.getInput("workspace").trim();
  let githubToken = core.getInput("github-token").trim();
  const defaultGithubToken = core.getInput("default-github-token").trim();

  githubToken = githubToken || process.env.GITHUB_TOKEN || defaultGithubToken;
  if (!githubToken) {
    throw new Error("No GitHub token provided");
  }

  initOctokit(githubToken);

  const input = await getStepLogs(jobName, stepName, context);

  const result = parse(input);

  const planUrl = await getPlanStepUrl(jobName, stepName, context, result.summary.offset);

  const message = createComment(result, workspace, planUrl);

  await createPrComment(message, workspace, context);

  core.setOutput("outside", jsonString(result.output));
  core.setOutput("action", jsonString(result.action));
  core.setOutput("output", jsonString(result.output));
  core.setOutput("warning", jsonString(result.warning));
  core.setOutput("summary", jsonString(result.summary));
  core.setOutput("should-apply", result.shouldApply);
};

module.exports = main;
