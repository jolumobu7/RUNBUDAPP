import pathlib
from chrome import page, APP_STORE

SITE = pathlib.Path(__file__).resolve().parent.parent
P = pathlib.Path(__file__).parent / 'pages'
r = lambda n: (P / n).read_text().replace('{APP_STORE}', APP_STORE)


def policy(name, current=None):
    title, desc = (P / f'{name}.meta').read_text().split('\n', 1)
    body = r(f'{name}.main.html')
    cls = '' if name == 'about' else ' class="policy"'
    return page(title, desc.strip(), f'  <main id="main"{cls}>{body}</main>\n\n', current)


pages = {
    'index.html': page('RunBud: a training plan built around your real week',
                       'RunBud Coach builds and adjusts track and field training from your PRs, history and how you feel. Free for athletes, coaches and schools.',
                       r('index.body.html')),
    'account.html': page('Create an account | RunBud', 'Create your free RunBud account or sign in. One account for the app and the website.',
                         r('account.body.html'), 'signin', scripts=r('account.script.html')),
    'delete-account.html': page('Delete your account | RunBud', 'How to delete your RunBud account and the data that goes with it.',
                                r('delete.body.html'), scripts=r('delete.script.html')),
    'support.html': page('Support | RunBud', 'Get help with RunBud: report a bug, report a message, reset your password or delete your account.',
                         r('support.body.html'), 'support'),
    'about.html': policy('about', 'about'),
}
for n in ['community', 'data', 'privacy', 'terms', 'child-safety']:
    pages[f'{n}.html'] = policy(n)

for name, html in pages.items():
    (SITE / name).write_text(html)
    print('wrote', name)
