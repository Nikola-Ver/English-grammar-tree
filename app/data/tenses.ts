export interface Tense {
  name: string;
  formula: string;
  color: string;
  markers: string;
  /** Two example sentences in English (translation via i18n). */
  examplesEn: [string, string];
  mistakeCount: number;
}

export const TENSES: Record<string, Tense> = {
  present_simple: {
    name: 'Present Simple',
    formula: 'V / V+s(es)',
    color: '#4ade80',
    markers:
      'always, usually, often, sometimes, occasionally, rarely, seldom, never, every day, every week, every month, every morning, on Mondays, once a week, twice a month, in general, normally, regularly, as a rule',
    examplesEn: ['She drinks coffee every morning.', 'The sun rises in the east.'],
    mistakeCount: 3,
  },
  present_continuous: {
    name: 'Present Continuous',
    formula: 'am/is/are + V-ing',
    color: '#34d399',
    markers:
      'now, right now, at the moment, at present, currently, today, this week, this month, still, Look!, Listen!, these days, temporarily, for the time being',
    examplesEn: ["I'm studying English right now.", "She's meeting Tom tomorrow."],
    mistakeCount: 2,
  },
  past_simple: {
    name: 'Past Simple',
    formula: 'V2 / did + V',
    color: '#38bdf8',
    markers:
      'yesterday, last night, last week, last month, last year, ago, in 2020, in January, at 3pm, on Tuesday, when I was young, then, after that, suddenly, finally, once, in those days, in the past, at that time',
    examplesEn: ['I saw her yesterday.', 'She went to Paris in 2022.'],
    mistakeCount: 3,
  },
  past_continuous: {
    name: 'Past Continuous',
    formula: 'was/were + V-ing',
    color: '#818cf8',
    markers:
      'at 8pm yesterday, at this time last week, all morning, all day, all evening, while, when (+ Past Simple), as, just as, at that moment, in the middle of, during',
    examplesEn: ['I was reading when she called.', 'While he was cooking, she was working.'],
    mistakeCount: 2,
  },
  present_perfect: {
    name: 'Present Perfect',
    formula: 'have/has + V3',
    color: '#f472b6',
    markers:
      'ever, never, already, yet, just, recently, lately, so far, up to now, until now, this week, this month, today, before, once, twice, three times, for, since, still (not yet)',
    examplesEn: ["I've lost my keys.", 'Have you ever been to Japan?'],
    mistakeCount: 3,
  },
  present_perfect_continuous: {
    name: 'Present Perfect Continuous',
    formula: 'have/has been + V-ing',
    color: '#fb923c',
    markers:
      'for, since, How long...?, all day, all morning, all evening, all week, all month, lately, recently, these days, still, the whole time',
    examplesEn: [
      "I've been learning English for two years.",
      "Why are you tired? — I've been running.",
    ],
    mistakeCount: 2,
  },
  past_perfect: {
    name: 'Past Perfect',
    formula: 'had + V3',
    color: '#34d399',
    markers:
      'by the time, before, after, when (+ Past Simple), already, just, never, ever, by Monday, by then, as soon as, once, until, hardly...when, no sooner...than',
    examplesEn: [
      'When I arrived, she had already left.',
      'He had never seen snow before that winter.',
    ],
    mistakeCount: 2,
  },
  past_perfect_continuous: {
    name: 'Past Perfect Continuous',
    formula: 'had been + V-ing',
    color: '#4ade80',
    markers:
      'for, since, How long...?, all morning, all day, by the time, when, before ... arrived, the whole time',
    examplesEn: [
      "She was exhausted — she'd been working all night.",
      'How long had you been waiting?',
    ],
    mistakeCount: 2,
  },
  future_will: {
    name: 'Future Simple (will)',
    formula: 'will + V',
    color: '#38bdf8',
    markers:
      "tomorrow, next week, next month, next year, soon, in a minute, in an hour, in the future, one day, someday, probably, perhaps, maybe, I think..., I expect..., I'm sure..., certainly, definitely",
    examplesEn: ["I'll help you!", 'She will probably be late.'],
    mistakeCount: 2,
  },
  future_going_to: {
    name: 'Future (be going to)',
    formula: 'am/is/are going to + V',
    color: '#818cf8',
    markers:
      "tomorrow, next week, soon, this weekend, tonight, in June, Look!, Watch out!, I've decided..., I've arranged...",
    examplesEn: ["I'm going to study medicine.", "Look at those clouds — it's going to rain!"],
    mistakeCount: 2,
  },
  future_continuous: {
    name: 'Future Continuous',
    formula: 'will be + V-ing',
    color: '#f472b6',
    markers:
      'at this time tomorrow, this time next week, at 8pm tomorrow, tomorrow morning, all day tomorrow, in two hours, when you arrive, while you are sleeping, at that moment tomorrow',
    examplesEn: [
      "This time tomorrow I'll be lying on the beach.",
      "Don't call at 8 — I'll be having dinner.",
    ],
    mistakeCount: 2,
  },
  future_perfect: {
    name: 'Future Perfect',
    formula: 'will have + V3',
    color: '#fb923c',
    markers:
      'by tomorrow, by Friday, by the end of the week, by the end of the year, by 2030, by the time you arrive, before you get here, before midnight, by then',
    examplesEn: ["I'll have finished by Sunday.", 'By 2030 they will have built the bridge.'],
    mistakeCount: 2,
  },
};
