# .hack // A Consumption Guide

A spoiler-light, single-page guide to watching and playing the .hack franchise: what's connected, what you can skip, and the order to do it in.

Plain static HTML/CSS/JS. There is no build step and no dependencies apart from Google Fonts.

```
index.html        the page
assets/style.css  design tokens, layout, dark/light themes
assets/app.js     filters, saved progress (localStorage), theme toggle
.nojekyll         tells GitHub Pages to serve files as-is
```

## Publish on GitHub Pages

1. Merge this branch into your default branch (or publish from this branch).
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Pick the branch and the `/ (root)` folder, then save.

The site will be live at `https://<user>.github.io/dot-hack-guide/`.

## Preview locally

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Notes

- Facts were checked against reference sites and news coverage; see the **Fact-check** section of the page for what was confirmed, corrected, and left unverified.
- Streaming availability and used-game prices change constantly; they're described loosely on purpose.
- Unofficial fan project. .hack is a trademark of its respective owners, and no official art is used.
