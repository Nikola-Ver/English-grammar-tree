#!/usr/bin/env python3
"""
Translate app/i18n/rules/en/*.json → app/i18n/rules/<lang>/*.json (resumable).
Requires: pip install deep-translator
Usage: python scripts/translate_rules.py de
"""
from __future__ import annotations

import argparse
import json
import random
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
RULES = ROOT / "app/i18n/rules"

MURPHY_HUBS: dict[str, dict[str, str]] = {
    "en": {
        "EL": "https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar",
        "INT": "https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar",
        "ADV": "https://learnenglish.britishcouncil.org/grammar/c1-grammar",
    },
    "de": {
        "EL": "https://www.ego4u.de/en/cram-up/grammar",
        "INT": "https://www.ego4u.de/en/cram-up/grammar",
        "ADV": "https://www.ego4u.de/en/cram-up/grammar",
    },
    "es": {
        "EL": "https://www.curso-ingles.com/aprender/cursos/nivel-basico",
        "INT": "https://www.curso-ingles.com/aprender/cursos/nivel-intermedio",
        "ADV": "https://www.curso-ingles.com/aprender/cursos/nivel-avanzado",
    },
    "fr": {
        "EL": "https://www.lepointdufle.net/grammaire-anglais.htm",
        "INT": "https://www.lepointdufle.net/grammaire-anglais.htm",
        "ADV": "https://www.lepointdufle.net/grammaire-anglais.htm",
    },
    "zh": {
        "EL": "https://www.hjenglish.com/new/p128800/",
        "INT": "https://www.hjenglish.com/yufabu/",
        "ADV": "https://www.hjenglish.com/yufabu/",
    },
}


def murphy_level(rid: str) -> str:
    if rid.startswith("el_"):
        return "EL"
    if rid.startswith("int_"):
        return "INT"
    if rid.startswith("adv_"):
        return "ADV"
    return "EL"


def pause() -> None:
    time.sleep(random.uniform(0.005, 0.015))


def tr(translator: GoogleTranslator, text: str) -> str:
    if not text or not str(text).strip():
        return text
    for attempt in range(5):
        try:
            out = translator.translate(str(text)[:4800])
            pause()
            return out
        except Exception as e:
            wait = (attempt) * 0.25
            print(f"    retry {wait}s: {e}", flush=True)
            time.sleep(wait)
    return text


def translate_grammar_value(translator: GoogleTranslator, rule: dict) -> dict:
    parts = [
        rule.get("text") or "",
        rule.get("note") or "",
        rule.get("exp") or "",
        rule.get("exc") or "",
        rule.get("tip") or "",
    ]
    sep = "\n§§FIELD§§\n"
    blob = sep.join(parts)
    tb = tr(translator, blob)
    ps = tb.split(sep)
    while len(ps) < 5:
        ps.append("")
    text, note, exp, exc, tip = ps[:5]

    mistakes = rule.get("mistakes") or []
    if mistakes:
        msep = "\n§§M§§\n"
        joined = msep.join(mistakes)
        tm = tr(translator, joined)
        nm = tm.split(msep)
        mistakes = nm if len(nm) == len(mistakes) else [tr(translator, m) for m in mistakes]

    markers = rule.get("markers")
    if markers and isinstance(markers, dict) and markers.get("tags"):
        tags = list(markers["tags"])
        joined = " | ".join(tags)
        tt = tr(translator, joined)
        nt = [x.strip() for x in tt.split("|")]
        tags = nt if len(nt) == len(tags) else [tr(translator, x) for x in tags]
        markers = {**markers, "tags": tags}
        if markers.get("note"):
            markers = {**markers, "note": tr(translator, markers["note"])}

    ex = rule.get("ex") or []
    new_ex: list = []
    if ex:
        seconds = [p[1] for p in ex if isinstance(p, (list, tuple)) and len(p) >= 2 and p[1]]
        if seconds:
            xsep = "\n§§EX§§\n"
            joined = xsep.join(seconds)
            tout = tr(translator, joined)
            outs = tout.split(xsep)
            if len(outs) == len(seconds):
                si = 0
                for p in ex:
                    if isinstance(p, (list, tuple)) and len(p) >= 2 and p[1]:
                        new_ex.append([p[0], outs[si]])
                        si += 1
                    elif isinstance(p, (list, tuple)):
                        new_ex.append([p[0], p[1] if len(p) > 1 else ""])
                    else:
                        new_ex.append(p)
            else:
                for p in ex:
                    if isinstance(p, (list, tuple)) and len(p) >= 2 and p[1]:
                        new_ex.append([p[0], tr(translator, p[1])])
                    elif isinstance(p, (list, tuple)):
                        new_ex.append([p[0], ""])
                    else:
                        new_ex.append(p)
        else:
            new_ex = [list(p) if isinstance(p, (list, tuple)) else p for p in ex]

    return {
        "text": text,
        "note": note,
        "exp": exp,
        "exc": exc,
        "tip": tip,
        "mistakes": mistakes,
        "markers": markers,
        "ex": new_ex,
    }


def translate_murphy_value(translator: GoogleTranslator, lang: str, rid: str, rule: dict) -> dict:
    sep = "\n§§FIELD§§\n"
    blob = sep.join([rule.get("text") or "", rule.get("note") or "", rule.get("exp") or ""])
    tb = tr(translator, blob)
    ps = tb.split(sep)
    while len(ps) < 3:
        ps.append("")
    text, note, exp = ps[:3]
    hubs = MURPHY_HUBS.get(lang, MURPHY_HUBS["en"])
    unit_url = hubs.get(murphy_level(rid), list(hubs.values())[0])
    return {"text": text, "note": note, "exp": exp, "unitUrl": unit_url}


def run_lang(target: str) -> None:
    target = target.lower().strip()
    google_target = "zh-CN" if target == "zh" else target
    if target == "en":
        raise SystemExit("Use target de|es|fr|zh (en is source).")

    translator = GoogleTranslator(source="en", target=google_target)
    src_dir = RULES / "en"
    out_dir = RULES / target
    out_dir.mkdir(parents=True, exist_ok=True)

    # grammar
    g_src = json.loads((src_dir / "grammar.json").read_text(encoding="utf-8"))
    g_path = out_dir / "grammar.json"
    g_out: dict = {}
    if g_path.exists():
        try:
            g_out = json.loads(g_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            g_out = {}
    ids = sorted(g_src.keys())
    print(f"Grammar {len(ids)} rules → {target}", flush=True)
    for i, rid in enumerate(ids):
        if rid in g_out and g_out[rid].get("text"):
            continue
        print(f"  {i + 1}/{len(ids)} {rid}", flush=True)
        g_out[rid] = translate_grammar_value(translator, g_src[rid])
        if i % 8 == 0:
            g_path.write_text(json.dumps(g_out, ensure_ascii=False, indent=2), encoding="utf-8")
    g_path.write_text(json.dumps(g_out, ensure_ascii=False, indent=2), encoding="utf-8")

    # murphy
    m_src = json.loads((src_dir / "murphy.json").read_text(encoding="utf-8"))
    m_path = out_dir / "murphy.json"
    m_out: dict = {}
    if m_path.exists():
        try:
            m_out = json.loads(m_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            m_out = {}
    mids = sorted(m_src.keys())
    print(f"Murphy {len(mids)} units → {target}", flush=True)
    for i, rid in enumerate(mids):
        if rid in m_out and m_out[rid].get("text"):
            continue
        print(f"  {i + 1}/{len(mids)} {rid}", flush=True)
        m_out[rid] = translate_murphy_value(translator, target, rid, m_src[rid])
        if i % 8 == 0:
            m_path.write_text(json.dumps(m_out, ensure_ascii=False, indent=2), encoding="utf-8")
    m_path.write_text(json.dumps(m_out, ensure_ascii=False, indent=2), encoding="utf-8")

    print("Done.", flush=True)


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("lang", help="de | es | fr | zh")
    args = p.parse_args()
    run_lang(args.lang)


if __name__ == "__main__":
    main()
