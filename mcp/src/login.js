/**
 * Sign-in without a server: the connector listens on the loopback address, opens the app in
 * the browser, and the app (where the learner is already signed in) hands the session back
 * after the learner clicks "Allow". A random state value ties the answer to this request.
 */
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import http from 'node:http';

const APP_URL = (process.env.EGT_APP_URL || 'https://english-tree-garmmar.web.app').replace(
  /\/$/,
  '',
);
const LISTEN_MS = 5 * 60_000;

const PAGE = `<!doctype html><meta charset="utf-8"><title>English Grammar Tree</title>
<body style="font-family:system-ui;max-width:420px;margin:15vh auto;padding:0 16px;text-align:center">
<h2 id="m">Connecting…</h2><p id="d"></p>
<script>
const p = new URLSearchParams(location.hash.slice(1));
history.replaceState(null, '', location.pathname);
fetch('/token', { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(p)) })
  .then((r) => { if (!r.ok) throw new Error(); m.textContent = 'Connected ✓';
    d.textContent = 'You can close this tab and go back to Claude.'; })
  .catch(() => { m.textContent = 'Could not connect';
    d.textContent = 'Go back to Claude and start the connection again.'; });
</script>`;

function openBrowser(url) {
  if (process.env.EGT_NO_BROWSER) return;
  const [cmd, args] =
    process.platform === 'darwin'
      ? ['open', [url]]
      : process.platform === 'win32'
        ? ['cmd', ['/c', 'start', '', url]]
        : ['xdg-open', [url]];
  try {
    spawn(cmd, args, { stdio: 'ignore', detached: true })
      .on('error', () => {})
      .unref();
  } catch {
    // the URL is also returned to Claude, the learner can open it by hand
  }
}

let active = null;

/** Starts (or reuses) a sign-in attempt. Returns { url, done } — `done` resolves with the auth. */
export function startLogin() {
  if (active) return active;
  const state = randomBytes(16).toString('hex');
  let finish;
  const done = new Promise((resolve) => {
    finish = resolve;
  });
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url?.startsWith('/done')) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
      res.end(PAGE);
      return;
    }
    if (req.method === 'POST' && req.url === '/token') {
      let body = '';
      req.on('data', (c) => {
        body += c;
        if (body.length > 20_000) req.destroy();
      });
      req.on('end', () => {
        let p = null;
        try {
          p = JSON.parse(body);
        } catch {
          // handled below
        }
        if (!p || p.state !== state || !p.uid || !p.rt || !p.key || !p.pid) {
          res.writeHead(400).end();
          return;
        }
        res.writeHead(204).end();
        close();
        finish({ uid: p.uid, rt: p.rt, key: p.key, pid: p.pid });
      });
      return;
    }
    res.writeHead(404).end();
  });
  const timer = setTimeout(() => {
    close();
    finish(null);
  }, LISTEN_MS);
  function close() {
    clearTimeout(timer);
    server.close();
    server.closeAllConnections?.();
    active = null;
  }
  const ready = new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const url = `${APP_URL}/#connect=${server.address().port}.${state}`;
      openBrowser(url);
      resolve(url);
    });
  });
  active = { url: ready, done };
  return active;
}
