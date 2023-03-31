# AI Security Check for Pull Requests

This GitHub Action uses OpenAI's GPT to analyze code in pull requests and identify potential security and privacy vulnerabilities and comment to the pull request with the findings.

## Configuration

To configure this action in your repository, you should set up the following secrets:

### `GH_TOKEN`

Setup this secret with a [GitHub Personal Access Token](https://github.com/settings/tokens) with the `repo` and `write:discussion` scopes enabled. This token is used to fetch pull request details and add comments to the pull request.

### `OPENAI_TOKEN`

Setup this secret with your [OpenAI API Key](https://platform.openai.com/account/api-keys), which is required to make API calls to OpenAI's GPT.

## Usage

Once the action is configured, it will automatically run and analyze the code in each pull request targeting the specified branch(es). If it finds any security or privacy issues, it will add a comment to the pull request with the findings. Otherwise, it will comment that no issues were found.
