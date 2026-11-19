/** Procedural parody artwork for Candy Mountain The Game. No external assets. */
const TextureFactory = {
  createTextures: function (scene) {
    if (scene.textures.exists('sky')) return;

    var g = scene.add.graphics();

    // Wide sunset-gradient sky with stars, sun and rainbow.
    var H = 500;
    var W = 800;
    var rows = 90;
    var colors = [
      [14, 28, 70], [26, 38, 92], [43, 43, 107], [70, 50, 120], [104, 66, 126],
      [139, 76, 124], [174, 83, 109], [208, 96, 94], [231, 125, 83], [250, 166, 97]
    ];
    for (var i = 0; i < rows; i++) {
      var t = i / (rows - 1);
      var index = Math.min(colors.length - 1, Math.floor(t * (colors.length - 1)));
      var next = Math.min(colors.length - 1, index + 1);
      var local = (t * (colors.length - 1)) - index;
      var c = colors[index];
      var n = colors[next];
      var r = Math.floor(c[0] + (n[0] - c[0]) * local);
      var gg = Math.floor(c[1] + (n[1] - c[1]) * local);
      var b = Math.floor(c[2] + (n[2] - c[2]) * local);
      g.fillStyle(Phaser.Display.Color.GetColor(r, gg, b), 1);
      g.fillRect(0, Math.floor((H / rows) * i), W, Math.ceil(H / rows) + 1);
    }

    // Stars (upper third).
    var stars = [
      [52, 34, 2.2], [104, 78, 1.6], [174, 46, 2.8], [248, 96, 1.5],
      [335, 42, 2.1], [406, 72, 1.4], [514, 36, 2.5], [618, 86, 1.7],
      [722, 44, 2.4], [776, 132, 1.4], [286, 132, 1.6], [160, 138, 1.5]
    ];
    stars.forEach(function (s) {
      g.fillStyle(0xfff6c8, 0.92);
      g.fillCircle(s[0], s[1], s[2]);
      g.lineStyle(1, 0xfff6c8, 0.35);
      g.strokePoints([
        [s[0] - s[2] * 3, s[1]], [s[0] + s[2] * 3, s[1]],
        [s[0], s[1] - s[2] * 3], [s[0], s[1] + s[2] * 3]
      ], false, true);
    });

    // Setting sun.
    g.fillStyle(0xffdd66, 0.78);
    g.fillCircle(650, 310, 96);
    g.fillStyle(0xffdd66, 0.28);
    g.fillCircle(650, 310, 128);

    // Rainbow arcs behind the mountain.
    var rainbowBands = [0xff5161, 0xff8f1f, 0xffd25f, 0x40d06d, 0x29b7ff, 0xb45cf2];
    rainbowBands.forEach(function (color, i) {
      g.lineStyle(13, color, 0.9);
      g.beginPath();
      g.arc(400, 468, 335 - (i * 15), Math.PI, Math.PI * 2);
      g.strokePath();
    });

    // Distant hills.
    g.fillStyle(0x48295f, 0.95);
    g.fillPoints([[0, 342], [74, 318], [158, 342], [232, 306], [310, 343], [405, 335], [498, 372], [586, 330], [652, 356], [716, 332], [800, 360], [800, 500], [0, 500]], true);
    g.fillStyle(0x2a1739, 0.98);
    g.fillPoints([[0, 395], [92, 372], [170, 402], [254, 374], [330, 405], [428, 380], [514, 410], [604, 382], [704, 412], [800, 390], [800, 500], [0, 500]], true);
    g.generateTexture('sky', W, H);

    // Ground texture (grass, candy stripes, trail).
    g.clear();
    g.fillStyle(0x315c35);
    g.fillRect(0, 0, 96, 40);
    g.fillStyle(0x45a95d);
    g.fillRect(0, 0, 96, 9);
    g.fillStyle(0x7bd26a);
    g.fillRect(0, 0, 96, 3);
    for (var x = -10; x < 110; x += 16) {
      g.fillStyle((x / 16) % 2 ? 0xffd25f : 0xff5c8e);
      g.fillRect(x, 18, 8, 5);
    }
    g.fillStyle(0x203a25, 0.7);
    g.fillRect(0, 30, 96, 10);
    g.generateTexture('ground', 96, 40);

    // Cloud texture.
    g.clear();
    g.fillStyle(0xffffff, 0.96);
    g.fillCircle(16, 13, 11);
    g.fillCircle(32, 8, 14);
    g.fillCircle(50, 13, 13);
    g.fillCircle(66, 16, 9);
    g.fillRoundedRect(9, 12, 61, 16, 8);
    g.generateTexture('cloud', 80, 32);

    // Candy cane (hooked top, red stripes).
    g.clear();
    g.lineStyle(14, 0xffffff, 1);
    g.lineBetween(11, 46, 11, 16);
    g.beginPath();
    g.arc(18, 16, 11, Math.PI * 0.95, Math.PI * 1.8);
    g.strokePath();
    g.lineStyle(5, 0xdd243c, 1);
    g.lineBetween(11, 40, 11, 36);
    g.lineBetween(11, 28, 11, 23);
    g.lineBetween(10, 16, 15, 13);
    g.lineBetween(15, 9, 21, 12);
    g.generateTexture('cane', 25, 48);

    // Lollipop spike.
    g.clear();
    g.fillStyle(0xd6a95f);
    g.fillRoundedRect(11, 16, 5, 25, 2);
    var lolli = [0xff5c8e, 0xff8fbe, 0xffd1e6, 0xffffff, 0xff8fbe, 0xff5c8e];
    lolli.forEach(function (color, i) {
      g.fillStyle(color);
      g.fillCircle(13, 13, 13 - i * 2);
    });
    g.lineStyle(2, 0xffffff, 0.9);
    g.strokeCircle(13, 13, 7);
    g.generateTexture('lollipop', 28, 43);

    // Floating rainbow fragment.
    g.clear();
    var rainbow = [0xff4757, 0xff8f1f, 0xffd25f, 0x2ed573, 0x29b7ff, 0xb45cf2];
    rainbow.forEach(function (color, i) {
      g.fillStyle(color, 0.95);
      g.fillRoundedRect(0, i * 4, 72, 4, 2);
    });
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(10, 30, 2);
    g.fillCircle(36, 30, 2);
    g.fillCircle(62, 30, 2);
    g.generateTexture('rainbow', 72, 26);

    // Candy Mountain silhouette.
    g.clear();
    g.fillStyle(0xff8f21);
    g.fillTriangle(82, 12, 0, 140, 188, 140);
    g.fillStyle(0xffad2a);
    g.fillTriangle(82, 12, 82, 140, 188, 140);
    g.fillStyle(0xe44b45);
    g.fillTriangle(32, 64, -46, 140, 113, 140);
    g.fillTriangle(135, 74, 58, 140, 210, 140);
    // Peppermint caps.
    g.fillStyle(0xff4f9a);
    g.fillTriangle(82, 12, 49, 54, 116, 54);
    g.fillStyle(0xffffff, 0.75);
    g.fillTriangle(82, 17, 60, 44, 104, 44);
    g.fillStyle(0xff4f9a);
    g.fillTriangle(32, 64, 12, 92, 53, 92);
    g.fillTriangle(135, 74, 114, 101, 157, 101);
    // Candy dots on slopes.
    g.fillStyle(0xffffff, 0.65);
    [38, 86, 134].forEach(function (x) {
      g.fillCircle(x, 108, 5);
    });
    g.generateTexture('mountain', 190, 140);

    g.destroy();
  },

  drawUnicorn: function (g, x, y, scale) {
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(x + 48 * scale, y + 74 * scale, 52 * scale, 7 * scale);

    // Body and neck.
    g.fillStyle(0xfaf6ed);
    g.fillEllipse(x + 34 * scale, y + 47 * scale, 42 * scale, 27 * scale);
    g.fillPoints([
      [x + 46 * scale, y + 41 * scale],
      [x + 52 * scale, y + 26 * scale],
      [x + 63 * scale, y + 22 * scale],
      [x + 74 * scale, y + 39 * scale],
      [x + 62 * scale, y + 55 * scale]
    ], true);

    // Head and muzzle.
    g.fillEllipse(x + 68 * scale, y + 27 * scale, 30 * scale, 26 * scale);
    g.fillEllipse(x + 77 * scale, y + 33 * scale, 21 * scale, 14 * scale);

    // Legs.
    g.fillStyle(0xfaf6ed);
    [16, 28, 48, 61].forEach(function (ox) {
      g.fillRoundedRect(x + ox * scale, y + 52 * scale, 8 * scale, 20 * scale, 4 * scale);
    });
    g.fillStyle(0x2a2535);
    [16, 28, 48, 61].forEach(function (ox) {
      g.fillRect(x + ox * scale, y + 68 * scale, 8 * scale, 4 * scale);
    });

    // Fluffy multicolor mane (original design, not copied official art).
    var maneColors = [0x23d5cf, 0x1aa6b4, 0xff4f9a, 0xff8fb5];
    var manePoints = [
      [60, 3, 11], [50, 10, 13], [42, 18, 15], [33, 28, 16], [23, 39, 15], [14, 49, 13]
    ];
    manePoints.forEach(function (point, i) {
      g.fillStyle(maneColors[i % maneColors.length]);
      g.fillCircle(x + point[0] * scale, y + point[1] * scale, point[2] * scale);
    });

    // Tail.
    var tail = [[3, 42, 14], [10, 52, 13], [2, 61, 12], [11, 67, 9]];
    tail.forEach(function (point, i) {
      g.fillStyle(maneColors[(i + 1) % maneColors.length]);
      g.fillCircle(x + point[0] * scale, y + point[1] * scale, point[2] * scale);
    });

    // Horn with stripes.
    g.fillStyle(0xffe66d);
    g.fillTriangle(x + (66 * scale), y + (8 * scale), x + (73 * scale), y - (22 * scale), x + (82 * scale), y + (12 * scale));
    g.lineStyle(2.5 * scale, 0xf5a53a, 0.9);
    g.lineBetween(x + 69 * scale, y - 5 * scale, x + 77 * scale, y - 2 * scale);
    g.lineBetween(x + 66 * scale, y + 7 * scale, x + 80 * scale, y + 7 * scale);

    // Ear and inner ear.
    g.fillStyle(0xfaf6ed);
    g.fillTriangle(x + 56 * scale, y + 17 * scale, x + 47 * scale, y - 8 * scale, x + 70 * scale, y + 10 * scale);
    g.fillStyle(0xff8eb0);
    g.fillTriangle(x + 58 * scale, y + 13 * scale, x + 52 * scale, y + 1 * scale, x + 67 * scale, y + 10 * scale);

    // Eye, nostril, smile and sparkle cheek.
    g.fillStyle(0x18212e);
    g.fillEllipse(x + 72 * scale, y + 26 * scale, 6.5 * scale, 8.5 * scale);
    g.fillStyle(0xffffff);
    g.fillCircle(x + 74.4 * scale, y + 23.5 * scale, 1.7 * scale);
    g.fillStyle(0x9e6a54);
    g.fillCircle(x + 81 * scale, y + 33 * scale, 1.7 * scale);
    g.lineStyle(2 * scale, 0xc28e42, 0.85);
    g.beginPath();
    g.arc(x + 70 * scale, y + 36 * scale, 9 * scale, 0.15, Math.PI * 0.72);
    g.strokePath();
    var cx = x + 56 * scale;
    var cy = y + 39 * scale;
    g.fillStyle(0xff4f9a);
    g.fillPoints([
      [cx, cy - 7 * scale], [cx + 5 * scale, cy], [cx + 14 * scale, cy],
      [cx + 7 * scale, cy + 5 * scale], [cx + 10 * scale, cy + 14 * scale],
      [cx, cy + 8 * scale], [cx - 10 * scale, cy + 14 * scale],
      [cx - 7 * scale, cy + 5 * scale], [cx - 14 * scale, cy],
      [cx - 5 * scale, cy]
    ], true);
  },

  drawBuddy: function (g, bodyColor, scale) {
    g.fillStyle(0x000000, 0.18);
    g.fillEllipse(25 * scale, 47 * scale, 30 * scale, 5 * scale);
    g.fillStyle(bodyColor);
    // Body, neck/head silhouette.
    g.fillEllipse(24 * scale, 32 * scale, 34 * scale, 24 * scale);
    g.fillEllipse(34 * scale, 16 * scale, 22 * scale, 19 * scale);
    // Ear.
    g.fillTriangle(35 * scale, 7 * scale, 30 * scale, 7 * scale, 42 * scale, -2 * scale);
    // Horn (single antenna, candy stripe).
    g.fillStyle(0xffffff);
    g.fillTriangle(37 * scale, 3 * scale, 35 * scale, 3 * scale, 40 * scale, -11 * scale);
    g.fillStyle(0xffd84d);
    g.fillTriangle(39 * scale, -7 * scale, 38 * scale, -3 * scale, 42 * scale, -8 * scale);
    // Eye and mouth.
    g.fillStyle(0xffffff);
    g.fillCircle(36 * scale, 15 * scale, 3 * scale);
    g.fillStyle(0x18212e);
    g.fillCircle(37 * scale, 15 * scale, 1.7 * scale);
    g.lineStyle(1.8 * scale, 0x18212e, 0.9);
    g.beginPath();
    g.arc(30 * scale, 22 * scale, 6 * scale, 0.1, Math.PI * 0.75);
    g.strokePath();
    // Wing / fin shapes.
    g.fillStyle(0xffffff, 0.35);
    g.fillEllipse(14 * scale, 29 * scale, 10 * scale, 15 * scale);
    g.fillEllipse(11 * scale, 30 * scale, 6 * scale, 9 * scale);
    // Feet.
    g.fillStyle(0x223047);
    g.fillRect(14 * scale, 40 * scale, 8 * scale, 4 * scale);
    g.fillRect(33 * scale, 40 * scale, 8 * scale, 4 * scale);
  }
};

/** Simple, cute chibi characters drawn with shapes only. No files, no loaders. */
TextureFactory.ensureCreatures = function (scene) {
  if (!scene.textures.exists('charlie')) {
    var g = scene.add.graphics();

    // Rainbow mane and tail streaming behind.
    [[12, 42, 13, 0xff6fae], [10, 57, 12, 0xffb03a], [16, 71, 11, 0x2fd3c6], [24, 83, 10, 0xb36cff]].forEach(function (m) {
      g.fillStyle(m[3]); g.fillCircle(m[0], m[1], m[2]);
    });

    // Tiny body, stubby legs, little hooves.
    g.fillStyle(0xfffaf0);
    g.fillEllipse(40, 78, 40, 30);
    [27, 39, 51].forEach(function (x) { g.fillRoundedRect(x, 88, 9, 14, 4); });
    g.fillStyle(0x3b3a52);
    [27, 39, 51].forEach(function (x) { g.fillRoundedRect(x, 97, 9, 6, 2); });

    // Big round head and soft snout.
    g.fillStyle(0xfffaf0);
    g.fillCircle(58, 48, 30);
    g.fillEllipse(79, 60, 26, 20);

    // Ears.
    g.fillStyle(0xfffaf0);
    g.fillTriangle(37, 29, 33, 9, 55, 25);
    g.fillStyle(0xffa8c6);
    g.fillTriangle(40, 26, 37, 15, 51, 24);

    // Candy-striped horn.
    g.fillStyle(0xffd84d);
    g.fillTriangle(50, 25, 60, 2, 70, 27);
    g.lineStyle(2, 0xff6fae);
    g.lineBetween(54, 13, 66, 10);
    g.lineBetween(52, 21, 68, 18);

    // Fringe over the forehead.
    g.fillStyle(0xff6fae); g.fillCircle(44, 27, 11);
    g.fillStyle(0x2fd3c6); g.fillCircle(35, 36, 10);
    g.fillStyle(0xffb03a); g.fillCircle(30, 46, 8);

    // One big sparkly eye, blush, nostril and smile.
    g.fillStyle(0x2b2b40); g.fillEllipse(70, 46, 9, 12);
    g.fillStyle(0xffffff); g.fillCircle(72, 41, 3.5);
    g.fillStyle(0xffa8c6); g.fillCircle(80, 60, 5);
    g.fillStyle(0xbd8f8f); g.fillCircle(87, 57, 2);
    g.lineStyle(2, 0xbd8f8f);
    g.beginPath(); g.arc(79, 62, 7, 0.2, Math.PI * 0.8); g.strokePath();

    g.generateTexture('charlie', 110, 110);
    g.destroy();
  }

  [['buddyBlue', 0x3ec8ff], ['buddyPink', 0xff7ac6]].forEach(function (pair) {
    if (scene.textures.exists(pair[0])) return;
    var g = scene.add.graphics();
    g.fillStyle(pair[1]);
    g.fillCircle(30, 32, 24);
    g.fillCircle(30, 50, 18);
    g.fillStyle(0xffd84d);
    g.fillTriangle(25, 15, 31, 2, 37, 15);
    g.fillStyle(0xffffff);
    g.fillCircle(22, 30, 8); g.fillCircle(38, 30, 8);
    g.fillStyle(0x2b2b40);
    g.fillCircle(23, 30, 4); g.fillCircle(39, 30, 4);
    g.lineStyle(2, 0x2b2b40);
    g.beginPath(); g.arc(30, 42, 8, 0.2, Math.PI - 0.2); g.strokePath();
    g.fillStyle(0x2b2b40);
    g.fillRoundedRect(16, 56, 10, 6, 3); g.fillRoundedRect(34, 56, 10, 6, 3);
    g.generateTexture(pair[0], 60, 64);
    g.destroy();
  });
};

if (typeof window !== 'undefined') window.TextureFactory = TextureFactory;
if (typeof globalThis !== 'undefined') globalThis.TextureFactory = TextureFactory;
