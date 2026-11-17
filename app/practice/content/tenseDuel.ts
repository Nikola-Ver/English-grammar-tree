import type { L10n, Seed, TrapKey } from './types';

/**
 * Tense duel: one sentence, two forms, always on the same sides. Each duel is a pair of tenses
 * that Russian does not tell apart (one past tense, one present tense, no "will" rule).
 * Only sentences where the marker or the situation leaves exactly one natural answer.
 */

const REASONS = {
  finishedTime: {
    en: 'A finished time is named (yesterday, ago, last …, in 2019) → Past Simple.',
    ru: 'Названо завершённое время (yesterday, ago, last …, in 2019) → Past Simple.',
  },
  finishedLife: {
    en: 'The person or the period is in the past and cannot continue → Past Simple.',
    ru: 'Человек или период остались в прошлом, продолжения быть не может → Past Simple.',
  },
  upToNow: {
    en: 'The time is not over (so far, this week, ever, yet) → Present Perfect.',
    ru: 'Время ещё не закончилось (so far, this week, ever, yet) → Present Perfect.',
  },
  resultNow: {
    en: 'No time is named and the result matters now → Present Perfect.',
    ru: 'Время не названо, важен результат сейчас → Present Perfect.',
  },
  sinceFor: {
    en: 'It started in the past and is still true (since / for / how long) → Present Perfect, not Present.',
    ru: 'Началось в прошлом и продолжается (since / for / how long) → Present Perfect, а не Present.',
  },
  noDuration: {
    en: 'No "since" or "for": this is just a fact about now → Present.',
    ru: 'Нет «since» и «for»: это просто факт о настоящем → Present.',
  },
  habit: {
    en: 'A habit, a fact or a timetable → Present Simple.',
    ru: 'Привычка, факт или расписание → Present Simple.',
  },
  rightNow: {
    en: 'Happening right now, or temporary → Present Continuous.',
    ru: 'Происходит прямо сейчас или временно → Present Continuous.',
  },
  stative: {
    en: 'State verbs (love, know, understand, taste) are not used in the Continuous.',
    ru: 'Глаголы состояния (love, know, understand, taste) не употребляются в Continuous.',
  },
  background: {
    en: 'The longer action that was in progress (the background) → Past Continuous.',
    ru: 'Длительное действие-фон, которое было в процессе → Past Continuous.',
  },
  event: {
    en: 'A completed event, or events one after another → Past Simple.',
    ru: 'Завершённое событие или события одно за другим → Past Simple.',
  },
  timeClause: {
    en: 'After when / if / as soon as / until / before / unless: Present Simple, never will.',
    ru: 'После when / if / as soon as / until / before / unless — Present Simple, без will.',
  },
  prediction: {
    en: 'A prediction, a promise or a decision made now → will.',
    ru: 'Предсказание, обещание или решение в момент речи → will.',
  },
  indirectQuestion: {
    en: 'Here "when" is a question inside the sentence, not a time clause, so will stays.',
    ru: 'Здесь «when» — вопрос внутри предложения, а не придаточное времени, поэтому will остаётся.',
  },
  earlier: {
    en: 'It happened before another past moment → Past Perfect.',
    ru: 'Это произошло раньше другого момента в прошлом → Past Perfect.',
  },
  inOrder: {
    en: 'Events told in the order they happened, or one past time only → Past Simple.',
    ru: 'События идут по порядку, или названо одно время в прошлом → Past Simple.',
  },
} satisfies Record<string, L10n>;

interface Duel {
  /** id prefix: never change */
  key: string;
  rules: string[];
  trap?: TrapKey;
  /** names of the two sides */
  sides: [string, string];
  rows: [
    prompt: string,
    left: string,
    right: string,
    answer: 0 | 1,
    reason: keyof typeof REASONS,
  ][];
}

/** Rows are numbered in order: never reorder or delete, only add at the end of a duel. */
const DUELS: Duel[] = [
  {
    key: 'pp',
    rules: ['b1_03'],
    sides: ['Past Simple', 'Present Perfect'],
    rows: [
      ['I ___ him yesterday.', 'saw', 'have seen', 0, 'finishedTime'],
      [
        'She ___ to Japan three times, and she wants to go again.',
        'went',
        'has been',
        1,
        'upToNow',
      ],
      ['We ___ this flat in 2019.', 'bought', 'have bought', 0, 'finishedTime'],
      ["I can't find my keys. I think I ___ them.", 'lost', 'have lost', 1, 'resultNow'],
      ['The floor is still wet: someone ___ it.', 'washed', 'has washed', 1, 'resultNow'],
      ['Shakespeare ___ 37 plays.', 'wrote', 'has written', 0, 'finishedLife'],
      ['I ___ three coffees so far today.', 'drank', 'have drunk', 1, 'upToNow'],
      ['They ___ married ten years ago.', 'got', 'have got', 0, 'finishedTime'],
      [
        'She ___ in Paris for two years when she was a student.',
        'lived',
        'has lived',
        0,
        'finishedLife',
      ],
      ['I ___ my homework yet.', "didn't finish", "haven't finished", 1, 'upToNow'],
      ['Last night I ___ to bed at midnight.', 'went', 'have gone', 0, 'finishedTime'],
      ['This is the best pizza I ___.', 'ever ate', 'have ever eaten', 1, 'upToNow'],
      ['He ___ his leg last winter.', 'broke', 'has broken', 0, 'finishedTime'],
      ['Look! Someone ___ the window.', 'broke', 'has broken', 1, 'resultNow'],
    ],
  },
  {
    key: 'pc',
    rules: ['a2_10'],
    sides: ['Present Simple', 'Present Continuous'],
    rows: [
      ['She ___ coffee every morning.', 'drinks', 'is drinking', 0, 'habit'],
      ['Be quiet! The baby ___.', 'sleeps', 'is sleeping', 1, 'rightNow'],
      ['Water ___ at 100 °C.', 'boils', 'is boiling', 0, 'habit'],
      ['Look! It ___.', 'snows', 'is snowing', 1, 'rightNow'],
      ['I ___ what you mean.', 'understand', 'am understanding', 0, 'stative'],
      ['He usually drives, but today he ___ the bus.', 'takes', 'is taking', 1, 'rightNow'],
      ['I ___ this song!', 'love', 'am loving', 0, 'stative'],
      ['My parents ___ in Kazan. They were born there.', 'live', 'are living', 0, 'habit'],
      ['I ___ with a friend until I find a flat.', 'stay', 'am staying', 1, 'rightNow'],
      ['The train ___ at 9:15 every day.', 'leaves', 'is leaving', 0, 'habit'],
      ["Sorry, I can't talk now. I ___ dinner.", 'cook', 'am cooking', 1, 'rightNow'],
      ['This soup ___ great.', 'tastes', 'is tasting', 0, 'stative'],
      ['Prices ___ very fast these days.', 'rise', 'are rising', 1, 'rightNow'],
      ['She ___ three languages.', 'speaks', 'is speaking', 0, 'habit'],
      ['Listen! Somebody ___ the piano.', 'plays', 'is playing', 1, 'rightNow'],
    ],
  },
  {
    key: 'bg',
    rules: ['b1_07'],
    sides: ['Past Simple', 'Past Continuous'],
    rows: [
      ['I ___ dinner when the phone rang.', 'cooked', 'was cooking', 1, 'background'],
      ['When the phone rang, I ___ it at once.', 'answered', 'was answering', 0, 'event'],
      ['At 8 pm yesterday we ___ a film.', 'watched', 'were watching', 1, 'background'],
      ['She ___ her keys while she was running.', 'lost', 'was losing', 0, 'event'],
      ['He ___ the door, came in and sat down.', 'opened', 'was opening', 0, 'event'],
      ['It ___ when I woke up, so I took an umbrella.', 'rained', 'was raining', 1, 'background'],
      ['While I ___ TV, the lights went out.', 'watched', 'was watching', 1, 'background'],
      ['I ___ my leg when I was skiing.', 'broke', 'was breaking', 0, 'event'],
      ['The sun ___ and the birds were singing.', 'shone', 'was shining', 1, 'background'],
      ['They ___ in 2015 and got married a year later.', 'met', 'were meeting', 0, 'event'],
      [
        'What ___ at midnight last night? I called twice.',
        'did you do',
        'were you doing',
        1,
        'background',
      ],
      ['I ___ him three times last week.', 'called', 'was calling', 0, 'event'],
    ],
  },
  {
    key: 'sf',
    rules: ['b1_04'],
    sides: ['Present', 'Present Perfect'],
    rows: [
      ['I ___ here since 2015.', 'live', 'have lived', 1, 'sinceFor'],
      ['She ___ him for ten years.', 'knows', 'has known', 1, 'sinceFor'],
      ['I ___ in Kazan. I moved here in 2015.', 'live', 'have lived', 0, 'noDuration'],
      ['How long ___ married?', 'are you', 'have you been', 1, 'sinceFor'],
      ['We ___ friends since school.', 'are', 'have been', 1, 'sinceFor'],
      ['He ___ at this company. He likes it.', 'works', 'has worked', 0, 'noDuration'],
      ['He ___ at this company for five years.', 'works', 'has worked', 1, 'sinceFor'],
      ['I ___ this phone since March.', 'have', 'have had', 1, 'sinceFor'],
      ['It ___ since morning.', 'rains', 'has been raining', 1, 'sinceFor'],
      ['I ___ for you for an hour!', 'am waiting', 'have been waiting', 1, 'sinceFor'],
      ["I ___ for a bus. It's late.", 'am waiting', 'have been waiting', 0, 'noDuration'],
      ['She ___ ill since Monday.', 'is', 'has been', 1, 'sinceFor'],
    ],
  },
  {
    key: 'ft',
    rules: ['b1_09'],
    trap: 'futureTime',
    sides: ['Present Simple', 'will'],
    rows: [
      ["When he ___, I'll tell him.", 'comes', 'will come', 0, 'timeClause'],
      ["If it ___ tomorrow, we'll stay at home.", 'rains', 'will rain', 0, 'timeClause'],
      ["I'll call you as soon as I ___.", 'arrive', 'will arrive', 0, 'timeClause'],
      ["We'll wait until she ___ back.", 'comes', 'will come', 0, 'timeClause'],
      ['I think it ___ tomorrow.', 'rains', 'will rain', 1, 'prediction'],
      ['I ___ you after the meeting, I promise.', 'call', 'will call', 1, 'prediction'],
      ['Before you ___, please turn off the lights.', 'leave', 'will leave', 0, 'timeClause'],
      ["Don't worry, I ___ you.", 'help', 'will help', 1, 'prediction'],
      ["I don't know when he ___ back.", 'comes', 'will come', 1, 'indirectQuestion'],
      ["She'll be happy when she ___ the news.", 'hears', 'will hear', 0, 'timeClause'],
      ["I'm sure you ___ the exam.", 'pass', 'will pass', 1, 'prediction'],
      ["Unless you ___ now, you'll miss the train.", 'leave', 'will leave', 0, 'timeClause'],
    ],
  },
  {
    key: 'pf',
    rules: ['b2_01'],
    sides: ['Past Simple', 'Past Perfect'],
    rows: [
      ['The train ___ by the time I arrived.', 'left', 'had left', 1, 'earlier'],
      ['I ___ home, had dinner and went to bed.', 'came', 'had come', 0, 'inOrder'],
      ['She was tired because she ___ all night.', "didn't sleep", "hadn't slept", 1, 'earlier'],
      ["I didn't recognise him: he ___ a lot.", 'changed', 'had changed', 1, 'earlier'],
      ['He ___ the door and went out.', 'closed', 'had closed', 0, 'inOrder'],
      ['It was my first flight. I ___ before.', 'never flew', 'had never flown', 1, 'earlier'],
      ['We ___ the film last Sunday.', 'saw', 'had seen', 0, 'inOrder'],
      ["I couldn't pay: I ___ my wallet at home.", 'left', 'had left', 1, 'earlier'],
      [
        'In the morning the streets were wet. It ___ in the night.',
        'rained',
        'had rained',
        1,
        'earlier',
      ],
      ['Yesterday I ___ an old friend in the street.', 'met', 'had met', 0, 'inOrder'],
      ['She told me she ___ that book twice.', 'read', 'had read', 1, 'earlier'],
      ['When he was a child, he ___ in Minsk.', 'lived', 'had lived', 0, 'inOrder'],
    ],
  },
];

export const TENSE_DUEL: Seed[] = DUELS.flatMap((duel) =>
  duel.rows.map(([prompt, left, right, answer, reason], i) => ({
    id: `td_${duel.key}_${String(i + 1).padStart(2, '0')}`,
    kind: 'quick' as const,
    rules: duel.rules,
    ...(duel.trap ? { trap: duel.trap } : {}),
    prompt,
    options: [left, right],
    labels: duel.sides,
    answer,
    instr: 'tenseDuel',
    why: REASONS[reason],
  })),
);
