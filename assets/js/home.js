// Homepage: time-aware greeting and click-to-expand phrases.
(function () {
  // Greeting: part of day comes from the visitor's clock, my availability from Eindhoven's.
  var greeting = document.getElementById('greeting');
  if (greeting) {
    var hour = new Date().getHours();
    var part = hour < 5 ? 'Good night' : hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    var here = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit', hour12: false
    }).format(new Date());
    var hereHour = parseInt(here.slice(0, 2), 10);
    var awake = hereHour >= 7 && hereHour < 23;

    greeting.textContent = part + '. It is ' + here + ' in Eindhoven, so I am ' +
      (awake ? 'probably awake.' : 'probably asleep.');
  }

  // Click-by-click phrases: each trigger reveals the element it controls. Closing one also closes everything nested inside it.
  function setOpen(word, open) {
    var note = document.getElementById(word.getAttribute('aria-controls'));
    if (!note) return;
    word.setAttribute('aria-expanded', open ? 'true' : 'false');
    note.hidden = !open;
    if (!open) {
      note.querySelectorAll('.expand-word').forEach(function (inner) { setOpen(inner, false); });
    }
  }

  function toggle(word) {
    setOpen(word, word.getAttribute('aria-expanded') !== 'true');
  }

  document.querySelectorAll('.expand-word').forEach(function (word) {
    word.addEventListener('click', function () { toggle(word); });
    word.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(word);
      }
    });
  });
})();
