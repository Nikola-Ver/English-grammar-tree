import './Tabs.css';

interface Props {
  activeTab: 'grammar' | 'tenses';
  onSwitch: (tab: 'grammar' | 'tenses') => void;
}

export function Tabs({ activeTab, onSwitch }: Props) {
  return (
    <div className="tabs">
      <button
        className={`tab-btn${activeTab === 'grammar' ? ' active' : ''}`}
        onClick={() => onSwitch('grammar')}
      >
        📚 Грамматика
      </button>
      <button
        className={`tab-btn${activeTab === 'tenses' ? ' active' : ''}`}
        onClick={() => onSwitch('tenses')}
      >
        🕐 Дерево времён
      </button>
    </div>
  );
}
