import './Tabs.css';

type Tab = 'grammar' | 'murphy' | 'tenses';

interface Props {
  activeTab: Tab;
  onSwitch: (tab: Tab) => void;
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
        className={`tab-btn${activeTab === 'murphy' ? ' active' : ''}`}
        onClick={() => onSwitch('murphy')}
      >
        📖 Книги от Murphy
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
