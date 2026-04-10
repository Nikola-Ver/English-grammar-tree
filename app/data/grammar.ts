export type LinkType = 'yt' | 'ru' | 'en';

export interface RuleLink {
  label: string;
  url: string;
  type: LinkType;
}

export interface Markers {
  tags: string[];
  note?: string;
}

export interface Rule {
  id: string;
  text: string;
  note?: string;
  exp?: string;
  ex?: [string, string?][];
  exc?: string;
  tip?: string;
  links?: RuleLink[];
  mistakes?: string[];
  markers?: Markers;
  unitUrl?: string;
}

export interface Category {
  name: string;
  rules: Rule[];
}

export interface Level {
  id: string;
  name: string;
  sub: string;
  color: string;
  colorBg: string;
  categories: Category[];
}

export const DATA: Level[] = [
  {
    id: 'A1',
    name: 'A1 — Начальный',
    sub: 'Beginner · 2–3 месяца',
    color: 'var(--a1)',
    colorBg: 'var(--a1bg)',
    categories: [
      {
        name: 'Глагол to be',
        rules: [
          {
            id: 'a1_01',
            text: 'am / is / are — формы глагола to be',
            note: 'I am, he is, they are',
            exp: '<strong>to be</strong> — самый важный глагол английского языка, аналог русского «быть/являться».<br><br>Три формы: <em>am</em> — только с <em>I</em>; <em>is</em> — с he, she, it; <em>are</em> — с you, we, they.<br><br>⚠️ Важное отличие от русского: в английском глагол <strong>нельзя пропустить</strong>. По-русски говорим «Я студент», а по-английски обязательно: <em>I <u>am</u> a student</em>.',
            ex: [
              ['I am hungry.', 'Я голоден.'],
              ['She is a doctor.', 'Она врач.'],
              ['They are ready.', 'Они готовы.'],
              ['It is cold today.', 'Сегодня холодно.'],
            ],
            exc: `Сокращённые формы: I'm, you're, he's, she's, it's, we're, they're. В кратких ответах сокращение запрещено: <em>Yes, I am.</em> (не <s>Yes, I'm</s>)`,
            links: [
              {
                label: 'OK English: глагол to be (видео на рус.)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Skyeng: упражнения',
                url: 'https://skyeng.ru/exercises/to-be-present-simple/',
                type: 'ru',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/verb-be.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: глагол to be',
                url: 'https://www.native-english.ru/grammar/verb-to-be',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She be a teacher</s> → She <em>is</em> a teacher',
              '<s>I is hungry</s> → I <em>am</em> hungry',
              'Пропуск to be: <s>I student</s> → I <em>am</em> a student',
            ],
          },
          {
            id: 'a1_02',
            text: "Отрицание: am not / isn't / aren't",
            note: "I'm not tired. He isn't here. They aren't ready.",
            exp: `Отрицание строится добавлением <em>not</em>: <em>am not, is not, are not</em>.<br>Краткие формы: <em>isn't</em> (= is not), <em>aren't</em> (= are not). Только <em>am not</em> не сокращается в <em>amn't</em> — исключение!`,
            ex: [
              ["I'm not a student.", 'Я не студент.'],
              ["He isn't tired.", 'Он не устал.'],
              ["We aren't ready.", 'Мы не готовы.'],
            ],
            links: [
              {
                label: 'Упражнения на отрицание',
                url: 'https://www.perfect-english-grammar.com/verb-be-exercise-1.html',
                type: 'en',
              },
              {
                label: 'englex.ru: объяснение',
                url: 'https://englex.ru/verb-to-be-in-english/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: глагол to be',
                url: 'https://www.native-english.ru/grammar/verb-to-be',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I amn't tired</s> → I'm <em>not</em> tired (amn't не существует!)",
              "<s>He don't tired</s> → He <em>isn't</em> tired",
              "<s>She is not = shes not</s> — только <em>she's not</em> или <em>she isn't</em>",
            ],
          },
          {
            id: 'a1_03',
            text: 'Вопросы с to be: Am I? / Is she? / Are they?',
            note: 'Is she a teacher? Are you cold? Am I late?',
            exp: `В вопросах глагол <em>to be</em> выносится <strong>перед подлежащим</strong>: <em>She is → Is she?</em><br><br>Специальные вопросы: вопросительное слово + to be + подлежащее: <em>Where is he? What is this?</em><br><br>Краткие ответы: <em>Yes, I am. / No, she isn't.</em>`,
            ex: [
              ['Are you a student?', 'Ты студент?'],
              ['Is it expensive?', 'Это дорого?'],
              ['Where are they?', 'Где они?'],
            ],
            links: [
              {
                label: 'Упражнения',
                url: 'https://www.perfect-english-grammar.com/verb-be-exercise-2.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: глагол to be',
                url: 'https://www.native-english.ru/grammar/verb-to-be',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Is you cold?</s> → <em>Are</em> you cold?',
              '<s>She is late?</s> — вопрос без инверсии: <em>Is she late?</em>',
              '<s>Where he is?</s> → Where <em>is he?</em>',
            ],
          },
          {
            id: 'a1_04',
            text: "Краткие ответы: Yes, I am. / No, she isn't.",
            note: 'Только полная форма — нельзя: "Yes, I\'m"',
            exp: `В кратких ответах местоимение + <em>to be</em>. <strong>Нельзя сокращать</strong> форму глагола в утвердительном ответе.<br><em>Are you tired? — Yes, I am.</em> ✓ &nbsp;&nbsp; <em>Yes, I'm.</em> ✗`,
            ex: [
              ['Is she ready? — Yes, she is.', 'Она готова? — Да.'],
              ["Are they your friends? — No, they aren't.", 'Они твои друзья? — Нет.'],
            ],
            links: [
              {
                label: 'British Council: to be exercises',
                url: 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/the-verb-be',
                type: 'en',
              },
              {
                label: 'native-english.ru: глагол to be',
                url: 'https://www.native-english.ru/grammar/verb-to-be',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>Yes, I'm</s> → Yes, I <em>am</em> (нельзя сокращать в утвердительном ответе)",
              "<s>No, she is'nt</s> → No, she <em>isn't</em>",
            ],
          },
        ],
      },
      {
        name: 'Артикли',
        rules: [
          {
            id: 'a1_05',
            text: 'Артикль a / an — неопределённый',
            note: 'a dog, an apple, an hour, a university',
            exp: '<em>a</em> и <em>an</em> — неопределённый артикль, ставится перед <strong>впервые упоминаемым</strong> предметом в единственном числе.<br><br>Выбор зависит от <strong>звука</strong>, а не буквы:<br>• <em>a</em> — перед согласным звуком: <em>a book, a car, a university</em> [ju...]<br>• <em>an</em> — перед гласным звуком: <em>an apple, an hour</em> [aʊ...], <em>an honest man</em>',
            ex: [
              ['I saw a cat in the garden.', 'Я увидел кошку в саду.'],
              ['She is an engineer.', 'Она инженер.'],
              ['It took an hour.', 'Это заняло час.'],
            ],
            exc: '<em>a university, a European</em> — хотя начинаются на гласную букву, начальный звук [j], поэтому <em>a</em>. <em>an hour, an honest</em> — h немая, начальный звук гласный.',
            links: [
              {
                label: 'Perfect English Grammar: articles',
                url: 'https://www.perfect-english-grammar.com/articles.html',
                type: 'en',
              },
              {
                label: 'Skyeng: артикли упражнения',
                url: 'https://skyeng.ru/exercises/articles/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: неопределённый артикль',
                url: 'https://www.native-english.ru/grammar/indefinite-article',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>an university</s> → <em>a</em> university (звук [j])',
              '<s>a apple</s> → <em>an</em> apple',
              '<s>a honest man</s> → <em>an</em> honest man (h немая)',
            ],
          },
          {
            id: 'a1_06',
            text: 'Артикль the — определённый',
            note: 'the sun, the door, the book on the table',
            exp: '<em>the</em> используется когда говорящий и слушающий <strong>знают</strong>, о чём речь.<br><br>Когда ставим <em>the</em>:<br>1. Предмет уже упоминался: <em>I saw a cat. The cat was black.</em><br>2. Единственный в своём роде: <em>the sun, the moon, the earth</em><br>3. Понятно из контекста: <em>Close the window, please.</em><br>4. Превосходная степень: <em>the best, the biggest</em>',
            ex: [
              ['The film we saw was amazing.', 'Фильм, который мы смотрели, был потрясающим.'],
              ['Could you pass the salt?', 'Не мог бы ты передать соль?'],
            ],
            exc: 'Произношение: <em>the</em> [ðə] перед согласными, [ði] перед гласными. В устной речи часто [ðɪ] для эмфазы.',
            links: [
              {
                label: 'Объяснение the',
                url: 'https://www.perfect-english-grammar.com/the.html',
                type: 'en',
              },
              { label: 'engblog.ru: артикли', url: 'https://engblog.ru/articles', type: 'ru' },
              {
                label: 'native-english.ru: определённый артикль',
                url: 'https://www.native-english.ru/grammar/definite-article',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I like the music</s> → I like music (общий смысл — без артикля)',
              '<s>The life is short</s> → Life is short',
              '<s>He is the doctor</s> → He is <em>a</em> doctor (первое упоминание)',
            ],
          },
          {
            id: 'a1_07',
            text: 'Нулевой артикль — когда артикль не нужен',
            note: 'I like music. She plays tennis. He is from Russia.',
            exp: 'Артикль <strong>не ставится</strong> перед:<br>• Именами собственными: <em>John, London, Russia</em><br>• Языками и национальностями: <em>English, Russian</em><br>• Видами спорта и играми: <em>football, chess</em><br>• Едой/напитками в общем смысле: <em>I love coffee</em><br>• Абстрактными понятиями в общем: <em>Life is short. Love is blind.</em><br>• Множественным числом в общем смысле: <em>Dogs are friendly.</em>',
            ex: [
              ['She speaks Spanish.', 'Она говорит по-испански.'],
              ['He plays basketball every day.', 'Он играет в баскетбол каждый день.'],
            ],
            links: [
              {
                label: 'Zero article',
                url: 'https://www.perfect-english-grammar.com/zero-article.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: нулевой артикль',
                url: 'https://www.native-english.ru/grammar/zero-article',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I play the tennis</s> → I play tennis',
              '<s>She speaks the Spanish</s> → She speaks Spanish',
              '<s>the Russia</s> → Russia (страны без артикля, кроме The USA, The UK)',
            ],
          },
        ],
      },
      {
        name: 'Present Simple',
        rules: [
          {
            id: 'a1_08',
            text: 'Present Simple — утвердительные предложения',
            note: 'I work. He works. She goes. It runs.',
            exp: '<strong>Present Simple</strong> используется для: привычек и регулярных действий, фактов и общих истин, расписаний.<br><br>Формула: I/you/we/they + инфинитив; he/she/it + инфинитив+<em>s/es</em><br><br>Правила написания окончания <em>-s</em>/-<em>es</em>:<br>• Большинство глаголов: + <em>s</em> → <em>works, plays</em><br>• Оканчиваются на -o, -ch, -sh, -s, -ss, -x: + <em>es</em> → <em>goes, watches, washes</em><br>• Оканчиваются на согласную + -y: -y → <em>ies</em> → <em>studies, tries</em>',
            ex: [
              ['I drink coffee every morning.', 'Я пью кофе каждое утро.'],
              ['She works in a hospital.', 'Она работает в больнице.'],
              ['The Earth goes round the Sun.', 'Земля вращается вокруг Солнца.'],
            ],
            exc: 'Исключения: <em>have → has, be → is, do → does, go → goes</em>',
            tip: 'Маркеры времени: always, usually, often, sometimes, rarely, never, every day/week.',
            links: [
              {
                label: 'OK English: Present Simple (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Skyeng: упражнения',
                url: 'https://skyeng.ru/exercises/present-simple/',
                type: 'ru',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/present-simple.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Simple',
                url: 'https://www.native-english.ru/grammar/present-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She work</s> → She <em>works</em> (забыли -s для 3 лица)',
              '<s>He go</s> → He <em>goes</em> (go → goes)',
              '<s>She studys</s> → She <em>studies</em> (согласная + y → ies)',
            ],
            markers: {
              tags: [
                'always',
                'usually',
                'often',
                'sometimes',
                'occasionally',
                'rarely',
                'seldom',
                'never',
                'every day',
                'every week',
                'every month',
                'every year',
                'every morning',
                'every evening',
                'on Mondays',
                'once a week',
                'twice a month',
                'in general',
                'as a rule',
                'normally',
                'regularly',
              ],
              note: 'Маркеры частотности стоят перед основным глаголом, но после to be.',
            },
          },
          {
            id: 'a1_09',
            text: "Present Simple — отрицание: don't / doesn't",
            note: "I don't like. He doesn't like. (не: he don't)",
            exp: `Отрицание строится с помощью вспомогательного глагола <em>do/does</em> + <em>not</em>:<br>• I/you/we/they + <em>don't</em> + инфинитив<br>• he/she/it + <em>doesn't</em> + инфинитив<br><br>⚠️ После <em>doesn't</em> основной глагол <strong>без -s</strong>! <em>She doesn't like</em> (не <s>likes</s>).`,
            ex: [
              ["I don't eat meat.", 'Я не ем мясо.'],
              ["He doesn't speak French.", 'Он не говорит по-французски.'],
              ["They don't work here.", 'Они здесь не работают.'],
            ],
            links: [
              {
                label: 'Упражнения на отрицание',
                url: 'https://www.perfect-english-grammar.com/present-simple-exercise-3.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Simple',
                url: 'https://www.native-english.ru/grammar/present-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>She doesn't likes</s> → She doesn't <em>like</em> (после doesn't — базовая форма!)",
              "<s>He don't work</s> → He <em>doesn't</em> work",
              "<s>I not like</s> → I <em>don't</em> like",
            ],
            markers: {
              tags: [
                'always',
                'usually',
                'often',
                'sometimes',
                'rarely',
                'never',
                'every day',
                'normally',
                'generally',
                'as a rule',
              ],
              note: 'Те же маркеры, что и у утвердительных предложений.',
            },
          },
          {
            id: 'a1_10',
            text: 'Present Simple — вопросы: Do you? / Does she?',
            note: 'Do you like pizza? Does he work here? Where do they live?',
            exp: 'Вопросы: <em>Do/Does</em> + подлежащее + инфинитив?<br>• I/you/we/they: <em>Do you...?</em><br>• he/she/it: <em>Does she...?</em><br><br>Специальные вопросы: вопросительное слово + do/does + подлежащее + инфинитив:<br><em>Where does she live? What do they do?</em><br><br>⚠️ Исключение: вопрос «Кто?» без <em>do</em>: <em>Who likes ice cream?</em>',
            ex: [
              ['Do you speak Russian?', 'Ты говоришь по-русски?'],
              ['Does she live nearby?', 'Она живёт рядом?'],
              ['Where do you work?', 'Где ты работаешь?'],
            ],
            links: [
              {
                label: 'Вопросы Present Simple',
                url: 'https://www.perfect-english-grammar.com/present-simple-exercise-5.html',
                type: 'en',
              },
              {
                label: 'engfairy.com упражнения',
                url: 'https://engfairy.com/present-simple-tense-uprazhneniya/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: Present Simple',
                url: 'https://www.native-english.ru/grammar/present-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Does she likes?</s> → Does she <em>like?</em>',
              '<s>Do he work?</s> → <em>Does</em> he work?',
              '<s>Where she lives?</s> → Where does she live?',
            ],
            markers: {
              tags: [
                'always',
                'usually',
                'often',
                'sometimes',
                'never',
                'every day',
                'every week',
                'how often',
                'how many times',
              ],
              note: 'В вопросах маркеры идут после подлежащего.',
            },
          },
          {
            id: 'a1_11',
            text: 'Stative verbs — глаголы, не употребляемые в Continuous',
            note: 'I know, not: I am knowing. I love, not: I am loving.',
            exp: 'Некоторые глаголы описывают <strong>состояние</strong>, а не действие — они не используются в Continuous временах.<br><br>Основные группы:<br>• Мнения: <em>know, believe, think, understand, remember, forget</em><br>• Чувства: <em>love, hate, like, want, need, prefer</em><br>• Восприятие: <em>see, hear, smell, taste, look</em><br>• Бытие: <em>be, exist, belong, contain, seem, appear</em>',
            ex: [
              ['I understand you. (не: I am understanding)', 'Я тебя понимаю.'],
              ['She loves chocolate. (не: is loving)', 'Она любит шоколад.'],
            ],
            exc: "<em>think/have/see/taste</em> могут использоваться в Continuous, но со другим значением: <em>I think</em> (мнение) vs <em>I'm thinking</em> (размышляю прямо сейчас).",
            links: [
              {
                label: 'Stative verbs',
                url: 'https://www.perfect-english-grammar.com/stative-verbs.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: классификация глаголов',
                url: 'https://www.native-english.ru/grammar/english-verbs',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I am knowing</s> → I <em>know</em>',
              '<s>She is loving him</s> → She <em>loves</em> him',
              '<s>He is wanting a coffee</s> → He <em>wants</em> a coffee',
            ],
          },
        ],
      },
      {
        name: 'Местоимения',
        rules: [
          {
            id: 'a1_12',
            text: 'Личные местоимения: I, you, he, she, it, we, they',
            note: 'Всегда нужно явное подлежащее — нельзя пропустить I',
            exp: 'В отличие от русского, в английском <strong>подлежащее всегда обязательно</strong>.<br>По-русски: «Иду домой». По-английски: <em>I am going home.</em><br><br>Объектные формы (после глагола или предлога): <em>me, you, him, her, it, us, them</em>.',
            ex: [
              ['She is a teacher.', 'Она учитель.'],
              ['Tell him the truth.', 'Скажи ему правду.'],
              ['Can you help me?', 'Можешь мне помочь?'],
            ],
            links: [
              {
                label: 'British Council: pronouns',
                url: 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/subject-and-object-pronouns',
                type: 'en',
              },
              {
                label: 'native-english.ru: личные местоимения',
                url: 'https://www.native-english.ru/grammar/personal-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Is cold today</s> → <em>It</em> is cold (нельзя опустить подлежащее)',
              '<s>Me like pizza</s> → <em>I</em> like pizza',
              '<s>She told to him</s> → She told <em>him</em>',
            ],
          },
          {
            id: 'a1_13',
            text: 'Притяжательные прилагательные: my, your, his, her, its, our, their',
            note: 'my book, her car, their house — не изменяются по числу',
            exp: `Притяжательные прилагательные показывают принадлежность и стоят <strong>перед существительным</strong>.<br>Важно: <em>its</em> (без апострофа) = принадлежность; <em>it's</em> (с апострофом) = it is.<br><br>Не изменяются по роду и числу: <em>my friend / my friends</em> — одинаково.`,
            ex: [
              ['This is my phone.', 'Это мой телефон.'],
              ['Their dog is cute.', 'Их собака милая.'],
              ['The cat hurt its paw.', 'Кошка поранила лапу.'],
            ],
            links: [
              {
                label: 'Упражнения',
                url: 'https://www.englisch-hilfen.de/en/exercises/pronouns/possessive_pronouns.htm',
                type: 'en',
              },
              {
                label: 'native-english.ru: притяжательные местоимения',
                url: 'https://www.native-english.ru/grammar/possessive-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>Its a big house</s> → <em>It's</em> a big house (it's = it is)",
              "<s>The cat hurt it's paw</s> → hurt <em>its</em> paw (its = принадлежность)",
              '<s>Their friends is nice</s> → Their friends <em>are</em> nice',
            ],
          },
          {
            id: 'a1_14',
            text: 'Множественное число существительных',
            note: 'cats, boxes, knives, children, men, sheep',
            exp: 'Основное правило: добавить <em>-s</em>.<br><br>Особые случаи:<br>• -s, -ss, -sh, -ch, -x, -o: + <em>es</em> → <em>boxes, watches, tomatoes</em><br>• гласная + -y: + <em>s</em> → <em>boys, days</em><br>• согласная + -y: -y → <em>ies</em> → <em>cities, babies</em><br>• -f/-fe: → <em>ves</em> → <em>knives, leaves, wives</em><br><br>Неправильные: <em>child→children, man→men, woman→women, tooth→teeth, foot→feet, mouse→mice, person→people, fish→fish, sheep→sheep</em>',
            ex: [
              ['one bus → two buses', 'один автобус → два автобуса'],
              ['one child → many children', 'один ребёнок → много детей'],
            ],
            links: [
              {
                label: 'Plurals rules',
                url: 'https://www.perfect-english-grammar.com/plurals.html',
                type: 'en',
              },
              { label: 'Skyeng упражнения', url: 'https://skyeng.ru/exercises/nouns/', type: 'ru' },
              {
                label: 'native-english.ru: множественное число',
                url: 'https://www.native-english.ru/grammar/english-nouns-plural',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>two childs</s> → two <em>children</em>',
              '<s>three mans</s> → three <em>men</em>',
              '<s>boxs</s> → <em>boxes</em> (добавляем -es)',
            ],
          },
          {
            id: 'a1_15',
            text: 'This / that / these / those',
            note: 'this/these — рядом; that/those — далеко',
            exp: '<em>this</em> (этот) — единственное число + рядом<br><em>these</em> (эти) — множественное число + рядом<br><em>that</em> (тот) — единственное число + далеко или уже известное<br><em>those</em> (те) — множественное число + далеко<br><br>Также используются о времени: <em>this week</em> (эта неделя), <em>that year</em> (тот год).',
            ex: [
              ['This is my bag.', 'Это моя сумка.'],
              ['Those shoes are expensive.', 'Те туфли дорогие.'],
              ['What is that?', 'Что это такое?'],
            ],
            links: [
              {
                label: 'British Council: this/that',
                url: 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/this-these-that-those',
                type: 'en',
              },
              {
                label: 'native-english.ru: указательные местоимения',
                url: 'https://www.native-english.ru/grammar/demonstrative-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>These is my pen</s> → <em>This</em> is my pen',
              '<s>Those are that books</s> → Those are <em>those/the</em> books',
              '<s>That book over here</s> — <em>this</em> (рядом), <em>that</em> (далеко)',
            ],
          },
        ],
      },
      {
        name: 'Базовые структуры',
        rules: [
          {
            id: 'a1_16',
            text: 'There is / there are — существование',
            note: 'There is a park. There are five rooms.',
            exp: `Конструкция <em>there is/are</em> означает «существует/существуют», «есть».<br>• <em>There is</em> + существительное в ед. числе<br>• <em>There are</em> + существительное во мн. числе<br><br>Отрицание: <em>There isn't / There aren't</em><br>Вопрос: <em>Is there...? / Are there...?</em><br><br>⚠️ Не путать с <em>it is</em>! <em>There is a book on the table</em> (книга существует там) vs <em>It is a good book</em> (характеристика).`,
            ex: [
              ['There is a cinema near here.', 'Рядом есть кинотеатр.'],
              ['Are there any shops nearby? — Yes, there are.', 'Есть ли магазины рядом? — Да.'],
            ],
            links: [
              {
                label: 'Perfect English Grammar: there is/are',
                url: 'https://www.perfect-english-grammar.com/there-is-there-are.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: существительные',
                url: 'https://www.native-english.ru/grammar/english-nouns',
                type: 'ru',
              },
            ],
          },
          {
            id: 'a1_17',
            text: 'Предлоги места: in, on, at, under, next to, behind, between',
            note: 'in the box, on the table, at the station',
            exp: 'Три главных предлога:<br>• <em>in</em> = внутри чего-либо: <em>in the box, in the city, in bed</em><br>• <em>on</em> = на поверхности: <em>on the table, on the wall, on the left</em><br>• <em>at</em> = в конкретной точке: <em>at the station, at home, at school</em><br><br>Другие: <em>under</em> (под), <em>next to/beside</em> (рядом), <em>behind</em> (за), <em>in front of</em> (перед), <em>between</em> (между), <em>opposite</em> (напротив)',
            ex: [
              ['The keys are on the table.', 'Ключи на столе.'],
              ['She is in the kitchen.', 'Она на кухне.'],
              ['Meet me at the entrance.', 'Встретимся у входа.'],
            ],
            links: [
              {
                label: 'Предлоги места',
                url: 'https://www.perfect-english-grammar.com/prepositions-of-place.html',
                type: 'en',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/prepositions/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: предлоги',
                url: 'https://www.native-english.ru/grammar/english-prepositions',
                type: 'ru',
              },
            ],
          },
          {
            id: 'a1_18',
            text: 'Повелительное наклонение',
            note: "Open your books. Don't run. Please sit down.",
            exp: `Повелительное наклонение = базовая форма глагола без подлежащего.<br>Отрицание: <em>Don't + инфинитив</em><br><em>Please</em> делает просьбу вежливее (в начале или конце).<br><br>Для включения говорящего: <em>Let's + инфинитив</em> → <em>Let's go! Let's eat!</em>`,
            ex: [
              ['Turn left at the crossroads.', 'Поверни налево на перекрёстке.'],
              ["Don't touch that!", 'Не трогай это!'],
              ["Let's have a break.", 'Давайте сделаем перерыв.'],
            ],
            links: [
              {
                label: 'Imperative',
                url: 'https://www.perfect-english-grammar.com/imperative.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: повелительное наклонение',
                url: 'https://www.native-english.ru/grammar/imperative-mood',
                type: 'ru',
              },
            ],
          },
          {
            id: 'a1_19',
            text: "can / can't — умение и разрешение",
            note: "I can swim. She can't drive. Can I help you?",
            exp: '<em>can</em> — модальный глагол, выражает:<br>1. Умение/способность: <em>I can play the guitar</em><br>2. Возможность: <em>It can be dangerous</em><br>3. Разрешение (разговорный): <em>Can I use your phone?</em><br><br>⚠️ <em>can</em> никогда не изменяется: <em>he can</em> (не <s>he cans</s>). После него — инфинитив без <em>to</em>.',
            ex: [
              ['I can speak three languages.', 'Я говорю на трёх языках.'],
              ["She can't come today.", 'Она не может прийти сегодня.'],
              ['Can you help me, please?', 'Не могли бы вы мне помочь?'],
            ],
            links: [
              {
                label: 'Can / could',
                url: 'https://www.perfect-english-grammar.com/can.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: can/could',
                url: 'https://www.native-english.ru/grammar/modal-verb-can',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Can you to help me?</s> → Can you <em>help</em> (без to)',
              '<s>She cans do it</s> → She <em>can</em> do it (can не изменяется)',
              '<s>I can to speak French</s> → I can speak French',
            ],
          },
          {
            id: 'a1_20',
            text: 'Вопросительные слова: what, where, who, when, how, why, which, whose, how much/many',
            note: 'What is this? Where do you live? How old are you?',
            exp: 'Вопросительные слова стоят в <strong>начале</strong> вопроса, после них — вспомогательный глагол перед подлежащим.<br><br>• <em>what</em> = что/какой<br>• <em>where</em> = где/куда<br>• <em>who</em> = кто (вопрос без do: <em>Who lives here?</em>)<br>• <em>when</em> = когда<br>• <em>why</em> = почему<br>• <em>how</em> = как; <em>how much</em> = сколько (несчисл.); <em>how many</em> = сколько (счисл.); <em>how old</em> = сколько лет; <em>how long</em> = как долго',
            ex: [
              ['Where does she work?', 'Где она работает?'],
              ['What time is it?', 'Который час?'],
              ['How many brothers do you have?', 'Сколько у тебя братьев?'],
            ],
            links: [
              {
                label: 'Question words',
                url: 'https://www.perfect-english-grammar.com/question-words.html',
                type: 'en',
              },
              {
                label: 'englex.ru вопросы',
                url: 'https://englex.ru/question-words-in-english/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: вопросительные местоимения',
                url: 'https://www.native-english.ru/grammar/interrogative-pronouns',
                type: 'ru',
              },
            ],
          },
        ],
      },
      {
        name: 'Числа и числительные',
        rules: [
          {
            id: 'a1_21',
            text: 'Числительные количественные: 1–1000',
            note: 'one, two, three... twenty-one, a hundred, a thousand',
            exp: 'Числительные 1–12: особые слова (one, two, three... twelve).<br>13–19: + <em>-teen</em> (thirteen, fourteen... nineteen; исключения: thirteen, fifteen, eighteen).<br>Десятки: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety.<br>Составные: 21 = <em>twenty-one</em> (через дефис).<br><br>100 = <em>a/one hundred</em>; 1000 = <em>a/one thousand</em>.<br>После hundred/thousand — <em>and</em> (BrE): <em>two hundred and fifty</em>.',
            ex: [
              ['She is twenty-three years old.', 'Ей двадцать три года.'],
              ['The ticket costs four hundred pounds.', 'Билет стоит четыреста фунтов.'],
            ],
            links: [
              {
                label: 'Numbers',
                url: 'https://www.perfect-english-grammar.com/numbers.html',
                type: 'en',
              },
              { label: 'Числительные RU', url: 'https://skyeng.ru/exercises/numbers/', type: 'ru' },
              {
                label: 'native-english.ru: количественные числительные',
                url: 'https://www.native-english.ru/grammar/cardinal-numerals',
                type: 'ru',
              },
            ],
          },
          {
            id: 'a1_22',
            text: 'Порядковые числительные: first, second, third...',
            note: 'the first, the second, the third, the fourth... the twenty-first',
            exp: 'Порядковые числительные образуются добавлением <em>-th</em>: <em>fourth, fifth, sixth...</em><br>Исключения: <em>first (1st), second (2nd), third (3rd), fifth (5th), eighth (8th), ninth (9th), twelfth (12th)</em>.<br>Всегда употребляются с артиклем <em>the</em>: <em>the first day, the third floor</em>.<br><br>Дроби: ½ = <em>a half</em>, ⅓ = <em>a third</em>, ¼ = <em>a quarter</em>.',
            ex: [
              ['My office is on the third floor.', 'Мой офис на третьем этаже.'],
              ['Today is the first of March.', 'Сегодня первое марта.'],
            ],
            links: [
              {
                label: 'Ordinal numbers',
                url: 'https://www.perfect-english-grammar.com/ordinal-numbers.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: порядковые числительные',
                url: 'https://www.native-english.ru/grammar/ordinal-numerals',
                type: 'ru',
              },
            ],
          },
        ],
      },
      {
        name: 'Притяжательный падеж',
        rules: [
          {
            id: 'a1_23',
            text: "Притяжательный падеж: 's и s'",
            note: "John's car, my sister's friend, the children's toys, the teachers' room",
            exp: `В английском принадлежность выражается апострофом + <em>s</em>:<br>• Единственное число: <em>Tom's book</em>, <em>the dog's tail</em><br>• Множественное на -s: только апостроф: <em>the teachers' room, my parents' house</em><br>• Неправильное множественное: <em>'s</em>: <em>the children's playground, men's clothes</em><br>• Имена на -s: <em>James's / James'</em> — оба варианта верны`,
            ex: [
              ["This is Anna's laptop.", 'Это ноутбук Анны.'],
              ["The children's toys are in the box.", 'Игрушки детей в ящике.'],
            ],
            links: [
              {
                label: "Possessive 's",
                url: 'https://www.perfect-english-grammar.com/possessives.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: падеж существительных',
                url: 'https://www.native-english.ru/grammar/english-nouns-cases',
                type: 'ru',
              },
            ],
          },
        ],
      },
      {
        name: 'Предлоги движения',
        rules: [
          {
            id: 'a1_24',
            text: 'Предлоги движения: to, into, out of, up, down, along, across, through',
            note: 'go to school, walk into the room, run across the street',
            exp: '<br>• <em>to</em> = направление к точке: <em>go to work, walk to the park</em><br>• <em>into</em> = движение внутрь: <em>come into the room, jump into the pool</em><br>• <em>out of</em> = движение наружу: <em>get out of the car, take out of the bag</em><br>• <em>up/down</em> = вверх/вниз: <em>climb up the hill, walk down the stairs</em><br>• <em>along</em> = вдоль: <em>walk along the river</em><br>• <em>across</em> = поперёк/через: <em>swim across the lake, walk across the road</em><br>• <em>through</em> = сквозь: <em>drive through the tunnel</em>',
            ex: [
              ['She walked into the room.', 'Она вошла в комнату.'],
              ['He ran across the street.', 'Он перебежал улицу.'],
              ['We drove through the forest.', 'Мы проехали через лес.'],
            ],
            links: [
              {
                label: 'Prepositions of movement',
                url: 'https://www.perfect-english-grammar.com/prepositions-of-movement.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: предлоги движения',
                url: 'https://www.native-english.ru/grammar/prepositions-meaning',
                type: 'ru',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A2',
    name: 'A2 — Элементарный',
    sub: 'Elementary · 3–4 месяца',
    color: 'var(--a2)',
    colorBg: 'var(--a2bg)',
    categories: [
      {
        name: 'Past Simple',
        rules: [
          {
            id: 'a2_01',
            text: 'Past Simple — правильные глаголы: +ed',
            note: 'work→worked, play→played, stop→stopped, study→studied',
            exp: '<strong>Past Simple</strong> — завершённое действие в прошлом с конкретным временем или без.<br><br>Правила написания окончания <em>-ed</em>:<br>• Большинство глаголов: + <em>ed</em> → <em>worked, played</em><br>• Оканчиваются на -e: + <em>d</em> → <em>loved, used</em><br>• Согласная + -y: -y → <em>ied</em> → <em>studied, tried</em><br>• Одна гласная + одна согласная (краткий ударный слог): удвоить согласную → <em>stopped, planned</em>',
            ex: [
              ['She worked all day yesterday.', 'Она работала весь день вчера.'],
              ['They played tennis last Sunday.', 'Они играли в теннис в прошлое воскресенье.'],
            ],
            tip: "Маркеры: yesterday, last week/year, ago, in 2010, at 5 o'clock.",
            links: [
              {
                label: 'OK English: Past Simple (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'engfairy: упражнения',
                url: 'https://engfairy.com/past-simple-tense-uprazhneniya/',
                type: 'ru',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/past-simple.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Simple',
                url: 'https://www.native-english.ru/grammar/past-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She is going to school every day</s> → She <em>goes</em> (привычка = Present Simple)',
              "<s>I am going to the cinema tomorrow</s> — возможно, но <em>I'm going to see a film</em> точнее с намерением",
              '<s>He is wanting</s> → He <em>wants</em> (stative verb)',
            ],
            markers: {
              tags: [
                'yesterday',
                'last night',
                'last week',
                'last month',
                'last year',
                'last Monday',
                'ago',
                'in 2010',
                'in January',
                'in the morning (конкретного дня)',
                'at 3pm',
                'on Tuesday',
                'when I was young',
                'then',
                'after that',
                'suddenly',
                'immediately',
                'finally',
                'once',
                'at that moment',
                'in those days',
                'in the past',
              ],
              note: 'Ключевое правило: конкретное время в прошлом → Past Simple, не Present Perfect!',
            },
          },
          {
            id: 'a2_02',
            text: 'Past Simple — неправильные глаголы (таблица)',
            note: 'go→went, see→saw, have→had, come→came, buy→bought',
            exp: 'Около 200 неправильных глаголов нужно учить наизусть. Самые частотные 50 покрывают ~90% употреблений.<br><br>Группы по схожести изменений:<br>• AAA (не меняются): <em>cut, put, hit, set, let</em><br>• ABA (возврат к началу): <em>run→ran→run, come→came→come</em><br>• ABC (все разные): <em>go→went→gone, be→was/were→been</em>',
            ex: [
              ['I went to Paris last summer.', 'Я ездил в Париж прошлым летом.'],
              ['She saw a great film.', 'Она посмотрела отличный фильм.'],
              ['We had a meeting at 9.', 'У нас была встреча в 9.'],
            ],
            links: [
              {
                label: 'Таблица неправильных глаголов',
                url: 'https://www.perfect-english-grammar.com/irregular-verbs.html',
                type: 'en',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/past-simple/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: неправильные глаголы',
                url: 'https://www.native-english.ru/grammar/irregular-verbs',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She goed</s> → She <em>went</em>',
              '<s>I buyed</s> → I <em>bought</em>',
              "<s>They didn't went</s> → They didn't <em>go</em> (после did — базовая форма)",
            ],
            markers: {
              tags: [
                'yesterday',
                'last week',
                'ago',
                'when?',
                'what time?',
                'in 2019',
                'on Monday',
              ],
              note: 'Вопросительное слово when? всегда требует Past Simple (не Present Perfect).',
            },
          },
          {
            id: 'a2_03',
            text: "Past Simple — отрицание: didn't + инфинитив",
            note: "She didn't go (не: didn't went). I didn't see him.",
            exp: `Отрицание: <em>didn't</em> (= did not) + инфинитив для <strong>всех лиц</strong>.<br>⚠️ После <em>didn't</em> — <strong>базовая форма</strong> глагола (не прошедшее время!): <em>She didn't go</em> (не <s>went</s>).`,
            ex: [
              ["I didn't see him yesterday.", 'Я не видел его вчера.'],
              ["She didn't come to work.", 'Она не пришла на работу.'],
            ],
            links: [
              {
                label: 'Упражнения на отрицание',
                url: 'https://www.perfect-english-grammar.com/past-simple-exercise-3.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Simple',
                url: 'https://www.native-english.ru/grammar/past-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I didn't went</s> → I didn't <em>go</em>",
              "<s>She didn't came</s> → She didn't <em>come</em>",
              '<s>Did she played?</s> → Did she <em>play</em>?',
              "<s>She didn't came</s> → She didn't <em>come</em>",
              '<s>What he did?</s> → What <em>did he do?</em>',
            ],
          },
          {
            id: 'a2_04',
            text: 'Past Simple — вопросы: Did you? Where did she go?',
            note: 'Did they arrive? What did he say?',
            exp: 'Вопрос: <em>Did + подлежащее + инфинитив?</em><br>Специальные вопросы: <em>Where/When/What + did + подлежащее + инфинитив?</em><br><br>⚠️ Исключение: вопрос «Кто совершил действие?» строится без did: <em>Who called? Who broke the vase?</em>',
            ex: [
              ['Did you enjoy the film?', 'Тебе понравился фильм?'],
              ['Where did they go?', 'Куда они пошли?'],
              ['Who told you that?', 'Кто тебе это сказал?'],
            ],
            links: [
              {
                label: 'Вопросы в Past Simple',
                url: 'https://www.perfect-english-grammar.com/past-simple-exercise-5.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Simple',
                url: 'https://www.native-english.ru/grammar/past-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I will to go</s> → I <em>will go</em> (без to)',
              '<s>She wills come</s> → She will come (will не изменяется)',
              '<s>I think she go tomorrow</s> → she <em>will go</em>',
            ],
            markers: {
              tags: [
                'tomorrow',
                'next week',
                'next month',
                'next year',
                'soon',
                'in a minute',
                'in an hour',
                'in the future',
                'one day',
                'someday',
                'probably',
                'perhaps',
                'maybe',
                'I think...',
                'I expect...',
                "I'm sure...",
                'certainly',
                'definitely',
              ],
              note: 'will используется для спонтанных решений, обещаний, предсказаний без доказательств.',
            },
          },
          {
            id: 'a2_05',
            text: 'was / were — глагол to be в прошлом',
            note: 'I/he/she/it was. You/we/they were.',
            exp: `Прошедшее время глагола <em>to be</em>:<br>• <em>was</em> — с I, he, she, it<br>• <em>were</em> — с you, we, they<br><br>Отрицание: <em>wasn't / weren't</em><br>Вопрос: <em>Was she...? Were they...?</em>`,
            ex: [
              ['I was very tired last night.', 'Я был очень уставшим вчера вечером.'],
              ['They were at home all day.', 'Они были дома весь день.'],
              ['Was it expensive?', 'Это было дорого?'],
            ],
            links: [
              {
                label: 'was/were упражнения',
                url: 'https://www.perfect-english-grammar.com/was-or-were-exercise.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: глагол to be',
                url: 'https://www.native-english.ru/grammar/verb-to-be',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I am going to will do</s> — только одно: <em>I'm going to do</em>",
              '<s>She is going to does</s> → she is going to <em>do</em>',
              '<s>He gonna do</s> — разговорная форма, в письменной неприемлема',
            ],
            markers: {
              tags: [
                'tomorrow',
                'next week',
                'soon',
                'this weekend',
                'tonight',
                'in June',
                'Look! (признак)',
                'Watch out!',
              ],
              note: 'going to = заранее принятое решение или предсказание на основе видимых признаков.',
            },
          },
        ],
      },
      {
        name: 'Future',
        rules: [
          {
            id: 'a2_06',
            text: 'will — предсказания и спонтанные решения',
            note: "I'll call you back. It will rain tomorrow. I'll have the pasta.",
            exp: `<em>will</em> используется для:<br>1. <strong>Спонтанных решений</strong> (принятых в момент речи): <em>I'll help you with that.</em><br>2. <strong>Предсказаний</strong> без конкретного плана: <em>I think it will rain.</em><br>3. <strong>Обещаний</strong>: <em>I won't tell anyone.</em><br>4. <strong>Просьб</strong>: <em>Will you open the window?</em><br><br>Сокращение: <em>'ll</em>. Отрицание: <em>won't</em> (= will not).`,
            ex: [
              ["The phone is ringing. — I'll get it!", 'Телефон звонит. — Я отвечу!'],
              ['It will be cold tomorrow.', 'Завтра будет холодно.'],
            ],
            links: [
              {
                label: 'OK English: will (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Will future',
                url: 'https://www.perfect-english-grammar.com/will-future.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: shall/will',
                url: 'https://www.native-english.ru/grammar/modal-verb-shall-will',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I will to go</s> → I <em>will go</em> (без to)',
              '<s>She wills come</s> → She will come (will не изменяется)',
            ],
          },
          {
            id: 'a2_07',
            text: 'going to — намерения и очевидные предсказания',
            note: "I'm going to visit Paris. Look out — you're going to fall!",
            exp: `<em>going to</em> используется для:<br>1. <strong>Заранее принятых решений и намерений</strong>: <em>I'm going to start a diet next week.</em><br>2. <strong>Предсказаний с видимыми признаками</strong>: <em>Look at those clouds — it's going to rain!</em><br><br>Форма: <em>am/is/are + going to + инфинитив</em>`,
            ex: [
              ["I'm going to study medicine.", 'Я собираюсь изучать медицину.'],
              ["She's going to have a baby.", 'Она ждёт ребёнка.'],
            ],
            exc: '<em>will vs going to</em>: <em>"I\'ll have coffee"</em> — решаю прямо сейчас; <em>"I\'m going to have coffee"</em> — уже решил раньше.',
            links: [
              {
                label: 'Will vs going to',
                url: 'https://www.perfect-english-grammar.com/will-or-going-to.html',
                type: 'en',
              },
              {
                label: 'Skyeng: упражнения',
                url: 'https://skyeng.ru/exercises/future/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: Future Simple',
                url: 'https://www.native-english.ru/grammar/future-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She is going to does</s> → She is going to <em>do</em>',
              '<s>I am going to will do</s> — нельзя два будущих',
            ],
          },
        ],
      },
      {
        name: 'Present Continuous',
        rules: [
          {
            id: 'a2_08',
            text: 'Present Continuous: am/is/are + V-ing',
            note: 'She is reading now. They are playing outside.',
            exp: '<strong>Present Continuous</strong> — действие, происходящее <strong>прямо сейчас</strong> или <strong>временно</strong> в этот период.<br><br>Форма: <em>am/is/are + глагол + -ing</em><br><br>Правила написания <em>-ing</em>:<br>• Большинство: просто + <em>ing</em> → <em>working, playing</em><br>• Оканчивается на -e: убрать -e + <em>ing</em> → <em>making, coming</em><br>• Краткий ударный слог: удвоить последнюю согласную → <em>running, sitting</em>',
            ex: [
              ['I am studying English right now.', 'Я сейчас изучаю английский.'],
              ["She's working from home this month.", 'Она работает из дома в этом месяце.'],
            ],
            tip: 'Маркеры: now, at the moment, currently, this week/month.',
            links: [
              {
                label: 'OK English: Present Continuous (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/present-continuous/',
                type: 'ru',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/present-continuous.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Continuous',
                url: 'https://www.native-english.ru/grammar/present-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I was visit</s> → I was <em>visiting</em>',
              '<s>She were working</s> → She <em>was</em> working (she/he/it → was)',
              '<s>At 8 I was work</s> → I was <em>working</em>',
            ],
            markers: {
              tags: [
                'now',
                'right now',
                'at the moment',
                'at present',
                'currently',
                'today',
                'this week',
                'this month',
                'this year',
                'still',
                'Look!',
                'Listen!',
                'these days',
                'temporarily',
                'for the time being',
              ],
              note: 'Эти маркеры указывают на действие прямо сейчас или временную ситуацию.',
            },
          },
          {
            id: 'a2_09',
            text: 'Present Continuous для запланированного будущего',
            note: "I'm meeting Tom tomorrow. We're flying to Rome on Friday.",
            exp: `Present Continuous используется для <strong>конкретных договорённостей</strong> в будущем — когда время и место уже определены.<br><br>Разница:<br>• <em>I'm meeting Alice tomorrow</em> — встреча договорена (конкретный план)<br>• <em>I'll meet Alice tomorrow</em> — намерение или предложение`,
            ex: [
              ["I'm having dinner with Alex tonight.", 'Я ужинаю с Алексом сегодня вечером.'],
              ["They're getting married in June.", 'Они женятся в июне.'],
            ],
            links: [
              {
                label: 'Present Continuous for future',
                url: 'https://www.perfect-english-grammar.com/present-continuous-for-future.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Continuous',
                url: 'https://www.native-english.ru/grammar/present-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I'm meeting Tom in next week</s> → meeting Tom <em>next week</em> (без in)",
              '<s>We are flying to Rome on the Friday</s> → on <em>Friday</em>',
            ],
            markers: {
              tags: [
                'tomorrow',
                'tonight',
                'next week',
                'next month',
                'on Friday',
                'this evening',
                'soon',
                'at 8pm tomorrow',
                'in June',
                'on Monday',
              ],
              note: 'Present Continuous для будущего — конкретные договорённости, есть время и место.',
            },
          },
          {
            id: 'a2_10',
            text: 'Present Simple vs Present Continuous — разница',
            note: 'I drink coffee (привычка) vs I am drinking coffee (прямо сейчас)',
            exp: '<strong>Present Simple:</strong> привычки, факты, расписания, общие истины.<br><strong>Present Continuous:</strong> то, что происходит прямо сейчас или временно.<br><br>Сравни:<br>• <em>She speaks French.</em> — знает язык (всегда)<br>• <em>She is speaking French.</em> — говорит прямо сейчас<br><br>⚠️ Stative verbs (know, love, want, understand...) — только Present Simple!',
            ex: [
              ['Water boils at 100°C. (факт)', 'Вода кипит при 100°C.'],
              [
                "I'm reading a great book this week. (временно)",
                'Я читаю отличную книгу на этой неделе.',
              ],
            ],
            links: [
              {
                label: 'Simple vs Continuous',
                url: 'https://www.perfect-english-grammar.com/present-simple-or-present-continuous.html',
                type: 'en',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/present-simple-vs-present-continuous/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: Present Simple vs Continuous',
                url: 'https://www.native-english.ru/grammar/present-simple',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I am drink coffee every morning</s> → I <em>drink</em> (привычка)',
              '<s>She knowing French</s> → She <em>knows</em> French',
              '<s>Water is boiling at 100°C</s> → Water <em>boils</em> (факт)',
            ],
            markers: {
              tags: [
                'now ↔ every day',
                'at the moment ↔ always',
                'currently ↔ usually',
                'this week ↔ normally',
              ],
              note: 'Маркер определяет выбор: now/at the moment → Continuous; always/every day → Simple.',
            },
          },
        ],
      },
      {
        name: 'Модальные глаголы',
        rules: [
          {
            id: 'a2_11',
            text: "should / shouldn't — совет и рекомендация",
            note: "You should see a doctor. You shouldn't eat so much.",
            exp: '<em>should</em> выражает мягкий совет или личное мнение. Слабее <em>must</em>.<br>После <em>should</em> — инфинитив без <em>to</em>.<br><br>Также используется для критики или сожаления: <em>You should have called</em> (надо было позвонить).',
            ex: [
              ['You should exercise more.', 'Тебе стоит больше заниматься спортом.'],
              ["She shouldn't work so hard.", 'Ей не следует так много работать.'],
            ],
            links: [
              {
                label: 'Should',
                url: 'https://www.perfect-english-grammar.com/should.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: should',
                url: 'https://www.native-english.ru/grammar/modal-verb-should',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>You should to see a doctor</s> → should <em>see</em> (без to)',
              '<s>She should goes</s> → She should <em>go</em>',
              '<s>I should have went</s> → I should have <em>gone</em>',
            ],
          },
          {
            id: 'a2_12',
            text: "must / mustn't — обязанность и строгий запрет",
            note: "You must wear a seatbelt. You mustn't smoke here.",
            exp: `<em>must</em> — сильная обязанность (часто внутренняя) или категорическое требование.<br><em>mustn't</em> — строгий <strong>запрет</strong> (категорически нельзя!).<br><br>⚠️ Важное отличие: <em>mustn't</em> ≠ <em>don't have to</em>!<br>• <em>mustn't</em> = запрещено<br>• <em>don't have to</em> = не обязательно, но можно`,
            ex: [
              ['You must show your passport.', 'Вы должны предъявить паспорт.'],
              ["You mustn't smoke here.", 'Здесь нельзя курить.'],
            ],
            links: [
              {
                label: 'Must',
                url: 'https://www.perfect-english-grammar.com/must.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: must',
                url: 'https://www.native-english.ru/grammar/modal-verb-must',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>You mustn't to smoke</s> → mustn't <em>smoke</em>",
              '<s>I must to do this</s> → I <em>must</em> do this (без to)',
              '<s>You mustn\'t come</s> ≠ "тебе не нужно" — это "тебе нельзя!" Для "не нужно": <em>don\'t have to</em>',
            ],
          },
          {
            id: 'a2_13',
            text: 'have to — внешняя необходимость',
            note: "I have to work late. She doesn't have to come.",
            exp: `<em>have to</em> — необходимость из-за внешних правил, обстоятельств или чужих требований.<br><br>Отличие от <em>must</em>:<br>• <em>must</em> — внутренняя необходимость: <em>I must call her</em> (я сам считаю нужным)<br>• <em>have to</em> — внешняя: <em>I have to wear a uniform</em> (правило)<br><br><em>don't have to</em> = не обязательно (нет необходимости, но разрешено).`,
            ex: [
              ['I have to finish this report by Friday.', 'Я должен сдать отчёт к пятнице.'],
              ["You don't have to come if you don't want to.", 'Тебе не обязательно приходить.'],
            ],
            links: [
              {
                label: 'Must or have to',
                url: 'https://www.perfect-english-grammar.com/must-or-have-to.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: have to',
                url: 'https://www.native-english.ru/grammar/modal-verb-have-to',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I have to can do this</s> — нельзя два модальных подряд',
              "<s>She doesn't have to don't come</s> → She <em>doesn't have to</em> come",
              "<s>You must not to come</s> → mustn't come",
            ],
          },
          {
            id: 'a2_14',
            text: 'could — прошлое умение и вежливые просьбы',
            note: 'She could swim when she was 5. Could you help me?',
            exp: '<em>could</em> — прошедшее время от <em>can</em>. Два основных значения:<br>1. <strong>Умение в прошлом</strong>: <em>I could read at 4 years old.</em><br>2. <strong>Вежливые просьбы</strong> (вежливее <em>can</em>): <em>Could you pass the salt, please?</em><br><br>Также для возможности в настоящем: <em>It could be true.</em>',
            ex: [
              ['She could play the violin as a child.', 'Она умела играть на скрипке в детстве.'],
              ['Could you speak more slowly, please?', 'Не могли бы вы говорить помедленнее?'],
            ],
            links: [
              {
                label: 'Could',
                url: 'https://www.perfect-english-grammar.com/could.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: can/could',
                url: 'https://www.native-english.ru/grammar/modal-verb-can',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She could to swim</s> → She could <em>swim</em> (без to)',
              '<s>Can I when I was a child</s> → <em>I could</em> when I was a child',
              '<s>Could you to speak slowly?</s> → Could you speak slowly?',
            ],
          },
        ],
      },
      {
        name: 'Прилагательные и количество',
        rules: [
          {
            id: 'a2_15',
            text: 'Сравнительная степень прилагательных',
            note: 'bigger, more interesting, better, worse',
            exp: 'Односложные и двусложные на <em>-y</em>: + <em>er</em> (fast→faster, happy→happier).<br>Многосложные: <em>more</em> + прилагательное.<br><br>Правила написания: <em>-e</em> → + <em>r</em> (nice→nicer); краткий ударный слог: удвоить (big→bigger); -y → ier (heavy→heavier).<br><br>Неправильные: <em>good→better, bad→worse, far→further/farther, much/many→more</em><br>После сравнительной — <em>than</em>: <em>She is taller than her sister.</em>',
            ex: [
              ['This film is more interesting than that one.', 'Этот фильм интереснее того.'],
              ['Today is worse than yesterday.', 'Сегодня хуже, чем вчера.'],
            ],
            links: [
              {
                label: 'Comparatives',
                url: 'https://www.perfect-english-grammar.com/comparatives.html',
                type: 'en',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/degrees-of-comparison/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: степени сравнения',
                url: 'https://www.native-english.ru/grammar/adjectives-degrees-of-comparison',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She is more tall than</s> → She is <em>taller</em> than',
              '<s>He is more better</s> → He is <em>better</em>',
              '<s>She is tallest in class</s> → She is <em>the</em> tallest',
            ],
          },
          {
            id: 'a2_16',
            text: 'Превосходная степень прилагательных',
            note: 'the biggest, the most beautiful, the best',
            exp: 'Односложные: <em>the + -est</em>. Многосложные: <em>the most</em>.<br>Правила написания те же, что и у сравнительной степени.<br><br>Неправильные: <em>good→the best, bad→the worst, far→the furthest, much/many→the most</em><br><br>⚠️ Всегда с артиклем <em>the</em>! После превосходной степени часто <em>in</em> или <em>of</em>: <em>the tallest girl in the class.</em>',
            ex: [
              [
                'This is the most expensive restaurant in the city.',
                'Это самый дорогой ресторан в городе.',
              ],
              ['He is the best player on the team.', 'Он лучший игрок в команде.'],
            ],
            links: [
              {
                label: 'Superlatives',
                url: 'https://www.perfect-english-grammar.com/superlatives.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: степени сравнения',
                url: 'https://www.native-english.ru/grammar/adjectives-degrees-of-comparison',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>He is most clever</s> → He is <em>the most</em> clever / <em>the cleverest</em>',
              '<s>She is the most best</s> → She is <em>the best</em>',
              '<s>This is most interesting film</s> → <em>the most interesting</em> film (нужен the)',
            ],
          },
          {
            id: 'a2_17',
            text: 'some / any — неопределённое количество',
            note: "I have some money. Do you have any? I don't have any.",
            exp: '<em>some</em> — в утвердительных предложениях и в предложениях/просьбах.<br><em>any</em> — в вопросах и отрицаниях.<br><br>Исключение: <em>some</em> в вопросах, когда ожидаем утвердительный ответ или предлагаем что-то: <em>Would you like some tea? Can I have some water?</em>',
            ex: [
              ['I bought some bread and some milk.', 'Я купил хлеба и молока.'],
              ['Is there any milk in the fridge?', 'В холодильнике есть молоко?'],
              ["I don't have any cash on me.", 'У меня нет наличных с собой.'],
            ],
            links: [
              {
                label: 'Some or any',
                url: 'https://www.perfect-english-grammar.com/some-or-any.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: неопределённые местоимения',
                url: 'https://www.native-english.ru/grammar/indefinite-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I have some money? (вопрос)</s> → Do I have <em>any</em> money?',
              "<s>I don't have some cash</s> → I don't have <em>any</em> cash",
              '<s>Would you like any tea?</s> → Would you like <em>some</em> tea? (предложение)',
            ],
          },
          {
            id: 'a2_18',
            text: 'much / many / a lot of / a few / a little',
            note: 'much water (несчисл.), many people (счисл.), a lot of — везде',
            exp: '<em>much</em> — с несчисляемыми (much water, much time, much money).<br><em>many</em> — со счисляемыми (many people, many books, many times).<br><em>a lot of / lots of</em> — с обоими, разговорный стиль.<br><br><em>a few</em> — немного (счисляемые, нейтрально/позитивно).<br><em>few</em> — мало, почти нет (счисляемые, негативно).<br><em>a little</em> — немного (несчисляемые, нейтрально).<br><em>little</em> — мало, почти нет (несчисляемые, негативно).',
            ex: [
              ["I don't have much time.", 'У меня мало времени.'],
              ['She has a few friends in London.', 'У неё есть несколько друзей в Лондоне.'],
              ['There is a little sugar left.', 'Осталось немного сахара.'],
            ],
            links: [
              {
                label: 'Much/many/a lot of',
                url: 'https://www.perfect-english-grammar.com/much-or-many.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: наречия меры',
                url: 'https://www.native-english.ru/grammar/adverb-of-degree',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Much people</s> → <em>Many</em> people (счисляемое)',
              '<s>Many money</s> → <em>Much</em> money (несчисляемое)',
              '<s>A few water</s> → <em>A little</em> water',
            ],
          },
          {
            id: 'a2_19',
            text: 'Счисляемые и несчисляемые существительные',
            note: 'water, information, advice — нельзя: a water, two advices',
            exp: '<strong>Счисляемые</strong>: можно посчитать, есть мн. число: <em>a book, two books</em>.<br><strong>Несчисляемые</strong>: нельзя посчитать напрямую — нет мн. числа, нет неопределённого артикля.<br><br>Типичные несчисляемые: <em>water, milk, bread, rice, money, information, advice, news, weather, luggage, furniture, hair, music, work</em><br><br>Для обозначения порций: <em>a glass of water, a piece of advice, a loaf of bread, a bag of rice</em>',
            ex: [
              ['Can I have some information, please?', 'Можно мне узнать кое-что?'],
              ['She gave me very useful advice.', 'Она дала мне очень полезный совет.'],
            ],
            links: [
              {
                label: 'Countable/uncountable',
                url: 'https://www.perfect-english-grammar.com/countable-and-uncountable-nouns.html',
                type: 'en',
              },
              { label: 'Skyeng упражнения', url: 'https://skyeng.ru/exercises/nouns/', type: 'ru' },
              {
                label: 'native-english.ru: существительные',
                url: 'https://www.native-english.ru/grammar/english-nouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Two advices</s> → Two pieces of <em>advice</em> (advice несчисляемое)',
              '<s>An information</s> → <em>Some information</em>',
              '<s>Three furnitures</s> → Three pieces of <em>furniture</em>',
            ],
          },
        ],
      },
      {
        name: 'Предлоги времени',
        rules: [
          {
            id: 'a2_20',
            text: 'Предлоги in / on / at для времени',
            note: 'in March, in 2024, in winter; on Monday, on 5 June; at 3pm, at night',
            exp: `<em>at</em> → точное время: <em>at 6 o'clock, at noon, at midnight, at night, at the weekend (BrE)</em><br><em>on</em> → дни и даты: <em>on Monday, on 5 March, on my birthday, on New Year's Day</em><br><em>in</em> → периоды: <em>in July, in 2023, in the morning/afternoon/evening, in summer, in the 21st century</em><br><br>Без предлога: <em>this/last/next + время: this morning, last week, next year</em>`,
            ex: [
              ['The meeting is at half past three.', 'Встреча в половине четвёртого.'],
              ['She was born on the 12th of April.', 'Она родилась 12 апреля.'],
              ['I started this job in October.', 'Я начал эту работу в октябре.'],
            ],
            links: [
              {
                label: 'In/On/At time',
                url: 'https://www.perfect-english-grammar.com/in-on-at-time.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: предлог at',
                url: 'https://www.native-english.ru/grammar/preposition-at',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>at Monday</s> → <em>on</em> Monday',
              "<s>in 8 o'clock</s> → <em>at</em> 8 o'clock",
              '<s>on the morning</s> → <em>in</em> the morning',
              '<s>in my birthday</s> → <em>on</em> my birthday',
            ],
          },
          {
            id: 'a2_21',
            text: 'for / since / ago — продолжительность и начало',
            note: 'for three years, since 2020, three years ago',
            exp: '<em>for</em> — продолжительность (как долго): <em>for two hours, for a week, for years</em>. Используется с разными временами.<br><em>since</em> — начальный момент (с тех пор как): <em>since Monday, since 2019, since I was a child</em>. Используется с Present Perfect.<br><em>ago</em> — время назад от сейчас: <em>three days ago, a month ago</em>. Только с Past Simple.',
            ex: [
              ["I've been here for six months.", 'Я здесь уже шесть месяцев.'],
              ["She's worked here since 2020.", 'Она работает здесь с 2020 года.'],
              ['I saw him two days ago.', 'Я видел его два дня назад.'],
            ],
            links: [
              {
                label: 'For/since/ago',
                url: 'https://www.perfect-english-grammar.com/for-since-and-ago.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: предлог for',
                url: 'https://www.native-english.ru/grammar/preposition-for',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I've been here since three years</s> → for three years",
              '<s>I saw him since Monday</s> → I saw him <em>on</em> Monday (ago с Past Simple, не since!)',
              '<s>Three days before</s> → Three days <em>ago</em>',
            ],
          },
        ],
      },
      {
        name: 'Разное A2',
        rules: [
          {
            id: 'a2_22',
            text: "Вопросы-хвостики: ...isn't it? / ...do you? / ...haven't they?",
            note: "It's cold, isn't it? You like jazz, don't you?",
            exp: 'Вопросы-хвостики (tag questions) используются для подтверждения или уточнения.<br><br>Правило: утвердительное предложение → отрицательный хвостик, и наоборот.<br>Вспомогательный глагол в хвостике = время основного предложения.<br><br>Интонация: ↘ (понижающаяся) = подтверждение; ↗ (повышающаяся) = реальный вопрос.',
            ex: [
              ["It's a nice day, isn't it?", 'Хороший день, правда?'],
              ["You don't like horror films, do you?", 'Ты же не любишь фильмы ужасов, правда?'],
              ["She can swim, can't she?", 'Она умеет плавать, не так ли?'],
            ],
            links: [
              {
                label: 'Tag questions',
                url: 'https://www.perfect-english-grammar.com/tag-questions.html',
                type: 'en',
              },
              {
                label: 'Упражнения',
                url: 'https://skyeng.ru/exercises/tag-questions/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: общие вопросы',
                url: 'https://www.native-english.ru/grammar/general-questions',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>It's cold, isn't he?</s> → isn't <em>it</em>",
              "<s>She can swim, can't he?</s> → can't <em>she</em>",
              "<s>You don't like it, don't you?</s> → <em>do</em> you? (отрицательное предложение → положительный хвостик)",
            ],
          },
        ],
      },
      {
        name: 'Глагол have / have got',
        rules: [
          {
            id: 'a2_23',
            text: 'have got — обладание (британский вариант)',
            note: "I've got a car. Have you got a pen? She hasn't got time.",
            exp: `<em>have got</em> — разговорная британская форма для обозначения обладания. Значение = <em>have</em>.<br><br>• Утверждение: <em>I have got / I've got a laptop.</em><br>• Отрицание: <em>I haven't got / I don't have</em><br>• Вопрос: <em>Have you got...? / Do you have...?</em><br><br>⚠️ <em>have got</em> используется только в настоящем. Для прошлого — только <em>had</em>.`,
            ex: [
              ["I've got two brothers.", 'У меня два брата.'],
              ['Have you got the time?', 'Ты не знаешь, который час?'],
              ["She hasn't got any cash.", 'У неё нет наличных.'],
            ],
            links: [
              {
                label: 'Have or have got',
                url: 'https://www.perfect-english-grammar.com/have-or-have-got.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: глагол to have',
                url: 'https://www.native-english.ru/grammar/verb-to-have',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I've got a car in 2010</s> → I <em>bought</em> a car in 2010 (have got только настоящее)",
              '<s>She had got a dog</s> → She <em>had</em> a dog (прошлое — только had)',
            ],
          },
        ],
      },
      {
        name: 'Наречия',
        rules: [
          {
            id: 'a2_24',
            text: 'Наречия образа действия: quickly, carefully, well, hard, fast',
            note: 'She sings beautifully. He works hard. She drives fast.',
            exp: 'Большинство наречий образуется из прилагательных + <em>-ly</em>: <em>quick → quickly, careful → carefully, slow → slowly</em>.<br><br>Особые случаи:<br>• <em>good → well</em> (не <s>goodly</s>)<br>• <em>fast → fast</em> (не <s>fastly</s>)<br>• <em>hard → hard</em> (не <s>hardly</s> — это другое слово: «едва»)<br>• <em>late → late</em> (не <s>lately</s> — это «в последнее время»)<br><br>Место: обычно после глагола/дополнения: <em>She speaks English well.</em>',
            ex: [
              ['He explained it clearly.', 'Он объяснил это ясно.'],
              ['She ran fast.', 'Она бежала быстро.'],
              ['They worked hard all day.', 'Они много работали весь день.'],
            ],
            links: [
              {
                label: 'Adverbs of manner',
                url: 'https://www.perfect-english-grammar.com/adverbs.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: наречия образа действия',
                url: 'https://www.native-english.ru/grammar/adverbs-of-manner',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She sings beautiful</s> → She sings <em>beautifully</em>',
              '<s>He works hardly</s> → He works <em>hard</em> (hardly = едва)',
              '<s>She drives fastly</s> → She drives <em>fast</em>',
            ],
          },
          {
            id: 'a2_25',
            text: 'Наречия частотности и их место в предложении',
            note: 'always, usually, often, sometimes, rarely, never — перед главным глаголом',
            exp: 'Наречия частотности: <em>always, usually, often, sometimes, occasionally, rarely, seldom, never</em>.<br><br>Место в предложении:<br>• Перед основным глаголом: <em>She always drinks tea.</em><br>• После глагола <em>to be</em>: <em>He is always late.</em><br>• После вспомогательного глагола: <em>She has never been to Italy.</em><br><br>Также: <em>every day/week, once a week, twice a month</em> — в конце предложения.',
            ex: [
              ['I usually wake up at 7.', 'Я обычно просыпаюсь в 7.'],
              ['She is never late for work.', 'Она никогда не опаздывает на работу.'],
              ['They meet once a week.', 'Они встречаются раз в неделю.'],
            ],
            links: [
              {
                label: 'Adverb position',
                url: 'https://www.perfect-english-grammar.com/adverb-position.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: место наречия',
                url: 'https://www.native-english.ru/grammar/position-of-adverbs',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She always is late</s> → She is <em>always</em> late (after to be)',
              '<s>He drinks always coffee</s> → He <em>always</em> drinks coffee (перед основным глаголом)',
              '<s>She has never been always on time</s> — два наречия вместе неуместны',
            ],
          },
        ],
      },
      {
        name: 'Порядок прилагательных',
        rules: [
          {
            id: 'a2_26',
            text: 'Порядок прилагательных перед существительным',
            note: 'a lovely small old red Italian leather bag',
            exp: 'Когда несколько прилагательных стоят перед существительным, соблюдается строгий порядок:<br><br><strong>Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose</strong><br>(Мнение → Размер → Возраст → Форма → Цвет → Происхождение → Материал → Назначение)<br><br>Пример: <em>a beautiful small old square brown French wooden writing desk</em>',
            ex: [
              ['a lovely little old cottage', 'прелестный маленький старый коттедж'],
              ['a big red Italian sports car', 'большой красный итальянский спортивный автомобиль'],
            ],
            links: [
              {
                label: 'Adjective order',
                url: 'https://www.perfect-english-grammar.com/order-of-adjectives.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: порядок прилагательных',
                url: 'https://www.native-english.ru/grammar/adjectives-order',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>a wooden French old small bag</s> → порядок: размер → возраст → происхождение → материал',
              '<s>a beautiful Italian big car</s> → big <em>beautiful</em> Italian car (размер перед мнением — нет)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'B1',
    name: 'B1 — Средний',
    sub: 'Intermediate · 4–6 месяцев',
    color: 'var(--b1)',
    colorBg: 'var(--b1bg)',
    categories: [
      {
        name: 'Present Perfect',
        rules: [
          {
            id: 'b1_01',
            text: 'Present Perfect — форма и значение',
            note: 'I have seen it. She has gone. They have arrived.',
            exp: `<strong>Present Perfect</strong> = have/has + V3 (третья форма глагола).
<br><br>Три основных значения:
<br>1. <strong>Жизненный опыт</strong> (без указания времени): <em>I have visited Tokyo.</em>
<br>2. <strong>Результат в настоящем</strong>: <em>I have lost my keys.</em> (сейчас нет ключей)
<br>3. <strong>Незавершённое действие</strong>, продолжающееся сейчас: <em>She has lived here for 5 years.</em>
<br><br>V3 правильных глаголов = Past Simple (worked, played). Неправильные нужно знать отдельно.`,
            ex: [
              ['Have you ever eaten sushi?', 'Ты когда-нибудь ел суши?'],
              ["I've just finished my homework.", 'Я только что закончил домашнее задание.'],
              ["She hasn't called yet.", 'Она ещё не позвонила.'],
            ],
            tip: 'Маркеры: ever, never, already, yet, just, recently, lately, so far.',
            links: [
              {
                label: 'OK English: Present Perfect (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Skyeng: упражнения PP',
                url: 'https://skyeng.ru/exercises/present-perfect-present-perfect-continuous/',
                type: 'ru',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/present-perfect.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Perfect',
                url: 'https://www.native-english.ru/grammar/present-perfect',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I have seen him yesterday</s> → I <em>saw</em> him yesterday (вчера = Past Simple!)',
              '<s>She has went</s> → She has <em>gone</em>',
              '<s>I have been to Rome last year</s> → I <em>went</em> to Rome last year',
            ],
            markers: {
              tags: [
                'ever',
                'never',
                'already',
                'yet',
                'just',
                'recently',
                'lately',
                'so far',
                'up to now',
                'until now',
                'still (отриц.)',
                'this week',
                'this month',
                'this year',
                'today',
                'before',
                'once',
                'twice',
                'three times',
                'for',
                'since',
                "it's the first time...",
                "the best I've ever...",
              ],
              note: 'Никогда не используется с конкретным временем прошлого (yesterday, last year, in 2020 → Past Simple).',
            },
          },
          {
            id: 'b1_02',
            text: 'ever / never / already / yet / just — маркеры Present Perfect',
            note: "Have you ever...? I've never... I've already... Not yet. I've just...",
            exp: `<em>ever</em> — когда-нибудь (в вопросах об опыте). Место: перед V3.
<br><em>never</em> — никогда (отрицательное значение). Место: перед V3.
<br><em>already</em> — уже (раньше ожидаемого). Место: перед V3 или в конце.
<br><em>yet</em> — уже/ещё. В вопросах (Have you finished yet?) и отрицаниях (I haven't finished yet). Место: конец предложения.
<br><em>just</em> — только что. Место: перед V3.`,
            ex: [
              ['Have you ever been to Scotland?', 'Ты бывал в Шотландии?'],
              ["I've never eaten snails.", 'Я никогда не ел улиток.'],
              ["I've already seen that film.", 'Я уже видел этот фильм.'],
              ["She hasn't replied yet.", 'Она ещё не ответила.'],
            ],
            links: [
              {
                label: 'already/yet/just',
                url: 'https://www.perfect-english-grammar.com/present-perfect-already-yet-just.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Perfect',
                url: 'https://www.native-english.ru/grammar/present-perfect',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Have you ever been to Paris yet?</s> → <em>ever</em> в вопросе, <em>yet</em> в конце',
              "<s>I've already not finished</s> → I <em>haven't</em> finished <em>yet</em>",
              '<s>I just have eaten</s> → I <em>have just</em> eaten (just перед V3)',
            ],
            markers: {
              tags: [
                'ever',
                'never',
                'already',
                'yet',
                'just',
                'recently',
                'lately',
                'so far',
                'up to now',
                'still (not yet)',
              ],
              note: 'ever/never — перед V3; already — перед V3 или в конце; yet — только в конце.',
            },
          },
          {
            id: 'b1_03',
            text: 'Present Perfect vs Past Simple — ключевая разница',
            note: "I've been to Paris (опыт) vs I went to Paris in 2019 (конкретное время)",
            exp: `Это одна из самых важных разниц в английской грамматике.
<br><br><strong>Present Perfect</strong> — связь с настоящим, время НЕ указывается:
<br><em>I've lost my wallet.</em> (сейчас нет кошелька — это важно)
<br><br><strong>Past Simple</strong> — завершённое прошлое, время указывается или подразумевается:
<br><em>I lost my wallet yesterday.</em> (вчера — конкретное время)
<br><br>⚠️ С конкретными временными маркерами (yesterday, last week, in 2020, ago) → только Past Simple!`,
            ex: [
              [
                "I've met the new director. (он сейчас здесь, это актуально)",
                'Я познакомился с новым директором.',
              ],
              ['I met him last Tuesday. (конкретное время)', 'Я встретил его в прошлый вторник.'],
            ],
            links: [
              {
                label: 'OK English: PP vs Past Simple (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Skyeng: тест PP vs PS',
                url: 'https://skyeng.ru/testy-po-anglijskomu-yazyku/past-simple-ili-present-perfect/',
                type: 'ru',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/present-perfect-or-past-simple.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Perfect',
                url: 'https://www.native-english.ru/grammar/present-perfect',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I have seen him last week</s> → I <em>saw</em> him last week (конкретное время = Past Simple)',
              '<s>Did you ever eat sushi?</s> → <em>Have</em> you ever eaten sushi?',
              '<s>I met him and he has told me</s> → he <em>told</em> me (в одном контексте прошлого)',
            ],
            markers: {
              tags: [
                'ever / never (PP) ↔ конкретное время (PS)',
                'already / yet (PP) ↔ yesterday / ago (PS)',
                'just (PP) ↔ then / after that (PS)',
                'recently (PP) ↔ last week (PS)',
              ],
              note: 'Если есть конкретное время (yesterday, in 2020, last year) → только Past Simple.',
            },
          },
          {
            id: 'b1_04',
            text: 'Present Perfect с for и since',
            note: "I've lived here for 5 years / since 2019.",
            exp: `<em>for</em> — продолжительность: <em>for two days, for a year, for a long time, for ages</em>
<br><em>since</em> — начальная точка: <em>since Monday, since I was a child, since 2015</em>
<br><br>Вопрос «Как долго?» — How long + Present Perfect: <em>How long have you known her?</em>`,
            ex: [
              ["She's worked here for ten years.", 'Она работает здесь десять лет.'],
              ["I've known him since university.", 'Я знаю его со времён университета.'],
            ],
            links: [
              {
                label: 'For and since',
                url: 'https://www.perfect-english-grammar.com/present-perfect-with-for-and-since.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Perfect',
                url: 'https://www.native-english.ru/grammar/present-perfect',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I've lived here since five years</s> → <em>for</em> five years",
              "<s>She's known him for 2019</s> → she's known him <em>since</em> 2019",
              '<s>How long did you live here?</s> → How long <em>have</em> you lived here? (продолжается сейчас)',
            ],
            markers: {
              tags: [
                'for two hours',
                'for a week',
                'for years',
                'for a long time',
                'for ages',
                'for months',
                'since Monday',
                'since 2019',
                'since I was a child',
                'since last year',
                'since then',
                'since this morning',
                'How long...?',
              ],
              note: 'for + период времени; since + начальная точка. Оба используются с Present Perfect (Simple и Continuous).',
            },
          },
          {
            id: 'b1_05',
            text: 'Present Perfect Continuous: have been + V-ing',
            note: 'I have been waiting for an hour. She has been studying all day.',
            exp: `<strong>Present Perfect Continuous</strong> = have/has been + V-ing
<br><br>Акцент на <strong>продолжительности</strong> или незавершённости действия. Отвечает на вопрос «Как долго?»
<br>Часто объясняет видимый результат в настоящем: <em>You look tired — have you been running?</em>
<br><br>Разница с Present Perfect Simple:
<br>• <em>I've read 50 pages.</em> — результат, завершённость
<br>• <em>I've been reading all evening.</em> — акцент на процессе`,
            ex: [
              ["I've been learning English for two years.", 'Я учу английский уже два года.'],
              [
                "Why are your hands dirty? — I've been fixing the car.",
                'Почему у тебя грязные руки? — Чинил машину.',
              ],
            ],
            links: [
              {
                label: 'OK English: PPC (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/present-perfect-continuous.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Present Perfect Continuous',
                url: 'https://www.native-english.ru/grammar/present-perfect-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I've been learning since three hours</s> → <em>for</em> three hours",
              "<s>I've been read all evening</s> → I've been <em>reading</em>",
              "<s>I've been know her for years</s> → know — stative verb, используем Present Perfect Simple",
            ],
            markers: {
              tags: [
                'for',
                'since',
                'How long...?',
                'all day',
                'all morning',
                'all evening',
                'all week',
                'lately',
                'recently',
                'these days',
                'still',
              ],
              note: 'Present Perfect Continuous акцентирует продолжительность, а не результат.',
            },
          },
        ],
      },
      {
        name: 'Прошедшие времена',
        rules: [
          {
            id: 'b1_06',
            text: 'Past Continuous: was/were + V-ing',
            note: 'I was reading at 8pm. They were talking all evening.',
            exp: `<strong>Past Continuous</strong> = was/were + V-ing
<br><br>Значения:
<br>1. Действие в <strong>процессе</strong> в конкретный момент прошлого: <em>At 9pm I was having dinner.</em>
<br>2. <strong>Фоновое действие</strong>, прерванное другим: <em>I was walking when it started to rain.</em>
<br>3. Параллельные действия: <em>While she was cooking, he was watching TV.</em>`,
            ex: [
              ['It was raining when I left home.', 'Когда я выходил из дома, шёл дождь.'],
              ['What were you doing at 7 yesterday?', 'Что ты делал вчера в 7?'],
            ],
            links: [
              {
                label: 'OK English: Past Continuous (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Perfect English Grammar',
                url: 'https://www.perfect-english-grammar.com/past-continuous.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Continuous',
                url: 'https://www.native-english.ru/grammar/past-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She was walk</s> → She was <em>walking</em>',
              '<s>They was talking</s> → They <em>were</em> talking',
              '<s>I was work at 9pm</s> → I was <em>working</em>',
            ],
            markers: {
              tags: [
                'at 8pm yesterday',
                'at this time last week',
                'all morning',
                'all day',
                'all evening',
                'while',
                'when (+ Past Simple)',
                'as',
                'at that moment',
                'in the middle of',
                'during',
              ],
              note: 'while/as → фон (Past Continuous); when → событие (Past Simple).',
            },
          },
          {
            id: 'b1_07',
            text: 'Past Simple vs Past Continuous — фон и событие',
            note: 'While I was cooking, he called. I was walking when it started to rain.',
            exp: `Типичная конструкция: длинное фоновое действие (Past Continuous) + короткое событие (Past Simple).
<br><br>Союзы:
<br>• <em>when</em> — используется с Past Simple для события: <em>She was sleeping when the alarm went off.</em>
<br>• <em>while/as</em> — используется с Past Continuous для фона: <em>While I was watching TV, the power went out.</em>`,
            ex: [
              [
                'She was having a bath when the phone rang.',
                'Она принимала ванну, когда зазвонил телефон.',
              ],
              [
                'While he was giving his speech, someone fell asleep.',
                'Пока он произносил речь, кто-то заснул.',
              ],
            ],
            links: [
              {
                label: 'Past Simple vs Continuous',
                url: 'https://www.perfect-english-grammar.com/past-simple-or-past-continuous.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Continuous',
                url: 'https://www.native-english.ru/grammar/past-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>While I cooked, he called</s> → While I <em>was cooking</em>, he called (фон = Continuous)',
              '<s>I was walking when it was starting to rain</s> → when it <em>started</em> (событие = Past Simple)',
            ],
            markers: {
              tags: ['while', 'as', 'when', 'at the moment when', 'just as', 'during'],
              note: 'while + Past Continuous (фон) + when + Past Simple (событие).',
            },
          },
        ],
      },
      {
        name: 'Условные предложения',
        rules: [
          {
            id: 'b1_08',
            text: '0-й тип: If + Present, Present — факты и законы',
            note: 'If you heat water to 100°C, it boils.',
            exp: `Нулевой тип — для научных фактов, законов природы, общих истин. Оба действия всегда происходят вместе.
<br><br>Форма: <em>If + Present Simple, Present Simple</em>
<br>Вместо <em>if</em> можно <em>when</em>: <em>When you mix red and blue, you get purple.</em>`,
            ex: [
              ['If you heat ice, it melts.', 'Если нагреть лёд, он тает.'],
              ['If it rains, the streets get wet.', 'Если идёт дождь, улицы намокают.'],
            ],
            links: [
              {
                label: 'Conditionals overview',
                url: 'https://www.perfect-english-grammar.com/conditionals.html',
                type: 'en',
              },
              {
                label: 'Skyeng: условные предложения',
                url: 'https://skyeng.ru/exercises/conditionals/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>If you heat water, it will boil</s> → it <em>boils</em> (нулевой тип — Present + Present)',
              '<s>When you mix them, you will get</s> → you <em>get</em>',
            ],
          },
          {
            id: 'b1_09',
            text: '1-й тип: If + Present Simple, will — реальное будущее',
            note: "If it rains tomorrow, I'll stay home.",
            exp: `Реальная, вероятная ситуация в будущем.
<br><br>Форма: <em>If + Present Simple, will + инфинитив</em>
<br>⚠️ В <em>if</em>-части — НИКОГДА не Future! Только Present Simple.
<br><br>Вместо <em>will</em> в главной части можно: <em>can, may, might, should</em>.
<br>Части можно поменять: <em>I'll stay home if it rains.</em> (без запятой)`,
            ex: [
              [
                "If she studies hard, she'll pass the exam.",
                'Если она будет хорошо учиться, она сдаст экзамен.',
              ],
              ['If you need help, I can come.', 'Если нужна помощь, я могу прийти.'],
            ],
            links: [
              {
                label: 'OK English: 1st conditional (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'First conditional',
                url: 'https://www.perfect-english-grammar.com/first-conditional.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>If it will rain</s> → If it <em>rains</em> (в if-части НЕТ will!)',
              '<s>If she will study hard, she passes</s> → If she studies, she <em>will pass</em>',
            ],
          },
          {
            id: 'b1_10',
            text: '2-й тип: If + Past Simple, would — нереальное настоящее',
            note: 'If I had a car, I would drive to work. If I were you...',
            exp: `Нереальная или маловероятная ситуация в настоящем или будущем.
<br><br>Форма: <em>If + Past Simple, would + инфинитив</em>
<br>⚠️ Глагол в <em>if</em>-части — Past Simple, но значение — <strong>настоящее/будущее</strong>!
<br>⚠️ <em>were</em> используется для всех лиц: <em>If I were you, If she were here</em> — это стандарт формального языка.`,
            ex: [
              [
                'If I won the lottery, I would travel the world.',
                'Если бы я выиграл в лотерею, я бы объездил мир.',
              ],
              [
                "If I were taller, I'd play basketball.",
                'Если бы я был выше, я бы играл в баскетбол.',
              ],
            ],
            links: [
              {
                label: 'OK English: 2nd conditional (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Second conditional',
                url: 'https://www.perfect-english-grammar.com/second-conditional.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>If I would have a car</s> → If I <em>had</em> a car',
              '<s>If I was you</s> → If I <em>were</em> you (формально)',
              '<s>I would can do it</s> → I <em>could</em> do it (нельзя два модальных)',
            ],
          },
          {
            id: 'b1_11',
            text: '1-й тип vs 2-й тип: реальное vs маловероятное',
            note: 'If I win (1st, реально) vs If I won (2nd, вряд ли)',
            exp: `Выбор типа отражает <strong>твою уверенность</strong> в реальности ситуации.
<br><br>• <em>If I see her</em> (1-й тип) — я ожидаю её увидеть
<br>• <em>If I saw her</em> (2-й тип) — маловероятно или я просто фантазирую
<br><br>Это не разница в грамматике, а разница в отношении говорящего.`,
            ex: [
              [
                "If it rains tomorrow, I'll take an umbrella. (реально возможно)",
                'Если завтра будет дождь, я возьму зонт.',
              ],
              [
                "If it rained every day, I'd move to Spain. (маловероятная фантазия)",
                'Если бы шёл дождь каждый день, я переехал бы в Испанию.',
              ],
            ],
            links: [
              {
                label: '1st vs 2nd conditional',
                url: 'https://www.perfect-english-grammar.com/first-or-second-conditional.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              'Путаница 1-го и 2-го типа: <em>If I win</em> (реально) vs <em>If I won</em> (маловероятно)',
              '<s>If I won, I will buy</s> → нельзя смешивать: <em>would buy</em>',
            ],
          },
        ],
      },
      {
        name: 'Страдательный залог (Passive)',
        rules: [
          {
            id: 'b1_12',
            text: 'Passive Voice — Present Simple: is/are + V3',
            note: 'Coffee is grown in Brazil. The car is made in Germany.',
            exp: `<strong>Страдательный залог</strong> используется, когда:
<br>• Важно само действие, а не тот, кто его совершает
<br>• Исполнитель неизвестен или очевиден
<br><br>Форма Present Simple Passive: <em>am/is/are + V3</em>
<br>Исполнитель (если нужен) добавляется с <em>by</em>: <em>The window was broken by the ball.</em>`,
            ex: [
              ['English is spoken in many countries.', 'На английском говорят во многих странах.'],
              ['The letter is written in French.', 'Письмо написано по-французски.'],
            ],
            links: [
              {
                label: 'OK English: Passive Voice (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Passive Voice overview',
                url: 'https://www.perfect-english-grammar.com/passive.html',
                type: 'en',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/passive/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: пассивный залог',
                url: 'https://www.native-english.ru/grammar/passive-voice',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Coffee is grew in Brazil</s> → Coffee is <em>grown</em>',
              '<s>The letter wrote in French</s> → The letter <em>is written</em>',
              '<s>English spoke here</s> → English <em>is spoken</em>',
            ],
          },
          {
            id: 'b1_13',
            text: 'Passive Voice — Past Simple: was/were + V3',
            note: 'The bridge was built in 1890. They were arrested.',
            exp: `Past Simple Passive: <em>was/were + V3</em>
<br>• <em>was</em> — ед. число
<br>• <em>were</em> — мн. число
<br><br>Активный → Пассивный: <em>Someone stole my car.</em> → <em>My car was stolen.</em>`,
            ex: [
              ['The Eiffel Tower was built in 1889.', 'Эйфелева башня была построена в 1889 году.'],
              ['Three people were injured in the accident.', 'В аварии пострадали три человека.'],
            ],
            links: [
              {
                label: 'Past Passive exercise',
                url: 'https://www.perfect-english-grammar.com/passive-exercise-1.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: пассивный залог',
                url: 'https://www.native-english.ru/grammar/passive-voice',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The bridge was build in 1890</s> → was <em>built</em>',
              '<s>They was arrested</s> → They <em>were</em> arrested',
              '<s>The car stolen</s> → The car <em>was</em> stolen',
            ],
          },
          {
            id: 'b1_14',
            text: 'Passive Voice — Present Perfect: has/have been + V3',
            note: 'The car has been repaired. All invitations have been sent.',
            exp: `Present Perfect Passive: <em>has/have been + V3</em>
<br><br>Используется когда важен результат в настоящем, а не то, когда именно это произошло.`,
            ex: [
              ['The project has been completed.', 'Проект завершён.'],
              ['All the guests have been informed.', 'Всех гостей уведомили.'],
            ],
            links: [
              {
                label: 'Perfect Passive exercise',
                url: 'https://www.perfect-english-grammar.com/passive-exercise-2.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: пассивный залог',
                url: 'https://www.native-english.ru/grammar/passive-voice',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The project has been complete</s> → has been <em>completed</em>',
              '<s>It have been sent</s> → It <em>has</em> been sent',
              '<s>All guests have been inform</s> → have been <em>informed</em>',
            ],
          },
        ],
      },
      {
        name: 'Косвенная речь',
        rules: [
          {
            id: 'b1_15',
            text: 'Reported Speech — сдвиг времён',
            note: '"I am tired." → He said he was tired.',
            exp: `При переводе в косвенную речь времена «сдвигаются» назад:
<br>• Present Simple → Past Simple: <em>"I work" → he said he worked</em>
<br>• Past Simple → Past Perfect: <em>"I went" → she said she had gone</em>
<br>• Present Perfect → Past Perfect: <em>"I've seen" → he said he had seen</em>
<br>• will → would; can → could; is → was; am going → was going`,
            ex: [
              ["She said: 'I am leaving.' → She said she was leaving.", 'Она сказала, что уходит.'],
              [
                "He told me: 'I can't come.' → He told me he couldn't come.",
                'Он сказал, что не может прийти.',
              ],
            ],
            links: [
              {
                label: 'OK English: Reported Speech (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Reported Speech',
                url: 'https://www.perfect-english-grammar.com/reported-speech.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: косвенная речь',
                url: 'https://www.native-english.ru/grammar/indirect-speech',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>He said he is tired</s> → He said he <em>was</em> tired (сдвиг времени)',
              '<s>She told that she was late</s> → She told <em>me/us/him</em> that... (tell требует объект)',
              '<s>He said me that</s> → He <em>told me</em> that / He <em>said</em> that',
            ],
          },
          {
            id: 'b1_16',
            text: 'Reported questions — косвенные вопросы',
            note: '"Where do you live?" → She asked where I lived.',
            exp: `В косвенных вопросах:
<br>1. <strong>Нет инверсии</strong> (порядок слов как в утверждении)
<br>2. <strong>Нет вспомогательного do/did</strong>
<br>3. Общие вопросы (Yes/No) → <em>if/whether + подлежащее + глагол</em>`,
            ex: [
              ['"Where do you work?" → She asked where I worked.', 'Она спросила, где я работаю.'],
              [
                '"Are you married?" → He wanted to know if I was married.',
                'Он хотел знать, женат ли я.',
              ],
            ],
            links: [
              {
                label: 'Reported questions',
                url: 'https://www.perfect-english-grammar.com/reported-questions.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: косвенная речь',
                url: 'https://www.native-english.ru/grammar/indirect-speech',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She asked where do I live</s> → she asked where I <em>lived</em> (нет инверсии!)',
              '<s>He asked me what was I doing</s> → what I <em>was doing</em>',
              '<s>She asked if was I tired</s> → if I <em>was</em> tired',
            ],
          },
          {
            id: 'b1_17',
            text: 'say vs tell в косвенной речи',
            note: 'He said that... / He told me that... — после tell нужно лицо!',
            exp: `<em>say</em> — без обязательного дополнения: <em>She said she was tired.</em>
<br><em>tell</em> — ВСЕГДА с дополнением (кому сказано): <em>She told me she was tired.</em>
<br><br>❌ <s>He told that he was late.</s> ✓ <em>He said that he was late.</em>`,
            ex: [
              ['She said she needed help.', 'Она сказала, что ей нужна помощь.'],
              ['He told us the meeting was cancelled.', 'Он сообщил нам, что встреча отменена.'],
            ],
            links: [
              {
                label: 'Say or tell',
                url: 'https://www.perfect-english-grammar.com/say-or-tell.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: косвенная речь',
                url: 'https://www.native-english.ru/grammar/indirect-speech',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>He told that he was late</s> → He <em>said</em> that / He <em>told me</em> that',
              '<s>She said me the news</s> → She <em>told</em> me the news',
              '<s>They told about the problem</s> → They <em>talked</em> about it / <em>said</em> something about it',
            ],
          },
        ],
      },
      {
        name: 'Герундий и инфинитив',
        rules: [
          {
            id: 'b1_18',
            text: 'Глаголы + герундий (V-ing)',
            note: 'I enjoy reading. She finished writing. He avoided making mistakes.',
            exp: `Эти глаголы требуют после себя герундий (V-ing):
<br><em>enjoy, finish, avoid, mind, suggest, keep, consider, deny, imagine, miss, practise, risk, admit, delay, dislike, fancy, give up, involve, put off, recommend, resist</em>
<br><br>Приём для запоминания: если можно заменить «процессом» — скорее всего герундий.`,
            ex: [
              ['I enjoy swimming in the sea.', 'Мне нравится купаться в море.'],
              ["She's considering moving abroad.", 'Она думает о переезде за рубеж.'],
              ['He avoided making eye contact.', 'Он избегал зрительного контакта.'],
            ],
            links: [
              {
                label: 'Gerunds after verbs',
                url: 'https://www.perfect-english-grammar.com/gerunds.html',
                type: 'en',
              },
              {
                label: 'Skyeng упражнения',
                url: 'https://skyeng.ru/exercises/gerund-infinitive/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: герундий',
                url: 'https://www.native-english.ru/grammar/gerund',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I enjoy to swim</s> → I enjoy <em>swimming</em>',
              '<s>She finished to write</s> → She finished <em>writing</em>',
              '<s>He avoided to make</s> → He avoided <em>making</em>',
            ],
          },
          {
            id: 'b1_19',
            text: 'Глаголы + инфинитив (to + V)',
            note: 'I want to go. She decided to stay. He managed to finish.',
            exp: `Эти глаголы требуют инфинитив с <em>to</em>:
<br><em>want, decide, hope, plan, manage, agree, promise, refuse, fail, expect, offer, learn, need, afford, arrange, attempt, choose, claim, demand, deserve, help, pretend, tend, threaten</em>`,
            ex: [
              ['She decided to quit her job.', 'Она решила уволиться.'],
              ['I hope to see you soon.', 'Надеюсь скоро увидеться.'],
              ['He failed to answer.', 'Он не смог ответить.'],
            ],
            links: [
              {
                label: 'Infinitives after verbs',
                url: 'https://www.perfect-english-grammar.com/infinitives.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: инфинитив',
                url: 'https://www.native-english.ru/grammar/infinitive',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She decided going</s> → She decided <em>to go</em>',
              '<s>He wants going out</s> → He wants <em>to go</em> out',
              '<s>I hope seeing you</s> → I hope <em>to see</em> you',
            ],
          },
          {
            id: 'b1_20',
            text: 'Глаголы с обоими (like, love, hate, start, begin)',
            note: 'I like reading = I like to read — небольшая разница',
            exp: `После <em>like/love/hate/prefer</em> оба варианта возможны:
<br>• V-ing — говорим о действии в целом: <em>I love cooking.</em> (мне вообще нравится готовить)
<br>• to-inf — говорим о конкретном случае: <em>I'd like to cook tonight.</em>
<br><br>После <em>start/begin/continue/cease</em> — разницы практически нет.`,
            ex: [
              ['I love travelling / to travel.', 'Мне нравится путешествовать.'],
              ['She started working / to work here in May.', 'Она начала работать здесь в мае.'],
            ],
            links: [
              {
                label: 'Gerund or infinitive',
                url: 'https://www.perfect-english-grammar.com/gerund-or-infinitive.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: герундий',
                url: 'https://www.native-english.ru/grammar/gerund',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I'd like cooking tonight</s> → I'd like <em>to cook</em> tonight (конкретный случай)",
              '<s>She started to working</s> → She started <em>working</em> или <em>to work</em>',
            ],
          },
          {
            id: 'b1_21',
            text: 'used to — прошлые привычки и состояния',
            note: 'I used to play football. She used to have long hair.',
            exp: `<em>used to</em> — регулярные действия или состояния в прошлом, которые уже прекратились.
<br><br>Форма: <em>used to + инфинитив</em>
<br>Отрицание: <em>didn't use to</em>
<br>Вопрос: <em>Did you use to...?</em>
<br><br>⚠️ Нет формы настоящего времени! Нельзя: <s>I use to</s> для настоящего.
<br>Отличие от <em>be used to</em>: <em>I am used to waking up early</em> = я привык (сейчас).`,
            ex: [
              ['I used to smoke, but I stopped.', 'Я раньше курил, но бросил.'],
              ['Did you use to play an instrument?', 'Ты раньше играл на инструменте?'],
            ],
            links: [
              {
                label: 'OK English: used to (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Used to',
                url: 'https://www.perfect-english-grammar.com/used-to.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: used to',
                url: 'https://www.native-english.ru/grammar/modal-verb-used-to',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I use to play football</s> → I <em>used to</em> play',
              '<s>Did you used to...?</s> → Did you <em>use to</em>...? (после did — базовая форма)',
              '<s>I used to living there</s> → I used to <em>live</em> (инфинитив без to+ing)',
            ],
          },
        ],
      },
      {
        name: 'Придаточные предложения',
        rules: [
          {
            id: 'b1_22',
            text: 'Относительные придаточные: who, which, that, where, whose',
            note: 'The man who called. The book that I read. The place where we met.',
            exp: `<em>who</em> — для людей: <em>The woman who called is my sister.</em>
<br><em>which</em> — для предметов и животных: <em>The book which I borrowed was great.</em>
<br><em>that</em> — для людей и предметов (в определяющих придаточных): <em>The car that he bought is new.</em>
<br><em>where</em> — для мест: <em>The café where we met is closed.</em>
<br><em>whose</em> — принадлежность: <em>The girl whose bag was stolen...</em>
<br><br>В разговорной речи местоимение часто опускается, если оно — дополнение: <em>The film (that) I saw...</em>`,
            ex: [
              [
                'The man who lives next door is very friendly.',
                'Мужчина, который живёт по соседству, очень дружелюбный.',
              ],
              [
                'The hotel where we stayed had a pool.',
                'Отель, в котором мы жили, был с бассейном.',
              ],
            ],
            links: [
              {
                label: 'Relative clauses',
                url: 'https://www.perfect-english-grammar.com/relative-clauses.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: относительные местоимения',
                url: 'https://www.native-english.ru/grammar/relative-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The man which called</s> → the man <em>who</em> called (who для людей)',
              '<s>The place who we met</s> → the place <em>where</em> we met',
              "<s>The girl who's bag</s> → the girl <em>whose</em> bag",
            ],
          },
          {
            id: 'b1_23',
            text: 'Союзы контраста: although, however, despite, in spite of, whereas',
            note: 'Although it was raining, we went out. Despite the rain, we went.',
            exp: `<em>although / even though / though</em> + придаточное предложение.
<br><em>despite / in spite of</em> + существительное / герундий (НЕ придаточное!).
<br><em>however</em> + новое предложение (после точки или точки с запятой).
<br><em>whereas</em> — противопоставление двух фактов.`,
            ex: [
              [
                'Although she was tired, she kept working.',
                'Хотя она устала, она продолжала работать.',
              ],
              [
                'Despite the rain, he cycled to work.',
                'Несмотря на дождь, он поехал на работу на велосипеде.',
              ],
              [
                'It was expensive. However, it was worth it.',
                'Это было дорого. Тем не менее оно того стоило.',
              ],
            ],
            links: [
              {
                label: 'Although/despite/however',
                url: 'https://www.perfect-english-grammar.com/although-despite-however.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сложноподчинённые',
                url: 'https://www.native-english.ru/grammar/complex-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Despite it was raining</s> → Despite <em>the rain</em> / Despite <em>raining</em> (существительное/герундий!)',
              '<s>Although the rain, we went</s> → Although <em>it was raining</em> (although + предложение)',
            ],
          },
        ],
      },
      {
        name: 'Будущие времена — продвинутые',
        rules: [
          {
            id: 'b1_24',
            text: 'Future Continuous: will be + V-ing',
            note: "I'll be working at 9 tomorrow. She'll be flying over the Atlantic.",
            exp: `<strong>Future Continuous</strong> = <em>will be + V-ing</em>
<br><br>Значения:
<br>1. Действие, которое будет <strong>в процессе</strong> в конкретный момент будущего: <em>At this time tomorrow, I'll be lying on the beach.</em>
<br>2. Плановое, ожидаемое действие в будущем (естественный ход событий): <em>I'll be seeing her tomorrow anyway.</em>
<br>3. Вежливые вопросы о планах (без нажима): <em>Will you be coming to the party?</em>`,
            ex: [
              ["Don't call at 8 — I'll be having dinner.", 'Не звони в 8 — я буду ужинать.'],
              [
                "This time next week I'll be sitting on a beach.",
                'В это же время на следующей неделе я буду сидеть на пляже.',
              ],
            ],
            links: [
              {
                label: 'Future Continuous',
                url: 'https://www.perfect-english-grammar.com/future-continuous.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Future Continuous',
                url: 'https://www.native-english.ru/grammar/future-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I'll be work at 9</s> → I'll be <em>working</em>",
              '<s>She will working</s> → She <em>will be working</em>',
            ],
            markers: {
              tags: [
                'at this time tomorrow',
                'this time next week',
                'at 8pm tomorrow',
                'tomorrow morning',
                'all day tomorrow',
                'in two hours',
                'when you arrive (+ Future Continuous)',
                'while you are sleeping',
              ],
              note: 'Часто используется для вежливых вопросов о планах: Will you be using the car?',
            },
          },
          {
            id: 'b1_25',
            text: 'Future Perfect: will have + V3',
            note: 'By Friday I will have finished the report. By 2030 they will have built the bridge.',
            exp: `<strong>Future Perfect</strong> = <em>will have + V3</em>
<br><br>Действие, которое завершится <strong>до</strong> определённого момента в будущем.
<br>Часто употребляется с <em>by (the time), before</em>: <em>By the time you arrive, I will have cooked dinner.</em>`,
            ex: [
              ["I'll have finished this book by Sunday.", 'К воскресенью я дочитаю эту книгу.'],
              [
                'By 2050, scientists will have found a cure.',
                'К 2050 году учёные найдут лекарство.',
              ],
            ],
            links: [
              {
                label: 'Future Perfect',
                url: 'https://www.perfect-english-grammar.com/future-perfect.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Future Perfect',
                url: 'https://www.native-english.ru/grammar/future-perfect',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>By Friday I will finish</s> → I <em>will have finished</em> (завершится к сроку = Future Perfect)',
              "<s>I'll have finish by Sunday</s> → I'll have <em>finished</em>",
            ],
            markers: {
              tags: [
                'by tomorrow',
                'by Friday',
                'by the end of the week',
                'by the end of the year',
                'by 2030',
                'by the time you arrive',
                'before you get here',
                'before midnight',
                'in two hours (= by then)',
              ],
              note: 'by (the time) — ключевой маркер: действие завершится ДО этого момента.',
            },
          },
        ],
      },
      {
        name: 'Придаточные цели и причины',
        rules: [
          {
            id: 'b1_26',
            text: 'Придаточные цели: to, in order to, so that, so as to',
            note: 'I study hard to pass. She left early so that she could catch the train.',
            exp: `<em>to / in order to / so as to</em> + инфинитив — цель. <em>In order to</em> и <em>so as to</em> чуть формальнее.
<br><em>so that</em> + подлежащее + глагол — цель с другим подлежащим или с модальным.
<br><br>⚠️ Отрицание: <em>in order not to / so as not to</em> (не <s>to not</s>).`,
            ex: [
              [
                'She studies hard in order to get a scholarship.',
                'Она усердно учится, чтобы получить стипендию.',
              ],
              [
                'He left early so that he could catch the last train.',
                'Он ушёл рано, чтобы успеть на последний поезд.',
              ],
            ],
            links: [
              {
                label: 'Purpose clauses',
                url: 'https://www.perfect-english-grammar.com/purpose-clauses.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сложноподчинённые',
                url: 'https://www.native-english.ru/grammar/complex-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I study hard for passing</s> → I study hard <em>to pass</em>',
              '<s>She left early for that she could catch the train</s> → <em>so that</em> she could',
              '<s>In order to not upset him</s> → <em>in order not to</em> upset him',
            ],
          },
          {
            id: 'b1_27',
            text: 'Фразовые глаголы — основные',
            note: 'give up, look up, turn off, find out, get on, put off, carry on',
            exp: `Фразовые глаголы = глагол + частица (предлог или наречие). Значение часто идиоматично.
<br><br>Самые частотные:
<br>• <em>give up</em> = бросить, сдаться
<br>• <em>find out</em> = узнать, выяснить
<br>• <em>turn on/off</em> = включить/выключить
<br>• <em>look up</em> = посмотреть (в словаре/интернете)
<br>• <em>look after</em> = заботиться
<br>• <em>put off</em> = откладывать
<br>• <em>carry on</em> = продолжать
<br>• <em>get on/along</em> = ладить (с кем-то)
<br>• <em>bring up</em> = воспитывать; поднять тему
<br>• <em>come across</em> = наткнуться`,
            ex: [
              ["I've given up smoking.", 'Я бросил курить.'],
              [
                "Can you look after my cat while I'm away?",
                'Ты можешь присмотреть за моей кошкой, пока меня нет?',
              ],
              ['We need to find out what happened.', 'Нам нужно выяснить, что произошло.'],
            ],
            links: [
              {
                label: 'Phrasal verbs list',
                url: 'https://www.perfect-english-grammar.com/phrasal-verbs.html',
                type: 'en',
              },
              {
                label: 'Skyeng: фразовые глаголы',
                url: 'https://skyeng.ru/exercises/phrasal-verbs/',
                type: 'ru',
              },
              {
                label: 'native-english.ru: классификация глаголов',
                url: 'https://www.native-english.ru/grammar/english-verbs',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She gave up to smoke</s> → She gave up <em>smoking</em>',
              '<s>I looked up the word in</s> → I looked <em>it</em> up (местоимение между глаголом и частицей)',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'B2',
    name: 'B2 — Выше среднего',
    sub: 'Upper-Intermediate · 5–8 месяцев',
    color: 'var(--b2)',
    colorBg: 'var(--b2bg)',
    categories: [
      {
        name: 'Past Perfect',
        rules: [
          {
            id: 'b2_01',
            text: 'Past Perfect Simple: had + V3',
            note: 'By the time she arrived, he had already left.',
            exp: `<strong>Past Perfect</strong> — действие, завершившееся <strong>до</strong> другого момента или события в прошлом.
<br><br>Форма: <em>had + V3</em> для всех лиц.
<br>Отрицание: <em>hadn't + V3</em>
<br>Вопрос: <em>Had + подлежащее + V3?</em>
<br><br>Типичные союзы: <em>before, after, when, by the time, already, just, never</em>`,
            ex: [
              ['When I arrived, she had already left.', 'Когда я приехал, она уже ушла.'],
              [
                'He had never seen snow before that winter.',
                'Он никогда раньше не видел снег до той зимы.',
              ],
            ],
            links: [
              {
                label: 'OK English: Past Perfect (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Past Perfect',
                url: 'https://www.perfect-english-grammar.com/past-perfect.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Perfect',
                url: 'https://www.native-english.ru/grammar/past-perfect',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>When I arrived, she already left</s> → she <em>had already left</em>',
              '<s>He had never see snow</s> → He had never <em>seen</em> snow',
              '<s>I had went</s> → I had <em>gone</em>',
            ],
            markers: {
              tags: [
                'by the time',
                'before',
                'after',
                'when (+ Past Simple)',
                'already',
                'just',
                'never',
                'ever',
                'by Monday',
                'by then',
                'as soon as',
                'once',
                'until',
                'hardly...when',
                'no sooner...than',
              ],
              note: 'Past Perfect показывает, что одно прошлое действие произошло РАНЬШЕ другого.',
            },
          },
          {
            id: 'b2_02',
            text: 'Past Perfect Continuous: had been + V-ing',
            note: 'He had been waiting for two hours when she arrived.',
            exp: `<strong>Past Perfect Continuous</strong> = had been + V-ing
<br>Акцент на <strong>продолжительности</strong> действия, которое происходило до другого момента в прошлом.
<br>Часто объясняет причину или видимый результат в прошлом.`,
            ex: [
              [
                "She was exhausted — she'd been working all night.",
                'Она была измотана — она работала всю ночь.',
              ],
              [
                'How long had you been waiting before she arrived?',
                'Как долго ты ждал до её прихода?',
              ],
            ],
            links: [
              {
                label: 'Past Perfect Continuous',
                url: 'https://www.perfect-english-grammar.com/past-perfect-continuous.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: Past Perfect Continuous',
                url: 'https://www.native-english.ru/grammar/past-perfect-continuous',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She was exhausted — she had been work</s> → she had been <em>working</em>',
              '<s>How long had you waiting?</s> → How long had you <em>been waiting</em>?',
            ],
            markers: {
              tags: [
                'for',
                'since',
                'How long...?',
                'all morning',
                'all day',
                'by the time',
                'when',
                'before',
                'already for...',
                'for two hours when she arrived',
              ],
              note: 'Акцент на продолжительности до момента в прошлом. Часто объясняет причину состояния.',
            },
          },
        ],
      },
      {
        name: 'Модальные для прошлого',
        rules: [
          {
            id: 'b2_03',
            text: 'must have + V3 — уверенный вывод о прошлом',
            note: 'She must have forgotten. — я уверен, это единственное объяснение',
            exp: `<em>must have + V3</em> = я уверен, что это произошло (единственное логичное объяснение).
<br><br>Шкала уверенности:
<br>• <em>must have done</em> — почти наверняка случилось
<br>• <em>should have done</em> — ожидалось, что случится
<br>• <em>may/might have done</em> — возможно случилось
<br>• <em>can't have done</em> — наверняка не случилось`,
            ex: [
              [
                'You must have been exhausted after that journey.',
                'Ты, должно быть, очень устал после этой поездки.',
              ],
              [
                'She must have left early — her coat is gone.',
                'Она, видимо, ушла рано — её пальто пропало.',
              ],
            ],
            links: [
              {
                label: 'OK English: модальные прошлого (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Modals of deduction past',
                url: 'https://www.perfect-english-grammar.com/modals-of-deduction-past.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: модальные глаголы',
                url: 'https://www.native-english.ru/grammar/modal-verbs',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She must forgot</s> → She must <em>have forgotten</em>',
              '<s>He must have leave early</s> → He must have <em>left</em>',
              '<s>You must be exhausted yesterday</s> — для прошлого: <em>must have been</em>',
            ],
          },
          {
            id: 'b2_04',
            text: "can't have + V3 — невозможность в прошлом",
            note: "She can't have said that! He can't have been there.",
            exp: `<em>can't have + V3</em> = я уверен, что этого <strong>не произошло</strong> (это невозможно).
<br>Противоположность <em>must have done</em>.`,
            ex: [
              [
                "He can't have seen her — she was abroad.",
                'Он не мог её видеть — она была за границей.',
              ],
              ["That can't have been the right address.", 'Это не мог быть правильный адрес.'],
            ],
            links: [
              {
                label: "Can't have done",
                url: 'https://www.perfect-english-grammar.com/modals-of-deduction-past.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: can/could',
                url: 'https://www.native-english.ru/grammar/modal-verb-can',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>She can't forgot that</s> → She can't <em>have forgotten</em>",
              "<s>He couldn't have been there</s> — это правильно! can't have = невозможность; couldn't have = возможность",
            ],
          },
          {
            id: 'b2_05',
            text: 'should have + V3 — упрёк и сожаление',
            note: "I should have called. You shouldn't have said that.",
            exp: `<em>should have + V3</em> = было бы правильно сделать, но не сделал (сожаление, упрёк).
<br><em>shouldn't have + V3</em> = не следовало делать.
<br><br>Это очень употребительная конструкция для выражения сожаления и критики.`,
            ex: [
              ['I should have brought an umbrella.', 'Надо было взять зонт.'],
              ["She shouldn't have told him the secret.", 'Ей не следовало говорить ему секрет.'],
            ],
            links: [
              {
                label: 'Should have done',
                url: 'https://www.perfect-english-grammar.com/should-have-done.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: should',
                url: 'https://www.native-english.ru/grammar/modal-verb-should',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I should called her</s> → I should <em>have called</em>',
              "<s>She shouldn't have went</s> → She shouldn't have <em>gone</em>",
              '<s>You should have study</s> → You should have <em>studied</em>',
            ],
          },
          {
            id: 'b2_06',
            text: 'might / could have + V3 — возможность в прошлом',
            note: 'She might have forgotten. It could have been worse.',
            exp: `<em>might/could have + V3</em> = возможно это произошло (мы не знаем точно).
<br><br>Также: <em>could have done</em> = мог бы сделать (но не сделал): <em>I could have won if I had tried harder.</em>`,
            ex: [
              ['She might have forgotten about the meeting.', 'Возможно, она забыла о встрече.'],
              ['He could have left through the back door.', 'Он мог выйти через заднюю дверь.'],
            ],
            links: [
              {
                label: 'Might have done',
                url: 'https://www.perfect-english-grammar.com/modals-of-deduction-past.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: may/might',
                url: 'https://www.native-english.ru/grammar/modal-verb-may',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She might forgot</s> → She might <em>have forgotten</em>',
              '<s>He could have win</s> → He could have <em>won</em>',
            ],
          },
        ],
      },
      {
        name: '3-й тип условного и смешанные',
        rules: [
          {
            id: 'b2_07',
            text: '3-й тип условного: If + Past Perfect, would have + V3',
            note: 'If I had studied harder, I would have passed.',
            exp: `Нереальная ситуация в <strong>прошлом</strong> — говорим о том, чего не случилось.
<br><br>Форма: <em>If + Past Perfect, would have + V3</em>
<br><br>Оба элемента нереальны:
<br>• Условие не выполнилось
<br>• Результата тоже не было`,
            ex: [
              [
                'If she had taken the medicine, she would have recovered.',
                'Если бы она приняла лекарство, она бы выздоровела.',
              ],
              [
                "If he hadn't left early, he would have met her.",
                'Если бы он не ушёл рано, он бы встретил её.',
              ],
            ],
            links: [
              {
                label: 'OK English: 3rd conditional (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Third conditional',
                url: 'https://www.perfect-english-grammar.com/third-conditional.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>If I studied harder, I would have passed</s> → If I <em>had studied</em>... (3-й тип — Past Perfect!)',
              '<s>If she had taken medicine, she would recovered</s> → she would <em>have recovered</em>',
            ],
          },
          {
            id: 'b2_08',
            text: 'Смешанные условные (mixed conditionals)',
            note: 'If I had studied, I would be fluent now. (прошлое → настоящее)',
            exp: `Смешанные условные соединяют разные временные планы:
<br><br>1. <strong>Прошлое условие → настоящий результат</strong>:
<br><em>If + Past Perfect, would + инфинитив</em>
<br><em>If I had taken that job, I would be in New York now.</em>
<br><br>2. <strong>Настоящее условие → прошлый результат</strong>:
<br><em>If + Past Simple, would have + V3</em>
<br><em>If she were more careful, she wouldn't have broken it.</em>`,
            ex: [
              [
                'If I had studied medicine, I would be a doctor now.',
                'Если бы я учился на врача, я был бы врачом сейчас.',
              ],
            ],
            links: [
              {
                label: 'Mixed conditionals',
                url: 'https://www.perfect-english-grammar.com/mixed-conditionals.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>If I had studied, I would be fluent yesterday</s> — смешанный тип о прошлом→настоящему, не прошлому',
              "<s>If she were careful, she didn't break it</s> → she <em>wouldn't have broken</em> it",
            ],
          },
        ],
      },
      {
        name: 'Страдательный залог — продвинутый',
        rules: [
          {
            id: 'b2_09',
            text: 'Future Passive и Passive с модальными',
            note: 'It will be done. It must be fixed. It should be checked.',
            exp: `Модальный + Passive: <em>modal + be + V3</em>
<br>• <em>will be done</em> — будет сделано
<br>• <em>must be done</em> — должно быть сделано
<br>• <em>should be done</em> — следует сделать
<br>• <em>can be done</em> — может быть сделано`,
            ex: [
              ['The report will be published tomorrow.', 'Отчёт будет опубликован завтра.'],
              [
                'This mistake must be corrected immediately.',
                'Эта ошибка должна быть немедленно исправлена.',
              ],
            ],
            links: [
              {
                label: 'Passive with modals',
                url: 'https://www.perfect-english-grammar.com/passive.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: пассивный залог',
                url: 'https://www.native-english.ru/grammar/passive-voice',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The report will published</s> → will <em>be</em> published',
              '<s>It must done</s> → It must <em>be done</em>',
              '<s>It should be do</s> → It should be <em>done</em>',
            ],
          },
          {
            id: 'b2_10',
            text: 'Causative have/get: have something done',
            note: 'I had my hair cut. She got her car fixed.',
            exp: `<em>have/get + объект + V3</em> — вы заказываете услугу или кто-то делает что-то за вас.
<br><br>Сравни:
<br>• <em>I cut my hair.</em> — я сам подстриг (что нетипично)
<br>• <em>I had my hair cut.</em> — подстрижен парикмахером
<br><br><em>get</em> чуть более разговорный, <em>have</em> чуть формальнее.`,
            ex: [
              ['I need to have my teeth checked.', 'Мне нужно проверить зубы у врача.'],
              [
                'She had her house painted last spring.',
                'Прошлой весной она покрасила дом (наняв рабочих).',
              ],
            ],
            links: [
              {
                label: 'Have something done',
                url: 'https://www.perfect-english-grammar.com/have-something-done.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: пассивный залог',
                url: 'https://www.native-english.ru/grammar/passive-voice',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I cut my hair at the hairdresser</s> → I <em>had</em> my hair cut',
              '<s>She got her car to fix</s> → She got her car <em>fixed</em>',
            ],
          },
          {
            id: 'b2_11',
            text: 'Passive reporting verbs: It is said that... / He is believed to...',
            note: 'It is thought that prices will rise. She is known to be honest.',
            exp: `Два варианта конструкции с глаголами <em>say, think, believe, report, know, expect, consider</em>:
<br><br>1. <em>It + passive + that + придаточное</em>: <em>It is believed that...</em>
<br>2. <em>Подлежащее + is + V3 + to-infinitive</em>: <em>She is believed to be...</em>
<br><br>Используется в новостях и официальных текстах.`,
            ex: [
              [
                'It is reported that three people were injured.',
                'Сообщается, что три человека получили ранения.',
              ],
              ['He is thought to have left the country.', 'Считается, что он покинул страну.'],
            ],
            links: [
              {
                label: 'Passive reporting verbs',
                url: 'https://www.perfect-english-grammar.com/passive-reporting-verbs.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: пассивный залог',
                url: 'https://www.native-english.ru/grammar/passive-voice',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>It is said that prices will risen</s> → will <em>rise</em>',
              '<s>He is believed to being honest</s> → He is believed <em>to be</em> honest',
            ],
          },
        ],
      },
      {
        name: 'Герундий — нюансы',
        rules: [
          {
            id: 'b2_12',
            text: 'remember / forget + V-ing vs to-inf — разница в значении',
            note: 'I remember locking it (факт прошлого) vs Remember to lock it (задача)',
            exp: `<em>remember/forget + V-ing</em> — о прошлом событии, которое помним/забыли.
<br><em>remember/forget + to-inf</em> — о задаче: не забыть сделать что-то в будущем.`,
            ex: [
              [
                'I remember meeting her at a conference. (это было)',
                'Я помню, что встретил её на конференции.',
              ],
              ['Remember to call your mother! (нужно сделать)', 'Не забудь позвонить маме!'],
              ['I forgot to buy milk. (не сделал)', 'Я забыл купить молоко.'],
            ],
            links: [
              {
                label: 'Remember/forget',
                url: 'https://www.perfect-english-grammar.com/gerund-or-infinitive-exercise-1.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: герундий',
                url: 'https://www.native-english.ru/grammar/gerund',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I remember to lock it</s> (если факт прошлого) → I remember <em>locking</em> it',
              '<s>Remember locking it!</s> (задача) → Remember <em>to lock</em> it!',
              '<s>I forgot doing the homework</s> (если не сделал) → I forgot <em>to do</em> the homework',
            ],
          },
          {
            id: 'b2_13',
            text: 'stop / regret / mean + V-ing vs to-inf',
            note: 'She stopped smoking (бросила) vs She stopped to smoke (остановилась, чтобы)',
            exp: `<em>stop + V-ing</em> — прекратить действие.
<br><em>stop + to-inf</em> — остановиться, чтобы сделать что-то другое.
<br><br><em>regret + V-ing</em> — сожалеть о прошлом.
<br><em>regret + to-inf</em> — с сожалением сообщать (формально): <em>I regret to inform you...</em>
<br><br><em>mean + V-ing</em> — означать: <em>This means working harder.</em>
<br><em>mean + to-inf</em> — намереваться: <em>I meant to call you.</em>`,
            ex: [
              ['He stopped smoking last year.', 'Он бросил курить в прошлом году.'],
              ['She stopped to look at the view.', 'Она остановилась, чтобы полюбоваться видом.'],
            ],
            links: [
              {
                label: 'Stop/regret/mean',
                url: 'https://www.perfect-english-grammar.com/gerund-or-infinitive.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: герундий',
                url: 'https://www.native-english.ru/grammar/gerund',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She stopped to smoke</s> (если бросила) → She stopped <em>smoking</em>',
              '<s>She stopped smoking to answer</s> (остановилась чтобы) → She stopped <em>to answer</em>',
            ],
          },
        ],
      },
      {
        name: 'Wish и сослагательное',
        rules: [
          {
            id: 'b2_14',
            text: 'wish + Past Simple — желание изменить настоящее',
            note: 'I wish I knew the answer. I wish I had more time.',
            exp: `<em>wish + Past Simple</em> — о нереальном желании в настоящем.
<br>Форма такая же, как в 2-м типе условного. Для <em>to be</em> — <em>were</em> (формально), хотя <em>was</em> тоже используется.`,
            ex: [
              ['I wish I spoke better English.', 'Жаль, что я не говорю по-английски лучше.'],
              [
                'She wishes she lived in a warmer country.',
                'Ей бы хотелось жить в более тёплой стране.',
              ],
            ],
            links: [
              {
                label: 'OK English: wish (видео)',
                url: 'https://ok-english.ru/video-free/',
                type: 'yt',
              },
              {
                label: 'Wish',
                url: 'https://www.perfect-english-grammar.com/wish.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сослагательное наклонение',
                url: 'https://www.native-english.ru/grammar/subjunctive-mood',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I wish I know the answer</s> → I wish I <em>knew</em>',
              '<s>I wish I was taller</s> — возможно, но формально: <em>I wish I were taller</em>',
              '<s>I wish I would know</s> — с would только о других: <em>I wish you would listen</em>',
            ],
          },
          {
            id: 'b2_15',
            text: 'wish + Past Perfect — сожаление о прошлом',
            note: "I wish I had studied harder. I wish I hadn't said that.",
            exp: '<em>wish + Past Perfect</em> — сожаление о прошлых событиях, которые уже нельзя изменить. Форма как в 3-м типе условного.',
            ex: [
              ["I wish I hadn't eaten so much.", 'Жаль, что я так много съел.'],
              [
                'She wishes she had taken that job offer.',
                'Ей жаль, что она не приняла то предложение о работе.',
              ],
            ],
            links: [
              {
                label: 'Wish + Past Perfect',
                url: 'https://www.perfect-english-grammar.com/wish.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сослагательное наклонение',
                url: 'https://www.native-english.ru/grammar/subjunctive-mood',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I wish I didn't say that</s> → I wish I <em>hadn't said</em> (сожаление о прошлом = Past Perfect)",
              '<s>I wish she had took that job</s> → she had <em>taken</em>',
            ],
          },
          {
            id: 'b2_16',
            text: 'wish + would — желание изменить чужое поведение',
            note: 'I wish you would stop talking. I wish it would warm up.',
            exp: `<em>wish + would</em> — раздражение из-за чужого поведения или желание изменить ситуацию.
<br>⚠️ Нельзя использовать о себе: <s>I wish I would</s> — только о других лицах или погоде/ситуации.`,
            ex: [
              ['I wish you would listen to me.', 'Я бы хотел, чтобы ты меня слушал.'],
              ['I wish it would stop raining.', 'Хотелось бы, чтобы дождь прекратился.'],
            ],
            links: [
              {
                label: 'Wish + would',
                url: 'https://www.perfect-english-grammar.com/wish.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: would',
                url: 'https://www.native-english.ru/grammar/modal-verb-would',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I wish I would stop</s> (о себе) → нельзя! Используй: <em>I wish I could stop</em>',
              '<s>I wish you stop talking</s> → I wish you <em>would stop</em>',
            ],
          },
        ],
      },
      {
        name: 'Относительные придаточные — нюансы',
        rules: [
          {
            id: 'b2_17',
            text: 'Определяющие vs неопределяющие придаточные',
            note: 'The man who called (определяет какой) vs My brother, who called, (добавляет инфо)',
            exp: `<strong>Определяющие</strong> (defining): без запятых — уточняют, о ком/чём речь. Местоимение можно заменить на <em>that</em>. Нельзя убрать без потери смысла.
<br><br><strong>Неопределяющие</strong> (non-defining): с запятыми — добавляют информацию, не меняя смысла. <em>That</em> <strong>нельзя</strong> использовать. Можно убрать.
<br><br>⚠️ <em>which</em> в неопределяющих может относиться ко всему предложению: <em>She passed the exam, which surprised everyone.</em>`,
            ex: [
              [
                'The film that I told you about is on tonight. (какой именно)',
                'Фильм, о котором я тебе говорил, идёт сегодня вечером.',
              ],
              [
                'My sister, who lives in Paris, is visiting next week. (доп. инфо)',
                'Моя сестра, которая живёт в Париже, приедет на следующей неделе.',
              ],
            ],
            links: [
              {
                label: 'Relative clauses defining/non-defining',
                url: 'https://www.perfect-english-grammar.com/relative-clauses.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: относительные местоимения',
                url: 'https://www.native-english.ru/grammar/relative-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>My brother, that called, is a doctor</s> → My brother, <em>who</em> called (в неопределяющем нельзя that)',
              '<s>The man who lives next door, is very kind</s> → без запятой (определяющее придаточное)',
            ],
          },
          {
            id: 'b2_18',
            text: 'Предлоги в относительных придаточных',
            note: 'the person I work with / the person with whom I work (формально)',
            exp: `В разговорной речи предлог стоит в конце: <em>the house I grew up in.</em>
<br>В письменной/формальной речи предлог перед <em>which/whom</em>: <em>the house in which I grew up.</em>
<br><br>После предлога — только <em>which</em> (для вещей) и <em>whom</em> (для людей). Никогда <em>that</em>!`,
            ex: [
              [
                "The project I'm working on is fascinating. (разг.)",
                'Проект, над которым я работаю, очень интересный.',
              ],
              ['The project on which I am working is fascinating. (форм.)', ''],
            ],
            links: [
              {
                label: 'Prepositions in relative clauses',
                url: 'https://www.perfect-english-grammar.com/relative-clauses.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: относительные местоимения',
                url: 'https://www.native-english.ru/grammar/relative-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The house which I grew up in it</s> → лишнее <em>it</em>',
              '<s>The person which I spoke</s> → the person I spoke <em>to</em>',
            ],
          },
        ],
      },
      {
        name: 'Связующие слова и союзы',
        rules: [
          {
            id: 'b2_19',
            text: 'Союзы следствия: so... that, such... that, therefore, as a result',
            note: 'It was so cold that we stayed inside. She worked hard; therefore, she passed.',
            exp: `<em>so + прилагательное/наречие + that</em>: <em>He spoke so quickly that nobody understood.</em>
<br><em>such + (a/an) + прилагательное + существительное + that</em>: <em>It was such a long film that I fell asleep.</em>
<br><br>Связующие слова результата (между предложениями): <em>therefore, consequently, as a result, hence, thus</em>.`,
            ex: [
              [
                'It was such a good book that I read it twice.',
                'Книга была такой хорошей, что я прочитал её дважды.',
              ],
              [
                'She missed the deadline; consequently, she lost the contract.',
                'Она пропустила дедлайн; как следствие, потеряла контракт.',
              ],
            ],
            links: [
              {
                label: 'So and such',
                url: 'https://www.perfect-english-grammar.com/so-and-such.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сложноподчинённые',
                url: 'https://www.native-english.ru/grammar/complex-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>It was so cold that we stayed</s> — правильно! Но: <s>It was such cold that</s> → It was such <em>a cold day</em>',
              '<s>Such was great his relief</s> → So great was his relief (с прилагательным — so)',
            ],
          },
          {
            id: 'b2_20',
            text: 'be used to / get used to + V-ing — привычка (настоящая)',
            note: "I'm used to waking up early. She's getting used to the cold.",
            exp: `<em>be used to + V-ing / noun</em> = быть привыкшим (уже привык).
<br><em>get used to + V-ing / noun</em> = привыкать (процесс привыкания).
<br><br>⚠️ Не путать с <em>used to + инфинитив</em> (прошлые привычки).
<br>• <em>I used to live in Paris.</em> — раньше жил (уже нет)
<br>• <em>I am used to living in big cities.</em> — привык жить в больших городах`,
            ex: [
              ["I'm not used to getting up so early.", 'Я не привык вставать так рано.'],
              [
                'It took time, but she got used to the new system.',
                'Понадобилось время, но она привыкла к новой системе.',
              ],
            ],
            links: [
              {
                label: 'Used to / be used to',
                url: 'https://www.perfect-english-grammar.com/used-to.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: used to',
                url: 'https://www.native-english.ru/grammar/modal-verb-used-to',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I'm used to wake up early</s> → I'm used to <em>waking</em> up (be used to + V-ing)",
              '<s>I get used to woke up</s> → I get used to <em>waking</em> up',
            ],
          },
        ],
      },
      {
        name: 'Расширенные модальные и Future in the Past',
        rules: [
          {
            id: 'b2_21',
            text: 'Future in the Past: would / was going to',
            note: 'She said she would call. He was going to leave.',
            exp: `<strong>Future in the Past</strong> — конструкции, выражающие будущее с точки зрения прошлого. Используются в косвенной речи и нарративе.
<br><br>• <em>would + V</em> (из will): <em>She said she would come.</em>
<br>• <em>was/were going to + V</em>: <em>He was going to call but forgot.</em>
<br>• <em>was about to + V</em>: <em>She was about to leave when he arrived.</em>`,
            ex: [
              ['She promised she would be there.', 'Она обещала, что придёт.'],
              [
                'He was about to leave when she called.',
                'Он собирался уходить, когда она позвонила.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: Future in the Past',
                url: 'https://www.native-english.ru/grammar/future-in-the-past',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She said she will come</s> → She said she <em>would</em> come (сдвиг времени)',
              '<s>He was going to called</s> → He was going to <em>call</em>',
            ],
          },
          {
            id: 'b2_22',
            text: 'be to — официальное назначение и предписание',
            note: 'You are to report by Monday. They were never to meet again.',
            exp: `<em>be to + инфинитив</em> — официальные распоряжения, плановые события и судьба в нарративе.
<br><br>1. Официальное предписание: <em>Passengers are to remain seated.</em>
<br>2. Официальный план: <em>The summit is to take place next month.</em>
<br>3. Судьба в нарративе: <em>They were never to meet again.</em>`,
            ex: [
              ['You are to submit the report by Friday.', 'Вы должны сдать отчёт к пятнице.'],
              [
                'She was to become one of the greatest scientists of her time.',
                'Ей суждено было стать одним из величайших учёных.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: be to',
                url: 'https://www.native-english.ru/grammar/modal-verb-be-to',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>You be to submit</s> → You <em>are</em> to submit',
              '<s>She was be never to meet</s> → She was <em>never</em> to meet',
            ],
          },
          {
            id: 'b2_23',
            text: 'ought to — моральный долг и логическое ожидание',
            note: 'You ought to apologise. She ought to have told us.',
            exp: `<em>ought to</em> — моральная обязанность или логическое ожидание. Сильнее <em>should</em>.
<br>Всегда с to: <em>ought to go</em> (в отличие от should).
<br>Для прошлого: <em>ought to have + V3</em> — упрёк или сожаление.`,
            ex: [
              [
                'You ought to apologise for what you said.',
                'Тебе следует извиниться за то, что ты сказал.',
              ],
              ['She ought to have told us earlier.', 'Ей следовало сказать нам раньше.'],
            ],
            links: [
              {
                label: 'native-english.ru: ought to',
                url: 'https://www.native-english.ru/grammar/modal-verb-ought-to',
                type: 'ru',
              },
              {
                label: 'Ought to',
                url: 'https://www.perfect-english-grammar.com/ought-to.html',
                type: 'en',
              },
            ],
            mistakes: [
              '<s>You ought apologise</s> → You ought <em>to</em> apologise (ought всегда с to!)',
              '<s>She ought have told us</s> → She ought <em>to have</em> told us',
            ],
          },
          {
            id: 'b2_24',
            text: 'need — модальный и обычный глагол',
            note: "You needn't worry. / She doesn't need to come.",
            exp: `<em>need</em> как модальный (формальный, в вопросах/отрицаниях) и как обычный глагол.
<br><br><strong>Модальный</strong> (без -s, без to):
<br>• <em>You needn't worry.</em> / <em>Need I explain?</em>
<br><br><strong>Обычный need + to</strong>:
<br>• <em>She doesn't need to come.</em>`,
            ex: [
              ["You needn't fill in both forms.", 'Не нужно заполнять обе формы.'],
              [
                "She doesn't need to attend every meeting.",
                'Ей не обязательно присутствовать на каждом собрании.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: need',
                url: 'https://www.native-english.ru/grammar/modal-verb-need',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>You needn't to worry</s> → You needn't worry (модальный needn't без to)",
              '<s>She need come</s> → She <em>needs</em> to come (обычный need + to)',
            ],
          },
          {
            id: 'b2_25',
            text: 'dare — смелость и вызов',
            note: "How dare you! I daren't ask. She dared to challenge him.",
            exp: `<em>dare</em> — отважиться, осмелиться. Модальный в риторических вопросах и отрицаниях.
<br><br><strong>Модальный</strong>: <em>How dare you! / I daren't ask. / Dare I say...</em>
<br><strong>Обычный</strong>: <em>She didn't dare to look. / He dared to challenge the boss.</em>
<br><br>⚠️ <em>I dare say</em> = пожалуй, вероятно (устойчивое выражение).`,
            ex: [
              ['How dare you speak to me like that!', 'Как ты смеешь так со мной разговаривать!'],
              [
                'She dared to express her opinion openly.',
                'Она осмелилась открыто высказать своё мнение.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: dare',
                url: 'https://www.native-english.ru/grammar/modal-verb-dare',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>How dare you to say</s> → How dare you say (после dare без to)',
              '<s>I dare say it</s> — это нормально; <em>I dare say</em> = пожалуй',
            ],
          },
        ],
      },
      {
        name: 'Местоимения, существительные и числа',
        rules: [
          {
            id: 'b2_26',
            text: 'Возвратные местоимения: myself, yourself, himself...',
            note: 'I hurt myself. She did it herself. They enjoyed themselves.',
            exp: `<em>myself, yourself, himself, herself, itself, ourselves, yourselves, themselves</em>.
<br><br>1. Действие направлено на субъект: <em>He cut himself.</em>
<br>2. Эмфаза (сам/сама, без помощи): <em>I did it myself.</em>
<br><br>Устойчивые: <em>by myself</em> = в одиночку; <em>help yourself</em> = угощайся.`,
            ex: [
              ['She taught herself to play the guitar.', 'Она сама научила себя играть на гитаре.'],
              ['The machine turns itself off automatically.', 'Машина автоматически выключается.'],
            ],
            links: [
              {
                label: 'native-english.ru: возвратные местоимения',
                url: 'https://www.native-english.ru/grammar/reflexive-pronouns',
                type: 'ru',
              },
              {
                label: 'Reflexive pronouns',
                url: 'https://www.perfect-english-grammar.com/reflexive-pronouns.html',
                type: 'en',
              },
            ],
            mistakes: [
              '<s>She taught her to play</s> (если сама себя) → She taught <em>herself</em> to play',
              '<s>They enjoyed themself</s> → They enjoyed <em>themselves</em>',
              '<s>I did it by my own</s> → I did it <em>by myself</em>',
            ],
          },
          {
            id: 'b2_27',
            text: 'Собирательные существительные: team, family, committee...',
            note: 'The team are playing well. (BrE) / The team is playing. (AmE)',
            exp: `Собирательные существительные — группа как единое целое.
<br><br>• <strong>BrE</strong>: обычно мн. число: <em>The team are playing.</em>
<br>• <strong>AmE</strong>: обычно ед. число: <em>The team is playing.</em>
<br><br>Частые: <em>team, family, government, committee, staff, audience, crew, police, army, public, management</em>`,
            ex: [
              [
                'The government have announced new measures. (BrE)',
                'Правительство объявило о новых мерах.',
              ],
              ['The audience were on their feet. (BrE)', 'Зрители вскочили на ноги.'],
            ],
            links: [
              {
                label: 'native-english.ru: собирательные существительные',
                url: 'https://www.native-english.ru/grammar/collective-nouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The police is here</s> → The police <em>are</em> here (мн. число в BrE)',
              '<s>The team is playing well</s> — верно в AmE; <em>are</em> верно в BrE',
            ],
          },
          {
            id: 'b2_28',
            text: 'Дробные числительные и математика',
            note: 'a half, three quarters, 5.7 = five point seven, 25%',
            exp: `Дроби: <em>½ = a half; ⅓ = a third; ¼ = a quarter; ¾ = three quarters; ⅔ = two thirds</em>.
<br>Числитель — количественное, знаменатель — порядковое (мн. если числитель > 1).
<br><br>Десятичные: точка (не запятая): <em>3.14 = three point one four</em>.
<br>Математика: <em>+ = plus; - = minus; × = times; ÷ = divided by; = = equals</em>.`,
            ex: [
              [
                'Three quarters of students passed the exam.',
                'Три четверти студентов сдали экзамен.',
              ],
              [
                'The inflation rate fell to 2.5 percent.',
                'Уровень инфляции снизился до 2,5 процента.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: дробные числительные',
                url: 'https://www.native-english.ru/grammar/fractional-numerals',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Two third of students</s> → Two <em>thirds</em> of students',
              '<s>3,14</s> → 3<em>.</em>14 (точка, не запятая)',
              '<s>25 percents</s> → 25 <em>percent</em> (без s)',
            ],
          },
          {
            id: 'b2_29',
            text: 'Степени сравнения наречий',
            note: 'faster, more carefully, best, worse, further',
            exp: `Наречия образуют степени сравнения по тем же правилам, что и прилагательные.
<br><br>• Односложные: + <em>er/est</em>: <em>fast→faster, hard→harder, early→earlier</em>
<br>• Большинство на <em>-ly</em>: <em>more/most</em>: <em>carefully→more carefully→most carefully</em>
<br>• Неправильные: <em>well→better→best, badly→worse→worst, far→further→furthest, little→less→least, much→more→most</em>`,
            ex: [
              ['She spoke more confidently than before.', 'Она говорила увереннее, чем раньше.'],
              ['He works hardest in the team.', 'Он работает усерднее всех в команде.'],
            ],
            links: [
              {
                label: 'native-english.ru: степени сравнения наречий',
                url: 'https://www.native-english.ru/grammar/adverbs-degrees-of-comparison',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She sings more beautiful</s> → She sings more <em>beautifully</em>',
              '<s>He runs more fast</s> → He runs <em>faster</em>',
              '<s>She works most hardly</s> → She works <em>hardest</em>',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'C1',
    name: 'C1 — Продвинутый',
    sub: 'Advanced · 8–12 месяцев',
    color: 'var(--c1)',
    colorBg: 'var(--c1bg)',
    categories: [
      {
        name: 'Инверсия (Inversion)',
        rules: [
          {
            id: 'c1_01',
            text: 'Инверсия с отрицательными наречиями',
            note: 'Never have I seen this. Rarely does she complain.',
            exp: `Для эмфазы отрицательное наречие/выражение выносится в начало → вспомогательный глагол перед подлежащим (порядок слов как в вопросе).
<br><br>Слова, запускающие инверсию: <em>never, rarely, seldom, little, hardly, scarcely, barely, not only, only, no sooner</em>`,
            ex: [
              [
                'Never have I seen anything so beautiful.',
                'Никогда я не видел ничего столь прекрасного.',
              ],
              ['Rarely does she make a mistake.', 'Она редко ошибается.'],
              ['Little did I know what was coming.', 'Я и не подозревал, что меня ждёт.'],
            ],
            links: [
              {
                label: 'Inversion',
                url: 'https://www.perfect-english-grammar.com/inversion.html',
                type: 'en',
              },
              {
                label: 'British Council: inversion',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/inversion',
                type: 'en',
              },
              {
                label: 'native-english.ru: инверсия',
                url: 'https://www.native-english.ru/grammar/inversion',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Never I have seen</s> → Never <em>have I seen</em> (инверсия: вспомогательный перед подлежащим)',
              '<s>Rarely she complains</s> → Rarely <em>does she</em> complain',
            ],
          },
          {
            id: 'c1_02',
            text: 'Not only... but also с инверсией',
            note: 'Not only did he apologise, but he also offered to help.',
            exp: `<em>Not only + инверсия в первой части</em>, вторая часть — обычный порядок.
<br>Используется для усиления: выражает, что что-то пошло дальше ожидаемого.`,
            ex: [
              [
                'Not only is she talented, but she is also very hard-working.',
                'Она не только талантлива, но и очень трудолюбива.',
              ],
              [
                'Not only did they arrive late, but they also forgot the documents.',
                'Они не только опоздали, но и забыли документы.',
              ],
            ],
            links: [
              {
                label: 'Not only but also',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/inversion',
                type: 'en',
              },
              {
                label: 'native-english.ru: инверсия',
                url: 'https://www.native-english.ru/grammar/inversion',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Not only he apologised</s> → Not only <em>did he</em> apologise',
              '<s>Not only she is talented but also is hardworking</s> → but <em>she</em> is also hardworking (вторая часть — обычный порядок)',
            ],
          },
          {
            id: 'c1_03',
            text: 'Hardly / Scarcely / No sooner + инверсия',
            note: 'Hardly had I sat down when the phone rang.',
            exp: `Конструкции немедленной последовательности:
<br>• <em>Hardly/Scarcely + had + подлежащее + V3 + when/before + Past Simple</em>
<br>• <em>No sooner + had + подлежащее + V3 + than + Past Simple</em>`,
            ex: [
              [
                'Hardly had she arrived when it started to rain.',
                'Она едва приехала, как начался дождь.',
              ],
              [
                'No sooner had I sat down than someone knocked at the door.',
                'Я только сел, как кто-то постучал в дверь.',
              ],
            ],
            links: [
              {
                label: 'Hardly/Scarcely',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/inversion',
                type: 'en',
              },
              {
                label: 'native-english.ru: инверсия',
                url: 'https://www.native-english.ru/grammar/inversion',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Hardly I had sat</s> → Hardly <em>had I</em> sat',
              '<s>No sooner I sat than</s> → No sooner <em>had I sat</em> than',
            ],
          },
          {
            id: 'c1_04',
            text: 'Инверсия в условных: Had / Were / Should',
            note: 'Had I known (= If I had known). Were I you (= If I were you).',
            exp: `Формальный стиль — исключает <em>if</em>, использует инверсию:
<br>• <em>Had + подлежащее + V3</em> = If + Past Perfect (3-й тип)
<br>• <em>Were + подлежащее (+ to + инфинитив)</em> = If + Past Simple (2-й тип)
<br>• <em>Should + подлежащее + инфинитив</em> = If (маловероятное, 1-й тип)`,
            ex: [
              ['Had she told me, I would have helped.', 'Скажи она мне, я бы помог.'],
              ['Were I in your position, I would accept.', 'На вашем месте я бы согласился.'],
              [
                'Should you need assistance, please call us.',
                'Если вам потребуется помощь, позвоните нам.',
              ],
            ],
            links: [
              {
                label: 'Inversion in conditionals',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/inversion',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Have I known, I would have helped</s> → <em>Had</em> I known',
              '<s>Should you need help, please to call</s> → please <em>call</em> (без to после please)',
            ],
          },
        ],
      },
      {
        name: 'Клефт-предложения',
        rules: [
          {
            id: 'c1_05',
            text: 'It-cleft: It was John who called.',
            note: 'Для выделения любого члена предложения',
            exp: `Структура: <em>It + to be + выделяемый элемент + who/that/which + остальное</em>
<br>Переносит фокус внимания на выделяемый элемент.
<br><br>• Для людей — <em>who</em>; для вещей/обстоятельств — <em>that/which</em>.`,
            ex: [
              [
                'It was the noise that woke me up. (не шум вообще, именно этот)',
                'Именно шум разбудил меня.',
              ],
              ['It is hard work that leads to success.', 'Именно упорный труд ведёт к успеху.'],
            ],
            links: [
              {
                label: 'Cleft sentences',
                url: 'https://www.perfect-english-grammar.com/cleft-sentences.html',
                type: 'en',
              },
              {
                label: 'British Council: cleft',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/cleft-sentences',
                type: 'en',
              },
              {
                label: 'native-english.ru: порядок слов',
                url: 'https://www.native-english.ru/grammar/word-order',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>It was John who he called</s> → It was John who called (лишнее he)',
              '<s>It was the noise which woke me</s> — правильно, но <em>that</em> предпочтительнее для вещей',
            ],
          },
          {
            id: 'c1_06',
            text: 'Wh-cleft: What surprised me was the price.',
            note: 'What I need is rest. What she said shocked everyone.',
            exp: `Структура: <em>What + придаточное + to be + выделяемый элемент</em>
<br>Подчёркивает важность элемента, вводимого в конце.`,
            ex: [
              [
                'What I love about London is the diversity.',
                'Больше всего в Лондоне мне нравится разнообразие.',
              ],
              [
                'What he did was completely unexpected.',
                'То, что он сделал, было совершенно неожиданным.',
              ],
            ],
            links: [
              {
                label: 'Cleft sentences',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/cleft-sentences',
                type: 'en',
              },
              {
                label: 'native-english.ru: порядок слов',
                url: 'https://www.native-english.ru/grammar/word-order',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>What I love it is London</s> → What I love <em>is</em> London (лишнее it)',
              '<s>What surprised me were the price</s> → What surprised me <em>was</em> the price (ед. число)',
            ],
          },
        ],
      },
      {
        name: 'Сослагательное наклонение',
        rules: [
          {
            id: 'c1_07',
            text: 'Формальное сослагательное после глаголов требования',
            note: 'I suggest he leave. It is vital that she be informed.',
            exp: `После <em>suggest, recommend, insist, demand, propose, request, require, ask, advise, order + that</em> — базовая форма глагола для <strong>всех лиц</strong> (без <em>-s</em>, без <em>was</em>).
<br><br>Британский вариант часто использует <em>should</em> вместо сослагательного: <em>I suggest that he should leave.</em>
<br>Американский — чаще чистое сослагательное.`,
            ex: [
              ['I recommend that he see a doctor.', 'Я рекомендую ему обратиться к врачу.'],
              [
                'It is essential that all students attend the meeting.',
                'Крайне важно, чтобы все студенты присутствовали на собрании.',
              ],
            ],
            links: [
              {
                label: 'Subjunctive',
                url: 'https://www.perfect-english-grammar.com/subjunctive.html',
                type: 'en',
              },
              {
                label: 'British Council: subjunctive',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/subjunctive',
                type: 'en',
              },
              {
                label: 'native-english.ru: сослагательное наклонение',
                url: 'https://www.native-english.ru/grammar/subjunctive-mood',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I suggest that he leaves</s> → I suggest that he <em>leave</em> (сослагательное — без -s!)',
              '<s>It is essential that she is informed</s> → that she <em>be</em> informed',
            ],
          },
          {
            id: 'c1_08',
            text: "It's high time + Past Simple",
            note: "It's high time you went to bed. It's time we left.",
            exp: `<em>It's (high/about) time + подлежащее + Past Simple</em>
<br>Значение: настоящее/будущее — говорим о том, что давно нужно было сделать.
<br><em>high time</em> — ещё сильнее: уже давно пора!`,
            ex: [
              ["It's time she found a new job.", 'Ей давно пора найти новую работу.'],
              ["It's high time you apologised.", 'Уже давно пора извиниться.'],
            ],
            links: [
              {
                label: "It's time",
                url: 'https://www.perfect-english-grammar.com/subjunctive.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сослагательное наклонение',
                url: 'https://www.native-english.ru/grammar/subjunctive-mood',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>It's high time you will go</s> → It's high time you <em>went</em> (Past Simple!)",
              "<s>It's high time for you go</s> → It's high time <em>you went</em>",
            ],
          },
          {
            id: 'c1_09',
            text: 'as if / as though + сослагательное',
            note: 'She talks as if she knew everything. He looked as though he had seen a ghost.',
            exp: `<em>as if / as though + Past Simple</em> — нереальное сравнение в настоящем.
<br><em>as if / as though + Past Perfect</em> — нереальное сравнение о прошлом.`,
            ex: [
              [
                'He spends money as if he were a millionaire.',
                'Он тратит деньги, как будто он миллионер.',
              ],
              [
                'She spoke as though she had met him before.',
                'Она говорила так, как будто уже встречала его раньше.',
              ],
            ],
            links: [
              {
                label: 'As if / as though',
                url: 'https://www.perfect-english-grammar.com/subjunctive.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сослагательное наклонение',
                url: 'https://www.native-english.ru/grammar/subjunctive-mood',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She talks as if she knows everything</s> (нереальная ситуация) → as if she <em>knew</em>',
              '<s>He looked as if he seen a ghost</s> → as if he <em>had seen</em>',
            ],
          },
        ],
      },
      {
        name: 'Эллипсис и замещение',
        rules: [
          {
            id: 'c1_10',
            text: 'So / Neither + вспомогательный глагол + подлежащее',
            note: 'So do I. Neither does she. So am I.',
            exp: `<em>So + вспомогательный + подлежащее</em> — согласие с утвердительным.
<br><em>Neither/Nor + вспомогательный + подлежащее</em> — согласие с отрицательным.
<br>Вспомогательный глагол должен совпадать со временем исходного предложения.`,
            ex: [
              ['I love jazz. So does she.', 'Я люблю джаз. Она тоже.'],
              ["I haven't been to Rome. Neither have I.", 'Я не был в Риме. Я тоже.'],
            ],
            links: [
              {
                label: 'So / Neither',
                url: 'https://www.perfect-english-grammar.com/so-neither.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сложносочинённые',
                url: 'https://www.native-english.ru/grammar/compound-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>So I do</s> → <em>So do I</em> (вспомогательный перед подлежащим)',
              '<s>Neither she does</s> → <em>Neither does she</em>',
              '<s>I love jazz. So she does too</s> → <em>So does she</em>',
            ],
          },
          {
            id: 'c1_11',
            text: "I think so / I hope so / I'm afraid so",
            note: 'Will it rain? — I think so. / I hope not.',
            exp: `<em>so</em> заменяет придаточное предложение после: <em>think, hope, suppose, expect, believe, imagine, be afraid</em>.
<br>Отрицательная форма: <em>not</em> (не <em>so not</em>!).`,
            ex: [
              [
                "Will he come? — I think so. / I don't think so.",
                'Он придёт? — Думаю, да. / Не думаю.',
              ],
              ["Is it expensive? — I'm afraid so.", 'Это дорого? — Боюсь, что да.'],
              ['Is it closed? — I hope not.', 'Закрыто? — Надеюсь, что нет.'],
            ],
            links: [
              {
                label: 'I think so / I hope so',
                url: 'https://www.perfect-english-grammar.com/so-not.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: сложносочинённые',
                url: 'https://www.native-english.ru/grammar/compound-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I think so not</s> → I don't think so",
              '<s>I hope so not</s> → I hope <em>not</em>',
            ],
          },
        ],
      },
      {
        name: 'Придаточные — продвинутый',
        rules: [
          {
            id: 'c1_12',
            text: 'Включающие vs невключающие придаточные',
            note: 'The man who called is my brother. VS My brother, who called, is a doctor.',
            exp: `<strong>Включающее (defining)</strong>: уточняет, о ком/чём речь — без запятых. <em>that</em> можно. Местоимение можно опустить если оно дополнение.
<br><br><strong>Невключающее (non-defining)</strong>: добавляет информацию — обязательны запятые. Только <em>who/which</em> (не <em>that</em>!). Местоимение нельзя опускать.`,
            ex: [
              [
                'The film that won the Oscar was brilliant. (определяет, о каком фильме речь)',
                'Фильм, который выиграл Оскар, был великолепен.',
              ],
              [
                'Avatar, which came out in 2009, was a huge hit. (доп. факт о и так известном фильме)',
                'Аватар, вышедший в 2009, стал большим хитом.',
              ],
            ],
            links: [
              {
                label: 'Defining vs non-defining',
                url: 'https://www.perfect-english-grammar.com/defining-and-non-defining-relative-clauses.html',
                type: 'en',
              },
              {
                label: 'British Council',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/relative-clauses-advanced',
                type: 'en',
              },
              {
                label: 'native-english.ru: относительные местоимения',
                url: 'https://www.native-english.ru/grammar/relative-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The film that won the Oscar, was brilliant</s> → без запятой (определяющее придаточное)',
              '<s>Avatar, that came out in 2009</s> → Avatar, <em>which</em> came out (в неопределяющем нельзя that!)',
            ],
          },
          {
            id: 'c1_13',
            text: 'Предлог + which/whom в формальном стиле',
            note: 'The company for which I work. The person with whom I spoke.',
            exp: `Формальный стиль: <em>предлог + which/whom</em> перед относительным местоимением.
<br>Неформальный эквивалент: предлог в конец предложения.
<br><em>whom</em> — формальная объектная форма <em>who</em>.`,
            ex: [
              [
                'The report to which I referred is attached. (формально)',
                'Упомянутый мной отчёт прилагается.',
              ],
              ['The report which I referred to is attached. (нейтрально)', ''],
              ['The report I referred to is attached. (разговорно)', ''],
            ],
            links: [
              {
                label: 'Relative clauses advanced',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/relative-clauses-advanced',
                type: 'en',
              },
              {
                label: 'native-english.ru: относительные местоимения',
                url: 'https://www.native-english.ru/grammar/relative-pronouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>The company which I work for it</s> → лишнее it',
              '<s>The person who I spoke</s> → the person I spoke <em>to</em> / to <em>whom</em> I spoke',
            ],
          },
        ],
      },
      {
        name: 'Номинализация',
        rules: [
          {
            id: 'c1_14',
            text: 'Номинализация — основы',
            note: 'decide→decision, discover→discovery, improve→improvement',
            exp: `Номинализация — преобразование глаголов/прилагательных в существительные. Признак академического и делового стиля.
<br><br>Основные суффиксы:
<br>• <em>-tion/-sion</em>: decide→decision, discuss→discussion
<br>• <em>-ment</em>: improve→improvement, develop→development
<br>• <em>-ance/-ence</em>: appear→appearance, differ→difference
<br>• <em>-ity</em>: complex→complexity, able→ability
<br>• <em>-ness</em>: happy→happiness, aware→awareness`,
            ex: [
              [
                'She decided to expand. → Our decision to expand the company...',
                'Наше решение о расширении...',
              ],
              ['He discovered that... → His discovery of the error...', 'Его открытие ошибки...'],
            ],
            links: [
              {
                label: 'Nominalisation',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/nominalisation',
                type: 'en',
              },
              {
                label: 'native-english.ru: существительное',
                url: 'https://www.native-english.ru/grammar/english-nouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I made a decision to expand</s> → корректно, но стиль слабее: <em>Our decision to expand</em> (номинализация)',
              '<s>Он discovered an error</s> → His <em>discovery of</em> the error',
            ],
          },
          {
            id: 'c1_15',
            text: 'Номинализация в академическом тексте',
            note: 'The fact that prices increased → The increase in prices...',
            exp: `Номинализация позволяет:
<br>1. Сжать информацию: <em>There was a significant increase in prices.</em>
<br>2. Добавить определения: <em>The rapid increase in house prices...</em>
<br>3. Создать формальный, безличный тон.`,
            ex: [
              [
                'There has been a significant improvement in air quality.',
                'Качество воздуха значительно улучшилось.',
              ],
              [
                'His refusal to comment surprised everyone.',
                'Его отказ комментировать удивил всех.',
              ],
            ],
            links: [
              {
                label: 'Academic writing nominalisation',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/nominalisation',
                type: 'en',
              },
              {
                label: 'native-english.ru: существительное',
                url: 'https://www.native-english.ru/grammar/english-nouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>There was a significantly increase</s> → a <em>significant</em> increase (прилагательное перед существительным)',
              "<s>The prices' increase</s> → <em>The increase in prices</em>",
            ],
          },
        ],
      },
      {
        name: 'Причастные обороты',
        rules: [
          {
            id: 'c1_16',
            text: 'Причастный оборот настоящего: V-ing clause',
            note: "Walking down the street, I saw an old friend. Having no money, he couldn't buy food.",
            exp: `Причастный оборот с Present Participle (V-ing) заменяет придаточное предложение:
<br>• Одновременность: <em>Walking home, I noticed something strange.</em> (= While I was walking home)
<br>• Причина: <em>Knowing the answer, she raised her hand.</em> (= Because she knew)
<br><br>⚠️ Субъект причастного оборота ДОЛЖЕН совпадать с подлежащим главного предложения!
<br>Ошибка: <s>Walking down the street, the rain started.</s> (дождь не шёл по улице)`,
            ex: [
              [
                'Arriving at the airport, he realised he had forgotten his passport.',
                'Прибыв в аэропорт, он понял, что забыл паспорт.',
              ],
              [
                'Not knowing what to do, she called her mother.',
                'Не зная, что делать, она позвонила маме.',
              ],
            ],
            links: [
              {
                label: 'Participle clauses',
                url: 'https://www.perfect-english-grammar.com/participle-clauses.html',
                type: 'en',
              },
              {
                label: 'British Council',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/participle-clauses',
                type: 'en',
              },
              {
                label: 'native-english.ru: причастие',
                url: 'https://www.native-english.ru/grammar/participle',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Walking down the street, the rain started</s> → субъект оборота ≠ подлежащее. Правильно: <em>Walking down the street, I got wet.</em>',
              '<s>Knowing the answer, her hand was raised</s> → субъект должен совпадать: <em>Knowing the answer, she raised her hand.</em>',
            ],
          },
          {
            id: 'c1_17',
            text: 'Причастный оборот прошедшего: V3 / Having + V3 clause',
            note: 'Written in 1815, the novel... Having finished work, she went home.',
            exp: `<em>V3 clause</em> (Past Participle) = пассивный смысл: <em>Built in 1889, the Eiffel Tower...</em>
<br><br><em>Having + V3</em> = действие, завершённое раньше основного:
<br><em>Having read the report, he called a meeting.</em> (= After he had read...)`,
            ex: [
              [
                'Surprised by the news, she sat down silently.',
                'Удивлённая новостью, она молча села.',
              ],
              [
                'Having finished the exam, the students left the room.',
                'Закончив экзамен, студенты покинули аудиторию.',
              ],
            ],
            links: [
              {
                label: 'Participle clauses',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/participle-clauses',
                type: 'en',
              },
              {
                label: 'native-english.ru: причастие',
                url: 'https://www.native-english.ru/grammar/participle',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Having read the report, the meeting was called</s> → кто читал? Должно быть: <em>Having read the report, he called a meeting.</em>',
              '<s>Surprised by the news, she was sat down</s> → она сама: <em>she sat down</em>',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'C2',
    name: 'C2 — Мастерство',
    sub: 'Proficiency · 1–2+ года',
    color: 'var(--c2)',
    colorBg: 'var(--c2bg)',
    categories: [
      {
        name: 'Условные — полная система',
        rules: [
          {
            id: 'c2_01',
            text: 'Условные с unless / provided / as long as / on condition that',
            note: "Unless you study, you'll fail. As long as you're honest, I'll help.",
            exp: `<em>unless</em> = if not (но нельзя использовать с отрицанием!): <em>Unless you hurry</em> = <em>If you don't hurry</em>
<br><em>provided/providing (that)</em> = if and only if (строгое условие)
<br><em>as long as</em> = при условии, что (допущение)
<br><em>on condition that</em> = на условии, что (формально)
<br><em>in case</em> = на случай, если`,
            ex: [
              [
                "I'll lend you money, as long as you pay me back.",
                'Я одолжу тебе деньги, при условии что ты вернёшь.',
              ],
              [
                "You can use my laptop, provided you don't download anything.",
                'Можешь использовать мой ноутбук, при условии что ничего не скачаешь.',
              ],
            ],
            links: [
              {
                label: 'Advanced conditionals',
                url: 'https://www.perfect-english-grammar.com/conditionals-advanced.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>Unless you don't study</s> → Unless you study (unless = if not, двойное отрицание ненужно)",
              "<s>As long as you'll be honest</s> → As long as you <em>are</em> honest",
            ],
          },
          {
            id: 'c2_02',
            text: 'Suppose / supposing / what if',
            note: 'Suppose you won the lottery — what would you do?',
            exp: `<em>Suppose/Supposing</em> — используются как <em>if</em> в гипотетических вопросах.
<br><em>What if</em> — неформальный аналог.
<br><br>С Past Simple — ситуация маловероятная или воображаемая.`,
            ex: [
              [
                'Supposing you had to choose — which would you pick?',
                'Представь, что тебе нужно выбрать — что бы ты выбрал?',
              ],
              [
                'What if nobody comes? What should we do?',
                'А вдруг никто не придёт? Что нам делать?',
              ],
            ],
            links: [
              {
                label: 'Suppose/supposing',
                url: 'https://www.perfect-english-grammar.com/conditionals-advanced.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: условные предложения',
                url: 'https://www.native-english.ru/grammar/conditional-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Suppose you would win</s> → Suppose you <em>won</em> (Past Simple для гипотезы)',
            ],
          },
        ],
      },
      {
        name: 'Инверсия — полная система',
        rules: [
          {
            id: 'c2_03',
            text: 'Only + обстоятельство + инверсия',
            note: 'Only when I left did I realise. Only then did he understand.',
            exp: `<em>Only + when/after/if/then/by/in/on</em> — вся группа выносится в начало → инверсия.
<br><br>Это один из самых мощных риторических приёмов в письменной и ораторской речи.`,
            ex: [
              [
                'Only when you experience it can you truly understand.',
                'Только пережив это, можно по-настоящему понять.',
              ],
              [
                'Only after years of practice did she master the skill.',
                'Лишь после многих лет практики она овладела навыком.',
              ],
            ],
            links: [
              {
                label: 'Advanced inversion',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/inversion',
                type: 'en',
              },
              {
                label: 'native-english.ru: инверсия',
                url: 'https://www.native-english.ru/grammar/inversion',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Only when I left, I realised</s> → Only when I left <em>did I</em> realise (инверсия!)',
              '<s>Only after years of practice, she mastered</s> → ... <em>did she master</em>',
            ],
          },
          {
            id: 'c2_04',
            text: 'So + прилагательное/наречие + инверсия',
            note: 'So great was his relief that he wept. Such was her talent...',
            exp: `Книжный и ораторский стиль.
<br><em>So + adj/adv + be/aux + подлежащее</em>
<br><em>Such + was/were + подлежащее</em>`,
            ex: [
              [
                'So rapid was the change that nobody could adapt.',
                'Изменения происходили так быстро, что никто не мог приспособиться.',
              ],
              [
                'Such was her talent that she was offered a scholarship.',
                'Настолько велик был её талант, что ей предложили стипендию.',
              ],
            ],
            links: [
              {
                label: 'So/Such inversion',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/inversion',
                type: 'en',
              },
              {
                label: 'native-english.ru: инверсия',
                url: 'https://www.native-english.ru/grammar/inversion',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>So great his relief was that</s> → So great <em>was</em> his relief',
              '<s>Such great was her talent</s> → Such <em>was</em> her talent / <em>So great was</em> her talent',
            ],
          },
        ],
      },
      {
        name: 'Модальность в академическом тексте',
        rules: [
          {
            id: 'c2_05',
            text: 'Хеджинг: appear to, seem to, tend to, be likely to',
            note: 'Prices appear to be rising. This tends to occur when...',
            exp: `Хеджинг (hedging) — намеренное смягчение утверждений для выражения научной скромности.
<br><br>Основные конструкции:
<br>• <em>appear/seem to</em> — по всей видимости
<br>• <em>tend to</em> — как правило, имеют тенденцию
<br>• <em>be likely/unlikely to</em> — вероятно/маловероятно
<br>• <em>be thought/considered to be</em> — считается, что`,
            ex: [
              [
                'The results appear to suggest a correlation.',
                'Результаты, по всей видимости, указывают на корреляцию.',
              ],
              [
                'Companies tend to underestimate implementation costs.',
                'Компании, как правило, недооценивают затраты на внедрение.',
              ],
            ],
            links: [
              {
                label: 'Hedging in academic writing',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/hedging',
                type: 'en',
              },
              {
                label: 'native-english.ru: наречия',
                url: 'https://www.native-english.ru/grammar/english-adverbs',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Prices appear rising</s> → Prices appear <em>to be rising</em>',
              '<s>Results seem suggest</s> → Results seem <em>to suggest</em>',
            ],
          },
          {
            id: 'c2_06',
            text: 'Дискурсивные маркеры в академическом тексте',
            note: 'Furthermore, Nevertheless, Conversely, In light of, With regard to',
            exp: `Маркеры структурируют и связывают академический текст:
<br><br>• <strong>Добавление</strong>: Moreover, Furthermore, In addition, Additionally
<br>• <strong>Контраст</strong>: However, Nevertheless, Nonetheless, Conversely, On the other hand
<br>• <strong>Результат</strong>: Therefore, Consequently, As a result, Hence, Thus
<br>• <strong>Пояснение</strong>: In other words, That is to say, Namely
<br>• <strong>Уступка</strong>: Admittedly, While it is true that, Despite this`,
            ex: [
              [
                'The experiment failed. Nevertheless, the findings were instructive.',
                'Эксперимент не удался. Тем не менее результаты были поучительными.',
              ],
              [
                'Furthermore, the data suggests a strong correlation.',
                'Более того, данные свидетельствуют о сильной корреляции.',
              ],
            ],
            links: [
              {
                label: 'Discourse markers',
                url: 'https://learnenglish.britishcouncil.org/grammar/b2-c1-grammar/discourse-markers',
                type: 'en',
              },
              {
                label: 'native-english.ru: союзы',
                url: 'https://www.native-english.ru/grammar/english-conjunctions',
                type: 'ru',
              },
            ],
            mistakes: [
              'Путаница furthermore/moreover — оба добавляют, но moreover сильнее',
              '<s>Conversely, this shows the same</s> — conversely вводит контраст, не подтверждение',
            ],
          },
        ],
      },
      {
        name: 'Регистры и лексическая точность',
        rules: [
          {
            id: 'c2_07',
            text: 'Регистры речи: формальный, нейтральный, разговорный',
            note: "I would like to enquire... vs I'd like to ask... vs Can I ask...",
            exp: `Регистр определяется целью, аудиторией и контекстом.
<br><br><strong>Формальный</strong>: пассив, номинализация, сложные союзы, полные формы, глаголы латинского происхождения (<em>commence, terminate, assist</em>).
<br><strong>Нейтральный</strong>: стандартная грамматика, без сленга, умеренные сокращения.
<br><strong>Неформальный</strong>: эллипсис, фразовые глаголы (<em>put off = postpone</em>), сокращения, разговорные выражения.`,
            ex: [
              ['Formal: I wish to draw your attention to a discrepancy.', ''],
              ['Neutral: I want to point out a mistake.', ''],
              ['Informal: Just wanted to flag something up.', ''],
            ],
            links: [
              {
                label: 'Register in English',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar',
                type: 'en',
              },
              {
                label: 'native-english.ru: порядок слов',
                url: 'https://www.native-english.ru/grammar/word-order',
                type: 'ru',
              },
            ],
            mistakes: [
              'Смешение регистров: формальное начало и разговорное окончание в одном тексте',
              '<s>I would like to ask about this thing</s> → <em>this matter</em> (формальный регистр)',
            ],
          },
          {
            id: 'c2_08',
            text: 'Коннотации синонимов — оттенки значения',
            note: 'thin/slim/slender/skinny/gaunt: позитивное→нейтральное→негативное',
            exp: `Синонимы различаются коннотацией (эмоциональной окраской) и регистром.
<br><br>Примеры шкал:
<br>• <em>slim</em> (+) → <em>thin</em> (0) → <em>skinny</em> (-) → <em>scrawny/gaunt</em> (--)
<br>• <em>determined</em> (+) → <em>firm</em> (0) → <em>stubborn/pig-headed</em> (-)
<br>• <em>thrifty</em> (+) → <em>economical</em> (0) → <em>stingy/tight-fisted</em> (-)
<br>• <em>confident</em> (+) → <em>assertive</em> (0) → <em>arrogant</em> (-)`,
            ex: [
              [
                'She is slim. (+) / She is thin. (0) / She is skinny. (-)',
                'Одно и то же — но разное отношение.',
              ],
            ],
            links: [
              {
                label: 'Word connotations',
                url: 'https://www.bbc.co.uk/learningenglish/english/features/vocabulary',
                type: 'en',
              },
              {
                label: 'native-english.ru: прилагательные',
                url: 'https://www.native-english.ru/grammar/english-adjectives',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She is very thin</s> (нейтрально) vs намеренное <em>slim</em> (+) или <em>skinny</em> (−)',
              'Использование слова с неверной коннотацией при комплименте: <em>stubborn</em> вместо <em>determined</em>',
            ],
          },
          {
            id: 'c2_09',
            text: 'Риторические приёмы: анафора, хиазм, триколон',
            note: '"We shall fight on the beaches, we shall fight on the landing grounds..." — анафора',
            exp: `<strong>Анафора</strong>: повторение слов в начале последовательных предложений. <em>"I have a dream... I have a dream..."</em>
<br><strong>Хиазм</strong>: перекрёстная структура AB-BA. <em>"Ask not what your country can do for you, but what you can do for your country."</em>
<br><strong>Триколон</strong>: три параллельных элемента. <em>"Veni, vidi, vici." / "Government of the people, by the people, for the people."</em>
<br><br>Эти приёмы используются в ораторских речах, эссе и публицистике.`,
            ex: [
              ['Friends, Romans, countrymen, lend me your ears. (триколон)', ''],
              ['The more you learn, the more you earn. (хиазм в народной мудрости)', ''],
            ],
            links: [
              {
                label: 'Rhetorical devices',
                url: 'https://www.bbc.co.uk/learningenglish',
                type: 'en',
              },
              {
                label: 'native-english.ru: восклицательные предложения',
                url: 'https://www.native-english.ru/grammar/exclamatory-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              'Использование анафоры без параллельной структуры — нарушает ритм',
              'Триколон с неравными элементами: "fast, efficiently, with great care" → "fast, efficient, and careful"',
            ],
          },
          {
            id: 'c2_10',
            text: 'Точные коллокации в академическом тексте',
            note: 'conduct research, draw conclusions, reach a consensus, address an issue',
            exp: `На C2 важно использовать «правильный» глагол с каждым существительным.
<br><br>Академические коллокации:
<br>• <em>conduct/carry out</em> research (не <s>make/do</s>)
<br>• <em>draw/reach</em> a conclusion
<br>• <em>raise/address/tackle</em> an issue
<br>• <em>reach/achieve</em> a consensus
<br>• <em>make</em> significant progress
<br>• <em>pose/present</em> a challenge`,
            ex: [
              [
                'Researchers conducted extensive interviews.',
                'Исследователи провели обширные интервью.',
              ],
              [
                'The committee failed to reach a consensus.',
                'Комитету не удалось прийти к консенсусу.',
              ],
            ],
            links: [
              {
                label: 'Academic collocations',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar',
                type: 'en',
              },
              {
                label: 'native-english.ru: существительное',
                url: 'https://www.native-english.ru/grammar/english-nouns',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>make research</s> → <em>conduct/carry out</em> research',
              '<s>do a conclusion</s> → <em>draw/reach</em> a conclusion',
              '<s>make an issue</s> → <em>raise/address</em> an issue',
            ],
          },
        ],
      },
      {
        name: 'Абсолютные конструкции',
        rules: [
          {
            id: 'c2_11',
            text: 'Абсолютная конструкция с причастием',
            note: "Weather permitting, we'll have a picnic. Her eyes filled with tears, she left the room.",
            exp: `Абсолютная конструкция = существительное/местоимение + причастие (независимое подлежащее).
<br>Используется в письменном и формальном стиле — добавляет обстоятельство без союза.
<br><br>Типы:
<br>• <em>Weather permitting</em> = If the weather permits
<br>• <em>All things considered</em> = If you consider everything
<br>• <em>Her work finished</em> = When/After her work was finished
<br>• <em>This done</em> = When/After this was done`,
            ex: [
              [
                'All things considered, it was a successful event.',
                'Если всё взвесить, это было успешное мероприятие.',
              ],
              [
                'The deadline having passed, the project was cancelled.',
                'После того как дедлайн прошёл, проект был отменён.',
              ],
            ],
            links: [
              {
                label: 'Absolute clauses',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/participle-clauses',
                type: 'en',
              },
              {
                label: 'native-english.ru: причастие',
                url: 'https://www.native-english.ru/grammar/participle',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Weather permitting, the picnic will be had by us</s> → избыточный пассив',
              '<s>Her eyes filling with tears, she left</s> — допустимо, но <em>Her eyes filled</em> точнее для завершённого факта',
            ],
          },
        ],
      },
      {
        name: 'Эллипсис и грамматические сокращения',
        rules: [
          {
            id: 'c2_12',
            text: 'Эллипсис и замещение в связном тексте',
            note: "I wanted to go but didn't (want to). She said she'd call and she did.",
            exp: `Эллипсис — пропуск уже известных элементов.
<br>Замещение — использование <em>do/so/one/it</em> вместо повтора.
<br><br>Типы эллипсиса:
<br>• <em>A: Are you coming? B: Might (do).</em>
<br>• <em>She speaks French and he does too / so does he.</em>
<br>• <em>I wanted to leave, but wasn't allowed to.</em> (опущено <em>leave</em>)
<br><br>Замещение: <em>I thought he'd pass. He did.</em> / <em>The big one? I prefer the small one.</em>`,
            ex: [
              ['Can you drive? — I used to (drive).', 'Ты умеешь водить? — Раньше умел.'],
              ["She said she'd be here and she was.", 'Она сказала, что придёт, и пришла.'],
            ],
            links: [
              {
                label: 'Ellipsis and substitution',
                url: 'https://learnenglish.britishcouncil.org/grammar/c1-grammar/ellipsis-and-substitution',
                type: 'en',
              },
              {
                label: 'native-english.ru: сложноподчинённые',
                url: 'https://www.native-english.ru/grammar/complex-sentences',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>I wanted to go but didn't want to</s> → <em>but didn't</em> (опускаем want to)",
              "<s>She said she'd call and she said</s> → <em>and she did</em> (замещение через do)",
            ],
          },
          {
            id: 'c2_13',
            text: 'Инфинитивные обороты вместо придаточных',
            note: 'I want you to explain. She asked me to help. He seems to be happy.',
            exp: `Сложный инфинитив (Complex Object) заменяет придаточное:
<br><em>I want + object + to-infinitive</em>: <em>I want her to stay.</em>
<br><br>После <em>see, hear, watch, let, make, have</em> — инфинитив без <em>to</em>:
<br><em>I saw her leave. / She made him cry. / Let me help.</em>
<br>В пассиве — с <em>to</em>: <em>He was made to pay.</em>
<br><br>Конструкции с <em>seem, appear, happen, prove + to-inf</em>:
<br><em>She seems to know. / He happened to be there.</em>`,
            ex: [
              ['I need you to sign this document.', 'Мне нужно, чтобы ты подписал этот документ.'],
              ['She was made to apologise publicly.', 'Её заставили публично извиниться.'],
              ['He seemed to have forgotten everything.', 'Казалось, он забыл всё.'],
            ],
            links: [
              {
                label: 'Complex object',
                url: 'https://www.perfect-english-grammar.com/infinitives.html',
                type: 'en',
              },
              {
                label: 'native-english.ru: инфинитив',
                url: 'https://www.native-english.ru/grammar/infinitive',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I saw her to leave</s> → I saw her <em>leave</em> (после see без to)',
              '<s>She was made to leave</s> — правильно! В пассиве — с to',
              '<s>I want that she stays</s> → I want <em>her to stay</em>',
            ],
          },
        ],
      },
      {
        name: 'Future Perfect Continuous и согласование времён',
        rules: [
          {
            id: 'c2_14',
            text: 'Future Perfect Continuous: will have been + V-ing',
            note: 'By next year, I will have been studying English for five years.',
            exp: `<strong>Future Perfect Continuous</strong> = <em>will have been + V-ing</em>
<br><br>Акцент на продолжительности действия, которое будет длиться вплоть до определённого момента в будущем. Часто отвечает на вопрос «Как долго к тому времени?»
<br><br>Часто используется с <em>by (the time), for, when</em>: <em>By Monday, she will have been working on this project for three weeks.</em>`,
            ex: [
              [
                'By next year, I will have been learning English for five years.',
                'К следующему году я буду изучать английский уже пять лет.',
              ],
              [
                'When we arrive, she will have been waiting for two hours.',
                'Когда мы приедем, она уже будет ждать два часа.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: Future Perfect Continuous',
                url: 'https://www.native-english.ru/grammar/future-perfect-continuous',
                type: 'ru',
              },
              {
                label: 'Future Perfect Continuous',
                url: 'https://www.perfect-english-grammar.com/future-perfect-continuous.html',
                type: 'en',
              },
            ],
            mistakes: [
              '<s>By next year I will been studying</s> → I will <em>have been</em> studying',
              '<s>She will have been work</s> → She will have been <em>working</em>',
            ],
          },
          {
            id: 'c2_15',
            text: 'Согласование времён — sequence of tenses',
            note: 'She said she had been working. He thought it would be difficult.',
            exp: `В сложноподчинённых предложениях глагол придаточного согласуется по времени с главным.
<br><br>Если главный глагол в прошлом:
<br>• Present Simple → Past Simple: <em>he said it was true</em>
<br>• Past Simple → Past Perfect: <em>she said she had seen it</em>
<br>• Present Perfect → Past Perfect: <em>he said he had finished</em>
<br>• will → would; can → could; may → might; is → was
<br><br>⚠️ Исключение: общие истины и научные факты не изменяются: <em>She said that water boils at 100°C.</em>`,
            ex: [
              [
                'He told me that he had been living there for years.',
                'Он сказал мне, что жил там уже много лет.',
              ],
              [
                'She said the Earth moves around the Sun. (общая истина — не меняем)',
                'Она сказала, что Земля движется вокруг Солнца.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: согласование времён',
                url: 'https://www.native-english.ru/grammar/sequence-of-tenses',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She said that water is boiling</s> (факт) → water <em>boils</em>',
              '<s>He said he seen it</s> → He said he <em>had seen</em> it',
            ],
          },
        ],
      },
      {
        name: 'Союзы и связность текста',
        rules: [
          {
            id: 'c2_16',
            text: 'Сочинительные союзы: and, but, or, nor, for, yet, so',
            note: 'FANBOYS: For, And, Nor, But, Or, Yet, So',
            exp: `Сочинительные союзы соединяют равнозначные части предложения.
<br><br>Семь основных (акроним FANBOYS):
<br>• <em>for</em> = потому что (формальный): <em>She left, for she was tired.</em>
<br>• <em>and</em> = и (добавление)
<br>• <em>nor</em> = и не (Neither/Nor... инверсия!): <em>She didn't call, nor did she write.</em>
<br>• <em>but</em> = но (контраст)
<br>• <em>or</em> = или (альтернатива)
<br>• <em>yet</em> = однако (контраст, формальнее but)
<br>• <em>so</em> = поэтому (следствие)`,
            ex: [
              ['She was tired, yet she kept working.', 'Она устала, однако продолжала работать.'],
              ["He didn't study, nor did he attend class.", 'Он не учился и не ходил на занятия.'],
            ],
            links: [
              {
                label: 'native-english.ru: сочинительные союзы',
                url: 'https://www.native-english.ru/grammar/coordinating-conjunctions',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>She was tired, yet kept working</s> — верно без «she» во второй части',
              "<s>She didn't call nor she wrote</s> → nor <em>did she</em> write (инверсия!)",
            ],
          },
          {
            id: 'c2_17',
            text: 'Подчинительные союзы: although, whereas, provided, unless...',
            note: 'although, as though, whereas, provided that, unless, given that, in case',
            exp: `Подчинительные союзы вводят придаточные предложения.
<br><br>По значению:
<br>• <strong>Времени</strong>: <em>when, while, as, after, before, until, once, as soon as, whenever</em>
<br>• <strong>Причины</strong>: <em>because, since, as, given that, seeing that</em>
<br>• <strong>Условия</strong>: <em>if, unless, provided, as long as, in case, supposing</em>
<br>• <strong>Цели</strong>: <em>so that, in order that, lest</em>
<br>• <strong>Уступки</strong>: <em>although, even though, whereas, while, however</em>`,
            ex: [
              [
                'Seeing that the deadline had passed, we cancelled the meeting.',
                'Поскольку дедлайн прошёл, мы отменили встречу.',
              ],
              [
                'Lest she forget, he sent her a reminder.',
                'Чтобы она не забыла, он отправил ей напоминание.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: подчинительные союзы',
                url: 'https://www.native-english.ru/grammar/subordinating-conjunctions',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>Although the rain, we went</s> → Although <em>it was raining</em>',
              '<s>Seeing that the deadline passed</s> → had passed (Past Perfect перед другим прошлым)',
            ],
          },
        ],
      },
      {
        name: 'Пунктуация в академическом тексте',
        rules: [
          {
            id: 'c2_18',
            text: 'Запятая, точка с запятой и двоеточие',
            note: 'Use a comma before FANBOYS. Use a semicolon to link related clauses.',
            exp: `<strong>Запятая</strong>:
<br>• Перед сочинительными союзами FANBOYS между самостоятельными предложениями.
<br>• После вводных слов/оборотов: <em>However, she decided to stay.</em>
<br>• В перечислениях (Oxford comma — перед последним and): <em>apples, oranges, and bananas</em>.
<br><br><strong>Точка с запятой (;)</strong>: связывает два самостоятельных предложения без союза.
<br><em>She was tired; she went to bed.</em>
<br><br><strong>Двоеточие (:)</strong>: вводит список, пояснение, цитату.`,
            ex: [
              [
                'However, the results were inconclusive; further research is required.',
                'Однако результаты неоднозначны; требуются дальнейшие исследования.',
              ],
              [
                'The company has three priorities: efficiency, innovation, and sustainability.',
                'У компании три приоритета: эффективность, инновации и устойчивость.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: пунктуация',
                url: 'https://www.native-english.ru/grammar/english-punctuation',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>However she decided to stay</s> → However<em>,</em> she decided',
              '<s>She was tired; and she went to bed</s> → без союза после точки с запятой: <em>She was tired; she went to bed.</em>',
            ],
          },
          {
            id: 'c2_19',
            text: 'Тире, апостроф и кавычки',
            note: 'Em dash — for emphasis — sets off a phrase. It\'s vs its. "Direct speech"',
            exp: `<strong>Тире (—)</strong>: выделяет вставную конструкцию (сильнее запятой): <em>The solution — though expensive — proved effective.</em>
<br><br><strong>Апостроф</strong>:
<br>• Сокращения: <em>it's = it is; don't; they're</em>
<br>• Притяжательный падеж: <em>John's book; the students' results</em>
<br>• ⚠️ <em>its</em> (принадлежность) vs <em>it's</em> (it is)
<br><br><strong>Кавычки</strong>: AmE — двойные ("<em>text</em>"), BrE — одинарные ('<em>text</em>').`,
            ex: [
              [
                'The project — launched in 2020 — exceeded all expectations.',
                'Проект, запущенный в 2020 году, превзошёл все ожидания.',
              ],
              [
                "It's important to check its settings before use.",
                'Важно проверить его настройки перед использованием.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: пунктуация',
                url: 'https://www.native-english.ru/grammar/english-punctuation',
                type: 'ru',
              },
            ],
            mistakes: [
              "<s>Its a big house</s> → <em>It's</em> a big house",
              "<s>The cats tail</s> → The cat<em>'s</em> tail",
              "<s>Her's book</s> → <em>Her</em> book (у притяжательных местоимений нет апострофа)",
            ],
          },
          {
            id: 'c2_20',
            text: 'Специальные и косвенные вопросы в академическом тексте',
            note: 'The question is whether... / I wonder what the data shows.',
            exp: `В академическом тексте прямые вопросы заменяются косвенными (вопросительными придаточными).
<br><br>Косвенный вопрос — это придаточное с обычным порядком слов (без инверсии, без do).
<br><br>Вводящие слова: <em>whether, if (да/нет), what, where, when, how, why, which</em>.
<br><br>Пример: <em>What does this data show?</em> → <em>The question is what this data shows.</em>`,
            ex: [
              ['I wonder whether the hypothesis is correct.', 'Интересно, верна ли гипотеза.'],
              [
                'The study examines how social media affects behaviour.',
                'Исследование изучает, как социальные сети влияют на поведение.',
              ],
            ],
            links: [
              {
                label: 'native-english.ru: специальные вопросы',
                url: 'https://www.native-english.ru/grammar/special-questions',
                type: 'ru',
              },
            ],
            mistakes: [
              '<s>I wonder what does the data show</s> → what the data <em>shows</em> (нет инверсии в косвенном вопросе)',
              '<s>The question is whether does he know</s> → whether he <em>knows</em>',
            ],
          },
        ],
      },
    ],
  },
];
