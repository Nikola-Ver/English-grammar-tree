import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { SyncStatus } from '../../context/AuthSyncContext';
import { useAuthSync } from '../../context/AuthSyncContext';
import './AccountPage.css';

interface Props {
  onBack: () => void;
}

function SyncDot({ status, title }: { status: SyncStatus; title: string }) {
  return <span className={`account-sync-dot account-sync-dot--${status}`} title={title} />;
}

function formatDate(d: Date, locale: string): string {
  const tag = locale === 'zh' ? 'zh-CN' : locale === 'ru' ? 'ru-RU' : locale;
  return d.toLocaleString(tag, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getInitials(name: string | null, email: string | null): string {
  if (name?.trim()) return name.trim()[0].toUpperCase();
  if (email) return email[0].toUpperCase();
  return '?';
}

export function AccountPage({ onBack }: Props) {
  const { t, i18n } = useTranslation();
  const { user, syncStatus, lastSyncAt, signOut, deleteAccount, syncNow } = useAuthSync();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const syncDotLabel: Record<SyncStatus, string> = {
    idle: t('account.syncIdle'),
    syncing: t('account.syncSyncing'),
    synced: t('account.syncSynced'),
    offline: t('account.syncOffline'),
    error: t('account.syncError'),
  };

  if (!user) return null;

  const displayName = user.displayName ?? null;
  const email = user.email ?? null;
  const photoURL = user.photoURL ?? null;
  const initials = getInitials(displayName, email);
  const locale = i18n.language.split('-')[0];

  async function handleSyncNow() {
    setSyncing(true);
    try {
      await syncNow();
    } finally {
      setSyncing(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount();
      onBack();
    } catch (e) {
      const code = (e as { code?: string }).code ?? '';
      if (code === 'auth/requires-recent-login') {
        setDeleteError(t('account.deleteErrorRecentLogin'));
      } else {
        setDeleteError(t('account.deleteErrorGeneric'));
      }
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const statusText: Record<SyncStatus, string> = {
    idle: t('account.syncIdle'),
    syncing: t('account.syncSyncing'),
    synced: t('account.syncSynced'),
    offline: t('account.syncOfflineDetail'),
    error: t('account.syncErrorDetail'),
  };

  return (
    <div className="account-page">
      <div className="account-card">
        <div className="account-identity">
          {photoURL ? (
            <img
              className="account-avatar"
              src={photoURL}
              alt={displayName ?? t('header.avatar')}
            />
          ) : (
            <div className="account-avatar account-avatar--initials">{initials}</div>
          )}
          <div className="account-info">
            {displayName && <p className="account-name">{displayName}</p>}
            {email && <p className="account-email">{email}</p>}
          </div>
        </div>

        <div className="account-sync-row">
          <div className="account-sync-label">
            <SyncDot status={syncStatus} title={syncDotLabel[syncStatus]} />
            <span>{statusText[syncStatus]}</span>
          </div>
          {lastSyncAt && (
            <p className="account-last-sync">
              {t('account.lastSync')} {formatDate(lastSyncAt, locale)}
            </p>
          )}
        </div>

        <button
          type="button"
          className="account-btn account-btn--secondary"
          onClick={handleSyncNow}
          disabled={syncing || syncStatus === 'syncing'}
        >
          {syncing || syncStatus === 'syncing' ? t('account.syncSyncing') : t('account.syncNow')}
        </button>

        <button type="button" className="account-btn account-btn--secondary" onClick={signOut}>
          {t('account.signOut')}
        </button>

        <div className="account-divider" />

        {!confirmDelete ? (
          <button
            type="button"
            className="account-btn account-btn--danger"
            onClick={() => setConfirmDelete(true)}
          >
            {t('account.deleteAccount')}
          </button>
        ) : (
          <div className="account-delete-confirm">
            <p className="account-delete-warning">{t('account.deleteWarning')}</p>
            {deleteError && <p className="account-delete-error">{deleteError}</p>}
            <div className="account-delete-actions">
              <button
                type="button"
                className="account-btn account-btn--ghost"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                {t('account.cancel')}
              </button>
              <button
                type="button"
                className="account-btn account-btn--danger"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? t('account.deleting') : t('account.deleteConfirm')}
              </button>
            </div>
          </div>
        )}

        <button type="button" className="account-back-btn" onClick={onBack}>
          {t('account.back')}
        </button>
      </div>
    </div>
  );
}
