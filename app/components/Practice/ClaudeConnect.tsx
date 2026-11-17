import { useTranslation } from 'react-i18next';
import { useAuthSync } from '../../context/AuthSyncContext';
import { auth } from '../../firebase';

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

interface Props {
  request: ConnectRequest;
  onClose: () => void;
  onSignIn: () => void;
}

/**
 * Asks the signed-in learner to let the connector running on this computer use the account,
 * then hands the session to it on the loopback address. Nothing is sent anywhere else.
 */
export function ClaudeConnect({ request, onClose, onSignIn }: Props) {
  const { t } = useTranslation();
  const { user, authLoading } = useAuthSync();

  function allow() {
    const current = auth.currentUser;
    if (!current) return;
    const options = auth.app.options;
    // The fragment never leaves the browser; the connector's page reads it and clears it.
    const params = new URLSearchParams({
      state: request.state,
      uid: current.uid,
      rt: current.refreshToken,
      key: options.apiKey ?? '',
      pid: options.projectId ?? '',
    });
    location.replace(`http://127.0.0.1:${request.port}/done#${params.toString()}`);
  }

  return (
    <div className="pr-overlay pr-connect" role="dialog" aria-modal="true">
      <div className="pr-connect-box">
        <h3>🤖 {t('practice.claude.connectTitle')}</h3>
        {authLoading ? (
          <p>{t('common.loading')}</p>
        ) : user ? (
          <>
            <p>{t('practice.claude.connectBody')}</p>
            <p className="pr-claude-hint">{t('practice.claude.connectWarn')}</p>
            <div className="pr-actions">
              <button type="button" className="pr-btn primary" onClick={allow}>
                {t('practice.claude.connectAllow')}
              </button>
              <button type="button" className="pr-btn ghost" onClick={onClose}>
                {t('practice.claude.connectCancel')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p>{t('practice.claude.connectSignIn')}</p>
            <div className="pr-actions">
              <button type="button" className="pr-btn primary" onClick={onSignIn}>
                {t('practice.claude.signIn')}
              </button>
              <button type="button" className="pr-btn ghost" onClick={onClose}>
                {t('practice.claude.connectCancel')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
