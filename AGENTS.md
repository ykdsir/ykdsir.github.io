# Working on this public website

This is a public GitHub repository and public personal website. Every commit, branch,
pull request, issue, source file, asset and generated page may be read by anyone.

## Editorial boundaries

- Public identity: `ykdsir`. Do not add legal names, private contact details or portraits.
- Use general interests to select topics. Never copy raw private conversations, memory
  exports, internal files or personally identifying anecdotes into this repository.
- Do not publish finances, health, family details, employment disputes, employer/internal
  information, locations, itineraries, account identifiers or another person's details.
- Removing a name is insufficient if the remaining context identifies a person.
- Do not put sensitive drafts in ignored folders, draft branches, PR descriptions,
  commit messages, comments, image metadata, feeds, search data or source maps.
- Claims about completed projects need a working artifact or verified public source.
  Planned projects are ideas, not achievements. Do not convert a question into an
  attributed opinion or invent firsthand experience.
- AI-assisted editorial notes are identified as such. Preserve original dates and
  provenance; do not give old work a new publication date.
- When meaning or disclosure is uncertain, keep the proposal in private conversation.
  A public draft PR is a review mechanism, not a privacy boundary.

## Implementation

- Hosting stays at `https://ykdsir.github.io/`; preserve existing article paths.
- Runtime is static HTML/CSS/JS. Build uses Node.js standard library only (Node >=20).
- Edit `_content/catalog.json`, `_content/posts/*.html`, exploration JSON and
  `scripts/build.mjs`; do not hand-edit generated HTML.
- `npm run build` regenerates committed root pages and ignored `dist/` preview output.
- `npm run check` verifies links and baseline content rules. It does not prove absence
  of all privacy risks; inspect the complete diff contextually before a public write.
- Do not introduce analytics, remote fonts, comments, trackers, third-party embedded
  media, visitor data collection or credentials without a specific user request.
- Keep UI accessible, responsive and useful without JavaScript. Theme preference is
  the only localStorage data; browsing and search are never sent to a backend.

## Updates

- Prepare focused changes on a branch. Do not auto-merge or change the publishing
  source as part of unattended editorial work.
- The initial relaunch is a proposal for owner review, not a production deployment.
- For later routine maintenance, respect the owner's current explicit authorization.
- Do not attempt to import every conversation. Use only available relevant context,
  and state source gaps privately rather than inventing recent activities.
- If there is no substantive update, make no commit.
- Read `docs/editorial-workflow.md` before recurring editorial work.
