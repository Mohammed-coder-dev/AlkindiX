# Content Guide

## Home

Keep `public/index.html` concise: one introduction and one primary action. Detailed
project, research, and creative content belongs on its dedicated page.

## About

`public/about.html` contains the short profile, working areas, experience, education,
and the compact personal-practice note. Keep the page selective; the linked PDF is the
complete resume.

## Projects

`public/projects.html` presents three selected systems. Public repositories may include
a GitHub link. Private professional work should use a factual summary without an empty
or placeholder repository link.

## Research

`public/research.html` separates formal studies from exploratory integer work. Avoid
claims that are not supported by a report, repository, or documented result.

## Creative work

`public/creative/index.html` links to the photography archive and Architect of Silence.
The photography page lists every numbered image in `public/images/photography/`.
When the archive changes, update the gallery markup in
`public/creative/photography/index.html` and keep image loading lazy after the first row.

## Shared navigation and footer

Navigation and footer markup is duplicated across the HTML pages. Update every public
page when a shared destination or social link changes.

## Search metadata

Each public page should have a descriptive title, meta description, and canonical URL.
Update `public/sitemap.xml` when a canonical route is added or removed.
