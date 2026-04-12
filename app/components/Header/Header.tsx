import { useEffect, useRef, useState } from 'react';
import type { SyncStatus } from '../../context/AuthSyncContext';
import { useAuthSync } from '../../context/AuthSyncContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import './Header.css';
import { useTranslation } from 'react-i18next';

interface Props {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onAvatarClick: () => void;
  onTitleClick: () => void;
}

function SyncStatusDot({ status }: { status: SyncStatus }) {
  if (status === 'idle') return null;
  return <span className={`avatar-sync-dot avatar-sync-dot--${status}`} aria-hidden="true" />;
}

function Avatar({ altAvatar }: { altAvatar: string }) {
  const { user, syncStatus } = useAuthSync();

  if (user?.photoURL) {
    return (
      <span className="avatar-img-wrap">
        <img
          className="avatar-img"
          src={user.photoURL}
          alt={user.displayName ?? altAvatar}
          referrerPolicy="no-referrer"
        />
        <SyncStatusDot status={syncStatus} />
      </span>
    );
  }

  if (user) {
    const name = user.displayName ?? user.email ?? '';
    const initial = name[0]?.toUpperCase() ?? '?';
    return (
      <span className="avatar-initials-wrap">
        <span className="avatar-initials">{initial}</span>
        <SyncStatusDot status={syncStatus} />
      </span>
    );
  }

  return (
    <span className="avatar-icon-wrap">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </span>
  );
}

export function Header({ theme, onToggleTheme, onAvatarClick, onTitleClick }: Props) {
  const { user } = useAuthSync();
  const { t, i18n } = useTranslation();
  const langCode = i18n.language.split('-')[0];
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
  const currentLabel = current?.label ?? langCode.toUpperCase();
  const currentLangHint = current?.hint ?? t('header.language');

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [langMenuMounted, setLangMenuMounted] = useState(false);
  const [langMenuVisible, setLangMenuVisible] = useState(false);
  const langWrapRef = useRef<HTMLDivElement>(null);
  const langMenuOpenRef = useRef(langMenuOpen);
  const langMenuVisibleRef = useRef(langMenuVisible);
  const langMenuReachedVisibleRef = useRef(false);
  langMenuOpenRef.current = langMenuOpen;
  langMenuVisibleRef.current = langMenuVisible;

  useEffect(() => {
    if (langMenuOpen) {
      langMenuReachedVisibleRef.current = false;
      setLangMenuMounted(true);
      let innerRaf = 0;
      const outerRaf = requestAnimationFrame(() => {
        innerRaf = requestAnimationFrame(() => {
          langMenuReachedVisibleRef.current = true;
          setLangMenuVisible(true);
        });
      });
      return () => {
        cancelAnimationFrame(outerRaf);
        if (innerRaf) cancelAnimationFrame(innerRaf);
      };
    }
    setLangMenuVisible(false);
    if (!langMenuReachedVisibleRef.current) {
      setLangMenuMounted(false);
    }
  }, [langMenuOpen]);

  function handleLangMenuTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity') return;
    if (!langMenuVisibleRef.current && !langMenuOpenRef.current) {
      setLangMenuMounted(false);
    }
  }

  useEffect(() => {
    if (!langMenuOpen) return;
    function onDocPointerDown(ev: PointerEvent) {
      if (langWrapRef.current?.contains(ev.target as Node)) return;
      setLangMenuOpen(false);
    }
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') setLangMenuOpen(false);
    }
    document.addEventListener('pointerdown', onDocPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDocPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [langMenuOpen]);

  return (
    <header>
      <div className="header-top">
        <div className="title-block">
          <h1>
            <button type="button" className="title-btn" onClick={onTitleClick}>
              {t('header.titlePrefix')}
              <span>{t('header.titleAccent')}</span>
              {t('header.titleSuffix')}
            </button>
          </h1>
        </div>
        <div className="header-controls">
          <div className="lang-select-wrap" ref={langWrapRef}>
            <button
              type="button"
              className="lang-select-surface lang-select-trigger"
              aria-label={t('header.language')}
              aria-expanded={langMenuOpen}
              aria-haspopup="listbox"
              aria-controls="app-lang-listbox"
              title={currentLangHint}
              onClick={() => setLangMenuOpen((o) => !o)}
            >
              <span className="lang-select-code">{currentLabel}</span>
            </button>
            {langMenuMounted && (
              <div
                id="app-lang-listbox"
                className={`lang-menu${langMenuVisible ? ' lang-menu--visible' : ''}`}
                role="listbox"
                aria-label={t('header.language')}
                aria-hidden={!langMenuVisible}
                onTransitionEnd={handleLangMenuTransitionEnd}
              >
                {SUPPORTED_LANGUAGES.map(({ code, hint }) => (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={code === langCode}
                    className={`lang-menu-item${code === langCode ? ' is-active' : ''}`}
                    onClick={() => {
                      void i18n.changeLanguage(code);
                      setLangMenuOpen(false);
                    }}
                  >
                    {hint}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            title={theme === 'dark' ? t('header.themeLight') : t('header.themeDark')}
            type="button"
          >
            {theme === 'dark' ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button
            className="avatar-btn"
            onClick={onAvatarClick}
            aria-label={user ? t('header.account') : t('header.signIn')}
            title={
              user ? (user.displayName ?? user.email ?? t('header.account')) : t('header.signIn')
            }
            type="button"
          >
            <Avatar altAvatar={t('header.avatar')} />
          </button>
        </div>
      </div>
    </header>
  );
}
