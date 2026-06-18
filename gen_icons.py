#!/usr/bin/env python3
"""Generate PRKH app icons (192 + 512) from the PRKH monogram SVG.

The monogram paths are straight-line polygons, so we rasterise them with
Pillow using 4x supersampling for crisp, anti-aliased edges.
"""
import os
from PIL import Image, ImageDraw

# ── PRKH monogram (dark icon) — straight-line polygons on a navy bg ──
VIEWBOX_W, VIEWBOX_H = 150, 167
BG = (5, 9, 20)          # #050914
FG = (255, 74, 28)       # #FF4A1C

PATHS = [
    # bottom-right stroke (the "kick")
    [(130, 56), (115, 66), (114, 94), (98, 94), (95, 81), (57, 109),
     (57, 140), (71, 140), (71, 116), (81, 108), (114, 108), (115, 140),
     (129, 140)],
    # main P/R body
    [(95, 44), (82, 38), (22, 38), (22, 124), (36, 114), (36, 53),
     (82, 53), (82, 62), (72, 70), (57, 66), (57, 98), (97, 68)],
]

SS = 4              # supersample factor
MARGIN = 0.07       # fraction of icon kept as empty padding around the logo
CORNER = 0.0        # 0 = square (the OS masks the corners on install)


def make_icon(size):
    s = size * SS
    img = Image.new("RGB", (s, s), BG)
    draw = ImageDraw.Draw(img)

    # Fit the 150x167 viewBox into the padded square, centered.
    avail = s * (1 - 2 * MARGIN)
    scale = min(avail / VIEWBOX_W, avail / VIEWBOX_H)
    off_x = (s - VIEWBOX_W * scale) / 2
    off_y = (s - VIEWBOX_H * scale) / 2

    for path in PATHS:
        pts = [(off_x + x * scale, off_y + y * scale) for (x, y) in path]
        draw.polygon(pts, fill=FG)

    return img.resize((size, size), Image.LANCZOS)


out_dir = os.path.dirname(os.path.abspath(__file__))
for sz in (192, 512):
    icon = make_icon(sz)
    path = os.path.join(out_dir, f"icon-{sz}.png")
    icon.save(path, "PNG")
    print(f"Written {path}")

# Apple touch icon (180) for iOS home screen
apple = make_icon(180)
apple_path = os.path.join(out_dir, "icon-180.png")
apple.save(apple_path, "PNG")
print(f"Written {apple_path}")

print("Icons generated!")
