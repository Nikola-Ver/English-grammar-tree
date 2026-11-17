import type { Seed } from './types';

/**
 * Story time: short stories where the tense of every verb has to be chosen from the context,
 * the way it happens in real writing. Each gap is "{hint: right|wrong|wrong}" and has a
 * one-line note. Only gaps where the context leaves one natural answer.
 */
export const TENSE_STORIES: Seed[] = [
  {
    id: 'st_01',
    kind: 'story',
    rules: ['b1_07', 'b1_06'],
    title: { en: 'The missing sandwich', ru: 'Пропавший бутерброд' },
    text: "Yesterday at lunchtime I {go: went|was going|have gone} into the office kitchen. My colleague Dan {eat: was eating|ate|has eaten} a sandwich by the fridge. It was my sandwich! When he {see: saw|was seeing|has seen} me, he {drop: dropped|was dropping|has dropped} it on the floor. Then he {smile: smiled|was smiling|has smiled} and said, 'Sorry. It was delicious.'",
    notes: [
      {
        en: 'One finished action yesterday → Past Simple.',
        ru: 'Одно завершённое действие вчера → Past Simple.',
      },
      {
        en: 'Already in progress when I came in (the background) → Past Continuous.',
        ru: 'Уже происходило, когда я вошёл (фон) → Past Continuous.',
      },
      {
        en: 'A single moment, and "see" is a state verb → Past Simple.',
        ru: 'Один момент, к тому же see — глагол состояния → Past Simple.',
      },
      {
        en: 'A short completed action → Past Simple.',
        ru: 'Короткое завершённое действие → Past Simple.',
      },
      {
        en: 'The next event in the story → Past Simple.',
        ru: 'Следующее событие в рассказе → Past Simple.',
      },
    ],
    why: {
      en: 'Past Continuous paints the scene; Past Simple moves the story forward.',
      ru: 'Past Continuous рисует сцену, Past Simple двигает рассказ вперёд.',
    },
  },
  {
    id: 'st_02',
    kind: 'story',
    rules: ['b1_03', 'b1_04'],
    title: { en: 'Ten years in one flat', ru: 'Десять лет в одной квартире' },
    text: 'I {live: have lived|live|lived} in this flat since 2015. I {move: moved|have moved|move} here when I {get: got|have got|was getting} my first job. Since then I {have: have had|had|have} five different neighbours. The last one {leave: left|has left|was leaving} a month ago, and I {not meet: have not met|did not meet|do not meet} the new one yet.',
    notes: [
      {
        en: 'Since 2015 and still true → Present Perfect (not "I live since").',
        ru: 'С 2015 года и до сих пор → Present Perfect (не «I live since»).',
      },
      {
        en: 'A finished moment in the past ("when I got my job") → Past Simple.',
        ru: 'Завершённый момент в прошлом («когда я получил работу») → Past Simple.',
      },
      {
        en: 'One past event → Past Simple.',
        ru: 'Одно событие в прошлом → Past Simple.',
      },
      {
        en: '"Since then" = up to now → Present Perfect.',
        ru: '«Since then» = вплоть до сейчас → Present Perfect.',
      },
      {
        en: '"A month ago" is a finished time → Past Simple.',
        ru: '«A month ago» — завершённое время → Past Simple.',
      },
      {
        en: '"Yet" = up to now → Present Perfect.',
        ru: '«Yet» = до настоящего момента → Present Perfect.',
      },
    ],
    why: {
      en: 'Since / yet / up to now → Present Perfect. Ago / when + past moment → Past Simple.',
      ru: 'Since / yet / до сих пор → Present Perfect. Ago / when + момент в прошлом → Past Simple.',
    },
  },
  {
    id: 'st_03',
    kind: 'story',
    rules: ['b2_01', 'b1_07'],
    title: { en: 'An uninvited guest', ru: 'Незваный гость' },
    text: "Last night we {come: came|had come|were coming} home late from the theatre. The front door was open: someone {break: had broken|broke|was breaking} the lock. When we walked into the kitchen, a man {drink: was drinking|drank|has drunk} tea at our table. He {eat: had eaten|ate|was eating} all our cake, and only crumbs were left. He {look: looked|was looking|has looked} up and said, 'You are out of milk.'",
    notes: [
      {
        en: 'One finished action last night → Past Simple.',
        ru: 'Одно завершённое действие прошлой ночью → Past Simple.',
      },
      {
        en: 'The lock was broken before we came → Past Perfect.',
        ru: 'Замок сломали до нашего прихода → Past Perfect.',
      },
      {
        en: 'In progress at the moment we walked in → Past Continuous.',
        ru: 'Происходило в тот момент, когда мы вошли → Past Continuous.',
      },
      {
        en: 'Finished earlier: only crumbs were left → Past Perfect.',
        ru: 'Завершилось раньше: остались одни крошки → Past Perfect.',
      },
      {
        en: 'The next event in the story → Past Simple.',
        ru: 'Следующее событие в рассказе → Past Simple.',
      },
    ],
    why: {
      en: 'Past Perfect steps back to what had happened before the story began.',
      ru: 'Past Perfect возвращает к тому, что случилось до начала рассказа.',
    },
  },
  {
    id: 'st_04',
    kind: 'story',
    rules: ['a2_10', 'a1_11'],
    title: { en: 'First day at the gym', ru: 'Первый день в спортзале' },
    text: 'I usually {hate: hate|am hating|hates} sport, but this month I {try: am trying|try|tries} something new. Right now I {stand: am standing|stand|stood} in a gym for the first time in my life. Everyone here {know: knows|is knowing|know} what to do. A man next to me {lift: is lifting|lifts|lift} a hundred kilos. I {want: want|am wanting|wants} to go home.',
    notes: [
      {
        en: '"Usually", and "hate" is a state verb → Present Simple.',
        ru: '«Usually», к тому же hate — глагол состояния → Present Simple.',
      },
      {
        en: '"This month": temporary → Present Continuous.',
        ru: '«This month»: временно → Present Continuous.',
      },
      {
        en: '"Right now" → Present Continuous.',
        ru: '«Right now» (прямо сейчас) → Present Continuous.',
      },
      {
        en: '"Know" is a state verb; "everyone" takes -s → knows.',
        ru: 'Know — глагол состояния; everyone требует -s → knows.',
      },
      {
        en: 'Happening in front of me now → Present Continuous.',
        ru: 'Происходит у меня на глазах → Present Continuous.',
      },
      {
        en: '"Want" is a state verb → Present Simple, even about now.',
        ru: 'Want — глагол состояния → Present Simple, даже о «сейчас».',
      },
    ],
    why: {
      en: 'Now or temporary → Continuous. Habits and state verbs (hate, know, want) → Simple.',
      ru: 'Сейчас или временно → Continuous. Привычки и глаголы состояния (hate, know, want) → Simple.',
    },
  },
  {
    id: 'st_05',
    kind: 'story',
    rules: ['b1_09', 'a2_06'],
    trap: 'futureTime',
    title: { en: 'The job interview', ru: 'Собеседование' },
    text: 'Tomorrow I have a job interview. When I {arrive: arrive|will arrive|arrived}, I {smile: will smile|smile|smiled} at everyone. If they {ask: ask|will ask|asked} about my weaknesses, I {say: will say|say|said} that I work too hard. As soon as it {finish: finishes|will finish|finished}, I {call: will call|call|called} my mum.',
    notes: [
      {
        en: 'After "when" about the future: Present Simple, no will.',
        ru: 'После «when» о будущем: Present Simple, без will.',
      },
      {
        en: 'The main part of the sentence → will.',
        ru: 'Главная часть предложения → will.',
      },
      {
        en: 'After "if": Present Simple, no will.',
        ru: 'После «if»: Present Simple, без will.',
      },
      {
        en: 'The main part of the sentence → will.',
        ru: 'Главная часть предложения → will.',
      },
      {
        en: 'After "as soon as": Present Simple, no will.',
        ru: 'После «as soon as»: Present Simple, без will.',
      },
      {
        en: 'The main part of the sentence → will.',
        ru: 'Главная часть предложения → will.',
      },
    ],
    why: {
      en: 'Russian uses the future in both parts of the sentence. English: Present after when / if, will in the main part.',
      ru: 'В русском будущее в обеих частях («когда приду…»). В английском: Present после when / if, will — в главной части.',
    },
  },
  {
    id: 'st_06',
    kind: 'story',
    rules: ['b1_05', 'b1_04'],
    title: { en: 'The longest wait', ru: 'Самое долгое ожидание' },
    text: 'I {wait: have been waiting|am waiting|wait} for the doctor for two hours. I {read: have read|have been reading|read} every magazine in the room, all nine of them. The man next to me {sleep: has been sleeping|sleeps|slept} since I arrived. The nurse {call: has called|has been calling|calls} only three names so far. I {think: think|am thinking|have thought} I feel better already.',
    notes: [
      {
        en: 'For two hours and still waiting → Present Perfect Continuous.',
        ru: 'Уже два часа и всё ещё жду → Present Perfect Continuous.',
      },
      {
        en: 'A finished amount (all nine) → Present Perfect Simple.',
        ru: 'Завершённое количество (все девять) → Present Perfect Simple.',
      },
      {
        en: 'Since I arrived and still asleep → Present Perfect Continuous.',
        ru: 'С моего прихода и до сих пор спит → Present Perfect Continuous.',
      },
      {
        en: 'How many so far → Present Perfect Simple.',
        ru: 'Сколько на данный момент → Present Perfect Simple.',
      },
      {
        en: '"Think" as an opinion is a state verb → Present Simple.',
        ru: 'Think в значении «считаю» — глагол состояния → Present Simple.',
      },
    ],
    why: {
      en: 'How long → Perfect Continuous. How many → Perfect Simple.',
      ru: 'Как долго → Perfect Continuous. Сколько (штук, раз) → Perfect Simple.',
    },
  },
  {
    id: 'st_07',
    kind: 'story',
    rules: ['b2_01', 'b1_07'],
    title: { en: 'A bad morning', ru: 'Неудачное утро' },
    text: 'This morning I {wake: woke|was waking|had woken} up late. I {jump: jumped|was jumping|had jumped} out of bed and ran to the station. It {rain: was raining|rained|had rained}, and of course I had no umbrella. On the train I realised that I {leave: had left|left|was leaving} my phone at home. When I finally {get: got|had got|was getting} to the office, the meeting {start: had already started|already started|was already starting}.',
    notes: [
      {
        en: 'The first event of the story → Past Simple.',
        ru: 'Первое событие рассказа → Past Simple.',
      },
      {
        en: 'Events one after another → Past Simple.',
        ru: 'События одно за другим → Past Simple.',
      },
      {
        en: 'The weather is the background → Past Continuous.',
        ru: 'Погода — это фон → Past Continuous.',
      },
      {
        en: 'It happened before I realised it → Past Perfect.',
        ru: 'Это произошло до того, как я это понял → Past Perfect.',
      },
      {
        en: 'A single event → Past Simple.',
        ru: 'Одно событие → Past Simple.',
      },
      {
        en: 'It began before I arrived → Past Perfect.',
        ru: 'Началось до моего прихода → Past Perfect.',
      },
    ],
    why: {
      en: 'Three past tenses, three jobs: the events, the background, and what had happened before.',
      ru: 'Три прошедших времени — три задачи: события, фон и то, что случилось раньше.',
    },
  },
  {
    id: 'st_08',
    kind: 'story',
    rules: ['b1_03'],
    title: { en: 'The cat and the vase', ru: 'Кошка и ваза' },
    text: 'Oh no! The cat {break: has broken|broke|was breaking} my favourite vase. Look at the pieces! I {buy: bought|have bought|was buying} it in Italy five years ago. It {cost: cost|has cost|was costing} a fortune. I {never have: have never had|never had|am never having} such a naughty cat. And where is she now? She {disappear: has disappeared|disappeared|disappears}!',
    notes: [
      {
        en: 'We can see the result now → Present Perfect.',
        ru: 'Результат виден прямо сейчас → Present Perfect.',
      },
      {
        en: '"Five years ago" is a finished time → Past Simple.',
        ru: '«Five years ago» — завершённое время → Past Simple.',
      },
      {
        en: 'The price back then → Past Simple.',
        ru: 'Цена в тот момент → Past Simple.',
      },
      {
        en: 'In my whole life up to now → Present Perfect.',
        ru: 'За всю жизнь до настоящего момента → Present Perfect.',
      },
      {
        en: 'The result now: she is not here → Present Perfect.',
        ru: 'Результат сейчас: её здесь нет → Present Perfect.',
      },
    ],
    why: {
      en: 'One Russian past tense, two English ones: result now → Present Perfect; time named → Past Simple.',
      ru: 'Одно русское прошедшее — два английских: результат сейчас → Present Perfect; названо время → Past Simple.',
    },
  },
  {
    id: 'st_09',
    kind: 'story',
    rules: ['b1_24', 'b1_25'],
    title: { en: 'My last day at work', ru: 'Последний рабочий день' },
    text: 'Next Friday is my last day at work. This time next week I {lie: will be lying|will lie|lie} on a beach. By then I {send: will have sent|will send|send} my last email. At nine on Monday my colleagues {sit: will be sitting|will sit|sit} in a meeting, and I will be asleep. By the end of the month I {forget: will have forgotten|will forget|forget} my office password. When the holiday {end: ends|will end|will have ended}, I will start looking for a new job.',
    notes: [
      {
        en: 'In progress at a future moment ("this time next week") → Future Continuous.',
        ru: 'Будет в процессе в момент будущего («this time next week») → Future Continuous.',
      },
      {
        en: 'Finished before a future moment ("by then") → Future Perfect.',
        ru: 'Завершится до момента в будущем («by then») → Future Perfect.',
      },
      {
        en: 'In progress at nine on Monday → Future Continuous.',
        ru: 'Будет в процессе в девять в понедельник → Future Continuous.',
      },
      {
        en: '"By the end of the month" → Future Perfect.',
        ru: 'К концу месяца («by the end of the month») → Future Perfect.',
      },
      {
        en: 'After "when" about the future: Present Simple, no will.',
        ru: 'После «when» о будущем: Present Simple, без will.',
      },
    ],
    why: {
      en: 'At a future moment → will be doing. By a future moment → will have done.',
      ru: 'В момент будущего → will be doing. К моменту в будущем → will have done.',
    },
  },
  {
    id: 'st_10',
    kind: 'story',
    rules: ['b1_15'],
    trap: 'sequence',
    title: { en: 'The phone call', ru: 'Телефонный звонок' },
    text: 'Yesterday my brother called. He said he {be: was|is|has been} at the airport. He told me that his flight {be: had been|has been|is} cancelled and that he {need: needed|needs|will need} a place to sleep. I asked him when he {arrive: would arrive|will arrive|arrives}. He said he {stand: was standing|is standing|stands} outside my door.',
    notes: [
      {
        en: '"I am" → he said he was: one step back.',
        ru: '«I am» → he said he was: сдвиг на шаг назад.',
      },
      {
        en: '"It has been cancelled" → had been cancelled.',
        ru: 'Сдвиг назад: «It has been cancelled» → had been cancelled.',
      },
      {
        en: '"I need" → he needed.',
        ru: 'Сдвиг назад: «I need» → he needed.',
      },
      {
        en: '"When will you arrive?" → when he would arrive.',
        ru: 'Will превращается в would: «When will you arrive?» → when he would arrive.',
      },
      {
        en: '"I am standing" → he was standing.',
        ru: 'Сдвиг назад: «I am standing» → he was standing.',
      },
    ],
    why: {
      en: 'Russian keeps the tense of the original words; after said / told / asked English moves every tense one step back.',
      ru: 'В русском время сохраняется; в английском после said / told / asked каждое время сдвигается на шаг назад.',
    },
  },
];
