import { useState } from 'react';
import './MergeDialog.css';

interface Props {
  onChoice: (choice: 'merge' | 'replace', remember: boolean) => void;
}

export function MergeDialog({ onChoice }: Props) {
  const [remember, setRemember] = useState(false);

  return (
    <div className="merge-overlay" role="dialog" aria-modal="true" aria-label="Конфликт данных">
      <div className="merge-dialog">
        <div className="merge-icon" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        </div>
        <h3>В облаке есть данные</h3>
        <p>
          В вашем аккаунте уже есть прогресс и заметки. Что сделать с данными на этом устройстве?
        </p>
        <div className="merge-actions">
          <button
            type="button"
            className="merge-btn merge-btn--secondary"
            onClick={() => onChoice('replace', remember)}
          >
            Заменить облако
            <span className="merge-btn-sub">Данные устройства перезапишут облако</span>
          </button>
          <button
            type="button"
            className="merge-btn merge-btn--primary"
            onClick={() => onChoice('merge', remember)}
          >
            Объединить
            <span className="merge-btn-sub">Совместить оба источника — рекомендуется</span>
          </button>
        </div>
        <label className="merge-remember">
          <input
            type="checkbox"
            className="merge-remember-checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Запомнить мой выбор
        </label>
      </div>
    </div>
  );
}
