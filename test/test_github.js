const { initOctokit, getWorkflow, getJob, getContent, getNumActionsOfSteps, getStepLogs } = require("../src/github");
const assert = require("chai").assert;
require("dotenv").config();

describe("github", function () {
  this.timeout(8000);
  before(async function () {
    const token = process.env.GITHUB_TOKEN;
    initOctokit(token);
  });

  it("gets a workflow", async function () {
    const workflow = await getWorkflow({
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      workflow: "Test",
    });
    assert.isNotNull(workflow);
    assert.isNotNull(workflow.name === "Test");
  });

  it("gets a job", async function () {
    const job = await getJob("plan", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      runId: "4625781242",
    });
    assert.isNotNull(job);
    assert.isNotNull(job.name === "plan");
  });

  it("gets a repository file", async function () {
    const file = await getContent(".github/actions/setup-tools/action.yml", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
    });
    assert.isNotNull(file);
    assert.isObject(file);
    assert.isString(file.content);
  });

  it("gets repository files", async function () {
    const files = await getContent(".github/workflows", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      ref: "main",
    });
    assert.isNotNull(files);
    assert.isArray(files);
    files.forEach((f) => assert.isString(f.content));
  });

  it("get numbers of each steps", async function () {
    const numActions = await getNumActionsOfSteps("plan", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      workflow: "Test",
    });
    assert.deepEqual(numActions, [1, 1, 6, 1, 1, 1, 1, 1]);
  });

  // https://github.com/kota65535/github-terraform-plan-comment-action/actions/runs/8275897301/job/22643565191?pr=37#step:6:1
  // terraform plan
  //   shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
  //   env:
  //     AWS_DEFAULT_REGION: ap-northeast-1
  //     AWS_REGION: ap-northeast-1
  //     AWS_ACCESS_KEY_ID: ***
  //     AWS_SECRET_ACCESS_KEY: ***
  //     TERRAFORM_CLI_PATH: /home/runner/work/_temp/0a6088ed-dc65-4ef0-a960-17bde7e0f1ea
  // /home/runner/work/_temp/0a6088ed-dc65-4ef0-a960-17bde7e0f1ea/terraform-bin plan
  // aws_dynamodb_table.test: Refreshing state... [id=github-action-test-dev]
  // aws_s3_bucket.test: Refreshing state... [id=github-action-test-dev]
  //
  // No changes. Your infrastructure matches the configuration.
  //
  // Terraform has compared your real infrastructure against your configuration
  // and found no differences, so no changes are needed.
  // ╷
  // │ Warning: Argument is deprecated
  // │
  // │   with aws_s3_bucket.test,
  // │   on main.tf line 31, in resource "aws_s3_bucket" "test":
  // │   31: resource "aws_s3_bucket" "test" {
  // │
  // │ Use the aws_s3_bucket_versioning resource instead
  // │
  // │ (and 3 more similar warnings elsewhere)
  // ╵
  it("gets a step logs", async function () {
    const lines = await getStepLogs("plan", "Run terraform plan for dev", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      workflow: "Test",
      runId: "8275755185",
    });
    assert.equal(lines.length, 29);
  });

  // https://github.com/kota65535/github-terraform-plan-comment-action/actions/runs/8275928147/job/22643637325#step:6:1
  // ##[debug]Evaluating condition for step: 'Run terraform plan for dev'
  // ##[debug]Evaluating: success()
  // ##[debug]Evaluating success:
  // ##[debug]=> true
  // ##[debug]Result: true
  // ##[debug]Starting: Run terraform plan for dev
  // ##[debug]Loading inputs
  // ##[debug]Loading env
  // Run terraform plan
  //   terraform plan
  //   shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
  //   env:
  //     AWS_DEFAULT_REGION: ap-northeast-1
  //     AWS_REGION: ap-northeast-1
  //     AWS_ACCESS_KEY_ID: ***
  //     AWS_SECRET_ACCESS_KEY: ***
  //     TERRAFORM_CLI_PATH: /home/runner/work/_temp/381d33c7-27a9-4508-86e5-973d5dfaab0f
  // ##[debug]Overwrite 'working-directory' base on job defaults.
  // ##[debug]Overwrite 'shell' base on job defaults.
  // ##[debug]/usr/bin/bash --noprofile --norc -e -o pipefail /home/runner/work/_temp/f2b599b1-4932-4250-911a-a8f52ec36506.sh
  // /home/runner/work/_temp/381d33c7-27a9-4508-86e5-973d5dfaab0f/terraform-bin plan
  // aws_dynamodb_table.test: Refreshing state... [id=github-action-test-dev]
  // aws_s3_bucket.test: Refreshing state... [id=github-action-test-dev]
  //
  // No changes. Your infrastructure matches the configuration.
  //
  // Terraform has compared your real infrastructure against your configuration
  // and found no differences, so no changes are needed.
  // ╷
  // │ Warning: Argument is deprecated
  // │
  // │   with aws_s3_bucket.test,
  // │   on main.tf line 31, in resource "aws_s3_bucket" "test":
  // │   31: resource "aws_s3_bucket" "test" {
  // │
  // │ Use the aws_s3_bucket_versioning resource instead
  // │
  // │ (and 3 more similar warnings elsewhere)
  // ╵
  // ##[debug]Terraform exited with code 0.
  // ##[debug]stdout: aws_dynamodb_table.test: Refreshing state... [id=github-action-test-dev]
  // ##[debug]aws_s3_bucket.test: Refreshing state... [id=github-action-test-dev]
  // ##[debug]
  // ##[debug]No changes. Your infrastructure matches the configuration.
  // ##[debug]
  // ##[debug]Terraform has compared your real infrastructure against your configuration
  // ##[debug]and found no differences, so no changes are needed.
  // ##[debug]╷
  // ##[debug]│ Warning: Argument is deprecated
  // ##[debug]│
  // ##[debug]│   with aws_s3_bucket.test,
  // ##[debug]│   on main.tf line 31, in resource "aws_s3_bucket" "test":
  // ##[debug]│   31: resource "aws_s3_bucket" "test" {
  // ##[debug]│
  // ##[debug]│ Use the aws_s3_bucket_versioning resource instead
  // ##[debug]│
  // ##[debug]│ (and 3 more similar warnings elsewhere)
  // ##[debug]╵
  // ##[debug]
  // ##[debug]stderr:
  // ##[debug]exitcode: 0
  // ##[debug]Set output stdout = aws_dynamodb_table.test: Refreshing state... [id=github-action-test-dev]
  // ##[debug]aws_s3_bucket.test: Refreshing state... [id=github-action-test-dev]
  // ##[debug]
  // ##[debug]No changes. Your infrastructure matches the configuration.
  // ##[debug]
  // ##[debug]Terraform has compared your real infrastructure against your configuration
  // ##[debug]and found no differences, so no changes are needed.
  // ##[debug]╷
  // ##[debug]│ Warning: Argument is deprecated
  // ##[debug]│
  // ##[debug]│   with aws_s3_bucket.test,
  // ##[debug]│   on main.tf line 31, in resource "aws_s3_bucket" "test":
  // ##[debug]│   31: resource "aws_s3_bucket" "test" {
  // ##[debug]│
  // ##[debug]│ Use the aws_s3_bucket_versioning resource instead
  // ##[debug]│
  // ##[debug]│ (and 3 more similar warnings elsewhere)
  // ##[debug]╵
  // ##[debug]
  // ##[debug]Set output stderr =
  // ##[debug]Set output exitcode = 0
  // ##[debug]Finishing: Run terraform plan for dev
  it("gets a step logs when debug enabled", async function () {
    process.env.RUNNER_DEBUG = "1";
    const lines = await getStepLogs("plan", "Run terraform plan for dev", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      workflow: "Test",
      runId: "8275928147",
    });
    assert.equal(lines.length, 84);
  });
});
