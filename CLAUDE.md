# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files open directly in a browser.

## Project Structure

- `index.html` – the whole course: header, lesson list, and one `<section class="lesson">` per slide
- `styles.css` – plain styling, light/dark theme colours
- `script.js` – theme toggle and switching between lessons
- `README.md` – project readme
- `CLAUDE.md` – this file

The source slide deck is not stored in the repository.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.

## Feature Plan

### Site structure

- One page (`index.html`). The slides' title is the page heading; each other slide is a lesson section (10 in total), in slide order.
- A header with the light/dark theme toggle (light by default).
- JavaScript shows one lesson at a time. Students move with Previous/Next buttons or the lesson list. Without JavaScript, all lessons show in one scroll.
- Planned: a short quiz at the end of each lesson (not built yet; questions need approval first).
- No progress bar, intro, or summary.

### Phases

- **Phase 1 – Course from the slides (lessons built; quizzes and design still to do):** build the page from the user's slides (PDF or PowerPoint) for school and university students who should understand the key ideas. Includes the responsive layout, theme toggle, and per-lesson quizzes. Ask the user for the slides when they are ready to build, and get approval on the quiz questions before finalising.
- **Later phases:** none planned yet. Add them here when decided.
