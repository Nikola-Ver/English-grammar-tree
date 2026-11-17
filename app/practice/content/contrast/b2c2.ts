import type { RuContrast } from '../types';

export const CONTRAST_B2C2: Record<string, RuContrast> = {
  // ─── B2 ───────────────────────────────────────────────────────────────
  b2_01: {
    ru: 'В русском нет «предпрошедшего» времени: порядок событий передают слова <em>уже</em>, <em>до этого</em> или контекст. В английском то, что случилось раньше другого момента в прошлом, обычно ставят в <b>had + V3</b>. Сравни: <em>When I arrived, she left</em> — она ушла после моего прихода; <em>she had left</em> — до него. Совет: «уже» в рассказе о прошлом — сигнал проверить Past Perfect.',
    en: "Russian has no 'past-before-past' tense: the order of events is shown by words like <em>uzhe</em> ('already') or by context. English normally puts the earlier past event in <b>had + V3</b>. Compare: <em>When I arrived, she left</em> means she left after I came; <em>she had left</em> means before. Tip: whenever you'd say <em>uzhe</em> in a story about the past, check whether you need the Past Perfect.",
    pairs: [
      {
        ru: 'Когда я пришёл, фильм уже начался.',
        calque: 'When I came, the film already started.',
        en: 'When I arrived, the film had already started.',
      },
      {
        ru: 'К тому времени, как мы приехали, все уже ушли.',
        calque: 'By the time we came, everybody already left.',
        en: 'By the time we arrived, everyone had already left.',
      },
    ],
    trap: 'tenses',
  },
  b2_02: {
    ru: 'По-русски длительность до момента в прошлом передаёт обычный несовершенный вид: «Я ждал уже час, когда он позвонил». В английском здесь нужен <b>had been + V-ing</b>: Past Simple не показывает, что ожидание всё ещё длилось в момент звонка. Это же время объясняет видимый след в прошлом: красные глаза → <em>she had been crying</em>. Подсказка: «уже + срок + когда» в прошлом = Past Perfect Continuous.',
    en: "In Russian, an action lasting up to a past moment is just the imperfective past: 'I waited already an hour when he called'. English needs <b>had been + V-ing</b> here; the Past Simple doesn't show the waiting was still going on when he called. The same tense explains a visible trace in the past: red eyes → <em>she had been crying</em>. Tip: 'already + period + when' in a past story = Past Perfect Continuous.",
    pairs: [
      {
        ru: 'Я ждал уже час, когда он позвонил.',
        calque: 'I waited already one hour when he called.',
        en: 'I had been waiting for an hour when he called.',
      },
      {
        ru: 'У неё были красные глаза: она плакала.',
        calque: 'Her eyes were red: she cried.',
        en: 'Her eyes were red — she had been crying.',
      },
      {
        ru: 'Они встречались два года, когда поженились.',
        calque: 'They met for two years when they married.',
        en: 'They had been going out for two years when they got married.',
      },
    ],
    trap: 'tenses',
  },
  b2_03: {
    ru: 'Русские «должно быть», «наверное», «видимо» — вводные слова, а время показывает сам глагол: «должно быть, забыла». В английском догадку выражает модальный <em>must</em>, у которого нет прошедшей формы, поэтому прошлое передаёт <b>have + V3</b>: <em>must have forgotten</em>. А «должен был» в смысле обязанности — это <em>had to</em>, совсем другое значение.',
    en: "Russian <em>dolzhno byt'</em>, <em>navernoe</em> ('must be', 'probably') are parenthetical words, and the verb itself carries the past: 'she, must be, forgot'. In English the guess is the modal <em>must</em>, which has no past form, so the past goes into <b>have + V3</b>: <em>must have forgotten</em>. Don't confuse it with <em>had to</em> (obligation): Russian <em>dolzhen byl</em> covers both.",
    pairs: [
      {
        ru: 'Она, должно быть, забыла о встрече.',
        calque: 'She must forgot about the meeting.',
        en: 'She must have forgotten about the meeting.',
      },
      {
        ru: 'Ты, наверное, очень устал вчера.',
        calque: 'You must be very tired yesterday.',
        en: 'You must have been very tired yesterday.',
      },
      {
        ru: 'Он, видимо, ушёл рано — пальто нет.',
        calque: 'He must leave early — there is no coat.',
        en: "He must have left early — his coat's gone.",
      },
    ],
    trap: 'modals',
  },
  b2_04: {
    ru: "Русское «не мог» значит и «не был в состоянии», и «исключено, что это было»: «Он не мог её видеть» — то ли не получилось, то ли невозможно. Английский разводит эти смыслы: <em>couldn't see</em> — не смог увидеть, <b>can't / couldn't have seen</b> — уверенность, что этого не было. Логический вывод о прошлом всегда строится с <b>have + V3</b>.",
    en: "Russian <em>ne mog</em> ('couldn't') means both 'wasn't able to' and 'it's impossible that it happened'. English separates them: <em>He couldn't see her</em> = he wasn't able to; <em>He can't / couldn't have seen her</em> = I'm sure it didn't happen. A deduction about the past always needs <b>have + V3</b>.",
    pairs: [
      {
        ru: 'Он не мог её видеть — она была за границей.',
        calque: "He couldn't see her — she was abroad.",
        en: "He can't have seen her — she was abroad.",
      },
      {
        ru: 'Он не мог так быстро закончить.',
        calque: "He can't finish so quickly.",
        en: "He can't have finished so quickly.",
      },
    ],
    trap: 'modals',
  },
  b2_05: {
    ru: 'Русское «надо было» означает и обязанность («надо было встать в шесть — и я встал»), и сожаление («надо было взять зонт, а я не взял»). В английском это разные конструкции: <em>had to</em> — пришлось и сделал, <b>should have + V3</b> — стоило сделать, но не сделал. Перевод «надо было» как <em>had to</em> превращает сожаление в сообщение о факте.',
    en: "Russian <em>nado bylo</em> covers both obligation ('I had to get up at six, and I did') and regret ('I should have taken an umbrella, but I didn't'). English splits them: <em>had to</em> = it was necessary and happened; <b>should have + V3</b> = it was the right thing, but it didn't happen. Translating <em>nado bylo</em> as <em>had to</em> turns regret into a statement of fact.",
    pairs: [
      {
        ru: 'Надо было взять зонт.',
        calque: 'I had to take an umbrella.',
        en: 'I should have taken an umbrella.',
      },
      {
        ru: 'Не надо было ему говорить.',
        calque: "I didn't have to tell him.",
        en: "I shouldn't have told him.",
      },
      {
        ru: 'Тебе следовало мне позвонить!',
        calque: 'You should call me!',
        en: 'You should have called me!',
      },
    ],
    trap: 'modals',
  },
  b2_06: {
    ru: 'По-русски прошлое видно по самому «мог»: «Он мог выйти через чёрный ход», «Ты мог бы предупредить!» — а дальше идёт обычный инфинитив. В английском <em>could/might + V</em> обычно говорит о настоящем или будущем (или об умении в прошлом), а предположение о прошлом или упущенный шанс требуют <b>could/might have + V3</b>. Упрёк «мог бы и предупредить» — тоже <em>could have warned</em>.',
    en: "In Russian the past is marked on <em>mog</em> ('could') itself, followed by a plain infinitive: 'He could go out the back way', 'You could warn me!'. In English, <em>could/might + verb</em> usually refers to now or the future (or to past ability); a guess about the past or a missed chance needs <b>could/might have + V3</b>. The reproach 'you could have warned me!' works the same way.",
    pairs: [
      {
        ru: 'Он мог выйти через чёрный ход.',
        calque: 'He could go out through the back door.',
        en: 'He could have left through the back door.',
      },
      {
        ru: 'Ты мог бы меня предупредить!',
        calque: 'You could warn me!',
        en: 'You could have warned me!',
      },
      {
        ru: 'Я мог бы выиграть, если бы постарался.',
        calque: 'I could win if I tried harder.',
        en: 'I could have won if I had tried harder.',
      },
    ],
    trap: 'modals',
  },
  b2_07: {
    ru: 'Русское «если бы… бы» одинаково для настоящего и прошлого: «Если бы я знал, я бы помог» — и про сейчас, и про вчера. В английском нереальное прошлое сдвигается ещё на шаг назад: <b>If + had + V3, would have + V3</b>. И не переносите «бы» в обе части: в части с <em>if</em> <em>would</em> не нужен.',
    en: "Russian <em>esli by… by</em> ('if… would') is the same for present and past: 'If I knew, I would help' can be about now or about yesterday. English moves an unreal past one more step back: <b>If + had + V3, would have + V3</b>. And don't copy <em>by</em> into both halves: the if-clause takes no <em>would</em>.",
    pairs: [
      {
        ru: 'Если бы я знал (вчера), я бы помог.',
        calque: 'If I knew, I would help.',
        en: 'If I had known, I would have helped.',
      },
      {
        ru: 'Если бы она приняла лекарство, она бы выздоровела.',
        calque: 'If she would take the medicine, she would recover.',
        en: 'If she had taken the medicine, she would have recovered.',
      },
      {
        ru: 'Если бы мы вышли раньше, мы бы успели на поезд.',
        calque: 'If we would have left earlier, we would catch the train.',
        en: 'If we had left earlier, we would have caught the train.',
      },
    ],
    trap: 'conditionals',
  },
  b2_08: {
    ru: 'В русском одна форма «если бы… бы» на все случаи, а время подсказывают слова «тогда», «сейчас». В английском каждая половина выбирает время сама: прошлое условие → <b>had + V3</b>, настоящий результат → <b>would + V</b>, и наоборот. Задайте себе два вопроса: когда условие? когда результат?',
    en: "Russian uses one form, <em>esli by… by</em>, for everything, and words like 'then' or 'now' show the time. In English each half chooses its own tense: a past condition → <b>had + V3</b>, a present result → <b>would + verb</b>, and vice versa. Ask two questions: when is the condition, and when is the result?",
    pairs: [
      {
        ru: 'Если бы я тогда согласился на ту работу, я бы сейчас жил в Нью-Йорке.',
        calque: 'If I agreed to that job then, I would live in New York now.',
        en: 'If I had taken that job, I would be living in New York now.',
      },
      {
        ru: 'Если бы ты не потерял карту, мы бы сейчас не заблудились.',
        calque: "If you didn't lose the map, we wouldn't lose our way now.",
        en: "If you hadn't lost the map, we wouldn't be lost now.",
      },
      {
        ru: 'Если бы он не был таким ленивым, он бы сдал тот экзамен.',
        calque: "If he wasn't so lazy, he would pass that exam.",
        en: "If he weren't so lazy, he would have passed that exam.",
      },
    ],
    trap: 'conditionals',
  },
  b2_09: {
    ru: 'Русский часто обходится без пассива: «Отчёт опубликуют завтра», «Это можно сделать потом», «Ошибку надо исправить» — у таких предложений нет подлежащего-деятеля. Английскому подлежащее необходимо, поэтому предмет становится подлежащим, а глагол — пассивом: <b>will/can/must + be + V3</b>. Не теряйте <em>be</em>: <em>will be published</em>, а не <em>will published</em>.',
    en: "Russian often avoids the passive: '(They) will publish the report tomorrow', 'Can do it later', 'Need to fix the mistake' — sentences with no doer as subject. English needs a subject, so the object becomes the subject and the verb goes passive: <b>will/can/must + be + V3</b>. Don't drop <em>be</em>: <em>will be published</em>, not <em>will published</em>.",
    pairs: [
      {
        ru: 'Отчёт опубликуют завтра.',
        calque: 'The report will publish tomorrow.',
        en: 'The report will be published tomorrow.',
      },
      {
        ru: 'Это можно сделать завтра.',
        calque: 'It can do tomorrow.',
        en: 'It can be done tomorrow.',
      },
      {
        ru: 'Ошибку нужно исправить немедленно.',
        calque: 'The mistake must correct immediately.',
        en: 'The mistake must be corrected immediately.',
      },
    ],
    trap: 'toBe',
  },
  b2_10: {
    ru: 'По-русски «я подстригся», «я починил машину», «мы сделали ремонт» говорят, даже если всё сделал мастер. В английском <em>I cut my hair</em> значит, что вы стриглись сами. Если работу по вашей просьбе выполнил кто-то другой, нужен <b>have/get + предмет + V3</b>: <em>I had my hair cut</em>.',
    en: "In Russian, 'I cut my hair', 'I repaired my car', 'we renovated the flat' are normal even when a professional did the work. In English <em>I cut my hair</em> means you did it yourself. When someone else does it for you, use <b>have/get + object + V3</b>: <em>I had my hair cut</em>.",
    pairs: [
      {
        ru: 'Я подстригся.',
        calque: 'I cut my hair.',
        en: "I've had my hair cut.",
      },
      {
        ru: 'Мне нужно починить машину (в сервисе).',
        calque: 'I need to repair my car.',
        en: 'I need to get my car repaired.',
      },
      {
        ru: 'Где ты шьёшь костюмы?',
        calque: 'Where do you sew your suits?',
        en: 'Where do you have your suits made?',
      },
    ],
    trap: 'verbPatterns',
  },
  b2_11: {
    ru: 'В русском «говорят», «считается», «сообщается» обходятся без подлежащего, и это нормально. Английскому предложению подлежащее нужно всегда, поэтому есть два пути: формальное <b>It is said that…</b> или личная конструкция <b>He is said to + V</b>. Смешивать их нельзя: <em>He is believed to have left</em>, а не <em>He is believed that he left</em>.',
    en: "Russian <em>govoryat</em>, <em>schitaetsya</em>, <em>soobshchaetsya</em> ('they say', 'it is considered', 'it is reported') need no subject. An English sentence always needs one, so there are two options: dummy <b>It is said that…</b> or the personal pattern <b>He is said to + verb</b>. Don't mix them: <em>He is believed to have left</em>, not <em>He is believed that he left</em>.",
    pairs: [
      {
        ru: 'Говорят, что он миллионер.',
        calque: 'Is said that he is a millionaire.',
        en: 'He is said to be a millionaire.',
      },
      {
        ru: 'Считается, что он покинул страну.',
        calque: 'He is believed that he left the country.',
        en: 'He is believed to have left the country.',
      },
      {
        ru: 'Ожидается, что цены вырастут.',
        calque: 'Is expected that prices will grow.',
        en: 'Prices are expected to rise.',
      },
    ],
    trap: 'verbPatterns',
  },
  b2_12: {
    ru: 'В русском два смысла выражаются разными оборотами: «помню, как встретил» (факт прошлого) и «не забудь позвонить» (задача). В английском глагол один, а смысл меняет форма после него: <b>remember/forget + V-ing</b> — о том, что уже было, <b>+ to V</b> — о том, что нужно сделать. Подсказка: <em>to</em> смотрит вперёд, <em>-ing</em> — назад.',
    en: "Russian uses different wording for the two ideas: 'I remember how I met her' (a past fact) vs 'don't forget to call' (a task). English keeps the same verb and changes the form after it: <b>remember/forget + -ing</b> = something that already happened; <b>+ to-infinitive</b> = something still to do. Tip: <em>to</em> looks forward, <em>-ing</em> looks back.",
    pairs: [
      {
        ru: 'Я помню, как встретил её на конференции.',
        calque: 'I remember to meet her at the conference.',
        en: 'I remember meeting her at the conference.',
      },
      {
        ru: 'Я никогда не забуду, как впервые увидел море.',
        calque: 'I will never forget to see the sea for the first time.',
        en: "I'll never forget seeing the sea for the first time.",
      },
      {
        ru: 'Я не помню, чтобы говорил это.',
        calque: "I don't remember to say this.",
        en: "I don't remember saying that.",
      },
    ],
    trap: 'verbPatterns',
  },
  b2_13: {
    ru: 'Русский разводит значения разными глаголами: «бросить курить» — «остановиться, чтобы закурить»; «жалею, что сказал» — «с сожалением сообщаем». Английский берёт один глагол, а смысл решает форма: <b>stop + V-ing</b> — прекратить, <b>stop + to V</b> — остановиться ради чего-то. Русский инфинитив в «бросил курить» подталкивает к <em>stopped to smoke</em> — а это «остановился покурить».',
    en: "Russian uses different verbs: 'give up smoking' vs 'stop in order to smoke'; 'regret having said' vs 'regret to inform'. English uses one verb and the form decides: <b>stop + -ing</b> = quit, <b>stop + to-infinitive</b> = stop in order to do something. The Russian infinitive in <em>brosil kurit'</em> ('quit to-smoke') pushes you towards <em>stopped to smoke</em>, which means he paused for a cigarette.",
    pairs: [
      {
        ru: 'Он бросил курить.',
        calque: 'He stopped to smoke.',
        en: 'He stopped smoking.',
      },
      {
        ru: 'Я не жалею, что переехал.',
        calque: "I don't regret to move.",
        en: "I don't regret moving.",
      },
      {
        ru: 'Это значит, что придётся больше работать.',
        calque: 'This means to work more.',
        en: 'That means working more.',
      },
    ],
    trap: 'verbPatterns',
  },
  b2_14: {
    ru: 'Русское «жаль, что я не знаю» стоит в настоящем и содержит «не». В английском <em>wish</em> описывает желаемое, а не то, что есть, поэтому отрицание исчезает, а время сдвигается в прошлое: <b>I wish I knew</b>. Правило-перевёртыш: «жаль, что не…» → <em>wish</em> без <em>not</em>; «жаль, что…» → <em>wish … not</em>.',
    en: "Russian <em>zhal', chto ya ne znayu</em> ('pity that I don't know') is in the present and contains a 'not'. English <em>wish</em> describes what you'd like, not what is, so the negative flips and the tense moves back: <b>I wish I knew</b>. Flip rule: 'pity I don't…' → <em>wish</em> without <em>not</em>; 'pity I do…' → <em>wish… not</em>.",
    pairs: [
      {
        ru: 'Жаль, что я не знаю ответа.',
        calque: "I wish I don't know the answer.",
        en: 'I wish I knew the answer.',
      },
      {
        ru: 'Жаль, что у меня нет машины.',
        calque: "I wish I don't have a car.",
        en: 'I wish I had a car.',
      },
      {
        ru: 'Жаль, что ты так далеко живёшь.',
        calque: 'I wish you live so far away.',
        en: "I wish you didn't live so far away.",
      },
    ],
    trap: 'conditionals',
  },
  b2_15: {
    ru: "«Жаль, что я это сказал» по-русски — обычное прошедшее, а всё сожаление несут слова «жаль» и «зря». В английском сожаление о прошлом — это <b>wish + had + V3</b>, и полярность снова переворачивается: «жаль, что сказал» → <em>I wish I hadn't said</em>, «жаль, что не поехал» → <em>I wish I had gone</em>.",
    en: "In Russian, 'pity that I said it' uses an ordinary past tense; words like <em>zhal'</em> and <em>zrya</em> ('pity', 'needlessly') carry the regret. In English, regret about the past is <b>wish + had + V3</b>, and the polarity flips again: 'pity I said it' → <em>I wish I hadn't said it</em>; 'pity I didn't go' → <em>I wish I had gone</em>.",
    pairs: [
      {
        ru: 'Жаль, что я это сказал.',
        calque: "I wish I didn't say that.",
        en: "I wish I hadn't said that.",
      },
      {
        ru: 'Жаль, что я не поехал с вами.',
        calque: 'I wish I went with you.',
        en: 'I wish I had gone with you.',
      },
      {
        ru: 'Зря я так много съел.',
        calque: 'In vain I ate so much.',
        en: "I wish I hadn't eaten so much.",
      },
    ],
    trap: 'conditionals',
  },
  b2_16: {
    ru: 'Русский передаёт раздражение частицами и интонацией: «хоть бы ты…», «когда же ты наконец…». В английском для этого есть <b>wish + would</b>: <em>I wish you would listen</em>. Но только о других людях или о ситуации: о себе <em>I wish I would</em> не говорят — нужно <em>I wish I could</em>.',
    en: "Russian shows annoyance with particles and tone: 'if only you'd…', 'when will you finally…'. English has <b>wish + would</b> for this: <em>I wish you would listen</em>. But only about other people or things: you don't say <em>I wish I would</em> about yourself — use <em>I wish I could</em>.",
    pairs: [
      {
        ru: 'Хоть бы ты меня послушал!',
        calque: 'I wish you listen to me!',
        en: 'I wish you would listen to me!',
      },
      {
        ru: 'Хоть бы дождь перестал.',
        calque: 'I wish the rain stops.',
        en: 'I wish it would stop raining.',
      },
      {
        ru: 'Вот бы мне бросить курить.',
        calque: 'I wish I would stop smoking.',
        en: 'I wish I could give up smoking.',
      },
    ],
    trap: 'conditionals',
  },
  b2_17: {
    ru: 'В русском запятая перед «который» ставится всегда — это правило синтаксиса. В английском запятые зависят от смысла: если придаточное нужно, чтобы понять, о ком речь, запятых нет; если оно лишь добавляет сведения, запятые есть, а <em>that</em> в нём недопустимо. Проверка: уберите придаточное — если всё ещё ясно, о ком речь, ставьте запятые.',
    en: "In Russian a comma always goes before <em>kotoryi</em> ('who/which') — it's a syntax rule. In English commas depend on meaning: if the clause tells you which person or thing you mean, no commas; if it only adds extra information, use commas — and never <em>that</em>. Test: remove the clause; if it's still clear who you mean, use commas.",
    pairs: [
      {
        ru: 'Человек, который живёт по соседству, очень добрый.',
        calque: 'The man, who lives next door, is very kind.',
        en: 'The man who lives next door is very kind.',
      },
      {
        ru: 'Мой брат, который живёт в Лондоне, — врач.',
        calque: 'My brother, that lives in London, is a doctor.',
        en: 'My brother, who lives in London, is a doctor.',
      },
      {
        ru: 'Книга, которую ты мне дал, очень интересная.',
        calque: 'The book, that you gave me, is very interesting.',
        en: 'The book you gave me is very interesting.',
      },
    ],
    trap: 'wordOrder',
  },
  b2_18: {
    ru: "В русском предлог всегда стоит перед «который»: «над которым», «с которой». В разговорном английском предлог обычно уходит в конец, а местоимение часто опускается: <em>the project I'm working on</em>. Типичные ошибки — потерять предлог (<em>the girl I talked</em>), добавить в конце лишнее <em>it</em> или перевести русский предлог дословно.",
    en: "In Russian the preposition always comes before <em>kotoryi</em>: 'over which', 'with whom'. In everyday English the preposition usually goes to the end and the pronoun is often dropped: <em>the project I'm working on</em>. Typical mistakes: losing the preposition (<em>the girl I talked</em>), adding an extra <em>it</em> at the end, or translating the Russian preposition word for word.",
    pairs: [
      {
        ru: 'Проект, над которым я работаю, очень интересный.',
        calque: 'The project over which I work is very interesting.',
        en: "The project I'm working on is really interesting.",
      },
      {
        ru: 'Девушка, с которой я разговаривал, — моя соседка.',
        calque: 'The girl with who I talked is my neighbour.',
        en: 'The girl I was talking to is my neighbour.',
      },
      {
        ru: 'Дом, в котором я вырос, снесли.',
        calque: 'The house which I grew up in it was demolished.',
        en: 'The house I grew up in has been demolished.',
      },
    ],
    trap: 'prepositions',
  },
  b2_19: {
    ru: 'Русские «такой» и «так» делят работу по-своему: «такой» — при прилагательном и существительном, «так» — при глаголе и наречии. В английском решает другое — есть ли дальше существительное: <b>so + прилагательное/наречие</b> (<em>so clever</em>), <b>such (a) + прилагательное + существительное</b> (<em>such a cold day</em>). Поэтому «он такой умный» — <em>so clever</em>, а не <em>such clever</em>.',
    en: "Russian splits the job differently: <em>takoi</em> ('such') goes with adjectives and nouns, <em>tak</em> ('so') with verbs and adverbs. In English what matters is whether a noun follows: <b>so + adjective/adverb</b> (<em>so clever</em>), <b>such (a) + adjective + noun</b> (<em>such a cold day</em>). So <em>on takoi umnyi</em> is <em>He's so clever</em>, not <em>such clever</em>.",
    pairs: [
      {
        ru: 'Он такой умный!',
        calque: 'He is such clever!',
        en: "He's so clever!",
      },
      {
        ru: 'Был такой холодный день, что мы остались дома.',
        calque: 'It was so cold day that we stayed at home.',
        en: 'It was such a cold day that we stayed at home.',
      },
      {
        ru: 'У неё такие красивые глаза!',
        calque: 'She has so beautiful eyes!',
        en: 'She has such beautiful eyes!',
      },
    ],
    trap: 'wordOrder',
  },
  b2_20: {
    ru: 'Русское «привык» — один глагол и для состояния, и для процесса, и после него идёт инфинитив: «привык вставать рано». В английском <b>be used to</b> (уже привык) и <b>get used to</b> (привыкаю) заканчиваются предлогом <em>to</em>, поэтому дальше нужен <b>V-ing</b> или существительное. А похожее <em>used to + V</em> значит «раньше делал», а не «привык».',
    en: "Russian <em>privyk</em> ('got used') is one verb for both the state and the process, and it takes an infinitive: 'got used to get up early'. In English <b>be used to</b> (already accustomed) and <b>get used to</b> (becoming accustomed) end in the preposition <em>to</em>, so they need <b>-ing</b> or a noun. The look-alike <em>used to + verb</em> means 'did in the past', not 'am accustomed'.",
    pairs: [
      {
        ru: 'Я привык вставать рано.',
        calque: 'I am used to get up early.',
        en: "I'm used to getting up early.",
      },
      {
        ru: 'Она быстро привыкла жить одна.',
        calque: 'She quickly used to live alone.',
        en: 'She quickly got used to living alone.',
      },
      {
        ru: 'Ничего, привыкнешь.',
        calque: 'Nothing, you will used to it.',
        en: "Don't worry, you'll get used to it.",
      },
    ],
    trap: 'verbPatterns',
  },
  b2_21: {
    ru: 'В русском будущее в придаточном остаётся будущим, даже если главный глагол в прошлом: «сказал, что позвонит», «думал, что будет дождь». В английском время отсчитывается от момента рассказа, поэтому <em>will</em> после прошедшего глагола обычно превращается в <b>would</b>: <em>He said he would call</em>. Так же <em>am going to</em> → <b>was going to</b>.',
    en: "In Russian the future stays future after a past verb: 'he said that he will call', 'I thought it will rain'. In English the tense is seen from the storyteller's time, so <em>will</em> after a past verb usually becomes <b>would</b>: <em>He said he would call</em>. Likewise <em>am going to</em> → <b>was going to</b>.",
    pairs: [
      {
        ru: 'Он сказал, что позвонит, но так и не позвонил.',
        calque: 'He said he will call, but never called.',
        en: 'He said he would call, but he never did.',
      },
      {
        ru: 'Я думал, что будет дождь.',
        calque: 'I thought it will be rain.',
        en: 'I thought it would rain.',
      },
      {
        ru: 'Я знал, что он опоздает.',
        calque: 'I knew that he will be late.',
        en: 'I knew he would be late.',
      },
    ],
    trap: 'sequence',
  },
  b2_22: {
    ru: 'Русское «должен» покрывает и обязанность, и план, и судьбу: «вы должны сдать отчёт», «саммит должен пройти в мае», «поезд должен был прийти в пять». Для официального плана или распоряжения в английском есть <b>be to + V</b>: <em>The summit is to take place in May</em>. Переводить «должен был» через <em>had to</em> опасно: это «пришлось», а не «по плану предполагалось».',
    en: "Russian <em>dolzhen</em> ('must') covers obligation, schedule and destiny: the same word says 'you must submit the report', 'the summit is planned for May' and 'the train was due at five'. For official plans and instructions English has <b>be to + verb</b>: <em>The summit is to take place in May</em>. Translating <em>dolzhen byl</em> as <em>had to</em> is risky: it means 'was forced to', not 'was scheduled to'.",
    pairs: [
      {
        ru: 'Поезд должен был прибыть в пять.',
        calque: 'The train had to arrive at five.',
        en: 'The train was to arrive at five.',
      },
      {
        ru: 'Что же мне делать?',
        calque: 'What I must do?',
        en: 'What am I to do?',
      },
    ],
    trap: 'modals',
  },
  b2_24: {
    ru: "Русское «нужно/надо» — безличное слово: «тебе не нужно», «не нужно было». В английском <em>need</em> — глагол, и ему нужно подлежащее: <em>You don't need to…</em> или <em>You needn't…</em>, а не <em>It is not needed to…</em>. А «зря ты волновался, не нужно было» — это <b>needn't have + V3</b>: действие было, но оказалось лишним.",
    en: "Russian <em>nuzhno / nado</em> ('necessary') is impersonal: 'to-you not necessary', 'was not necessary'. In English <em>need</em> is a verb and wants a subject: <em>You don't need to…</em> or <em>You needn't…</em>, not <em>It is not needed to…</em>. And <b>needn't have + V3</b> (<em>You needn't have worried</em>) means you did it, but it turned out to be unnecessary.",
    pairs: [
      {
        ru: 'Тебе не нужно заполнять обе формы.',
        calque: 'It is not needed to fill in both forms.',
        en: "You needn't fill in both forms.",
      },
      {
        ru: 'Зря ты волновался — не нужно было.',
        calque: 'It was not needed to worry.',
        en: "You needn't have worried.",
      },
    ],
    trap: 'modals',
  },
  b2_26: {
    ru: 'Русские «-ся» и «себя» не равны английскому <em>-self</em>. Многие русские возвратные глаголы в английском обходятся без него: <em>relax, feel, meet, worry, get dressed</em>. Ставьте <em>myself/yourself</em>, только когда действие действительно направлено на себя (<em>He cut himself</em>) или нужно подчеркнуть «сам» (<em>I did it myself</em>). Самая частая калька — <em>I feel myself</em>.',
    en: "Russian <em>-sya</em> verbs and <em>sebya</em> ('oneself') don't match English <em>-self</em>. Many Russian reflexive verbs are plain verbs in English: <em>relax, feel, meet, worry, get dressed</em>. Use <em>myself/yourself</em> only when the action really targets the subject (<em>He cut himself</em>) or to stress 'on my own' (<em>I did it myself</em>). The most common calque is <em>I feel myself</em>.",
    pairs: [
      {
        ru: 'Я чувствую себя лучше.',
        calque: 'I feel myself better.',
        en: 'I feel better.',
      },
      {
        ru: 'Расслабься!',
        calque: 'Relax yourself!',
        en: 'Relax!',
      },
      {
        ru: 'Мы познакомились в Лондоне.',
        calque: 'We acquainted ourselves in London.',
        en: 'We met in London.',
      },
    ],
    trap: 'verbPatterns',
  },
  b2_27: {
    ru: 'В русском число глагола задаёт форма слова: «полиция приехала», «семья переехала» — единственное число. В английском <em>police</em> и <em>cattle</em> всегда требуют множественного числа, а <em>team, family, government, staff</em> в британском варианте часто согласуются как «они», когда имеются в виду люди внутри группы. Подсказка: «полиция приехала» = <em>the police have arrived</em>.',
    en: "In Russian the verb follows the form of the noun: <em>politsiya</em> ('police') and <em>sem'ya</em> ('family') are singular, so the verb is too. In English <em>police</em> and <em>cattle</em> always take a plural verb, and in British English <em>team, family, government, staff</em> often take a plural verb when you think of the people in the group. Tip: <em>the police have arrived</em>.",
    pairs: [
      {
        ru: 'Полиция уже здесь.',
        calque: 'The police is already here.',
        en: 'The police are already here.',
      },
      {
        ru: 'Скот пасётся на лугу.',
        calque: 'The cattle is grazing in the meadow.',
        en: 'The cattle are grazing in the meadow.',
      },
    ],
    trap: 'countable',
  },
  b2_28: {
    ru: 'В русском десятичные дроби пишут через запятую, а числительные подчиняются падежам: «две трети», «два с половиной процента», «полтора часа». В английском — точка (<b>3.14</b> = <em>three point one four</em>), знаменатель во множественном числе, если числитель больше единицы (<em>two thirds</em>), а <em>percent</em> не получает -s. «Полтора часа» — <em>an hour and a half</em>.',
    en: "In Russian decimals use a comma, and numbers follow Russian case endings: 'two third', 'two and a half percent', 'one and half hour'. In English it's a point (<b>3.14</b> = <em>three point one four</em>), the denominator is plural when the top number is above one (<em>two thirds</em>), and <em>percent</em> takes no -s. <em>Poltora chasa</em> is <em>an hour and a half</em>.",
    pairs: [
      {
        ru: 'Две трети студентов сдали экзамен.',
        calque: 'Two third of students passed the exam.',
        en: 'Two thirds of the students passed the exam.',
      },
      {
        ru: 'Инфляция составила 2,5 процента.',
        calque: 'Inflation was 2,5 percents.',
        en: 'Inflation was 2.5 percent.',
      },
      {
        ru: 'Фильм шёл полтора часа.',
        calque: 'The film went one and half hour.',
        en: 'The film lasted an hour and a half.',
      },
    ],
    trap: 'countable',
  },
  b2_29: {
    ru: 'В русском сравнительная степень прилагательного и наречия совпадает: «красивее», «быстрее», «лучше» — и «она красивее», и «поёт красивее». В английском наречие сохраняет свою форму: <em>more beautiful</em> (она), но <em>more beautifully</em> (поёт). Короткие наречия берут <em>-er</em> (<em>faster, harder</em>), а <em>hardly</em> — вообще другое слово: «едва».',
    en: "In Russian the comparative of an adjective and an adverb is the same word: <em>krasivee</em> is both 'more beautiful' and 'more beautifully'. In English the adverb keeps its own form: <em>more beautiful</em> (she is) but <em>more beautifully</em> (she sings). Short adverbs take <em>-er</em> (<em>faster, harder</em>), and <em>hardly</em> is a different word altogether: 'barely'.",
    pairs: [
      {
        ru: 'Она поёт красивее, чем я.',
        calque: 'She sings more beautiful than me.',
        en: 'She sings more beautifully than I do.',
      },
      {
        ru: 'Говорите, пожалуйста, медленнее.',
        calque: 'Speak more slow, please.',
        en: 'Please speak more slowly.',
      },
      {
        ru: 'Он работает усерднее всех.',
        calque: 'He works most hardly of all.',
        en: 'He works hardest of all.',
      },
    ],
    trap: 'wordOrder',
  },

  // ─── C1 ───────────────────────────────────────────────────────────────
  c1_01: {
    ru: 'В русском порядок слов свободный: «Никогда я не видел…» звучит естественно, а подлежащее остаётся на месте. В английском, если предложение начинается с отрицательного наречия (<em>never, rarely, seldom, little</em>), нужен порядок как в вопросе: <b>Never have I seen…</b>. К тому же отрицание одно: <em>never</em> уже отрицает, второе <em>not</em> не нужно.',
    en: "Russian word order is free: 'Never I not saw…' sounds natural in Russian, and the subject stays in place. In English, when a sentence starts with a negative adverb (<em>never, rarely, seldom, little</em>), you need question word order: <b>Never have I seen…</b>. Also, only one negative: <em>never</em> is already negative, so no extra <em>not</em>.",
    pairs: [
      {
        ru: 'Никогда я не видел ничего подобного.',
        calque: "Never I didn't see anything like this.",
        en: 'Never have I seen anything like it.',
      },
      {
        ru: 'Редко она жалуется.',
        calque: 'Rarely she complains.',
        en: 'Rarely does she complain.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_02: {
    ru: '«Не только… но и» по-русски никак не влияет на порядок слов. В английском, если <b>Not only</b> открывает предложение, первая часть получает вопросительный порядок: <em>Not only did he apologise…</em>, а вторая остаётся обычной: <em>but he also…</em>. Если же <em>not only</em> стоит после подлежащего, инверсии нет: <em>He not only apologised but also…</em>',
    en: "Russian <em>ne tol'ko… no i</em> ('not only… but also') never changes word order. In English, when <b>Not only</b> opens the sentence, the first part takes question order: <em>Not only did he apologise…</em>, while the second stays normal: <em>but he also…</em>. If <em>not only</em> comes after the subject, there's no inversion: <em>He not only apologised but also…</em>",
    pairs: [
      {
        ru: 'Мало того что он опоздал, он ещё и нагрубил.',
        calque: 'Not only he was late, but also he was rude.',
        en: 'Not only was he late, but he was also rude.',
      },
      {
        ru: 'Он не только извинился, но и оплатил ущерб.',
        calque: 'Not only he apologised, but also he paid for the damage.',
        en: 'Not only did he apologise, but he also paid for the damage.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_03: {
    ru: 'По-русски «едва…, как» и «не успел…, как» строятся на обычном прошедшем времени и прямом порядке слов. В английском меняются сразу три вещи: первое действие — в <b>Past Perfect</b>, после <em>Hardly/Scarcely/No sooner</em> — инверсия, а вместо русского «как» — <b>when</b> (после hardly/scarcely) или <b>than</b> (после no sooner).',
    en: "Russian <em>edva…, kak</em> and <em>ne uspel…, kak</em> ('hardly…, as') use a plain past tense and normal word order. English changes three things at once: the first action is in the <b>Past Perfect</b>, <em>Hardly/Scarcely/No sooner</em> trigger inversion, and Russian <em>kak</em> ('as') becomes <b>when</b> (after hardly/scarcely) or <b>than</b> (after no sooner).",
    pairs: [
      {
        ru: 'Едва она приехала, как пошёл дождь.',
        calque: 'Hardly she arrived, as it began to rain.',
        en: 'Hardly had she arrived when it began to rain.',
      },
      {
        ru: 'Не успел я сесть, как в дверь постучали.',
        calque: 'No sooner I sat down, as somebody knocked.',
        en: 'No sooner had I sat down than someone knocked at the door.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_04: {
    ru: 'У русского есть похожий приём без «если»: «Знай я об этом…», «Будь я на вашем месте…». Но английский строит его не на смысловом глаголе, а на вспомогательном: <b>Had I known</b>, <b>Were I you</b>, <b>Should you need</b>. Дословные <em>Be I…</em> или <em>Know I…</em> невозможны, а <em>Had + V3</em> всегда означает нереальное прошлое.',
    en: "Russian has a similar if-less pattern: 'Know I about it…', 'Be I in your place…'. English builds it on an auxiliary, not on the main verb: <b>Had I known</b>, <b>Were I you</b>, <b>Should you need</b>. A literal <em>Be I…</em> or <em>Know I…</em> is impossible, and <em>Had + V3</em> always refers to an unreal past.",
    pairs: [
      {
        ru: 'Будь я на вашем месте, я бы согласился.',
        calque: 'Be I on your place, I would agree.',
        en: 'Were I in your position, I would accept.',
      },
      {
        ru: 'Знай я об этом, я бы помог.',
        calque: 'Know I about it, I would help.',
        en: 'Had I known about it, I would have helped.',
      },
      {
        ru: 'Если вам понадобится помощь, звоните.',
        calque: 'If you will need help, call.',
        en: 'Should you need any help, please call.',
      },
    ],
    trap: 'conditionals',
  },
  c1_05: {
    ru: 'Русский выделяет главное словом «именно», интонацией или порядком слов: новое ставится в конец — «Меня разбудил шум». В английском порядок слов жёсткий, а «именно» в начале фразы не переводится как <em>exactly</em>. Для выделения служит рамка <b>It is/was … who/that …</b>: <em>It was the noise that woke me up</em>.',
    en: "Russian highlights the key element with <em>imenno</em> ('precisely'), intonation or word order, putting new information last: 'Me woke up the noise'. English word order is fixed, and a sentence-initial <em>imenno</em> is not <em>exactly</em>. To highlight, English uses the frame <b>It is/was … who/that …</b>: <em>It was the noise that woke me up</em>.",
    pairs: [
      {
        ru: 'Меня разбудил шум.',
        calque: 'Me woke up the noise.',
        en: 'It was the noise that woke me up.',
      },
      {
        ru: 'Именно Джон позвонил.',
        calque: 'Exactly John called.',
        en: 'It was John who called.',
      },
      {
        ru: 'Именно упорный труд ведёт к успеху.',
        calque: 'Exactly hard work leads to success.',
        en: 'It is hard work that leads to success.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_06: {
    ru: 'В русском есть близкая конструкция: «Что меня удивило, так это цена». Но «так это» в английском не переводится: части соединяются простым <b>is/was</b> — <em>What surprised me was the price</em>. Глагол обычно стоит в единственном числе, а лишние <em>it</em> и <em>so</em> не нужны.',
    en: "Russian has a close equivalent: 'What surprised me, so it is the price'. English doesn't translate <em>tak eto</em> ('so it is'): the two parts are joined by plain <b>is/was</b> — <em>What surprised me was the price</em>. The verb is usually singular, and no extra <em>it</em> or <em>so</em> is needed.",
    pairs: [
      {
        ru: 'Что меня удивило, так это цена.',
        calque: 'What surprised me, so it is the price.',
        en: 'What surprised me was the price.',
      },
      {
        ru: 'Больше всего мне нравится в Лондоне его разнообразие.',
        calque: 'Most of all I like in London its diversity.',
        en: 'What I like most about London is its diversity.',
      },
      {
        ru: 'Что нам нужно, так это время.',
        calque: 'What we need, it is time.',
        en: 'What we need is time.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_07: {
    ru: 'После «настаиваю», «требую», «важно» русский ставит «чтобы» + форму прошедшего времени: «настаиваю, чтобы он пришёл». Отсюда кальки <em>that he came</em> и <em>insist him to come</em>. В английском здесь нужна базовая форма — без -s и без сдвига времени: <b>I insist that he come</b> (в британском также <em>should come</em>).',
    en: "After 'insist', 'demand', 'it's important', Russian uses <em>chtoby</em> + a past-tense form: 'I insist that he came'. That's where <em>that he came</em> and <em>insist him to come</em> come from. English needs the bare base form, with no -s and no backshift: <b>I insist that he come</b> (British English also uses <em>should come</em>).",
    pairs: [
      {
        ru: 'Я настаиваю, чтобы он пришёл.',
        calque: 'I insist that he came.',
        en: 'I insist that he come.',
      },
      {
        ru: 'Врач рекомендовал ей отдохнуть.',
        calque: 'The doctor recommended her to rest.',
        en: 'The doctor recommended that she rest.',
      },
      {
        ru: 'Важно, чтобы все присутствовали.',
        calque: 'It is important that everybody was present.',
        en: 'It is important that everyone be present.',
      },
    ],
    trap: 'conditionals',
  },
  c1_08: {
    ru: "По-русски говорят «тебе пора найти работу» — с инфинитивом и без всякого прошедшего. В английском после <b>It's (high) time</b> + подлежащее глагол стоит в <b>Past Simple</b>, хотя речь о настоящем: <em>It's high time you found a job</em>. Прошедшая форма значит «это уже давно должно было случиться». Без подлежащего — <em>It's time to go</em>.",
    en: "Russian says 'to-you it's time to find a job', with an infinitive and nothing past about it. In English, <b>It's (high) time</b> + subject takes the <b>Past Simple</b> although we mean now: <em>It's high time you found a job</em>. The past form signals 'this should have happened already'. Without a subject, use <em>It's time to go</em>.",
    pairs: [
      {
        ru: 'Тебе давно пора найти работу.',
        calque: "It's high time you find a job.",
        en: "It's high time you found a job.",
      },
      {
        ru: 'Детям пора спать.',
        calque: "It's time to children to sleep.",
        en: "It's time the children went to bed.",
      },
    ],
    trap: 'conditionals',
  },
  c1_09: {
    ru: "Русское «как будто» не меняет время: «выглядела так, как будто увидела привидение», «тратит, как будто он миллионер». В английском <b>as if / as though</b> при нереальном сравнении сдвигает время назад, как в условных: настоящее → Past Simple (<em>as if he were</em>), прошлое → <b>Past Perfect</b> (<em>as if she had seen</em>). Если же сравнение может быть правдой, время обычное: <em>It looks as if it's going to rain</em>.",
    en: "Russian <em>kak budto</em> ('as if') keeps the normal tense: 'she looked as if she saw a ghost'. In English, <b>as if / as though</b> in an unreal comparison shifts the tense back, as in conditionals: present → Past Simple (<em>as if he were</em>), past → <b>Past Perfect</b> (<em>as if she had seen</em>). When the comparison may be true, the normal tense stays: <em>It looks as if it's going to rain</em>.",
    pairs: [
      {
        ru: 'Она выглядела так, как будто увидела привидение.',
        calque: 'She looked as if she saw a ghost.',
        en: 'She looked as if she had seen a ghost.',
      },
      {
        ru: 'Он говорил со мной так, как будто мы сто лет знакомы.',
        calque: 'He talked to me as if we are acquainted a hundred years.',
        en: 'He talked to me as if we had known each other for years.',
      },
      {
        ru: 'Он тратит деньги, как будто он миллионер.',
        calque: 'He spends money like he is millionaire.',
        en: 'He spends money as if he were a millionaire.',
      },
    ],
    trap: 'conditionals',
  },
  c1_10: {
    ru: "Русское «я тоже» одинаково отвечает и на утверждение, и на отрицание: «Я люблю джаз. — Я тоже», «Я не был в Риме. — Я тоже». В английском согласие с отрицанием — <b>Neither/Nor + вспомогательный + подлежащее</b>, с утверждением — <b>So + вспомогательный + подлежащее</b>. Вспомогательный повторяет время исходной фразы: <em>haven't → have</em>, <em>love → do</em>.",
    en: "Russian <em>ya tozhe</em> ('me too') answers both positive and negative statements: 'I haven't been to Rome. — Me too.' English splits them: agreeing with a negative is <b>Neither/Nor + auxiliary + subject</b>; with a positive, <b>So + auxiliary + subject</b>. The auxiliary echoes the original tense: <em>haven't → have</em>, <em>love → do</em>.",
    pairs: [
      {
        ru: 'Я не был в Риме. — Я тоже.',
        calque: "I haven't been to Rome. — Me too.",
        en: "I haven't been to Rome. — Neither have I.",
      },
      {
        ru: 'Я люблю джаз. — Она тоже.',
        calque: 'I love jazz. — She too.',
        en: 'I love jazz. — So does she.',
      },
      {
        ru: 'Он не пришёл, и она тоже.',
        calque: "He didn't come, and she too.",
        en: "He didn't come, and neither did she.",
      },
    ],
    trap: 'wordOrder',
  },
  c1_11: {
    ru: "Русский отвечает частицами: «Думаю, да», «Надеюсь, что нет», «Боюсь, что да». В английском <em>yes/no</em> так не работают: «да» заменяет <b>so</b>, а «нет» — <b>not</b> или отрицание у глагола: <em>I think so</em>, <em>I hope not</em>, <em>I'm afraid so</em>, <em>I don't think so</em>. И никакого <em>that</em> перед ними.",
    en: "Russian answers with particles: 'I think, yes', 'I hope that no', 'I'm afraid that yes'. English doesn't use <em>yes/no</em> this way: 'yes' becomes <b>so</b>, and 'no' becomes <b>not</b> or a negative verb: <em>I think so</em>, <em>I hope not</em>, <em>I'm afraid so</em>, <em>I don't think so</em>. And no <em>that</em> before them.",
    pairs: [
      {
        ru: 'Он придёт? — Думаю, да.',
        calque: 'Will he come? — I think yes.',
        en: 'Will he come? — I think so.',
      },
      {
        ru: 'Будет дождь? — Надеюсь, что нет.',
        calque: 'Will it rain? — I hope that no.',
        en: 'Will it rain? — I hope not.',
      },
      {
        ru: 'Это дорого? — Боюсь, что да.',
        calque: "Is it expensive? — I'm afraid that yes.",
        en: "Is it expensive? — I'm afraid so.",
      },
    ],
    trap: 'collocations',
  },
  c1_12: {
    ru: 'Русский не умеет опускать «который» и всегда ставит перед ним запятую, поэтому <em>the film we watched</em> кажется неполным. В английском местоимение-дополнение в определительном придаточном обычно опускают, а запятые не ставят. А русское «, что» о всём предыдущем предложении — это <b>which</b>, а не <em>what</em>: <em>She passed, which surprised everyone</em>.',
    en: "Russian can't drop <em>kotoryi</em> ('which') and always puts a comma before it, so <em>the film we watched</em> feels incomplete. In English an object pronoun in a defining clause is usually dropped, with no commas. And Russian <em>, chto</em> referring to the whole previous sentence is <b>which</b>, not <em>what</em>: <em>She passed, which surprised everyone</em>.",
    pairs: [
      {
        ru: 'Она сдала экзамен, что всех удивило.',
        calque: 'She passed the exam, what surprised everybody.',
        en: 'She passed the exam, which surprised everyone.',
      },
      {
        ru: 'Фильм, который мы смотрели, был скучным.',
        calque: 'The film, which we watched, was boring.',
        en: 'The film we watched was boring.',
      },
      {
        ru: '«Аватар», который вышел в 2009 году, стал хитом.',
        calque: 'Avatar, that came out in 2009, became a hit.',
        en: 'Avatar, which came out in 2009, was a huge hit.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_13: {
    ru: 'Формальная английская модель <em>the person to whom I spoke</em> похожа на русскую: предлог стоит перед местоимением. Ловушка в другом: русский предлог переносят дословно (<em>from which it depends</em> вместо <em>on which</em>), а после предлога ставят <em>who</em> или <em>that</em>. После предлога возможны только <b>whom</b> (люди) и <b>which</b> (вещи).',
    en: 'The formal English pattern <em>the person to whom I spoke</em> looks Russian: the preposition comes before the pronoun. The trap is elsewhere: the Russian preposition gets copied (<em>from which it depends</em> instead of <em>on which</em>), and <em>who</em> or <em>that</em> is put after it. After a preposition use only <b>whom</b> (people) or <b>which</b> (things).',
    pairs: [
      {
        ru: 'Факторы, от которых это зависит',
        calque: 'The factors from which it depends',
        en: 'The factors on which it depends',
      },
      {
        ru: 'Человек, с которым я говорил',
        calque: 'The person with who I spoke',
        en: 'The person with whom I spoke',
      },
      {
        ru: 'Компания, в которой я работаю',
        calque: 'The company in that I work',
        en: 'The company for which I work',
      },
    ],
    trap: 'prepositions',
  },
  c1_14: {
    ru: 'Русский легко присоединяет целое придаточное к предлогу через «то, что»: «говорили о том, что…», «из-за того, что…», «благодаря тому, что…». В английском после предлога, как правило, не может стоять <em>that</em>-придаточное, поэтому <em>about that he…</em> невозможно. Здесь и помогает номинализация: <b>предлог + существительное</b> — <em>about his departure</em>, <em>because of the rise in prices</em>.',
    en: "Russian easily attaches a whole clause to a preposition with <em>to, chto</em> ('that which'): 'we talked about that…', 'because of that…'. In English a preposition normally can't take a <em>that</em>-clause, so <em>about that he…</em> is impossible. That's where nominalisation helps: <b>preposition + noun</b> — <em>about his departure</em>, <em>because of the rise in prices</em>.",
    pairs: [
      {
        ru: 'Мы говорили о том, что он уезжает.',
        calque: 'We talked about that he is leaving.',
        en: 'We talked about his departure.',
      },
      {
        ru: 'Из-за того, что цены выросли, продажи упали.',
        calque: 'Because of that prices grew, sales fell.',
        en: 'Because of the rise in prices, sales fell.',
      },
      {
        ru: 'Я благодарен за то, что вы помогли.',
        calque: 'I am grateful for that you helped.',
        en: "I'm grateful for your help.",
      },
    ],
    trap: 'prepositions',
  },
  c1_15: {
    ru: 'Русский научный стиль тоже любит существительные, но связывает их цепочкой родительных падежей: «рост уровня цен на жильё». Дословно выходит <em>the growth of the level of prices of housing</em>. Английский сжимает такие цепочки: существительное перед существительным (<em>house prices</em>) и устойчивые предлоги — <b>a rise/fall/increase in</b>, <b>an improvement in</b>.',
    en: "Russian academic style loves nouns too, but links them with chains of genitives: 'growth of level of prices on housing'. Word for word that's <em>the growth of the level of prices of housing</em>. English compresses such chains with noun + noun (<em>house prices</em>) and fixed prepositions: <b>a rise/fall/increase in</b>, <b>an improvement in</b>.",
    pairs: [
      {
        ru: 'Рост цен на жильё',
        calque: 'The growth of prices of housing',
        en: 'The rise in house prices',
      },
      {
        ru: 'Снижение уровня безработицы',
        calque: 'The decrease of the level of unemployment',
        en: 'The fall in unemployment',
      },
      {
        ru: 'Значительное улучшение качества воздуха',
        calque: 'A significant improvement of the quality of the air',
        en: 'A significant improvement in air quality',
      },
    ],
    trap: 'prepositions',
  },
  c1_16: {
    ru: 'Правило то же, что в русском: у деепричастного оборота и главного предложения должен быть один субъект. Помните чеховское «Подъезжая к станции, у меня слетела шляпа»? По-английски такая ошибка так же смешна. Особенно коварны безличные «мне стало холодно», «мне пришлось»: английскому нужно личное подлежащее — <em>Walking home, I felt cold</em>.',
    en: "The rule is the same as in Russian: the participle clause and the main clause must share a subject. Remember Chekhov's 'Approaching the station, my hat flew off'? In English that mistake is just as funny. Watch out for Russian impersonal phrases like 'to me became cold' or 'to me it was necessary': English needs a personal subject — <em>Walking home, I felt cold</em>.",
    pairs: [
      {
        ru: 'Подъезжая к станции, у меня слетела шляпа.',
        calque: 'Approaching the station, my hat flew off.',
        en: 'As I was approaching the station, my hat flew off.',
      },
      {
        ru: 'Гуляя по парку, мне стало холодно.',
        calque: 'Walking in the park, it became cold to me.',
        en: 'Walking in the park, I started to feel cold.',
      },
      {
        ru: 'Будучи больным, мне пришлось остаться дома.',
        calque: 'Being ill, it was necessary for me to stay at home.',
        en: 'Being ill, I had to stay at home.',
      },
    ],
    trap: 'wordOrder',
  },
  c1_17: {
    ru: 'Русское деепричастие совершенного вида — одно слово: «прочитав», «закончив». Английский аналог состоит из двух: <b>Having + V3</b>. Голое V3 (<em>Finished the exam, …</em>) воспринимается как страдательное причастие («законченный») и не может иметь дополнения. Подсказка: русское <em>-в/-вши</em> → <em>having</em> + третья форма.',
    en: "The Russian perfective gerund is one word: <em>prochitav</em> ('having read'), <em>zakonchiv</em> ('having finished'). Its English equivalent takes two: <b>Having + V3</b>. A bare V3 (<em>Finished the exam, …</em>) reads as a passive participle ('completed') and can't take an object. Tip: Russian <em>-v/-vshi</em> → <em>having</em> + past participle.",
    pairs: [
      {
        ru: 'Закончив экзамен, студенты ушли.',
        calque: 'Finished the exam, the students left.',
        en: 'Having finished the exam, the students left.',
      },
      {
        ru: 'Прочитав отчёт, он созвал совещание.',
        calque: 'Read the report, he called a meeting.',
        en: 'Having read the report, he called a meeting.',
      },
      {
        ru: 'Потеряв ключи, она не могла попасть домой.',
        calque: "Lost the keys, she couldn't get home.",
        en: "Having lost her keys, she couldn't get into the house.",
      },
    ],
    trap: 'verbPatterns',
  },

  // ─── C2 ───────────────────────────────────────────────────────────────
  c2_01: {
    ru: 'Русское «если не» — два слова, и отрицание остаётся при глаголе. Английское <b>unless</b> уже содержит «не», поэтому второе отрицание переворачивает смысл: <em>Unless you hurry</em> = «если не поторопишься». И, как после <em>if</em>, после <em>unless, provided, as long as</em> будущее передаётся настоящим временем, хотя по-русски стоит будущее.',
    en: "Russian <em>esli ne</em> ('if not') is two words, and the negative stays with the verb. English <b>unless</b> already contains the 'not', so adding another negative reverses the meaning: <em>Unless you hurry</em> = 'if you don't hurry'. And, as after <em>if</em>, after <em>unless, provided, as long as</em> the future is expressed with the present, though Russian uses the future.",
    pairs: [
      {
        ru: 'Если ты не поторопишься, мы опоздаем.',
        calque: "Unless you don't hurry, we will be late.",
        en: "Unless you hurry, we'll be late.",
      },
      {
        ru: 'Я одолжу тебе денег при условии, что ты их вернёшь.',
        calque: 'I will lend you money provided you will return them.',
        en: "I'll lend you the money provided you pay it back.",
      },
      {
        ru: 'Можешь взять машину, если вернёшь её к шести.',
        calque: 'You can take the car as long as you will return it by six.',
        en: 'You can take the car as long as you bring it back by six.',
      },
    ],
    trap: 'conditionals',
  },
  c2_02: {
    ru: 'Русские «А вдруг…?» и «Представь, что…» обычно идут с будущим временем или с «бы». В английском <b>What if</b> с реальной возможностью берёт настоящее время (<em>What if nobody comes?</em>), а <b>Suppose/Supposing</b> с воображаемой ситуацией — прошедшее (<em>Suppose you won…</em>). «Вдруг» здесь не <em>suddenly</em>: оно значит «а если».',
    en: "Russian <em>A vdrug…?</em> ('and suddenly…?') and 'Imagine that…' usually take the future or <em>by</em> ('would'). In English, <b>What if</b> with a real possibility takes the present (<em>What if nobody comes?</em>), and <b>Suppose/Supposing</b> with an imaginary situation takes the past (<em>Suppose you won…</em>). <em>Vdrug</em> here doesn't mean <em>suddenly</em>; it means 'what if'.",
    pairs: [
      {
        ru: 'А вдруг никто не придёт?',
        calque: 'And suddenly nobody will come?',
        en: 'What if nobody comes?',
      },
      {
        ru: 'Представь, что ты выиграл бы миллион.',
        calque: 'Imagine that you would win a million.',
        en: 'Suppose you won a million.',
      },
      {
        ru: 'А что, если он опоздает?',
        calque: 'What if he will be late?',
        en: "What if he's late?",
      },
    ],
    trap: 'conditionals',
  },
  c2_03: {
    ru: 'Русское «только» свободно перемещается по фразе и порядок слов не трогает: «Только тогда я понял». В английском, если оборот с <b>Only</b> (<em>only then, only when…, only after…</em>) открывает предложение, инверсия нужна в <b>главной</b> части: <em>Only when I left did I realise…</em>. Само придаточное с <em>when</em> сохраняет прямой порядок.',
    en: "Russian <em>tol'ko</em> ('only') moves freely and doesn't touch word order: 'Only then I understood'. In English, if a phrase with <b>Only</b> (<em>only then, only when…, only after…</em>) opens the sentence, the inversion goes into the <b>main</b> clause: <em>Only when I left did I realise…</em>. The when-clause itself keeps normal order.",
    pairs: [
      {
        ru: 'Только тогда я понял свою ошибку.',
        calque: 'Only then I understood my mistake.',
        en: 'Only then did I realise my mistake.',
      },
      {
        ru: 'Только когда я уехал, я понял, как там было хорошо.',
        calque: 'Only when I left, I understood how good it was there.',
        en: 'Only when I left did I realise how good it had been.',
      },
      {
        ru: 'Лишь после многих лет практики она овладела этим навыком.',
        calque: 'Only after many years of practice she mastered this skill.',
        en: 'Only after years of practice did she master the skill.',
      },
    ],
    trap: 'wordOrder',
  },
  c2_04: {
    ru: 'Здесь русский неожиданно близок к английскому: «Так велико было его облегчение, что…» — почти дословно <em>So great was his relief that…</em>. Ошибки начинаются, когда вместо <em>be</em> стоит смысловой глагол: русский оставляет его как есть, а английскому нужен вспомогательный — <b>So fast did he run that…</b>. И помните: перед прилагательным — <em>so</em>, а не <em>such</em>.',
    en: "Here Russian is surprisingly close: 'So great was his relief that…' is almost word for word the same. Trouble starts with a main verb instead of <em>be</em>: Russian keeps the verb as it is, but English needs an auxiliary — <b>So fast did he run that…</b>. And remember: before an adjective use <em>so</em>, not <em>such</em>.",
    pairs: [
      {
        ru: 'Так быстро он бежал, что никто не мог его догнать.',
        calque: 'So fast he ran that nobody could catch him.',
        en: 'So fast did he run that nobody could catch him.',
      },
      {
        ru: 'Таким сильным был шторм, что все рейсы отменили.',
        calque: 'Such strong was the storm that all flights cancelled.',
        en: 'So strong was the storm that all flights were cancelled.',
      },
    ],
    trap: 'wordOrder',
  },
  c2_05: {
    ru: 'Русский научный текст смягчает утверждения вводными словами: «по-видимому», «вероятно», «как правило», а глагол оставляет прежним. Английский чаще встраивает осторожность в сам глагол: <b>appear to</b>, <b>seem to</b>, <b>tend to</b>, <b>be likely to</b>. Типичные ловушки — <em>probable to</em> вместо <em>likely to</em> и пассив <em>is seemed</em> по образцу русского «кажется».',
    en: "Russian academic writing softens claims with parenthetical words — 'apparently', 'probably', 'as a rule' — and leaves the verb unchanged. English more often builds the caution into the verb: <b>appear to</b>, <b>seem to</b>, <b>tend to</b>, <b>be likely to</b>. Typical traps: <em>probable to</em> instead of <em>likely to</em>, and the passive <em>is seemed</em> modelled on Russian <em>kazhetsya</em> ('it seems').",
    pairs: [
      {
        ru: 'Цены, вероятно, вырастут.',
        calque: 'Prices are probable to grow.',
        en: 'Prices are likely to rise.',
      },
      {
        ru: 'Кажется, эта гипотеза верна.',
        calque: 'It is seemed that this hypothesis is right.',
        en: 'This hypothesis appears to be correct.',
      },
    ],
    trap: 'verbPatterns',
  },
  c2_06: {
    ru: 'Многие русские связки переводят дословно, и выходит неанглийская фраза: «с одной стороны» — не <em>from one side</em>, «кроме того» — не <em>except this</em>, «таким образом» — не <em>by such a way</em>. У английского свои устойчивые маркеры: <b>On the one hand / On the other hand</b>, <b>Furthermore / In addition</b>, <b>Thus / Therefore</b>. Учите их целиком, как готовые блоки.',
    en: 'Many Russian linking phrases get translated word for word and come out un-English: <em>s odnoi storony</em> is not <em>from one side</em>, <em>krome togo</em> is not <em>except this</em>, <em>takim obrazom</em> is not <em>by such a way</em>. English has its own fixed markers: <b>On the one hand / On the other hand</b>, <b>Furthermore / In addition</b>, <b>Thus / Therefore</b>. Learn them whole, as ready-made blocks.',
    pairs: [
      {
        ru: 'С одной стороны, это дёшево.',
        calque: 'From one side, it is cheap.',
        en: 'On the one hand, it is cheap.',
      },
      {
        ru: 'Кроме того, данные указывают на связь.',
        calque: 'Except this, the data show a connection.',
        en: 'Furthermore, the data indicate a connection.',
      },
      {
        ru: 'Таким образом, гипотеза подтвердилась.',
        calque: 'By such a way, the hypothesis was confirmed.',
        en: 'Thus, the hypothesis was confirmed.',
      },
    ],
    trap: 'collocations',
  },
  c2_07: {
    ru: 'Русские формулы вежливости при дословном переводе меняют регистр: «Уважаемый…» — не <em>Respected…</em>, «С уважением» — не <em>With respect</em> (так начинают возражение). Просьба «Прошу вас прислать…» по-русски нейтрально-официальна, а <em>I ask you to send…</em> звучит как требование. Формальный английский вежлив через косвенность: <em>I would be grateful if you could…</em>',
    en: "Russian politeness formulas change register when translated literally: <em>Uvazhaemyi…</em> is not <em>Respected…</em>, and <em>S uvazheniem</em> is not <em>With respect</em> (which introduces a disagreement). 'I ask you to send…' is neutral and official in Russian but sounds like a demand in English. Formal English is polite through indirectness: <em>I would be grateful if you could…</em>",
    pairs: [
      {
        ru: 'Уважаемый господин Смит!',
        calque: 'Respected Mister Smith!',
        en: 'Dear Mr Smith,',
      },
      {
        ru: 'С уважением, Иван',
        calque: 'With respect, Ivan',
        en: 'Kind regards, Ivan',
      },
      {
        ru: 'Прошу вас прислать документы.',
        calque: 'I ask you to send the documents.',
        en: 'I would be grateful if you could send the documents.',
      },
    ],
    trap: 'politeness',
  },
  c2_08: {
    ru: 'Слова, которые кажутся эквивалентами, часто расходятся по оценке. «Простой человек» — похвала, а <em>a simple man</em> может прозвучать как «простоватый, недалёкий»; «настойчивый» — плюс, а <em>insistent</em> — скорее «напористый, требовательный». «Худенькая» звучит ласково, а <em>skinny</em> часто неодобрительно. Проверяйте не только значение, но и окраску слова.',
    en: "Words that look equivalent often differ in tone. <em>Prostoi chelovek</em> ('a simple person') is praise in Russian, but <em>a simple man</em> can sound like 'not very bright'. <em>Nastoichivyi</em> ('persistent') is positive, while <em>insistent</em> suggests pushiness. <em>Khuden'kaya</em> ('slim') is affectionate, while <em>skinny</em> is often critical. Check connotation, not just meaning.",
    pairs: [
      {
        ru: 'Он очень простой человек (похвала).',
        calque: 'He is a very simple man.',
        en: "He's very down-to-earth.",
      },
      {
        ru: 'Она очень настойчивая и всегда добивается своего.',
        calque: 'She is very insistent and always achieves her goals.',
        en: 'She is very persistent and always achieves her goals.',
      },
      {
        ru: 'Какая ты стала худенькая! (комплимент)',
        calque: 'How skinny you have become!',
        en: "You're looking so slim!",
      },
    ],
    trap: 'falseFriends',
  },
  c2_10: {
    ru: '«Сделать вывод», «принять меры», «провести исследование» хочется перевести по первому словарному значению глагола. Но в английском у каждого существительного свой глагол: <em>draw a conclusion</em>, <em>take measures</em>, <em>conduct research</em>, <em>pay attention</em>. Дословно выходит <em>make a conclusion</em>, <em>accept measures</em>, <em>make a research</em> (к тому же <em>research</em> неисчисляемое). Учите существительное сразу с его глаголом.',
    en: "Russian 'make a conclusion', 'accept measures', 'carry out a research' tempt you to use the first dictionary meaning of the verb. But English nouns choose their own verbs: <em>draw a conclusion</em>, <em>take measures</em>, <em>conduct research</em>, <em>pay attention</em>. Note also that <em>research</em> is uncountable. Learn each noun together with its verb.",
    pairs: [
      {
        ru: 'Мы провели исследование.',
        calque: 'We made a research.',
        en: 'We conducted research.',
      },
      {
        ru: 'Из этого можно сделать вывод, что…',
        calque: 'From this we can make a conclusion that…',
        en: 'From this we can draw the conclusion that…',
      },
      {
        ru: 'Правительство приняло меры.',
        calque: 'The government accepted measures.',
        en: 'The government took measures.',
      },
    ],
    trap: 'collocations',
  },
  c2_11: {
    ru: 'В русском обособленный оборот обязан относиться к подлежащему, поэтому <em>Weather permitting</em> или <em>The work done, she went home</em> с собственным «подлежащим» кажутся ошибкой. По-русски скажут придаточным: «если позволит погода», «когда работа была закончена». В английском абсолютный оборот — <b>существительное + причастие</b> без союза — обычный приём письменной речи.',
    en: "In Russian a participle phrase must belong to the subject, so <em>Weather permitting</em> or <em>The work done, she went home</em>, with a 'subject' of their own, feel wrong. Russian would use a clause: 'if the weather allows', 'when the work was finished'. In English the absolute phrase — <b>noun + participle</b>, no conjunction — is a normal device in formal writing.",
    pairs: [
      {
        ru: 'Если позволит погода, пикник будет в субботу.',
        calque: 'If the weather will allow, the picnic will be on Saturday.',
        en: 'Weather permitting, the picnic will be on Saturday.',
      },
      {
        ru: 'Так как срок истёк, проект закрыли.',
        calque: 'As the deadline passed, closed the project.',
        en: 'The deadline having passed, the project was closed.',
      },
    ],
    trap: 'verbPatterns',
  },
  c2_12: {
    ru: 'Русский сокращает фразу, оставляя смысловой глагол или прилагательное: «Умеешь водить? — Умею», «Дайте большую». В английском при сокращении остаются <b>подлежащее + вспомогательный глагол</b> (<em>Yes, I can</em>; <em>Yes, I have</em>), а прилагательное без существительного обычно требует замены <b>one</b>: <em>a big one</em>.',
    en: "Russian shortens a reply by keeping the main verb or adjective: 'Can you drive? — Can', 'Give me big'. In English an elliptical reply keeps <b>subject + auxiliary</b> (<em>Yes, I can</em>; <em>Yes, I have</em>), and an adjective without its noun usually needs the substitute <b>one</b>: <em>a big one</em>.",
    pairs: [
      {
        ru: 'Ты умеешь водить? — Умею.',
        calque: 'Can you drive? — Can.',
        en: 'Can you drive? — Yes, I can.',
      },
      {
        ru: 'Ты был в Париже? — Был.',
        calque: 'Have you been to Paris? — Was.',
        en: 'Have you been to Paris? — Yes, I have.',
      },
      {
        ru: 'Эта коробка маленькая, дайте большую.',
        calque: 'This box is small, give me big.',
        en: 'This box is too small — give me a big one.',
      },
    ],
    trap: 'wordOrder',
  },
  c2_13: {
    ru: 'После «хочу», «нужно», «видел» русский строит придаточное: «хочу, чтобы ты остался», «видел, как она ушла». В английском здесь не придаточное, а <b>объект + инфинитив</b>: <em>I want you to stay</em>, <em>I saw her leave</em>. <em>I want that you…</em> — грамматическая ошибка, а <em>I saw how she left</em> значит «видел, каким образом она ушла».',
    en: "After 'want', 'need', 'saw', Russian uses a clause: 'I want that you stay', 'I saw how she left'. English uses <b>object + infinitive</b> instead: <em>I want you to stay</em>, <em>I saw her leave</em>. <em>I want that you…</em> is ungrammatical, and <em>I saw how she left</em> means you watched the way she left.",
    pairs: [
      {
        ru: 'Я хочу, чтобы ты остался.',
        calque: 'I want that you stay.',
        en: 'I want you to stay.',
      },
      {
        ru: 'Я видел, как она вышла из дома.',
        calque: 'I saw how she left the house.',
        en: 'I saw her leave the house.',
      },
      {
        ru: 'Мне нужно, чтобы ты подписал документ.',
        calque: 'I need that you sign the document.',
        en: 'I need you to sign the document.',
      },
    ],
    trap: 'verbPatterns',
  },
  c2_14: {
    ru: 'Русский передаёт «уже столько-то времени к моменту в будущем» простым будущим и словом «уже»: «к лету я буду работать здесь уже год». В английском нужна перфектная длительная форма — как <em>I have been working</em> для настоящего, только сдвинутая в будущее: <b>will have been + V-ing</b>. Сигнал — <em>by…</em> и <em>for…</em> в одном предложении.',
    en: "Russian expresses 'already X long by a future point' with a simple future plus <em>uzhe</em> ('already'): 'by summer I will work here already a year'. English needs the perfect continuous — like <em>I have been working</em> for the present, but shifted into the future: <b>will have been + V-ing</b>. Signal: <em>by…</em> and <em>for…</em> in the same sentence.",
    pairs: [
      {
        ru: 'К следующему году я буду изучать английский уже пять лет.',
        calque: 'By next year I will learn English already five years.',
        en: 'By next year I will have been learning English for five years.',
      },
      {
        ru: 'Когда мы приедем, она будет ждать уже два часа.',
        calque: 'When we come, she will wait already two hours.',
        en: 'By the time we arrive, she will have been waiting for two hours.',
      },
    ],
    trap: 'tenses',
  },
  c2_15: {
    ru: 'В русском время в придаточном выбирается относительно главного события: «он сказал, что живёт в Москве» — «живёт» на момент его слов. В английском точка отсчёта — момент рассказа, поэтому после прошедшего глагола время по умолчанию сдвигается назад: <em>is → was</em>, <em>has done → had done</em>, <em>can → could</em>. Без сдвига можно оставить лишь то, что верно и сейчас, например общие истины.',
    en: "In Russian the tense of a reported clause is chosen relative to the main event: 'he said that he lives in Moscow' — 'lives' at the time he spoke. In English the reference point is the time of telling, so after a past verb the tense shifts back by default: <em>is → was</em>, <em>has done → had done</em>, <em>can → could</em>. Only things still true now, like general truths, may stay unchanged.",
    pairs: [
      {
        ru: 'Я думал, что ты спишь.',
        calque: 'I thought that you are sleeping.',
        en: 'I thought you were asleep.',
      },
      {
        ru: 'Он сказал, что уже видел этот фильм.',
        calque: 'He said that he has already seen this film.',
        en: 'He said he had already seen the film.',
      },
      {
        ru: 'Я не знал, что она умеет водить.',
        calque: "I didn't know that she can drive.",
        en: "I didn't know she could drive.",
      },
    ],
    trap: 'sequence',
  },
  c2_16: {
    ru: "В русском отрицаний может быть сколько угодно: «Я не знаю ни английского, ни немецкого». В английском отрицание одно: при <em>neither…nor</em> глагол стоит в утвердительной форме, а <b>nor</b> в начале части требует инверсии: <em>He didn't call, nor did he write</em>. Ещё одна ловушка — русское «а»: прямого аналога нет, это то <em>and</em>, то <em>but</em>, то <em>while</em>.",
    en: "Russian allows multiple negatives: 'I don't know neither English nor German'. English allows one: with <em>neither…nor</em> the verb is positive, and <b>nor</b> starting a clause triggers inversion: <em>He didn't call, nor did he write</em>. Another trap is Russian <em>a</em>: it has no single equivalent and may be <em>and</em>, <em>but</em> or <em>while</em>.",
    pairs: [
      {
        ru: 'Я не знаю ни английского, ни немецкого.',
        calque: "I don't know neither English nor German.",
        en: 'I know neither English nor German.',
      },
      {
        ru: 'Он не звонил и не писал.',
        calque: "He didn't call nor he wrote.",
        en: "He didn't call, nor did he write.",
      },
    ],
    trap: 'wordOrder',
  },
  c2_17: {
    ru: 'Русский допускает парные союзы: «хотя…, но», «так как…, то». Английский ставит союз один раз: <em>Although he was tired, he kept working</em> — без <em>but</em>. А «несмотря на то, что» — это <b>although</b> или <b>despite the fact that</b>, но не <em>despite that</em> + предложение; просто <em>despite</em> требует существительного: <em>despite the rain</em>.',
    en: "Russian allows paired conjunctions: 'although…, but', 'as…, so'. English uses one conjunction only: <em>Although he was tired, he kept working</em> — no <em>but</em>. Russian <em>nesmotrya na to, chto</em> ('despite that…') is <b>although</b> or <b>despite the fact that</b>, never <em>despite that</em> + clause; plain <em>despite</em> needs a noun: <em>despite the rain</em>.",
    pairs: [
      {
        ru: 'Хотя он устал, но продолжал работать.',
        calque: 'Although he was tired, but he kept working.',
        en: 'Although he was tired, he kept working.',
      },
      {
        ru: 'Несмотря на то что шёл дождь, мы пошли гулять.',
        calque: 'Despite that it was raining, we went for a walk.',
        en: 'Although it was raining, we went for a walk.',
      },
      {
        ru: 'Так как было поздно, то мы ушли.',
        calque: 'As it was late, so we left.',
        en: 'As it was late, we left.',
      },
    ],
    trap: 'wordOrder',
  },
  c2_18: {
    ru: 'Русская запятая отмечает границу любого придаточного: перед «что», «где», «который», «чтобы» она обязательна. Английская запятая следует смыслу, а не синтаксису: перед <em>that</em>, перед косвенным вопросом и перед определительным придаточным её не ставят. Совет: если по-русски запятая стоит перед «что», то в английском перед <em>that</em> её почти наверняка нет.',
    en: "A Russian comma marks the boundary of every subordinate clause: before <em>chto</em> ('that'), <em>gde</em> ('where'), <em>kotoryi</em> ('which'), <em>chtoby</em> ('so that') it is compulsory. The English comma follows meaning, not syntax: no comma before <em>that</em>, before an indirect question or before a defining relative clause. Tip: where Russian has a comma before <em>chto</em>, English almost certainly has none before <em>that</em>.",
    pairs: [
      {
        ru: 'Он сказал, что опоздает.',
        calque: 'He said, that he would be late.',
        en: 'He said that he would be late.',
      },
      {
        ru: 'Я не знаю, где он живёт.',
        calque: "I don't know, where he lives.",
        en: "I don't know where he lives.",
      },
      {
        ru: 'Я думаю, что ты прав.',
        calque: 'I think, that you are right.',
        en: "I think you're right.",
      },
    ],
    trap: 'wordOrder',
  },
  c2_19: {
    ru: "Русское тире часто заменяет пропущенное «есть»: «Москва — столица России». В английском глагол-связку опускать нельзя, и тире её не заменяет: <em>Moscow is the capital of Russia</em>. В прямой речи «ёлочки» и тире после цитаты не переносятся: <em>'I'll come,' he said</em> (в американском — двойные кавычки). А апострофа в русском нет — следите за <em>it's / its</em>.",
    en: "The Russian dash often replaces a missing 'is': 'Moscow — capital of Russia'. English can't drop the linking verb, and a dash doesn't replace it: <em>Moscow is the capital of Russia</em>. In direct speech, Russian «guillemets» and the dash after the quote don't carry over: <em>'I'll come,' he said</em> (American English uses double quotes). Russian has no apostrophe, so watch <em>it's / its</em>.",
    pairs: [
      {
        ru: 'Москва — столица России.',
        calque: 'Moscow — capital of Russia.',
        en: 'Moscow is the capital of Russia.',
      },
      {
        ru: '«Я приду», — сказал он.',
        calque: '«I will come», — he said.',
        en: "'I'll come,' he said.",
      },
    ],
    trap: 'toBe',
  },
  c2_20: {
    ru: 'В русском косвенный вопрос сохраняет порядок слов прямого: «Интересно, что показывают данные», а «ли» просто ставится после глагола. В английском косвенный вопрос строится как утверждение — без <em>do/does</em> и без инверсии (<em>I wonder what the data show</em>), а русское «ли» передаётся словом <b>whether/if</b> в начале.',
    en: "In Russian an indirect question keeps the word order of the direct one: 'I wonder what show the data', and <em>li</em> ('whether') simply follows the verb. In English an indirect question has statement order — no <em>do/does</em>, no inversion (<em>I wonder what the data show</em>), and Russian <em>li</em> becomes <b>whether/if</b> at the start.",
    pairs: [
      {
        ru: 'Я не знаю, придёт ли он.',
        calque: "I don't know will he come.",
        en: "I don't know whether he will come.",
      },
      {
        ru: 'Интересно, что показывают эти данные.',
        calque: 'I wonder what do these data show.',
        en: 'I wonder what these data show.',
      },
      {
        ru: 'Неясно, почему это происходит.',
        calque: 'It is unclear why does this happen.',
        en: 'It is unclear why this happens.',
      },
    ],
    trap: 'wordOrder',
  },
};
