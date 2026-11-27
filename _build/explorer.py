"""Left menu / right panel explorer used by features, athletes and coaches pages.

Without JavaScript every panel shows in order. With it, one panel shows at a time,
the menu marks the current item with aria-current, and the address bar hash follows
so any item can be linked to directly.
"""
from html import escape as e

PHONE = '<figure class="ex-shot"><div class="phone"><img src="{src}" width="520" height="1127" loading="lazy" alt="{alt}"></div></figure>'
WEB = '<figure class="ex-shot ex-web"><div class="browser"><span aria-hidden="true"></span><img src="{src}" width="1100" height="739" loading="lazy" alt="{alt}"></div></figure>'


def shot(img, alt):
    if not img:
        return ''
    tpl = WEB if img.startswith('web-') else PHONE
    return tpl.format(src=f'img/f/{img}.webp', alt=e(alt))


def explorer(items, label, search=False, total_word='items'):
    """items: list of dicts with id, label, group (optional), html, img, alt."""
    nav = [f'<nav class="ex-nav" aria-label="{e(label)}">']
    if search:
        nav.append(f'<label class="visually-hidden" for="ex-q">Search</label><input class="doc-search" id="ex-q" type="search" placeholder="Search {len(items)} {total_word}" autocomplete="off"><p class="doc-count" id="ex-count" role="status" aria-live="polite"></p>')
    group = object()
    nav.append('<div class="ex-list">')
    for it in items:
        g = it.get('group')
        if g != group:
            if nav[-1] != '<div class="ex-list">':
                nav.append('</ul>')
            if g:
                nav.append(f'<p class="ex-grp">{e(g)}</p>')
            nav.append('<ul>')
            group = g
        nav.append(f'<li><a href="#{it["id"]}" data-ex="{it["id"]}">{e(it["label"])}</a></li>')
    nav.append('</ul></div><p class="ex-empty" id="ex-empty" hidden>Nothing matches. Try another word.</p></nav>')

    panels = ['<div class="ex-panels">']
    for it in items:
        panels.append(
            f'<section class="ex-panel" id="{it["id"]}" aria-labelledby="{it["id"]}-h" tabindex="-1">'
            f'<div class="ex-text">{it["html"]}</div>{shot(it.get("img"), it.get("alt", ""))}</section>'
        )
    panels.append('</div>')
    return f'<div class="explorer" data-explorer>{"".join(nav)}{"".join(panels)}</div>'


SCRIPT = """<script>
(function () {
  var ex = document.querySelector("[data-explorer]"); if (!ex) return;
  ex.classList.add("is-live");
  var links = Array.prototype.slice.call(ex.querySelectorAll("[data-ex]"));
  var panels = Array.prototype.slice.call(ex.querySelectorAll(".ex-panel"));
  function show(id, focus) {
    var p = document.getElementById(id);
    if (!p || panels.indexOf(p) === -1) { id = panels[0].id; p = panels[0]; }
    panels.forEach(function (x) { x.hidden = x !== p; });
    links.forEach(function (a) {
      var on = a.getAttribute("data-ex") === id;
      if (on) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
      if (on && a.scrollIntoView && window.matchMedia("(max-width: 900px)").matches) a.scrollIntoView({ block: "nearest", inline: "center" });
    });
    if (focus) {
      var h = p.querySelector("h2"); (h || p).setAttribute("tabindex", "-1"); (h || p).focus({ preventScroll: true });
      var top = ex.getBoundingClientRect().top + window.scrollY - 90;
      if (window.scrollY > top) window.scrollTo({ top: top });
    }
  }
  links.forEach(function (a) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      var id = a.getAttribute("data-ex");
      if (history.replaceState) history.replaceState(null, "", "#" + id);
      show(id, true);
    });
  });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1), true); });
  show(location.hash.slice(1), false);

  var q = document.getElementById("ex-q");
  if (q) {
    var count = document.getElementById("ex-count"), empty = document.getElementById("ex-empty");
    q.addEventListener("input", function () {
      var t = q.value.trim().toLowerCase(), shown = 0, first = null;
      links.forEach(function (a) {
        var p = document.getElementById(a.getAttribute("data-ex"));
        var hit = !t || (a.textContent + " " + p.textContent).toLowerCase().indexOf(t) !== -1;
        a.parentNode.hidden = !hit; if (hit) { shown++; if (!first) first = a; }
      });
      Array.prototype.slice.call(ex.querySelectorAll(".ex-list ul")).forEach(function (ul) {
        var any = ul.querySelector("li:not([hidden])");
        ul.hidden = !any; if (ul.previousElementSibling && ul.previousElementSibling.classList.contains("ex-grp")) ul.previousElementSibling.hidden = !any;
      });
      count.textContent = t ? shown + (shown === 1 ? " match" : " matches") : "";
      empty.hidden = shown !== 0;
      if (first && t) show(first.getAttribute("data-ex"), false);
    });
  }
})();
</script>
"""
