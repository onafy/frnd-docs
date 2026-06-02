# frnd-docs — frndOS Help Center

Self-service product guidance for all frndOS end users. Built with [Docusaurus](https://docusaurus.io/) + [TinaCMS](https://tina.io/).

- **Guides** — bilingual (ID / EN) help articles organized by frndOS module
- **What's New** — changelog blog for product updates
- **Search** — local search across all guides and changelog entries
- **TinaCMS** — browser-based visual editor for non-technical content authors

## Local development

Prerequisites: Node 22+, npm.

```bash
npm install
npm run build-local       # one-shot production build with TinaCMS local mode
npm run dev:local         # dev server (Docusaurus + TinaCMS) with local content
```

Open <http://localhost:3000> for the site, <http://localhost:3000/admin> for the TinaCMS editor.

> If you hit a Node OOM during Tina build, the npm scripts already set `NODE_OPTIONS=--max-old-space-size=8192`. Increase further if needed.

## Content structure

```
docs/                       # Help articles (Markdown / MDX)
├── intro.mdx               # Help Center landing
├── getting-started/
├── brand-settings/
├── creative-brief/
├── studio/
├── insights/
├── askfrnd/
└── account-settings/

blog/                       # Changelog / What's New
├── authors.yml
└── YYYY-MM-DD-<slug>.mdx

config/                     # JSON config managed by TinaCMS
├── docusaurus/index.json   # Site title, navbar, footer, logo
├── sidebar/index.json      # Docs sidebar structure
└── homepage/index.json     # Landing page blocks

tina/config.jsx             # TinaCMS schema (collections + fields)
docusaurus.config.js        # Docusaurus config (i18n, search, themes)
```

## Bilingual (ID / EN)

Default locale is **Indonesian (`id`)**. English translations live in:

```
i18n/en/docusaurus-plugin-content-docs/current/...     # mirror of /docs in EN
i18n/en/docusaurus-plugin-content-blog/...             # mirror of /blog in EN
i18n/en/docusaurus-theme-classic/navbar.json           # navbar labels
```

Generate translation skeleton:

```bash
npm run write-translations -- --locale en
```

## Roadmap

This repo is **Phase 1** of the frndOS Help Center initiative:

- **Phase 1 (current)** — Help Center standalone, TinaCMS authoring, search, bilingual
- **Phase 2** — Integration with frndOS app (entry point, announcement ↔ changelog cross-linking)
- **Phase 3** — AskFrnd knowledge ingestion (markdown → vector DB → product Q&A)

## License

Internal — frnd / Alva Intelligence.
