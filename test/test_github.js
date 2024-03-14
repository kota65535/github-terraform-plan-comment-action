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

  // https://github.com/kota65535/github-terraform-plan-comment-action/actions/runs/5433757045/jobs/9881689538
  it("gets a step logs when debug enabled", async function () {
    process.env.RUNNER_DEBUG = "1";
    const lines = await getStepLogs("plan", "Run terraform plan for dev", {
      repo: {
        owner: "kota65535",
        repo: "github-terraform-plan-comment-action",
      },
      workflow: "Test",
      runId: "5433882732",
    });
    assert.equal(lines.length, 84);
  });
});
