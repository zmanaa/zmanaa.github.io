// Publications: enlarged figure next to the pointer while hovering a title, and copy-to-clipboard BibTeX.
(function () {
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (canHover) {
    var preview = document.createElement('div');
    preview.className = 'paper-preview';
    preview.setAttribute('aria-hidden', 'true');
    var image = document.createElement('img');
    image.alt = '';
    preview.appendChild(image);
    document.body.appendChild(preview);

    var GAP = 20;

    function place(e) {
      var w = preview.offsetWidth, h = preview.offsetHeight;
      var x = e.clientX + GAP, y = e.clientY + GAP;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - GAP;
      if (y + h > window.innerHeight - 8) y = window.innerHeight - h - 8;
      preview.style.transform = 'translate(' + Math.max(8, x) + 'px,' + Math.max(8, y) + 'px)';
    }

    document.querySelectorAll('.paper').forEach(function (paper) {
      var thumb = paper.querySelector('.figure img');
      var title = paper.querySelector('.title');
      if (!thumb || !title) return;

      title.addEventListener('pointerenter', function (e) {
        image.src = thumb.currentSrc || thumb.src;
        preview.dataset.visible = 'true';
        place(e);
      });
      title.addEventListener('pointermove', place);
      title.addEventListener('pointerleave', function () { preview.dataset.visible = 'false'; });
    });
  }

  document.querySelectorAll('a[data-bibtex]').forEach(function (button) {
    var label = button.textContent;
    var timer;
    var copyFailed = false;

    function flash(text) {
      button.textContent = text;
      clearTimeout(timer);
      timer = setTimeout(function () { button.textContent = label; }, 1600);
    }

    button.addEventListener('click', function (e) {
      // No clipboard access, or a previous copy failed: let the link open the .txt file as usual.
      if (!navigator.clipboard || copyFailed) return;
      e.preventDefault();
      fetch(button.dataset.bibtex)
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.text();
        })
        .then(function (text) { return navigator.clipboard.writeText(text.trim() + '\n'); })
        .then(function () { flash('Copied!'); })
        .catch(function () {
          copyFailed = true;
          flash('Click to open');
        });
    });
  });
})();
