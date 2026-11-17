#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Генерация PDF с описанием приложения English Grammar Tree.
Формат вдохновлён прикреплённым примером LangLearn.pdf: код приложения
подаётся блоками с краткой шапкой на русском, объясняющей назначение файла.
"""
import os
import sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import LETTER
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# --- Configuration ---------------------------------------------------------

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUTPUT_PDF = os.path.join(PROJECT_ROOT, "EnglishGrammarTree.pdf")

PAGE_WIDTH, PAGE_HEIGHT = LETTER
LEFT_MARGIN = 50
RIGHT_MARGIN = 50
TOP_MARGIN = 50
BOTTOM_MARGIN = 50

CODE_FONT_NAME = "CourierNew"
CODE_FONT_BOLD = "CourierNew-Bold"
CODE_FONT_SIZE = 8
CODE_LINE_HEIGHT = 9.6

HEADER_FONT_NAME = "ArialUni"
HEADER_FONT_SIZE = 10
HEADER_LINE_HEIGHT = 12

TITLE_FONT_SIZE = 18
SUBTITLE_FONT_SIZE = 11

# Register fonts that support Cyrillic
pdfmetrics.registerFont(TTFont(CODE_FONT_NAME, "/System/Library/Fonts/Supplemental/Courier New.ttf"))
pdfmetrics.registerFont(TTFont(CODE_FONT_BOLD, "/System/Library/Fonts/Supplemental/Courier New Bold.ttf"))
pdfmetrics.registerFont(TTFont(HEADER_FONT_NAME, "/System/Library/Fonts/Supplemental/Arial.ttf"))
pdfmetrics.registerFont(TTFont(HEADER_FONT_NAME + "-Bold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"))

USABLE_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

# Estimated character width for Courier New 8pt (mono ~0.6 * font_size)
CHAR_WIDTH = CODE_FONT_SIZE * 0.6
MAX_CHARS_PER_LINE = int(USABLE_WIDTH / CHAR_WIDTH)  # ~ 102

# --- PDF state -------------------------------------------------------------

class PDFWriter:
    def __init__(self, path):
        self.c = canvas.Canvas(path, pagesize=LETTER)
        self.c.setTitle("English Grammar Tree — описание приложения")
        self.c.setAuthor("Nikolay Vereshchagin")
        self.c.setSubject("Архитектура и исходный код приложения")
        self.y = PAGE_HEIGHT - TOP_MARGIN
        self.page_num = 1

    def _ensure_room(self, needed_height):
        if self.y - needed_height < BOTTOM_MARGIN:
            self.new_page()

    def new_page(self):
        self._draw_page_footer()
        self.c.showPage()
        self.page_num += 1
        self.y = PAGE_HEIGHT - TOP_MARGIN

    def _draw_page_footer(self):
        self.c.setFont(HEADER_FONT_NAME, 8)
        self.c.setFillGray(0.55)
        footer = f"English Grammar Tree · стр. {self.page_num}"
        self.c.drawCentredString(PAGE_WIDTH / 2, BOTTOM_MARGIN / 2 + 4, footer)
        self.c.setFillGray(0)

    def text(self, line, font=HEADER_FONT_NAME, size=HEADER_FONT_SIZE, gray=0.0, line_height=None):
        if line_height is None:
            line_height = size * 1.2
        self._ensure_room(line_height)
        self.c.setFont(font, size)
        self.c.setFillGray(gray)
        self.c.drawString(LEFT_MARGIN, self.y - size, line)
        self.y -= line_height
        self.c.setFillGray(0)

    def blank(self, h=6):
        self._ensure_room(h)
        self.y -= h

    def wrap_code_line(self, line):
        """Split a long line into multiple chunks that fit the page width."""
        if len(line) <= MAX_CHARS_PER_LINE:
            return [line]
        chunks = []
        remaining = line
        first = True
        while len(remaining) > MAX_CHARS_PER_LINE:
            chunks.append(remaining[:MAX_CHARS_PER_LINE])
            remaining = remaining[MAX_CHARS_PER_LINE:]
            # Indicate wrapping with a soft indent on continuation lines
            if not first:
                pass
            first = False
        if remaining:
            chunks.append(remaining)
        return chunks

    def code_block(self, lines):
        self.c.setFont(CODE_FONT_NAME, CODE_FONT_SIZE)
        self.c.setFillGray(0)
        for raw in lines:
            # Expand tabs
            raw = raw.replace("\t", "  ").rstrip("\n")
            for chunk in self.wrap_code_line(raw):
                self._ensure_room(CODE_LINE_HEIGHT)
                self.c.setFont(CODE_FONT_NAME, CODE_FONT_SIZE)
                # Render character-by-character if non-ASCII fallbacks needed
                try:
                    self.c.drawString(LEFT_MARGIN, self.y - CODE_FONT_SIZE, chunk)
                except Exception:
                    safe = chunk.encode("ascii", "replace").decode()
                    self.c.drawString(LEFT_MARGIN, self.y - CODE_FONT_SIZE, safe)
                self.y -= CODE_LINE_HEIGHT

    def header_intro(self, intro_lines):
        """Russian-language intro for a code block."""
        self.blank(8)
        self.c.setFillGray(0)
        for line in intro_lines:
            self._ensure_room(HEADER_LINE_HEIGHT)
            self.c.setFont(HEADER_FONT_NAME + "-Bold", HEADER_FONT_SIZE)
            self.c.drawString(LEFT_MARGIN, self.y - HEADER_FONT_SIZE, line)
            self.y -= HEADER_LINE_HEIGHT
        # subtle horizontal rule
        self._ensure_room(6)
        self.c.setStrokeGray(0.7)
        self.c.setLineWidth(0.4)
        self.c.line(LEFT_MARGIN, self.y - 2, PAGE_WIDTH - RIGHT_MARGIN, self.y - 2)
        self.y -= 6

    def cover(self):
        # Background tint band at the top
        self.c.setFillColorRGB(0.85, 0.88, 0.95)
        self.c.rect(0, PAGE_HEIGHT - 130, PAGE_WIDTH, 130, fill=1, stroke=0)
        self.c.setFillGray(0)

        self.c.setFont(HEADER_FONT_NAME + "-Bold", TITLE_FONT_SIZE + 8)
        self.c.drawString(LEFT_MARGIN, PAGE_HEIGHT - 70, "English Grammar Tree")
        self.c.setFont(HEADER_FONT_NAME, SUBTITLE_FONT_SIZE)
        self.c.drawString(LEFT_MARGIN, PAGE_HEIGHT - 95,
                          "Интерактивное веб-приложение для изучения английской грамматики (A1 – C2)")
        self.c.drawString(LEFT_MARGIN, PAGE_HEIGHT - 110,
                          "Описание архитектуры и ключевого кода приложения")

        self.y = PAGE_HEIGHT - 165

        body = [
            "О приложении",
            "",
            "English Grammar Tree — одностраничное приложение (SPA) на React 18 + TypeScript,",
            "собираемое Vite 6. Оно представляет всю английскую грамматику в виде «дерева»: ",
            "уровни CEFR (A1, A2, B1, B2, C1, C2) → категории → правила. Каждое правило ",
            "содержит объяснение, примеры с переводом, исключения, частые ошибки, маркеры ",
            "и ссылки на видео/статьи. Прогресс пользователя сохраняется в localStorage, а при ",
            "входе в аккаунт синхронизируется в Cloud Firestore.",
            "",
            "Помимо основной вкладки «Грамматика», в приложении есть:",
            "  • «Murphy» — спутник к учебникам English Grammar in Use (Elementary, Intermediate,",
            "    Advanced) с теми же возможностями: прогресс, заметки, закладки, deep-link.",
            "  • «Времена» — таймлайн всех 12 времён, дерево вопросов, ведущее к нужному времени,",
            "    и режим сравнения двух времён бок о бок.",
            "",
            "Ключевые технологии",
            "",
            "  • UI:           React 18, TypeScript 5",
            "  • Сборка:       Vite 6, PWA (vite-plugin-pwa)",
            "  • Локализация:  i18next + react-i18next, 6 языков (en, ru, de, es, fr, zh),",
            "                  бандлы загружаются лениво",
            "  • Бэкенд:       Firebase Auth (Google, e-mail), Cloud Firestore",
            "  • Хранение:     localStorage + last-write-wins синхронизация с Firestore",
            "  • Стили:        Чистый CSS с CSS-переменными, темы dark/light",
            "  • Линт/формат:  Biome, Husky + lint-staged",
            "  • Хостинг:      Firebase Hosting",
            "",
            "Структура проекта",
            "",
            "  english-grammar-tree/",
            "  ├── app/",
            "  │   ├── components/   — UI: Grammar, Murphy, Tenses, Auth, Account, Header, …",
            "  │   ├── context/      — провайдер AuthSync (авторизация + синхронизация)",
            "  │   ├── data/         — DATA: уровни, категории, правила, времена, дерево вопросов",
            "  │   ├── hooks/        — useProgress, useTheme, useNotes",
            "  │   ├── i18n/         — конфиг i18next, локали, лейблы, переводы правил",
            "  │   ├── services/     — firestoreService, syncRegistry",
            "  │   ├── utils/        — deepLink, selection, clipboard, particles, prompts",
            "  │   ├── styles/       — base.css (палитра тем, layout)",
            "  │   ├── App.tsx, main.tsx, firebase.ts",
            "  ├── public/           — иконки PWA, manifest",
            "  ├── scripts/          — служебные скрипты (тестирование, дамп i18n)",
            "  └── index.html, vite.config.ts, firebase.json, firestore.rules",
            "",
            "Далее приведены ключевые файлы приложения с краткими пояснениями.",
        ]
        for line in body:
            self._ensure_room(11)
            self.c.setFont(HEADER_FONT_NAME, 9.5)
            self.c.drawString(LEFT_MARGIN, self.y - 10, line)
            self.y -= 11

        self.new_page()


def read_lines(rel_path, start=1, end=None):
    abs_path = os.path.join(PROJECT_ROOT, rel_path)
    with open(abs_path, "r", encoding="utf-8") as f:
        all_lines = f.readlines()
    if end is None:
        end = len(all_lines)
    return [ln.rstrip("\n") for ln in all_lines[start - 1 : end]]


# --- Content plan ----------------------------------------------------------

# Each entry: (intro_lines, file_path, optional excerpt range)
PLAN = [
    (
        [
            "app/main.tsx — точка входа приложения.",
            "Регистрирует service worker для PWA, инициализирует i18n и затем монтирует",
            "корневой компонент App в #root.",
        ],
        "app/main.tsx",
        None,
    ),
    (
        [
            "app/App.tsx — корневой компонент.",
            "Объявляет провайдер AuthSyncProvider, оборачивающий всё приложение,",
            "переключает вкладки (Grammar / Murphy / Tenses), читает deep-link из URL",
            "и подгружает нужный таб ленивым импортом (lazy + Suspense).",
        ],
        "app/App.tsx",
        None,
    ),
    (
        [
            "app/firebase.ts — инициализация Firebase.",
            "Веб-ключи Firebase публичны и встроены в клиентский бандл; реальные значения",
            "берутся из переменных окружения VITE_FIREBASE_*. Экспортируются auth и db.",
        ],
        "app/firebase.ts",
        None,
    ),
    (
        [
            "app/i18n/config.ts — конфигурация i18next.",
            "Поддерживает 6 языков (en, ru, de, es, fr, zh). При старте грузится только",
            "выбранный язык + английский для фолбэка; остальные бандлы загружаются",
            "лениво функцией ensureLanguageLoaded при переключении языка.",
        ],
        "app/i18n/config.ts",
        None,
    ),
    (
        [
            "app/i18n/loadTranslationBundle.ts — ленивая загрузка переводов.",
            "Для каждого языка собирается единый бандл из четырёх частей: locales (UI-строки),",
            "labels (названия категорий), aiPrompt (шаблоны промтов для LLM) и rules",
            "(перевод правил и примеров). Русский — исходный, поэтому без отдельного rules-файла.",
        ],
        "app/i18n/loadTranslationBundle.ts",
        None,
    ),
    (
        [
            "app/hooks/useProgress.ts — хук учёта прогресса.",
            "Хранит карту «правило → отмечено» в localStorage. Дополнительно ведёт два",
            "журнала временных меток: checkedAt (когда отметили) и tombstones (когда сняли).",
            "Они нужны для last-write-wins при синхронизации с Firestore.",
        ],
        "app/hooks/useProgress.ts",
        None,
    ),
    (
        [
            "app/hooks/useTheme.ts — переключение тем dark / light.",
            "Без вспышки FOUC: тема применяется атрибутом data-theme на <html> ещё до первой",
            "отрисовки. Следует системной теме, пока пользователь сам не выбрал.",
        ],
        "app/hooks/useTheme.ts",
        None,
    ),
    (
        [
            "app/hooks/useNotes.ts — управление пользовательскими заметками.",
            "Каждая заметка привязана к фрагменту текста внутри правила (или времени).",
            "Хук читает заметки для текущего контекста и пере-читает их при событии sync.",
        ],
        "app/hooks/useNotes.ts",
        None,
    ),
    (
        [
            "app/services/firestoreService.ts — слой работы с Cloud Firestore.",
            "Описывает форму документа пользователя (прогресс, заметки, настройки) и операции:",
            "получение, загрузка пакетом (writeBatch), подписка на обновления (onSnapshot),",
            "удаление аккаунта. Тип FirestoreUserDoc — контракт между клиентом и хранилищем.",
        ],
        "app/services/firestoreService.ts",
        None,
    ),
    (
        [
            "app/services/syncRegistry.ts — мост между хуками и AuthSyncContext.",
            "Хуки не знают о Firebase напрямую: они зовут notifyProgressChanged, а контекст",
            "регистрирует свои колбэки. Это удаляет зависимость в обратную сторону и даёт",
            "одно событие SYNC_APPLIED_EVENT для разморозки React-состояния после remote-sync.",
        ],
        "app/services/syncRegistry.ts",
        None,
    ),
    (
        [
            "app/utils/deepLink.ts — глубокие ссылки на правила и времена.",
            "Кодирует в URL-фрагмент: ID правила/времени, язык отправителя и (опционально)",
            "точный диапазон выделенного текста с прикреплённым сообщением (Base64).",
            "Получатель открывает ссылку — приложение откроет нужный таб, развернёт правило",
            "и подсветит фрагмент.",
        ],
        "app/utils/deepLink.ts",
        None,
    ),
    (
        [
            "app/utils/notesStorage.ts — хранение заметок в localStorage.",
            "Каждая заметка содержит координаты выделения (selData), оригинальный текст,",
            "сообщение пользователя и временные метки. Удаление оставляет «tombstone»,",
            "чтобы синхронизация корректно убрала запись и из облака.",
        ],
        "app/utils/notesStorage.ts",
        None,
    ),
    (
        [
            "app/utils/clipboard.ts — копирование в буфер обмена.",
            "Современный API (navigator.clipboard) с фолбэком на скрытый textarea + execCommand —",
            "работает даже в безконтекстных мобильных WebView.",
        ],
        "app/utils/clipboard.ts",
        None,
    ),
    (
        [
            "app/utils/prompts.ts — генерация промтов для LLM (ChatGPT / Claude).",
            "Из правила и его контекста собирается готовый текст для копирования в чат-бота:",
            "приложение само просит LLM сгенерировать персональный тест по изученному.",
            "Все тексты промтов локализованы через i18n.",
        ],
        "app/utils/prompts.ts",
        None,
    ),
    (
        [
            "app/components/Tabs.tsx — переключатель вкладок.",
            "Лёгкий компонент с тремя кнопками. По наведению мышью на вкладку запускает",
            "prefetch соответствующего chunk-а — клик потом мгновенен.",
        ],
        "app/components/Tabs.tsx",
        None,
    ),
    (
        [
            "app/components/Grammar/RuleItem.tsx — карточка одного грамматического правила.",
            "Отвечает за чекбокс (с анимацией частиц при отметке), раскрытие подробного",
            "объяснения, копирование глубокой ссылки на правило, генерацию промта-теста,",
            "обработку тач-жестов (мобильный «один тап раскрыл, повторный тап — снова свернул»)",
            "и подсветку правила, если пользователь пришёл по deep-link.",
        ],
        "app/components/Grammar/RuleItem.tsx",
        None,
    ),
    (
        [
            "app/utils/particles.ts — салют из частиц при отметке правила.",
            "На canvas, наложенный поверх страницы, выстреливаются 14 геометрических частиц",
            "(круг / квадрат / звезда), расходящихся под углами с гравитацией и затуханием.",
            "Цвет берётся из CSS-переменной уровня, чтобы салют совпадал с цветовой темой A1—C2.",
        ],
        "app/utils/particles.ts",
        None,
    ),
    (
        [
            "app/components/Auth/AuthPage.tsx — экран входа в аккаунт.",
            "Минималистичный: одна кнопка «Войти через Google» (signInWithPopup) и ссылка",
            "«продолжить без аккаунта». Локальный прогресс при первом входе сольётся с",
            "облачным через диалог MergeDialog.",
        ],
        "app/components/Auth/AuthPage.tsx",
        None,
    ),
    (
        [
            "app/components/Tenses/TensesTab.tsx — корневой компонент вкладки «Времена».",
            "Сверху таймлайн, под ним — либо результат (если уже выбрано время), либо",
            "интерактивное дерево вопросов. Дополнительный режим «Сравнить» позволяет",
            "выбрать два времени и увидеть их формулы / маркеры рядом.",
        ],
        "app/components/Tenses/TensesTab.tsx",
        None,
    ),
    (
        [
            "app/components/Tenses/TenseTree.tsx — интерактивное дерево вопросов.",
            "Конечный автомат: текущий узел (start, present, present_now, …) определяет",
            "вопрос и набор ответов; каждый ответ либо ведёт на следующий узел, либо сразу",
            "выдаёт результат (TenseResult).",
        ],
        "app/components/Tenses/TenseTree.tsx",
        None,
    ),
    (
        [
            "app/data/tenseTree.ts — схема дерева вопросов для выбора времени.",
            "Граф из узлов; ключи labelKey / qKey ссылаются на i18n-строки.",
            "Все вопросы и ответы переведены на 6 языков.",
        ],
        "app/data/tenseTree.ts",
        None,
    ),
    (
        [
            "app/styles/base.css — глобальные стили и палитра тем.",
            "Все цвета вынесены в CSS-переменные на :root (тёмная тема) и [data-theme=\"light\"]",
            "(светлая). Это позволяет переключать тему мгновенно одним атрибутом на <html>",
            "и используется компонентами через var(--…).",
        ],
        "app/styles/base.css",
        None,
    ),
]


def main():
    pdf = PDFWriter(OUTPUT_PDF)
    pdf.cover()
    for intro, rel_path, rng in PLAN:
        pdf.header_intro(intro)
        if rng is None:
            lines = read_lines(rel_path)
        else:
            start, end = rng
            lines = read_lines(rel_path, start, end)
        pdf.code_block(lines)

    # Final footer
    pdf._draw_page_footer()
    pdf.c.save()
    print(f"Wrote: {OUTPUT_PDF}")


if __name__ == "__main__":
    main()
