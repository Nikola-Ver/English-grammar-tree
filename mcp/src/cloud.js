/**
 * Talks to Firebase with the learner's own sign-in (no server, no admin key):
 * exchanges the stored refresh token for an ID token, then uses the Firestore REST API,
 * so the app's security rules apply exactly as they do in the browser.
 */
const TOKEN_URL = process.env.EGT_TOKEN_URL || 'https://securetoken.googleapis.com/v1/token';
const FIRESTORE_URL = process.env.EGT_FIRESTORE_URL || 'https://firestore.googleapis.com/v1';

export function encodeValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number')
    return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encodeValue) } };
  return { mapValue: { fields: encodeFields(v) } };
}

export function encodeFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) if (v !== undefined) fields[k] = encodeValue(v);
  return fields;
}

export function decodeValue(v) {
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('mapValue' in v) return decodeFields(v.mapValue.fields ?? {});
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(decodeValue);
  if ('timestampValue' in v) return Date.parse(v.timestampValue);
  return null;
}

export function decodeFields(fields) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) out[k] = decodeValue(v);
  return out;
}

async function fail(res, what) {
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error?.message ?? '';
  } catch {
    // no JSON body
  }
  const err = new Error(`${what} failed (${res.status}${detail ? `: ${detail}` : ''})`);
  err.status = res.status;
  return err;
}

/** A session for one signed-in learner. `auth` = { uid, rt, key, pid }. */
export function createCloud(auth, onRefreshToken) {
  let idToken = null;
  let expiresAt = 0;

  async function token() {
    if (idToken && Date.now() < expiresAt - 60_000) return idToken;
    const res = await fetch(`${TOKEN_URL}?key=${encodeURIComponent(auth.key)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: auth.rt }),
    });
    if (!res.ok) throw await fail(res, 'Sign-in refresh');
    const body = await res.json();
    idToken = body.id_token;
    expiresAt = Date.now() + Number(body.expires_in ?? 3600) * 1000;
    if (body.refresh_token && body.refresh_token !== auth.rt) {
      auth.rt = body.refresh_token;
      onRefreshToken?.(auth);
    }
    return idToken;
  }

  function docUrl(name) {
    return `${FIRESTORE_URL}/projects/${auth.pid}/databases/(default)/documents/users/${auth.uid}/practice/${name}`;
  }

  /** Read users/{uid}/practice/{name}; null when the document does not exist. */
  async function getDoc(name) {
    const res = await fetch(docUrl(name), { headers: { authorization: `Bearer ${await token()}` } });
    if (res.status === 404) return null;
    if (!res.ok) throw await fail(res, `Reading ${name}`);
    const body = await res.json();
    return decodeFields(body.fields ?? {});
  }

  /**
   * Merge-write: only the listed field paths are touched. A path that is listed but missing
   * from `data` is deleted.
   */
  async function patchDoc(name, data, fieldPaths) {
    const qs = fieldPaths.map((p) => `updateMask.fieldPaths=${encodeURIComponent(p)}`).join('&');
    const res = await fetch(`${docUrl(name)}?${qs}`, {
      method: 'PATCH',
      headers: { authorization: `Bearer ${await token()}`, 'content-type': 'application/json' },
      body: JSON.stringify({ fields: encodeFields(data) }),
    });
    if (!res.ok) throw await fail(res, `Writing ${name}`);
  }

  return { getDoc, patchDoc };
}
