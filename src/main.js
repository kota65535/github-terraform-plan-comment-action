const core = require("@actions/core");
const { context } = require("@actions/github");
const parse = require("./parser");
const { getStepLogs, getStepUrl, createPrComment } = require("./github");
const { createComment } = require("./github_comment");
const { logJson } = require("./util");
const { getInputs } = require("./input");

const getPlanStepLogs = async (jobName, context) => {
  const stepLogs = await getStepLogs(jobName, context);
  for (const lines of stepLogs) {
    const parsed = parse(lines, true);
    if (parsed.summary.offset >= 0) {
      return { lines, parsed };
    }
  }
  throw new Error(
    "Terraform Plan output not found. This may be due to the format change of the recent Terraform version",
  );
};

const main = async () => {
  const inputs = getInputs();
  logJson("inputs", inputs);

  const { lines, parsed } = await getPlanStepLogs(inputs.jobName, context);
  logJson(`${lines.length} lines of logs found`, lines);
  logJson("Parsed logs", parsed);

  const planUrl = await getStepUrl(inputs.jobName, inputs.stepName, context, parsed.summary.offset);

  const message = createComment(parsed, inputs.workspace, planUrl);

  await createPrComment(message, inputs.workspace, context);

  core.setOutput("outside", JSON.stringify(parsed.outside));
  core.setOutput("action", JSON.stringify(parsed.action));
  core.setOutput("output", JSON.stringify(parsed.output));
  core.setOutput("warning", JSON.stringify(parsed.warning));
  core.setOutput("summary", JSON.stringify(parsed.summary));
  core.setOutput("should-apply", parsed.shouldApply);
  core.setOutput("should-refresh", parsed.shouldRefresh);
};

module.exports = {
  main,
  getPlanStepLogs,
};
