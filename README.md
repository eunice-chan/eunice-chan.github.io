# Personal site

Plain HTML/CSS/JS, no build step — works directly on GitHub Pages.

Made with Claude.

## Files
- `index.html` — page structure
- `style.css` — all styling
- `script.js` — loads `data/content.json` and fills in the page
- `data/content.json` — **all the actual content**. Edit this file to update the site; you shouldn't need to touch the HTML/CSS/JS for routine updates (new publication, new award, etc.)

## To host on GitHub Pages
1. Create a repo (e.g. `yourusername.github.io` for a root URL, or any name for a project page).
2. Push these files to the repo's default branch.
3. In the repo settings, go to **Pages** and set the source to that branch (root).
4. The site will be live at `https://yourusername.github.io/` (or `.../reponame/` for a project page).

## To update content
Open `data/content.json` and edit the relevant array (`publications`, `research_experience`, `professional_experience`, `teaching`, `awards`, `education`). No HTML editing needed. Commit and push — GitHub Pages redeploys automatically within a minute or two.

## Local preview
Because the page fetches `data/content.json`, opening `index.html` directly by double-clicking it (`file://`) will fail due to browser CORS rules. Run a local server instead, from this folder:
```
python3 -m http.server 8000
```
then open `http://localhost:8000`. (GitHub Pages serves it correctly with no extra steps.)
