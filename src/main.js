const core = require("@actions/core");
const { context } = require("@actions/github");
const parse = require("./parser");
const { getStepLogs, getPlanStepUrl, createPrComment } = require("./github");
const { createComment } = require("./github_comment");
const { logJson } = require("./util");
const { getInputs } = require("./input");

const main = async () => {
  const inputs = getInputs();
  logJson("inputs", inputs);

  const lines = await getStepLogs(inputs.jobName, inputs.stepName, context);
  core.info(`Found ${lines.length} lines of logs`);

  const result = parse(lines);
  logJson("Parsed logs", result);

  const planUrl = await getPlanStepUrl(inputs.jobName, inputs.stepName, context, result.summary.offset);

  const message = createComment(result, inputs.workspace, planUrl);

  await createPrComment(message, inputs.workspace, context);

  core.setOutput("outside", JSON.stringify(result.outside));
  core.setOutput("action", JSON.stringify(result.action));
  core.setOutput("output", JSON.stringify(result.output));
  core.setOutput("warning", JSON.stringify(result.warning));
  core.setOutput("summary", JSON.stringify(result.summary));
  core.setOutput("should-apply", result.shouldApply);
};

module.exports = main;
