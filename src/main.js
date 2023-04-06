const core = require("@actions/core");
const { context } = require("@actions/github");
const parse = require("./parser");
const { getStepLogs, getPlanStepUrl, initOctokit, createPrComment } = require("./github");
const { createComment } = require("./github_comment");

const main = async () => {
  const jobName = core.getInput("plan-job", { required: true });
  const stepName = core.getInput("plan-step", { required: true });
  const workspace = core.getInput("workspace");
  let githubToken = core.getInput("github-token");
  const defaultGithubToken = core.getInput("default-github-token");

  githubToken = githubToken || process.env.GITHUB_TOKEN || defaultGithubToken;
  if (!githubToken) {
    throw new Error("No GitHub token provided");
  }

  initOctokit(githubToken);

  const lines = await getStepLogs(jobName, stepName, context);
  core.info(`Found ${lines.length} lines of logs`);

  const result = parse(lines);
  core.info(JSON.stringify(result));

  const planUrl = await getPlanStepUrl(jobName, stepName, context, result.summary.offset);

  const message = createComment(result, workspace, planUrl);

  await createPrComment(message, workspace, context);

  core.setOutput("outside", JSON.stringify(result.outside));
  core.setOutput("action", JSON.stringify(result.action));
  core.setOutput("output", JSON.stringify(result.output));
  core.setOutput("warning", JSON.stringify(result.warning));
  core.setOutput("summary", JSON.stringify(result.summary));
  core.setOutput("should-apply", result.shouldApply);
};

module.exports = main;
