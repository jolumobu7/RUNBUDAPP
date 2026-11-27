/* RunBud site script: theme switch and optional app screenshots. */

(function () {
  var root = document.documentElement;
  var KEY = "runbud-theme";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f2f2f7" : "#000000");
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var next = theme === "light" ? "dark" : "light";
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
      btn.setAttribute("title", "Switch to " + next + " theme");
    }
  }

  var current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
  setTheme(current);

  var button = document.getElementById("theme-toggle");
  if (button) {
    button.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(next);
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {}
    });
  }

  /* Show the screenshots section only if at least one screen image loads. */
  var shots = document.getElementById("screens");
  if (shots) {
    var figures = shots.querySelectorAll("figure");
    figures.forEach(function (fig) {
      var img = fig.querySelector("img");
      if (!img) return;
      function show() {
        fig.hidden = false;
        shots.hidden = false;
      }
      function hide() {
        fig.hidden = true;
      }
      if (img.complete) {
        if (img.naturalWidth > 0) show();
        else hide();
      } else {
        img.addEventListener("load", show);
        img.addEventListener("error", hide);
      }
    });
  }
})();

/* Social links: fill in a URL to show it in every page's footer.
   Empty ones are hidden; if all are empty the Follow column is hidden. */
(function () {
  var SOCIALS = [
    ["Instagram", ""],
    ["TikTok", ""],
    ["YouTube", ""],
    ["LinkedIn", ""],
    ["X", ""],
    ["Facebook", ""]
  ];
  var boxes = document.querySelectorAll("[data-socials]");
  var any = false;
  boxes.forEach(function (box) {
    SOCIALS.forEach(function (s) {
      if (!s[1]) return;
      any = true;
      var a = document.createElement("a");
      a.href = s[1];
      a.textContent = s[0];
      a.rel = "me noopener";
      a.target = "_blank";
      box.appendChild(a);
    });
  });
  if (!any) {
    document.querySelectorAll("[data-follow]").forEach(function (col) { col.hidden = true; });
  }
})();

/* Phone menu: open/close, close on link tap, Escape or tapping outside. */
(function () {
  var btn = document.getElementById("menu-btn");
  var links = document.getElementById("nav-links");
  if (!btn || !links) return;
  function set(open) {
    links.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
  links.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { set(false); btn.focus(); }
  });
  document.addEventListener("click", function (e) {
    if (btn.getAttribute("aria-expanded") === "true" && !links.contains(e.target) && !btn.contains(e.target)) set(false);
  });
})();

/* Sections below the fold fade in as they scroll into view. */
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var items = document.querySelectorAll(".reveal");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.remove("pending"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add("pending"); io.observe(el); }
  });
})();
