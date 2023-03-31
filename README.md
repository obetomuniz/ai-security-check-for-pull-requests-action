# AI Security Check for Pull Requests

This GitHub Action uses OpenAI's GPT to analyze code in pull requests and identify potential security and privacy vulnerabilities and comment to the pull request with the findings.

## Configuration

To configure this action in your repository, you should set up the following secrets:

### `GH_TOKEN`

Setup this secret with a [GitHub Personal Access Token](https://github.com/settings/tokens) with the `repo` and `write:discussion` scopes enabled. This token is used to fetch pull request details and add comments to the pull request.

### `OPENAI_TOKEN`

Setup this secret with your [OpenAI API Key](https://platform.openai.com/account/api-keys), which is required to make API calls to OpenAI's GPT.

### Workflow File (e.g. `./github/workflows/ai-security-check-for-pr.yml`)

Create a new workflow file in your repository and paste the following content:

```yaml
name: AI Security Check for Pull Requests

on:
  pull_request:
    branches:
      - main

jobs:
  ai_security_check_for_pull_requests:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 16

      - name: Install dependencies
        run: npm ci

      - name: Finding security and privacy code vulnerabilities
        id: ai_security_check
        uses: obetomuniz/ai-security-check-for-pull-requests-action@v1.0.0
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          GH_REPOSITORY: ${{ github.repository }}
          GH_EVENT_PULL_REQUEST_NUMBER: ${{ github.event.number }}
          OPENAI_TOKEN: ${{ secrets.OPENAI_TOKEN }}

      - name: Comment on pull request
        uses: actions/github-script@v6
        env:
          PR_COMMENT: ${{ steps.ai_security_check.outputs.pr_comment }}
        with:
          github-token: ${{ secrets.GH_TOKEN }}
          script: |
            const prComment = process.env.PR_COMMENT || "No security or privacy issues found.";
            const { data } = await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: prComment
            });
```

Replace `main` with your default branch if necessary.

## Usage

Once the action is configured, it will automatically run and analyze the code in each pull request targeting the specified branch(es). If it finds any security or privacy issues, it will add a comment to the pull request with the findings. Otherwise, it will comment that no issues were found.
