import { TENSES } from './tenses';

export interface ComparisonRow {
  label: string;
  a: string;
  b: string;
}

export interface SharedContext {
  context: string;
  a: string;
  aTr: string;
  b: string;
  bTr: string;
  note?: string;
}

export interface TenseComparison {
  /** Short one-line core difference. */
  summary: string;
  /** Row-by-row comparison (usage, time focus, common markers, etc). */
  rows: ComparisonRow[];
  /** Same situation expressed in both tenses to highlight nuance. */
  sharedContexts?: SharedContext[];
  /** Extra teaching notes / mistakes. */
  notes?: string[];
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}__${b}` : `${b}__${a}`;
}

/**
 * Curated Russian-language comparisons for the most commonly confused pairs.
 * Keys are sorted alphabetically: `${tenseA}__${tenseB}`.
 */
const CURATED_RU: Record<string, TenseComparison> = {
  // present_continuous vs present_simple
  present_continuous__present_simple: {
    summary:
      'Present Simple — регулярное, постоянное, общее. Present Continuous — сейчас, временно, в процессе.',
    rows: [
      {
        label: 'Когда используется',
        a: 'Процесс прямо сейчас или временно в этот период.',
        b: 'Привычки, факты, расписания, постоянные состояния.',
      },
      {
        label: 'Фокус',
        a: 'Момент речи или ограниченный отрезок («на этой неделе»).',
        b: 'Всегда/обычно/в принципе — без привязки к моменту.',
      },
      {
        label: 'Маркеры',
        a: 'now, right now, at the moment, currently, today, Look!, Listen!',
        b: 'always, usually, often, every day, on Mondays, as a rule',
      },
      {
        label: 'Глаголы состояния',
        a: 'Не используется (know, love, want, believe…).',
        b: 'Используется именно для них.',
      },
    ],
    sharedContexts: [
      {
        context: 'Про работу',
        a: "I'm working from home this week.",
        aTr: 'На этой неделе я работаю из дома (временно).',
        b: 'I work from home.',
        bTr: 'Я работаю из дома (в принципе, всегда).',
      },
      {
        context: 'Про поведение',
        a: "He's being rude today.",
        aTr: 'Он ведёт себя грубо сегодня (сейчас, необычно).',
        b: 'He is rude.',
        bTr: 'Он грубый (такой характер).',
      },
      {
        context: 'Про знание',
        a: '— (нельзя: I am knowing)',
        aTr: 'Stative verb нельзя в Continuous.',
        b: 'I know the answer.',
        bTr: 'Я знаю ответ.',
      },
    ],
    notes: [
      'Stative verbs (know, love, want, believe, need, understand) почти всегда требуют Present Simple.',
      "Present Continuous также используется для запланированных встреч в будущем: «I'm meeting Tom tomorrow».",
    ],
  },

  // past_simple vs present_perfect
  past_simple__present_perfect: {
    summary:
      'Past Simple — завершилось в конкретный момент прошлого. Present Perfect — важен результат или факт сейчас.',
    rows: [
      {
        label: 'Связь с настоящим',
        a: 'Отрезано от настоящего — просто факт прошлого.',
        b: 'Есть связь: результат, опыт или период ещё не закончен.',
      },
      {
        label: 'Маркеры времени',
        a: 'yesterday, last week, in 2020, ago, when… (конкретное время).',
        b: 'ever, never, just, already, yet, recently, so far, this week.',
      },
      {
        label: 'Вопрос',
        a: 'When did it happen? — важен момент.',
        b: 'Has it happened? — важен сам факт/опыт.',
      },
      {
        label: 'Период времени',
        a: 'Период закончился: «last week», «yesterday».',
        b: 'Период не закончился: «this week», «today», «so far».',
      },
    ],
    sharedContexts: [
      {
        context: 'Поездка в Японию',
        a: 'I went to Japan in 2019.',
        aTr: 'Я ездил в Японию в 2019 (конкретный момент, уже история).',
        b: "I've been to Japan.",
        bTr: 'Я был в Японии (опыт — факт жизни сейчас).',
      },
      {
        context: 'Потеря ключей',
        a: 'I lost my keys yesterday.',
        aTr: 'Я потерял ключи вчера (вчера — факт прошлого).',
        b: "I've lost my keys.",
        bTr: 'Я потерял ключи (их нет сейчас — результат налицо).',
      },
      {
        context: 'Завтрак',
        a: 'I had breakfast at 8am.',
        aTr: 'Я позавтракал в 8 утра (конкретное время).',
        b: "I've already had breakfast.",
        bTr: 'Я уже позавтракал (сейчас не голодный).',
      },
    ],
    notes: [
      'Главная ошибка: «I have seen him yesterday» → «I saw him yesterday» — с «yesterday» только Past Simple.',
      'В американском английском часто используют Past Simple там, где британцы скажут Present Perfect: «Did you eat?» vs «Have you eaten?».',
    ],
  },

  // present_perfect vs present_perfect_continuous
  present_perfect__present_perfect_continuous: {
    summary:
      'Present Perfect — результат/итог. Present Perfect Continuous — процесс и его продолжительность.',
    rows: [
      {
        label: 'Фокус',
        a: 'Сколько сделано, что получилось, сам факт.',
        b: 'Как долго идёт процесс, что человек «этим занимался».',
      },
      {
        label: 'Вопрос',
        a: 'How much? How many times? — результат.',
        b: 'How long? — продолжительность.',
      },
      {
        label: 'Завершённость',
        a: 'Обычно действие завершено, есть результат.',
        b: 'Часто ещё продолжается или только что закончилось.',
      },
      {
        label: 'Stative verbs',
        a: 'Используется (know, have, be…).',
        b: 'Не используется со stative verbs.',
      },
    ],
    sharedContexts: [
      {
        context: 'Книга',
        a: "I've read three books this week.",
        aTr: 'Я прочитал три книги за эту неделю (результат).',
        b: "I've been reading this book all week.",
        bTr: 'Я читаю эту книгу всю неделю (процесс, ещё не закончил).',
      },
      {
        context: 'Работа',
        a: "She's written the report.",
        aTr: 'Она написала отчёт (готов).',
        b: "She's been writing the report all day.",
        bTr: 'Она весь день пишет отчёт (процесс, может быть не готов).',
      },
      {
        context: 'Почему мокрый',
        a: "I've washed the car.",
        aTr: 'Я помыл машину (она чистая — результат).',
        b: "I've been washing the car.",
        bTr: 'Я мыл машину (поэтому я мокрый — след процесса).',
      },
    ],
    notes: [
      "«I've known him for years» — только Perfect, а не Perfect Continuous (know — stative).",
      'Perfect Continuous часто объясняет видимый сейчас результат: «Ты устал? — Я бегал».',
    ],
  },

  // past_continuous vs past_simple
  past_continuous__past_simple: {
    summary:
      'Past Simple — короткое или завершённое событие. Past Continuous — процесс/фон в прошлом.',
    rows: [
      {
        label: 'Характер действия',
        a: 'Длительный процесс, фон, параллельные действия.',
        b: 'Точечное, завершённое действие.',
      },
      {
        label: 'Типичная связка',
        a: 'Фон, который прервало Past Simple: «I was reading when he called».',
        b: 'Последовательность событий: «I came, saw, won».',
      },
      {
        label: 'Маркеры',
        a: 'while, as, at 8pm, all morning, at that moment.',
        b: 'yesterday, ago, in 2020, then, after that.',
      },
    ],
    sharedContexts: [
      {
        context: 'Во время звонка',
        a: 'I was cooking when she called.',
        aTr: 'Я готовил, когда она позвонила (готовка — фон).',
        b: 'I cooked dinner and then she called.',
        bTr: 'Я приготовил ужин, потом она позвонила (последовательность).',
      },
      {
        context: 'Вчера в 8',
        a: 'At 8pm I was watching TV.',
        aTr: 'В 8 вечера я смотрел телевизор (был в процессе).',
        b: 'At 8pm I watched the news.',
        bTr: 'В 8 вечера я посмотрел новости (точечное действие).',
      },
    ],
    notes: [
      'Past Continuous не используется со stative verbs — «I was knowing» → «I knew».',
      '«When I arrived» (Past Simple) + «she was cooking» (Past Continuous) — классическая связка.',
    ],
  },

  // past_perfect vs past_simple
  past_perfect__past_simple: {
    summary:
      'Past Simple — событие в прошлом. Past Perfect — действие ДО другого момента/события в прошлом (предпрошедшее).',
    rows: [
      {
        label: 'Последовательность',
        a: 'Действие, которое произошло раньше другого прошлого.',
        b: 'События идут в естественном порядке одно за другим.',
      },
      {
        label: 'Когда нужно',
        a: 'Когда важно показать, что ОДНО случилось ДО другого.',
        b: 'Простой рассказ, одна цепочка событий.',
      },
      {
        label: 'Маркеры',
        a: 'already, just, never (before that), by the time, before, after.',
        b: 'yesterday, then, after that, in 2020.',
      },
    ],
    sharedContexts: [
      {
        context: 'Пришёл и ушла',
        a: 'When I arrived, she had already left.',
        aTr: 'Когда я пришёл, она уже ушла (ушла раньше, чем я пришёл).',
        b: 'When I arrived, she left.',
        bTr: 'Когда я пришёл, она ушла (сразу после моего прихода).',
      },
      {
        context: 'Поезд',
        a: 'The train had left when we got to the station.',
        aTr: 'Поезд уже ушёл, когда мы добрались до станции.',
        b: 'The train left when we got to the station.',
        bTr: 'Поезд отошёл в момент нашего прибытия.',
      },
    ],
    notes: [
      'Если порядок ясен по союзу (after, before), Past Perfect не обязателен: «After he ate, he left».',
      'Past Perfect не нужен, если просто идёт рассказ по порядку — только для «сдвига назад».',
    ],
  },

  // past_perfect vs past_perfect_continuous
  past_perfect__past_perfect_continuous: {
    summary:
      'Past Perfect — факт завершения до момента в прошлом. Past Perfect Continuous — продолжительность процесса до момента в прошлом.',
    rows: [
      {
        label: 'Фокус',
        a: 'Сколько сделано, что уже было готово.',
        b: 'Как долго шёл процесс до момента.',
      },
      {
        label: 'Вопрос',
        a: 'What had happened? — результат.',
        b: 'How long had it been going? — длительность.',
      },
      {
        label: 'Типичный маркер',
        a: 'already, just, by the time, before.',
        b: 'for, since, all morning, the whole day.',
      },
    ],
    sharedContexts: [
      {
        context: 'Когда пришёл босс',
        a: 'He had finished the report.',
        aTr: 'Он закончил отчёт (к моменту прихода босса — готов).',
        b: 'He had been writing the report for three hours.',
        bTr: 'Он писал отчёт уже три часа (продолжал в этот момент).',
      },
      {
        context: 'Почему уставшая',
        a: 'She had worked a lot that month.',
        aTr: 'Она много работала в тот месяц (факт, итог).',
        b: "She'd been working all night.",
        bTr: 'Она работала всю ночь (поэтому утром была измотана).',
      },
    ],
  },

  // future_going_to vs future_will
  future_going_to__future_will: {
    summary:
      'will — спонтанное решение, предсказание, обещание. be going to — заранее принятое решение или предсказание по видимым признакам.',
    rows: [
      {
        label: 'Решение',
        a: "Решено заранее, есть план: «I'm going to study medicine».",
        b: "Решение прямо сейчас, в момент речи: «OK, I'll help you».",
      },
      {
        label: 'Предсказание',
        a: "На основании того, что видно: «Look at those clouds — it's going to rain».",
        b: 'Общее предположение, мнение: «I think it will rain tomorrow».',
      },
      {
        label: 'Обещание / согласие',
        a: 'Редко — чаще план.',
        b: "Типично: «I'll call you», «I won't tell anyone».",
      },
      {
        label: 'Маркеры',
        a: "I've decided, I'm planning, tonight, soon.",
        b: "probably, maybe, I think, I'm sure, certainly.",
      },
    ],
    sharedContexts: [
      {
        context: 'Телефон звонит',
        a: '— (планов отвечать нет).',
        aTr: 'be going to тут звучит странно — решение не заранее.',
        b: "I'll get it!",
        bTr: 'Я возьму! (спонтанное решение в момент речи).',
      },
      {
        context: 'Планы на вечер',
        a: "I'm going to watch a film tonight.",
        aTr: 'Я собираюсь посмотреть фильм вечером (план).',
        b: "I'll watch a film tonight.",
        bTr: 'Посмотрю, наверное, фильм (решил только что).',
      },
      {
        context: 'Прогноз',
        a: "It's going to rain — look at the sky.",
        aTr: 'Сейчас пойдёт дождь — видно по небу.',
        b: 'It will probably rain tomorrow.',
        bTr: 'Завтра, наверное, будет дождь (просто мнение).',
      },
    ],
    notes: [
      'Часто оба варианта допустимы — разница в оттенке, а не в грамматике.',
      'Нельзя «I am going to will do» — только одна форма будущего.',
    ],
  },

  // future_continuous vs future_will
  future_continuous__future_will: {
    summary:
      'will + V — просто произойдёт. will be + V-ing — будет в процессе в конкретный момент.',
    rows: [
      {
        label: 'Характер действия',
        a: 'Длительный процесс в определённый момент будущего.',
        b: 'Факт или предсказание о будущем в целом.',
      },
      {
        label: 'Типичный маркер',
        a: 'at 8pm tomorrow, this time next week, while you sleep.',
        b: 'tomorrow, soon, next year, one day.',
      },
    ],
    sharedContexts: [
      {
        context: 'Завтра в 8',
        a: "At 8pm tomorrow I'll be having dinner.",
        aTr: 'Завтра в 8 я буду ужинать (буду в процессе).',
        b: "I'll have dinner at 8pm tomorrow.",
        bTr: 'Завтра в 8 я поужинаю (сам факт ужина).',
      },
    ],
  },

  // future_continuous vs future_perfect
  future_continuous__future_perfect: {
    summary:
      'Future Continuous — будет в процессе в момент будущего. Future Perfect — завершится ДО этого момента.',
    rows: [
      {
        label: 'Момент',
        a: 'В процессе, параллельно моменту.',
        b: 'Завершится до момента — к нему уже будет готово.',
      },
      {
        label: 'Маркер',
        a: 'at this time tomorrow, when you arrive.',
        b: 'by Friday, by the end of the year, before then.',
      },
    ],
    sharedContexts: [
      {
        context: 'К воскресенью',
        a: "On Sunday at noon I'll be working.",
        aTr: 'В воскресенье в полдень я буду работать (буду за работой).',
        b: "By Sunday I'll have finished the work.",
        bTr: 'К воскресенью я закончу работу (будет готово до воскресенья).',
      },
    ],
  },

  // future_will vs present_continuous → not directly comparable via key; need future_will with present_continuous
  future_will__present_continuous: {
    summary:
      'Present Continuous (для будущего) — заранее оговорённая встреча, договорённость. will — предсказание или спонтанное решение.',
    rows: [
      {
        label: 'Будущее',
        a: 'Процесс сейчас ИЛИ договорённость на будущее (есть план, с кем-то согласовано).',
        b: 'Предсказание, обещание, спонтанное решение.',
      },
      {
        label: 'Когда выбирать',
        a: "Когда время/место оговорено: «I'm meeting Tom at 5».",
        b: 'Когда ещё не решено или это просто мнение о будущем.',
      },
    ],
    sharedContexts: [
      {
        context: 'Встреча',
        a: "I'm meeting Tom tomorrow at 5.",
        aTr: 'Я встречаюсь с Томом завтра в 5 (договорились).',
        b: "I'll meet Tom tomorrow.",
        bTr: 'Я встречусь с Томом завтра (просто намерение/предположение).',
      },
    ],
  },

  // past_continuous vs past_perfect_continuous
  past_continuous__past_perfect_continuous: {
    summary:
      'Past Continuous — был в процессе в момент прошлого. Past Perfect Continuous — процесс шёл ДО момента в прошлом.',
    rows: [
      {
        label: 'Время процесса',
        a: 'Шёл ДО определённого момента в прошлом (и, возможно, продолжался).',
        b: 'Идёт одновременно с другим прошлым действием.',
      },
      {
        label: 'Маркеры',
        a: 'for two hours before, since morning, by the time.',
        b: 'at 8pm, while, when (+ Past Simple), as.',
      },
    ],
    sharedContexts: [
      {
        context: 'Когда он пришёл',
        a: 'She had been waiting for two hours when he arrived.',
        aTr: 'Она ждала уже два часа, когда он пришёл (процесс до момента).',
        b: 'She was waiting when he arrived.',
        bTr: 'Она ждала, когда он пришёл (фон в момент прихода).',
      },
    ],
  },

  // future_going_to vs present_continuous
  future_going_to__present_continuous: {
    summary:
      'Present Continuous (будущее) — уже есть договорённость, билеты/встреча. be going to — намерение или прогноз.',
    rows: [
      {
        label: 'Степень готовности',
        a: 'Намерение или план, но необязательно всё оговорено.',
        b: 'Встреча/поездка уже оформлена, согласована.',
      },
    ],
    sharedContexts: [
      {
        context: 'Париж',
        a: "I'm going to visit Paris someday.",
        aTr: 'Я собираюсь когда-нибудь съездить в Париж (намерение).',
        b: "I'm visiting Paris next week.",
        bTr: 'Я еду в Париж на следующей неделе (билеты куплены).',
      },
    ],
  },

  // present_continuous vs present_perfect_continuous
  present_continuous__present_perfect_continuous: {
    summary:
      'Present Continuous — процесс прямо сейчас. Present Perfect Continuous — процесс начался в прошлом и идёт до сих пор.',
    rows: [
      {
        label: 'Начало',
        a: 'Началось в прошлом (for/since) и продолжается сейчас.',
        b: 'Происходит прямо в момент речи, без акцента на длительность.',
      },
      {
        label: 'Маркеры',
        a: 'for two hours, since morning, all day, how long.',
        b: 'now, right now, at the moment.',
      },
    ],
    sharedContexts: [
      {
        context: 'Английский',
        a: "I've been learning English for two years.",
        aTr: 'Я учу английский уже два года (начал тогда, продолжаю).',
        b: "I'm learning English right now.",
        bTr: 'Я учу английский прямо сейчас (момент речи).',
      },
    ],
  },

  // past_simple vs present_perfect_continuous
  past_simple__present_perfect_continuous: {
    summary:
      'Past Simple — закончилось в прошлом. Present Perfect Continuous — шло до настоящего и связано с ним.',
    rows: [
      {
        label: 'Связь с сейчас',
        a: 'Никакой — просто история.',
        b: 'Напрямую: процесс либо ещё идёт, либо только что остановился.',
      },
    ],
    sharedContexts: [
      {
        context: 'Бег',
        a: 'I ran this morning.',
        aTr: 'Я бегал утром (утро уже прошло).',
        b: "I've been running — that's why I'm tired.",
        bTr: 'Я бегал — вот почему я устал (результат сейчас).',
      },
    ],
  },

  // present_perfect vs present_simple
  present_perfect__present_simple: {
    summary:
      'Present Simple — общие факты и привычки. Present Perfect — действие в прошлом с результатом сейчас или опыт.',
    rows: [
      {
        label: 'Что выражают',
        a: 'Опыт, результат, завершённость к настоящему.',
        b: 'Правда в принципе, регулярность, расписание.',
      },
    ],
    sharedContexts: [
      {
        context: 'Работа',
        a: "I've worked here for 5 years.",
        aTr: 'Я работаю здесь 5 лет (начал раньше, продолжаю).',
        b: 'I work here.',
        bTr: 'Я здесь работаю (факт).',
      },
      {
        context: 'Япония',
        a: "I've been to Japan.",
        aTr: 'Я был в Японии (опыт).',
        b: 'I go to Japan every year.',
        bTr: 'Я езжу в Японию каждый год (привычка).',
      },
    ],
  },

  // past_perfect vs present_perfect
  past_perfect__present_perfect: {
    summary:
      'Present Perfect — связь с настоящим. Past Perfect — связь с моментом в прошлом (предпрошедшее).',
    rows: [
      {
        label: 'Точка отсчёта',
        a: 'Момент в прошлом — до него что-то случилось.',
        b: 'Настоящее — к моменту речи.',
      },
    ],
    sharedContexts: [
      {
        context: 'Фильм',
        a: 'When I met him, I had already seen the film.',
        aTr: 'Когда я с ним встретился, я уже видел фильм (до встречи).',
        b: "I've already seen the film.",
        bTr: 'Я уже видел фильм (к настоящему моменту).',
      },
    ],
  },

  // future_perfect vs future_will
  future_perfect__future_will: {
    summary:
      'will + V — просто произойдёт в будущем. will have + V3 — будет завершено ДО конкретного момента.',
    rows: [
      {
        label: 'Момент завершения',
        a: 'До конкретной точки («к пятнице»).',
        b: 'Когда-то в будущем, без привязки к «до».',
      },
    ],
    sharedContexts: [
      {
        context: 'Работа',
        a: "I'll finish the report on Friday.",
        aTr: 'Я закончу отчёт в пятницу (в этот день).',
        b: "I'll have finished the report by Friday.",
        bTr: 'К пятнице я уже закончу отчёт (до пятницы).',
      },
    ],
  },

  // future_going_to vs future_perfect
  future_going_to__future_perfect: {
    summary:
      'be going to — план или прогноз. Future Perfect — действие завершится до определённого момента в будущем.',
    rows: [
      {
        label: 'Идея',
        a: 'Запланированное действие, намерение.',
        b: 'Что к какому-то моменту будет уже готово.',
      },
    ],
  },

  // future_continuous vs future_going_to
  future_continuous__future_going_to: {
    summary:
      'be going to — план. Future Continuous — действие будет В ПРОЦЕССЕ в момент будущего (часто без специальных усилий, по ходу дела).',
    rows: [
      {
        label: 'Оттенок',
        a: 'Запланированное намерение.',
        b: 'Часто «так и так будет происходить», без явного «я собираюсь».',
      },
    ],
    sharedContexts: [
      {
        context: 'Мимо магазина',
        a: "I'm going to buy milk later.",
        aTr: 'Я собираюсь купить молоко позже (план).',
        b: "I'll be passing the shop — I can get milk.",
        bTr: 'Я всё равно буду проходить мимо — могу купить молоко.',
      },
    ],
  },
};

/**
 * Russian labels for fallback (auto-generated) comparison rows.
 */
const AUTO_LABELS_RU = {
  summary: 'Разные функции во времени: сравните формулы, маркеры и примеры ниже.',
  formula: 'Формула',
  meaning: 'Значение',
  markers: 'Маркеры',
  example1: 'Пример 1',
  example2: 'Пример 2',
};

/**
 * Build a generic comparison for pairs not in the curated map.
 * Uses existing Russian i18n keys from ru.json: `tenses.{key}.desc/ex0/ex0tr/ex1/ex1tr`.
 */
function buildAutoComparison(
  keyA: string,
  keyB: string,
  tRu: (k: string) => string,
): TenseComparison {
  const a = TENSES[keyA];
  const b = TENSES[keyB];
  return {
    summary: AUTO_LABELS_RU.summary,
    rows: [
      { label: AUTO_LABELS_RU.formula, a: a.formula, b: b.formula },
      {
        label: AUTO_LABELS_RU.meaning,
        a: tRu(`tenses.${keyA}.desc`),
        b: tRu(`tenses.${keyB}.desc`),
      },
      { label: AUTO_LABELS_RU.markers, a: a.markers, b: b.markers },
    ],
    sharedContexts: [
      {
        context: AUTO_LABELS_RU.example1,
        a: tRu(`tenses.${keyA}.ex0`),
        aTr: tRu(`tenses.${keyA}.ex0tr`),
        b: tRu(`tenses.${keyB}.ex0`),
        bTr: tRu(`tenses.${keyB}.ex0tr`),
      },
      {
        context: AUTO_LABELS_RU.example2,
        a: tRu(`tenses.${keyA}.ex1`),
        aTr: tRu(`tenses.${keyA}.ex1tr`),
        b: tRu(`tenses.${keyB}.ex1`),
        bTr: tRu(`tenses.${keyB}.ex1tr`),
      },
    ],
  };
}

/**
 * Get the comparison for two tenses, ordered by (keyA, keyB) as the UI expects.
 * If the curated entry is stored with keys reversed, swap the `a/b` fields so
 * column A always corresponds to `keyA`.
 */
export function getTenseComparison(
  keyA: string,
  keyB: string,
  tRu: (k: string) => string,
): TenseComparison {
  if (keyA === keyB) {
    return {
      summary: '',
      rows: [],
    };
  }
  const key = pairKey(keyA, keyB);
  const curated = CURATED_RU[key];
  if (curated) {
    // If the curated key is `${keyB}__${keyA}` (reverse order), swap columns.
    const reversed = key === `${keyB}__${keyA}` && keyA !== keyB;
    if (!reversed) return curated;
    return {
      summary: curated.summary,
      rows: curated.rows.map((r) => ({ label: r.label, a: r.b, b: r.a })),
      sharedContexts: curated.sharedContexts?.map((s) => ({
        context: s.context,
        a: s.b,
        aTr: s.bTr,
        b: s.a,
        bTr: s.aTr,
        note: s.note,
      })),
      notes: curated.notes,
    };
  }
  return buildAutoComparison(keyA, keyB, tRu);
}

export function hasCuratedComparison(keyA: string, keyB: string): boolean {
  return Boolean(CURATED_RU[pairKey(keyA, keyB)]);
}
