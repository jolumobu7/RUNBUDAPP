"""Builds the explorer versions of features.html, athletes.html and coaches.html."""
import re
import pathlib
from html import escape as e
from explorer import explorer
from features_data import G

P = pathlib.Path(__file__).parent / 'pages'

# Screenshot for each feature (files in img/f/). Web ones come from the coach dashboard demo.
IMG = {
    'today': 'today', 'runbud-coach': 'runbud-coach', 'plan': 'plan', 'session': 'session', 'timer': 'timer',
    'strength': 'strength', 'stretch': 'stretch', 'meets': 'meets', 'checkin': 'checkin', 'readiness': 'readiness',
    'injuries': 'injuries', 'sleep': 'sleep', 'hydration': 'hydration', 'widgets': 'hydration', 'fueling': 'fueling',
    'mental': 'mental', 'insights': 'insights', 'review': 'review', 'results': 'results', 'tests': 'tests',
    'tables': 'tables', 'watch': 'watch', 'join': 'join', 'sharing': 'join', 'post': 'post', 'roster': 'web-athletes',
    'hub': 'web-dashboard', 'selfcoached': 'join', 'goals': 'goals', 'chats': 'web-messages', 'safety': 'chats',
    'report': 'web-messages', 'school-create': 'school-create', 'school-review': 'school-review', 'guide': 'guide',
    'email': 'email', 'schools-match': 'schools-match', 'scholarships': 'scholarships', 'forum': 'forum',
    'profile': 'profile', 'reminders': 'reminders', 'backup': 'backup', 'shoes': 'shoes', 'shop': 'shop', 'delete': 'delete',
}
WEB_ALT = {
    'web-athletes': 'The coach hub athletes table: each athlete with event group, sessions done, load, sleep, soreness and best mark.',
    'web-dashboard': 'The coach hub dashboard: athletes, sessions done, team minutes, check-in flags, team load, plan versus done, today\'s workout and athletes who need attention.',
    'web-messages': 'Team messages in the coach hub, with a sprints group chat and a note that school administrators can see the chat.',
    'web-plan': 'The week plan in the coach hub, with a workout for each day, the group it is for and when athletes can see it.',
}


def alt_for(img, title):
    return WEB_ALT.get(img, f'The {title} screen in RunBud 2.0.')


def features_body(APP_STORE):
    items = []
    total = 0
    for gid, gname, gintro, feats in G:
        for fid, name, where, desc, bul in feats:
            total += 1
            lis = ''.join(f'<li>{e(b)}</li>' for b in bul)
            html = (f'<p class="ex-kicker">{e(gname)}</p><h2 id="f-{fid}-h">{e(name)}</h2>'
                    f'<p class="where">Where: {e(where)}</p><p class="ex-lede">{e(desc)}</p>'
                    + (f'<ul class="ticks">{lis}</ul>' if bul else ''))
            img = IMG.get(fid)
            items.append({'id': f'f-{fid}', 'label': name, 'group': gname, 'html': html, 'img': img, 'alt': alt_for(img, name)})
    ex = explorer(items, 'All features', search=True, total_word='features')
    return f'''  <main id="main">
    <section class="page-hero" aria-labelledby="page-title">
      <div class="wrap">
        <div class="hero-card hero-slim">
          <div>
            <p class="eyebrow">Documentation</p>
            <h1 id="page-title">Every feature in RunBud</h1>
            <p class="lede">All {total} features in RunBud 2.0. Pick one on the left to see the screen, where to find it and what it does.</p>
          </div>
        </div>
      </div>
    </section>
    <div class="wrap ex-wrap">{ex}</div>
  </main>

'''


SEC = re.compile(r'<section class="doc-sec" id="([^"]+)" aria-labelledby="([^"]+)">\s*<div class="wrap[^"]*">(.*?)</div>\s*</section>', re.S)
PHONE_RE = re.compile(r'\s*<div class="phone"><img [^>]*></div>')


def convert(body, label, img_map, labels):
    """Turn a page's doc-sec sections into explorer panels. Keeps the hero and finish."""
    hero_end = body.index('<nav class="subnav"')
    nav_end = body.index('</nav>', hero_end) + len('</nav>')
    first = body.index('<section class="doc-sec"')
    last_m = list(SEC.finditer(body))[-1]
    items = []
    for m in SEC.finditer(body):
        sid, hid, inner = m.group(1), m.group(2), m.group(3)
        inner = PHONE_RE.sub('', inner)
        inner = inner.replace('<div class="split">', '<div>').replace(f'id="{hid}"', f'id="{sid}-h"')
        inner = re.sub(r'^\s*<div>\s*', '', inner) if inner.lstrip().startswith('<div>') and 'media-row' not in m.group(0) and False else inner
        img = img_map.get(sid)
        items.append({'id': sid, 'label': labels.get(sid, sid), 'html': inner, 'img': img, 'alt': alt_for(img, labels.get(sid, sid))})
    ex = explorer(items, label)
    return body[:hero_end] + f'<div class="wrap ex-wrap">{ex}</div>\n' + body[last_m.end():]


def athletes_body(src):
    return convert(src, 'For athletes', {
        'today': 'today', 'ways': 'join', 'runbud-coach': 'runbud-coach', 'log': 'session', 'recovery': 'checkin',
        'progress': 'insights', 'sharing': 'join', 'more': 'guide', 'privacy': 'watch',
    }, {
        'today': 'Your day', 'ways': 'With or without a coach', 'runbud-coach': 'RunBud Coach', 'log': 'Logging',
        'recovery': 'Recovery', 'progress': 'Progress', 'sharing': 'Teams and sharing', 'more': 'Learn and recruiting', 'privacy': 'Privacy',
    })


def coaches_body(src):
    return convert(src, 'For coaches and schools', {
        'setup': 'web-dashboard', 'roles': 'join', 'see': 'web-athletes', 'post': 'web-plan', 'hub': 'web-dashboard',
        'messages': 'web-messages', 'admins': 'school-review', 'coach-faq': 'post',
    }, {
        'setup': 'Set up a team', 'roles': 'Roles', 'see': 'What you see', 'post': 'Posting workouts', 'hub': 'The hub on the web',
        'messages': 'Messages and safety', 'admins': 'Administrators', 'coach-faq': 'Questions',
    })
