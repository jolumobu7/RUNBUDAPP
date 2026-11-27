# Building the site

Every page shares one header and footer from `chrome.py`. Page content lives in `pages/`.

    python3 _build/build.py

That rewrites index, account, support, about, privacy, terms, data, community,
child-safety and delete-account. `hub.html` and `coach.html` are edited directly.
`hub.html` is also kept in the app repo at `web/hub.html`.

GitHub Pages runs Jekyll, which skips folders starting with `_`, so this folder is never published.
