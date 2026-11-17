import type { RuContrast } from '../types';

/** «Почему по-русски иначе» notes for A1–B1 rules (rules without a meaningful contrast are omitted). */
export const CONTRAST_A1B1: Record<string, RuContrast> = {
  a1_01: {
    ru: 'В русском настоящем времени связка «есть» почти всегда пропадает: «Я студент», «Она дома». В английском у предложения обязательно есть глагол, и когда говорим, кто, какой или где, это <b>am/is/are</b>. Даже «мне холодно» строится через подлежащее и be: <em>I am cold</em>. Проверка: если в русской фразе нет глагола, в английской почти наверняка нужен be.',
    en: 'Russian drops the present-tense link verb: literally "I student", "she at home". An English sentence must have a verb, and when you say who, what or where someone is, that verb is <b>am/is/are</b>. Even the impersonal Russian "to me cold" becomes subject + be: <em>I am cold</em>. Quick check: if the Russian sentence has no verb, the English one almost certainly needs be.',
    pairs: [
      { ru: 'Я студент.', calque: 'I student.', en: 'I am a student.' },
      { ru: 'Она дома.', calque: 'She at home.', en: 'She is at home.' },
      { ru: 'Мне холодно.', calque: 'To me is cold.', en: 'I am cold.' },
    ],
    trap: 'toBe',
  },
  a1_02: {
    ru: "По-русски отрицание — это просто «не» перед словом: «Я не голоден», «Он не врач». В английском <em>not</em> не может стоять без глагола: оно цепляется за <b>am/is/are</b>. Поэтому сначала верните пропущенный be, а потом добавьте not: <em>I'm not, he isn't, they aren't</em>. И не хватайтесь за do: <em>don't/doesn't</em> — для обычных глаголов, а не для be.",
    en: "In Russian you negate by putting \"not\" before any word: literally \"I not hungry\", \"he not a doctor\". In English <em>not</em> can't stand without a verb — it attaches to <b>am/is/are</b>. So first restore the missing be, then add not: <em>I'm not, he isn't, they aren't</em>. Don't reach for do: <em>don't/doesn't</em> go with ordinary verbs, not with be.",
    pairs: [
      { ru: 'Я не голоден.', calque: 'I not hungry.', en: "I'm not hungry." },
      {
        ru: 'Он не врач.',
        calque: 'He not a doctor.',
        en: "He isn't a doctor.",
      },
      {
        ru: 'Они не дома.',
        calque: "They don't at home.",
        en: "They aren't at home.",
      },
    ],
    trap: 'toBe',
  },
  a1_03: {
    ru: "Русский вопрос часто отличается от утверждения только интонацией: «Он дома?» Английский нейтральный вопрос строится порядком слов: <b>am/is/are ставим перед подлежащим</b> — <em>Is he at home?</em> С вопросительными словами то же: <em>Where is he?</em> «You're ready?» с повышением голоса звучит как удивлённое переспрашивание, а «Where he is?» — просто ошибка.",
    en: 'A Russian question often differs from a statement only by intonation: literally "He at home?". A neutral English question is built with word order: <b>put am/is/are before the subject</b> — <em>Is he at home?</em> Same with question words: <em>Where is he?</em> "You\'re ready?" with rising intonation sounds like surprised checking, and "Where he is?" is simply wrong.',
    pairs: [
      { ru: 'Он дома?', calque: 'He at home?', en: 'Is he at home?' },
      { ru: 'Где он?', calque: 'Where he is?', en: 'Where is he?' },
      {
        ru: 'Почему ты грустный?',
        calque: 'Why you are sad?',
        en: 'Why are you sad?',
      },
    ],
    trap: 'wordOrder',
  },
  a1_04: {
    ru: "По-русски отвечают коротким «Да» или повторяют главное слово: «Ты готов? — Да, готов». В английском короткий ответ повторяет <b>вспомогательный глагол</b>: <em>Yes, I am. / No, I'm not.</em> — без прилагательного и без сокращения в утвердительном ответе. И главное: на отрицательный вопрос yes/no отвечает на факт, а не выражает согласие: «Ты не голоден? — Да, не голоден» = <em>No, I'm not.</em>",
    en: 'In Russian you answer with a bare "yes" or repeat the key word: literally "Ready? — Yes, ready". English short answers repeat the <b>auxiliary</b>: <em>Yes, I am. / No, I\'m not.</em> — no adjective, and no contraction in a yes answer. Crucially, after a negative question yes/no reflects the fact, not agreement: "Aren\'t you hungry? — Yes (I agree), not hungry" is <em>No, I\'m not.</em>',
    pairs: [
      {
        ru: 'Ты готов? — Да, готов.',
        calque: 'Are you ready? — Yes, I ready.',
        en: 'Are you ready? — Yes, I am.',
      },
      {
        ru: 'Ты не голоден? — Да, не голоден.',
        calque: "Aren't you hungry? — Yes, I'm not.",
        en: "Aren't you hungry? — No, I'm not.",
      },
    ],
    trap: 'toBe',
  },
  a1_05: {
    ru: 'В русском нет артиклей, поэтому <em>a/an</em> кажется лишним словом. Но в английском исчисляемое существительное в единственном числе не может стоять «голым» — ему нужен артикль или другое определяющее слово (my, this). <b>a</b> = «один, какой-то, один из»: предмет упоминается впервые или мы называем профессию. Подсказка: если по-русски можно мысленно вставить «один/какой-то», скорее всего нужен a.',
    en: 'Russian has no articles, so <em>a/an</em> feels like an extra word. But in English a singular countable noun can\'t stand bare — it needs an article or another determiner (my, this). <b>a</b> means "one, some, one of": first mention, or saying what someone is (a job). Tip: if you could mentally add "one/some kind of" to the Russian, you probably need a.',
    pairs: [
      { ru: 'Он врач.', calque: 'He is doctor.', en: 'He is a doctor.' },
      { ru: 'У меня есть машина.', calque: 'I have car.', en: 'I have a car.' },
      { ru: 'Это яблоко.', calque: 'It is apple.', en: "It's an apple." },
    ],
    trap: 'articles',
  },
  a1_06: {
    ru: 'Русский обходится без «the»: что речь о конкретном предмете, понятно из контекста или порядка слов. В английском эту «известность» нужно назвать вслух: <b>the</b> = «тот самый, который мы оба знаем». Солнце, окно в этой комнате, книга, о которой уже шла речь, — всё с the. Проверка: если на вопрос «какой именно?» ответ очевиден обоим, ставьте the.',
    en: 'Russian manages without "the": context or word order shows you mean a specific thing. English says it out loud: <b>the</b> = "the one we both know". The sun, the window in this room, the book we just mentioned — all take the. Test: if "which one?" has an obvious answer for both speakers, use the.',
    pairs: [
      {
        ru: 'Закрой окно, пожалуйста.',
        calque: 'Close window, please.',
        en: 'Close the window, please.',
      },
      {
        ru: 'Солнце садится.',
        calque: 'Sun is setting.',
        en: 'The sun is setting.',
      },
      {
        ru: 'Я купил книгу. Книга интересная.',
        calque: 'I bought book. Book is interesting.',
        en: 'I bought a book. The book is interesting.',
      },
    ],
    trap: 'articles',
  },
  a1_07: {
    ru: 'Выучив, что «the ≈ этот», русскоязычные начинают ставить его везде и ошибаются в обратную сторону. Если говорим о чём-то <b>вообще</b> (музыка, жизнь, кофе, собаки как вид), а также о языках, видах спорта и большинстве стран, артикля нет. По-русски «Я люблю музыку» и «Мне нравится эта музыка» различаются словом «эта» — в английском так же: <em>I love music</em> / <em>I like the music here</em>.',
    en: 'Having learnt that "the = this", Russian speakers start putting it everywhere — the opposite mistake. When you talk about something <b>in general</b> (music, life, coffee, dogs as a species), and with languages, sports and most countries, there\'s no article. In Russian "I love music" and "I like this music" differ only by "this" — English works the same way: <em>I love music</em> / <em>I like the music here</em>.',
    pairs: [
      {
        ru: 'Жизнь коротка.',
        calque: 'The life is short.',
        en: 'Life is short.',
      },
      {
        ru: 'Я играю в теннис.',
        calque: 'I play in the tennis.',
        en: 'I play tennis.',
      },
      {
        ru: 'Я люблю кофе.',
        calque: 'I love the coffee.',
        en: 'I love coffee.',
      },
    ],
    trap: 'articles',
  },
  a1_08: {
    ru: 'Русский глагол меняет окончание в каждом лице (работаю, работаешь, работает…), и эти окончания никто не забывает. В английском от спряжения осталось одно окончание — <b>-s у he/she/it</b>, и именно его легко потерять: оно кажется необязательным. А ещё русское настоящее время значит и «обычно», и «сейчас», а Present Simple — только «обычно, всегда, вообще».',
    en: 'A Russian verb changes its ending for every person, and nobody forgets those endings. English kept just one — <b>-s for he/she/it</b> — and that\'s exactly the one learners drop, because it feels optional. Also, the Russian present means both "usually" and "right now", while Present Simple covers only "usually, always, in general".',
    pairs: [
      {
        ru: 'Она работает в банке.',
        calque: 'She work in a bank.',
        en: 'She works in a bank.',
      },
      {
        ru: 'Мой брат живёт в Москве.',
        calque: 'My brother live in Moscow.',
        en: 'My brother lives in Moscow.',
      },
      {
        ru: 'Он говорит по-английски.',
        calque: 'He speak on English.',
        en: 'He speaks English.',
      },
    ],
    trap: 'tenses',
  },
  a1_09: {
    ru: "По-русски «не» ставится прямо перед глаголом: «Я не люблю». Английский смысловой глагол сам отрицание не принимает — нужен помощник <b>don't/doesn't</b>, а глагол остаётся в начальной форме. Второе отличие: в русском отрицаний может быть несколько («Я <em>ничего не</em> знаю»), а в английском — только одно: <em>I don't know anything</em> или <em>I know nothing</em>.",
    en: 'In Russian "not" goes straight before the verb: literally "I not like". An English main verb can\'t take not by itself — it needs the helper <b>don\'t/doesn\'t</b>, and the verb stays in the base form. Second difference: Russian stacks negatives (literally "I nothing not know"), English allows just one: <em>I don\'t know anything</em> or <em>I know nothing</em>.',
    pairs: [
      {
        ru: 'Я не люблю кофе.',
        calque: 'I not like coffee.',
        en: "I don't like coffee.",
      },
      {
        ru: 'Он не работает.',
        calque: 'He not works.',
        en: "He doesn't work.",
      },
      {
        ru: 'Я ничего не знаю.',
        calque: "I don't know nothing.",
        en: "I don't know anything.",
      },
    ],
    trap: 'wordOrder',
  },
  a1_10: {
    ru: 'Русский вопрос — это утверждение с вопросительной интонацией: «Где она живёт?», «Сколько это стоит?». В английском для вопроса с обычным глаголом нужен <b>do/does</b> перед подлежащим: <em>Where does she live?</em> Смысловой глагол при этом теряет -s. Исключение — вопрос к подлежащему (кто?): <em>Who lives here?</em> — там do не нужен.',
    en: 'A Russian question is a statement with question intonation: literally "Where she lives?", "How much it costs?". An English question with an ordinary verb needs <b>do/does</b> before the subject: <em>Where does she live?</em> — and the main verb loses its -s. Exception — asking about the subject (who?): <em>Who lives here?</em> needs no do.',
    pairs: [
      {
        ru: 'Где она живёт?',
        calque: 'Where she lives?',
        en: 'Where does she live?',
      },
      {
        ru: 'Сколько это стоит?',
        calque: 'How much it costs?',
        en: 'How much does it cost?',
      },
      {
        ru: 'Что ты думаешь?',
        calque: 'What you think?',
        en: 'What do you think?',
      },
    ],
    trap: 'wordOrder',
  },
  a1_11: {
    ru: 'В русском одно настоящее время, и «сейчас» выражается словом, а не формой глагола: «Теперь я понимаю». Выучив -ing, многие добавляют его ко всему, что происходит «сейчас». Но глаголы состояния (know, understand, want, like, need, believe) описывают не процесс, а положение дел, поэтому остаются в Present Simple даже со словом <em>now</em>: <em>Now I understand.</em>',
    en: 'Russian has one present tense, and "now" is a word, not a verb form. Once learners discover -ing, they add it to anything happening "now". But state verbs (know, understand, want, like, need, believe) describe a state of affairs, not a process, so they stay in Present Simple even with <em>now</em>: <em>Now I understand.</em>',
    pairs: [
      {
        ru: 'Теперь я понимаю.',
        calque: 'Now I am understanding.',
        en: 'Now I understand.',
      },
      {
        ru: 'Я хочу кофе.',
        calque: 'I am wanting a coffee.',
        en: 'I want a coffee.',
      },
      {
        ru: 'Ты знаешь, где он?',
        calque: 'Are you knowing where he is?',
        en: 'Do you know where he is?',
      },
    ],
    trap: 'tenses',
  },
  a1_12: {
    ru: "В русском подлежащее легко опустить: «Иду домой», «Холодно», «Говорят, будет дождь» — окончание глагола и так показывает, кто действует. В английском окончаний почти нет, поэтому подлежащее <b>обязательно</b>. Если «делающего» нет вовсе (погода, время, расстояние), ставится формальное <b>it</b>: <em>It's cold.</em> Если имеются в виду «люди вообще» — <em>they / people</em>.",
    en: 'Russian happily drops the subject: literally "Going home", "Cold", "Say it will rain" — the verb ending already shows who\'s acting. English verbs have almost no endings, so the subject is <b>compulsory</b>. If there\'s no real doer (weather, time, distance), use dummy <b>it</b>: <em>It\'s cold.</em> For "people in general", use <em>they / people</em>.',
    pairs: [
      { ru: 'Холодно.', calque: 'Is cold.', en: "It's cold." },
      { ru: 'Иду домой.', calque: 'Go home.', en: "I'm going home." },
      {
        ru: 'Говорят, он богатый.',
        calque: 'Say he is rich.',
        en: "They say he's rich.",
      },
    ],
    trap: 'wordOrder',
  },
  a1_13: {
    ru: 'По-русски мы не уточняем, чьи руки или чья нога, если и так ясно: «Я помыл руки», «Он сломал ногу». В английском притяжательное слово ставится почти всегда: <em>I washed <b>my</b> hands</em>, <em>He broke <b>his</b> leg</em>. А у русского «свой» нет отдельного аналога: оно переводится по лицу — my, your, his, her, our, their.',
    en: 'In Russian we don\'t say whose hands or leg it is when that\'s obvious: literally "I washed hands", "He broke leg". English almost always adds the possessive: <em>I washed <b>my</b> hands</em>, <em>He broke <b>his</b> leg</em>. And the Russian reflexive possessive ("one\'s own") has no single equivalent: it becomes my, your, his, her, our or their depending on the subject.',
    pairs: [
      {
        ru: 'Я помыл руки.',
        calque: 'I washed hands.',
        en: 'I washed my hands.',
      },
      {
        ru: 'Он сломал ногу.',
        calque: 'He broke leg.',
        en: 'He broke his leg.',
      },
      {
        ru: 'Она положила телефон в сумку.',
        calque: 'She put phone in bag.',
        en: 'She put her phone in her bag.',
      },
    ],
    trap: 'articles',
  },
  a1_14: {
    ru: 'Две ловушки. После числительных русское существительное меняет форму, а после 21, 31… стоит в единственном числе: «21 год», «31 день». В английском всё, что не ровно один, — <b>множественное</b>: <em>twenty-one years</em>. И число не всегда совпадает: <em>money, news, hair</em> — единственное, хотя «деньги, новости, волосы» — множественное, а «одежда, пижама» наоборот: <em>clothes, pyjamas</em>.',
    en: 'Two traps. After numbers a Russian noun changes form, and after 21, 31… it\'s even singular (literally "21 year"). In English anything other than exactly one is <b>plural</b>: <em>twenty-one years</em>. Number doesn\'t always match either: <em>money, news, hair</em> are singular though plural in Russian, while the singular Russian words for clothing and pyjamas are plural in English: <em>clothes, pyjamas</em>.',
    pairs: [
      {
        ru: 'Ему 21 год.',
        calque: 'He is 21 year old.',
        en: 'He is 21 years old.',
      },
      {
        ru: 'Новости хорошие.',
        calque: 'The news are good.',
        en: 'The news is good.',
      },
      {
        ru: 'Где мои деньги? Они были здесь.',
        calque: 'Where are my money? They were here.',
        en: 'Where is my money? It was here.',
      },
    ],
    trap: 'countable',
  },
  a1_15: {
    ru: "Русское «это» универсально и не меняется: «Это мой брат», «Это мои книги». Английский требует согласовать указательное слово с числом и расстоянием: <b>this/that</b> — один предмет, <b>these/those</b> — несколько, и глагол тоже: <em>These are my books</em>. Кроме того, <em>that</em> звучит гораздо чаще русского «тот»: им показывают всё, что не рядом, и отсылают к сказанному: <em>That's a good idea.</em>",
    en: 'Russian has one all-purpose word for "this/it" that never changes: literally "this my books". English matches the demonstrative to number and distance: <b>this/that</b> for one thing, <b>these/those</b> for several — and the verb agrees: <em>These are my books</em>. Also, <em>that</em> is far more common than the Russian word for "that": it points to anything not close and refers back to what was said: <em>That\'s a good idea.</em>',
    pairs: [
      {
        ru: 'Это мои книги.',
        calque: 'This is my books.',
        en: 'These are my books.',
      },
      {
        ru: 'Эти туфли мне малы.',
        calque: 'This shoes are small for me.',
        en: 'These shoes are too small for me.',
      },
      {
        ru: 'Это были мои друзья.',
        calque: 'This was my friends.',
        en: 'Those were my friends.',
      },
    ],
    trap: 'countable',
  },
  a1_16: {
    ru: 'По-русски место ставится в начало, новое — в конец, а глагол можно опустить: «На столе книга», «В городе много парков». Английский такого порядка не допускает: если сообщаем, что что-то <b>есть/существует</b>, начинаем с <b>There is / There are</b>, а место ставим в конец: <em>There is a book on the table.</em> Подсказка: переводите русскую фразу с конца.',
    en: 'Russian puts the place first and the new thing last, often with no verb: literally "on the table a book", "in the town many parks". English won\'t allow that order: to say something <b>exists</b> somewhere, start with <b>There is / There are</b> and put the place at the end: <em>There is a book on the table.</em> Tip: translate the Russian sentence from the end.',
    pairs: [
      {
        ru: 'На столе книга.',
        calque: 'On the table is a book.',
        en: 'There is a book on the table.',
      },
      {
        ru: 'В нашем городе много парков.',
        calque: 'In our city are many parks.',
        en: 'There are a lot of parks in our city.',
      },
      {
        ru: 'В холодильнике нет молока.',
        calque: 'In the fridge no milk.',
        en: 'There is no milk in the fridge.',
      },
    ],
    trap: 'wordOrder',
  },
  a1_17: {
    ru: 'Русские «в» и «на» не совпадают с <em>in</em> и <em>on</em> один к одному. «На работе», «на концерте», «на остановке» — это не поверхность, а место-событие или точка, поэтому <b>at</b>: <em>at work, at a concert, at the bus stop</em>. «На фото» — <em>in the photo</em>. Учите предлог вместе с существительным, а не переводите его.',
    en: 'The Russian prepositions for "in" and "on" don\'t map one-to-one onto <em>in</em> and <em>on</em>. Russian says literally "on work", "on a concert", "on the bus stop", but these are points or events, not surfaces, so English uses <b>at</b>: <em>at work, at a concert, at the bus stop</em>. Russian "on the photo" is <em>in the photo</em>. Learn the preposition together with the noun instead of translating it.',
    pairs: [
      { ru: 'Он на работе.', calque: 'He is on work.', en: 'He is at work.' },
      {
        ru: 'Мы были на концерте.',
        calque: 'We were on a concert.',
        en: 'We were at a concert.',
      },
      {
        ru: 'На фото моя сестра.',
        calque: 'On the photo is my sister.',
        en: 'My sister is in the photo.',
      },
    ],
    trap: 'prepositions',
  },
  a1_18: {
    ru: "В русском вежливость заложена в саму форму: «дай» и «дайте», плюс смягчающие «-ка», «пожалуйста» и интонация. В английском форма одна для всех, и голый императив (<em>Give me…</em>) звучит как приказ, даже с <em>please</em>. Просьбу обычно превращают в вопрос: <em>Could you…? Can I have…?</em> Императив уместен в инструкциях, предупреждениях и между близкими. Запрет — всегда через <b>Don't</b>.",
    en: "Russian builds politeness into the verb: a familiar and a polite imperative form, plus softening particles and intonation. English has one form for everyone, and a bare imperative (<em>Give me…</em>) sounds like an order, even with <em>please</em>. Requests are usually turned into questions: <em>Could you…? Can I have…?</em> Plain imperatives suit instructions, warnings and close friends. A prohibition always starts with <b>Don't</b>.",
    pairs: [
      {
        ru: 'Дайте, пожалуйста, кофе.',
        calque: 'Give me coffee, please.',
        en: 'Could I have a coffee, please?',
      },
      { ru: 'Не опаздывай!', calque: "Don't late!", en: "Don't be late!" },
    ],
    trap: 'politeness',
  },
  a1_19: {
    ru: "По-русски различают «уметь» и «мочь», а в английском оба смысла обычно передаёт <b>can</b>: <em>I can swim</em> = «я умею плавать». Сам can — особый глагол: после него нет to, у него нет -s, и в вопросе и отрицании он обходится без do. Поэтому <em>can to swim</em>, <em>don't can</em> и <em>Do you can…?</em> невозможны.",
    en: 'Russian has separate verbs for "know how to" and "be able to"; English usually uses <b>can</b> for both: <em>I can swim</em>. Can itself is special: no to after it, no -s, and no do in questions and negatives. So <em>can to swim</em>, <em>don\'t can</em> and <em>Do you can…?</em> are impossible.',
    pairs: [
      {
        ru: 'Я не умею плавать.',
        calque: "I don't can swim.",
        en: "I can't swim.",
      },
      {
        ru: 'Он умеет водить.',
        calque: 'He can to drive.',
        en: 'He can drive.',
      },
      {
        ru: 'Ты умеешь готовить?',
        calque: 'Do you can cook?',
        en: 'Can you cook?',
      },
    ],
    trap: 'modals',
  },
  a1_20: {
    ru: "Привычные русские вопросы тянет переводить дословно: «Как тебя зовут?», «Сколько тебе лет?». Но английский задаёт их по-своему: <em>What's your name? How old are you?</em> Плюс порядок слов: после вопросительного слова сначала вспомогательный глагол, потом подлежащее — <em>Where do you live?</em>, а не «Where you live?».",
    en: 'Learners tend to translate common Russian questions word for word: "How do they call you?", "How many years are you?". English asks them its own way: <em>What\'s your name? How old are you?</em> Then word order: after the question word comes the auxiliary, then the subject — <em>Where do you live?</em>, not "Where you live?".',
    pairs: [
      {
        ru: 'Как тебя зовут?',
        calque: 'How do they call you?',
        en: "What's your name?",
      },
      {
        ru: 'Сколько тебе лет?',
        calque: 'How many years are you?',
        en: 'How old are you?',
      },
      {
        ru: 'Где ты живёшь?',
        calque: 'Where you live?',
        en: 'Where do you live?',
      },
    ],
    trap: 'wordOrder',
  },
  a1_21: {
    ru: 'По-русски «три тысячи», «пять миллионов» — во множественном числе, и рука тянется написать <em>three thousands</em>. Но после числа <b>hundred, thousand, million</b> не получают -s: <em>three thousand people</em> (множественное — только в <em>hundreds of, thousands of</em>). Различается и запись: дробная часть отделяется точкой (<em>2.5 — two point five</em>), а разряды — запятой (<em>10,000</em>). У нас «2,5» и «10 000».',
    en: 'Russian puts thousand and million into the plural after numbers, so learners write <em>three thousands</em>. In English <b>hundred, thousand, million</b> take no -s after a number: <em>three thousand people</em> (plural only in <em>hundreds of, thousands of</em>). Writing differs too: English uses a decimal point (<em>2.5 — two point five</em>) and a comma between thousands (<em>10,000</em>), where Russian uses a comma and a space.',
    pairs: [
      {
        ru: 'Три тысячи рублей.',
        calque: 'Three thousands roubles.',
        en: 'Three thousand roubles.',
      },
      {
        ru: 'Двести пятьдесят.',
        calque: 'Two hundreds fifty.',
        en: 'Two hundred and fifty.',
      },
      {
        ru: 'Две целых пять десятых.',
        calque: 'Two comma five.',
        en: 'Two point five.',
      },
    ],
    trap: 'countable',
  },
  a1_22: {
    ru: 'Порядковые числительные в английском почти всегда идут с <b>the</b>: <em>the first day, the third floor</em>. Русское «пятого мая» — это <em>on 5 May</em> или <em>on the fifth of May</em>, а у монархов «Пётр Первый» — <em>Peter the First</em>. Осторожно с этажами: британский <em>first floor</em> — это наш второй этаж, а наш первый — <em>ground floor</em>.',
    en: "English ordinals almost always take <b>the</b>: <em>the first day, the third floor</em>. Russian dates use a bare ordinal; in English it's <em>on 5 May</em> or <em>on the fifth of May</em>, and monarchs get the too: <em>Peter the First</em>. Careful with floors: the British <em>first floor</em> is the Russian second floor, and the Russian first floor is the <em>ground floor</em>.",
    pairs: [
      {
        ru: 'Мы живём на третьем этаже.',
        calque: 'We live on third floor.',
        en: 'We live on the third floor.',
      },
      {
        ru: 'Я родился пятого мая.',
        calque: 'I was born fifth May.',
        en: 'I was born on the fifth of May.',
      },
      { ru: 'Пётр Первый', calque: 'Peter First', en: 'Peter the First' },
    ],
    trap: 'articles',
  },
  a1_23: {
    ru: "Русский выражает принадлежность падежом и ставит владельца после предмета: «машина брата». Дословно получается <em>the car of my brother</em> — понятно, но о людях и животных англичане так не говорят. Нужен <b>'s</b>, и владелец идёт <b>впереди</b>: <em>my brother's car</em>. Конструкцию с <em>of</em> оставляют в основном для неодушевлённого: <em>the end of the film</em>.",
    en: 'Russian shows possession with a case ending and puts the owner after the thing: literally "car of brother". Word for word you get <em>the car of my brother</em> — understandable, but not how English talks about people and animals. Use <b>\'s</b> and put the owner <b>first</b>: <em>my brother\'s car</em>. Keep <em>of</em> mainly for things: <em>the end of the film</em>.',
    pairs: [
      {
        ru: 'Машина моего брата.',
        calque: 'The car of my brother.',
        en: "My brother's car.",
      },
      {
        ru: 'Дом моих родителей.',
        calque: 'The house of my parents.',
        en: "My parents' house.",
      },
      {
        ru: 'Игрушки детей.',
        calque: 'The toys of the children.',
        en: "The children's toys.",
      },
    ],
    trap: 'wordOrder',
  },
  a1_24: {
    ru: 'Русские «в» и «на» служат и для места, и для направления — меняется только падеж: «в школе» и «в школу». Английский разделяет это предлогами: направление — <b>to</b>, движение внутрь — <b>into</b>, место — <em>in/at</em>. И исключение: <em>home</em> после глаголов движения идёт без предлога — <em>go home</em>, а не <em>go to home</em>.',
    en: 'Russian uses the same prepositions for location and direction — only the case ending changes ("in school" vs "into school"). English splits them: direction is <b>to</b>, movement inside is <b>into</b>, location is <em>in/at</em>. And the exception: <em>home</em> takes no preposition after verbs of motion — <em>go home</em>, not <em>go to home</em>.',
    pairs: [
      {
        ru: 'Летом я поеду в Лондон.',
        calque: 'In summer I will go in London.',
        en: "I'm going to London in the summer.",
      },
      { ru: 'Пошли домой.', calque: "Let's go to home.", en: "Let's go home." },
      {
        ru: 'Он вошёл в комнату.',
        calque: 'He entered into the room.',
        en: 'He came into the room.',
      },
    ],
    trap: 'prepositions',
  },
  a2_01: {
    ru: 'Русское прошедшее меняется по роду и числу (работал, работала, работали), а «был» кажется главным признаком прошлого. В английском у правильного глагола одна форма для всех — <b>V + ed</b>, и <em>was</em> к нему не добавляют: was — это прошедшее от «быть», а не метка прошлого. Ещё привычка — ставить «вчера» перед глаголом; в английском время обычно стоит в конце или в самом начале.',
    en: 'The Russian past changes for gender and number, and the word for "was" feels like the main sign of the past. In English a regular verb has one form for everyone — <b>verb + ed</b> — and you don\'t add <em>was</em>: was is the past of be, not a past-tense marker. Another habit is putting "yesterday" before the verb; in English time expressions usually go at the end or at the very beginning.',
    pairs: [
      {
        ru: 'Вчера я работал допоздна.',
        calque: 'Yesterday I was work late.',
        en: 'I worked late yesterday.',
      },
      {
        ru: 'Я вчера звонил тебе.',
        calque: 'I yesterday called you.',
        en: 'I called you yesterday.',
      },
      {
        ru: 'Она жила в Лондоне.',
        calque: 'She was live in London.',
        en: 'She lived in London.',
      },
    ],
    trap: 'tenses',
  },
  a2_03: {
    ru: "По-русски, чтобы отрицать прошлое, достаточно «не» перед глаголом в прошедшем времени: «не видел». В английском прошлое переходит на помощника: <b>didn't</b> несёт и отрицание, и прошедшее время, поэтому смысловой глагол возвращается в начальную форму. «Двойное прошлое» <em>didn't went</em> — самая частая ошибка. Формула: <em>didn't + V1</em>.",
    en: 'In Russian you negate the past by putting "not" before the past-tense verb. In English the past moves to the helper: <b>didn\'t</b> carries both the negation and the past tense, so the main verb goes back to its base form. A "double past" like <em>didn\'t went</em> is the most common mistake. Formula: <em>didn\'t + base verb</em>.',
    pairs: [
      {
        ru: 'Я его не видел.',
        calque: 'I not saw him.',
        en: "I didn't see him.",
      },
      {
        ru: 'Она не пришла.',
        calque: "She didn't came.",
        en: "She didn't come.",
      },
      {
        ru: 'Мы ничего не купили.',
        calque: "We didn't buy nothing.",
        en: "We didn't buy anything.",
      },
    ],
    trap: 'tenses',
  },
  a2_04: {
    ru: 'Русский вопрос о прошлом — это утверждение с вопросительной интонацией: «Что ты сказал?», «Где ты это купил?». В английском нужен помощник <b>did</b> перед подлежащим, а глагол — в начальной форме: <em>What did you say?</em> Исключение — вопрос к подлежащему (кто? что?): <em>Who called you?</em> Здесь did не нужен: порядок слов и так как в утверждении.',
    en: 'A Russian question about the past is a statement with question intonation: literally "What you said?", "Where you bought it?". English needs the helper <b>did</b> before the subject, and the main verb in the base form: <em>What did you say?</em> Exception — asking about the subject (who? what?): <em>Who called you?</em> No did here: the word order is already that of a statement.',
    pairs: [
      {
        ru: 'Что ты сказал?',
        calque: 'What you said?',
        en: 'What did you say?',
      },
      {
        ru: 'Где ты купил эту куртку?',
        calque: 'Where you bought this jacket?',
        en: 'Where did you buy this jacket?',
      },
      {
        ru: 'Кто тебе позвонил?',
        calque: 'Who did call you?',
        en: 'Who called you?',
      },
    ],
    trap: 'wordOrder',
  },
  a2_05: {
    ru: 'В прошедшем времени русское «был» уже не пропадает, и это помогает. Ловушки в другом. Безличные «Мне было скучно / холодно» превращаются в подлежащее + be: <em>I was bored / cold</em> (а <em>I was boring</em> — «я был занудой»). «В комнате было много людей» — это <em>there was / there were</em>. И <em>were</em> нужно с you, we, they — даже когда «ты был» обращено к одному человеку.',
    en: 'In the past tense Russian does keep "was", which helps. The traps are elsewhere. The impersonal "to me was boring / cold" becomes subject + be: <em>I was bored / cold</em> (<em>I was boring</em> means you were dull). "In the room was many people" is <em>there was / there were</em>. And use <em>were</em> with you, we, they — even when "you" is just one person.',
    pairs: [
      {
        ru: 'Мне было скучно.',
        calque: 'To me was boring.',
        en: 'I was bored.',
      },
      {
        ru: 'Вчера в парке было много людей.',
        calque: 'Yesterday in the park was many people.',
        en: 'There were a lot of people in the park yesterday.',
      },
      { ru: 'Где ты был?', calque: 'Where you was?', en: 'Where were you?' },
    ],
    trap: 'toBe',
  },
  a2_06: {
    ru: "В русском будущее часто выражает сам глагол совершенного вида, без «буду»: «Я позвоню», «Я помогу». Форма похожа на настоящее время, и её переводят настоящим: <em>I call you</em>. Но у английского глагола нет вида, и будущее нужно обозначить — <b>will</b> (часто <em>'ll</em>). Особенно в обещаниях и решениях на ходу: <em>I'll call you tomorrow. I'll help you!</em>",
    en: "Russian often expresses the future with a perfective verb alone, without a word for \"will\" — and the form looks like the present. Learners translate it as the present: <em>I call you</em>. English verbs have no aspect, so the future must be marked — with <b>will</b> (often <em>'ll</em>). Especially in promises and on-the-spot decisions: <em>I'll call you tomorrow. I'll help you!</em>",
    pairs: [
      {
        ru: 'Я позвоню тебе завтра.',
        calque: 'I call you tomorrow.',
        en: "I'll call you tomorrow.",
      },
      {
        ru: 'Подожди, я помогу!',
        calque: 'Wait, I help!',
        en: "Wait, I'll help you!",
      },
      {
        ru: 'Думаю, будет дождь.',
        calque: 'I think will be rain.',
        en: 'I think it will rain.',
      },
    ],
    trap: 'tenses',
  },
  a2_07: {
    ru: "В русском одно будущее на все случаи: и план, придуманный неделю назад, и «сейчас упадёт!». Английский различает, <em>почему</em> мы так думаем. Решение принято заранее или признаки видны прямо сейчас — <b>be going to</b>: <em>I'm going to learn Spanish. Look, it's going to fall!</em> А <em>will</em> — решение в момент речи или просто мнение о будущем.",
    en: "Russian has one future for everything — a plan you made last week and \"it's about to fall!\" alike. English cares <em>why</em> you think so. A decision made beforehand, or evidence you can see right now — <b>be going to</b>: <em>I'm going to learn Spanish. Look, it's going to fall!</em> <em>will</em> is for decisions made at the moment of speaking or opinions about the future.",
    pairs: [
      {
        ru: 'Осторожно, он сейчас упадёт!',
        calque: 'Careful, he will fall now!',
        en: "Careful, he's going to fall!",
      },
      {
        ru: 'Что ты будешь делать на выходных?',
        calque: 'What will you be do at the weekend?',
        en: 'What are you going to do at the weekend?',
      },
      {
        ru: 'Смотри, сейчас пойдёт дождь!',
        calque: 'Look, now will go rain!',
        en: "Look, it's going to rain!",
      },
    ],
    trap: 'tenses',
  },
  a2_08: {
    ru: 'В русском одно настоящее время: «Я читаю» — это и «читаю каждый день», и «читаю прямо сейчас». Английский различает их формой: то, что происходит в момент речи или временно, — <b>am/is/are + -ing</b>. Поэтому «Что ты делаешь?» (сейчас) — <em>What are you doing?</em>, а <em>What do you do?</em> значит «Кем ты работаешь?».',
    en: 'Russian has a single present tense: one form means both "I read every day" and "I\'m reading right now". English separates them: what\'s happening at the moment of speaking or temporarily is <b>am/is/are + -ing</b>. So asking what someone is doing right now is <em>What are you doing?</em>, while <em>What do you do?</em> means "What\'s your job?"',
    pairs: [
      {
        ru: 'Не мешай, я работаю.',
        calque: "Don't disturb me, I work.",
        en: "Don't disturb me, I'm working.",
      },
      {
        ru: 'Смотри, идёт снег!',
        calque: 'Look, goes snow!',
        en: "Look, it's snowing!",
      },
      {
        ru: 'Она сейчас спит.',
        calque: 'She now sleeps.',
        en: "She's sleeping now.",
      },
    ],
    trap: 'tenses',
  },
  a2_09: {
    ru: "Здесь языки похожи: по-русски о договорённостях тоже говорят в настоящем — «Сегодня вечером я встречаюсь с друзьями». Но русское настоящее переводят как Present Simple, а для личных планов нужен <b>Present Continuous</b>: <em>I'm meeting friends this evening.</em> Present Simple о будущем — только для расписаний: <em>The train leaves at six.</em> И «сегодня вечером» — это <em>this evening / tonight</em>, а не <em>today in the evening</em>.",
    en: 'Here the languages are similar: Russian also uses the present for arrangements. But learners render it as Present Simple, while personal plans need <b>Present Continuous</b>: <em>I\'m meeting friends this evening.</em> Present Simple for the future is for timetables: <em>The train leaves at six.</em> And the Russian "today in the evening" is <em>this evening / tonight</em>.',
    pairs: [
      {
        ru: 'Сегодня вечером я встречаюсь с друзьями.',
        calque: 'Today in the evening I meet with friends.',
        en: "I'm meeting friends this evening.",
      },
      {
        ru: 'Что ты делаешь сегодня вечером?',
        calque: 'What do you do tonight?',
        en: 'What are you doing tonight?',
      },
    ],
    trap: 'tenses',
  },
  a2_10: {
    ru: 'Русское «Вода кипит» значит и «кипит вообще, при 100°», и «кипит прямо сейчас — выключи». Английский заставляет выбрать: факт или привычка — <b>Present Simple</b> (<em>Water boils at 100°C</em>), процесс сейчас или временная ситуация — <b>Present Continuous</b> (<em>The water is boiling</em>). Спросите себя: «обычно / всегда» или «сейчас / в эти дни»?',
    en: 'The Russian for "water boils" means both "it boils at 100°" and "it\'s boiling right now — turn it off". English makes you choose: a fact or habit — <b>Present Simple</b> (<em>Water boils at 100°C</em>); a process now or a temporary situation — <b>Present Continuous</b> (<em>The water is boiling</em>). Ask yourself: "usually / always" or "now / these days"?',
    pairs: [
      {
        ru: 'Вода кипит — выключи.',
        calque: 'The water boils — turn it off.',
        en: "The water's boiling — turn it off.",
      },
      {
        ru: 'Тише, ребёнок спит.',
        calque: 'Quiet, the baby sleeps.',
        en: "Quiet, the baby's sleeping.",
      },
      {
        ru: 'Вода кипит при 100 градусах.',
        calque: 'Water is boiling at 100 degrees.',
        en: 'Water boils at 100 degrees.',
      },
    ],
    trap: 'tenses',
  },
  a2_11: {
    ru: "Русские «надо», «нужно», «должен» часто переводят через <em>must</em> — и совет звучит как приказ. Для совета есть мягкое <b>should</b>: <em>You should see a doctor</em> = «тебе стоит сходить к врачу». После русского «стоит / следует» идёт инфинитив, а после should частицы to нет: <em>should go</em>. Отрицание — <em>shouldn't</em>, а не <em>don't should</em>.",
    en: 'Russian words for "need to / have to / must" are often translated as <em>must</em> — and advice sounds like an order. For advice English has softer <b>should</b>: <em>You should see a doctor.</em> The Russian equivalent is followed by an infinitive, but should takes no to: <em>should go</em>. The negative is <em>shouldn\'t</em>, not <em>don\'t should</em>.',
    pairs: [
      {
        ru: 'Тебе стоит отдохнуть.',
        calque: 'You should to rest.',
        en: 'You should rest.',
      },
      {
        ru: 'Тебе не стоит так много работать.',
        calque: "You don't should work so much.",
        en: "You shouldn't work so much.",
      },
    ],
    trap: 'modals',
  },
  a2_12: {
    ru: "Русское «не должен» двусмысленно: «Ты не должен приходить» — это и «тебе нельзя», и «тебе не обязательно». В английском это два разных выражения: <b>mustn't</b> = нельзя, запрещено; <b>don't have to</b> = не обязательно, можно не делать. Перепутаете — и вежливое «можешь не приходить» превратится в «не смей приходить».",
    en: 'The Russian for "you must not" is ambiguous: it can mean both "you\'re not allowed" and "you don\'t need to". English has two different expressions: <b>mustn\'t</b> = it\'s forbidden; <b>don\'t have to</b> = it\'s not necessary. Mix them up and a kind "no need to come" turns into "don\'t you dare come".',
    pairs: [
      {
        ru: 'Тебе не обязательно приходить.',
        calque: "You mustn't come.",
        en: "You don't have to come.",
      },
      {
        ru: 'Здесь нельзя курить.',
        calque: 'Here is not allowed to smoke.',
        en: "You mustn't smoke here.",
      },
      { ru: 'Я должен идти.', calque: 'I must to go.', en: 'I must go.' },
    ],
    trap: 'modals',
  },
  a2_13: {
    ru: "Русские «должен» и «надо» покрывают и <em>must</em>, и <em>have to</em>. Но у must нет прошедшего и будущего времени, поэтому «мне пришлось» и «придётся» — это только <b>had to / will have to</b>: <em>I had to leave early.</em> А в вопросах и отрицаниях have to ведёт себя как обычный глагол: <em>Do you have to…? I don't have to…</em>",
    en: 'The Russian words for "must / need to" cover both <em>must</em> and <em>have to</em>. But must has no past or future form, so "I had to" and "I\'ll have to" can only be <b>had to / will have to</b>: <em>I had to leave early.</em> And in questions and negatives have to behaves like an ordinary verb: <em>Do you have to…? I don\'t have to…</em>',
    pairs: [
      {
        ru: 'Вчера мне пришлось уйти пораньше.',
        calque: 'Yesterday I must leave early.',
        en: 'I had to leave early yesterday.',
      },
      {
        ru: 'Завтра мне придётся работать.',
        calque: 'Tomorrow I will must work.',
        en: "I'll have to work tomorrow.",
      },
      {
        ru: 'Тебе обязательно носить форму?',
        calque: 'Have you to wear a uniform?',
        en: 'Do you have to wear a uniform?',
      },
    ],
    trap: 'modals',
  },
  a2_14: {
    ru: "Русское «смог» (совершенный вид) значит, что в конкретный раз всё получилось. Английское <b>could</b> так не работает: оно говорит об умении вообще (<em>I could swim at five</em>). Для одного удачного случая нужно <b>managed to / was able to</b>: <em>I managed to fix it.</em> В отрицании разницы нет: <em>I couldn't fix it</em> — нормально.",
    en: "The Russian perfective \"managed / was able\" means it worked out on one particular occasion. English <b>could</b> doesn't work that way: it describes general ability (<em>I could swim at five</em>). For a single success use <b>managed to / was able to</b>: <em>I managed to fix it.</em> In the negative there's no difference: <em>I couldn't fix it</em> is fine.",
    pairs: [
      {
        ru: 'Я смог починить машину.',
        calque: 'I could repair the car.',
        en: 'I managed to repair the car.',
      },
      {
        ru: 'В конце концов мы смогли найти отель.',
        calque: 'Finally we could find the hotel.',
        en: 'In the end we managed to find the hotel.',
      },
    ],
    trap: 'modals',
  },
  a2_15: {
    ru: 'Русский образует сравнение двумя способами — «выше» и «более высокий», и выбор почти свободный. В английском он зависит от длины слова: короткие — <b>-er</b> (<em>taller</em>), длинные — <b>more</b> (<em>more expensive</em>), и никогда оба сразу (<em>more taller</em>). Разница выражается без предлога: «старше на два года» — <em>two years older</em>, а «чем больше, тем лучше» — <em>the more, the better</em>.',
    en: 'Russian forms comparatives in two ways — a suffix or "more + adjective" — and the choice is fairly free. In English it depends on word length: short adjectives take <b>-er</b> (<em>taller</em>), long ones take <b>more</b> (<em>more expensive</em>), never both (<em>more taller</em>). The difference needs no preposition: "older on two years" is <em>two years older</em>, and "how more, so better" is <em>the more, the better</em>.',
    pairs: [
      {
        ru: 'Он выше меня.',
        calque: 'He is more tall than me.',
        en: 'He is taller than me.',
      },
      {
        ru: 'Она старше меня на два года.',
        calque: 'She is older than me on two years.',
        en: 'She is two years older than me.',
      },
      {
        ru: 'Чем больше, тем лучше.',
        calque: 'How more, so better.',
        en: 'The more, the better.',
      },
    ],
    trap: 'wordOrder',
  },
  a2_16: {
    ru: 'Русское «самый» — обычное прилагательное, и артикль ему не нужен (артиклей нет вообще). В английском превосходная степень почти всегда с <b>the</b>: <em>the best, the most interesting</em>. «Самый лучший» — это просто <em>the best</em>, без most. А «лучший в мире / в классе» — с <em>in</em>, а не <em>of</em>: <em>the best in the world</em>.',
    en: 'The Russian word for "most" is just an adjective and needs no article (Russian has none). In English the superlative almost always takes <b>the</b>: <em>the best, the most interesting</em>. The Russian "most best" is simply <em>the best</em>, with no most. And "best in the world / in the class" takes <em>in</em> with places and groups, not <em>of</em>.',
    pairs: [
      {
        ru: 'Это самый интересный фильм.',
        calque: 'It is most interesting film.',
        en: "It's the most interesting film.",
      },
      {
        ru: 'Он самый лучший.',
        calque: 'He is the most best.',
        en: 'He is the best.',
      },
      {
        ru: 'Самый большой город в мире.',
        calque: 'The biggest city of the world.',
        en: 'The biggest city in the world.',
      },
    ],
    trap: 'articles',
  },
  a2_17: {
    ru: "В русском неопределённое количество обычно никак не выражается: «Хочешь чаю?», «Есть вопросы?», «Денег нет». В английском перед неисчисляемыми и множественным числом часто стоит <b>some</b> (утверждения, просьбы, предложения) или <b>any</b> (вопросы и отрицания). И одно отрицание на фразу: «нет никаких вопросов» — <em>I don't have any questions</em>, а не <em>no any</em> и не <em>don't have no</em>.",
    en: 'Russian usually leaves an indefinite amount unexpressed: literally "Want tea?", "Are there questions?". In English uncountable and plural nouns often take <b>some</b> (statements, requests, offers) or <b>any</b> (questions and negatives). And one negative per sentence: "I have no any questions" is <em>I don\'t have any questions</em> — not <em>no any</em>, not <em>don\'t have no</em>.',
    pairs: [
      {
        ru: 'У меня нет никаких вопросов.',
        calque: 'I have no any questions.',
        en: "I don't have any questions.",
      },
      {
        ru: 'У меня нет денег.',
        calque: "I don't have no money.",
        en: "I don't have any money.",
      },
      {
        ru: 'Я не купил хлеба.',
        calque: "I didn't buy some bread.",
        en: "I didn't buy any bread.",
      },
    ],
    trap: 'countable',
  },
  a2_18: {
    ru: 'Русское «много» одно на всё: много людей, много денег. В английском выбор зависит от того, можно ли посчитать: <b>many</b> — с исчисляемыми (<em>many people</em>), <b>much</b> — с неисчисляемыми (<em>much money</em>). Так же «немного / мало»: <em>a few / few</em> против <em>a little / little</em>. В утвердительных фразах естественнее <em>a lot of</em> — оно подходит к обоим.',
    en: 'Russian has one word for "a lot / many / much" that fits everything: a lot of people, a lot of money. In English the choice depends on whether you can count: <b>many</b> with countables (<em>many people</em>), <b>much</b> with uncountables (<em>much money</em>). Same with "a little / few": <em>a few / few</em> vs <em>a little / little</em>. In positive sentences <em>a lot of</em> sounds more natural and fits both.',
    pairs: [
      {
        ru: 'Там было много людей.',
        calque: 'There was much people.',
        en: 'There were a lot of people.',
      },
      {
        ru: 'Немного воды, пожалуйста.',
        calque: 'A few water, please.',
        en: 'A little water, please.',
      },
      {
        ru: 'У меня мало времени.',
        calque: 'I have few time.',
        en: "I don't have much time.",
      },
    ],
    trap: 'countable',
  },
  a2_19: {
    ru: 'Исчисляемость в двух языках часто не совпадает. «Советы», «новости», «деньги», «волосы» по-русски во множественном числе, а <em>advice, news, money, hair</em> в английском неисчисляемые: без a, без -s, с глаголом в единственном числе. Чтобы посчитать, нужна «порция»: <em>a piece of advice, a piece of news</em>. Так же <em>information</em>: <em>some information</em>, никогда <em>informations</em>.',
    en: 'Countability often differs between the two languages. The Russian words for advice, news, money and hair are plural, but in English these nouns are uncountable: no a, no -s, a singular verb. To count them, use a unit: <em>a piece of advice, a piece of news</em>. <em>information</em> works the same way: <em>some information</em>, never <em>informations</em>.',
    pairs: [
      {
        ru: 'Он дал мне хорошие советы.',
        calque: 'He gave me good advices.',
        en: 'He gave me some good advice.',
      },
      {
        ru: 'У меня мокрые волосы.',
        calque: 'My hairs are wet.',
        en: 'My hair is wet.',
      },
      {
        ru: 'Деньги лежат на столе.',
        calque: 'The money are on the table.',
        en: 'The money is on the table.',
      },
    ],
    trap: 'countable',
  },
  a2_20: {
    ru: 'По-русски почти всё время — с «в»: в понедельник, в пять часов, в июле, в 2020 году. В английском три предлога по «масштабу»: <b>at</b> — точка (<em>at five</em>), <b>on</b> — день и дата (<em>on Monday</em>), <b>in</b> — период длиннее (<em>in July, in 2020</em>). А с <em>this, next, last, every</em> предлог не нужен вовсе: «на следующей неделе» — <em>next week</em>.',
    en: 'Russian uses one preposition for almost every time expression: literally "in Monday, in five o\'clock, in July". English has three, by scale: <b>at</b> for a point (<em>at five</em>), <b>on</b> for a day or date (<em>on Monday</em>), <b>in</b> for longer periods (<em>in July, in 2020</em>). And with <em>this, next, last, every</em> there\'s no preposition at all: <em>next week</em>.',
    pairs: [
      {
        ru: 'Увидимся в понедельник.',
        calque: 'See you in Monday.',
        en: 'See you on Monday.',
      },
      {
        ru: 'Урок начинается в пять часов.',
        calque: "The lesson starts in five o'clock.",
        en: "The lesson starts at five o'clock.",
      },
      {
        ru: 'Мы уезжаем на следующей неделе.',
        calque: 'We leave on the next week.',
        en: "We're leaving next week.",
      },
    ],
    trap: 'prepositions',
  },
  a2_21: {
    ru: 'Русское «в течение трёх лет» тянет к <em>during</em>, но длительность в английском — это <b>for</b>: <em>for three years</em> (а during — «во время чего-то»: <em>during the war</em>). Начальный момент («с понедельника») — <b>since</b>, а не <em>from</em>. «Назад» — <b>ago</b> после срока: <em>three days ago</em>, а не <em>three days before</em>. С since обычно нужен Present Perfect, с ago — Past Simple.',
    en: 'The Russian for "in the course of three years" pulls learners towards <em>during</em>, but a length of time is <b>for</b>: <em>for three years</em> (during means "in the time of something": <em>during the war</em>). A starting point ("from Monday") is <b>since</b>, not <em>from</em>. "Back" is <b>ago</b> after the period: <em>three days ago</em>, not <em>three days before</em>. Since usually needs Present Perfect; ago needs Past Simple.',
    pairs: [
      {
        ru: 'Я учил французский в течение трёх лет.',
        calque: 'I learnt French during three years.',
        en: 'I learnt French for three years.',
      },
      {
        ru: 'Я видел его три дня назад.',
        calque: 'I saw him three days before.',
        en: 'I saw him three days ago.',
      },
      {
        ru: 'Я здесь с понедельника.',
        calque: 'I am here from Monday.',
        en: "I've been here since Monday.",
      },
    ],
    trap: 'prepositions',
  },
  a2_22: {
    ru: "В русском есть универсальный хвостик: «…, да?», «…, правда?», «…, не так ли?». Поэтому так и тянет сказать <em>…, yes?</em> или везде лепить <em>…, isn't it?</em> В английском хвостик собирается из самого предложения: тот же вспомогательный глагол и местоимение, но с обратным знаком — <em>You're tired, <b>aren't you</b>? She can swim, <b>can't she</b>?</em>",
    en: 'Russian has an all-purpose tag, like "…, yes?" or "…, right?". So learners say <em>…, yes?</em> or stick <em>…, isn\'t it?</em> on everything. An English tag is built from the sentence itself: the same auxiliary and a pronoun, with the opposite polarity — <em>You\'re tired, <b>aren\'t you</b>? She can swim, <b>can\'t she</b>?</em>',
    pairs: [
      {
        ru: 'Ты из Москвы, да?',
        calque: 'You are from Moscow, yes?',
        en: "You're from Moscow, aren't you?",
      },
      {
        ru: 'Он умеет плавать, не так ли?',
        calque: "He can swim, isn't it?",
        en: "He can swim, can't he?",
      },
      {
        ru: 'Ты вчера звонил, правда?',
        calque: "You called yesterday, isn't it?",
        en: "You called yesterday, didn't you?",
      },
    ],
    trap: 'wordOrder',
  },
  a2_23: {
    ru: "Русское «У меня есть машина» строится вокруг предмета («есть машина»), а английское — вокруг владельца: <b>I have / I've got a car</b>. Отсюда ошибка <em>I am have</em>: «есть» переводят как be. <em>have got</em> — разговорная британская форма только для настоящего: вопрос <em>Have you got…?</em> (без do), отрицание <em>I haven't got</em>; в прошлом — просто <em>had</em>.",
    en: 'The Russian "I have a car" is built around the thing (literally "at me is a car"); English is built around the owner: <b>I have / I\'ve got a car</b>. Hence the mistake <em>I am have</em>: the Russian "is" gets translated as be. <em>have got</em> is informal British and present only: question <em>Have you got…?</em> (no do), negative <em>I haven\'t got</em>; in the past it\'s just <em>had</em>.',
    pairs: [
      {
        ru: 'У меня есть два брата.',
        calque: 'I am have two brothers.',
        en: "I've got two brothers.",
      },
      {
        ru: 'У тебя есть ручка?',
        calque: 'Do you have got a pen?',
        en: 'Have you got a pen?',
      },
      {
        ru: 'В детстве у меня была собака.',
        calque: 'In childhood I had got a dog.',
        en: 'I had a dog when I was a child.',
      },
    ],
    trap: 'toBe',
  },
  a2_24: {
    ru: 'По-русски после «выглядеть», «пахнуть», «звучать», «чувствовать себя» ставится наречие: «пахнет вкусно», «звучит странно», «чувствую себя плохо». В английском <em>look, smell, sound, feel, taste</em> описывают само подлежащее, поэтому после них <b>прилагательное</b>: <em>It smells delicious. I feel bad.</em> И без <em>myself</em>: «чувствую себя» — просто <em>I feel</em>. Наречие на -ly — когда описываем действие: <em>She sings beautifully.</em>',
    en: 'In Russian, verbs like look, smell, sound and "feel oneself" are followed by an adverb (literally "smells tastily", "I feel myself badly"). In English <em>look, smell, sound, feel, taste</em> describe the subject itself, so they take an <b>adjective</b>: <em>It smells delicious. I feel bad.</em> And no <em>myself</em>: just <em>I feel</em>. Use an -ly adverb when you describe the action: <em>She sings beautifully.</em>',
    pairs: [
      {
        ru: 'Суп вкусно пахнет.',
        calque: 'The soup smells deliciously.',
        en: 'The soup smells delicious.',
      },
      {
        ru: 'Это звучит странно.',
        calque: 'It sounds strangely.',
        en: 'That sounds strange.',
      },
      {
        ru: 'Я плохо себя чувствую.',
        calque: 'I feel myself bad.',
        en: "I don't feel well.",
      },
    ],
    trap: 'collocations',
  },
  a2_25: {
    ru: 'В русском наречие частоты можно поставить почти куда угодно: «Я всегда пью кофе», «Пью кофе я всегда без сахара». В английском место строгое: <b>перед смысловым глаголом</b> (<em>I always drink coffee</em>), но <b>после be</b> и после вспомогательного глагола (<em>He is always late. I have never seen it.</em>). Между глаголом и дополнением наречие не ставят: не <em>drink always coffee</em>.',
    en: 'In Russian a frequency adverb can go almost anywhere. In English its place is fixed: <b>before the main verb</b> (<em>I always drink coffee</em>), but <b>after be</b> and after an auxiliary (<em>He is always late. I have never seen it.</em>). Never between the verb and its object: not <em>drink always coffee</em>. Note that the Russian "is late" is a verb, so learners put always before is.',
    pairs: [
      {
        ru: 'Он всегда опаздывает.',
        calque: 'He always is late.',
        en: 'He is always late.',
      },
      {
        ru: 'Я пью кофе всегда без сахара.',
        calque: 'I drink coffee always without sugar.',
        en: 'I always drink coffee without sugar.',
      },
      {
        ru: 'Мы обычно ужинаем в семь.',
        calque: 'We have usually dinner at seven.',
        en: 'We usually have dinner at seven.',
      },
    ],
    trap: 'wordOrder',
  },
  b1_01: {
    ru: 'В русском нет времени Present Perfect — есть вид: «сделал» и «делал». Поэтому кажется, что Present Perfect — это просто «уже» или совершенный вид. На деле он отвечает на вопрос «что есть <b>сейчас</b> в результате?» и не терпит точного времени в прошлом. Есть «вчера», «в 2019 году», «когда?» — значит Past Simple, как бы ни звучала фраза по-русски.',
    en: 'Russian has no Present Perfect — it has aspect: "did (and finished)" vs "was doing". So learners treat Present Perfect as "already" or as the perfective. In fact it answers "what\'s true <b>now</b> as a result?" and won\'t take a specific past time. If there\'s "yesterday", "in 2019" or "when?", it\'s Past Simple, whatever the Russian sounds like.',
    pairs: [
      {
        ru: 'Я видел его вчера.',
        calque: 'I have seen him yesterday.',
        en: 'I saw him yesterday.',
      },
      {
        ru: 'Это первый раз, когда я в Лондоне.',
        calque: "It's the first time I am in London.",
        en: "It's the first time I've been to London.",
      },
    ],
    trap: 'tenses',
  },
  b1_02: {
    ru: "Русские «уже» и «ещё» не переводятся одним словом. «Уже» в вопросе — обычно <b>yet</b> в конце (<em>Have you finished yet?</em>), а «уже не» — вовсе не already, а <b>not any more / no longer</b>. «Ещё не» — <em>not … yet</em>. И «никогда не» — это одно отрицание: <em>I've never been</em>, без второго not.",
    en: 'The Russian words for "already" and "still/yet" don\'t map onto single English words. "Already" in a question is usually <b>yet</b> at the end (<em>Have you finished yet?</em>), and "already not" isn\'t already at all but <b>not any more / no longer</b>. "Still not" is <em>not … yet</em>. And the Russian "never not" is a single negative: <em>I\'ve never been</em>.',
    pairs: [
      {
        ru: 'Я уже не курю.',
        calque: "I already don't smoke.",
        en: "I don't smoke any more.",
      },
      {
        ru: 'Я никогда не был в Японии.',
        calque: "I haven't never been to Japan.",
        en: "I've never been to Japan.",
      },
    ],
    trap: 'tenses',
  },
  b1_03: {
    ru: 'Русский выбирает форму по виду: закончено — «сделал», процесс — «делал». Английский — по связи с настоящим: результат важен сейчас и время не названо — <b>Present Perfect</b>; есть точное время или рассказ о прошлом — <b>Past Simple</b>, даже если по-русски совершенный вид. Подсказка: вопрос <em>When…?</em> и слова <em>yesterday, ago, last…</em> всегда ведут к Past Simple.',
    en: 'Russian picks the verb form by aspect: finished vs in progress. English picks by connection to now: the result matters now and no time is given — <b>Present Perfect</b>; a definite time or a story about the past — <b>Past Simple</b>, even if the Russian verb is perfective. Tip: <em>When…?</em> and words like <em>yesterday, ago, last…</em> always take Past Simple.',
    pairs: [
      {
        ru: 'Когда ты приехал?',
        calque: 'When have you arrived?',
        en: 'When did you arrive?',
      },
      {
        ru: 'Я закончил работу в пять.',
        calque: 'I have finished work at five.',
        en: 'I finished work at five.',
      },
      {
        ru: 'Шекспир написал много пьес.',
        calque: 'Shakespeare has written many plays.',
        en: 'Shakespeare wrote many plays.',
      },
    ],
    trap: 'tenses',
  },
  b1_04: {
    ru: 'По-русски действие, которое началось в прошлом и продолжается, стоит в настоящем времени: «Я живу здесь с 2010 года», «Я знаю его пять лет». Английский видит отрезок от прошлого до сейчас, и для него нужен <b>Present Perfect</b>: <em>I have lived here since 2010.</em> Сигнал: в русской фразе настоящее время + «с…» или «уже … лет».',
    en: 'In Russian an action that started in the past and is still going on is in the present tense: literally "I live here since 2010", "I know him five years". English sees a stretch from the past up to now, which needs <b>Present Perfect</b>: <em>I have lived here since 2010.</em> Signal: a Russian present tense plus "since…" or "for … years now".',
    pairs: [
      {
        ru: 'Я живу здесь с 2010 года.',
        calque: 'I live here since 2010.',
        en: 'I have lived here since 2010.',
      },
      {
        ru: 'Я знаю его пять лет.',
        calque: 'I know him five years.',
        en: "I've known him for five years.",
      },
      {
        ru: 'Сколько ты здесь работаешь?',
        calque: 'How long do you work here?',
        en: 'How long have you worked here?',
      },
    ],
    trap: 'tenses',
  },
  b1_05: {
    ru: "«Я жду тебя уже час!» — по-русски это настоящее время, и рука пишет <em>I wait</em> или <em>I am waiting</em>. Но если действие длится с прошлого до сейчас и мы говорим, как долго, нужен <b>Present Perfect Continuous</b>: <em>I've been waiting for an hour.</em> Русское «уже» здесь не переводится: длительность передаёт <em>for</em>.",
    en: '"I\'m waiting for you already an hour!" — in Russian it\'s the present tense, so learners write <em>I wait</em> or <em>I am waiting</em>. But when an activity runs from the past up to now and you say how long, English needs <b>Present Perfect Continuous</b>: <em>I\'ve been waiting for an hour.</em> Don\'t translate the Russian "already" here: <em>for</em> shows the duration.',
    pairs: [
      {
        ru: 'Я жду тебя уже час!',
        calque: 'I am waiting for you already an hour!',
        en: "I've been waiting for you for an hour!",
      },
      {
        ru: 'Как давно ты учишь английский?',
        calque: 'How long do you learn English?',
        en: 'How long have you been learning English?',
      },
      {
        ru: 'Мы ищем квартиру с марта.',
        calque: 'We are looking for a flat since March.',
        en: "We've been looking for a flat since March.",
      },
    ],
    trap: 'tenses',
  },
  b1_06: {
    ru: 'Русское «делал» (несовершенный вид) кажется точным аналогом Past Continuous, но это не так. «В детстве я играл в футбол» — привычка, «я уже читал эту книгу» — опыт; по-английски ни то ни другое не Continuous. <b>Past Continuous</b> — только действие в процессе в конкретный момент прошлого: <em>At eight I was having dinner.</em> Проверка: можно ли добавить «в тот момент»?',
    en: 'The Russian imperfective past looks like an exact match for Past Continuous, but it isn\'t. "As a child I played football" is a habit, "I\'ve already read this book" is experience — neither is Continuous in English. <b>Past Continuous</b> is only for an action in progress at a particular moment in the past: <em>At eight I was having dinner.</em> Test: can you add "at that moment"?',
    pairs: [
      {
        ru: 'В детстве я играл в футбол.',
        calque: 'In childhood I was playing football.',
        en: 'I played football as a child.',
      },
      {
        ru: 'Я уже читал эту книгу.',
        calque: 'I already was reading this book.',
        en: "I've already read this book.",
      },
    ],
    trap: 'tenses',
  },
  b1_07: {
    ru: 'В русском и фон, и событие могут стоять в несовершенном виде, а погоду описывают глаголом движения: «шёл дождь», «шёл снег». В английском длительный фон — <b>Past Continuous</b>, а короткое событие, которое его прерывает, — <b>Past Simple</b>: <em>I was walking home when it started to rain.</em> А «шёл дождь» — это <em>it was raining</em>: дождь по-английски не «идёт».',
    en: 'In Russian both the background and the event can be imperfective, and weather uses a verb of motion (literally "rain was going"). In English the long background is <b>Past Continuous</b>, and the short event that interrupts it is <b>Past Simple</b>: <em>I was walking home when it started to rain.</em> And "rain was going" is <em>it was raining</em>: rain doesn\'t "go" in English.',
    pairs: [
      { ru: 'Шёл дождь.', calque: 'The rain went.', en: 'It was raining.' },
      {
        ru: 'Я спал, когда ты позвонил.',
        calque: 'I slept when you called.',
        en: 'I was sleeping when you called.',
      },
    ],
    trap: 'tenses',
  },
  b1_08: {
    ru: 'Русские общие правила часто строятся с безличным инфинитивом: «Если нагреть лёд, он растает», «Если нажать кнопку…». Дословно получается <em>If to heat…</em>, а так нельзя: в английском нужно подлежащее — обобщённое <b>you</b> — и Present в обеих частях: <em>If you heat ice, it melts.</em> Русское будущее «растает» здесь обычно меняется на настоящее: это закон, а не прогноз.',
    en: 'Russian general rules often use an impersonal infinitive: literally "If to heat ice, it will melt", "If to press the button…". English can\'t do that: it needs a subject — generic <b>you</b> — and the present in both halves: <em>If you heat ice, it melts.</em> The Russian future "will melt" usually becomes the present here: this is a law, not a prediction.',
    pairs: [
      {
        ru: 'Если нагреть лёд, он растает.',
        calque: 'If to heat ice, it will melt.',
        en: 'If you heat ice, it melts.',
      },
      {
        ru: 'Если нажать эту кнопку, дверь откроется.',
        calque: 'If to press this button, the door will open.',
        en: 'If you press this button, the door opens.',
      },
    ],
    trap: 'conditionals',
  },
  b1_09: {
    ru: "По-русски будущее ставится в обе части: «Если он <em>придёт</em>, я <em>скажу</em>». В английском после <b>if, when, as soon as, until, before, after</b> будущее выражается настоящим временем: <em>If he comes, I'll tell him.</em> will остаётся только в главной части. Подсказка: «если / когда» + русское будущее = английский Present Simple.",
    en: 'Russian puts the future in both halves: literally "If he will come, I will tell him". In English, after <b>if, when, as soon as, until, before, after</b> the future is expressed by the present tense: <em>If he comes, I\'ll tell him.</em> will stays only in the main clause. Tip: Russian "if / when" + future = English Present Simple.',
    pairs: [
      {
        ru: 'Если он придёт, я ему скажу.',
        calque: 'If he will come, I will tell him.',
        en: "If he comes, I'll tell him.",
      },
      {
        ru: 'Когда я вернусь, я позвоню.',
        calque: 'When I will come back, I will call.',
        en: "When I get back, I'll call you.",
      },
      {
        ru: 'Подожди, пока я закончу.',
        calque: 'Wait until I will finish.',
        en: 'Wait until I finish.',
      },
    ],
    trap: 'futureTime',
  },
  b1_10: {
    ru: 'Русское «бы» универсально и часто стоит в обеих частях: «Если <em>бы</em> у меня была машина, я <em>бы</em> поехал». Его тянет переводить словом <em>would</em> дважды. Но в английском <b>would</b> живёт только в главной части, а в части с if — Past Simple: <em>If I had a car, I would go.</em> Прошедшая форма здесь означает не прошлое, а нереальность.',
    en: 'The Russian unreal particle (roughly "would") often appears in both halves: literally "If would I have a car, I would go". Learners translate it as <em>would</em> twice. But in English <b>would</b> lives only in the main clause; the if-clause takes Past Simple: <em>If I had a car, I would go.</em> The past form here signals unreality, not past time.',
    pairs: [
      {
        ru: 'Если бы у меня была машина, я бы поехал.',
        calque: 'If I would have a car, I would go.',
        en: "If I had a car, I'd go.",
      },
      {
        ru: 'Если бы я знал ответ, я бы сказал.',
        calque: 'If I would know the answer, I would say.',
        en: "If I knew the answer, I'd tell you.",
      },
      {
        ru: 'На твоём месте я бы не стал.',
        calque: 'On your place I would not.',
        en: "If I were you, I wouldn't.",
      },
    ],
    trap: 'conditionals',
  },
  b1_11: {
    ru: "Для маловероятного будущего русскому обычно хватает «если вдруг» + будущее: «Если я вдруг выиграю миллион…». Английский передаёт сомнение самой грамматикой: реально ожидаю — 1-й тип (<em>If I win</em>), маловероятно или фантазия — <b>2-й тип</b>, даже о будущем: <em>If I won a million, I'd buy an island.</em> Части не смешиваются: <em>if + Past → would</em>, <em>if + Present → will</em>.",
    en: 'For an unlikely future Russian usually just adds "suddenly / by chance" to an ordinary future: literally "If I suddenly will win a million…". English shows doubt through grammar: expected — type 1 (<em>If I win</em>); unlikely or imaginary — <b>type 2</b>, even about the future: <em>If I won a million, I\'d buy an island.</em> Don\'t mix the halves: <em>if + past → would</em>, <em>if + present → will</em>.',
    pairs: [
      {
        ru: 'Если я вдруг выиграю миллион, я куплю остров.',
        calque: 'If I will suddenly win a million, I will buy an island.',
        en: "If I won a million, I'd buy an island.",
      },
      {
        ru: 'Если вдруг увидишь Анну, передай привет.',
        calque: 'If you will suddenly see Anna, say hello.',
        en: 'If you happen to see Anna, say hello.',
      },
    ],
    trap: 'conditionals',
  },
  b1_12: {
    ru: 'Русский часто обходится без страдательного залога: «Здесь говорят по-английски», «Кофе выращивают в Бразилии», «Как пишется это слово?» — безличное «они» или возвратное «-ся». Дословный перевод оставляет фразу без подлежащего. В английском, когда исполнитель неважен, предмет становится подлежащим: <b>is/are + V3</b> — <em>English is spoken here. Coffee is grown in Brazil.</em>',
    en: 'Russian often avoids the passive: literally "Here speak English", "Coffee grow in Brazil", "How this word writes itself?" — an impersonal "they" or a reflexive verb. Word for word, that leaves the sentence without a proper subject. In English, when the doer doesn\'t matter, the object becomes the subject: <b>is/are + past participle</b> — <em>English is spoken here. Coffee is grown in Brazil.</em>',
    pairs: [
      {
        ru: 'Здесь говорят по-английски.',
        calque: 'Here speak English.',
        en: 'English is spoken here.',
      },
      {
        ru: 'Кофе выращивают в Бразилии.',
        calque: 'Coffee grow in Brazil.',
        en: 'Coffee is grown in Brazil.',
      },
      {
        ru: 'Как пишется это слово?',
        calque: 'How does this word write?',
        en: 'How is this word spelt?',
      },
    ],
    trap: 'wordOrder',
  },
  b1_13: {
    ru: 'В русском страдательность часто передают безличным «они» и порядком слов: «Меня пригласили на свадьбу» — объект впереди, но это не подлежащее. В английском первое слово должно быть подлежащим (<em>I</em>, а не <em>me</em>), и нужен <b>was/were + V3</b>: <em>I was invited.</em> Краткое причастие («мост построен») тоже требует be: <em>The bridge was built in 1890.</em>',
    en: 'Russian often expresses the passive with an impersonal "they" and word order: literally "Me invited to a wedding" — the object comes first but isn\'t the subject. In English the first word must be the subject (<em>I</em>, not <em>me</em>), and you need <b>was/were + past participle</b>: <em>I was invited.</em> A Russian short participle ("bridge built") also needs be: <em>The bridge was built in 1890.</em>',
    pairs: [
      {
        ru: 'Меня пригласили на свадьбу.',
        calque: 'Me invited to a wedding.',
        en: 'I was invited to a wedding.',
      },
      {
        ru: 'Мост построен в 1890 году.',
        calque: 'The bridge built in 1890.',
        en: 'The bridge was built in 1890.',
      },
      {
        ru: 'Мою машину угнали.',
        calque: 'My car stolen.',
        en: 'My car was stolen.',
      },
    ],
    trap: 'toBe',
  },
  b1_14: {
    ru: "Русские «Письмо отправлено», «Рейс отменён» — краткое причастие без глагола, и оно сообщает о результате сейчас. В английском результат в настоящем — это <b>has/have been + V3</b>, и ни одну часть пропустить нельзя: <em>The letter has been sent.</em> «Мне ещё не заплатили» — тоже пассив, с подлежащим <em>I</em>: <em>I haven't been paid yet.</em>",
    en: 'Russian says literally "letter sent", "flight cancelled" — a short participle with no verb, reporting a result now. In English a present result is <b>has/have been + past participle</b>, and no part can be dropped: <em>The letter has been sent.</em> The Russian "to me still not paid" is also a passive, with <em>I</em> as the subject: <em>I haven\'t been paid yet.</em>',
    pairs: [
      {
        ru: 'Письмо уже отправлено.',
        calque: 'The letter already sent.',
        en: 'The letter has already been sent.',
      },
      {
        ru: 'Мой рейс отменили.',
        calque: 'My flight cancelled.',
        en: 'My flight has been cancelled.',
      },
      {
        ru: 'Мне ещё не заплатили.',
        calque: 'Me still not paid.',
        en: "I haven't been paid yet.",
      },
    ],
    trap: 'tenses',
  },
  b1_15: {
    ru: 'В русской косвенной речи время остаётся как в прямой: «Он сказал, что <em>позвонит</em>», «Я думал, что ты <em>спишь</em>». В английском после глагола в прошедшем (said, thought, knew) время обычно <b>сдвигается назад</b>: present → past, will → would. Без сдвига можно, только если сказанное верно и сейчас. Если ситуация осталась в прошлом — <em>He said he would call</em>, а не will.',
    en: 'In Russian reported speech keeps the tense of the original words: literally "He said that he will call", "I thought that you are sleeping". In English, after a past verb (said, thought, knew) the tense usually <b>shifts back</b>: present → past, will → would. You can skip the shift only if it\'s still true now. If the situation is over: <em>He said he would call</em>, not will.',
    pairs: [
      {
        ru: 'Он сказал, что позвонит, но не позвонил.',
        calque: "He said he will call, but he didn't.",
        en: "He said he would call, but he didn't.",
      },
      {
        ru: 'Я думал, что ты спишь.',
        calque: 'I thought you are sleeping.',
        en: 'I thought you were asleep.',
      },
    ],
    trap: 'sequence',
  },
  b1_16: {
    ru: 'В русском косвенный вопрос выглядит так же, как прямой: «Где ты живёшь?» → «Она спросила, где я живу». В английском прямой вопрос требует инверсии и do, а косвенный — <b>нет</b>: порядок как в утверждении (<em>She asked where I lived</em>). Русское «ли» — это <b>if / whether</b>. То же в вежливых вопросах: <em>Can you tell me where the station is?</em>',
    en: "In Russian an indirect question looks just like a direct one. In English a direct question needs inversion and do, but an indirect one <b>doesn't</b>: statement word order (<em>She asked where I lived</em>). The Russian yes/no particle becomes <b>if / whether</b>. The same goes for polite questions: <em>Can you tell me where the station is?</em>",
    pairs: [
      {
        ru: 'Скажите, пожалуйста, где вокзал?',
        calque: 'Can you tell me where is the station?',
        en: 'Can you tell me where the station is?',
      },
      {
        ru: 'Она спросила, где я живу.',
        calque: 'She asked where do I live.',
        en: 'She asked where I lived.',
      },
      {
        ru: 'Он спросил, устала ли я.',
        calque: 'He asked was I tired.',
        en: 'He asked if I was tired.',
      },
    ],
    trap: 'wordOrder',
  },
  b1_17: {
    ru: 'Русское «сказать» одно на все случаи: «сказал», «сказал мне», «скажи правду». В английском два глагола: <b>say</b> — о самих словах (<em>He said that…</em>), <b>tell</b> — кому сказано, и после него сразу человек, без to: <em>He told me that…</em> Плюс устойчивые пары: <em>tell the truth, tell a lie, tell a story</em>. «Расскажи о…» — <em>tell me about</em>.',
    en: 'Russian has one verb for "say / tell": said, said to me, say the truth. English has two: <b>say</b> focuses on the words (<em>He said that…</em>), <b>tell</b> needs the listener right after it, without to: <em>He told me that…</em> Plus fixed pairs: <em>tell the truth, tell a lie, tell a story</em>. "Tell about…" needs a person: <em>tell me about</em>.',
    pairs: [
      {
        ru: 'Он сказал мне, что опоздает.',
        calque: 'He said me that he will be late.',
        en: 'He told me he would be late.',
      },
      {
        ru: 'Скажи мне правду.',
        calque: 'Say me the truth.',
        en: 'Tell me the truth.',
      },
      {
        ru: 'Расскажи о своей семье.',
        calque: 'Tell about your family.',
        en: 'Tell me about your family.',
      },
    ],
    trap: 'collocations',
  },
  b1_18: {
    ru: 'В русском после «закончить», «избегать», «не против», «перестать» всегда инфинитив: «закончил писать». В английском многие глаголы требуют <b>-ing</b>: <em>finish, enjoy, avoid, mind, keep, suggest</em>. Особенно коварен <em>stop</em>: <em>stop smoking</em> — бросить курить, а <em>stop to smoke</em> — остановиться, чтобы покурить. Такие глаголы учите сразу в паре с -ing.',
    en: 'In Russian, verbs like finish, avoid, mind or stop are always followed by an infinitive. In English many verbs need <b>-ing</b>: <em>finish, enjoy, avoid, mind, keep, suggest</em>. <em>stop</em> is especially tricky: <em>stop smoking</em> means quit, while <em>stop to smoke</em> means stop in order to smoke. Learn these verbs together with -ing.',
    pairs: [
      {
        ru: 'Я закончил писать отчёт.',
        calque: 'I finished to write the report.',
        en: 'I finished writing the report.',
      },
      {
        ru: 'Ты не против открыть окно?',
        calque: 'Do you mind to open the window?',
        en: 'Do you mind opening the window?',
      },
      {
        ru: 'Перестань кричать!',
        calque: 'Stop to shout!',
        en: 'Stop shouting!',
      },
    ],
    trap: 'verbPatterns',
  },
  b1_19: {
    ru: 'Самая «русская» ошибка здесь — «хочу, чтобы»: «Я хочу, чтобы ты пришёл» дословно даёт <em>I want that you come</em>. В английском после <b>want, would like, expect, ask, tell</b> вместо придаточного ставится объект + инфинитив: <em>I want you to come.</em> А после <em>decide, hope, plan, agree, refuse</em> — просто <b>to + глагол</b>, без -ing.',
    en: 'The most typical Russian-speaker mistake here comes from the "I want that…" pattern: literally <em>I want that you come</em>. After <b>want, would like, expect, ask, tell</b> English uses object + infinitive instead of a clause: <em>I want you to come.</em> And after <em>decide, hope, plan, agree, refuse</em> it\'s simply <b>to + verb</b>, never -ing.',
    pairs: [
      {
        ru: 'Я хочу, чтобы ты пришёл.',
        calque: 'I want that you come.',
        en: 'I want you to come.',
      },
      {
        ru: 'Он хочет, чтобы мы подождали.',
        calque: 'He wants that we wait.',
        en: 'He wants us to wait.',
      },
      {
        ru: 'Я бы хотел, чтобы ты остался.',
        calque: 'I would like that you stay.',
        en: "I'd like you to stay.",
      },
    ],
    trap: 'verbPatterns',
  },
  b1_20: {
    ru: "Русское «мне нравится» построено наоборот: подлежащее — то, что нравится, а человек стоит в дательном падеже. Отсюда ошибка <em>This song likes me</em>. В английском подлежащее — тот, кому нравится: <em>I like this song.</em> После like / love / hate возможны и -ing, и to, а вот «я бы хотел» (<em>I'd like</em>) — всегда с <b>to</b>: <em>I'd like to go.</em>",
    en: 'The Russian for "I like" is built the other way round: the thing that is liked is the subject, and the person is in the dative ("to me pleases"). Hence <em>This song likes me</em>. In English the person who likes is the subject: <em>I like this song.</em> After like / love / hate both -ing and to are possible, but <em>I\'d like</em> ("I would like") always takes <b>to</b>: <em>I\'d like to go.</em>',
    pairs: [
      {
        ru: 'Мне нравится эта песня.',
        calque: 'This song likes me.',
        en: 'I like this song.',
      },
      {
        ru: 'Я бы хотел сегодня поплавать.',
        calque: 'I would like swimming today.',
        en: "I'd like to go swimming today.",
      },
    ],
    trap: 'verbPatterns',
  },
  b1_21: {
    ru: "По-русски прошлую привычку передают несовершенным видом и словом «раньше»: «Раньше я курил». Дословное <em>Earlier I smoked</em> не передаёт главного — «а теперь нет». Для этого есть <b>used to</b>: <em>I used to smoke.</em> Не путайте с «привык»: <em>I'm used to getting up early</em> — «я привык рано вставать» (сейчас), и после него -ing.",
    en: 'Russian expresses a past habit with the imperfective plus "earlier / before": literally "Earlier I smoked". That misses the key point — "but not any more". English has <b>used to</b> for that: <em>I used to smoke.</em> Don\'t confuse it with "be used to" (be accustomed): <em>I\'m used to getting up early</em> refers to now and takes -ing.',
    pairs: [
      {
        ru: 'Раньше я курил, а теперь нет.',
        calque: 'Earlier I smoked, but now no.',
        en: "I used to smoke, but I don't any more.",
      },
      {
        ru: 'Раньше здесь был парк.',
        calque: 'Earlier here was a park.',
        en: 'There used to be a park here.',
      },
      {
        ru: 'Я привык рано вставать.',
        calque: 'I am used to get up early.',
        en: "I'm used to getting up early.",
      },
    ],
    trap: 'tenses',
  },
  b1_22: {
    ru: 'Русское «который» подходит и для людей, и для вещей, отсюда <em>the man which</em>. В английском для людей — <b>who</b>, для вещей — <b>which</b>, <em>that</em> — для обоих. Вторая ловушка — запятая: по-русски перед «который» она обязательна, а в английском определяющее придаточное запятыми <b>не</b> выделяют: <em>The book that I bought is good.</em> Запятые — только для дополнительной информации.',
    en: 'The Russian relative pronoun works for people and things alike, hence <em>the man which</em>. English uses <b>who</b> for people, <b>which</b> for things, and <em>that</em> for both. The second trap is the comma: Russian always puts one before the relative pronoun, but an English defining clause takes <b>no</b> commas: <em>The book that I bought is good.</em> Commas mark extra, non-essential information.',
    pairs: [
      {
        ru: 'Человек, который звонил, — мой начальник.',
        calque: 'The man, which called, is my boss.',
        en: 'The man who called is my boss.',
      },
      {
        ru: 'Книга, которую я купил, интересная.',
        calque: 'The book, that I bought, is interesting.',
        en: 'The book that I bought is interesting.',
      },
    ],
    trap: 'wordOrder',
  },
  b1_23: {
    ru: 'По-русски «Хотя шёл дождь, но мы пошли гулять» звучит нормально, а в английском <em>although</em> и <em>but</em> вместе не ставят — нужен <b>один</b> союз. «Несмотря на» тянет за собой лишний предлог: правильно <b>despite</b> или <b>in spite of</b>, но не <em>despite of</em>. После despite — существительное или -ing, а целое предложение — после <em>although</em>.',
    en: 'In Russian "although it was raining, but we went" sounds fine, but English never uses <em>although</em> and <em>but</em> together — use <b>one</b> conjunction. The Russian "despite on" pulls in an extra preposition: it\'s <b>despite</b> or <b>in spite of</b>, never <em>despite of</em>. After despite comes a noun or -ing; a full clause follows <em>although</em>.',
    pairs: [
      {
        ru: 'Хотя шёл дождь, мы пошли гулять.',
        calque: 'Although it was raining, but we went for a walk.',
        en: 'Although it was raining, we went for a walk.',
      },
      {
        ru: 'Несмотря на дождь, мы пошли.',
        calque: 'Despite of the rain, we went.',
        en: 'Despite the rain, we went.',
      },
      {
        ru: 'Несмотря на то что он устал, он продолжал работать.',
        calque: 'Despite he was tired, he continued to work.',
        en: 'Although he was tired, he kept working.',
      },
    ],
    trap: 'prepositions',
  },
  b1_24: {
    ru: "Русское «буду + инфинитив» («буду работать») так и хочется перевести как <em>will be work</em>. Но «буду» здесь — не be, а просто знак будущего. Если действие будет <b>в процессе</b> в определённый момент, нужно <b>will be + -ing</b>: <em>This time tomorrow I'll be flying to Rome.</em> Если момента нет и это просто будущее, хватит <em>will + глагол</em>.",
    en: 'The Russian compound future ("will-be + infinitive") tempts learners into <em>will be work</em>. But that Russian auxiliary is just a future marker, not be. If an action will be <b>in progress</b> at a given moment, you need <b>will be + -ing</b>: <em>This time tomorrow I\'ll be flying to Rome.</em> For a plain future with no such moment, <em>will + verb</em> is enough.',
    pairs: [
      {
        ru: 'Завтра в это время я буду лететь в Рим.',
        calque: 'Tomorrow in this time I will be fly to Rome.',
        en: "This time tomorrow I'll be flying to Rome.",
      },
      {
        ru: 'Не звони в восемь — я буду работать.',
        calque: "Don't call at eight — I will be work.",
        en: "Don't call at eight — I'll be working.",
      },
      {
        ru: 'Я буду учить английский каждый день.',
        calque: 'I will be learn English every day.',
        en: "I'll study English every day.",
      },
    ],
    trap: 'tenses',
  },
  b1_25: {
    ru: "По-русски «к пятнице я закончу» — обычное будущее совершенного вида: завершённость видна по самому глаголу. У английского глагола вида нет, поэтому «будет сделано к моменту» чаще всего передаёт <b>will have + V3</b>: <em>By Friday I'll have finished.</em> Русское «к» — это <b>by</b>, а не <em>to</em> или <em>until</em>. А после <em>by the time</em> — настоящее время, не will.",
    en: 'In Russian "by Friday I\'ll finish" is an ordinary perfective future — completion is built into the verb. English verbs have no aspect, so "done by a certain moment" is usually <b>will have + past participle</b>: <em>By Friday I\'ll have finished.</em> The Russian preposition meaning "by" here is <b>by</b>, not <em>to</em> or <em>until</em>. And after <em>by the time</em> use the present, not will.',
    pairs: [
      {
        ru: 'К пятнице я закончу отчёт.',
        calque: 'To Friday I will finish the report.',
        en: "I'll have finished the report by Friday.",
      },
      {
        ru: 'К тому времени, как ты придёшь, я приготовлю ужин.',
        calque: 'To the time you will come, I will cook dinner.',
        en: "By the time you come, I'll have cooked dinner.",
      },
    ],
    trap: 'tenses',
  },
  b1_26: {
    ru: 'Русское «чтобы» кажется отдельным словом, которое нужно перевести, и его передают как <em>for</em> или <em>that</em>. Но цель в английском — просто <b>to + глагол</b>: <em>I came to help</em> (а <em>I came for help</em> — «пришёл за помощью»). Если у второй части своё подлежащее — <b>so that</b> + can/could: <em>Speak louder so that everyone can hear.</em> Отрицание: <em>so as not to / in order not to</em>.',
    en: 'The Russian purpose conjunction looks like a word that needs translating, so learners render it as <em>for</em> or <em>that</em>. But English purpose is simply <b>to + verb</b>: <em>I came to help</em> (<em>I came for help</em> means you came to get help). If the second part has its own subject, use <b>so that</b> + can/could: <em>Speak louder so that everyone can hear.</em> Negative: <em>so as not to / in order not to</em>.',
    pairs: [
      {
        ru: 'Я учу английский, чтобы найти работу.',
        calque: 'I learn English for find a job.',
        en: "I'm learning English to find a job.",
      },
      {
        ru: 'Говори громче, чтобы все слышали.',
        calque: 'Speak louder that everybody hear.',
        en: 'Speak louder so that everyone can hear.',
      },
      {
        ru: 'Я пришёл, чтобы помочь.',
        calque: 'I came for helping.',
        en: 'I came to help.',
      },
    ],
    trap: 'verbPatterns',
  },
  b1_27: {
    ru: 'Русский меняет значение глагола приставкой: включить, выключить, отложить, выяснить. Английский — частицей после глагола: <em>turn on, turn off, put off, find out</em>. Перевод «по словарю» даёт смешное <em>include the TV</em> («включить») или <em>threw smoking</em> («бросил курить»). Учите фразовый глагол как одно слово: <b>глагол + частица = новое значение</b>.',
    en: 'Russian changes a verb\'s meaning with a prefix; English does it with a particle after the verb: <em>turn on, turn off, put off, find out</em>. Translating word by word from a dictionary gives funny results like <em>include the TV</em> (the Russian for "switch on" also means "include") or <em>threw smoking</em> ("quit" literally means "threw"). Learn a phrasal verb as one word: <b>verb + particle = new meaning</b>.',
    pairs: [
      {
        ru: 'Включи телевизор.',
        calque: 'Include the TV.',
        en: 'Turn on the TV.',
      },
      {
        ru: 'Я бросил курить.',
        calque: 'I threw smoking.',
        en: 'I gave up smoking.',
      },
      {
        ru: 'Посмотри это слово в словаре.',
        calque: 'Look this word in the dictionary.',
        en: 'Look this word up in the dictionary.',
      },
    ],
    trap: 'phrasal',
  },
};
