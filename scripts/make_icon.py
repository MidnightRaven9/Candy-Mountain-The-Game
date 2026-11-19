#!/usr/bin/env python3
"""Create the Candy Mountain launcher icon deterministically with Pillow."""
from pathlib import Path
from math import cos, sin, pi
from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
OUT = Path(__file__).resolve().parents[1] / 'assets' / 'candy-mountain-icon.png'
OUT.parent.mkdir(parents=True, exist_ok=True)

img = Image.new('RGB', (SIZE, SIZE), '#164c5c')
d = ImageDraw.Draw(img, 'RGBA')

# Vertical night-sky gradient + gentle radial vignette.
for y in range(SIZE):
    t = y / (SIZE - 1)
    r = int(18 + 36 * t)
    g = int(54 + 72 * t)
    b = int(74 + 78 * t)
    d.line([(0, y), (SIZE, y)], fill=(r, g, b, 255))

# Soft stars and speed lines.
stars = [(112, 150, 8), (215, 88, 5), (345, 130, 6), (820, 158, 7), (732, 58, 5), (612, 175, 4), (485, 68, 6), (878, 330, 5)]
for x, y, s in stars:
    d.ellipse((x-s, y-s, x+s, y+s), fill=(255, 246, 190, 210))
for x, y, ln in [(132, 250, 52), (225, 310, 34), (770, 245, 46), (860, 430, 28)]:
    d.line((x, y, x + ln, y - ln // 3), fill=(255, 255, 255, 90), width=5)

# Rainbow arcs behind the mountain.
rainbow = [(239, 69, 76, 44), (251, 146, 60, 38), (251, 211, 77, 34), (48, 190, 113, 30), (45, 150, 245, 28), (169, 94, 220, 26)]
for i, color in enumerate(rainbow):
    offset = i * 39
    d.arc((78 - offset // 3, 262 + offset // 2, 946 + offset // 3, 770 + offset // 2), 180, 360, fill=(*color[:3], 225), width=color[3])

# Candy mountain silhouette.
mountain_mask = Image.new('L', (SIZE, SIZE), 0)
m = ImageDraw.Draw(mountain_mask)
m.polygon([(370, 520), (177, 822), (622, 822)], fill=255)
m.polygon([(535, 343), (250, 822), (810, 822)], fill=255)
d.polygon([(370, 520), (177, 822), (622, 822)], fill='#ff8a42')
d.polygon([(535, 343), (250, 822), (810, 822)], fill='#ffad21')
d.polygon([(535, 343), (250, 822), (535, 822)], fill='#f26b3d')
d.polygon([(535, 343), (250, 822), (535, 822)], fill=(255, 255, 255, 38))

# Peppermint stripes clipped into the main mountain.
stripe_layer = Image.new('RGBA', (SIZE, SIZE), (0, 0, 0, 0))
s = ImageDraw.Draw(stripe_layer)
for dx in (-270, -70, 230):
    s.polygon([(500 + dx, 420), (570 + dx, 420), (330 + dx, 822), (260 + dx, 822)], fill=(255, 255, 255, 205))
img.paste(stripe_layer, (0, 0), Image.composite(stripe_layer.split()[-1], Image.new('L', SIZE and (SIZE, SIZE), 0), mountain_mask))

# Candy-crystal peaks.
def peak_cap(apex_x, apex_y, half_width, color):
    d.polygon([(apex_x, apex_y), (apex_x - half_width, apex_y + 106), (apex_x - 18, apex_y + 78), (apex_x + half_width, apex_y + 106)], fill=color)
    d.polygon([(apex_x - 26, apex_y + 28), (apex_x + 12, apex_y + 28), (apex_x + 45, apex_y + 65), (apex_x - 70, apex_y + 65)], fill=(255, 255, 255, 125))

peak_cap(372, 528, 72, '#ff4f9a')
peak_cap(535, 350, 86, '#ff4f9a')

# Ground / rainbow road.
d.polygon([(0, 762), (180, 725), (330, 782), (520, 742), (675, 792), (890, 735), (1024, 786), (1024, 1024), (0, 1024)], fill='#331f54')
d.polygon([(0, 802), (180, 762), (330, 817), (520, 779), (675, 827), (890, 770), (1024, 826), (1024, 1024), (0, 1024)], fill='#241639')

# Generic cartoon unicorn head built from simple forms (not a copyrighted likeness).
# Neck + head silhouette.
head = [(318, 812), (314, 665), (338, 490), (412, 390), (530, 354), (638, 386), (700, 488), (730, 575), (684, 686), (632, 780), (600, 882), (392, 882)]
d.polygon(head, fill='#ffd84d')
d.ellipse((326, 670, 620, 852), fill='#ffd84d')
d.ellipse((569, 468, 718, 609), fill='#ffd84d')

# Mane flowing down the back (teal ribbons).
d.polygon([(314, 735), (250, 690), (290, 540), (350, 405), (434, 330), (490, 320), (450, 432), (365, 500), (292, 648), (275, 752)], fill='#16c5c0')
d.polygon([(382, 380), (315, 238), (470, 350)], fill='#ffd84d')
d.polygon([(415, 365), (362, 252), (495, 345)], fill='#f4ad24')

# Horn with candy stripes.
d.polygon([(548, 356), (589, 177), (662, 390)], fill='#fff3b0')
d.polygon([(577, 248), (633, 315), (606, 329), (550, 262)], fill='#ff4f9a')
d.polygon([(537, 292), (611, 370), (581, 379), (508, 302)], fill='#16c5c0')

# Ear and inner ear.
d.polygon([(380, 408), (318, 266), (473, 365)], fill='#ffd84d')
d.polygon([(386, 367), (351, 311), (437, 360)], fill='#ff8db6')

# Face details: eye, lashes, nostril, soft cheek.
d.ellipse((540, 488, 590, 538), fill='#173a4a')
d.ellipse((555, 498, 568, 511), fill='#ffffff')
d.line((532, 477, 516, 459), fill='#173a4a', width=6)
d.line((550, 471, 544, 449), fill='#173a4a', width=6)
d.ellipse((632, 552, 706, 613), fill='#ffc2cf')
d.ellipse((655, 582, 668, 590), fill='#8d3e4d')
d.arc((475, 560, 678, 710), 18, 165, fill='#a95b12', width=8)
d.ellipse((485, 565, 540, 620), fill=(255, 255, 255, 70))

# A tiny candy-star emblem on the cheek.
cx, cy = 455, 640
d.polygon([(cx, cy - 19), (cx + 10, cy - 4), (cx + 28, cy), (cx + 10, cy + 8), (cx, cy + 25), (cx - 10, cy + 8), (cx - 28, cy), (cx - 10, cy - 4)], fill='#ff4f9a')
d.polygon([(cx, cy - 8), (cx + 5, cy), (cx, cy + 12), (cx - 5, cy)], fill='#ffd84d')

# Thick icon border and bottom title-safe contrast bar.
d.rounded_rectangle((18, 18, SIZE - 18, SIZE - 18), radius=160, outline=(255, 255, 255, 145), width=14)
d.rounded_rectangle((45, 45, SIZE - 45, SIZE - 45), radius=136, outline=(7, 22, 31, 130), width=10)

img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=105, threshold=3))
img.save(OUT, optimize=True)
print(f'created {OUT}')
