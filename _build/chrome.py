"""Shared head, header and footer for every page of myrunbud.com."""

V = "20261127b"
APP_STORE = "https://apps.apple.com/us/app/runbudapp/id6748336230"

HEAD = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f2f2f7">
  <script>
    (function () {{
      var t = null;
      try {{ t = localStorage.getItem("runbud-theme"); }} catch (e) {{}}
      if (t !== "light" && t !== "dark") t = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", t);
    }})();
  </script>
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="https://www.myrunbud.com/RunBudAppLogo.png">
  <link rel="icon" href="RunBudAppLogo.png">
  <link rel="apple-touch-icon" href="RunBudAppLogo.png">
  <link rel="preload" href="fonts/bigshoulders.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/instrument.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="styles.css?v={v}">
  <script src="site.js?v={v}" defer></script>{extra}
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
"""

NAV = [
    ("index.html#coach", "RunBud Coach", "coach"),
    ("index.html#app", "The app", "app"),
    ("index.html#teams", "Coaches and schools", "teams"),
    ("about.html", "About", "about"),
    ("support.html", "Support", "support"),
    ("account.html", "Sign in", "signin"),
]

HEADER = """  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="index.html">
        <img src="RunBudAppLogo.png" alt="" width="34" height="34">
        <span class="brand-word">RunBud</span>
      </a>
      <nav class="site-nav" aria-label="Main">
        <div class="nav-links" id="nav-links">
{links}
        </div>
        <a class="btn nav-cta" href="account.html?new=1">Create account</a>
        <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark theme">
          <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
          <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z"/></svg>
        </button>
        <button class="menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">
          <svg class="icon-menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          <svg class="icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </nav>
    </div>
  </header>
"""

FOOTER = """  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <a class="brand" href="index.html"><img src="RunBudAppLogo.png" alt="" width="34" height="34">RunBud</a>
        <a class="btn btn-lane" href="account.html?new=1">Create a free account</a>
      </div>
      <div class="footer-cols">
        <div>
          <h2>Product</h2>
          <ul>
            <li><a href="account.html?new=1">Create an account</a></li>
            <li><a href="hub.html">My progress and coach hub</a></li>
            <li><a href="coach.html">Coach dashboard demo</a></li>
            <li><a href="{app_store}">RunBud on the App Store</a></li>
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            <li><a href="about.html">About</a></li>
            <li><a href="support.html">Support</a></li>
            <li><a href="mailto:support@myrunbud.com">support@myrunbud.com</a></li>
          </ul>
        </div>
        <div>
          <h2>Legal</h2>
          <ul>
            <li><a href="privacy.html">Privacy policy</a></li>
            <li><a href="terms.html">Terms of use</a></li>
            <li><a href="data.html">Data we collect</a></li>
            <li><a href="community.html">Community guidelines</a></li>
            <li><a href="child-safety.html">Child safety standards</a></li>
            <li><a href="delete-account.html">Delete your account</a></li>
          </ul>
        </div>
        <div data-follow>
          <h2>Follow</h2>
          <div class="socials" data-socials></div>
        </div>
      </div>
      <p>&copy; 2026 RunBud. RunBud gives general training information. It isn't a medical device and doesn't replace advice from a doctor or athletic trainer.</p>
    </div>
  </footer>
{scripts}</body>
</html>
"""


def page(title, desc, body, current=None, extra_head="", scripts=""):
    links = "\n".join(
        f'          <a href="{href}"' + (' aria-current="page"' if key == current else "") + f">{label}</a>"
        for href, label, key in NAV
    )
    return (
        HEAD.format(title=title, desc=desc, v=V, extra=extra_head)
        + HEADER.format(links=links)
        + body
        + FOOTER.format(app_store=APP_STORE, scripts=scripts)
    )
