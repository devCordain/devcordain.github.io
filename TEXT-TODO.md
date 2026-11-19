# Text to adjust

Temporary scratch file — delete once copy is finalized.

**Architecture** — all card copy (word, hint, teaser, detail body) lives in a single source: `content.js`. Hub pages are just shells with `<ul data-card-ids="…">`; `cards.js` renders the cards at load and handles expand-in-place with View Transitions.

## `index.html` (landing)

| Location | Current | Notes |
| --- | --- | --- |
| `<title>` | `Choose — devCordain` | Browser tab / SERP title. |
| `<meta description>` | `This is your last chance. After this, there is no turning back.` | SERP snippet. |
| `.prompt` | `This is your last chance.` | Small uppercase caption. |
| `.title` | `Choose.` | Headline. |
| Red pill name / role | `Red pill` / `For developers` | |
| Blue pill name / role | `Blue pill` / `For recruiters` | |
| Purple pill name / role | `Both pills` / `See everything` | |
| `#motionToggle` | `Pause rain` / `Resume rain` | Must match `matrix.js` labels. |

## Hub shells

### `developer.html` (red + green)
| Location | Current |
| --- | --- |
| `<title>` | `Developer — devCordain` |
| `<meta description>` | `For developers — depth, stack, and what I build.` |
| Eyebrow | `Red pill · For developers` |
| Title | `Down the rabbit hole.` |
| Lead | `Pick a thread. Each card flips to a quick pitch — tap to grow it into the full story.` |
| First section title | `Personal` |
| Second section title | `More` |
| Personal cards | `origin, craft, off-hours` |
| More cards | `skills, built, style, experience, contact` |

### `recruiter.html` (blue + green)
| Location | Current |
| --- | --- |
| `<title>` | `Recruiter — devCordain` |
| `<meta description>` | `For recruiters — background, skills, and outcomes.` |
| Eyebrow | `Blue pill · For recruiters` |
| Title | `Welcome.` |
| Lead | `The short version. Each card flips to a quick summary — tap to grow it into the full story.` |
| First section title | `Personal` |
| Second section title | `More` |
| Personal cards | `background, work-style, looking-for` |
| More cards | `skills, built, style, experience, contact` |

### `both.html` (purple + green)
| Location | Current |
| --- | --- |
| `<title>` | `Both pills — devCordain` |
| `<meta description>` | `Everything — recruiter summary and developer depth, all in one view.` |
| Eyebrow | `Both pills · See everything` |
| Title | `All of it.` |
| Lead | `You took both. Here's the full map — flip any card for the pitch, tap to grow it.` |
| First section title | `Personal` |
| Second section title | `More` |
| Personal cards | `origin, craft, off-hours, background, work-style, looking-for` |
| More cards | `skills, built, style, experience, contact` |

## Cards — all defined in `content.js`

Each entry has: `word`, `teaser`, and `bodyHTML`. The expanded-view heading is **computed** at render time as `SECTION · WORD` from `ul[data-section-label]` and the card's own `word`.

### Developer-personal (red)
| ID | Word | Teaser |
| --- | --- | --- |
| `origin` | `Origin` | `How I ended up writing code — and why I stayed.` |
| `craft` | `Craft` | `What I care about when the IDE is open.` |
| `off-hours` | `Off-hours` | `What I'm into when the laptop is closed.` |

### Recruiter-personal (blue)
| ID | Word | Teaser |
| --- | --- | --- |
| `background` | `Background` | `Where I'm from and the arc that got me here.` |
| `work-style` | `Work style` | `How I like to collaborate, communicate, and ship.` |
| `looking-for` | `Looking for` | `The kind of role, team, and problems I'm after.` |

### Shared (used on all three hubs)
| ID | Word | Teaser |
| --- | --- | --- |
| `skills` | `Skills` | `Languages, frameworks, and the tools I reach for.` |
| `built` | `Built` | `Shipped work — product, side projects, open source.` |
| `style` | `Style` | `How I think about code, collaborate, and move teams.` |
| `experience` | `Experience` | `Roles, teams, and the arc of the work so far.` |
| `contact` | `Contact` | `Email, LinkedIn, GitHub — the best ways to say hi.` |

All `bodyHTML` fields are placeholder paragraphs — the real content goes there.

All card CTAs (visible on the back face on desktop) currently read `Open →`.

## `cards.js` fixed strings

| Location | Current |
| --- | --- |
| Toggle `aria-label` prefix | `Open <word>` (hidden label on the overlay button) |
| Close button | `Close` |

## `matrix.js`

| Location | Current | Notes |
| --- | --- | --- |
| `setRunning()` label | `Pause rain` / `Resume rain` | Keep in sync with `index.html` default. |
| `applyMotionPreference()` label | `Pause rain` / `Resume rain` | Same strings. |

## Open questions / follow-ups

- Brand name: use `devCordain`, `Cordain`, or something else in `<title>` suffixes?
- Red = developer, blue = recruiter — keep?
- Tagline on the landing: more personal than the stock Morpheus line?
- Need a 404/fallback page copy.
- Shared-section cards currently have one teaser each (audience-neutral). If you want the teaser to vary per hub, extend `content.js` with per-hub overrides and update `cards.js` to pick the right one.
- All 11 detail `bodyHTML` fields are placeholders — the real writing goes there.
- Think about `<noscript>` fallback: cards are JS-rendered, so without JS the hub pages are empty shells. Should we add a message in `<noscript>` or leave it?
