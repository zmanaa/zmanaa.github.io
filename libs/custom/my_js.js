$(document).ready(function () {

  // Variables
  var $codeSnippets = $('.code-example-body'),
    $nav = $('.navbar'),
    $body = $('body'),
    $window = $(window),
    $popoverLink = $('[data-popover]'),
    navOffsetTop = $nav.offset().top,
    $document = $(document),
    entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
    setActiveNav();
    initTheme();
  }

  function initTheme() {
    var savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    $('#theme-toggle').on('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    var icon = $('#theme-toggle i');
    if (theme === 'dark') {
      icon.removeClass('fa-moon-o').addClass('fa-sun-o');
    } else {
      icon.removeClass('fa-sun-o').addClass('fa-moon-o');
    }
  }

  function setActiveNav() {
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Default to index.html if path is empty (root)
    if (page === "") page = "index.html";

    $('.navbar-link').removeClass('active');

    $('.navbar-link').each(function () {
      var href = $(this).attr('href');
      if (href.indexOf(page) !== -1 && page !== "index.html") {
        $(this).addClass('active');
      }
    });

    // Special handling for index page/anchors
    if (page === "index.html") {
      updateActiveNavOnScroll();
    }
  }

  function updateActiveNavOnScroll() {
    var scrollPos = $window.scrollTop();
    $('.navbar-link').each(function () {
      var currLink = $(this);
      var refElement = $(currLink.attr("href").split("#")[1] ? "#" + currLink.attr("href").split("#")[1] : "");
      if (refElement.length) {
        if (refElement.position().top - 100 <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
          $('.navbar-link').removeClass("active");
          currLink.addClass("active");
        }
      }
    });
  }

  function smoothScroll(e) {
    var target = this.hash;
    if (target && $(target).length) {
      e.preventDefault();
      $('html, body').stop().animate({
        'scrollTop': $(target).offset().top - 60
      }, 600, 'swing');
    }
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if ($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function () {
    $('html, body').animate({
      scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
  });

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if (navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if (navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }

    // Update active nav if on index page
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page === "index.html" || page === "") {
      updateActiveNavOnScroll();
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function () {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }


  init();

});

/* Gallery Modal Logic */
$(document).ready(function () {
  // Global variables for gallery
  let currentIndex = 0;
  let images = [];

  // Initialize images
  images = document.querySelectorAll('.gallery-image');

  // Functions
  function openModal(element) {
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    if (modal && modalImage) {
      modal.style.display = "block";
      modalImage.src = element.src;
      // Update reference in case DOM changed
      images = document.querySelectorAll('.gallery-image');
      currentIndex = Array.from(images).indexOf(element);
    }
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  function changeImage(n) {
    currentIndex += n;
    if (currentIndex >= images.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = images.length - 1;
    const modalImage = document.getElementById("modal-image");
    if (modalImage && images.length > 0) {
      modalImage.src = images[currentIndex].src;
    }
  }

  // Bind click events for gallery images
  // Using delegation for robustness
  $('body').on('click', '.gallery-image', function () {
    openModal(this);
  });

  // Close modal on click
  $('body').on('click', '#modal .close', function () {
    closeModal();
  });

  // Close modal when clicking outside content
  $('body').on('click', '#modal', function (e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Navigation buttons
  $('body').on('click', '.prev', function () { changeImage(-1); });
  $('body').on('click', '.next', function () { changeImage(1); });

  // Keyboard navigation
  $(window).keydown(function (event) {
    if (document.getElementById("modal") && document.getElementById("modal").style.display === "block") {
      if (event.key === "ArrowRight") {
        changeImage(1);
      } else if (event.key === "ArrowLeft") {
        changeImage(-1);
      } else if (event.key === "Escape") {
        closeModal();
      }
    }
  });
});