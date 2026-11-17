import type { Seed } from './types';

/**
 * Article repair: messages written the way a Russian speaker tends to write them, with no
 * articles at all. The learner puts back the ones in braces, and must leave alone the nouns
 * that really take no article (work, lunch, London, music…).
 */
export const ARTICLE_REPAIR: Seed[] = [
  {
    id: 'ar_01',
    kind: 'insert',
    rules: ['a1_05', 'a1_06'],
    text: 'I bought {a} car yesterday. {The} car is red.',
    why: {
      en: 'First mention → a car. The second time we both know which car → the car.',
      ru: 'Первое упоминание → a car. Во второй раз уже понятно, о какой машине речь → the car.',
    },
  },
  {
    id: 'ar_02',
    kind: 'insert',
    rules: ['a1_05', 'a1_07'],
    text: 'My sister is {a} doctor. She works in {a} big hospital in London.',
    why: {
      en: 'Jobs take a/an. One of many hospitals → a. Cities take no article.',
      ru: 'Профессия — с a/an. Одна из многих больниц → a. Города — без артикля.',
    },
  },
  {
    id: 'ar_03',
    kind: 'insert',
    rules: ['a1_05', 'a1_06'],
    text: "Can you close {the} window? It's cold, and I have {a} headache.",
    why: {
      en: 'We both see which window → the. Aches take a: a headache.',
      ru: 'Мы оба видим, о каком окне речь → the. Недомогания — с a: a headache.',
    },
  },
  {
    id: 'ar_04',
    kind: 'insert',
    rules: ['a1_06', 'a1_07'],
    text: '{The} sun was shining, so we had lunch in {the} garden.',
    why: {
      en: 'There is only one sun → the. Our garden is known → the. Meals take no article.',
      ru: 'Солнце одно → the. Наш сад известен → the. Приёмы пищи — без артикля.',
    },
  },
  {
    id: 'ar_05',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: 'We live in {a} small town near {the} Volga. Life here is quiet.',
    why: {
      en: 'One of many towns → a. Rivers take the. Life in general → no article.',
      ru: 'Один из многих городков → a. Реки — с the. Жизнь «вообще» — без артикля.',
    },
  },
  {
    id: 'ar_06',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: 'He plays {the} guitar in {a} band, and he loves music.',
    why: {
      en: 'play the + instrument. One of many bands → a. Music in general → no article.',
      ru: 'play the + инструмент. Одна из многих групп → a. Музыка «вообще» — без артикля.',
    },
  },
  {
    id: 'ar_07',
    kind: 'insert',
    rules: ['a1_05'],
    text: "I'm looking for {a} job. I'd like to be {an} engineer.",
    why: {
      en: 'Any job, not a particular one → a. Jobs take a/an; an before a vowel sound.',
      ru: 'Любая работа, не конкретная → a. Профессия — с a/an; an перед гласным звуком.',
    },
  },
  {
    id: 'ar_08',
    kind: 'insert',
    rules: ['a1_05', 'a1_06'],
    text: 'It was {the} best holiday of my life. We stayed in {a} hotel by {the} sea.',
    why: {
      en: 'Superlatives take the. One of many hotels → a. By the sea: the.',
      ru: 'Превосходная степень — с the. Один из многих отелей → a. By the sea — с the.',
    },
  },
  {
    id: 'ar_09',
    kind: 'insert',
    rules: ['a1_06', 'a1_07'],
    text: 'Dogs are friendly, but {the} dog next door hates me.',
    why: {
      en: 'Dogs in general → no article. One particular dog (the one next door) → the.',
      ru: 'Собаки «вообще» — без артикля. Конкретная собака (соседская) → the.',
    },
  },
  {
    id: 'ar_10',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: 'She has {an} hour for lunch. She usually eats in {a} café near {the} office.',
    why: {
      en: 'an hour: silent h. Meals take no article. Some café → a; her own office → the.',
      ru: 'an hour: h не читается. Приёмы пищи — без артикля. Какое-то кафе → a; её офис → the.',
    },
  },
  {
    id: 'ar_11',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: 'Moscow is {the} capital of Russia. It is {a} very big city.',
    why: {
      en: 'The capital of …: only one → the. Cities and countries: no article. A big city: one of many.',
      ru: 'The capital of …: она одна → the. Города и страны — без артикля. A big city: один из многих.',
    },
  },
  {
    id: 'ar_12',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: "I had {an} idea: let's go to {the} cinema and then have dinner.",
    why: {
      en: 'A new idea → an. Go to the cinema. Meals take no article.',
      ru: 'Новая идея → an. Go to the cinema. Приёмы пищи — без артикля.',
    },
  },
  {
    id: 'ar_13',
    kind: 'insert',
    rules: ['a1_05', 'a1_06'],
    text: 'There is {a} letter for you on {the} table in {the} kitchen.',
    why: {
      en: 'There is + a: something new. The table and the kitchen of our home are known → the.',
      ru: 'There is + a: сообщаем о новом. Стол и кухня в нашем доме известны → the.',
    },
  },
  {
    id: 'ar_14',
    kind: 'insert',
    rules: ['a1_05', 'a1_07'],
    text: "What {a} surprise! I haven't seen you since school.",
    why: {
      en: 'What a + singular noun! "Since school" means the time of your life, so no article.',
      ru: 'What a + существительное в ед. числе! «Since school» — о времени в жизни, без артикля.',
    },
  },
  {
    id: 'ar_15',
    kind: 'insert',
    rules: ['a1_05', 'a1_07'],
    text: 'He goes to work by bus, but today he took {a} taxi.',
    why: {
      en: 'go to work, by bus: no article. One taxi, any taxi → a.',
      ru: 'go to work, by bus — без артикля. Одно такси, любое → a.',
    },
  },
  {
    id: 'ar_16',
    kind: 'insert',
    rules: ['a1_05', 'a1_06'],
    text: "{The} film we saw last night was great. It's about {a} boy who finds {an} old map.",
    why: {
      en: '"The film we saw": we know which one → the. A boy, an old map: new in the story.',
      ru: '«The film we saw»: ясно, какой именно → the. A boy, an old map: новое в рассказе.',
    },
  },
  {
    id: 'ar_17',
    kind: 'insert',
    rules: ['a1_05', 'a1_06'],
    text: 'I need {a} new phone. {The} screen on my old one is broken.',
    why: {
      en: 'Any new phone → a. The screen of my phone: there is only one → the.',
      ru: 'Любой новый телефон → a. Экран у моего телефона один → the.',
    },
  },
  {
    id: 'ar_18',
    kind: 'insert',
    rules: ['a1_06', 'a1_07'],
    text: 'She speaks English and plays tennis. She is {the} cleverest girl in {the} class.',
    why: {
      en: 'Languages and sports: no article. Superlatives take the; her class is known → the.',
      ru: 'Языки и виды спорта — без артикля. Превосходная степень — с the; её класс известен → the.',
    },
  },
  {
    id: 'ar_19',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: 'We flew to {the} USA last summer and visited {a} friend in New York.',
    why: {
      en: 'The USA (States) takes the. "Last summer": no article. One of our friends → a.',
      ru: 'The USA (States) — с the. «Last summer» — без артикля. Один из друзей → a.',
    },
  },
  {
    id: 'ar_20',
    kind: 'insert',
    rules: ['a1_05', 'a1_06', 'a1_07'],
    text: 'Tom is {a} student. He studies history at {the} University of Leeds.',
    why: {
      en: 'What someone is → a. School subjects: no article. The University of …: the.',
      ru: 'Кем является человек → a. Учебные предметы — без артикля. The University of … — с the.',
    },
  },
];
