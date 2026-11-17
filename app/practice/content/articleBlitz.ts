import type { L10n, Seed } from './types';

/**
 * Article blitz: short phrases, four fixed keys (a / an / the / —).
 * Every phrase has exactly one natural answer; the reason is one of a small set of rules,
 * so the learner meets the same explanation again and again until it sticks.
 */

const OPTIONS = ['a', 'an', 'the', '—'];
/** grammar rule credited by each answer: a/an, the, zero article */
const RULE: Record<string, string> = { a: 'a1_05', an: 'a1_05', the: 'a1_06', '—': 'a1_07' };

const REASONS = {
  job: {
    en: 'Jobs take a/an: she is a doctor, he is an actor.',
    ru: 'Профессия — с a/an: she is a doctor, he is an actor.',
  },
  one: {
    en: 'One of many, mentioned for the first time → a/an.',
    ru: 'Один из многих, упоминается впервые → a/an.',
  },
  thereIs: {
    en: 'There is + a/an: we are introducing something new.',
    ru: 'There is + a/an: мы сообщаем о чём-то новом.',
  },
  vowelSound: {
    en: 'an before a vowel sound: an apple, an idea, an old house.',
    ru: 'an — перед гласным звуком: an apple, an idea, an old house.',
  },
  silentH: {
    en: 'The h is silent, so the word starts with a vowel sound: an hour, an honest man.',
    ru: 'Буква h не читается, слово начинается с гласного звука: an hour, an honest man.',
  },
  letterName: {
    en: 'It is the sound that counts: M is said [em], so an MBA.',
    ru: 'Важен звук: M читается [эм], поэтому an MBA.',
  },
  consonantSound: {
    en: 'It is the sound that counts: [ju] and [w] are consonant sounds → a university, a one-year-old.',
    ru: 'Важен звук: [ju] и [w] — согласные → a university, a one-year-old.',
  },
  whatA: {
    en: 'What a + singular noun! / such a + singular noun.',
    ru: 'What a + существительное в ед. числе! / such a + ед. число.',
  },
  per: {
    en: 'a/an means "per": twice a week, 90 km an hour.',
    ru: 'a/an в значении «в»: twice a week (два раза в неделю), 90 km an hour.',
  },
  aFew: {
    en: 'Fixed with a: a few, a little, a lot of, a hundred, a thousand.',
    ru: 'Всегда с a: a few, a little, a lot of, a hundred, a thousand.',
  },
  illness: {
    en: 'a headache, a cold, a temperature: aches and minor illnesses take a.',
    ru: 'a headache, a cold, a temperature — недомогания с a.',
  },
  wish: {
    en: 'Have a nice day, have a look, take a break: set phrases with a.',
    ru: 'Have a nice day, have a look, take a break — устойчивые выражения с a.',
  },
  unique: {
    en: 'There is only one → the: the sun, the moon, the sky, the world.',
    ru: 'Существует в единственном числе → the: the sun, the moon, the sky, the world.',
  },
  superlative: {
    en: 'Superlatives take the: the best, the nearest, the most expensive.',
    ru: 'Превосходная степень — с the: the best, the nearest, the most expensive.',
  },
  ordinal: {
    en: 'Ordinals take the: the first street, the third floor.',
    ru: 'Порядковые числительные — с the: the first street, the third floor.',
  },
  sameOnly: {
    en: 'the same, the only: there is just one such thing.',
    ru: 'the same, the only: такой предмет один.',
  },
  instrument: {
    en: 'play + the + musical instrument: play the piano, play the guitar.',
    ru: 'play + the + музыкальный инструмент: play the piano, play the guitar.',
  },
  known: {
    en: 'Both speakers know which one is meant → the.',
    ru: 'Оба собеседника понимают, о каком предмете речь → the.',
  },
  ofPhrase: {
    en: 'A noun made specific by "of …" takes the: the capital of France.',
    ru: 'Существительное, уточнённое через «of …», — с the: the capital of France.',
  },
  countryThe: {
    en: 'Plural names and names with States / Kingdom / Republic take the: the USA, the UK, the Netherlands.',
    ru: 'Названия во мн. числе и со словами States / Kingdom / Republic — с the: the USA, the UK, the Netherlands.',
  },
  water: {
    en: 'Rivers, seas and oceans take the: the Volga, the Black Sea, the Atlantic.',
    ru: 'Реки, моря и океаны — с the: the Volga, the Black Sea, the Atlantic.',
  },
  ranges: {
    en: 'Mountain ranges take the: the Alps, the Urals.',
    ru: 'Горные цепи — с the: the Alps, the Urals.',
  },
  dayParts: {
    en: 'in the morning, in the afternoon, in the evening (but: at night).',
    ru: 'in the morning, in the afternoon, in the evening (но: at night).',
  },
  cinema: {
    en: 'the cinema, the theatre, the radio (but: watch TV).',
    ru: 'the cinema, the theatre, the radio (но: watch TV).',
  },
  hotel: {
    en: 'Hotels, museums and theatres take the: the Hilton, the Hermitage, the Bolshoi.',
    ru: 'Отели, музеи и театры — с the: the Hilton, the Hermitage, the Bolshoi.',
  },
  setThe: {
    en: 'Set phrases with the: in the end, at the moment, by the way.',
    ru: 'Устойчивые выражения с the: in the end, at the moment, by the way.',
  },
  meal: {
    en: 'No article with meals: have breakfast, have lunch, have dinner.',
    ru: 'Приёмы пищи — без артикля: have breakfast, have lunch, have dinner.',
  },
  sport: {
    en: 'No article with sports and games: play tennis, play football, play chess.',
    ru: 'Виды спорта и игры — без артикля: play tennis, play football, play chess.',
  },
  language: {
    en: 'No article with languages and school subjects: speak French, study history.',
    ru: 'Языки и учебные предметы — без артикля: speak French, study history.',
  },
  place: {
    en: 'No article with most countries, cities and continents: Russia, London, Europe.',
    ru: 'Большинство стран, городов и континентов — без артикля: Russia, London, Europe.',
  },
  lake: {
    en: 'One lake or one mountain takes no article: Lake Baikal, Mount Everest.',
    ru: 'Отдельное озеро или гора — без артикля: Lake Baikal, Mount Everest.',
  },
  transport: {
    en: 'by + transport, no article: by bus, by car, by train.',
    ru: 'by + транспорт — без артикля: by bus, by car, by train.',
  },
  routine: {
    en: 'go to school / bed / work, at home: no article when you mean the activity, not the building.',
    ru: 'go to school / bed / work, at home — без артикля, когда речь о занятии, а не о здании.',
  },
  general: {
    en: 'Things in general (plural or uncountable) take no article: I love music, dogs are friendly.',
    ru: 'Понятия «вообще» (мн. число или неисчисляемые) — без артикля: I love music, dogs are friendly.',
  },
  time: {
    en: 'No article: at night, on Monday, next week, last Friday.',
    ru: 'Без артикля: at night, on Monday, next week, last Friday.',
  },
  tv: {
    en: 'watch TV: no article (but: listen to the radio).',
    ru: 'watch TV — без артикля (но: listen to the radio).',
  },
  street: {
    en: 'Streets, squares, airports and stations take no article: Oxford Street, Red Square, Heathrow Airport.',
    ru: 'Улицы, площади, аэропорты и вокзалы — без артикля: Oxford Street, Red Square, Heathrow Airport.',
  },
  title: {
    en: 'No article with a title + name: Doctor Brown, Professor Smith.',
    ru: 'Звание + имя — без артикля: Doctor Brown, Professor Smith.',
  },
  number: {
    en: 'Noun + number takes no article: page 12, room 7, gate 5.',
    ru: 'Существительное + номер — без артикля: page 12, room 7, gate 5.',
  },
} satisfies Record<string, L10n>;

type Row = [prompt: string, answer: string, reason: keyof typeof REASONS];

/** Order is the id: never reorder or delete rows, only add at the end. */
const ROWS: Row[] = [
  // a
  ['My mother is ___ teacher.', 'a', 'job'],
  ['He wants to be ___ pilot.', 'a', 'job'],
  ['She studies at ___ university in Canada.', 'a', 'consonantSound'],
  ['Maria is ___ European citizen.', 'a', 'consonantSound'],
  ['What ___ beautiful day!', 'a', 'whatA'],
  ['I go to the gym twice ___ week.', 'a', 'per'],
  ['Can I have ___ glass of water?', 'a', 'one'],
  ["I've got ___ headache.", 'a', 'illness'],
  ['It was such ___ long film.', 'a', 'whatA'],
  ['There is ___ cat under your car.', 'a', 'thereIs'],
  ['He has ___ one-year-old son.', 'a', 'consonantSound'],
  ['It costs ___ hundred dollars.', 'a', 'aFew'],
  ['Have ___ nice day!', 'a', 'wish'],
  ['I need ___ few minutes.', 'a', 'aFew'],
  ['She drives ___ very old car.', 'a', 'one'],
  ['This is ___ useful app.', 'a', 'consonantSound'],
  // an
  ['She is ___ engineer.', 'an', 'job'],
  ["I'll be back in ___ hour.", 'an', 'silentH'],
  ['He is ___ honest man.', 'an', 'silentH'],
  ['Would you like ___ apple?', 'an', 'vowelSound'],
  ['It was ___ interesting idea.', 'an', 'vowelSound'],
  ['She has ___ MBA.', 'an', 'letterName'],
  ['He is ___ actor.', 'an', 'job'],
  ['It takes half ___ hour.', 'an', 'silentH'],
  ['I had ___ egg for breakfast.', 'an', 'vowelSound'],
  ['The car was going 90 km ___ hour.', 'an', 'per'],
  ["That's ___ unusual name.", 'an', 'vowelSound'],
  ["It's ___ old house, built in 1850.", 'an', 'vowelSound'],
  // the
  ['The Earth goes round ___ sun.', 'the', 'unique'],
  ['There was not a cloud in ___ sky.', 'the', 'unique'],
  ["It's ___ best film I've ever seen.", 'the', 'superlative'],
  ['Take ___ first street on the left.', 'the', 'ordinal'],
  ['We have ___ same teacher.', 'the', 'sameOnly'],
  ['She is ___ only person who knows.', 'the', 'sameOnly'],
  ['My brother plays ___ guitar.', 'the', 'instrument'],
  ['Can you play ___ piano?', 'the', 'instrument'],
  ['Could you close ___ door, please?', 'the', 'known'],
  ['Paris is ___ capital of France.', 'the', 'ofPhrase'],
  ['I live in ___ United States.', 'the', 'countryThe'],
  ['They moved to ___ Netherlands.', 'the', 'countryThe'],
  ['London is in ___ UK.', 'the', 'countryThe'],
  ['Kazan stands on ___ Volga.', 'the', 'water'],
  ['We swam in ___ Black Sea.', 'the', 'water'],
  ['He sailed across ___ Atlantic.', 'the', 'water'],
  ['They went skiing in ___ Alps.', 'the', 'ranges'],
  ['She gets up early in ___ morning.', 'the', 'dayParts'],
  ["What's on at ___ cinema tonight?", 'the', 'cinema'],
  ['I heard it on ___ radio.', 'the', 'cinema'],
  ['Who is ___ president of the company?', 'the', 'ofPhrase'],
  ['We stayed at ___ Hilton.', 'the', 'hotel'],
  ['Turn off ___ light before you leave, please.', 'the', 'known'],
  ["It's on ___ third floor.", 'the', 'ordinal'],
  ['This is ___ most expensive phone in the shop.', 'the', 'superlative'],
  ['Where is ___ nearest bank?', 'the', 'superlative'],
  ['Dad is in ___ kitchen.', 'the', 'known'],
  ['In ___ end, we stayed at home.', 'the', 'setThe'],
  ["At ___ moment, I'm busy.", 'the', 'setThe'],
  // zero article
  ['I usually have ___ breakfast at seven.', '—', 'meal'],
  ['We had ___ dinner with friends.', '—', 'meal'],
  ['Do you play ___ tennis?', '—', 'sport'],
  ['They play ___ football every Sunday.', '—', 'sport'],
  ['She speaks ___ French very well.', '—', 'language'],
  ['I was born in ___ Russia.', '—', 'place'],
  ['They live in ___ London.', '—', 'place'],
  ['We travelled around ___ Europe.', '—', 'place'],
  ['We spent a week at ___ Lake Baikal.', '—', 'lake'],
  ['They climbed ___ Mount Everest.', '—', 'lake'],
  ['I go to work by ___ bus.', '—', 'transport'],
  ['She came by ___ car.', '—', 'transport'],
  ['The kids go to ___ school at eight.', '—', 'routine'],
  ["It's late. I'm going to ___ bed.", '—', 'routine'],
  ['Is your dad at ___ home?', '—', 'routine'],
  ['I start ___ work at nine.', '—', 'routine'],
  ['I love ___ music.', '—', 'general'],
  ['My sister is afraid of ___ dogs.', '—', 'general'],
  ["I don't drink ___ coffee.", '—', 'general'],
  ['Life is hard without ___ money.', '—', 'general'],
  ["I can't sleep at ___ night.", '—', 'time'],
  ['See you ___ next week.', '—', 'time'],
  ['I saw him ___ last Friday.', '—', 'time'],
  ['We met on ___ Monday.', '—', 'time'],
  ['I watch ___ TV every evening.', '—', 'tv'],
  ['The shop is in ___ Oxford Street.', '—', 'street'],
  ['We landed at ___ Heathrow Airport.', '—', 'street'],
  ['This is ___ Doctor Brown.', '—', 'title'],
  ['Open your books at ___ page 12.', '—', 'number'],
  ['She studies ___ history at university.', '—', 'language'],
  ['I love ___ Italian food.', '—', 'general'],
  ['He is good at ___ maths.', '—', 'language'],
  ['Red Square is in ___ Moscow.', '—', 'place'],
];

export const ARTICLE_BLITZ: Seed[] = ROWS.map(([prompt, answer, reason], i) => ({
  id: `ab_${String(i + 1).padStart(3, '0')}`,
  kind: 'quick',
  rules: [RULE[answer]],
  prompt,
  options: OPTIONS,
  answer: OPTIONS.indexOf(answer),
  instr: 'articleBlitz',
  why: REASONS[reason],
}));
