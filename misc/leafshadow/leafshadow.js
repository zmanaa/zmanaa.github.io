// Foliage shadows behind the page: long diagonal bands of light and shade, blurred by CSS, with a fine film grain on top.
// A slow wind moves them: every band and every ragged edge sways on its own phase, so the shapes shift and breathe
// instead of sliding as one picture. The cursor adds a second, gentler motion on top: nearby bands are brushed aside
// and the whole picture shifts a little with it, both following the cursor with a long lag. The wind itself is
// unchanged by the cursor. The layout comes from a fixed seed, so it is the same on every load.
(function () {
  // base = open ground, streak = the bands that cross it
  var PRESETS = {
    light: { base: '#fafaf9', streak: '#e3e0de', alpha: 0.9 },
    dark: { base: '#0f1219', streak: '#435080', alpha: 0.8 }
  };
  var SCALE = 0.35;      // canvas resolution relative to the screen; the blur hides the loss
  var TILT = -1.05;      // radians: bands lean up and to the right

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Reduced motion keeps a slightly gentler wind (a little slower, a little less travel), but never frozen.
  var SPEED = reduced ? 0.8 : 1;
  var TRAVEL = reduced ? 0.85 : 1.2;

  var canvas = document.createElement('canvas');
  canvas.className = 'leaf-shadow';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext('2d');

  var grain = document.createElement('div');
  grain.className = 'leaf-grain';
  grain.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(grain, canvas.nextSibling);

  function seeded(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Film grain: a small noise tile, repeated, so it stays sharp while the shadows underneath are blurred.
  (function () {
    var n = document.createElement('canvas');
    n.width = n.height = 160;
    var c = n.getContext('2d');
    var img = c.createImageData(160, 160);
    var r = seeded(3);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = r() < 0.5 ? 0 : 255;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = Math.floor(r() * 26);
    }
    c.putImageData(img, 0, 0);
    grain.style.backgroundImage = 'url(' + n.toDataURL() + ')';
  })();

  var bands = [];
  var w = 0, h = 0, R = 0, diag = 0;

  // Cursor state. (tx, ty) is where the mouse is as a fraction of the viewport; (sx, sy) trails it slowly,
  // and presence eases to 1 while the mouse is over the page and back to 0 when it leaves.
  var tx = 0.5, ty = 0.5, sx = 0.5, sy = 0.5;
  var presence = 0, present = false;
  var FOLLOW_TAU = 0.9;  // seconds the smoothed cursor takes to close about two thirds of the gap to the real one
  var PUSH_TAU = 0.8;    // seconds each band takes to settle into its brushed position (this is what keeps it smooth)
  var PUSH = 1.1;        // how far a band is brushed aside, in band widths
  var PARALLAX = 0.035;  // how far the whole picture shifts with the cursor, as a fraction of canvas width

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    tx = e.clientX / window.innerWidth;
    ty = e.clientY / window.innerHeight;
    present = true;
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { present = false; });

  function layout() {
    var rand = seeded(23);
    w = Math.round(window.innerWidth * 1.2 * SCALE);
    h = Math.round(window.innerHeight * 1.2 * SCALE);
    canvas.width = w;
    canvas.height = h;
    diag = Math.sqrt(w * w + h * h);
    R = diag / 2;
    bands = [];

    // Lanes run across the rotated frame; each lane holds a few long, ragged bands.
    var lanes = 14;
    for (var lane = 0; lane < lanes; lane++) {
      var y = (lane / (lanes - 1) - 0.5) * 2 * R * 0.95 + (rand() - 0.5) * R * 0.05;
      var segments = 1 + Math.floor(rand() * 3);
      for (var s = 0; s < segments; s++) {
        var len = R * (0.3 + rand() * 0.5);
        var wid = diag * (0.022 + rand() * 0.03);
        var band = {
          cx: (rand() - 0.5) * R * 1.6, y: y, len: len, wid: wid,
          alpha: 0.45 + rand() * 0.55,
          phase: rand() * 6.28, speed: 0.22 + rand() * 0.3,
          px: 0, py: 0,
          bits: []
        };
        var bits = 4 + Math.floor(rand() * 4);
        for (var b = 0; b < bits; b++) {
          band.bits.push({
            ox: (rand() - 0.5) * len * 0.9, oy: (rand() - 0.5) * wid * 1.3,
            rx: len * (0.08 + rand() * 0.14), ry: wid * (0.25 + rand() * 0.3),
            rot: (rand() - 0.5) * 0.6,
            phase: rand() * 6.28, speed: 0.3 + rand() * 0.4
          });
        }
        bands.push(band);
      }
    }
  }

  var lastTime = 0;

  function draw(time) {
    var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var p = PRESETS[theme];
    var t = time / 1000 * SPEED;

    ctx.globalAlpha = 1;
    ctx.fillStyle = p.base;
    ctx.fillRect(0, 0, w, h);

    // a gust that swells and fades over about a minute
    var gust = 0.75 + 0.25 * Math.sin(t * 0.1);

    // ease the cursor state by elapsed time, so it is smooth at any frame rate
    var dt = Math.min(0.1, Math.max(0.001, (time - lastTime) / 1000));
    lastTime = time;
    var kFollow = 1 - Math.exp(-dt / FOLLOW_TAU);
    var kPush = 1 - Math.exp(-dt / PUSH_TAU);
    sx += (tx - sx) * kFollow;
    sy += (ty - sy) * kFollow;
    presence += ((present ? 1 : 0) - presence) * (1 - Math.exp(-dt / 0.6));

    var angle = TILT + 0.02 * Math.sin(t * 0.08) * TRAVEL;
    var ox = (sx - 0.5) * PARALLAX * w * presence;
    var oy = (sy - 0.5) * PARALLAX * w * presence;

    // the smoothed cursor, expressed in the rotated frame the bands live in
    // (the canvas covers 120% of the viewport, centred, so viewport fraction f maps to 0.5 + (f - 0.5) / 1.2)
    var fx0 = ((sx - 0.5) / 1.2) * w - ox, fy0 = ((sy - 0.5) / 1.2) * h - oy;
    var cosA = Math.cos(angle), sinA = Math.sin(angle);
    var fx = fx0 * cosA + fy0 * sinA, fy = -fx0 * sinA + fy0 * cosA;
    var reach = diag * 0.2;

    // Where a point at (x, y) in the frame wants to be pushed, away from the cursor. The softening term keeps the
    // direction from flipping abruptly as the cursor crosses a band.
    var soft = reach * 0.35;
    function brush(x, y, size) {
      var dx = x - fx, dy = y - fy;
      var d2 = dx * dx + dy * dy;
      var d = Math.sqrt(d2 + soft * soft);
      var k = Math.exp(-d2 / (reach * reach)) * presence * PUSH * TRAVEL * size;
      return { x: dx / d * k * 0.5, y: dy / d * k };
    }

    ctx.save();
    ctx.translate(w / 2 + ox, h / 2 + oy);
    ctx.rotate(angle);
    ctx.fillStyle = p.streak;

    for (var i = 0; i < bands.length; i++) {
      var bd = bands[i];
      var sway = Math.sin(t * bd.speed + bd.phase);
      var cx = bd.cx + bd.len * 0.05 * Math.sin(t * bd.speed * 0.7 + bd.phase * 1.3) * gust * TRAVEL;
      var cy = bd.y + bd.wid * 0.55 * sway * gust * TRAVEL;
      var thick = bd.wid * (1 + 0.18 * Math.sin(t * bd.speed * 1.3 + bd.phase));

      // a long band is brushed according to its nearest point to the cursor, not its centre
      var nearX = Math.max(cx - bd.len / 2, Math.min(cx + bd.len / 2, fx));
      var target = brush(nearX, cy, bd.wid);
      bd.px += (target.x - bd.px) * kPush;
      bd.py += (target.y - bd.py) * kPush;
      cx += bd.px;
      cy += bd.py;

      ctx.globalAlpha = p.alpha * bd.alpha * (0.88 + 0.12 * Math.sin(t * bd.speed * 0.9 + bd.phase * 2));
      ctx.beginPath();
      ctx.ellipse(cx, cy, bd.len / 2, thick / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      for (var j = 0; j < bd.bits.length; j++) {
        var bt = bd.bits[j];
        var flutter = Math.sin(t * bt.speed + bt.phase);
        ctx.beginPath();
        ctx.ellipse(
          cx + bt.ox + bt.rx * 0.25 * flutter * gust * TRAVEL,
          cy + bt.oy + bd.wid * 0.4 * Math.sin(t * bt.speed * 0.8 + bt.phase * 1.7) * gust * TRAVEL,
          bt.rx, bt.ry * (1 + 0.2 * flutter),
          bt.rot + 0.12 * flutter * TRAVEL, 0, Math.PI * 2
        );
        ctx.fill();
      }
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    draw(now);
    requestAnimationFrame(frame);
  }

  var timer;
  window.addEventListener('resize', function () {
    clearTimeout(timer);
    timer = setTimeout(layout, 200);
  });

  layout();
  draw(0);
  requestAnimationFrame(frame);
})();
