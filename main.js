/* ═══════════════════════════════════════════════════════════
   main.js — Router, fragments, animations, scroll spy
   ═══════════════════════════════════════════════════════════ */


/* ── Project Data ────────────────────────────────────────────
   Single source of truth for all project content.          */
var projects = {
  rp1:{
    title:'M.S. Thesis',
    meta:'Research Project · 2026–Present',
    tags:['Python','ML','NLP'],
    overview:'Investigating the recoil perturbations of orbiting spacecraft as a budgeted resource in multi-mission architecture sequences.',
    methods:'Description of methodological approach, tools, datasets, and analytical frameworks.',
    results:'Summary of key findings and contributions.',
    links:'<a href="#">↗ Live Demo</a> &nbsp;·&nbsp; <a href="#">⎇ GitHub</a>'
  },
  pp1:{
    title:'Letter Automation',
    meta:'Professional Project · 2026',
    tags:['Dataset','Annotation','CC-BY'],
    overview:'Letter creation tool for the US Department of State that uniformly produces letters for public correspondence.',
    methods:'Data collected from multiple sources using a structured protocol.',
    results:'Released publicly and used in several peer-reviewed studies.',
    links:'<a href="#">↗ Repository</a>'
  },
  pp2:{
    title:'Capacity/Demand Model',
    meta:'Professional Project · 2025',
    tags:['Collaboration','MATLAB'],
    overview:'Forecasting tool for the US Department of State that forecasts office capacity to complete current and projected demand.',
    methods:'Coordinated data collection across multiple sites. Analysis performed in MATLAB.',
    results:'Produced joint publications and established a continuing research consortium.',
    links:'<a href="#">↗ Project Website</a>'
  },
  pp3:{
    title:'Production Tracker',
    meta:'Professional Project · 2025',
    tags:['Excel','Power Platforms','Process Improvements'],
    overview:'Tracking tool for high-priority casework at the Los Angeles Passport Agency.',
    methods:'Developed in Excel, then automated using Microsoft Power suite and Auto Hotkeys.',
    results:'Enabled in-person service to over 500 applicants per day in the Southern California region.',
    links:'<a href="#">↗ Live Tool</a>'
  },
  cp1:{
    title:'Course Software',
    meta:'Course Project · DEPT 520 · 2021',
    tags:['Education','Python','Jupyter'],
    overview:'Open educational software developed for a graduate seminar, adopted by two other institutions.',
    methods:'Built as Jupyter notebooks with a Python backend, designed for modularity.',
    results:'Adopted by multiple universities and cited as an educational resource.',
    links:'<a href="#">↗ Course Page</a>'
  },
  cp2:{
    title:'Capstone Project',
    meta:'Course Project · DEPT XXX · 2020',
    tags:['R','Statistics','Visualization'],
    overview:'Final capstone project addressing a research problem using statistical methods. Received highest marks.',
    methods:'Applied statistical methods using R with ggplot2 visualizations.',
    results:'Highest grade in cohort. Presented at departmental seminar.',
    links:'<a href="#">↗ Report PDF</a>'
  },
  cp3:{
    title:'Seminar Paper',
    meta:'Course Project · DEPT XXX · 2019',
    tags:['LaTeX','Literature Review'],
    overview:'A seminar paper examining a research topic that has since been cited in subsequent works.',
    methods:'Systematic literature review synthesized thematically across multiple sources.',
    results:'Subsequently cited in peer-reviewed works. Formed foundation of later research.',
    links:'<a href="#">↗ Paper PDF</a>'
  }
};


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
  setActiveNav();

  if (current) current.classList.remove('active');
  next.classList.add('active');
  window.scrollTo(0, 0);
}


function openProject(id) {
  var p = projects[id];
  if (!p) return;

  document.getElementById('detail-title').textContent    = p.title;
  document.getElementById('detail-meta').textContent     = p.meta;
  document.getElementById('detail-overview').textContent = p.overview;
  document.getElementById('detail-methods').textContent  = p.methods;
  document.getElementById('detail-results').textContent  = p.results;
  document.getElementById('detail-links').innerHTML      = p.links;

  var tags = '';
  for (var i = 0; i < p.tags.length; i++) {
    tags += '<span class="ptag">' + p.tags[i] + '</span>';
  }
  document.getElementById('detail-tags').innerHTML = tags;

  pageHistory.push(id);
  /* Small delay ensures DOM is populated before animation  */
  requestAnimationFrame(function() {
    navigateTo('project-detail', 'forward');
  });
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


/* ── Active Nav ──────────────────────────────────────────────
   Marks correct tab and sidebar item based on currentPage.  */
function setActiveNav() {
  var onProjects = (currentPage === 'projects' || currentPage === 'project-detail');

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
    document.body.classList.remove('intro-active');
    document.querySelectorAll('.body-animate').forEach(function(el) {
      el.classList.add('revealed');
    });
    return;
  }
  sessionStorage.setItem('introDone', 'true');

  setTimeout(function() { overlay.classList.add('name-visible'); }, 100);
  setTimeout(function() { overlay.classList.add('rise'); }, 1800);
  setTimeout(function() {
    overlay.remove();
    document.querySelector('.shell-intro').classList.add('revealed');
    setTimeout(function() {
      document.getElementById('sidebar-container').classList.add('revealed');
      document.getElementById('main-columns').classList.add('revealed');
    }, 400);
    setTimeout(function() {
      document.querySelectorAll('.body-animate').forEach(function(el) {
        el.classList.add('revealed');
      });
      document.body.classList.remove('intro-active');
    }, 600);
  }, 3000);
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
    });
}

function loadFooter() {
  fetch('lockedelements/footer.html')
    .then(function(res) { return res.text(); })
    .then(function(html) {
      document.getElementById('footer-container').innerHTML = html;
      setTimeout(function() {
      document.getElementById('footer-container').classList.add('revealed');
      }, 500);
    });
}


/* ── Init ────────────────────────────────────────────────────
   Single load listener.                                     */
window.addEventListener('load', function() {
  setTimeout(function() { loadSidebar(); }, 200);
  loadHeader();
  setTimeout(function() { loadFooter(); }, 1200);
  runIntro();
  readHash();
});