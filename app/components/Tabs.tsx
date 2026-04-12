import './Tabs.css';
import { useTranslation } from 'react-i18next';

type Tab = 'grammar' | 'murphy' | 'tenses';

interface Props {
  activeTab: Tab;
  onSwitch: (tab: Tab) => void;
}

export function Tabs({ activeTab, onSwitch }: Props) {
  const { t } = useTranslation();
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab-btn${activeTab === 'grammar' ? ' active' : ''}`}
        onClick={() => onSwitch('grammar')}
      >
        {t('tabs.grammar')}
      </button>
      <button
        type="button"
        className={`tab-btn${activeTab === 'murphy' ? ' active' : ''}`}
        onClick={() => onSwitch('murphy')}
      >
        {t('tabs.murphy')}
      </button>
      <button
        type="button"
        className={`tab-btn${activeTab === 'tenses' ? ' active' : ''}`}
        onClick={() => onSwitch('tenses')}
      >
        {t('tabs.tenses')}
      </button>
    </div>
  );
}
