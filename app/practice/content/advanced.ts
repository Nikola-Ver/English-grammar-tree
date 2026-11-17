import type { Seed } from './types';

export const ADVANCED_DRILLS: Seed[] = [
  // ── Participle clauses ─────────────────────────────────────────────────────
  {
    id: 'adv_01',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: '___ her homework, she went out with her friends.',
    options: ['Having finished', 'Finished', 'Having been finished', 'To have finished'],
    why: {
      en: 'Having + past participle shows an action completed before the main one, with the same subject (she).',
      ru: 'Having + V3 показывает действие, завершённое до основного, с тем же подлежащим (she).',
    },
  },
  {
    id: 'adv_02',
    kind: 'choice',
    rules: ['c1_16'],
    prompt: '___ what to say, I kept quiet.',
    options: ['Not knowing', 'Knowing not', "Don't knowing", 'No knowing'],
    why: {
      en: 'To make a participle clause negative, put not before the -ing form: Not knowing… (= Because I didn’t know).',
      ru: 'Отрицание в причастном обороте — not перед -ing: Not knowing… (= Так как я не знал).',
    },
  },
  {
    id: 'adv_03',
    kind: 'choice',
    rules: ['c1_16'],
    prompt: 'Which sentence is correct?',
    options: [
      'Walking into the room, I noticed a strange smell.',
      'Walking into the room, a strange smell hit me.',
      'Walking into the room, a strange smell was noticed.',
    ],
    why: {
      en: 'The participle’s subject must be the subject of the main clause. Only "I" can walk into the room, not a smell.',
      ru: 'Подлежащее причастия должно совпадать с подлежащим главного предложения. В комнату входит I, а не запах.',
    },
  },
  {
    id: 'adv_04',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: '___ in 1890, the bridge is still in use today.',
    options: ['Built', 'Building', 'Having built', 'Being built'],
    why: {
      en: 'The bridge was built (passive), so use the past participle: Built in 1890… Building / Having built are active.',
      ru: 'Мост был построен (пассив), поэтому V3: Built in 1890… Building / Having built — активные формы.',
    },
  },
  {
    id: 'adv_05',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: '___ by the noise, the baby started crying.',
    options: ['Woken', 'Waking', 'Having woken', 'Woke'],
    why: {
      en: 'The baby was woken by the noise → passive participle Woken. "By the noise" signals the passive.',
      ru: 'Ребёнка разбудил шум → пассивное причастие Woken. На пассив указывает by the noise.',
    },
  },
  {
    id: 'adv_06',
    kind: 'choice',
    rules: ['c1_16'],
    prompt: 'The man ___ next to me on the plane was a famous actor.',
    options: ['sitting', 'who sitting', 'having sat', 'was sitting'],
    why: {
      en: 'A present participle can replace a defining relative clause: the man sitting = the man who was sitting.',
      ru: 'Причастие на -ing может заменить определительное придаточное: the man sitting = the man who was sitting.',
    },
  },
  {
    id: 'adv_07',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: '___ his driving test three times, Tom finally passed on his fourth attempt.',
    options: ['Having failed', 'Having been failed', 'Failed', 'To fail'],
    why: {
      en: 'Tom failed (active) before he passed, so use the active perfect participle: Having failed.',
      ru: 'Том проваливал экзамен (актив) до того, как сдал, — нужно активное перфектное причастие: Having failed.',
    },
  },
  {
    id: 'adv_08',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: '___ personally by the director, she could hardly refuse.',
    options: ['Having been invited', 'Having invited', 'Inviting', 'Being inviting'],
    why: {
      en: 'She was invited (passive) before deciding → perfect passive participle: Having been invited.',
      ru: 'Её пригласили (пассив) ещё до решения → перфектное пассивное причастие: Having been invited.',
    },
  },
  {
    id: 'adv_09',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: 'Which sentence is correct?',
    options: [
      'Having been repaired, the car ran perfectly.',
      'Having repaired the car, it ran perfectly.',
      'Having been repaired, I drove the car home.',
    ],
    why: {
      en: 'The car was repaired, so the car must be the subject of the main clause. The other two are dangling participles.',
      ru: 'Ремонтировали машину, значит, она и должна быть подлежащим. В двух других — «висящее» причастие.',
    },
  },
  {
    id: 'adv_10',
    kind: 'choice',
    rules: ['c1_17'],
    prompt: 'When ___ about the accident, the minister refused to comment.',
    options: ['asked', 'asking', 'was asked', 'having asking'],
    why: {
      en: 'When asked = When he was asked (passive). Asking would mean the minister was the one asking questions.',
      ru: 'When asked = When he was asked (пассив). Asking означало бы, что вопросы задавал сам министр.',
    },
  },
  {
    id: 'adv_11',
    kind: 'choice',
    rules: ['c1_16'],
    prompt: 'Generally ___, the conference was a success.',
    options: ['speaking', 'spoken', 'to speak', 'speak'],
    why: {
      en: 'Generally speaking is a fixed participle phrase (= in general); it does not need to share the main subject.',
      ru: 'Generally speaking — устойчивый причастный оборот (= в целом); ему не нужно общее подлежащее.',
    },
  },

  // ── Nominalisation ─────────────────────────────────────────────────────────
  {
    id: 'adv_12',
    kind: 'choice',
    rules: ['c1_14'],
    prompt: 'The government decided to raise taxes. This ___ proved deeply unpopular.',
    options: ['decision', 'deciding', 'decide', 'decisive'],
    why: {
      en: 'After this we need a noun that sums up the previous sentence: decided → this decision.',
      ru: 'После this нужно существительное, обобщающее предыдущую мысль: decided → this decision.',
    },
  },
  {
    id: 'adv_13',
    kind: 'choice',
    rules: ['c1_15'],
    context: 'Nominalise: The population grew rapidly.',
    prompt: '___ led to a housing shortage.',
    options: [
      'Rapid population growth',
      'The population grew rapidly',
      'Rapidly population growth',
      'The rapidly growth of population',
    ],
    why: {
      en: 'Verb + adverb (grew rapidly) becomes adjective + noun (rapid growth). A full clause cannot be the subject here.',
      ru: 'Глагол + наречие (grew rapidly) → прилагательное + существительное (rapid growth). Целое предложение здесь не подлежащее.',
    },
  },
  {
    id: 'adv_14',
    kind: 'choice',
    rules: ['c1_14'],
    prompt: 'There has been a significant ___ in crime in the area.',
    options: ['reduction', 'reduce', 'reducing', 'reduced'],
    why: {
      en: 'After "a significant" we need a noun: reduce → reduction. Nominalisation is typical of formal writing.',
      ru: 'После a significant нужно существительное: reduce → reduction. Номинализация типична для формального стиля.',
    },
  },
  {
    id: 'adv_15',
    kind: 'choice',
    rules: ['c1_14'],
    prompt: 'The ___ of the new system took six months.',
    options: ['implementation', 'implement', 'implemented'],
    why: {
      en: 'The… of needs a noun: implement → implementation, a key word in formal and academic English.',
      ru: 'В конструкции The… of нужно существительное: implement → implementation — ключевое слово формального стиля.',
    },
  },
  {
    id: 'adv_16',
    kind: 'choice',
    rules: ['c1_14'],
    prompt: "The committee's ___ to accept the proposal surprised everyone.",
    options: ['refusal', 'refuse', 'refused', 'refusement'],
    why: {
      en: 'After a possessive (’s) we need a noun: refuse → refusal (a refusal to do something).',
      ru: 'После притяжательного ’s нужно существительное: refuse → refusal (a refusal to do something).',
    },
  },
  {
    id: 'adv_17',
    kind: 'choice',
    rules: ['c1_15'],
    context: 'Original: Scientists analysed the data carefully, and this revealed several errors.',
    prompt: 'Which is the correct nominalised version?',
    options: [
      'Careful analysis of the data revealed several errors.',
      'Careful analysing the data revealed several errors.',
      'Carefully analysis of the data revealed several errors.',
    ],
    why: {
      en: 'Analysed carefully → careful analysis: the verb becomes a noun, and its adverb becomes an adjective.',
      ru: 'Analysed carefully → careful analysis: глагол становится существительным, а наречие — прилагательным.',
    },
  },
  {
    id: 'adv_18',
    kind: 'choice',
    rules: ['c1_14'],
    prompt: 'The ___ of the bridge is expected to take two years.',
    options: ['construction', 'construct', 'constructive', 'constructed'],
    why: {
      en: 'The process is construction (a noun). Construct is a verb; constructive is an adjective.',
      ru: 'Процесс — construction (существительное). Construct — глагол, constructive — прилагательное.',
    },
  },
  {
    id: 'adv_19',
    kind: 'choice',
    rules: ['c1_14'],
    prompt: 'Their ___ of the problem was rather superficial.',
    options: ['analysis', 'analyse', 'analytical', 'analysed'],
    why: {
      en: 'Their… of needs a noun: analyse → analysis. Analytical is an adjective.',
      ru: 'После Their… of нужно существительное: analyse → analysis. Analytical — прилагательное.',
    },
  },

  // ── Ellipsis and substitution ──────────────────────────────────────────────
  {
    id: 'adv_20',
    kind: 'choice',
    rules: ['c1_11'],
    context: 'A: Will it rain during the wedding tomorrow?',
    prompt: 'B: I hope ___.',
    options: ['not', 'no', "don't", 'not so'],
    why: {
      en: 'I hope not = I hope it won’t. Not (not no or don’t) replaces a negative clause.',
      ru: 'I hope not = надеюсь, что нет. Отрицательное придаточное заменяется словом not (не no и не don’t).',
    },
  },
  {
    id: 'adv_21',
    kind: 'choice',
    rules: ['c1_11'],
    context: 'A: Is the shop still open?',
    prompt: "B: I'm afraid ___. It closed at six.",
    options: ['not', 'no', 'so not', "isn't"],
    why: {
      en: 'I’m afraid not politely says "no, unfortunately". Not replaces the whole negative clause.',
      ru: 'I’m afraid not — вежливое «к сожалению, нет». Not заменяет всё отрицательное придаточное.',
    },
  },
  {
    id: 'adv_22',
    kind: 'choice',
    rules: ['c1_11'],
    context: 'A: Did they win the match?',
    prompt: 'B: I think ___. Everyone was celebrating.',
    options: ['so', 'it', 'that', 'yes'],
    why: {
      en: 'So replaces a positive that-clause after think, hope, expect, suppose: I think so = I think they won.',
      ru: 'So заменяет утвердительное придаточное после think, hope, expect, suppose: I think so = думаю, да.',
    },
  },
  {
    id: 'adv_23',
    kind: 'choice',
    rules: ['c2_12'],
    prompt: 'I asked her to tidy her room, but she refused to do ___.',
    options: ['so', 'such', 'same', 'as'],
    why: {
      en: 'Do so replaces a verb phrase (tidy her room) and is typical of formal style. "Do same" needs the: do the same.',
      ru: 'Do so заменяет глагольную группу (tidy her room), это формальный стиль. Нужно do the same, а не do same.',
    },
  },
  {
    id: 'adv_24',
    kind: 'choice',
    rules: ['c2_12'],
    prompt: 'These shoes are too small. Do you have any bigger ___?',
    options: ['ones', 'one', 'them', 'some'],
    why: {
      en: 'Ones replaces a plural countable noun (shoes) after an adjective: bigger ones. One is for singular nouns.',
      ru: 'Ones заменяет исчисляемое существительное во мн. ч. (shoes) после прилагательного. One — для ед. ч.',
    },
  },
  {
    id: 'adv_25',
    kind: 'choice',
    rules: ['c1_10'],
    context: "A: I don't like horror films.",
    prompt: 'B: ___ do I.',
    options: ['Neither', 'So', 'Either', 'Also'],
    why: {
      en: 'To agree with a negative statement: Neither/Nor + auxiliary + subject. So do I agrees with positive statements.',
      ru: 'Согласие с отрицанием: Neither/Nor + вспомогательный глагол + подлежащее. So do I — для утверждений.',
    },
  },
  {
    id: 'adv_26',
    kind: 'choice',
    rules: ['c1_10'],
    prompt: 'She speaks French fluently, and so ___ her brother.',
    options: ['does', 'is', 'speaks', 'has'],
    why: {
      en: 'So + auxiliary + subject: speaks (Present Simple) → does. The auxiliary repeats the tense of the first verb.',
      ru: 'So + вспомогательный глагол + подлежащее: speaks (Present Simple) → does. Он повторяет время первого глагола.',
    },
  },
  {
    id: 'adv_27',
    kind: 'choice',
    rules: ['c2_12'],
    context: 'A: Are you coming to the party on Saturday?',
    prompt: "B: I'd love ___, but I have to work.",
    options: ['to', 'it', 'so', 'to do'],
    why: {
      en: 'After love, like, want, hope we can keep just to and drop the verb: I’d love to (= to come).',
      ru: 'После love, like, want, hope можно оставить только to без глагола: I’d love to (= to come).',
    },
  },
  {
    id: 'adv_28',
    kind: 'choice',
    rules: ['c2_12'],
    prompt: 'He promised he would finish the report by Friday, and he ___.',
    options: ['did', 'was', 'made', 'does'],
    why: {
      en: 'Ellipsis with an auxiliary: and he did (= and he did finish it). Past Simple meaning → did.',
      ru: 'Эллипсис со вспомогательным глаголом: and he did (= и он действительно закончил). Past Simple → did.',
    },
  },

  // ── Subjunctive ────────────────────────────────────────────────────────────
  {
    id: 'adv_29',
    kind: 'choice',
    rules: ['c1_07'],
    prompt: 'The doctor insisted that he ___ smoking immediately.',
    options: ['stop', 'to stop', 'stopping', 'will stop'],
    why: {
      en: 'After insist, demand, recommend + that, formal English uses the bare subjunctive: that he stop (no -s, no to).',
      ru: 'После insist, demand, recommend + that в формальном стиле — сослагательное без to и -s: that he stop.',
    },
  },
  {
    id: 'adv_30',
    kind: 'choice',
    rules: ['c1_07'],
    prompt: 'It is essential that every student ___ the safety briefing.',
    options: ['attend', 'attending', 'to attend', 'will attend'],
    why: {
      en: 'It is essential / vital / important that + subject + base form: that every student attend.',
      ru: 'It is essential / vital / important that + подлежащее + инфинитив без to: that every student attend.',
    },
  },
  {
    id: 'adv_31',
    kind: 'choice',
    rules: ['b1_10'],
    prompt: 'If I ___ you, I would apologise to her at once.',
    options: ['were', 'am', 'would be', 'have been'],
    why: {
      en: 'Unreal present after if: If I were you… In formal English, were is used for all persons.',
      ru: 'Нереальное настоящее после if: If I were you… В формальном стиле were используется со всеми лицами.',
    },
  },
  {
    id: 'adv_32',
    kind: 'choice',
    rules: ['c1_08'],
    prompt: "It's high time we ___ home.",
    options: ['went', 'go', 'will go', 'have gone'],
    why: {
      en: 'It’s (high) time + subject + Past Simple: the past form refers to now and means "we should already be doing it".',
      ru: 'It’s (high) time + подлежащее + Past Simple: прошедшая форма говорит о настоящем — «давно пора».',
    },
  },
  {
    id: 'adv_33',
    kind: 'choice',
    rules: ['c1_09'],
    prompt: "He talks as if he ___ the boss, but he's only an intern.",
    options: ['were', 'be', 'would be', 'is being'],
    why: {
      en: 'As if + were marks an unreal comparison: he is not the boss. Would be and be are not used here.',
      ru: 'As if + were — нереальное сравнение: он не начальник. Would be и be здесь не употребляются.',
    },
  },
  {
    id: 'adv_34',
    kind: 'choice',
    rules: ['c1_07'],
    prompt: 'The committee recommended that the proposal ___ rejected.',
    options: ['be', 'is being', 'will be', 'to be'],
    why: {
      en: 'Passive subjunctive after recommend that: be + past participle (that the proposal be rejected).',
      ru: 'Пассивное сослагательное после recommend that: be + V3 (that the proposal be rejected).',
    },
  },
  {
    id: 'adv_35',
    kind: 'choice',
    rules: ['c1_07'],
    prompt: 'It is vital that the patient ___ disturbed.',
    options: ['not be', "doesn't be", 'be not', 'not being'],
    why: {
      en: 'Negative subjunctive: not goes before the base form, with no do: that the patient not be disturbed.',
      ru: 'Отрицательное сослагательное: not ставится перед инфинитивом, без do: that the patient not be disturbed.',
    },
  },
  {
    id: 'adv_36',
    kind: 'choice',
    rules: ['c1_07'],
    prompt: 'She demanded that she ___ allowed to see the manager.',
    options: ['be', 'being', 'will be', 'to be'],
    why: {
      en: 'Demand that + subject + be + past participle: the subjunctive be does not change for tense or person.',
      ru: 'Demand that + подлежащее + be + V3: сослагательное be не меняется по временам и лицам.',
    },
  },

  // ── Absolute constructions ─────────────────────────────────────────────────
  {
    id: 'adv_37',
    kind: 'choice',
    rules: ['c2_11'],
    prompt: 'Weather ___, the ceremony will be held outdoors.',
    options: ['permitting', 'permitted', 'permits', 'to permit'],
    why: {
      en: 'Weather permitting = if the weather permits: noun + -ing participle forms an absolute phrase.',
      ru: 'Weather permitting = если позволит погода: существительное + причастие на -ing образуют абсолютный оборот.',
    },
  },
  {
    id: 'adv_38',
    kind: 'choice',
    rules: ['c2_11'],
    prompt: 'The work ___, we went home.',
    options: ['done', 'doing', 'was done', 'having done'],
    why: {
      en: 'The work done = when the work had been done: noun + past participle with a passive meaning.',
      ru: 'The work done = когда работа была сделана: существительное + V3 с пассивным значением.',
    },
  },
  {
    id: 'adv_39',
    kind: 'choice',
    rules: ['c2_11'],
    prompt: 'All things ___, it was a successful year.',
    options: ['considered', 'considering', 'consider', 'to consider'],
    why: {
      en: 'All things considered is a fixed absolute phrase: things are considered (passive), so the past participle.',
      ru: 'All things considered — устойчивый абсолютный оборот: things are considered (пассив), поэтому V3.',
    },
  },
  {
    id: 'adv_40',
    kind: 'choice',
    rules: ['c2_11'],
    prompt: '___ no buses after midnight, we had to walk home.',
    options: ['There being', 'There were', 'Being', 'It being'],
    why: {
      en: 'There being no… = as there were no…: an absolute phrase. "There were…, we had to…" would be a comma splice.',
      ru: 'There being no… = так как не было…: абсолютный оборот. There were… дало бы два предложения через запятую.',
    },
  },
  {
    id: 'adv_41',
    kind: 'choice',
    rules: ['c2_11'],
    prompt: 'He stood in the doorway, his arms ___.',
    options: ['folded', 'folding', 'fold', 'were folded'],
    why: {
      en: 'His arms folded = with his arms folded: noun + past participle describes his posture.',
      ru: 'His arms folded = скрестив руки: существительное + V3 описывает позу.',
    },
  },
  {
    id: 'adv_42',
    kind: 'choice',
    rules: ['c2_11'],
    prompt: 'The meeting ___ over, everyone left the room.',
    options: ['being', 'was', 'been', 'is'],
    why: {
      en: 'The meeting being over = as the meeting was over. With was, the two clauses would be joined by a comma alone.',
      ru: 'The meeting being over = так как собрание закончилось. С was получились бы два предложения через запятую.',
    },
  },

  // ── Future in the past, Future Perfect Continuous, sequence of tenses ──────
  {
    id: 'adv_43',
    kind: 'choice',
    rules: ['b2_21', 'c2_15'],
    prompt: 'She promised that she ___ me the next day.',
    options: ['would call', 'will call', 'calls', 'is calling'],
    why: {
      en: 'After a past reporting verb, will becomes would: the future seen from the past (future in the past).',
      ru: 'После глагола в прошедшем времени will → would: будущее с точки зрения прошлого (future in the past).',
    },
  },
  {
    id: 'adv_44',
    kind: 'choice',
    rules: ['c2_14'],
    prompt: 'By next June, I ___ here for ten years.',
    options: ['will have been working', 'will be working', 'am working', 'have been working'],
    why: {
      en: 'By + a future point + duration (for ten years) → Future Perfect Continuous: will have been working.',
      ru: 'By + момент в будущем + длительность (for ten years) → Future Perfect Continuous: will have been working.',
    },
  },
  {
    id: 'adv_45',
    kind: 'choice',
    rules: ['c2_14'],
    prompt: 'When she retires next year, she ___ at this school for thirty years.',
    options: ['will have been teaching', 'will be teaching', 'has been teaching', 'teaches'],
    why: {
      en: 'Duration up to a future moment (when she retires) → will have been teaching.',
      ru: 'Длительность вплоть до момента в будущем (when she retires) → will have been teaching.',
    },
  },
  {
    id: 'adv_46',
    kind: 'choice',
    rules: ['b2_21', 'c2_15'],
    prompt: 'He said he ___ his new job the following week.',
    options: ['was starting', 'is starting', 'starts', 'will start'],
    why: {
      en: 'Reported from the past with "the following week": the present continuous for plans shifts to was starting.',
      ru: 'Пересказ в прошлом с the following week: Present Continuous для планов сдвигается в was starting.',
    },
  },
  {
    id: 'adv_47',
    kind: 'choice',
    rules: ['b2_21'],
    prompt: 'I ___ call you last night, but I fell asleep.',
    options: ['was going to', 'am going to', 'will', 'would have'],
    why: {
      en: 'Was/were going to = a past plan that did not happen: I was going to call, but…',
      ru: 'Was/were going to — план в прошлом, который не осуществился: I was going to call, but…',
    },
  },
  {
    id: 'adv_48',
    kind: 'choice',
    rules: ['b2_21'],
    prompt: 'We had no idea then that the trip ___ the best holiday of our lives.',
    options: [
      'would turn out to be',
      'will turn out to be',
      'turns out to be',
      'has turned out to be',
    ],
    why: {
      en: 'The future from a past viewpoint (we had no idea then) → would + verb, not will.',
      ru: 'Будущее с точки зрения прошлого (we had no idea then) → would + глагол, а не will.',
    },
  },
  {
    id: 'adv_49',
    kind: 'choice',
    rules: ['c2_15', 'b1_15'],
    prompt: 'She told me she ___ in London since 2015.',
    options: ['had lived', 'has lived', 'lives', 'lived'],
    why: {
      en: 'Since + a starting point in reported speech: the Present Perfect shifts back to the Past Perfect (had lived).',
      ru: 'Since в косвенной речи: Present Perfect сдвигается в Past Perfect (had lived).',
    },
  },
  {
    id: 'adv_50',
    kind: 'choice',
    rules: ['b2_21'],
    prompt: 'I knew she ___ furious when she found out.',
    options: ['would be', 'will be', 'is', 'has been'],
    why: {
      en: 'Knew puts us in the past, so the later event is expressed with would: I knew she would be…',
      ru: 'Knew переносит нас в прошлое, поэтому последующее событие выражается через would: I knew she would be…',
    },
  },

  // ── C2 conditionals ────────────────────────────────────────────────────────
  {
    id: 'adv_51',
    kind: 'choice',
    rules: ['c2_01', 'b2_07'],
    prompt: '___ your help, I would never have finished on time.',
    options: ['But for', 'Except', 'Unless', 'Instead of'],
    why: {
      en: 'But for + noun = if it hadn’t been for: But for your help, I would never have finished.',
      ru: 'But for + существительное = если бы не: But for your help, I would never have finished.',
    },
  },
  {
    id: 'adv_52',
    kind: 'choice',
    rules: ['c1_04'],
    prompt: '___ for the language barrier, I would move to Japan tomorrow.',
    options: ['Were it not', 'Had it not been', 'Was it not', "Weren't it"],
    why: {
      en: 'Were it not for = If it weren’t for (unreal present or future). Had it not been for refers to the past.',
      ru: 'Were it not for = если бы не (настоящее или будущее). Had it not been for — о прошлом.',
    },
  },
  {
    id: 'adv_53',
    kind: 'choice',
    rules: ['c2_01'],
    prompt: "Take your phone with you; ___, you won't be able to call for help.",
    options: ['otherwise', 'unless', 'in case', 'provided'],
    why: {
      en: 'Otherwise = if not / or else; it refers back to the previous clause. Unless and in case need a clause after them.',
      ru: 'Otherwise = иначе, а то; отсылает к предыдущей части. После unless и in case должно идти придаточное.',
    },
  },
  {
    id: 'adv_54',
    kind: 'choice',
    rules: ['c2_02'],
    prompt: '___ you won the lottery, what would you do first?',
    options: ['Supposing', 'Unless', 'Provided', 'In case'],
    why: {
      en: 'Supposing (= imagine that) + past tense introduces a hypothetical situation, followed by would.',
      ru: 'Supposing (= представь, что) + прошедшее время вводит гипотетическую ситуацию, затем would.',
    },
  },
  {
    id: 'adv_55',
    kind: 'choice',
    rules: ['c2_01'],
    prompt: "You can borrow the car ___ you don't drive it on the motorway.",
    options: ['provided', 'unless', 'otherwise', 'so that'],
    why: {
      en: 'Provided (that) = only if: a strict condition. Unless + don’t would be a double negative.',
      ru: 'Provided (that) = только при условии, что. Unless + don’t — двойное отрицание.',
    },
  },
  {
    id: 'adv_56',
    kind: 'choice',
    rules: ['c1_04', 'b2_08'],
    prompt: '___ the job in Paris, he would be living there now.',
    options: ['Had he taken', 'Did he take', 'Were he taken', 'Should he have taken'],
    why: {
      en: 'Mixed conditional with inversion: Had he taken (past condition) → would be living (present result).',
      ru: 'Смешанное условное с инверсией: Had he taken (условие в прошлом) → would be living (результат сейчас).',
    },
  },
];
