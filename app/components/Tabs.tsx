import './Tabs.css';
import { useTranslation } from 'react-i18next';

type Tab = 'grammar' | 'murphy' | 'tenses';

interface Props {
  activeTab: Tab;
  onSwitch: (tab: Tab) => void;
}

function prefetchTabPane(tab: Tab) {
  if (tab === 'grammar') void import('./Grammar/GrammarTab');
  else if (tab === 'murphy') void import('./Murphy/MurphyTab');
  else void import('./Tenses/TensesTab');
}

export function Tabs({ activeTab, onSwitch }: Props) {
  const { t } = useTranslation();
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab-btn${activeTab === 'grammar' ? ' active' : ''}`}
        onClick={() => onSwitch('grammar')}
        onMouseEnter={() => prefetchTabPane('grammar')}
      >
        {t('tabs.grammar')}
      </button>
      <button
        type="button"
        className={`tab-btn${activeTab === 'murphy' ? ' active' : ''}`}
        onClick={() => onSwitch('murphy')}
        onMouseEnter={() => prefetchTabPane('murphy')}
      >
        {t('tabs.murphy')}
      </button>
      <button
        type="button"
        className={`tab-btn${activeTab === 'tenses' ? ' active' : ''}`}
        onClick={() => onSwitch('tenses')}
        onMouseEnter={() => prefetchTabPane('tenses')}
      >
        {t('tabs.tenses')}
      </button>
    </div>
  );
}
