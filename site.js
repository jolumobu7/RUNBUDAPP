/* RunBud site script: theme switch and optional app screenshots. */

(function () {
  var root = document.documentElement;
  var KEY = "runbud-theme";

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#ffffff" : "#000000");
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
