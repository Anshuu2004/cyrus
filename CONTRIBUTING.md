# Contributing to cyrus.ai

cyrus.ai is a catalog of open-source programs, company hackathons and agent
skills. It is small, live and maintained by one person, so the process below
exists to protect review time rather than to gatekeep.

Everything here is welcome: bug fixes, data corrections, accessibility work,
performance, copy, and documentation. Two contributions need no permission at
all and are always in scope: opening a new issue, and telling us that a number
on the site is wrong.

**Read the assignment rule before you write any code.**

## Contents

1. [The one rule that matters](#the-one-rule-that-matters)
2. [Why the rule exists](#why-the-rule-exists)
3. [Opening a new issue](#opening-a-new-issue)
4. [Finding an issue to work on](#finding-an-issue-to-work-on)
5. [Claiming an issue](#claiming-an-issue)
6. [Setting up locally](#setting-up-locally)
7. [Branches and commits](#branches-and-commits)
8. [Code standards](#code-standards)
9. [Design constraints](#design-constraints)
10. [Testing and the gate](#testing-and-the-gate)
11. [Opening a pull request](#opening-a-pull-request)
12. [Review and feedback](#review-and-feedback)
13. [Conduct](#conduct)

## The one rule that matters

**Do not create a branch or write code for an issue until a maintainer has
assigned it to you.**

Unassigned pull requests are placed on hold or closed. This is not a judgement
of your work: an unreviewed PR costs the maintainer more time than no PR at
all, and design directions that look good in isolation have been rejected here
more than once. Claiming an issue first takes ten seconds and saves everyone an
afternoon.

## Why the rule exists

- **Duplicate work.** Several people reach for the same issue at the same time,
  and one of them ends up closing their own PR after a week of effort. An
  assignment makes it obvious who has it.
- **Fit.** A change can be technically correct and still be the wrong direction
  for this site. That conversation belongs in the issue, where it costs a
  comment, not in a PR, where it costs a review.
- **Fairness.** Tasks here are limited by review capacity, not by how many can
  be filed. One issue at a time keeps the pool moving for everyone.
- **Safety.** Some issues touch sign-in, sessions or public API responses. Those
  get thought about before code exists.

## Opening a new issue

You do not need permission, an assignment, or a finished idea to open an issue.
If something looks broken, confusing, slow, wrong or missing, file it. Use
[issues/new/choose](https://github.com/adityalenova/cyrus-ai/issues/new/choose):

| Form | Use it for |
| --- | --- |
| Bug report | Something works incorrectly. Steps to reproduce beat adjectives. |
| Enhancement | A new capability, or a sharper version of something that exists. |
| Data correction | A star count, deadline, prize, eligibility line or logo that is wrong. |
| Blank issue | Anything that does not fit the three above. |

A good issue carries evidence: the URL, the value you saw, the primary source
that disagrees with it, or the command output. "The program page is stale" is
hard to act on. "The Outreachy page shows a deadline from the 2025 round; the
2026 round closed on 3 April per this link" is a fix.

Filing an issue does not commit you to building it. If you want to work on it,
say so in the issue and wait for an assignment like anyone else. If you would
rather not, that is still a useful issue.

Do not open a public issue for a security problem.
[SECURITY.md](SECURITY.md) covers the private advisory channel.

## Finding an issue to work on

Browse the [open issues](https://github.com/adityalenova/cyrus-ai/issues) and
filter by label:

| Label | Meaning |
| --- | --- |
| [`good first issue`](https://github.com/adityalenova/cyrus-ai/labels/good%20first%20issue) | Scoped, low risk, no design decisions required |
| [`help wanted`](https://github.com/adityalenova/cyrus-ai/labels/help%20wanted) | Extra attention needed, size varies |
| [`bug`](https://github.com/adityalenova/cyrus-ai/labels/bug) | Something is broken |
| [`enhancement`](https://github.com/adityalenova/cyrus-ai/labels/enhancement) | New capability for users |
| [`seo`](https://github.com/adityalenova/cyrus-ai/labels/seo) | Metadata, structured data, discoverability |
| [`performance`](https://github.com/adityalenova/cyrus-ai/labels/performance) | Page weight and load speed |
| [`accessibility`](https://github.com/adityalenova/cyrus-ai/labels/accessibility) | Keyboard and screen-reader correctness |
| [`data`](https://github.com/adityalenova/cyrus-ai/labels/data) | A catalog value that disagrees with its primary source |
| [`documentation`](https://github.com/adityalenova/cyrus-ai/labels/documentation) | Guide and reference text |
| [`dx`](https://github.com/adityalenova/cyrus-ai/labels/dx) | Developer experience and repo hygiene |
| [`needs-decision`](https://github.com/adityalenova/cyrus-ai/labels/needs-decision) | Blocked on the maintainer; comment rather than build |

Data corrections are the most useful contribution of all, and most of them can
be checked against a primary source in a few minutes.

Skip anything already assigned to another person. If it has been quiet there
for a week, leave a comment and a maintainer will reassign it if the owner has
moved on.

## Claiming an issue

1. Confirm the issue is unassigned and read the whole description, including
   any out-of-scope note.
2. Comment once with your plan. Four sentences is enough:

   ```text
   I would like to take this.
   Plan: change <thing> in <file>, add a test for <behaviour>, update <consumer>.
   I will run npm run check and npm test before opening the PR.
   One question: <the part you are unsure about>.
   ```

3. Wait for the assignment. A `/assign` comment works once you have interacted
   with the issue. A maintainer either assigns it to you or explains why it is
   not a good fit yet.

Asking the question in step 2 is not weakness. A wrong assumption about scope
costs a few minutes of reading; a wrong assumption about direction costs a
rejected PR.

### Time windows

- Once assigned, you have **48 hours** to open a pull request. A draft counts.
- Need longer? Comment before the window closes and it is extended to
  **72 hours**, or to whatever the work genuinely needs if you say so.
- Silence past the window releases the issue back to the pool. Nothing is lost
  and no one is penalised; partial work is still welcome as a draft PR once you
  re-claim.
- **One issue at a time.** Finish or hand back before claiming the next.

## Setting up locally

Node 20.9 or newer; CI runs on 20.x and 22.x. Fork the repository first if you
plan to open a pull request, then:

```bash
git clone https://github.com/<your-username>/cyrus-ai.git
cd cyrus-ai
npm ci
cp .env.example .env.local
npm run dev        # http://localhost:5330
```

Add the upstream remote so you can stay current while your branch is open:

```bash
git remote add upstream https://github.com/adityalenova/cyrus-ai.git
git fetch upstream
```

The site runs with an empty `.env.local`. Most pages, and every read-only
issue, need no configuration at all. Fill in only what your issue touches:

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Saved items and real accounts. Without it the app falls back to browser-only state |
| `SESSION_SECRET` | Any server-side sign-in session |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google sign-in |
| `RESEND_API_KEY`, `EMAIL_FROM` | Email codes. `EMAIL_FROM` has to be a domain verified in Resend |
| `NEXT_PUBLIC_GITHUB_EXCHANGE_URL` | Only when running the local OAuth relay |

Optional local commands, when your issue needs them:

```bash
npm run gh-relay   # GitHub OAuth token exchange relay on :8787
npm run refresh    # refresh hackathon and program datasets
```

Never commit `.env`, `.env.local` or `.github-secret`. All three are ignored,
and secrets do not belong in an issue, a PR or a comment either. Describe the
symptom and name the variable instead of pasting a value.

## Branches and commits

Branch off the latest `main`, one branch per issue:

```bash
git checkout main
git pull upstream main
git checkout -b <type>/<short-description>
```

Use these types: `fix`, `feat`, `docs`, `test`, `perf`, `refactor`, `chore`.
Name the change, not the person or the date.

```text
fix/email-signin-rate-limits
feat/program-og-cards
docs/contributing-workflow
perf/font-loading
```

Commit messages are imperative and say what the commit does. A Conventional
Commit prefix is welcome but not required. Keep the body to the reason, since
the diff already shows the mechanism.

```bash
git commit -m "fix(auth): cap verification sends per address and per IP"
git commit -m "docs: add the data correction issue form"
```

Do not add `Co-Authored-By` trailers for tools or assistants. Your name on the
commit is the point.

## Code standards

The stack is Next.js 16 App Router, React 19, TypeScript in strict mode,
Tailwind v4 tokens, and Vitest.

- TypeScript is strict and `noUnusedLocals` is on, so a leftover import fails
  the build. No `any`; type props and return values.
- Server-only code stays in `src/lib/server` or inside a route handler. Never
  import a module that reads secrets into a client component.
- Add or update a Vitest test whenever you change behaviour, not only when it is
  convenient. Vitest runs without globals, so tests import `describe`, `it` and
  `expect` from `vitest` themselves.
- Data comes from a primary source. Record the source and the fetch date next to
  any number you add.
- Reuse the card and panel classes in `src/app/globals.css` (`.card-title`,
  `.card-desc`, `.panel-h`) instead of ad-hoc font combinations.

Accessibility is part of the work, not a pass at the end:

- Every interactive element reachable by keyboard, with a visible focus state.
- Icon-only controls need an `aria-label`; images need real alt text.
- Contrast holds in both the light and dark themes.
- Anything that moves respects `prefers-reduced-motion`.
- New page types get headings in order and structured data where the issue asks
  for it.

## Design constraints

The visual language is settled: a warm coffee-and-honey system, Plus Jakarta
Sans, cream paper surfaces and terracotta accents. Several palette and hero
directions have been explored and reverted, so please treat these as fixed:

- **No new colour palettes or theme experiments.** Colour changes need a
  maintainer decision, not a PR.
- **The hero stays calm.** No parallax, no heavy animation, no star fields.
  Motion is functional, never decorative, and everything must respect
  `prefers-reduced-motion`.
- **No emoji in the interface.** Use the existing inline SVG icons.
- **No arrows in copy.** Use `›` or `✦` where a marker is genuinely needed.
- **Hyphens, never em-dashes.**
- Page intros are one or two short, plain sentences. Do not stuff counts into
  button labels.

If your change touches visuals, attach before and after screenshots to the PR,
in both light and dark.

## Testing and the gate

The whole gate passes locally before a PR opens. CI runs the same checks on
every pull request, and a red CI blocks the merge.

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest run
npm run build       # next build
npm run check       # typecheck and build together
```

Playwright covers full page flows. It is not part of the default gate; run it
when your change affects routing or sign-in:

```bash
npm run test:e2e
```

If a command fails, fix it rather than explaining it. If it fails for a reason
that has nothing to do with your change, say so on the issue with the output.

## Opening a pull request

Push to your fork and open a pull request against `main` in this repository at
[github.com/adityalenova/cyrus-ai/compare](https://github.com/adityalenova/cyrus-ai/compare).
The template asks for:

- `Closes #<number>` for the issue assigned to you. Without it the work has no
  home and gets put on hold.
- What changed and why, in plain sentences. Design decisions belong here.
- How to check it locally, when that is not obvious from the diff.
- The gate checkboxes, ticked only after you ran them.

One issue per PR. An unrelated cleanup you found on the way is a good issue, not
the second half of this PR. No build output gets committed: `.next/` and
`.shots/` are not source.

Open the PR as a **draft** if you want feedback before finishing, if you need a
CI run against the branch, or if the 48-hour window is about to close and you
want it extended. Drafts are reviewed once they say they are ready.

## Review and feedback

A maintainer reviews when time allows and will say so on the PR. Expect
questions rather than rejections.

- Claims get checked. If the description says the suite passes, run it after
  pulling the latest `main`, so the number you quote matches the branch being
  merged.
- Change requests are routine and are not a verdict on you. Push commits to the
  same branch instead of closing the PR; the review updates itself.
- Please avoid pinging for a review inside 24 hours. One maintainer, one time
  zone, replies take a little while.
- Once approved, the maintainer merges with a squash commit, so keep the branch
  readable and do not tidy history yourself. Rebase onto `main` if your branch
  falls behind.

Merging to `main` deploys to production automatically, so anything that changes
a route, an API response or the build gets a careful look before it lands.
Merged pull requests and the issues they close count toward the contributor
record for enrollment programs.

## Conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
Found a problem with how the repo is run? [SECURITY.md](SECURITY.md) covers
vulnerabilities; anything else can go to the maintainer through GitHub.
