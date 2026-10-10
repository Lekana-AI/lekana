# Monorepo history

Lekana was developed in eight repositories before October 2026. They were combined into this repository with `git filter-repo --to-subdirectory-filter` followed by `git merge --allow-unrelated-histories`. As a result, every original commit (author, date, message) is still here, with its files moved into the new directory.

| Original repository | New path | Commits imported |
|---------------------|----------|-----------------:|
| `notlasandu/LekanaLanding` | `apps/web` | 109 |
| `Lekana-AI/lekana-ai-workflow-builder` | `services/workflow-builder` | 55 |
| `Lekana-AI/lekana-ai-runtime` | `services/runtime` | 49 |
| `Lekana-AI/lekana-classification` | `services/classification` | 14 |
| `Lekana-AI/lekana-ai-db-export` | `services/db-export` | 10 |
| `Lekana-AI/lekana-ai-ocr` | `services/ocr` | 8 |
| `Lekana-AI/lekana-ai-upload` | `services/upload` | 7 |
| `Lekana-AI/lekana-ai-conditional-router` | `services/conditional-router` | 3 |

## Finding old work

```bash
git log --oneline -- services/runtime            # one service's history
git log --follow -p -- services/ocr/server.js    # one file, across the move
git blame services/upload/server.js              # blame works as before
```

The import is visible as eight `Import <service> history into <path>` merge commits near the root of the history.

## What changed during the import

- **Commit SHAs are new.** Rewriting paths changes every hash, so links to old commits or PR numbers (for example "Merge pull request #19") refer to the original repositories.
- **Only `main` was imported.** At import time a few `dev` branches had commits that were not on `main` yet: ocr, classification, conditional-router and db-export. Port them over as a patch:
  ```bash
  git -C ../lekana-ai-ocr format-patch main..origin/dev --stdout > ocr-dev.patch
  git am --directory=services/ocr ocr-dev.patch
  ```
- **History hygiene.** Some content was redacted throughout history before publishing:
  - an expired Clerk development session token in a Postman collection
  - the GCP project numbers in Cloud Run service URLs, replaced with `PROJECT_NUMBER`
  - the development Clerk instance domain, replaced with `your-app.clerk.accounts.dev`
  - a committed `node_modules/` directory in db-export, removed from every commit

The original repositories should be archived (read-only) and should **not** be made public, because their history still contains the unredacted values.
