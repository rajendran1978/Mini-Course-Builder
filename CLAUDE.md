# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files open directly in a browser.

## Project Structure

- `index.html` – the whole course: header, lesson list, and one `<section class="lesson">` per slide
- `images/` – one picture per lesson 1-10, cropped from the slides (the deck file itself is not stored)
- `styles.css` – the Blueprint design: light/dark theme colours, fonts, layout
- `script.js` – theme toggle, switching between lessons, and the quizzes
- `simulator.js` – the divider simulator in the last section (series and parallel)
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

- One page (`index.html`). The slides' title is the page heading; each other slide is a lesson section (10 in total), in slide order. An 11th section is an interactive divider simulator (sliders for the supply and three resistors; series or parallel; formulas worked out live; KVL/KCL check). It has no quiz.
- A header with the light/dark theme toggle (light by default).
- JavaScript shows one lesson at a time. Students move with Previous/Next buttons or the lesson list. Without JavaScript, all lessons show in one scroll.
- Each lesson 1-10 shows the picture from its slide, cropped, with a caption. Tapping a picture opens it full size.
- A quick quiz (2 multiple-choice questions) at the end of each lesson, with instant feedback and no scoring. Questions are in `script.js`.
- No progress bar, intro, or summary.

### Design

Blueprint: a faint grid background, blue accent, amber boxes for formulas and correct answers. Fonts: IBM Plex Sans (text) and IBM Plex Mono (formulas, lesson numbers), loaded from Google Fonts with system-font fallbacks. Light theme by default; the dark theme is a navy "blueprint". All colours are variables at the top of `styles.css`.

### Phases

- **Phase 1 – Course from the slides (lessons, quizzes, simulator and design done):** build the page from the user's slides (PDF or PowerPoint) for school and university students who should understand the key ideas. Includes the responsive layout, theme toggle, and per-lesson quizzes. Ask the user for the slides when they are ready to build.
- **Later phases:** none planned yet. Add them here when decided.
