$(document).ready(function() {

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
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
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
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }


  init();

});

/* Gallery Modal Logic */
$(document).ready(function() {
    // Global variables for gallery
    let currentIndex = 0;
    let images = []; 

    // Initialize images
    images = document.querySelectorAll('.gallery-image');

    // Functions
    function openModal(element) {
        const modal = document.getElementById("modal");
        const modalImage = document.getElementById("modal-image");
        if(modal && modalImage) {
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
    $('body').on('click', '.gallery-image', function() {
        openModal(this);
    });

    // Close modal on click
    $('body').on('click', '#modal .close', function() {
        closeModal();
    });
    
    // Close modal when clicking outside content
    $('body').on('click', '#modal', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Navigation buttons
    $('body').on('click', '.prev', function() { changeImage(-1); });
    $('body').on('click', '.next', function() { changeImage(1); });

    // Keyboard navigation
    $(window).keydown(function(event) {
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