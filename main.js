/* ═══════════════════════════════════════════════════════════
   main.js — Router, fragments, animations, scroll spy
   ═══════════════════════════════════════════════════════════ */
var introFinished = false;

if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}

  function updateParallax() {
    var active = document.querySelector('.page-view.active');
    if (!active) return;
    active.querySelectorAll('.bg-dynamic-img').forEach(function(img) {
      var rect = img.closest('.bg-dynamic').getBoundingClientRect();
      var centerY = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = 'translateY(' + (centerY * 0.08) + 'px)';
    });
  }

/* ── Custom Cursor ───────────────────────────────────────────
   Black circle follows cursor with slight lag.
   mix-blend-mode:difference inverts colors beneath it.     
function initCursor() {
  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.body.appendChild(cursor);

  var mouseX = 0, mouseY = 0;
  var curX = 0, curY = 0;

  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseover', function(e) {
    if (e.target.matches('a, button, .proj-card, .exp-arrow, .exp-dot, .nav-tab, .sidebar-nav-item')) {
      cursor.classList.add('grow');
    }
  });
  document.addEventListener('mouseout', function(e) {
    if (e.target.matches('a, button, .proj-card, .exp-arrow, .exp-dot, .nav-tab, .sidebar-nav-item')) {
      cursor.classList.remove('grow');
    }
  });

  function loop() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = (curX - 10) + 'px';
    cursor.style.top = (curY - 10) + 'px';
    requestAnimationFrame(loop);
  }
  loop();
}
*/

/* ── Page Router ─────────────────────────────────────────────
   Slides between page-view divs without reloading.
   direction: 'forward' = slide left, 'back' = slide right.  */
var currentPage = 'about';
var pageHistory = ['about'];

function navigateTo(pageId, direction) {
  direction = direction || 'forward';
  var current = document.querySelector('.page-view.active');
  var next = document.getElementById('page-' + pageId);
  if (!next || current === next) return;

 currentPage = pageId;

  if (current) {
    current.style.transition = 'opacity .3s ease';
    void current.offsetWidth;
    current.style.opacity = '0';
    setTimeout(function() {
      current.classList.remove('active');
      current.style.opacity = '';
      current.style.transition = '';
      next.style.opacity = '0';
      next.classList.add('active');
      next.style.transition = 'opacity .3s ease';
      void next.offsetWidth;
      next.style.opacity = '1';
      setActiveNav();
      history.pushState({page: pageId}, '', '#' + pageId);
      window.scrollTo(0, 0);
      smoothTargetY = 0;
      smoothCurrentY = 0;
      next.querySelectorAll('.body-animate').forEach(function(el) {
        el.classList.add('revealed');
        el.style.transition = 'none';
        el.style.transform = 'none';
      });
    }, 300);
  } else {
    next.classList.add('active');
    setActiveNav();
    history.pushState({page: pageId}, '', '#' + pageId);
    window.scrollTo(0, 0);
    smoothTargetY = 0;
    smoothCurrentY = 0;
  }
}

function goBack() {
  pageHistory.pop();
  navigateTo('projects', 'back');
}

window.addEventListener('popstate', function(e) {
  if (e.state && e.state.page) {
    navigateTo(e.state.page, 'back');
  }
});

function readHash() {
  var hash = window.location.hash.replace('#', '') || 'about';
  var el = document.getElementById('page-' + hash);
  if (el) {
    document.querySelectorAll('.page-view').forEach(function(p) {
      p.classList.remove('active');
    });
    el.classList.add('active');
    currentPage = hash;
    setActiveNav();
  }
}

/* ── Index Nav ──────────────────────────────────────────────
   Marks correct tab and sidebar item based on currentPage.  */
function revealBodyAnimate() {
  if (!introFinished) return;
  var active = document.querySelector('.page-view.active');
  if (!active) return;
  active.querySelectorAll('.body-animate').forEach(function(el, i) {
    setTimeout(function() {
      el.classList.add('revealed');
    }, i * 150);
  });
}

function loadAbout() {
  fetch('pages/about.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      requestIdleCallback(function() {
        document.getElementById('page-about').innerHTML = html;
        initExpCarousel();
        initScrollSpy();
        revealBodyAnimate();
      });
    });
}

function loadPublications() {
  fetch('pages/publications.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      requestIdleCallback(function() {
        document.getElementById('page-publications').innerHTML = html;
      });
    });
}

function loadProjects() {
  fetch('pages/projects.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      requestIdleCallback(function() {
        document.getElementById('page-projects').innerHTML = html;
        revealBodyAnimate();
        document.querySelectorAll('.proj-card-hover-img').forEach(function(img) {
          img.decode();
        });
      });
    });
}

function loadProjectDetail(id) {
  fetch('pages/projects/projectpages/' + id + '-page.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      requestIdleCallback(function() {
        document.getElementById('page-' + id).innerHTML = html;
      });
    });
}

function loadProjectDetail(id) {
  fetch('pages/projects/projectpages/' + id + '-page.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      document.getElementById('page-' + id).innerHTML = html;
    });
}

/* ── Active Nav ──────────────────────────────────────────────
   Marks correct tab and sidebar item based on currentPage.  */
function setActiveNav() {
  var projectSlugs = ['rp1','pp1','ap1'];
  var onProjects = (currentPage === 'projects' || projectSlugs.indexOf(currentPage) !== -1);

  var tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(function(t) { t.classList.remove('active'); });
  var snavItems = document.querySelectorAll('.sidebar-nav-item');
  snavItems.forEach(function(s) { s.classList.remove('active'); });

  if (onProjects) {
    var np = document.getElementById('nav-projects');
    var sp = document.getElementById('snav-projects');
    if (np) np.classList.add('active');
    if (sp) sp.classList.add('active');
  } else {
    var na = document.getElementById('nav-about');
    var sa = document.getElementById('snav-about');
    var ch = document.getElementById('snav-about-children');
    if (na) na.classList.add('active');
    if (sa) sa.classList.add('active');
    if (ch) ch.classList.add('open');
  }
}


/* ── Scroll Spy ──────────────────────────────────────────────
   Highlights sidebar sub-link matching current section.     */
var sectionIds = [
  'sec-education','sec-experience','sec-methods',
  'sec-awards','sec-pubs','sec-teaching','sec-service'
];
var manualScrollUntil = 0;

function updateSubActive(id) {
  var subs = document.querySelectorAll('.sidebar-nav-sub');
  subs.forEach(function(s) {
    s.classList.remove('active');
    if (s.getAttribute('data-sec') === id) s.classList.add('active');
  });
}

function scrollAndHighlight(e, id) {
  e.preventDefault();
  var el = document.getElementById(id);
  if (!el) return;
  var stickyH = document.querySelector('.main-sticky').offsetHeight;
  var top = el.getBoundingClientRect().top + window.pageYOffset - stickyH - 8;
  window.scrollTo({top: top, behavior: 'smooth'});
  updateSubActive(id);
  manualScrollUntil = Date.now() + 1200;
  var wrapper = document.getElementById('wrap-' + id.replace('sec-', ''));
  if (wrapper) {
    setTimeout(function() {
      wrapper.classList.remove('sec-pop');
      void wrapper.offsetWidth;
      wrapper.classList.add('sec-pop');
    }, 500);
  }
}

function initScrollSpy() {
  if (!document.getElementById('sec-education')) return;
  window.addEventListener('scroll', function() {
    if (Date.now() < manualScrollUntil) return;
    var stickyH = document.querySelector('.main-sticky').offsetHeight;
    var scrollTop = window.pageYOffset + stickyH + 16;
    var current = sectionIds[0];
    for (var i = 0; i < sectionIds.length; i++) {
      var el = document.getElementById(sectionIds[i]);
      if (el && el.getBoundingClientRect().top + window.pageYOffset <= scrollTop) {
        current = sectionIds[i];
      }
    }
    updateSubActive(current);
  });
}


/* ── Intro Animation ─────────────────────────────────────────
   Runs on index.html first load or refresh only.            */
function runIntro() {
  var overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  if (performance.navigation.type !== 1 && sessionStorage.getItem('introDone')) {
    overlay.remove();
    document.getElementById('custom-scrollbar-thumb').classList.add('visible');
    document.querySelectorAll('#custom-scrollbar-arrow').forEach(function(a){ a.classList.add('visible'); });
    document.body.classList.remove('intro-active');
    document.querySelectorAll('.body-animate').forEach(function(el) {
      el.classList.add('revealed');
    });
    var cur = document.querySelector('.cursor');
    if (cur) cur.style.opacity = '1';
    return;
  }
  sessionStorage.setItem('introDone', 'true');

  setTimeout(function() { overlay.classList.add('name-visible'); }, 100);
  setTimeout(function() { overlay.classList.add('rise'); }, 1500);
setTimeout(function() {
    overlay.remove();
    document.getElementById('custom-scrollbar-thumb').classList.add('visible');
    document.querySelectorAll('#custom-scrollbar-arrow').forEach(function(a){ a.classList.add('visible'); });
    document.querySelector('.shell-intro').classList.add('revealed');
    setTimeout(function() {
      document.getElementById('sidebar-container').classList.add('revealed');
    }, 0);
    setTimeout(function() {
      document.getElementById('header-container').classList.add('revealed');
    }, 400);
    setTimeout(function() {
      document.body.classList.remove('intro-active');
      introFinished = true;
      revealBodyAnimate();
      document.querySelectorAll('.page-view:not(.active) .body-animate').forEach(function(el) {
        el.classList.add('revealed');
        el.style.transition = 'none';
        el.style.transform = 'none';
      });
    }, 550);
    setTimeout(function() {
      document.getElementById('main-columns').classList.add('revealed');
    }, 700);
  }, 2400);
}


/* ── Fragment Loaders ────────────────────────────────────────
   Fetches sidebar, header, footer from lockedelements/.     */
function loadSidebar() {
  fetch('lockedelements/sidebar.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      document.getElementById('sidebar-container').innerHTML = html;
      setActiveNav();
      initScrollSpy();
      initWipTooltips();
      if (!document.getElementById('intro-overlay')) {
        document.getElementById('sidebar-container').classList.add('revealed');
        document.querySelector('.shell').classList.add('revealed');
        var mc = document.getElementById('main-columns');
        if (mc) mc.classList.add('revealed');
      }
    });
}

function loadHeader() {
  fetch('lockedelements/header.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      document.getElementById('header-container').innerHTML = html;
      setActiveNav();
      if (!document.getElementById('intro-overlay')) {
        document.getElementById('header-container').classList.add('revealed');
      }      
    });
}

function loadFooter() {
  fetch('lockedelements/footer.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      document.getElementById('footer-container').innerHTML = html;
      document.querySelectorAll('#footer-container .body-animate').forEach(function(el) {
        el.classList.add('revealed');
      });
    });
}

/* ── Smooth Scroll ───────────────────────────────────────── */
var smoothTargetY = 0;
var smoothCurrentY = 0;

function initSmoothScroll() {
  var ease = 0.08;
  var running = false;

  window.addEventListener('wheel', function(e) {
    e.preventDefault();
    smoothTargetY += e.deltaY;
    smoothTargetY = Math.max(0, Math.min(smoothTargetY, document.body.scrollHeight - window.innerHeight));
    if (!running) {
      running = true;
      loop();
    }
  }, { passive: false });

  function loop() {
    smoothCurrentY += (smoothTargetY - smoothCurrentY) * ease;
    window.scrollTo(0, smoothCurrentY);
    if (Math.abs(smoothTargetY - smoothCurrentY) > 0.5) {
      requestAnimationFrame(loop);
    } else {
      smoothCurrentY = smoothTargetY;
      window.scrollTo(0, smoothCurrentY);
      running = false;
    }
  }
}

/* ── WIP Tooltip Cursor Follow ───────────────────────────── */
function initWipTooltips() {
  document.querySelectorAll('.wip-tooltip').forEach(function(el) {
    var tip = document.createElement('div');
    tip.className = 'wip-tip';
    tip.textContent = 'Work in Progress';
    document.body.appendChild(tip);

    el.addEventListener('mouseenter', function() {
      tip.style.opacity = '1';
    });
    el.addEventListener('mouseleave', function() {
      tip.style.opacity = '0';
    });
    el.addEventListener('mousemove', function(e) {
      tip.style.left = (e.clientX - 100) + 'px';
      tip.style.top = (e.clientY - 28) + 'px';
    });
  });
}

/* ── Experience Carousel ─────────────────────────────────── */
var expIndex = 0;

function initExpCarousel() {
  var cards = document.querySelectorAll('.exp-card');
  var dotsEl = document.getElementById('exp-dots');
  if (!dotsEl) return;

  cards.forEach(function(_, i) {
    var dot = document.createElement('div');
    dot.className = 'exp-dot' + (i === 0 ? ' active' : '');
    dot.onclick = function() { goToExpCard(i); };
    dotsEl.appendChild(dot);
  });
}

function slideExpCard(dir) {
  var cards = document.querySelectorAll('.exp-card');
  expIndex = Math.max(0, Math.min(expIndex + dir, cards.length - 1));
  updateExpCarousel();
}

function goToExpCard(i) {
  expIndex = i;
  updateExpCarousel();
}

function updateExpCarousel() {
  var track = document.getElementById('exp-track');
  if (!track) return;
  track.style.transform = 'translateX(-' + (expIndex * 100) + '%)';
  document.querySelectorAll('.exp-dot').forEach(function(d, i) {
    d.classList.toggle('active', i === expIndex);
  });
}


/* ── Init ────────────────────────────────────────────────────
   Single load listener.        initCursor();                               */
window.addEventListener('load', function() {
  var bar = document.createElement('div');
  bar.id = 'custom-scrollbar';

  var arrowUp = document.createElement('div');
  arrowUp.id = 'custom-scrollbar-arrow';
  arrowUp.innerHTML = '▲';
  bar.appendChild(arrowUp);

  var track = document.createElement('div');
  track.id = 'custom-scrollbar-track';
  bar.appendChild(track);

  var thumb = document.createElement('div');
  thumb.id = 'custom-scrollbar-thumb';
  track.appendChild(thumb);

  var arrowDown = document.createElement('div');
  arrowDown.id = 'custom-scrollbar-arrow';
  arrowDown.innerHTML = '▼';
  bar.appendChild(arrowDown);

  document.body.appendChild(bar);

  function updateThumb() {
    var trackH = track.offsetHeight;
    var scrollTop = window.pageYOffset;
    var docHeight = document.body.scrollHeight - window.innerHeight;
    var thumbHeight = Math.max(40, (window.innerHeight / document.body.scrollHeight) * trackH);
    var thumbTop = docHeight > 0 ? (scrollTop / docHeight) * (trackH - thumbHeight) : 0;
    thumb.style.height = thumbHeight + 'px';
    thumb.style.top = thumbTop + 'px';
  }
  window.addEventListener('scroll', updateThumb);
  window.addEventListener('resize', updateThumb);
  setTimeout(updateThumb, 2500);
  var scrollInterval;
  arrowUp.addEventListener('mousedown', function() {
    scrollInterval = setInterval(function() {
      smoothTargetY = Math.max(0, smoothTargetY - 40);
    }, 50);
  });
  arrowDown.addEventListener('mousedown', function() {
    scrollInterval = setInterval(function() {
      smoothTargetY = Math.min(document.body.scrollHeight - window.innerHeight, smoothTargetY + 40);
    }, 50);
  });
  document.addEventListener('mouseup', function() {
    clearInterval(scrollInterval);
  });

  setTimeout(function() { loadSidebar(); }, 200);
  loadHeader();
  setTimeout(function() { loadFooter(); }, 1200);
  loadProjects();
  loadAbout();
  loadPublications();
  loadProjectDetail('rp1');
  loadProjectDetail('pp1');
  loadProjectDetail('ap1');
  runIntro();
  readHash();
  initWipTooltips();
  initSmoothScroll();
  window.addEventListener('scroll', updateParallax, { passive: true });
});