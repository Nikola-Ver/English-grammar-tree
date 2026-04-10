# English Grammar Tree

An interactive web application for learning English grammar rules and verb tenses, organized by proficiency level (A1–B2+). The UI is in Russian, designed for Russian-speaking English learners.

**Live:** [english-tree-garmmar.web.app](https://english-tree-garmmar.web.app)

![Grammar rules page](screenshots/main-page.png)

---

## Features

### Grammar Rules
- Rules organized by CEFR levels: **A1, A2, B1, B2+**
- Each rule includes explanation, examples with translations, common mistakes, tips, and reference links (YouTube, Russian/English sources)
- Expandable cards — click a rule to read the full explanation

### Progress Tracking
- Mark rules as done/undone — saved automatically to localStorage
- Dashboard shows overall progress %, completed rule count, and completed levels
- Reset progress at any time

### Verb Tenses
- All 12 English tenses with formulas, time markers, examples, and common mistakes
- Interactive **decision tree** — answer questions to find the right tense for your sentence
- **Timeline visualization** showing how tenses relate to each other

![Tenses timeline](screenshots/tenses-scale.png)

### Search
- Full-text search across all rules (text, notes, explanations)
- Matching levels auto-expand on search

### AI Test Generation
- Generate a test prompt for any specific rule or for all completed rules
- One-click copy to clipboard — paste into ChatGPT or Claude

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Linting/Formatting | Biome |
| Git Hooks | Husky + lint-staged |
| Hosting | Firebase |

---

## Project Structure

```
english-grammar-tree/
├── app/
│   ├── components/
│   │   ├── Grammar/        # Grammar rules tab (levels, categories, rule cards)
│   │   ├── Tenses/         # Tenses tab (tree navigator, tense detail, timeline)
│   │   └── Header/         # Search bar and tab navigation
│   ├── data/
│   │   ├── grammar.ts      # Complete grammar database (A1–B2+)
│   │   ├── tenses.ts       # Tense definitions and examples
│   │   ├── tenseTree.ts    # Decision tree structure
│   │   └── timelineData.ts # Timeline visualization data
│   ├── hooks/
│   │   └── useProgress.ts  # Progress state (localStorage)
│   └── utils/
│       ├── clipboard.ts    # Copy to clipboard
│       ├── particles.ts    # Particle animation on rule completion
│       └── prompts.ts      # AI prompt builders
├── index.html
├── vite.config.ts
├── biome.json
└── firebase.json
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Deploy to Firebase
npm run deploy
```

Other scripts:

```bash
npm run lint      # Biome lint check
npm run format    # Auto-format code
npm run check     # Format + lint fix
npm run preview   # Preview production build locally
```

---

## Data Format

Grammar rules follow this structure:

```typescript
{
  id: 'a1_01',
  text: 'am / is / are — формы глагола to be',
  note: 'Short summary',
  exp: '<p>Full HTML explanation</p>',
  ex: [['I am a student.', 'Я студент.'], ...],
  exc: 'Special cases and exceptions',
  mistakes: ['Common mistake description', ...],
  links: [{ label: 'Video', url: '...', type: 'yt' | 'ru' | 'en' }],
  markers: { tags: ['...'], note: '...' }
}
```

---

## License

MIT
