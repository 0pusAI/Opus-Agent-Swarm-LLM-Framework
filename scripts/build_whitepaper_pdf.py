r"""
scripts/build_whitepaper_pdf.py

Render docs/whitepaper.md as a styled PDF, written to
opus-web/public/whitepaper.pdf so the website's CTA link resolves.

Run from the monorepo root:

    .\opus-core\.venv\Scripts\python.exe scripts\build_whitepaper_pdf.py

This is a focused parser for the OPUS whitepaper's specific structure,
not a general markdown converter — handles:
  - title, subtitle, version line
  - ## / ### headings
  - body paragraphs (with **bold**, *italic*, `code`, [link](url))
  - bullet and numbered lists
  - blockquotes
  - fenced code blocks (preserves whitespace; used for ASCII diagrams)
  - pipe tables
  - horizontal rules
"""

from __future__ import annotations

import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

# OPUS palette
OPUS_BLACK = HexColor("#000000")
OPUS_BONE  = HexColor("#F2EFE6")
OPUS_GOLD  = HexColor("#D4AF7A")
OPUS_DIM   = HexColor("#787870")
OPUS_PARCH = HexColor("#F8F5EE")
OPUS_RULE  = HexColor("#E5DFD0")

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "whitepaper.md"
OUTPUT = ROOT / "opus-web" / "public" / "whitepaper.pdf"


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "OpusTitle", parent=base["Title"],
            fontName="Times-Bold", fontSize=34, leading=38,
            alignment=TA_CENTER, textColor=OPUS_BLACK,
            spaceBefore=24, spaceAfter=8,
        ),
        "subtitle": ParagraphStyle(
            "OpusSubtitle", parent=base["Italic"],
            fontName="Times-Italic", fontSize=11, leading=15,
            alignment=TA_CENTER, textColor=OPUS_DIM,
            spaceAfter=2,
        ),
        "version": ParagraphStyle(
            "OpusVersion", parent=base["Normal"],
            fontName="Courier", fontSize=8, leading=12,
            alignment=TA_CENTER, textColor=OPUS_DIM,
            spaceAfter=36,
        ),
        "h1": ParagraphStyle(
            "OpusH1", parent=base["Heading1"],
            fontName="Times-Bold", fontSize=18, leading=22,
            textColor=OPUS_GOLD, spaceBefore=28, spaceAfter=12,
            keepWithNext=True,
        ),
        "h2": ParagraphStyle(
            "OpusH2", parent=base["Heading2"],
            fontName="Times-Bold", fontSize=13, leading=17,
            textColor=OPUS_BLACK, spaceBefore=16, spaceAfter=8,
            keepWithNext=True,
        ),
        "body": ParagraphStyle(
            "OpusBody", parent=base["Normal"],
            fontName="Times-Roman", fontSize=10.5, leading=15,
            alignment=TA_JUSTIFY, spaceAfter=10,
        ),
        "list": ParagraphStyle(
            "OpusList", parent=base["Normal"],
            fontName="Times-Roman", fontSize=10.5, leading=15,
            alignment=TA_LEFT, spaceAfter=4,
            leftIndent=22, firstLineIndent=-14,
        ),
        "code": ParagraphStyle(
            "OpusCode", parent=base["Code"],
            fontName="Courier", fontSize=8, leading=10,
            leftIndent=8, rightIndent=8, spaceAfter=12,
            backColor=OPUS_PARCH, borderColor=OPUS_RULE,
            borderWidth=0.5, borderPadding=8,
        ),
        "quote": ParagraphStyle(
            "OpusQuote", parent=base["Italic"],
            fontName="Times-Italic", fontSize=10.5, leading=16,
            leftIndent=24, rightIndent=24, textColor=OPUS_DIM,
            spaceAfter=12,
        ),
        "footer": ParagraphStyle(
            "OpusFooter", parent=base["Normal"],
            fontName="Courier", fontSize=8, leading=12,
            alignment=TA_CENTER, textColor=OPUS_DIM,
            spaceBefore=36,
        ),
    }


# ──────────────────────────────────────────────────────────────────
# Inline markdown → reportlab markup
# ──────────────────────────────────────────────────────────────────

_BOLD_RE   = re.compile(r"\*\*(.+?)\*\*")
_ITALIC_RE = re.compile(r"(?<!\*)\*([^*]+)\*(?!\*)")
_CODE_RE   = re.compile(r"`([^`]+)`")
_LINK_RE   = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def md_inline(text: str) -> str:
    # Escape reportlab markup chars first.
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    # Stash code spans BEFORE bold/italic so an asterisk inside `*.py`
    # doesn't get paired with a real italic asterisk elsewhere in the line.
    code_spans: list[str] = []

    def stash_code(m: re.Match) -> str:
        code_spans.append(m.group(1))
        return f"\x00CODE{len(code_spans) - 1}\x00"

    text = _CODE_RE.sub(stash_code, text)

    # Now safe to handle bold and italic.
    text = _BOLD_RE.sub(r"<b>\1</b>", text)
    text = _ITALIC_RE.sub(r"<i>\1</i>", text)
    text = _LINK_RE.sub(r"<i>\1</i>", text)  # drop target, keep label

    # Restore code spans as a Courier font run.
    for i, code in enumerate(code_spans):
        text = text.replace(
            f"\x00CODE{i}\x00",
            f'<font name="Courier" size="9.5">{code}</font>',
        )
    return text


# ──────────────────────────────────────────────────────────────────
# Parser
# ──────────────────────────────────────────────────────────────────

_NUMBERED_RE = re.compile(r"^\d+\.\s+")


def parse_markdown(md_text: str, styles: dict[str, ParagraphStyle]) -> list:
    story: list = []
    lines = md_text.split("\n")
    i = 0
    title_seen = False
    in_code = False
    code_buf: list[str] = []
    table_rows: list[list[str]] = []

    def flush_code():
        nonlocal code_buf
        if code_buf:
            text = "\n".join(code_buf).rstrip()
            if text:
                story.append(Preformatted(text, styles["code"]))
            code_buf = []

    def flush_table():
        nonlocal table_rows
        if not table_rows:
            return
        cleaned = [
            r for r in table_rows
            if not all(re.match(r"^[-:]+$", c.strip()) for c in r if c.strip())
        ]
        if cleaned:
            wrapped = [
                [Paragraph(md_inline(cell), styles["body"]) for cell in row]
                for row in cleaned
            ]
            tbl = Table(wrapped, repeatRows=1, hAlign="LEFT")
            tbl.setStyle(TableStyle([
                ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
                ("TEXTCOLOR", (0, 0), (-1, 0), OPUS_GOLD),
                ("BACKGROUND", (0, 0), (-1, 0), OPUS_PARCH),
                ("LINEBELOW", (0, 0), (-1, 0), 0.6, OPUS_DIM),
                ("LINEBELOW", (0, -1), (-1, -1), 0.4, OPUS_DIM),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.append(tbl)
            story.append(Spacer(1, 12))
        table_rows = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Fenced code blocks
        if stripped.startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_buf.append(line)
            i += 1
            continue

        # Pipe-table row
        if stripped.startswith("|") and stripped.endswith("|") and stripped.count("|") >= 2:
            cells = [c.strip() for c in stripped[1:-1].split("|")]
            table_rows.append(cells)
            i += 1
            continue
        elif table_rows:
            flush_table()

        # Headings
        if stripped.startswith("# "):
            text = md_inline(stripped[2:])
            story.append(Paragraph(text, styles["title"] if not title_seen else styles["h1"]))
            title_seen = True
        elif stripped.startswith("## "):
            story.append(Paragraph(md_inline(stripped[3:]), styles["h1"]))
        elif stripped.startswith("### "):
            story.append(Paragraph(md_inline(stripped[4:]), styles["h2"]))
        elif stripped.startswith("#### "):
            story.append(Paragraph(md_inline(stripped[5:]), styles["h2"]))
        elif stripped.startswith("> "):
            story.append(Paragraph(md_inline(stripped[2:]), styles["quote"]))
        elif stripped.startswith("---"):
            story.append(HRFlowable(
                width="60%", thickness=0.5, color=OPUS_DIM,
                hAlign="CENTER", spaceBefore=6, spaceAfter=12,
            ))
        elif (stripped.startswith("*")
              and stripped.endswith("*")
              and not stripped.startswith("**")
              and title_seen
              and i < 12):
            # Subtitle directly after title
            story.append(Paragraph(md_inline(stripped[1:-1]), styles["subtitle"]))
        elif re.match(r"^Version\s+", stripped) and "MMXX" in stripped:
            story.append(Paragraph(md_inline(stripped), styles["version"]))
        elif stripped.startswith(("- ", "* ")):
            story.append(Paragraph("•&nbsp;&nbsp;" + md_inline(stripped[2:]), styles["list"]))
        elif _NUMBERED_RE.match(stripped):
            num_match = _NUMBERED_RE.match(stripped)
            assert num_match is not None
            num_text = num_match.group(0).strip()
            rest = stripped[num_match.end():]
            story.append(Paragraph(
                f"<b>{num_text}</b>&nbsp;&nbsp;{md_inline(rest)}",
                styles["list"],
            ))
        elif stripped == "":
            pass  # blank line
        else:
            # Body paragraph — collect continuation lines
            buf = [stripped]
            i += 1
            while i < len(lines):
                nxt_raw = lines[i]
                nxt = nxt_raw.rstrip()
                nxt_strip = nxt.strip()
                if (
                    not nxt_strip
                    or nxt_strip.startswith(("#", ">", "```", "|", "---"))
                    or nxt_strip.startswith(("- ", "* "))
                    or _NUMBERED_RE.match(nxt_strip)
                ):
                    break
                buf.append(nxt_strip)
                i += 1
            story.append(Paragraph(md_inline(" ".join(buf)), styles["body"]))
            continue

        i += 1

    flush_code()
    flush_table()
    return story


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source not found: {SOURCE}")

    md = SOURCE.read_text(encoding="utf-8")
    styles = make_styles()
    story = parse_markdown(md, styles)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    flowable_count = len(story)  # build() consumes the list, so capture first

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        topMargin=1.0 * inch,
        bottomMargin=1.0 * inch,
        leftMargin=1.0 * inch,
        rightMargin=1.0 * inch,
        title="OPUS — Whitepaper",
        author="OPUS Project",
        subject="A bio-inspired multi-agent swarm architecture for collective reasoning.",
    )
    doc.build(story)
    size_kb = OUTPUT.stat().st_size / 1024
    print(f"Wrote {OUTPUT} ({size_kb:.1f} KB, {flowable_count} flowables)")


if __name__ == "__main__":
    main()
