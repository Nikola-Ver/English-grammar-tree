export interface Tense {
  name: string;
  formula: string;
  color: string;
  desc: string;
  markers: string;
  examples: [string, string][];
  mistakes: string[];
}

export const TENSES: Record<string, Tense> = {
  present_simple: {
    name: 'Present Simple',
    formula: 'V / V+s(es)',
    color: '#4ade80',
    desc: 'Регулярные действия, привычки, факты и расписания.',
    markers:
      'always, usually, often, sometimes, occasionally, rarely, seldom, never, every day, every week, every month, every morning, on Mondays, once a week, twice a month, in general, normally, regularly, as a rule',
    examples: [
      ['She drinks coffee every morning.', 'Она пьёт кофе каждое утро.'],
      ['The sun rises in the east.', 'Солнце встаёт на востоке.'],
    ],
    mistakes: [
      '~~She work~~ → She <em>works</em>',
      '~~Do she likes?~~ → Does she like?',
      "~~I not like~~ → I <em>don't</em> like",
    ],
  },
  present_continuous: {
    name: 'Present Continuous',
    formula: 'am/is/are + V-ing',
    color: '#34d399',
    desc: 'Действие прямо сейчас или временная ситуация. Также конкретные планы на будущее.',
    markers:
      'now, right now, at the moment, at present, currently, today, this week, this month, still, Look!, Listen!, these days, temporarily, for the time being',
    examples: [
      ["I'm studying English right now.", 'Я сейчас изучаю английский.'],
      ["She's meeting Tom tomorrow.", 'Она встречается с Томом завтра.'],
    ],
    mistakes: [
      '~~I am knowing~~ → stative verbs не употребляются в Continuous',
      '~~She is working usually~~ → She <em>usually works</em> (привычка = PS)',
    ],
  },
  past_simple: {
    name: 'Past Simple',
    formula: 'V2 / did + V',
    color: '#38bdf8',
    desc: 'Завершённое действие в прошлом. Всегда с конкретным временем или подразумеваемым моментом.',
    markers:
      'yesterday, last night, last week, last month, last year, ago, in 2020, in January, at 3pm, on Tuesday, when I was young, then, after that, suddenly, finally, once, in those days, in the past, at that time',
    examples: [
      ['I saw her yesterday.', 'Я видел её вчера.'],
      ['She went to Paris in 2022.', 'Она ездила в Париж в 2022 году.'],
    ],
    mistakes: [
      '~~I goed~~ → I <em>went</em>',
      "~~I didn't went~~ → I didn't <em>go</em>",
      '~~I have seen him yesterday~~ → I <em>saw</em> him yesterday',
    ],
  },
  past_continuous: {
    name: 'Past Continuous',
    formula: 'was/were + V-ing',
    color: '#818cf8',
    desc: 'Действие в процессе в момент прошлого. Фоновое действие, прерванное другим.',
    markers:
      'at 8pm yesterday, at this time last week, all morning, all day, all evening, while, when (+ Past Simple), as, just as, at that moment, in the middle of, during',
    examples: [
      ['I was reading when she called.', 'Я читал, когда она позвонила.'],
      ['While he was cooking, she was working.', 'Пока он готовил, она работала.'],
    ],
    mistakes: [
      '~~She were working~~ → She <em>was</em> working',
      '~~I was work~~ → I was <em>working</em>',
    ],
  },
  present_perfect: {
    name: 'Present Perfect',
    formula: 'have/has + V3',
    color: '#f472b6',
    desc: 'Действие в прошлом с результатом в настоящем. Жизненный опыт. Незавершённое действие с for/since.',
    markers:
      'ever, never, already, yet, just, recently, lately, so far, up to now, until now, this week, this month, today, before, once, twice, three times, for, since, still (not yet)',
    examples: [
      ["I've lost my keys.", 'Я потерял ключи (они сейчас не найдены).'],
      ['Have you ever been to Japan?', 'Ты когда-нибудь был в Японии?'],
    ],
    mistakes: [
      '~~I have seen him yesterday~~ → I <em>saw</em> him yesterday',
      '~~She has went~~ → She has <em>gone</em>',
      "~~I've lived here since five years~~ → <em>for</em> five years",
    ],
  },
  present_perfect_continuous: {
    name: 'Present Perfect Continuous',
    formula: 'have/has been + V-ing',
    color: '#fb923c',
    desc: 'Акцент на продолжительности или незавершённости действия, начавшегося в прошлом.',
    markers:
      'for, since, How long...?, all day, all morning, all evening, all week, all month, lately, recently, these days, still, the whole time',
    examples: [
      ["I've been learning English for two years.", 'Я учу английский уже два года.'],
      ["Why are you tired? — I've been running.", 'Почему ты устал? — Бегал.'],
    ],
    mistakes: [
      "~~I've been know~~ → stative verbs не в Continuous",
      "~~I've been learning since two years~~ → <em>for</em> two years",
    ],
  },
  past_perfect: {
    name: 'Past Perfect',
    formula: 'had + V3',
    color: '#34d399',
    desc: 'Действие, завершившееся до другого момента в прошлом.',
    markers:
      'by the time, before, after, when (+ Past Simple), already, just, never, ever, by Monday, by then, as soon as, once, until, hardly...when, no sooner...than',
    examples: [
      ['When I arrived, she had already left.', 'Когда я приехал, она уже ушла.'],
      ['He had never seen snow before that winter.', 'До той зимы он никогда не видел снег.'],
    ],
    mistakes: [
      '~~When I arrived, she already left~~ → she <em>had</em> already left',
      '~~He had never see~~ → He had never <em>seen</em>',
    ],
  },
  past_perfect_continuous: {
    name: 'Past Perfect Continuous',
    formula: 'had been + V-ing',
    color: '#4ade80',
    desc: 'Продолжительность действия до момента в прошлом. Объясняет причину или видимый результат в прошлом.',
    markers:
      'for, since, How long...?, all morning, all day, by the time, when, before ... arrived, the whole time',
    examples: [
      [
        "She was exhausted — she'd been working all night.",
        'Она была измотана — всю ночь работала.',
      ],
      ['How long had you been waiting?', 'Как долго ты ждал?'],
    ],
    mistakes: [
      '~~She had been work~~ → She had been <em>working</em>',
      '~~How long had you waiting?~~ → had you <em>been waiting</em>',
    ],
  },
  future_will: {
    name: 'Future Simple (will)',
    formula: 'will + V',
    color: '#38bdf8',
    desc: 'Предсказания, спонтанные решения, обещания, факты о будущем.',
    markers:
      "tomorrow, next week, next month, next year, soon, in a minute, in an hour, in the future, one day, someday, probably, perhaps, maybe, I think..., I expect..., I'm sure..., certainly, definitely",
    examples: [
      ["I'll help you!", 'Я помогу тебе! (спонтанное решение)'],
      ['She will probably be late.', 'Она, вероятно, опоздает.'],
    ],
    mistakes: ['~~I will to go~~ → I will <em>go</em>', '~~She wills come~~ → She will come'],
  },
  future_going_to: {
    name: 'Future (be going to)',
    formula: 'am/is/are going to + V',
    color: '#818cf8',
    desc: 'Запланированные намерения или предсказания на основе видимых признаков.',
    markers:
      "tomorrow, next week, soon, this weekend, tonight, in June, Look!, Watch out!, I've decided..., I've arranged...",
    examples: [
      ["I'm going to study medicine.", 'Я собираюсь изучать медицину. (план)'],
      ["Look at those clouds — it's going to rain!", 'Смотри на тучи — сейчас пойдёт дождь!'],
    ],
    mistakes: [
      '~~She is going to does~~ → She is going to <em>do</em>',
      '~~I am going to will do~~ — нельзя два будущих',
    ],
  },
  future_continuous: {
    name: 'Future Continuous',
    formula: 'will be + V-ing',
    color: '#f472b6',
    desc: 'Действие, которое будет в процессе в конкретный момент будущего.',
    markers:
      'at this time tomorrow, this time next week, at 8pm tomorrow, tomorrow morning, all day tomorrow, in two hours, when you arrive, while you are sleeping, at that moment tomorrow',
    examples: [
      [
        "This time tomorrow I'll be lying on the beach.",
        'В это время завтра я буду лежать на пляже.',
      ],
      ["Don't call at 8 — I'll be having dinner.", 'Не звони в 8 — я буду ужинать.'],
    ],
    mistakes: [
      "~~I'll be work at 9~~ → I'll be <em>working</em>",
      '~~She will working~~ → She <em>will be working</em>',
    ],
  },
  future_perfect: {
    name: 'Future Perfect',
    formula: 'will have + V3',
    color: '#fb923c',
    desc: 'Действие, которое завершится до определённого момента в будущем.',
    markers:
      'by tomorrow, by Friday, by the end of the week, by the end of the year, by 2030, by the time you arrive, before you get here, before midnight, by then',
    examples: [
      ["I'll have finished by Sunday.", 'К воскресенью я закончу.'],
      ['By 2030 they will have built the bridge.', 'К 2030 году они построят мост.'],
    ],
    mistakes: [
      '~~By Friday I will finish~~ → I will <em>have finished</em>',
      "~~I'll have finish~~ → I'll have <em>finished</em>",
    ],
  },
};
