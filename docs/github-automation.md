# GitHub automation

What runs automatically on this repository, when it runs, and what to do when something goes red.
Everything lives in the `.github/` folder:

```
.github/
├── dependabot.yml                    Weekly package-update pull requests
└── workflows/
    ├── nextjs-checks.yml             Lint, type-check and build every pull request
    ├── discord-pr.yml                Post pull request activity to Discord
    └── discord-checks-failed.yml     Post failed checks to Discord
```

| File | Runs when | What you see |
|---|---|---|
| `nextjs-checks.yml` | Every push to a pull request | ✅ or ❌ at the bottom of the pull request |
| `discord-pr.yml` | A pull request is opened, reopened, marked ready, gets a review request, or is closed/merged | A blue message in Discord |
| `discord-checks-failed.yml` | After `nextjs-checks` finishes **with a failure** | A red message in Discord |
| `dependabot.yml` | Once a week, on GitHub's schedule | Pull requests from `dependabot[bot]` |

None of these deploy the site, push code, or merge anything.

---

## 1. Next.js checks (`workflows/nextjs-checks.yml`)

Catches broken code before it is merged.

### When it runs

On a pull request when it is:

- **opened**
- **reopened**
- **updated with new commits** (`synchronize`)
- **marked ready for review** (from draft)

If you push twice in a row, the older run is cancelled and only the newest one finishes.

### What it does

GitHub starts a fresh Ubuntu machine and runs, in order:

| Step | Command | Fails when |
|---|---|---|
| Check out the code | `actions/checkout` | — |
| Set up Node.js 24 | `actions/setup-node` (with npm cache) | — |
| Install dependencies | `npm ci` | `package-lock.json` is out of sync with `package.json` |
| Lint | `npm run lint` (ESLint 9, `eslint.config.mjs`) | an ESLint **error**, e.g. a broken React hook rule |
| Type-check | `npm run typecheck` | a TypeScript error anywhere in the project |
| Build | `npm run build` | the production build fails |

If a step fails, the steps after it are skipped and the check turns ❌.

**Why `typecheck` runs `next typegen` first:** some files use types that Next.js generates, such as
`LayoutProps<"/">` in `src/app/layout.tsx`. They normally live in `.next/`, which a fresh CI machine does not
have. `next typegen` creates them without a full build, then `tsc --noEmit` checks the code without writing files.

### Safety

- `permissions: contents: read` — it can read the code, nothing else.
- No secrets are used, so it is safe to run on pull requests from forks.
- `persist-credentials: false` — the checked-out code cannot reuse GitHub's token.
- 15-minute timeout.
- The build needs no environment variables. If you add one later, document it here and add it as a
  repository **variable** (not a secret) only if the build truly needs it.

### Run the same checks on your computer

```bash
npm ci               # or npm install
npm run lint
npm run typecheck
npm run build        # stop `npm run dev` first: both use the .next folder
```

If these pass locally, the pull request check should pass too.

### When it fails

1. On the pull request, click **Details** next to the failed check.
2. Open the red step to read the error. It names the file and line.
3. Fix it, commit and push to the same branch. The check runs again automatically.

Common causes:

| Failed step | Usual cause | Fix |
|---|---|---|
| Install dependencies | You changed `package.json` but did not commit `package-lock.json` | Run `npm install`, commit both files |
| Lint | An ESLint rule | Run `npm run lint` and fix what it lists. Don't disable a rule just to pass |
| Type-check | A wrong prop, missing field or bad import | Run `npm run typecheck` and fix the listed lines |
| Build | Something only the production build catches (e.g. a server/client component mistake) | Run `npm run build` locally (with the dev server stopped) |

### Blocking merges on a failure (optional)

In **Settings → Branches → Add branch protection rule** for `main`, turn on **Require status checks to pass
before merging** and select **Lint, type-check and build**. The check only appears in that list after it has run
once.

---

## 2. Discord: pull request activity (`workflows/discord-pr.yml`)

Keeps the team informed about pull requests.

### When it posts

When a pull request is **opened**, **reopened**, **marked ready for review**, **gets a review request**, or is
**closed** (it says *merged* or *closed*). It posts the title, link, author and status.

### What it skips

Pull requests opened by **Dependabot**. Dependabot's runs can't read repository secrets (the webhook would be
empty and the run would fail), and weekly update pull requests would be noise. Because the check is on who
**opened** the pull request, closing or merging a Dependabot pull request is not posted either.

### Setup

Needs the repository secret **`DISCORD_WEBHOOK_URL`** (Settings → Secrets and variables → Actions), a webhook
from the Discord channel's settings (Integrations → Webhooks).

---

## 3. Discord: failed checks (`workflows/discord-checks-failed.yml`)

Tells the team when a pull request's checks fail.

### When it posts

After **Next.js checks** finishes, and only if it **failed** on a pull request. Passing runs and cancelled runs
(an older run replaced by a newer push) post nothing. Dependabot's runs are skipped for the same reason as above.

The message looks like:

```
❌ Checks failed on PR #43: feat: barangay map
Repository: kai-dev00/betterplaridel
Author: teammate
Branch: feat/barangay-map
Lint, type-check or build failed. Open the run to see which step.
```

The title links to the failed run. Pull requests from forks have no PR number in the event, so their message
shows the title and branch only.

### Why it is a separate workflow

`nextjs-checks.yml` runs the pull request's own code, so it deliberately has no secrets. This workflow uses the
`workflow_run` trigger instead: it runs in this repository's context after the checks finish, can read
`DISCORD_WEBHOOK_URL`, and **never checks out or runs the pull request's code**. It has no repository permissions
(`permissions: {}`).

### Good to know

- GitHub only runs `workflow_run` workflows that are on the **default branch** (`main`). Changes to this file take
  effect after they are merged.
- If you rename the checks workflow (`name: Next.js checks`), update the name under `workflow_run.workflows` here
  too, or this workflow stops running.

---

## 4. Dependabot (`dependabot.yml`)

Keeps npm packages up to date without anyone checking by hand.

### When it runs

Dependabot runs on **GitHub's servers on its own weekly schedule** (Mondays by default). Your pull requests,
pushes and merges do **not** start it. It also runs once shortly after `dependabot.yml` changes on `main`, and you
can start it by hand from **Insights → Dependency graph → Dependabot → Check for updates**.

### What it does

1. Reads `package.json` and `package-lock.json` on `main`.
2. Compares every package with the latest version on npm.
3. Opens pull requests that update **only** `package.json` and `package-lock.json`:
   - **minor and patch** updates (e.g. `1.61.0 → 1.61.3`, `1.170 → 1.171`) are bundled into **one** pull request,
     "Bump the minor-and-patch group with N updates";
   - **major** updates (e.g. Next `16 → 17`) get **their own** pull request, because they can break things.
4. Labels them `dependencies`, and keeps at most **5** open at a time.

Its pull requests run **Next.js checks** like any other, so a package update that breaks the build shows ❌
before you merge it.

### What you do

Review, then **merge** or **close**. Dependabot never merges by itself. If you close one, it won't reopen that
same version. It keeps its open pull requests up to date with `main` by itself; comment `@dependabot rebase` on
one if it gets stuck.

### What it does not do

- It does not warn about **deprecated** packages. Watch for `npm warn deprecated …` when you run `npm install`.
- **Security alerts** are a separate feature (Settings → Code security). They appear under **Security →
  Dependabot alerts** and in GitHub's own notifications, not in Discord.

---

## Changing these files

- **Workflows:** test on a branch by opening a pull request (except `discord-checks-failed.yml`, which only runs
  from `main`). Keep `permissions` as small as possible and never give a workflow that runs pull request code
  access to secrets.
- **Dependabot:** changes apply after they are merged into `main`.
- Update this document in the same pull request.
