import { useState } from 'react';
import './styles/globals.css';
import { useProgress } from './hooks/useProgress';
import { Header } from './components/Header/Header';
import { Tabs } from './components/Tabs';
import { GrammarTab } from './components/Grammar/GrammarTab';
import { TensesTab } from './components/Tenses/TensesTab';

type Tab = 'grammar' | 'tenses';

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('grammar');
  const [searchQuery, setSearchQuery] = useState('');
  const { done, toggleRule, resetAll } = useProgress();

  return (
    <div className="wrap">
      <Header
        done={done}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <Tabs activeTab={activeTab} onSwitch={setActiveTab} />
      {activeTab === 'grammar' ? (
        <GrammarTab
          done={done}
          onToggleRule={toggleRule}
          onReset={resetAll}
          searchQuery={searchQuery}
        />
      ) : (
        <TensesTab />
      )}
    </div>
  );
}
