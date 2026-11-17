/** Everything the connector keeps on this computer: the sign-in and a copy of the progress. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const HOME = process.env.EGT_HOME || path.join(os.homedir(), '.english-grammar-tree');
const AUTH_FILE = path.join(HOME, 'auth.json');
const DATA_FILE = path.join(HOME, 'data.json');

function read(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function write(file, value) {
  fs.mkdirSync(HOME, { recursive: true, mode: 0o700 });
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value), { mode: 0o600 });
  fs.renameSync(tmp, file);
}

export function loadAuth() {
  const a = read(AUTH_FILE);
  return a?.uid && a.rt && a.key && a.pid ? a : null;
}

export function saveAuth(auth) {
  write(AUTH_FILE, auth);
}

export function clearLocal() {
  fs.rmSync(AUTH_FILE, { force: true });
  fs.rmSync(DATA_FILE, { force: true });
}

export function emptyData(uid = null) {
  return {
    v: 1,
    uid,
    /** copy of the app's practice state from the last sync */
    state: null,
    /** mistakes already in the cloud */
    log: [],
    /** mistakes logged here and not uploaded yet */
    pending: [],
    /** drills done inside Claude: ruleId → { n, c, t } */
    drills: {},
    syncedAt: 0,
    syncDay: 0,
  };
}

export function loadData(uid) {
  const d = read(DATA_FILE);
  if (!d || d.v !== 1 || (uid && d.uid && d.uid !== uid)) return emptyData(uid);
  return { ...emptyData(uid), ...d, uid: uid ?? d.uid };
}

export function saveData(data) {
  write(DATA_FILE, data);
}
