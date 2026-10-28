# AA Springbok: design notes

Static multi-page site (plain HTML, one stylesheet, one small script). No build step. Open `index.html` or serve the folder with any static server.

## Audience and goal

Shippers, importers and exporters who need road freight from Namibia into a neighbouring SADC country. Most will arrive on a phone. The primary action on every page is to request a quote, either by phone or through the quote form.

## Concept: the waybill

Freight runs on documents: waybills, manifests, border paperwork. The visual language borrows from them. Mono labels, dashed rules and data rows show up wherever the content is factual (contact details, route table, company facts). Display type is condensed uppercase Oswald, matching the logo's wordmark.

Principles:

1. Facts before decoration. Show the phone number, the destinations and the experience early, in plain rows.
2. One real map instead of generic imagery. The route map is projected from real coordinates (Windhoek, border towns, destination cities) and reused on Home and Routes.
3. Photographs show the region and the namesake animal. They are never presented as company vehicles, staff or clients.

## Tokens (see `:root` in `styles.css`)

| Role | Token | Value | Notes |
|---|---|---|---|
| Page background | `--sand` | #F6F2EA | |
| Alternate band | `--sand-2` | #ECE5D5 | |
| Text | `--ink` / `--text-body` / `--text-soft` | #17202A / #3B3833 / #59544A | All pass AA on both sands |
| Headings, dark bands | `--navy-deep` | #0F2E4E | From the logo |
| Primary action, small accent text | `--green` | #0B6B49 | Logo green, darkened to pass AA on `--sand-2` |
| CTA band | `--green-deep` | #08523A | |
| Accent on navy | `--green-light` | #8FE0BE | |
| Taupe | `--taupe` | #9C8A70 | Decorative fills only, never text |
| Errors | `--error` | #B42318 | Always paired with an icon and text |

Type: Oswald (display), Public Sans (body), IBM Plex Mono (labels, data). Minimum label size is 0.78rem.

Layout: 1200px max width, 32px gutter (20px under 600px). Breakpoints are 1080, 900 and 600px. Square corners throughout, with no radii or shadows, to fit the document concept.

## Heroes

Every page opens with a full-bleed photo hero (`.hero-bg`) with centred text (`.hero-center`). A flat navy scrim, no gradient, sits over the photo. Each hero sets its own `--scrim` opacity inline: the lightest value at which every hero text element still measured at least 4.9:1 (AA needs 4.5:1) against the rendered photo pixels at 360, 390, 768, 1280 and 1600px. If you swap a photo, re-check contrast before lowering the scrim. Hero eyebrows are white because the green accent drops below AA over photos. On Home, the quote desk strip (`.desk-strip`, `.waybill.horizontal`) overlaps the bottom of the hero.

## Components

- `.waybill`: a navy header strip over `dl` rows. Used for the quote desk and contact details.
- `.route-map`: inline SVG. Its corridors are the public Walvis Bay corridors (Trans-Kalahari, Trans-Caprivi, Trans-Cunene, Trans-Oranje).
- `.route-table`: a real table. It stacks into labelled rows under 600px.
- `.service-grid`, `.feature-list`, `.process`, `.checklist`: open, rule-separated lists rather than cards.
- `.cta-band`: closes a page with the phone number and the quote button. Green on Home and Services; `.cta-light` (base sand with a navy rule) on About and Routes so pages do not all end the same way.

## Behaviour

- Main nav: Home, About, Routes, Services, Contact. The mobile nav has no hamburger. Under 900px the five links move to a second header row, so every page is one tap away.
- The quote form validates on the client, then opens the visitor's email app with the request pre-filled to asser@aaspringbok.net, cc admin@. There is no backend, so the page never says the request was sent. A fallback panel shows the request text to copy. Without JavaScript the form falls back to a plain `mailto:` action.
- `prefers-reduced-motion` turns off smooth scroll and transitions.

## Editing

Header and footer are repeated in every page. Change them in all six HTML files, and move `aria-current="page"` to the matching link. Images live in `images/` as WebP at two widths each. Sources are listed in `credits.html`.

## Open items for the client

- A real photo of the founder, the trucks or a loading operation would strengthen About and Home more than any stock photo.
- Confirm the corridors listed on the Routes page and, if useful, add the border crossings actually used.
- Confirm these claims, which come from the original site copy: the founder has driven these routes; part loads are carried; "the person who quotes the job is the one who sees it delivered".
- Confirm the source of `background.jpeg` (the springbok herd). The hero crop in `images/springbok-hero.webp` is cut from it. A higher-resolution original would sharpen the hero on high-density screens.
- Unsplash photographer names were not recorded when the images were first chosen. The Unsplash License does not require credit, but add names if known.
- `background.jpeg` and `aaspringboklogo.png` are kept as source masters. The pages use the optimized copies in `images/`.
- A form backend (for example a hosted form service) would let quotes arrive without the visitor's email app.
