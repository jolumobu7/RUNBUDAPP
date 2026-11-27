import pathlib
from chrome import page, APP_STORE
from explorer import SCRIPT as EX_SCRIPT
import pages_ex

SITE = pathlib.Path(__file__).resolve().parent.parent
P = pathlib.Path(__file__).parent / 'pages'
r = lambda n: (P / n).read_text().replace('{APP_STORE}', APP_STORE).replace('{RADAR}', (P / 'radar.svg.html').read_text())


def policy(name, current=None):
    title, desc = (P / f'{name}.meta').read_text().split('\n', 1)
    body = r(f'{name}.main.html')
    cls = '' if name == 'about' else ' class="policy"'
    return page(title, desc.strip(), f'  <main id="main"{cls}>{body}</main>\n\n', current)


pages = {
    'index.html': page('RunBud: a training plan built around your real week',
                       'RunBud Coach builds and adjusts track and field training from your PRs, history and how you feel. Free for athletes, coaches and schools.',
                       r('index.body.html'), scripts=r('index.script.html')),
    'account.html': page('Create an account | RunBud', 'Create your free RunBud account or sign in. One account for the app and the website.',
                         r('account.body.html'), 'signin', scripts=r('account.script.html')),
    'delete-account.html': page('Delete your account | RunBud', 'How to delete your RunBud account and the data that goes with it.',
                                r('delete.body.html'), scripts=r('delete.script.html')),
    'coaches.html': page('For coaches and schools | RunBud', 'How RunBud works for coaches, athletic trainers, nutritionists and school administrators: teams, sharing, posting workouts, the web hub and message safety.', pages_ex.coaches_body(r('coaches.body.html')), 'coaches', scripts=EX_SCRIPT),
    'athletes.html': page('For athletes | RunBud', 'How RunBud works for athletes: Today, RunBud Coach, logging, recovery, progress, teams and sharing, and privacy.', pages_ex.athletes_body(r('athletes.body.html')), 'athletes', scripts=EX_SCRIPT),
    'features.html': page('Every feature | RunBud', 'Documentation for every feature in RunBud 2.0: where to find it and what it does.', pages_ex.features_body(APP_STORE), 'features', scripts=EX_SCRIPT),
    'support.html': page('Support | RunBud', 'Get help with RunBud: report a bug, report a message, reset your password or delete your account.',
                         r('support.body.html'), 'support'),
    'about.html': policy('about', 'about'),
}
for n in ['community', 'data', 'privacy', 'terms', 'child-safety']:
    pages[f'{n}.html'] = policy(n)

for name, html in pages.items():
    (SITE / name).write_text(html)
    print('wrote', name)
