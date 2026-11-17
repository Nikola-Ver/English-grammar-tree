export interface ConnectRequest {
  port: number;
  state: string;
}

/** `#connect=<port>.<state>` — opened by the local Claude connector (mcp/) to sign in. */
export function parseConnectHash(hash: string = location.hash): ConnectRequest | null {
  const m = hash.match(/^#connect=(\d{4,5})\.([A-Za-z0-9]{16,64})$/);
  if (!m) return null;
  const port = Number(m[1]);
  return port >= 1024 && port <= 65535 ? { port, state: m[2] } : null;
}
