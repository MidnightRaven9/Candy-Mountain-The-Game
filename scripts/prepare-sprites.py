#!/usr/bin/env python3
"""Render the source SVG artwork to transparent PNG sprites for Phaser/Android.

Requires cairosvg (pip install cairosvg). Outputs are committed to assets/ so
the game itself has no runtime SVG dependency.
"""
from pathlib import Path
import sys

try:
    import cairosvg
    from PIL import Image
except ImportError as exc:
    sys.exit("Missing dependency: %s (pip install cairosvg pillow)" % exc)

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
TMP = Path("/tmp/opencode/sprite-render")
TMP.mkdir(parents=True, exist_ok=True)


def render_svg(name, out_name, target_width, scale=3):
    src = ASSETS / name
    raw = TMP / (out_name + ".raw.png")
    cairosvg.svg2png(url=str(src), write_to=str(raw), scale=scale)

    img = Image.open(raw).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        pad = 8 * scale
        bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(img.width, bbox[2] + pad),
            min(img.height, bbox[3] + pad),
        )
        img = img.crop(bbox)

    if target_width and img.width != target_width:
        ratio = target_width / img.width
        img = img.resize((target_width, max(1, round(img.height * ratio))), Image.LANCZOS)

    out = ASSETS / out_name
    img.save(out, optimize=True)
    print("%-22s -> %-22s %dx%d" % (name, out_name, img.width, img.height))


render_svg("charlie-unicorn.svg", "charlie-unicorn.png", 560, 3)
render_svg("buddy-blue.svg", "buddy-blue.png", 180, 4)
render_svg("buddy-pink.svg", "buddy-pink.png", 180, 4)
