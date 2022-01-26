# Contributing

> This guide is for internal Snyk contributors with write access to this repository. If you are an external contributor, before working on any contributions, please contact support to discuss the issue or feature request with us.

## Prerequisites

You will need the following software installed:

- Git 2
- Node.js 16
  - Use whichever version is in [`.nvmrc`](./.nvmrc).
- npm 8
  - Use [whichever version comes bundled](https://nodejs.org/en/download/releases/) with the Node.js version above.

## Setting up

Open a terminal and clone this repository with git.

```sh
git clone git@github.com/snyk/snyk.git
cd snyk
```

You will now be on our `master` branch. You should never commit to this branch, but you should keep it up-to-date to ensure you have the latest changes.

```sh
git fetch
git pull --ff-only
```

To make changes, first create a branch. Make sure to give it a descriptive name so you can find it later.

```sh
git checkout -b docs/contributing
```

Make sure you have the correct software versions installed. See: [Prerequisites](#prerequisites).

```sh
node -v
npm -v
```

If you encounter vague errors without a clear solution at any point, try cleaning up the repo or cloning a new copy.

```
npm run clean
```

## Building

Install dependencies.

```sh
npm ci
```

Build the project.

```sh
npm run build
```

Ensure the build is working. The version should be `1.0.0-monorepo`.

```sh
npx snyk --version
```

For faster rebuilds, you can watch for changes. Watch will keep running so you'll want to run this in a separate terminal.

```
npm run watch
```

## Running tests

You can run tests using standard Jest commands. See: [Jest CLI docs](https://jestjs.io/docs/cli).

```
npx jest <path>
```

If you're working on a package, you can run package-specific tests using Jest Projects.

```
npx jest --selectedProjects @snyk/protect <path>
```

We provide debugger configuration for VS Code. Open "Run and Debug" and choose "Jest Current File".

Typically, you should not run the full test suite on your workstation. Snyk CLI includes a variety of features which require various tools and configuration to be installed. Our PR pipeline will take care of most of that. Locally, you should focus on the tests related to your changes.

## Writing tests

All tests end in `.spec.ts` and use Jest. There are two types of tests:

- `./test/jest/unit` - Unit tests.
- `./test/jest/acceptance` - Acceptance tests.

If you're targeting source code, then you're writing a unit test. If it's a distributable, you're writing an acceptance test.

Each test must start from a clean slate to avoid pollution. Do not share state between tests and always perform any setup within the test itself or in specific before/after hooks.

To avoid hard wiring tests to your specific implementation, try writing the test first.

### Unit tests

Unit tests enforce the correctness of our modules.

Ensure the path to the test mirrors the path to the module.

Unit tests must be fast. They should not touch anything outside the code; such as filesystems, processes and networks.

Avoid using mocks as these can go out of sync and be difficult to maintain, prefer interfaces instead.

If you're mostly testing glue code (functions calling other functions), consider writing an acceptance test instead. Otherwise, your test will likely be gluing the glue code and testing a bunch of mocks.

### Acceptance tests

Acceptance tests enforce the correctness of our distributions and are written from the perspective of the customer.

Snyk CLI's acceptance tests execute a specific command as a standalone process, then assert on `stdout`, `stdin` and the exit code. As an example, see: [`oauth-token.spec.ts`](test/jest/acceptance/oauth-token.spec.ts).

Your tests should never call remote endpoints. Otherwise, our release pipelines will be tied to those services being available. To avoid this, we can assume external services are kept compatible. If anything breaks, we can rely on production monitoring to alert us. Use [fake-server](./test/acceptance/fake-server.ts) to mock any Snyk API calls.

Place fixtures in the `./test/fixtures` directory. Keep them minimal to reduce maintainance. Use [`createProject`](./test/jest/util/createProject.ts) to provide isolated working directories for your tests.

## Code ownership

For current ownership assignments, see: [CODEOWNERS](./.github/CODEOWNERS).

To avoid mixing ownership into a single file, move team-specific logic into
separate modules. Design with ownership in mind. By doing this, you'll reduce
blockers and save time.

## Adding dependencies

When adding and upgrading dependencies, ensure the `package-lock.json` has minimal updates. To do this you can:

```
npm ci
npm install <your dependency>
```

It's best to not add external dependencies if it can be avoided. All dependency changes are reviewed by @hammer.

## Code formatting

To ensure your changes follow formatting guidelines you can run the linter.

```
npm run lint
```

To fix various issues automatically you can run specific commands or use the ESLint and Prettier plugins for your IDE.

```
npm run format
```

You will need to fix any remaining issues manually.

## Creating commits

Each commit must provide some benefit on its own and not break the pipeline. For larger changes, break down each step into multiple commits so that it's easy to review in PRs and git history.

Your commits must follow this specific structure:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

For more details, see: [Angular commit message format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits).

Make sure to explain the reasoning behind your changes in the body.

Your changes cannot contain "BREAKING CHANGES" as we cannot break customer pipelines. If needed, bring in the relevant stakeholders to discuss potential strategies to avoid such a change.

If you are pairing, assign co-authors in your footer.

```
Co-authored-by: name <name@example.com>
```

Once you have committed your changes, review them locally, then push them to remote.

```
git push
```

Do not hold onto your changes for too long. Commit and push frequently and create a pull request as soon as possible for visibility.

## Creating pull requests

You can now [create a Draft PR](https://github.com/snyk/snyk/compare) on GitHub. Make sure to switch to a "Draft Pull Request". Draft PRs allow you to ensure your PR checks pass before asking for a review.

To keep things simple, try to use the last commit as the PR's title, and summarise the changes in your body. Feel free to use the PR for notes and progress while it's in draft.

If your PR becomes too large, consider breaking it up into multiple PRs so that it's easier to explain, review and integrate.

Your PR checks should already be running. The main pipeline is [`test_and_release`](https://app.circleci.com/pipelines/github/snyk/snyk?filter=mine). This is where your changes are built and fully tested.

If any checks fail, fix them and force push your changes again. Make sure to review and tidy up your branch so that it remains easy to follow.

Some tests may "flake". Meaning they failed due to some external factor. While we try to fix these tests on sight, you may not be able to. You can use CircleCI's "Re-run from Failure" option to re-run just that job without needing to re-run the entire pipeline.

Once your checks have passed, you can publish your Draft PR. Ask each codeowner for a review using relevant channels on Slack. Iterate on feedback until you're happy. Then merge.

## Creating a release

If a merged branch contains a commit using `feat`, `fix` or `revert`, it will trigger a new release. See the [release pipeline](https://app.circleci.com/pipelines/github/snyk/snyk?branch=master&filter=all) for updates on your merges. If your release fails, notify @hammer.

All releases are minor version bumps. This means your changes must always be backwards compatible and not break existing customer pipelines.

For the latest releases, see: [Releases](https://github.com/snyk/snyk/releases).

---
