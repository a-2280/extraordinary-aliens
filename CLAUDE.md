# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Stack

Next.js 16.2.4 + React 19.2.4 with a Sanity Studio v5 (`sanity` ^5.21) embedded at `/admin` via `next-sanity`. Styling is SCSS (`sass` ^1.99). Path alias `@/*` resolves to `src/*` (see `jsconfig.json`). No test runner is configured.

## Commands

- `npm run dev` — start dev server (`next dev`).
- `npm run build` — production build.
- `npm start` — **also runs `next dev`**, not a production server. Use `next start` manually if you need that.
- `npm run lint` — `eslint` with `eslint-config-next`.
- `npm run clean` / `npm run restart` — wipe `.next` and restart dev.

## Mixed-router architecture

The project intentionally combines both Next.js routers; do not migrate one to the other without intent.

- **Pages Router** (`src/pages/`) renders the public site. `index.js` and `case-study/[slug].js` use `getStaticProps` with `revalidate: 60` (ISR), and slugs use `getStaticPaths` with `fallback: "blocking"`. There is **no `_app.js` / `_document.js`** — each page imports `src/scss/site.scss` directly and wraps content in `src/layouts/layout.js`, which is a client component that runs `<ReactLenis>` for smooth scroll and boots the SAL observer.
- **App Router** (`src/app/admin/[[...tool]]/`) hosts the Sanity Studio via `<NextStudio>` and is `dynamic: 'force-static'`. Studio config lives in `sanity.config.js` at the repo root with `basePath: '/admin'`.

New public pages: follow the Pages Router pattern (`getStaticProps` → fetchers → `<Layout>` wrapper → SCSS imported in the page).

## Sanity content layer

- **Env vars** (`src/sanity/env.js`): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`.
- **Client** (`src/sanity/lib/client.js`) uses `useCdn: true`. `src/sanity/lib/live.js` exports a `defineLive()` setup but is not currently wired into pages.
- **GROQ queries** live in `src/sanity/lib/queries.js`; **fetchers** are thin wrappers in `src/sanity/lib/fetch.js` that pages call from `getStaticProps`. Add a new query + fetcher pair when surfacing new content.
- **Schemas** are registered in `src/sanity/schemaTypes/index.js` — every new schema must be imported and added to the `types` array there.
- **Studio desk structure** is customized in `src/sanity/structure.js` (uses `@sanity/orderable-document-list` for projects ordering).

### Case-study composition model

Case studies (`projects` document) hold a `caseStudySections` array of either `section` or `textLarge` objects. A `section` has `leftSide` / `rightSide` arrays each holding at most one **component** object (`carousel`, `captionCarousel`, `imageCard`, `imageCarousel`, `imageHotspot`, `imageExpandableCaption`, `annotationImage`, `audioPlayer`, `textBlock`). Variants like `fullWidth` change layout behavior; the schema marks the opposite side read-only when one side is `fullWidth`.

Rendering: `src/components/caseStudyContent.js` walks `caseStudySections` and dispatches on `_type` — `textLarge` renders directly; `section` renders via `src/components/caseStudyComponents/section.js`, which uses `src/components/caseStudyComponents/registry.js` to map each child's `_type` to a React component.

**Adding a new component requires three coordinated edits:**

1. Schema at `src/sanity/schemaTypes/types/components/<name>.js`, then import + append to the `types` array in `src/sanity/schemaTypes/index.js`.
2. Add the new `_type` to the `section` schema's `leftSide`/`rightSide` accepted types **and** to the case-study GROQ projection in `src/sanity/lib/queries.js` so the data round-trips.
3. React component at `src/components/caseStudyComponents/<name>.js`, then register it by `_type` in `registry.js`.

There is an in-progress reorganization: top-level section components are migrating from `caseStudyComponents/` into `src/components/caseStudySections/` (see `caseStudySections/textLarge.js` and the matching `schemaTypes/types/sections/textLarge.js`). The split mirrors schema layout — `types/sections/` for objects that live directly in `caseStudySections`, `types/components/` for nested components inside a `section`. Mind which directory you're working in.

### Custom Studio inputs

- `src/sanity/components/SpotPointInput.js` — click-to-place hotspot input used by `imageHotspot`'s `spot` child (stores normalized 0–1 x/y).
- `src/sanity/components/BackButtonItem.js` — wraps deeply nested array items with a back button using `useDocumentPane()`'s `onPathOpen`.

## Styling

- SCSS partials live in `src/scss/`. The entry `site.scss` `@use`s every partial. Pages import `site.scss` directly (e.g. `src/pages/index.js:2`) — there is no global stylesheet entrypoint, so a new top-level page must import it explicitly.
- `_global.scss` defines a wide utility class system (gap/p/m/w/h/ratio/flex/grid/variant-\*). The `.variant-cut` and `.variant-fullWidth` classes drive sticky/aspect-ratio behavior in components.

## Animation & interaction libraries

- **Lenis** smooth scroll is initialized once in `src/layouts/layout.js`.
- **GSAP** (`gsap`, `@gsap/react`) is used per-component via `useGSAP` (header, contactCta, audioPlayer). Plugins are registered locally inside each consumer.
- **SAL** (`src/utils/sal.js`) is a small `IntersectionObserver` activated from the layout; mark elements with a `data-sal` attribute to opt in.
- **Swiper** powers `carousel.js` and `captionCarousel.js`.

## Images

`next.config.mjs` only allows `cdn.sanity.io` as a remote image host. Images come through Sanity's URL builder in `src/sanity/lib/image.js`; case-study GROQ queries also project `"image": image.asset->url` directly for components that don't use the builder.
