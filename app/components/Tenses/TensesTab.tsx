import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TENSES } from '../../data/tenses';
import { TenseComparison } from './TenseComparison';
import { TenseResult } from './TenseResult';
import { TenseTree } from './TenseTree';
import { Timeline } from './Timeline';
import './Tenses.css';

interface Props {
  targetTenseKey?: string | null;
}

export function TensesTab({ targetTenseKey }: Props) {
  const { t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [directResult, setDirectResult] = useState<string | null>(null);

  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  useEffect(() => {
    if (targetTenseKey && TENSES[targetTenseKey]) {
      setSelectedKey(targetTenseKey);
      setDirectResult(targetTenseKey);
    }
  }, [targetTenseKey]);

  function handleSelectTense(key: string) {
    if (compareMode) {
      if (!compareA) {
        setCompareA(key);
      } else if (!compareB && key !== compareA) {
        setCompareB(key);
      } else {
        // Both already filled — replace A and clear B.
        setCompareA(key);
        setCompareB(null);
      }
      return;
    }
    setSelectedKey(key);
    setDirectResult(key);
  }

  function handleTreeSelect(key: string) {
    setSelectedKey(key);
  }

  function handleRestart() {
    setSelectedKey(null);
    setDirectResult(null);
  }

  function handleToggleCompare() {
    const next = !compareMode;
    setCompareMode(next);
    if (!next) {
      setCompareA(null);
      setCompareB(null);
    }
  }

  function handleSwap() {
    setCompareA(compareB);
    setCompareB(compareA);
  }

  function handleClearCompare() {
    setCompareA(null);
    setCompareB(null);
  }

  const showComparison = compareMode && compareA && compareB;

  return (
    <div id="pane-tenses" className="tab-pane active">
      <Timeline
        selectedKey={selectedKey}
        highlightKeys={
          compareMode ? [compareA, compareB].filter((k): k is string => Boolean(k)) : undefined
        }
        onSelectTense={handleSelectTense}
      />

      <div className="tt-intro" style={{ marginTop: '1.25rem' }}>
        <strong>{t('tensesTab.introLead')}</strong> {t('tensesTab.introRest')}
      </div>

      {!compareMode && directResult && TENSES[directResult] ? (
        <TenseResult
          tenseKey={directResult}
          tense={TENSES[directResult]}
          breadcrumbs={[]}
          onRestart={handleRestart}
        />
      ) : !compareMode ? (
        <TenseTree onSelectTense={handleTreeSelect} />
      ) : null}

      <div className={`tt-compare-bar${compareMode ? ' open' : ''}`}>
        <button
          type="button"
          className={`tt-compare-toggle${compareMode ? ' active' : ''}`}
          onClick={handleToggleCompare}
        >
          {compareMode ? t('tensesTab.compareExit') : t('tensesTab.compareEnter')}
        </button>
        {compareMode && (
          <span className="tt-compare-hint">
            {!compareA
              ? t('tensesTab.comparePickA')
              : !compareB
                ? t('tensesTab.comparePickB')
                : t('tensesTab.comparePickedBoth')}
          </span>
        )}
      </div>

      {showComparison && compareA && compareB && (
        <TenseComparison
          keyA={compareA}
          keyB={compareB}
          onSwap={handleSwap}
          onClear={handleClearCompare}
        />
      )}

      <div className="tt-section-title" style={{ marginTop: '2rem' }}>
        {compareMode ? t('tensesTab.comparePickFromGrid') : t('tensesTab.orPick')}
      </div>
      <div className="tt-all-grid">
        {Object.entries(TENSES).map(([key, tense]) => {
          const hint = t(`tenses.${key}.desc`);
          const isCompareA = compareMode && compareA === key;
          const isCompareB = compareMode && compareB === key;
          const isActive = !compareMode && selectedKey === key;
          const highlight = isCompareA || isCompareB || isActive;
          return (
            <div
              key={key}
              className={`tt-card${highlight ? ' active' : ''}${isCompareA ? ' compare-a' : ''}${
                isCompareB ? ' compare-b' : ''
              }`}
              id={`ttcard-${key}`}
              style={
                highlight ? { borderColor: tense.color, background: 'rgba(0,0,0,0.08)' } : undefined
              }
              onClick={() => handleSelectTense(key)}
            >
              <div className="tt-card-name" style={{ color: tense.color }}>
                {tense.name}
                {isCompareA && <span className="tt-card-slot"> · A</span>}
                {isCompareB && <span className="tt-card-slot"> · B</span>}
              </div>
              <div className="tt-card-formula">{tense.formula}</div>
              <div className="tt-card-hint">{hint.substring(0, 60)}...</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
