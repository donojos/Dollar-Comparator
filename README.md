# Dollar Comparator

A simple static web app that shows what a dollar amount "feels like" at a
different financial scale. Pick a company or high-net-worth individual, enter
an amount, and see the equivalent for a person earning the median U.S.
household income — in either direction.

- **Companies** are compared using approximate yearly EBITDA.
- **Individuals** are compared using rough estimates of annual earnings /
  wealth gain (individuals don't have EBITDA).
- **Baseline:** median U.S. household income (~$83,000/year).

The math is a simple ratio: `equivalent = amount × (baseline / entity annual)`
(or the inverse, depending on direction).

## Running locally

No build step. Just open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Updating the figures

All data lives at the top of `app.js` in the `ENTITIES` array and the
`AVERAGE_PERSON_INCOME` constant. Edit the numbers or add new entries — no
other changes needed.

## Deploying to GitHub Pages (free)

1. Create a new repository on GitHub (e.g. `dollar-comparator`). Public repos
   get free Pages hosting.
2. From this folder, push the files:

   ```sh
   git init
   git add .
   git commit -m "Dollar Comparator"
   git branch -M main
   git remote add origin https://github.com/<your-username>/dollar-comparator.git
   git push -u origin main
   ```

3. On GitHub, open the repo → **Settings** → **Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   choose the `main` branch and the `/ (root)` folder, then **Save**.
5. Wait a minute or two. Your site will be live at:

   `https://<your-username>.github.io/dollar-comparator/`

Any future `git push` to `main` automatically redeploys the site.

## Disclaimer

All figures are approximate, based on recent public filings and published
estimates, and are for illustration only.
