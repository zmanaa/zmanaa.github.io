// Contextual cursor. The mode is chosen from the element under the pointer:
// arrow for interactive targets, bar for running text, dot otherwise.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var INTERACTIVE = 'a[href], button, summary, [role="button"], .expand-word, [data-cursor-arrow]';
  var FIGURE = 'img, canvas, .figure';
  var TEXT = 'p, h1, h2, h3, h4, li, blockquote, label';
  var NATIVE = 'iframe, input[type="text"], textarea, [data-cursor-native]';

  var el = document.createElement('div');
  el.className = 'site-cursor';
  el.setAttribute('aria-hidden', 'true');
  el.dataset.mode = 'dot';
  el.dataset.visible = 'false';
  el.innerHTML =
    '<div class="site-cursor__dot"></div>' +
    '<div class="site-cursor__cross"></div>' +
    '<svg class="site-cursor__arrow" viewBox="0 0 30 30" fill="none">' +
    '<path d="M6 4l19 8.5-8 2.2-2.4 8.3z" fill="#fff"/></svg>';
  document.body.appendChild(el);
  document.documentElement.classList.add('cursor-mode-dot');

  function modeFor(target) {
    if (target.closest(INTERACTIVE)) return 'arrow';
    if (target.closest(FIGURE)) return 'cross';
    if (target.closest(TEXT)) return 'text';
    return 'dot';
  }

  function hide() { el.dataset.visible = 'false'; }

  window.addEventListener('pointermove', function (e) {
    var t = e.target instanceof Element ? e.target : null;
    if (!t || t.closest(NATIVE)) return hide();
    el.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    el.dataset.visible = 'true';
    var mode = modeFor(t);
    if (el.dataset.mode !== mode) el.dataset.mode = mode;
  }, { passive: true });

  window.addEventListener('pointerdown', function () { el.dataset.pressed = 'true'; });
  window.addEventListener('pointerup', function () { el.dataset.pressed = 'false'; });
  document.documentElement.addEventListener('mouseleave', hide);
  window.addEventListener('blur', hide);
})();
