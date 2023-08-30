# github-terraform-plan-comment-action

GitHub Action for putting terraform plan result as a PR comment.
- Shows summary of the affected resources
- [Click here](https://github.com/kota65535/github-terraform-plan-comment-action/actions/runs/3836204681/jobs/6530118090#step:8:56)
  link to easily jump to the full plan log

![img.png](img.png)

## Inputs

| Name           | Description                                   | Required | Default                                                 |
|----------------|-----------------------------------------------|----------|---------------------------------------------------------|
| `plan-job`     | Job name where `terraform plan` has been run  | Yes      | N/A                                                     |
| `plan-step`    | Step name where `terraform plan` has been run | Yes      | N/A                                                     |
| `workspace`    | Terraform workspace name                      | No       | N/A                                                     |
| `github-token` | GitHub token                                  | No       | `${{ env.GITHUB_TOKEN }}` or<br/> `${{ github.token }}` | 

## Outputs

| Name             | Description                                                |
|------------------|------------------------------------------------------------|
| `should-apply`   | `true` if `terraform apply` is needed, otherwise `false`   |
| `should-refresh` | `true` if `terraform refresh` is needed, otherwise `false` |

## Usage

Use this action after the job where you run `terraform plan`.

```yaml

  plan:
    runs-on: ubuntu-latest
    steps:
      # ... other steps
      
      - name: Run terraform plan
        run: terraform plan

  after-plan:
    runs-on: ubuntu-latest
    needs:
      - plan
    steps:
      - name: Notify terraform plan result as PR comment
        uses: kota65535/github-terraform-plan-comment-action@v1
        with:
          plan-job: plan
          plan-step: Run terraform plan
```
