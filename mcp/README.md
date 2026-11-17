# English Grammar Tree — Claude connector

A small program that runs on your own computer and connects Claude to your
[English Grammar Tree](https://english-tree-garmmar.web.app) account. No server, no paid plan.

With it, Claude can:

- read your progress (level, streak, weakest rules, traps);
- correct your English while answering your real question, and log each mistake against a rule;
- run drills from the app inside the chat, and count them as real practice: a correct answer
  moves the exercise forward (leaves grow on your tree), a wrong one sends it back for review,
  and a finished round counts as a training session towards your daily goal and streak;
- mark a rule as **shaky** itself when it sees that you do not really command it;
- send the mistakes back to the app, where a rule you keep breaking is marked **shaky** —
  even if it is ticked as done — and comes back in your daily session until you answer its
  exercises correctly on 3 different days.

## Set up

Build it once from the repository root (Node 18+):

```bash
npm run build:mcp
```

**Claude Code**

```bash
claude mcp add english-grammar-tree --scope user -- node /absolute/path/to/mcp/dist/index.js
```

**Claude Desktop** — add to `claude_desktop_config.json` (Settings → Developer → Edit Config):

```json
{
  "mcpServers": {
    "english-grammar-tree": {
      "command": "node",
      "args": ["/absolute/path/to/mcp/dist/index.js"]
    }
  }
}
```

Then ask Claude: *"Connect my English Grammar Tree account."* The app opens in your browser;
sign in if needed and click **Allow**.

To have Claude correct you in every chat, add this to your personal instructions in Claude:

> I'm learning English. Use the english-grammar-tree tools: check my progress at the start,
> correct my English mistakes briefly after answering, and log them.

## How it stores and syncs

- Everything is kept in `~/.english-grammar-tree/` (`auth.json`, `data.json`, readable only by you).
- Tools read and write that local copy, so they are instant and cost nothing.
- Sync with the app happens on the **first use each day** and when you ask Claude to sync:
  two document reads and at most one write.
- Mistakes go to `users/{uid}/practice/claude`; the app reads it at sign-in. You can delete
  single mistakes or all of them in the app (Today → Progress → *Claude noticed*).

## Options (environment variables)

| Variable | Effect |
|---|---|
| `EGT_NO_TEXT=1` | Upload only which rule was broken, never what you wrote |
| `EGT_LANG=ru` | Russian explanations and translate-into-English drills |
| `EGT_APP_URL` | App address used for sign-in (default: the public app) |
| `EGT_HOME` | Where the local files live |

To sign out and delete the local copy, ask Claude to *disconnect English Grammar Tree*.

## What "shaky" means

One mistake sends one exercise of that rule back to your mistake deck. Three mistakes on the
same rule, made on at least two different days within two weeks, mark the rule shaky.
Claude can also mark a rule shaky directly, with a one-line reason that the app shows next to
the rule.
