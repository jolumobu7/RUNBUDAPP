/* RunBud coach dashboard: interactive demo.
   Everything is sample data kept in memory. Nothing is saved or sent. */
(function () {
  var root = document.documentElement;
  var now = new Date();

  /* ---------- helpers ---------- */
  function $(sel) { return document.querySelector(sel); }
  function $all(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function initials(name) {
    return name.split(/\s+/).map(function (p) { return p.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }
  function avatar(a, size) {
    var s = el("span", "person-avatar", initials(a.n));
    s.style.setProperty("--hue", a.hue);
    if (size) { s.style.width = size + "px"; s.style.height = size + "px"; }
    return s;
  }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- theme switch (same setting as the rest of the site) ---------- */
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f2f2f7" : "#000000");
    var btn = $("#theme-toggle");
    if (btn) {
      var next = theme === "light" ? "dark" : "light";
      btn.setAttribute("aria-label", "Switch to " + next + " theme");
      btn.setAttribute("title", "Switch to " + next + " theme");
    }
  }
  setTheme(root.getAttribute("data-theme") === "light" ? "light" : "dark");
  var toggle = $("#theme-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    try { localStorage.setItem("runbud-theme", next); } catch (e) {}
  });

  var todayText = $("#today-text");
  if (todayText) todayText.textContent = now.toLocaleDateString(undefined, { month: "short", day: "numeric" });

  /* ---------- sample data ---------- */
  var GROUPS = ["Sprints", "Hurdles", "Mid-distance", "Distance", "Jumps", "Throws"];
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

  /* ---------- views (Dashboard / Plan / Athletes / Messages) ---------- */
  var VIEWS = ["dashboard", "plan", "athletes", "messages"];
  function showView(name) {
    if (VIEWS.indexOf(name) === -1) name = "dashboard";
    $all(".view").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== name; });
    $all(".tabs .tab").forEach(function (t) {
      var on = t.getAttribute("data-view") === name;
      t.classList.toggle("is-active", on);
      if (on) t.setAttribute("aria-current", "page"); else t.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", function () { showView(location.hash.slice(1)); });

  /* ---------- dashboard: load chart ---------- */
  var load = [380, 520, 260, 610, 0, 300, 0];
  var dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var todayIndex = (now.getDay() + 6) % 7;
  var maxLoad = Math.max.apply(null, load);
  var bars = $("#load-bars"), labels = $("#load-labels");
  if (bars && labels) {
    load.forEach(function (v, i) {
      var b = el("span", v === 0 ? "rest" : (i === todayIndex ? "today" : ""));
      b.style.height = (v === 0 ? 6 : Math.round((v / maxLoad) * 100)) + "%";
      b.title = dayNames[i] + ": " + (v === 0 ? "rest" : v + " load");
      bars.appendChild(b);
      labels.appendChild(el("span", "", dayNames[i]));
    });
  }

  /* ---------- athlete tables ---------- */
  function athleteRow(a) {
    var tr = el("tr");
    tr.tabIndex = 0;
    var td1 = el("td"), who = el("div", "who"), info = el("div");
    who.appendChild(avatar(a));
    info.appendChild(el("span", "name", a.n));
    info.appendChild(el("small", "", a.e));
    who.appendChild(info); td1.appendChild(who); tr.appendChild(td1);
    var td2 = el("td"); td2.appendChild(el("span", "group-tag", a.g)); tr.appendChild(td2);
    var td3 = el("td"), ring = el("span", "ring"); ring.style.setProperty("--p", a.done);
    ring.appendChild(el("b", "", a.done + "%")); td3.appendChild(ring); tr.appendChild(td3);
    tr.appendChild(el("td", "", a.load.toLocaleString()));
    tr.appendChild(el("td", "", a.sleep.toFixed(1) + " h"));
    tr.appendChild(el("td", a.sore >= 4 ? "sore-high" : "", a.sore + "/5"));
    tr.appendChild(el("td", "", a.best));
    tr.addEventListener("click", function () { openAthlete(a); });
    tr.addEventListener("keydown", function (e) { if (e.key === "Enter") openAthlete(a); });
    return tr;
  }

  var dashGroup = "All";
  function renderDashTable() {
    var tbody = $("#athlete-rows"), count = $("#athlete-count");
    if (!tbody) return;
    tbody.textContent = "";
    var shown = athletes.filter(function (a) { return dashGroup === "All" || a.g === dashGroup; });
    shown.forEach(function (a) { tbody.appendChild(athleteRow(a)); });
    if (count) count.textContent = shown.length + (shown.length === 1 ? " athlete" : " athletes");
  }
  renderDashTable();

  function wireChips(container, groups, onPick, initial) {
    if (!container) return;
    if (!container.children.length) {
      groups.forEach(function (g) {
        var b = el("button", "chip", g);
        b.type = "button";
        b.setAttribute("data-group", g);
        container.appendChild(b);
      });
    }
    var chips = Array.prototype.slice.call(container.querySelectorAll(".chip"));
    function select(g) {
      chips.forEach(function (c) {
        var on = c.getAttribute("data-group") === g;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      onPick(g);
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { select(c.getAttribute("data-group")); }); });
    select(initial || "All");
  }
  wireChips($("#group-chips"), [], function (g) { dashGroup = g; renderDashTable(); }, "All");

  // Full athletes view: filter, search, sort
  var fullGroup = "All", search = "", sortKey = "n", sortDir = 1;
  function renderFullTable() {
    var tbody = $("#athlete-rows-full");
    if (!tbody) return;
    tbody.textContent = "";
    var q = search.trim().toLowerCase();
    athletes
      .filter(function (a) { return (fullGroup === "All" || a.g === fullGroup) && (!q || (a.n + " " + a.e).toLowerCase().indexOf(q) !== -1); })
      .sort(function (x, y) {
        var a = x[sortKey], b = y[sortKey];
        return (typeof a === "number" ? a - b : String(a).localeCompare(String(b))) * sortDir;
      })
      .forEach(function (a) { tbody.appendChild(athleteRow(a)); });
    if (!tbody.children.length) {
      var tr = el("tr"), td = el("td", "", "No athletes match.");
      td.colSpan = 7; tr.appendChild(td); tbody.appendChild(tr);
    }
  }
  wireChips($("#athlete-chips"), ["All"].concat(GROUPS), function (g) { fullGroup = g; renderFullTable(); }, "All");
  var searchInput = $("#athlete-search");
  if (searchInput) searchInput.addEventListener("input", function () { search = searchInput.value; renderFullTable(); });
  $all(".sort").forEach(function (b) {
    b.addEventListener("click", function () {
      var key = b.getAttribute("data-sort");
      if (key === sortKey) sortDir = -sortDir; else { sortKey = key; sortDir = typeof athletes[0][key] === "number" ? -1 : 1; }
      $all(".sort").forEach(function (o) { o.classList.toggle("is-on", o === b); });
      renderFullTable();
    });
  });

  // Athlete detail
  function openAthlete(a) {
    var d = $("#athlete-dialog");
    if (!d) return;
    var av = $("#athlete-avatar");
    av.textContent = initials(a.n); av.style.setProperty("--hue", a.hue);
    $("#athlete-name").textContent = a.n;
    $("#athlete-events").textContent = a.g + " · " + a.e;
    var stats = $("#athlete-stats"); stats.textContent = "";
    [["Done", a.done + "%"], ["Load", a.load.toLocaleString()], ["Sleep", a.sleep.toFixed(1) + " h"], ["Soreness", a.sore + "/5"]].forEach(function (s) {
      var box = el("div"); box.appendChild(el("span", "", s[0])); box.appendChild(el("b", "", s[1])); stats.appendChild(box);
    });
    var week = $("#athlete-week"); week.textContent = "";
    var sessions = [
      ["Mon", "Tempo 2 × (4 × 200m)", "Done · effort 6"],
      ["Tue", "Speed + weight room", a.done >= 70 ? "Done · effort 8" : "Partly done"],
      ["Wed", "Recovery, mobility", "Done · effort 3"],
      ["Thu", "Speed endurance", a.done >= 90 ? "Done · effort 9" : "Skipped: " + (a.sore >= 4 ? "hamstring tight" : "exam")]
    ];
    sessions.forEach(function (s) {
      var li = el("li");
      li.appendChild(el("b", "", s[0] + "  "));
      li.appendChild(document.createTextNode(s[1]));
      var st = el("span", s[2].indexOf("Done") === 0 ? "status-done" : (s[2].indexOf("Skipped") === 0 ? "status-skip" : ""), s[2]);
      li.appendChild(st);
      week.appendChild(li);
    });
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }

  /* ---------- plan: week grid + day editor ---------- */
  var weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - todayIndex);
  var plan = [
    { title: "Speed", group: "Sprints", vis: "now", parts: [["Warm-up", "Drills, 3 × 30m build-ups"], ["Main set", "4 × 30m fly, full rest"], ["Weight room", "Trap bar jump 4 × 3"]] },
    { title: "Tempo + lift", group: "Everyone", vis: "now", parts: [["Main set", "2 × (4 × 200m) @ 27-28, 2:30 rest"], ["Weight room", "Split squat 3 × 5, RDL 3 × 6"]] },
    { title: "Recovery", group: "Everyone", vis: "now", parts: [["Main set", "20 min easy, mobility, core"]] },
    { title: "Speed endurance", group: "Sprints", vis: "evening", parts: [["Warm-up", "800m jog, A-skips, B-skips"], ["Main set", "3 × 300m @ 42-44, 8 min rest"], ["Then", "2 × 150m @ 18-19, walk back"], ["Cool-down", "800m jog, static stretch"]] },
    null,
    { title: "Meet: Home Invitational", group: "Everyone", vis: "hidden", parts: [["Note", "Bus 7:30 AM. Bring both spikes."]] },
    null
  ];
  var planGroup = "Everyone";
  var visLabel = { now: "Visible now", evening: "Visible the night before, 8 PM", morning: "Visible that morning, 6 AM", hidden: "Hidden" };
  var visClass = { now: "vis-now", evening: "vis-later", morning: "vis-later", hidden: "vis-hidden" };

  function renderWeek() {
    var grid = $("#week-grid");
    if (!grid) return;
    grid.textContent = "";
    plan.forEach(function (day, i) {
      var date = new Date(weekStart); date.setDate(weekStart.getDate() + i);
      var shown = day && (planGroup === "Everyone" || day.group === "Everyone" || day.group === planGroup);
      var card = el("button", "day" + (i === todayIndex ? " is-today" : ""));
      card.type = "button";
      card.setAttribute("aria-label", "Edit " + dayNames[i]);
      var top = el("div", "day-top");
      top.appendChild(el("span", "day-name", dayNames[i]));
      top.appendChild(el("span", "day-date", String(date.getDate())));
      card.appendChild(top);
      if (shown) {
        card.appendChild(el("span", "tag tag-sprints", day.group));
        card.appendChild(el("h3", "", day.title));
        var ul = el("ul");
        day.parts.forEach(function (p) {
          if (p[1]) ul.appendChild(el("li", "", (p[0] ? p[0] + ": " : "") + p[1]));
        });
        card.appendChild(ul);
        card.appendChild(el("span", "vis " + visClass[day.vis], visLabel[day.vis]));
      } else {
        card.appendChild(el("span", "rest", day ? "Nothing for " + planGroup : "Rest"));
      }
      card.addEventListener("click", function () { openDay(i); });
      grid.appendChild(card);
    });
  }
  wireChips($("#plan-group-chips"), ["Everyone"].concat(GROUPS), function (g) { planGroup = g; renderWeek(); }, "Everyone");

  var editing = -1;
  function partRow(label, detail) {
    var row = el("div", "part-row");
    var l = el("input"); l.type = "text"; l.placeholder = "Part"; l.value = label || ""; l.setAttribute("aria-label", "Part name");
    var d = el("input"); d.type = "text"; d.placeholder = "What to do"; d.value = detail || ""; d.setAttribute("aria-label", "Part details");
    var x = el("button", "", "×"); x.type = "button"; x.setAttribute("aria-label", "Remove part");
    x.addEventListener("click", function () { row.remove(); });
    row.appendChild(l); row.appendChild(d); row.appendChild(x);
    return row;
  }
  function openDay(i) {
    editing = i;
    var day = plan[i] || { title: "", group: planGroup, vis: "evening", parts: [["Warm-up", ""], ["Main set", ""], ["Cool-down", ""]] };
    var date = new Date(weekStart); date.setDate(weekStart.getDate() + i);
    $("#day-dialog-title").textContent = date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
    $("#f-title").value = day.title;
    var sel = $("#f-group"); sel.textContent = "";
    ["Everyone"].concat(GROUPS).forEach(function (g) {
      var o = el("option", "", g); o.value = g; if (g === day.group) o.selected = true; sel.appendChild(o);
    });
    $("#f-visible").value = day.vis;
    var parts = $("#f-parts"); parts.textContent = "";
    day.parts.forEach(function (p) { parts.appendChild(partRow(p[0], p[1])); });
    var d = $("#day-dialog");
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  var addPart = $("#add-part");
  if (addPart) addPart.addEventListener("click", function () { $("#f-parts").appendChild(partRow("", "")); });
  var dayDialog = $("#day-dialog");
  if (dayDialog) dayDialog.addEventListener("close", function () {
    if (dayDialog.returnValue !== "save" || editing < 0) return;
    var parts = $all("#f-parts .part-row").map(function (r) {
      var ins = r.querySelectorAll("input");
      return [ins[0].value.trim(), ins[1].value.trim()];
    }).filter(function (p) { return p[0] || p[1]; });
    var title = $("#f-title").value.trim();
    plan[editing] = { title: title || "Workout", group: $("#f-group").value, vis: $("#f-visible").value, parts: parts };
    renderWeek();
    toast(plan[editing].vis === "hidden" ? "Saved. Hidden from athletes." : "Saved. " + visLabel[plan[editing].vis] + ".");
  });
  var clearDay = $("#clear-day");
  if (clearDay) clearDay.addEventListener("click", function () {
    if (editing >= 0) plan[editing] = null;
    dayDialog.close("cancel");
    renderWeek();
    toast("Marked as a rest day.");
  });
  var copyWeek = $("#copy-week");
  if (copyWeek) copyWeek.addEventListener("click", function () { toast("Copied to next week (demo)."); });
  renderWeek();

  /* ---------- messages ---------- */
  var chats = [
    { id: "team", name: "Sprints group", members: "Coach, 9 athletes, school admin", hue: 210, msgs: [
      ["Coach", "Thursday's workout is up tonight at 8. 3 × 300 then 2 × 150.", true],
      ["Ava B.", "Are we in spikes for the 150s?", false],
      ["Coach", "Flats for the 300s, spikes for the 150s.", true]
    ] },
    { id: "marcus", name: "Marcus L.", members: "Coach, Marcus L. · school admins can read", hue: 200, msgs: [
      ["Marcus L.", "Hamstring is still tight from Tuesday.", false],
      ["Coach", "Skip the 150s Thursday. See the trainer before practice.", true]
    ] },
    { id: "jumps", name: "Jumps group", members: "Coach, 4 athletes, school admin", hue: 150, msgs: [
      ["Diego R.", "Can we get pit time Wednesday?", false],
      ["Coach", "Yes, 3:30 to 4:15.", true]
    ] }
  ];
  var current = chats[0];
  function renderChatList() {
    var list = $("#chat-list");
    if (!list) return;
    list.textContent = "";
    chats.forEach(function (c) {
      var b = el("button", "chat-item" + (c === current ? " is-on" : ""));
      b.type = "button";
      b.appendChild(avatar({ n: c.name, hue: c.hue }, 36));
      var t = el("div");
      t.appendChild(el("b", "", c.name));
      var last = c.msgs[c.msgs.length - 1];
      t.appendChild(el("small", "", last ? last[0] + ": " + last[1] : ""));
      b.appendChild(t);
      b.addEventListener("click", function () { current = c; renderChatList(); renderThread(); });
      list.appendChild(b);
    });
  }
  function renderThread() {
    $("#chat-title").textContent = current.name;
    $("#chat-members").textContent = current.members;
    var thread = $("#thread"); thread.textContent = "";
    current.msgs.forEach(function (m) {
      var li = el("li", "msg" + (m[2] ? " mine" : ""));
      li.appendChild(el("div", "bubble", m[1]));
      var meta = el("div", "meta");
      meta.appendChild(el("span", "", m[0]));
      if (!m[2]) {
        var r = el("button", "report", "Report");
        r.type = "button";
        r.addEventListener("click", function () { toast("Reported to your school's admins (demo)."); });
        meta.appendChild(r);
      }
      li.appendChild(meta);
      thread.appendChild(li);
    });
    thread.scrollTop = thread.scrollHeight;
  }
  var composer = $("#composer");
  if (composer) composer.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#message-input");
    var text = input.value.trim();
    if (!text) return;
    current.msgs.push(["Coach", text, true]);
    input.value = "";
    renderChatList(); renderThread();
  });
  if ($("#chat-list")) { renderChatList(); renderThread(); }

  /* ---------- calendar ---------- */
  var cal = $("#cal"), monthLabel = $("#month-label");
  if (cal) {
    var y = now.getFullYear(), m = now.getMonth();
    if (monthLabel) monthLabel.textContent = now.toLocaleDateString(undefined, { month: "long" });
    var first = (new Date(y, m, 1).getDay() + 6) % 7;
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < first; i++) cal.appendChild(el("span", "blank"));
    for (var d = 1; d <= daysInMonth; d++) {
      var weekday = (new Date(y, m, d).getDay() + 6) % 7;
      var cls = "";
      if (d === now.getDate()) cls = "today";
      else if (weekday === 5 && d % 14 < 7) cls = "meet";
      else if (d > now.getDate() && d <= now.getDate() + 7 && weekday < 4) cls = "hidden-day";
      else if (d < now.getDate() && weekday < 4) cls = "posted";
      cal.appendChild(el("span", cls, String(d)));
    }
  }

  showView(location.hash.slice(1));
})();
