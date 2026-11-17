import type { Seed } from './types';

export const PUNCTUATION_DRILLS: Seed[] = [
  // ── Gaps: comma, semicolon or nothing (—) ──────────────────────────────────
  {
    id: 'pun_01',
    kind: 'gaps',
    rules: ['b2_17', 'c2_18'],
    title: { en: 'Commas with relative clauses', ru: 'Запятые в относительных придаточных' },
    options: [',', '—'],
    text: 'My mother{,} who lives in Canada{,} is a nurse. The book{—} that you lent me was brilliant. Paris{,} which we visited last spring{,} was full of tourists. Students{—} who cheat will be disqualified.',
    why: {
      en: 'Non-defining clauses (extra information about a unique noun) take commas; defining clauses and that-clauses do not.',
      ru: 'Описательные придаточные (доп. информация) выделяются запятыми; определительные и придаточные с that — нет.',
    },
  },
  {
    id: 'pun_02',
    kind: 'gaps',
    rules: ['c2_18', 'c2_17'],
    title: {
      en: 'Fronted clauses and long subjects',
      ru: 'Придаточное в начале и длинное подлежащее',
    },
    options: [',', '—'],
    text: 'Although the plan was extremely risky{,} it worked perfectly. If the weather improves by the weekend{,} we will go camping. Everyone who attended the conference{—} received a certificate. The main reason for the delay{—} was a shortage of staff. Because the trains were cancelled{,} many people worked from home.',
    why: {
      en: 'Put a comma after a fronted subordinate clause, but never between a subject (however long) and its verb.',
      ru: 'Запятая ставится после придаточного в начале, но никогда — между подлежащим (даже длинным) и сказуемым.',
    },
  },
  {
    id: 'pun_03',
    kind: 'gaps',
    rules: ['c2_16', 'c2_18'],
    title: { en: 'Commas before and / but / or / so', ru: 'Запятая перед and / but / or / so' },
    options: [',', '—'],
    text: 'The tickets were expensive{,} but the concert was worth every penny. Anna finished her report{—} and sent it to her manager. The museum was closed for repairs{,} so we visited the old cathedral instead. My brother likes jazz{—} and classical music. We could take the train{,} or we could hire a car.',
    why: {
      en: 'Use a comma before and/but/or/so joining two full clauses; none when the subject is not repeated or only words are joined.',
      ru: 'Запятая перед and/but/or/so между двумя полными предложениями; без неё — если подлежащее не повторяется или соединяются слова.',
    },
  },
  {
    id: 'pun_04',
    kind: 'gaps',
    rules: ['c2_18', 'c2_06'],
    title: { en: 'However, therefore and other linkers', ru: 'However, therefore и другие связки' },
    options: [',', ';', '—'],
    text: 'The first trial was a success{;} however, the second one failed. Nevertheless{,} the team refused to give up. In addition{,} the costs were far higher than expected. The budget was cut{;} therefore, the project was delayed. Fortunately{,} a new sponsor was found.',
    why: {
      en: 'Linking adverbs (however, therefore) take a semicolon before them between clauses and a comma after them.',
      ru: 'Перед наречиями-связками (however, therefore) между предложениями — точка с запятой, после них — запятая.',
    },
  },
  {
    id: 'pun_05',
    kind: 'gaps',
    rules: ['c2_18', 'b2_17'],
    title: { en: 'Where NOT to put a comma', ru: 'Где запятая НЕ нужна' },
    options: [',', '—'],
    text: 'She said{—} that she would be late. The fact{—} that he lied surprised nobody. What surprised me most{—} was the price. Interestingly{,} nobody asked why. The car{—} that we rented broke down twice. I know{—} that you are busy.',
    why: {
      en: 'No comma before a that-clause after a verb or noun, nor between a subject and its verb. A sentence adverb at the start takes one.',
      ru: 'Нет запятой перед that после глагола или существительного и между подлежащим и сказуемым. После вводного наречия — есть.',
    },
  },
  {
    id: 'pun_06',
    kind: 'gaps',
    rules: ['c2_18', 'b2_17'],
    title: { en: 'An academic paragraph', ru: 'Академический абзац' },
    options: [',', ';', '—'],
    text: 'This survey{,} which took two years to complete{,} involved 500 participants. Most of them were students{;} the rest were teachers. Only participants{—} who completed both questionnaires were included in the analysis. As the sample was relatively small{,} the results should be interpreted with caution.',
    why: {
      en: 'Commas around a non-defining clause, a semicolon between two related full sentences, nothing before a defining clause.',
      ru: 'Запятые вокруг описательного придаточного, точка с запятой между двумя связанными предложениями, ничего — перед определительным.',
    },
  },
  {
    id: 'pun_07',
    kind: 'gaps',
    rules: ['b2_17', 'b1_22'],
    title: { en: 'Commas with whose, where and why', ru: 'Запятые с whose, where и why' },
    options: [',', '—'],
    text: 'Mr Jones{,} whose son is in my class{,} teaches maths. This is the house{—} where I was born. Rome{,} where we spent our honeymoon{,} is my favourite city. The reason{—} why she left is still unclear.',
    why: {
      en: 'Use commas only when the clause adds extra information about an already identified noun (Mr Jones, Rome).',
      ru: 'Запятые нужны, только если придаточное добавляет информацию об уже определённом существительном (Mr Jones, Rome).',
    },
  },
  {
    id: 'pun_08',
    kind: 'gaps',
    rules: ['c1_16', 'c1_17', 'c2_18'],
    title: { en: 'Participle and infinitive phrases', ru: 'Причастные и инфинитивные обороты' },
    options: [',', '—'],
    text: 'Having finished the report{,} she sent it to her boss. Exhausted after the long journey{,} we went straight to bed. The woman{—} standing by the door is our new manager. The documents{—} signed yesterday are on your desk. To be honest{,} I expected more.',
    why: {
      en: 'A fronted participle or infinitive phrase is followed by a comma; a participle that defines a noun (the woman standing…) is not.',
      ru: 'После оборота в начале предложения — запятая; причастие, определяющее существительное (the woman standing…), не выделяется.',
    },
  },
  {
    id: 'pun_09',
    kind: 'gaps',
    rules: ['c2_18'],
    title: { en: 'A formal email', ru: 'Официальное письмо' },
    options: [',', ';', '—'],
    text: 'Thank you for your email. Unfortunately{,} the order{—} you placed on Monday has not yet been dispatched. Our warehouse is short-staffed this week{;} as a result, there are some delays. Your parcel should arrive on Friday{,} and you will receive a tracking number by email.',
    why: {
      en: 'Comma after a sentence adverb; nothing before a defining clause; ";" before a linker joining clauses; "," before and joining clauses.',
      ru: 'Запятая после вводного наречия; ничего перед определительным; «;» перед связкой между предложениями; «,» перед and.',
    },
  },
  {
    id: 'pun_10',
    kind: 'gaps',
    rules: ['c2_18', 'b2_17'],
    title: { en: 'Mixed punctuation practice', ru: 'Пунктуация: смешанная практика' },
    options: [',', ';', '—'],
    text: 'The team finished the project two weeks early{,} which surprised everyone. The results{—} that they obtained were consistent with earlier studies. Several experts{—} believe that the trend will continue. Clearly{,} more data is needed. The new policy has been widely criticised{;} nevertheless, it remains popular with voters.',
    why: {
      en: 'A which-clause about a whole idea takes a comma; that-clauses and subject–verb pairs take none; nevertheless works like however.',
      ru: 'Which, относящееся ко всей мысли, — после запятой; перед that и между подлежащим и сказуемым — нет; nevertheless — как however.',
    },
  },
];
