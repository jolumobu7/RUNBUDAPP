/* RunBud coach dashboard preview: theme switch, sample chart, table, calendar.
   All numbers here are sample data until coach accounts go live. */
(function () {
  var root = document.documentElement;

  // Theme switch (same setting as the rest of myrunbud.com)
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
  setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      setTheme(next);
      try { localStorage.setItem("runbud-theme", next); } catch (e) {}
    });
  }

  // Today pill
  var now = new Date();
  var todayText = document.getElementById("today-text");
  if (todayText) todayText.textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  // Load chart: Mon..Sun, sample values (0 = rest)
  var load = [380, 520, 260, 610, 0, 300, 0];
  var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var todayIndex = (now.getDay() + 6) % 7;
  var max = Math.max.apply(null, load);
  var bars = document.getElementById("load-bars");
  var labels = document.getElementById("load-labels");
  if (bars && labels) {
    load.forEach(function (v, i) {
      var b = document.createElement("span");
      b.style.height = (v === 0 ? 6 : Math.round((v / max) * 100)) + "%";
      if (v === 0) b.className = "rest";
      else if (i === todayIndex) b.className = "today";
      b.title = days[i] + ": " + (v === 0 ? "rest" : v + " load");
      bars.appendChild(b);
      var l = document.createElement("span");
      l.textContent = days[i];
      labels.appendChild(l);
    });
  }

  // Athletes (sample)
  var athletes = [
    { n: "Marcus L.", e: "200m, 400m", g: "Sprints", done: 75, load: 1840, sleep: 6.9, sore: 4, best: "400m 48.62", hue: 200 },
    { n: "Ava B.", e: "100m, 200m", g: "Sprints", done: 92, load: 1610, sleep: 5.8, sore: 2, best: "200m 24.71", hue: 330 },
    { n: "Jordan T.", e: "800m, Mile", g: "Mid-distance", done: 100, load: 2230, sleep: 7.6, sore: 3, best: "800m 1:56.40", hue: 30 },
    { n: "Priya S.", e: "100m H", g: "Hurdles", done: 83, load: 1490, sleep: 7.9, sore: 2, best: "100m H 14.38", hue: 280 },
    { n: "Diego R.", e: "Long jump, Triple jump", g: "Jumps", done: 67, load: 1120, sleep: 7.1, sore: 3, best: "LJ 6.92m", hue: 150 },
    { n: "Kayla M.", e: "Shot put, Discus", g: "Throws", done: 100, load: 1380, sleep: 8.2, sore: 1, best: "SP 12.05m", hue: 10 },
    { n: "Sam O.", e: "3200m, Cross country", g: "Distance", done: 90, load: 2610, sleep: 7.4, sore: 2, best: "3200m 9:48", hue: 60 },
    { n: "Noah K.", e: "60m, 200m", g: "Sprints", done: 58, load: 980, sleep: 6.4, sore: 3, best: "60m 7.02", hue: 220 }
  ];

  function initials(name) {
    return name.split(/\s+/).map(function (p) { return p.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }

  var tbody = document.getElementById("athlete-rows");
  var count = document.getElementById("athlete-count");
  function render(group) {
    if (!tbody) return;
    tbody.textContent = "";
    var shown = athletes.filter(function (a) { return group === "All" || a.g === group; });
    shown.forEach(function (a) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        '<td><div class="who"><span class="person-avatar" style="--hue:' + a.hue + '"></span><div><span class="name"></span><small></small></div></div></td>' +
        '<td><span class="group-tag"></span></td>' +
        '<td><span class="ring" style="--p:' + a.done + '"><b>' + a.done + '%</b></span></td>' +
        "<td>" + a.load.toLocaleString() + "</td>" +
        "<td>" + a.sleep.toFixed(1) + " h</td>" +
        '<td class="' + (a.sore >= 4 ? "sore-high" : "") + '">' + a.sore + "/5</td>" +
        "<td></td>";
      tr.querySelector(".person-avatar").textContent = initials(a.n);
      tr.querySelector(".name").textContent = a.n;
      tr.querySelector("small").textContent = a.e;
      tr.querySelector(".group-tag").textContent = a.g;
      tr.lastChild.textContent = a.best;
      tbody.appendChild(tr);
    });
    if (count) count.textContent = shown.length + (shown.length === 1 ? " athlete" : " athletes");
  }
  render("All");

  var chips = document.querySelectorAll("#group-chips .chip");
  chips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", chip.classList.contains("is-on") ? "true" : "false");
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-on");
      chip.setAttribute("aria-pressed", "true");
      render(chip.getAttribute("data-group"));
    });
  });

  // Calendar for the current month (sample marks)
  var cal = document.getElementById("cal");
  var monthLabel = document.getElementById("month-label");
  if (cal) {
    var y = now.getFullYear(), m = now.getMonth();
    if (monthLabel) monthLabel.textContent = now.toLocaleDateString(undefined, { month: "long" });
    var first = (new Date(y, m, 1).getDay() + 6) % 7;
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < first; i++) {
      var blank = document.createElement("span");
      blank.className = "blank";
      cal.appendChild(blank);
    }
    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement("span");
      cell.textContent = d;
      var weekday = (new Date(y, m, d).getDay() + 6) % 7;
      if (d === now.getDate()) cell.className = "today";
      else if (d > now.getDate() && d <= now.getDate() + 7 && weekday < 4) cell.className = "hidden-day";
      else if (d < now.getDate() && weekday < 4) cell.className = "posted";
      if (weekday === 5 && (d === 6 || d === 13 || d === 20 || d === 27 || d === 7 || d === 14 || d === 21 || d === 28) && d % 2 === 0) cell.className = "meet";
      cal.appendChild(cell);
    }
  }
})();
