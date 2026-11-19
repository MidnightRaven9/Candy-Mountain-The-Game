#!/usr/bin/env python3
"""Draw the Candy Mountain runner sprite with Pillow. Transparent PNG output."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

OUT = Path(__file__).resolve().parents[1] / 'assets' / 'charlie-unicorn.png'
OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = 1024, 720
SS = 3
img = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
d = ImageDraw.Draw(img, 'RGBA')

def sc(points):
    return [(x * SS, y * SS) for x, y in points]

def ellipse(box, fill):
    d.ellipse(tuple(v * SS for v in box), fill=fill)

def polygon(points, fill):
    d.polygon(sc(points), fill=fill)

def rounded_leg(x0, y0, x1, y1, bend=0, color=(252, 250, 239, 255)):
    """Draw a chunky rounded runner leg as two joined capsules."""
    mx, my = ((x0 + x1) / 2 + bend, (y0 + y1) / 2)
    d.line(sc([(x0, y0), (mx, my), (x1, y1)]), fill=color, width=65 * SS, joint='curve')
    d.ellipse(sc([(x0 - 33, y0 - 33), (x0 + 33, y0 + 33)]), fill=color)
    d.ellipse(sc([(x1 - 29, y1 - 17), (x1 + 29, y1 + 13)]), fill=color)
    # Hoof.
    hoof_y = y1 - 4
    d.rounded_rectangle(sc([(x1 - 35, hoof_y), (x1 + 35, hoof_y + 22)]), 8 * SS, fill=(38, 47, 67, 255))

INK = (43, 54, 72, 255)
WHITE = (252, 250, 239, 255)
SHADE = (215, 210, 196, 255)

# Tail behind body (rainbow tassels).
polygon([(157, 328), (70, 271), (151, 382)], (255, 89, 146, 255))
polygon([(140, 364), (42, 375), (161, 421)], (255, 181, 79, 255))
polygon([(138, 414), (88, 501), (182, 446)], (48, 210, 194, 255))
polygon([(154, 466), (141, 589), (210, 492)], (266 - 100, 146, 225, 255))

# Rear/back legs.
rounded_leg(264, 449, 205, 633, -24)
rounded_leg(382, 468, 289, 638, 14)

# Main body (rounded ellipse plus chest).
ellipse((139, 290, 625, 526), WHITE)
ellipse((361, 310, 664, 503), WHITE)
ellipse((442, 249, 700, 501), WHITE)
ellipse((157, 380, 614, 541), SHADE)   # belly shadow
ellipse((157, 330, 600, 525), (250, 248, 238, 255))

# Front legs (the right-facing runner pose).
rounded_leg(522, 451, 605, 650, 36)
rounded_leg(625, 423, 751, 593, 66)

# Neck crest / mane ribbons (rainbow-toned, drawn smoothly in overlapping arcs).
mane_segments = [
    ((619, 54), (554, 73), (498, 129), (449, 197), (400, 282), (346, 354), (290, 421)),
]
mane_colors = [(41, 207, 197, 255), (29, 171, 193, 255), (255, 91, 143, 255), (255, 154, 78, 255)]
for i, pts in enumerate(mane_segments):
    for j in range(len(pts) - 1):
        color = mane_colors[(i + j) % len(mane_colors)]
        p0, p1 = pts[j], pts[j + 1]
        d.line(sc([p0, p1]), fill=color, width=58 * SS, joint='curve')
        d.ellipse(sc([(p1[0] - 34, p1[1] - 34), (p1[0] + 34, p1[1] + 34)]), fill=color)

# Head shape: long snout, cheek, forehead.
polygon([(475, 176), (519, 89), (630, 60), (741, 118), (782, 252), (731, 366), (629, 394), (532, 315), (448, 251)], WHITE)
ellipse((505, 79, 732, 255), WHITE)
ellipse((628, 141, 811, 281), WHITE)
ellipse((697, 184, 866, 303), (247, 227, 216, 255))
polygon([(741, 256), (805, 264), (875, 326), (821, 363), (727, 321)], WHITE)

# Ear behind horn.
polygon([(542, 99), (470, -31), (650, 57)], WHITE)
polygon([(552, 78), (505, 6), (623, 60)], (255, 156, 183, 255))

# Candy-striped horn.
polygon([(626, 92), (679, -146), (744, 113)], (255, 232, 103, 255))
polygon([(656, -4), (709, -29), (729, 28), (674, 52)], (255, 86, 145, 255))
polygon([(644, 38), (711, 21), (722, 71), (659, 83)], (41, 207, 197, 255))
polygon([(668, -56), (711, -75), (722, -24), (681, -9)], (255, 154, 78, 255))

# Face: large eye with sparkle, eyelash ticks, nostril, soft smile.
ellipse((621, 139, 679, 213), INK)
ellipse((636, 153, 652, 171), (255, 255, 255, 255))
ellipse((627, 201, 635, 204), (255, 255, 255, 180))
d.line(sc([(610, 112), (590, 77)]), fill=INK, width=9 * SS)
d.line(sc([(635, 106), (622, 68)]), fill=INK, width=8 * SS)
ellipse((772, 236, 797, 252), (201, 119, 123, 255))
d.arc(tuple(v * SS for v in (641, 248, 781, 346)), start=18, end=152, fill=(167, 106, 37, 255), width=8 * SS)
# Rosy cheek.
ellipse((575, 211, 636, 269), (255, 194, 216, 120))

# Sparkle-cheek charm.
cx, cy = 552, 282
polygon([(cx, cy - 32), (cx + 16, cy - 8), (cx + 42, cy - 4), (cx + 20, cy + 19), (cx + 27, cy + 50), (cx, cy + 30), (cx - 27, cy + 50), (cx - 20, cy + 19), (cx - 42, cy - 4), (cx - 16, cy - 8)], (255, 91, 157, 255))
polygon([(cx, cy - 14), (cx + 8, cy + 6), (cx, cy + 18), (cx - 8, cy + 6)], (255, 232, 103, 255))

# Subtle mane shadow over neck.
d.arc(tuple(v * SS for v in (429, 70, 682, 328)), start=220, end=354, fill=(137, 111, 107, 115), width=18 * SS)

# Downsample for clean anti-aliased edges.
img = img.resize((W, H), Image.LANCZOS)
img.save(OUT)
print('created', OUT)
