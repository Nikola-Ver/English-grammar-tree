import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BADGES } from '../../practice/achievements';
import { dayNumber } from '../../practice/srs';
import {
  type AddResult,
  acceptFriend,
  addFriendByCode,
  addFriendByUid,
  type Board,
  inviteUrl,
  liveStreak,
  liveWeekXp,
  loadBoard,
  normalizeCode,
  type PublicProfile,
  removeFriendship,
  searchPeople,
  updateMyProfile,
  type Visibility,
  weekKey,
} from '../../social/social';
import { useSocial } from '../../social/stats';
import { copyToClipboard } from '../../utils/clipboard';
import './Social.css';

interface Props {
  signedIn: boolean;
  onSignIn: () => void;
  /** friend code from an invite link */
  inviteCode: string | null;
  onInviteConsumed: () => void;
}

type Metric = 'week' | 'xp' | 'streak';

const AVATAR_COLORS = [
  '#818cf8',
  '#f472b6',
  '#38bdf8',
  '#4ade80',
  '#fb923c',
  '#facc15',
  '#a78bfa',
  '#2dd4bf',
];

function colorFor(uid: string): string {
  let h = 0;
  for (let i = 0; i < uid.length; i++) h = (h * 31 + uid.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function Avatar({
  p,
  size = 36,
}: {
  p: Pick<PublicProfile, 'uid' | 'name' | 'photo'>;
  size?: number;
}) {
  const [broken, setBroken] = useState(false);
  if (p.photo && !broken) {
    return (
      <img
        className="so-avatar"
        src={p.photo}
        alt=""
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <span
      className="so-avatar so-avatar-letter"
      style={{ width: size, height: size, background: colorFor(p.uid), fontSize: size * 0.42 }}
      aria-hidden="true"
    >
      {p.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function LeaderboardPanel({ signedIn, onSignIn, inviteCode, onInviteConsumed }: Props) {
  const { t } = useTranslation();
  const social = useSocial();
  const [board, setBoard] = useState<Board>('friends');
  const [metric, setMetric] = useState<Metric>('week');
  const [rows, setRows] = useState<PublicProfile[] | null>(null);
  const [error, setError] = useState(false);
  const today = dayNumber();
  const week = weekKey(today);

  const acceptedCount = social.friendships.filter((f) => f.status === 'accepted').length;

  const load = useCallback(
    async (fresh = false) => {
      if (!social.uid || !social.ready) return;
      setError(false);
      try {
        setRows(await loadBoard(board, week, fresh));
      } catch {
        setError(true);
        setRows([]);
      }
    },
    [board, week, social.uid, social.ready],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: reload when the friend list changes
  useEffect(() => {
    void load();
  }, [load, acceptedCount]);

  const effectiveMetric: Metric =
    board === 'weekGlobal' ? 'week' : board === 'xpGlobal' ? 'xp' : metric;
  const sorted = useMemo(() => {
    if (!rows) return null;
    const value = (p: PublicProfile) =>
      effectiveMetric === 'week'
        ? liveWeekXp(p, week)
        : effectiveMetric === 'streak'
          ? liveStreak(p, today)
          : p.xp;
    const merged = rows.map((p) => (p.uid === social.uid && social.me ? social.me : p));
    return merged.map((p) => ({ p, v: value(p) })).sort((a, b) => b.v - a.v || b.p.xp - a.p.xp);
  }, [rows, effectiveMetric, week, today, social.uid, social.me]);

  if (!signedIn) {
    return (
      <div className="so-signin">
        <div className="so-signin-art">🏆</div>
        <h3>{t('social.signInTitle')}</h3>
        <p>{t('social.signInText')}</p>
        <button type="button" className="pr-btn primary" onClick={onSignIn}>
          {t('social.signIn')}
        </button>
      </div>
    );
  }

  const myIndex = sorted?.findIndex((r) => r.p.uid === social.uid) ?? -1;

  return (
    <div className="so-wrap">
      <div className="so-board-card">
        <div className="pr-seg so-board-switch" role="tablist">
          {(['friends', 'weekGlobal', 'xpGlobal'] as Board[]).map((b) => (
            <button
              key={b}
              type="button"
              role="tab"
              aria-selected={board === b}
              className={board === b ? 'on' : ''}
              onClick={() => {
                setRows(null);
                setBoard(b);
              }}
            >
              {t(`social.board.${b}`)}
            </button>
          ))}
        </div>
        {board === 'friends' && (
          <div className="pr-chips so-metrics">
            {(['week', 'xp', 'streak'] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                className={`pr-chip-filter${metric === m ? ' on' : ''}`}
                onClick={() => setMetric(m)}
              >
                {t(`social.metric.${m}`)}
              </button>
            ))}
          </div>
        )}

        {error && <div className="so-note">{t('social.unavailable')}</div>}
        {!error && sorted === null && <div className="so-note">{t('common.loading')}</div>}
        {!error && sorted && board === 'friends' && sorted.length <= 1 && (
          <div className="so-empty">
            <span>👋</span>
            <p>{t('social.noFriends')}</p>
          </div>
        )}
        {!error && sorted && (sorted.length > 1 || board !== 'friends') && (
          <ol className="so-list">
            {sorted.map(({ p, v }, i) => {
              const me = p.uid === social.uid;
              const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : String(i + 1);
              return (
                <li key={p.uid} className={`so-row${me ? ' me' : ''}${i < 3 ? ' top' : ''}`}>
                  <span className="so-rank">{medal}</span>
                  <Avatar p={p} />
                  <span className="so-who">
                    <b>
                      {p.name}
                      {me && <em className="so-you">{t('social.you')}</em>}
                    </b>
                    <small>
                      <span className="so-lvl">Lv {p.level}</span>
                      <span>🔥 {liveStreak(p, today)}</span>
                      <span>🌸 {p.mastered}</span>
                      <span className="so-badges" title={t('social.badgesCount', { n: p.badges })}>
                        {p.topBadges
                          .slice(0, 3)
                          .map((id) => BADGES.find((b) => b.id === id)?.icon ?? '')
                          .join('')}
                      </span>
                    </small>
                  </span>
                  <span className="so-value">
                    {v}
                    <small>{effectiveMetric === 'streak' ? t('social.days') : 'XP'}</small>
                  </span>
                </li>
              );
            })}
            {myIndex < 0 && social.me && board !== 'friends' && (
              <li className="so-row me detached">
                <span className="so-rank">…</span>
                <Avatar p={social.me} />
                <span className="so-who">
                  <b>
                    {social.me.name}
                    <em className="so-you">{t('social.you')}</em>
                  </b>
                  <small>
                    {social.me.visibility === 'friends'
                      ? t('social.hiddenFromEveryone')
                      : t('social.notInTop')}
                  </small>
                </span>
                <span className="so-value">
                  {effectiveMetric === 'week' ? liveWeekXp(social.me, week) : social.me.xp}
                  <small>XP</small>
                </span>
              </li>
            )}
          </ol>
        )}
        <div className="so-foot">
          <span>
            {board === 'weekGlobal' || effectiveMetric === 'week' ? t('social.weekResets') : ''}
          </span>
          <button type="button" className="pr-btn small ghost" onClick={() => void load(true)}>
            ↻ {t('social.refresh')}
          </button>
        </div>
      </div>

      <FriendsPanel inviteCode={inviteCode} onInviteConsumed={onInviteConsumed} />
    </div>
  );
}

// ---------------------------------------------------------------------------

function FriendsPanel({
  inviteCode,
  onInviteConsumed,
}: {
  inviteCode: string | null;
  onInviteConsumed: () => void;
}) {
  const { t } = useTranslation();
  const social = useSocial();
  const [input, setInput] = useState(inviteCode ?? '');
  const [results, setResults] = useState<PublicProfile[]>([]);
  const [status, setStatus] = useState<AddResult | 'searching' | null>(null);
  const [copied, setCopied] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState('');
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  useEffect(() => {
    if (inviteCode) {
      setInput(inviteCode);
      onInviteConsumed();
    }
  }, [inviteCode, onInviteConsumed]);

  const looksLikeCode = /^[A-Za-z0-9]{8}$/.test(input.trim()) && /\d/.test(input);

  // name search (debounced)
  useEffect(() => {
    const q = input.trim();
    if (looksLikeCode || q.length < 2) {
      setResults([]);
      return;
    }
    const id = setTimeout(async () => {
      setStatus('searching');
      try {
        setResults(await searchPeople(q));
        setStatus(null);
      } catch {
        setStatus('error');
      }
    }, 450);
    return () => clearTimeout(id);
  }, [input, looksLikeCode]);

  async function addCode() {
    setStatus('searching');
    setStatus(await addFriendByCode(input));
  }

  async function addUid(uid: string) {
    setStatus('searching');
    setStatus(await addFriendByUid(uid));
  }

  const me = social.me;
  const incoming = social.friendships.filter((f) => f.status === 'pending' && f.to === social.uid);
  const outgoing = social.friendships.filter(
    (f) => f.status === 'pending' && f.from === social.uid,
  );
  const friends = social.friendships.filter((f) => f.status === 'accepted');
  const person = (uid: string): Pick<PublicProfile, 'uid' | 'name' | 'photo'> =>
    social.people[uid] ?? { uid, name: t('social.someone'), photo: null };

  async function share() {
    if (!me) return;
    const url = inviteUrl(me.code);
    const text = t('social.inviteText', { code: me.code });
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title: 'English Grammar Tree', text, url });
        return;
      } catch {
        // fall back to copy
      }
    }
    await copyToClipboard(`${text} ${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="so-friends">
      {incoming.length > 0 && (
        <div className="so-card so-requests">
          <div className="pr-section-label">📨 {t('social.requests', { n: incoming.length })}</div>
          {incoming.map((f) => {
            const p = person(f.other);
            return (
              <div key={f.id} className="so-person">
                <Avatar p={p} size={32} />
                <span className="so-person-name">{p.name}</span>
                <button
                  type="button"
                  className="pr-btn small primary"
                  onClick={() => void acceptFriend(f.id)}
                >
                  {t('social.accept')}
                </button>
                <button
                  type="button"
                  className="pr-btn small ghost"
                  onClick={() => void removeFriendship(f.id)}
                >
                  {t('social.decline')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="so-card">
        <div className="pr-section-label">➕ {t('social.addTitle')}</div>
        <form
          className="so-add"
          onSubmit={(e) => {
            e.preventDefault();
            if (looksLikeCode) void addCode();
          }}
        >
          <input
            className="pr-input so-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setStatus(null);
            }}
            placeholder={t('social.addPlaceholder')}
            aria-label={t('social.addPlaceholder')}
            autoComplete="off"
            spellCheck={false}
          />
          <button type="submit" className="pr-btn primary" disabled={!looksLikeCode}>
            {t('social.add')}
          </button>
        </form>
        {looksLikeCode && (
          <div className="so-hint">{t('social.codeHint', { code: normalizeCode(input) })}</div>
        )}
        {status && status !== 'searching' && (
          <div
            className={`so-status ${status === 'sent' || status === 'accepted' ? 'ok' : 'warn'}`}
          >
            {t(`social.result.${status}`)}
          </div>
        )}
        {results.length > 0 && (
          <div className="so-results">
            {results.map((p) => {
              const existing = social.friendships.find((f) => f.other === p.uid);
              return (
                <div key={p.uid} className="so-person">
                  <Avatar p={p} size={32} />
                  <span className="so-person-name">
                    {p.name}
                    <small>
                      Lv {p.level} · {p.xp} XP
                    </small>
                  </span>
                  {existing ? (
                    <span className="so-tag">
                      {existing.status === 'accepted' ? t('social.friend') : t('social.pending')}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="pr-btn small primary"
                      onClick={() => void addUid(p.uid)}
                    >
                      {t('social.add')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {me && (
          <div className="so-mycode">
            <div>
              <small>{t('social.yourCode')}</small>
              <code>{me.code}</code>
            </div>
            <button type="button" className="pr-btn small ghost" onClick={() => void share()}>
              {copied ? t('copied') : `🔗 ${t('social.invite')}`}
            </button>
          </div>
        )}
      </div>

      {(friends.length > 0 || outgoing.length > 0) && (
        <div className="so-card">
          <div className="pr-section-label">
            👥 {t('social.friendsTitle', { n: friends.length })}
          </div>
          {friends.map((f) => {
            const p = person(f.other);
            return (
              <div key={f.id} className="so-person">
                <Avatar p={p} size={32} />
                <span className="so-person-name">{p.name}</span>
                {confirmRemove === f.id ? (
                  <>
                    <button
                      type="button"
                      className="pr-btn small danger"
                      onClick={() => void removeFriendship(f.id)}
                    >
                      {t('social.removeConfirm')}
                    </button>
                    <button
                      type="button"
                      className="pr-btn small ghost"
                      onClick={() => setConfirmRemove(null)}
                    >
                      {t('practice.settings.cancel')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="pr-btn small ghost so-remove"
                    onClick={() => setConfirmRemove(f.id)}
                    aria-label={t('social.remove')}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
          {outgoing.map((f) => {
            const p = person(f.other);
            return (
              <div key={f.id} className="so-person muted">
                <Avatar p={p} size={32} />
                <span className="so-person-name">
                  {p.name}
                  <small>{t('social.pending')}</small>
                </span>
                <button
                  type="button"
                  className="pr-btn small ghost"
                  onClick={() => void removeFriendship(f.id)}
                >
                  {t('social.cancelRequest')}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {me && (
        <div className="so-card so-me">
          <div className="pr-section-label">🪪 {t('social.yourCard')}</div>
          <div className="so-person">
            <Avatar p={me} size={40} />
            {editingName ? (
              <form
                className="so-add"
                onSubmit={(e) => {
                  e.preventDefault();
                  void updateMyProfile({ name });
                  setEditingName(false);
                }}
              >
                <input
                  className="pr-input so-input"
                  value={name}
                  maxLength={24}
                  onChange={(e) => setName(e.target.value)}
                  aria-label={t('social.nameLabel')}
                />
                <button type="submit" className="pr-btn small primary" disabled={!name.trim()}>
                  {t('social.save')}
                </button>
              </form>
            ) : (
              <>
                <span className="so-person-name">
                  {me.name}
                  <small>
                    Lv {me.level} · {me.xp} XP · 🔥 {me.streak}
                  </small>
                </span>
                <button
                  type="button"
                  className="pr-btn small ghost"
                  onClick={() => {
                    setName(me.name);
                    setEditingName(true);
                  }}
                >
                  ✎ {t('social.rename')}
                </button>
              </>
            )}
          </div>
          <div className="pr-setting">
            <span>{t('social.visibility')}</span>
            <div className="pr-seg">
              {(['everyone', 'friends'] as Visibility[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  className={me.visibility === v ? 'on' : ''}
                  onClick={() => void updateMyProfile({ visibility: v })}
                >
                  {t(`social.vis.${v}`)}
                </button>
              ))}
            </div>
          </div>
          <p className="so-privacy">{t('social.privacy')}</p>
        </div>
      )}
    </div>
  );
}
