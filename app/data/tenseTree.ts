export interface TenseChoice {
  label: string;
  icon: string;
  result?: string;
  next?: string;
}

export interface TenseNode {
  q: string;
  choices: TenseChoice[];
}

export const TENSE_TREE: Record<string, TenseNode> = {
  start: {
    q: 'Когда происходит действие?',
    choices: [
      { label: 'Настоящее / постоянное', icon: '🔵', next: 'present' },
      { label: 'Прошлое', icon: '🟣', next: 'past' },
      { label: 'Будущее', icon: '🟢', next: 'future' },
    ],
  },
  present: {
    q: 'Что именно ты хочешь выразить?',
    choices: [
      { label: 'Привычка, факт, расписание', icon: '📅', result: 'present_simple' },
      { label: 'Действие прямо сейчас или временно', icon: '⏱️', next: 'present_now' },
      { label: 'Связь с настоящим: опыт/результат', icon: '🔗', next: 'present_perfect_branch' },
    ],
  },
  present_now: {
    q: 'Это постоянное состояние или процесс прямо сейчас?',
    choices: [
      { label: 'Постоянное (знаю, люблю, хочу...)', icon: '💭', result: 'present_simple' },
      { label: 'Процесс сейчас / временно', icon: '⚡', result: 'present_continuous' },
    ],
  },
  present_perfect_branch: {
    q: 'Важна продолжительность или сам факт?',
    choices: [
      { label: 'Сам факт / результат / опыт', icon: '✅', result: 'present_perfect' },
      {
        label: 'Продолжительность ("как долго")',
        icon: '⏳',
        result: 'present_perfect_continuous',
      },
    ],
  },
  past: {
    q: 'Что ты хочешь выразить о прошлом?',
    choices: [
      { label: 'Завершённое действие (конкретное время)', icon: '📌', result: 'past_simple' },
      { label: 'Действие в процессе / фон', icon: '🌊', result: 'past_continuous' },
      { label: 'Действие до другого прошлого события', icon: '⏪', next: 'past_perfect_branch' },
    ],
  },
  past_perfect_branch: {
    q: 'Нужно подчеркнуть продолжительность?',
    choices: [
      { label: 'Нет — просто факт завершения', icon: '✔️', result: 'past_perfect' },
      { label: 'Да — как долго шло до момента', icon: '⏳', result: 'past_perfect_continuous' },
    ],
  },
  future: {
    q: 'Как ты выражаешь будущее?',
    choices: [
      { label: 'Спонтанное решение / обещание / предсказание', icon: '💡', result: 'future_will' },
      { label: 'Заранее запланировано / есть признаки', icon: '📝', result: 'future_going_to' },
      { label: 'Будет в процессе в момент будущего', icon: '⏱️', result: 'future_continuous' },
      { label: 'Завершится до момента в будущем', icon: '✅', result: 'future_perfect' },
    ],
  },
};
