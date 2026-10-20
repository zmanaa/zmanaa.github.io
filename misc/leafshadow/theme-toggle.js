// Theme: saved choice, else the system preference. Runs in <head> so the page never flashes the wrong theme.
(function () {
  var root = document.documentElement;
  var KEY = 'theme';
  var query = window.matchMedia('(prefers-color-scheme: dark)');

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(theme) {
    try { localStorage.setItem(KEY, theme); } catch (e) { /* private mode: the choice just won't persist */ }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var button = document.querySelector('.theme-toggle');
    if (button) {
      var dark = theme === 'dark';
      button.setAttribute('aria-pressed', dark ? 'true' : 'false');
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      button.textContent = dark ? '☀' : '☾';
    }
  }

  apply(saved() || (query.matches ? 'dark' : 'light'));

  query.addEventListener('change', function (e) {
    if (!saved()) apply(e.matches ? 'dark' : 'light');
  });

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-toggle';
    document.body.appendChild(button);
    apply(root.getAttribute('data-theme'));

    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      save(next);
      apply(next);
    });
  });
})();
