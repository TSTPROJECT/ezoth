/*
 * Ezoth — main.
 * Renders the profile, gallery and archive from js/data.js for the active
 * character variant, and drives the opening, transitions, parallax, lightbox,
 * navigation and the little easter egg.
 */
(function () {
  "use strict";

  var D = window.EZOTH;
  var C = D.character;
  var S = window.EzothSound;
  var FX = window.EzothFX;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  };
  var heartSVG = '<svg aria-hidden="true"><use href="#i-heart"/></svg>';

  // ---------------------------------------------------------------
  // Variants
  // ---------------------------------------------------------------
  var variants = D.variants;
  var byId = {};
  variants.forEach(function (v) { byId[v.id] = v; });

  function readVariantFromUrl() {
    try {
      var id = new URLSearchParams(location.search).get("v");
      if (id && byId[id]) return id;
    } catch (e) {}
    return D.defaultVariant;
  }
  var current = byId[readVariantFromUrl()] || variants[0];
  var themeKeys = [];

  function pictureHTML(item, sizes, cls, extra) {
    var srcset = item.srcSmall ? item.srcSmall + " 640w, " + item.src + " " + item.width + "w" : item.src;
    return '<picture><source type="image/webp" srcset="' + esc(srcset) + '" sizes="' + esc(sizes) + '">' +
      '<img src="' + esc(item.fallback || item.src) + '" width="' + item.width + '" height="' + item.height +
      '" alt="' + esc(item.alt) + '" loading="lazy" decoding="async"' + (cls ? ' class="' + cls + '"' : "") + (extra || "") + "></picture>";
  }

  function applyVariant(v, opts) {
    current = v;
    // theme overrides
    themeKeys.forEach(function (k) { document.documentElement.style.removeProperty(k); });
    themeKeys = Object.keys(v.theme || {});
    themeKeys.forEach(function (k) { document.documentElement.style.setProperty(k, v.theme[k]); });

    // hero
    var hero = v.hero;
    $("#hero-src").srcset = (hero.srcSmall ? hero.srcSmall + " 640w, " : "") + hero.src + " " + hero.width + "w";
    var hImg = $("#hero-img");
    hImg.src = hero.fallback || hero.src; hImg.width = hero.width; hImg.height = hero.height; hImg.alt = hero.alt;

    // profile art
    var art = findArt(v, v.profileArt) || v.gallery[0];
    var pImg = $("#profile-img");
    pImg.src = art.srcSmall || art.src; pImg.width = art.width; pImg.height = art.height;
    pImg.alt = art.alt;
    $("#tilt").dataset.open = art.id;

    $("#variant-name").innerHTML = esc(v.label) + ' <span class="muted">— ' + esc(v.note || "") + "</span>";

    renderTags(); renderGallery(); renderArchive(); renderVariantTabs();

    if (opts && opts.push) {
      try {
        var url = new URL(location.href);
        if (v.id === D.defaultVariant) url.searchParams.delete("v"); else url.searchParams.set("v", v.id);
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (e) {}
    }
  }

  function findArt(v, id) {
    for (var i = 0; i < v.gallery.length; i++) if (v.gallery[i].id === id) return v.gallery[i];
    return null;
  }

  function renderVariantTabs() {
    var bar = $("#variant-bar");
    if (variants.length < 2) { bar.hidden = true; return; }
    bar.hidden = false;
    $("#variant-tabs").innerHTML = variants.map(function (v) {
      return '<button type="button" role="tab" data-variant="' + esc(v.id) + '" aria-selected="' + (v === current) + '">' + esc(v.label) + "</button>";
    }).join("");
  }
  $("#variant-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-variant]");
    if (!b || b.dataset.variant === current.id) return;
    S.play("click");
    pageTransition(function () { applyVariant(byId[b.dataset.variant], { push: true }); });
  });

  // ---------------------------------------------------------------
  // Profile: description language toggle + identity tags + tilt card
  // ---------------------------------------------------------------
  var lang = "en";
  function renderIntro(animate) {
    var box = $("#intro-text");
    var paras = lang === "th" ? C.descriptionTh : C.descriptionEn;
    box.setAttribute("lang", lang);
    box.innerHTML = paras.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    if (animate) { box.classList.remove("is-swapping"); void box.offsetWidth; box.classList.add("is-swapping"); }
  }
  $$(".lang-toggle button").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      $$(".lang-toggle button").forEach(function (x) {
        var on = x.dataset.lang === lang;
        x.classList.toggle("is-on", on); x.setAttribute("aria-pressed", on);
      });
      S.play("flip");
      renderIntro(true);
    });
  });

  function renderTags() {
    var tags = C.tags.concat((current.profile && current.profile.tags) || []);
    $("#tags").innerHTML = tags.map(function (t) {
      return '<li><button type="button" class="tag" aria-pressed="false" aria-label="' + esc(t.en) + ' — flip to see the creator\'s original words">' +
        '<span class="tag__in"><span class="tag__front">' + heartSVG + esc(t.en) + '</span>' +
        '<span class="tag__back" lang="th">' + esc(t.th) + "</span></span></button></li>";
    }).join("");
  }
  $("#tags").addEventListener("click", function (e) {
    var t = e.target.closest(".tag");
    if (!t) return;
    var on = !t.classList.contains("is-flipped");
    t.classList.toggle("is-flipped", on);
    t.setAttribute("aria-pressed", on);
    S.play("flip");
  });

  // 3D tilt card
  var tiltEl = $("#tilt");
  tiltEl.addEventListener("pointermove", function (e) {
    if (reduce.matches || e.pointerType !== "mouse") return;
    var r = tiltEl.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    tiltEl.classList.add("is-tilting");
    tiltEl.style.setProperty("--ry", ((x - .5) * 16).toFixed(2) + "deg");
    tiltEl.style.setProperty("--rx", ((.5 - y) * 14).toFixed(2) + "deg");
    tiltEl.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    tiltEl.style.setProperty("--my", (y * 100).toFixed(1) + "%");
  });
  tiltEl.addEventListener("pointerleave", function () {
    tiltEl.classList.remove("is-tilting");
    tiltEl.style.setProperty("--rx", "0deg"); tiltEl.style.setProperty("--ry", "0deg");
  });
  tiltEl.setAttribute("role", "button");
  tiltEl.setAttribute("tabindex", "0");
  tiltEl.setAttribute("aria-label", "Open the card artwork larger");
  function openFromTilt() { openLightboxById(tiltEl.dataset.open, tiltEl); }
  tiltEl.addEventListener("click", openFromTilt);
  tiltEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openFromTilt(); } });

  // ---------------------------------------------------------------
  // Gallery
  // ---------------------------------------------------------------
  var galleryFilter = "all";
  var galleryList = [];

  function allGallery() {
    var out = [];
    variants.forEach(function (v) { v.gallery.forEach(function (g) { out.push({ item: g, variant: v }); }); });
    return out;
  }

  function renderGallery() {
    var filters = $("#gallery-filters");
    if (variants.length > 1) {
      filters.hidden = false;
      filters.innerHTML = ['<button type="button" data-filter="all" aria-pressed="' + (galleryFilter === "all") + '">All</button>']
        .concat(variants.map(function (v) {
          return '<button type="button" data-filter="' + esc(v.id) + '" aria-pressed="' + (galleryFilter === v.id) + '">' + esc(v.label) + "</button>";
        })).join("");
    } else filters.hidden = true;

    galleryList = allGallery().filter(function (e) { return galleryFilter === "all" || e.variant.id === galleryFilter; });
    $("#gallery-grid").innerHTML = galleryList.map(function (e, i) {
      var n = ("0" + (i + 1)).slice(-2);
      return '<li class="reveal"><button type="button" class="g-item" data-index="' + i + '" aria-label="Open artwork ' + n + ": " + esc(e.item.title) + '">' +
        '<span class="tape tape--top" aria-hidden="true"></span>' +
        '<span class="g-item__img">' + pictureHTML(e.item, "(max-width: 700px) 92vw, 500px") + "</span>" +
        '<span class="g-item__cap"><span class="g-item__title">' + esc(e.item.title) + '</span><span class="g-item__no">No. ' + n + "</span></span>" +
        '<svg class="g-item__heart" aria-hidden="true"><use href="#i-heart"/></svg>' +
        '</button><p class="mono g-meta">' + esc(e.item.caption) + (variants.length > 1 ? " · " + esc(e.variant.label) : "") + "</p></li>";
    }).join("");
    observeReveals($("#gallery-grid"));
  }
  $("#gallery-filters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-filter]");
    if (!b) return;
    galleryFilter = b.dataset.filter; S.play("click"); renderGallery();
  });
  $("#gallery-grid").addEventListener("click", function (e) {
    var b = e.target.closest(".g-item");
    if (b) openLightbox(galleryList.map(function (x) { return x.item; }), +b.dataset.index, b);
  });

  // ---------------------------------------------------------------
  // Lightbox
  // ---------------------------------------------------------------
  var lb = $("#lightbox"), lbWrap = $("#lb-wrap");
  var lbItems = [], lbIndex = 0, lbReturn = null, lbBusy = false;

  function openLightboxById(id, from) {
    var items = current.gallery;
    var i = Math.max(0, items.findIndex(function (g) { return g.id === id; }));
    openLightbox(items, i, from);
  }

  function lbImg(item, cls) {
    var img = document.createElement("img");
    img.src = item.src; img.alt = item.alt; img.width = item.width; img.height = item.height;
    img.decoding = "async"; img.draggable = false;
    img.onerror = function () { if (item.fallback && img.src.indexOf(item.fallback) < 0) img.src = item.fallback; };
    if (cls) img.className = cls;
    return img;
  }

  function lbMeta() {
    var it = lbItems[lbIndex];
    $("#lb-count").textContent = ("0" + (lbIndex + 1)).slice(-2) + " / " + ("0" + lbItems.length).slice(-2);
    $("#lb-title").textContent = it.title;
    $("#lb-caption").textContent = it.caption || "";
    var single = lbItems.length < 2;
    $("#lb-prev").disabled = single; $("#lb-next").disabled = single;
  }

  function openLightbox(items, index, from) {
    lbItems = items; lbIndex = index; lbReturn = from || document.activeElement;
    lbWrap.innerHTML = "";
    lbWrap.appendChild(lbImg(items[index], "lb-in-open"));
    lbMeta();
    lb.hidden = false;
    document.body.classList.add("is-locked");
    S.play("gallery");
    $(".lb-btn--close", lb).focus();
  }

  function closeLightbox() {
    if (lb.hidden) return;
    lb.hidden = true;
    lbWrap.innerHTML = "";
    document.body.classList.remove("is-locked");
    S.play("close");
    if (lbReturn && lbReturn.focus) lbReturn.focus({ preventScroll: true });
  }

  function step(dir) {
    if (lbItems.length < 2 || lbBusy) return;
    lbBusy = true;
    var old = lbWrap.querySelector("img:last-child");
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    var nu = lbImg(lbItems[lbIndex], dir > 0 ? "lb-in-next" : "lb-in-prev");
    if (old) old.className = dir > 0 ? "lb-out-next" : "lb-out-prev";
    lbWrap.appendChild(nu);
    lbMeta();
    S.play("hover");
    setTimeout(function () { if (old && old.parentNode) old.remove(); lbBusy = false; }, reduce.matches ? 0 : 460);
  }

  lb.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeLightbox(); });
  $("#lb-prev").addEventListener("click", function () { step(-1); });
  $("#lb-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "Tab") { // focus trap
      var f = $$("button:not([disabled])", lb), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe
  var sx = 0, sy = 0, swiping = false;
  lbWrap.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; swiping = true; });
  lbWrap.addEventListener("pointerup", function (e) {
    if (!swiping) return; swiping = false;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
  });
  lbWrap.addEventListener("pointercancel", function () { swiping = false; });

  $("#hero-img").addEventListener("click", function () { openLightboxById("portrait", this); });

  // ---------------------------------------------------------------
  // Archive
  // ---------------------------------------------------------------
  function renderArchive() {
    var files = C.archive.concat(current.archive || []);
    $("#archive-files").innerHTML = files.map(function (f) {
      var id = "file-" + esc(f.id);
      return '<article class="file reveal" data-no="FILE ' + esc(f.no) + '">' +
        '<button type="button" class="file__head" aria-expanded="false" aria-controls="' + id + '">' +
        '<span class="seal" aria-hidden="true"><span class="seal__half seal__half--l">' + heartSVG + '</span><span class="seal__half seal__half--r">' + heartSVG + "</span></span>" +
        '<span class="file__titles"><span class="mono file__kicker">' + f.entries.length + (f.entries.length === 1 ? " entry" : " entries") + '</span>' +
        '<span class="file__label">' + esc(f.label) + '</span><span class="file__state">sealed — break it?</span></span>' +
        "</button>" +
        '<div class="file__body" id="' + id + '" role="region" aria-label="' + esc(f.label) + '"><div class="file__inner"><ol class="file__list">' +
        f.entries.map(function (en) {
          return "<li" + (en.quote ? ' class="is-quote"' : "") + '><p class="file__en">' + esc(en.en) + '</p><p class="file__src" lang="th">' + esc(en.source) + "</p></li>";
        }).join("") +
        "</ol></div></div></article>";
    }).join("");
    $$(".file__body").forEach(function (b) { b.inert = true; });
    observeReveals($("#archive-files"));
    syncArchiveAll();
  }

  function setFile(file, open) {
    file.classList.toggle("is-open", open);
    var head = $(".file__head", file);
    head.setAttribute("aria-expanded", open);
    $(".file__state", file).textContent = open ? "opened — handle gently" : "sealed — break it?";
    $(".file__body", file).inert = !open;
  }
  function syncArchiveAll() {
    var files = $$(".file"), allOpen = files.length && files.every(function (f) { return f.classList.contains("is-open"); });
    $("#archive-all").textContent = allOpen ? "Reseal all" : "Break all seals";
  }
  $("#archive-files").addEventListener("click", function (e) {
    var head = e.target.closest(".file__head");
    if (!head) return;
    var file = head.parentNode, open = !file.classList.contains("is-open");
    setFile(file, open);
    S.play(open ? "archive" : "close");
    if (open) { var r = $(".seal", file).getBoundingClientRect(); FX.burst(r.left + r.width / 2, r.top + r.height / 2, 14, { speed: 2, hearts: true }); }
    syncArchiveAll();
  });
  $("#archive-all").addEventListener("click", function () {
    var files = $$(".file"), open = !files.every(function (f) { return f.classList.contains("is-open"); });
    files.forEach(function (f) { setFile(f, open); });
    S.play(open ? "archive" : "close");
    syncArchiveAll();
  });

  // ---------------------------------------------------------------
  // Pull quote (a line in Ezoth's own voice)
  // ---------------------------------------------------------------
  if (C.quote) {
    $("#quote-en").textContent = C.quote.en;
    $("#quote-th").textContent = C.quote.th;
    $("#quote-ctx").textContent = "— " + C.quote.context;
    $("#pull-quote").hidden = false;
  }

  // ---------------------------------------------------------------
  // Creator links from data
  // ---------------------------------------------------------------
  $("#creator-name").textContent = C.creator.name;
  $("#creator-link").href = C.creator.url;
  $("#foot-creator").href = C.creator.url;
  $("#foot-creator").textContent = C.creator.name;

  // ---------------------------------------------------------------
  // Scroll reveal
  // ---------------------------------------------------------------
  var revealIO = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { threshold: .12, rootMargin: "0px 0px -6% 0px" }) : null;
  function observeReveals(root) {
    $$(".reveal:not(.is-in)", root).forEach(function (el) {
      if (revealIO) revealIO.observe(el); else el.classList.add("is-in");
    });
  }

  // ---------------------------------------------------------------
  // Page transition (crimson curtain)
  // ---------------------------------------------------------------
  var curtain = $("#curtain"), curtainBusy = false;
  function pageTransition(mid) {
    if (reduce.matches || curtainBusy) { mid(); return; }
    curtainBusy = true;
    curtain.className = "curtain is-on is-cover";
    setTimeout(function () {
      mid();
      curtain.className = "curtain is-on is-reveal";
      setTimeout(function () { curtain.className = "curtain"; curtainBusy = false; }, 680);
    }, 520);
  }

  // ---------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------
  var head = $("#site-head"), burger = $("#burger"), menu = $("#mobile-menu");

  function setMenu(open) {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) { menu.hidden = false; menu.classList.add("is-open"); document.body.classList.add("is-locked"); $("a", menu).focus(); }
    else { menu.hidden = true; menu.classList.remove("is-open"); document.body.classList.remove("is-locked"); }
  }
  burger.addEventListener("click", function () { S.play("click"); setMenu(burger.getAttribute("aria-expanded") !== "true"); });

  function targetTop(el) { return el.id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - 8; }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-nav]");
    if (!a) return;
    var hash = a.getAttribute("href"), el = hash && $(hash);
    if (!el) return;
    e.preventDefault();
    var wasMenu = !menu.hidden;
    if (wasMenu) setMenu(false);
    var far = Math.abs(targetTop(el) - window.scrollY) > window.innerHeight * 1.4;
    var jump = function () {
      window.scrollTo({ top: targetTop(el), behavior: "instant" });
      try { history.replaceState(null, "", location.pathname + location.search + (hash === "#top" ? "" : hash)); } catch (err) {}
    };
    if (far || wasMenu) pageTransition(jump);
    else { window.scrollTo({ top: targetTop(el), behavior: reduce.matches ? "auto" : "smooth" }); }
    if (el.id !== "top") { var focusT = $("h2", el); if (focusT) { focusT.setAttribute("tabindex", "-1"); setTimeout(function () { focusT.focus({ preventScroll: true }); }, far ? 600 : 500); } }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (!lb.hidden) closeLightbox();
      else if (!menu.hidden) { setMenu(false); burger.focus(); }
    }
    if (!lb.hidden) {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    }
  });

  // active link + header state + back to top progress
  var navLinks = $$(".nav a");
  var sections = ["profile", "gallery", "archive", "creator"].map(function (id) { return $("#" + id); });
  var toTop = $("#to-top"), prog = $("#to-top-prog");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
      head.classList.toggle("is-scrolled", y > 30);
      toTop.classList.toggle("is-shown", y > window.innerHeight * .8);
      prog.style.strokeDashoffset = (1 - (max > 0 ? y / max : 0)).toFixed(3);
      var active = null;
      sections.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * .4) active = s.id; });
      navLinks.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + active); });
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------------------------------------------------------------
  // Hero mouse parallax
  // ---------------------------------------------------------------
  var hero = $(".hero"), layers = $$("[data-depth]", hero);
  var tx = 0, ty = 0, px = 0, py = 0, parRun = false, heroVisible = true;
  function parLoop() {
    px += (tx - px) * .08; py += (ty - py) * .08;
    layers.forEach(function (l) {
      var d = parseFloat(l.dataset.depth);
      l.style.setProperty("--px", (px * d * 26).toFixed(2) + "px");
      l.style.setProperty("--py", (py * d * 20).toFixed(2) + "px");
    });
    if (Math.abs(tx - px) > .001 || Math.abs(ty - py) > .001) requestAnimationFrame(parLoop); else parRun = false;
  }
  hero.addEventListener("pointermove", function (e) {
    if (reduce.matches || !fine.matches || !heroVisible) return;
    tx = e.clientX / window.innerWidth * 2 - 1;
    ty = e.clientY / window.innerHeight * 2 - 1;
    if (!parRun) { parRun = true; requestAnimationFrame(parLoop); }
  });
  hero.addEventListener("pointerleave", function () { tx = 0; ty = 0; if (!parRun) { parRun = true; requestAnimationFrame(parLoop); } });
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }).observe(hero);

  // ---------------------------------------------------------------
  // Sound controls
  // ---------------------------------------------------------------
  var btnMute = $("#btn-mute"), btnMusic = $("#btn-music");
  S.onChange(function (st) {
    btnMute.setAttribute("aria-pressed", st.muted);
    btnMute.title = st.muted ? "Sound is off — turn on" : "Mute all sound";
    btnMute.setAttribute("aria-label", st.muted ? "Unmute sound" : "Mute all sound");
    btnMusic.setAttribute("aria-pressed", st.music);
    btnMusic.title = st.music ? "Stop background music" : "Play background music";
  });
  btnMute.addEventListener("click", function () {
    S.unlock();
    S.toggleMute();
    if (!S.muted) S.play("click");
    toast(S.muted ? "sound off. how quiet of you." : "sound on ♥");
  });
  btnMusic.addEventListener("click", function () {
    S.toggleMusic();
    toast(S.music ? "♪ a little waltz, just for you" : "music off");
  });
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-sfx]");
    if (t) S.play(t.dataset.sfx);
  });

  var toastEl = $("#toast"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2200);
  }

  // ---------------------------------------------------------------
  // Easter egg — "the devil counts to six"
  // Press the little heart bubble six times, or type 666 / "mine".
  // ---------------------------------------------------------------
  var bubble = $("#bubble"), bubbleCount = 0, bubbleT, claimedBusy = false;
  var countEl = $(".bubble__count", bubble);
  bubble.addEventListener("click", function () {
    bubbleCount++;
    bubble.classList.remove("is-bump"); void bubble.offsetWidth; bubble.classList.add("is-bump");
    countEl.innerHTML = new Array(bubbleCount + 1).join("<i></i>");
    var r = bubble.getBoundingClientRect();
    FX.burst(r.left + r.width / 2, r.top + r.height / 2, 6, { hearts: true, speed: 1.6 });
    S.play("hover");
    clearTimeout(bubbleT);
    bubbleT = setTimeout(function () { bubbleCount = 0; countEl.innerHTML = ""; }, 2600);
    if (bubbleCount >= 6) { bubbleCount = 0; countEl.innerHTML = ""; claim(); }
  });

  var keyBuf = "";
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;
    if (e.target.closest && e.target.closest("input, textarea, [contenteditable]")) return;
    keyBuf = (keyBuf + e.key.toLowerCase()).slice(-6);
    if (/666$|mine$/.test(keyBuf)) { keyBuf = ""; claim(); }
  });

  function claim() {
    if (claimedBusy) return;
    claimedBusy = true;
    var box = $("#claimed");
    box.hidden = false; box.classList.remove("is-leaving");
    document.body.classList.add("is-claimed");
    S.play("claim");
    FX.rain(70);
    FX.burst(window.innerWidth / 2, window.innerHeight / 2, 40, { hearts: true, speed: 4 });
    try { sessionStorage.setItem("ezoth.claimed", "1"); } catch (e) {}
    setTimeout(function () {
      box.classList.add("is-leaving");
      setTimeout(function () {
        box.hidden = true; claimedBusy = false;
        toast(FX.cursorEnabled ? "claimed. your cursor grew little horns." : "claimed. ♥");
      }, 480);
    }, 2600);
  }
  try { if (sessionStorage.getItem("ezoth.claimed")) document.body.classList.add("is-claimed"); } catch (e) {}

  // ---------------------------------------------------------------
  // Loader + opening
  // ---------------------------------------------------------------
  var opening = $("#opening"), stage = $("#opening-stage"), loader = $("#loader");
  var fill = $("#load-fill"), pctEl = $("#load-pct");
  var openingDone = false;

  function preload() {
    var urls = [current.hero.src, (findArt(current, current.profileArt) || current.gallery[0]).srcSmall || current.gallery[0].src];
    var done = 0, total = urls.length + 1, shown = 0, target = 0;
    return new Promise(function (resolve) {
      function bump() { done++; target = done / total; }
      urls.forEach(function (u) {
        var im = new Image();
        im.onload = im.onerror = bump;
        im.src = u;
      });
      var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 2500); })]).then(bump);
      var start = performance.now();
      (function anim() {
        // ease the number toward the real progress, minimum ~0.9s so the heart can fill
        var minT = Math.min(1, (performance.now() - start) / 900);
        shown += (Math.min(target, minT) - shown) * .18;
        if (target >= 1 && minT >= 1 && shown > .995) shown = 1;
        pctEl.textContent = Math.round(shown * 100);
        fill.setAttribute("transform", "translate(0 " + (30 - shown * 30).toFixed(2) + ")");
        if (shown < 1) requestAnimationFrame(anim); else resolve();
      })();
      setTimeout(function () { target = 1; }, 8000); // never hang on a slow asset
    });
  }

  function typeWhisper() {
    var el = $("#whisper"), text = el.dataset.text, i = 0;
    if (reduce.matches) { el.textContent = text; return; }
    setTimeout(function t() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(t, i === 3 || i === 4 ? 260 : 70 + Math.random() * 60);
    }, 1700);
  }

  function showStage() {
    loader.classList.add("is-done");
    setTimeout(function () {
      loader.hidden = true;
      stage.hidden = false;
      opening.classList.add("is-playing");
      typeWhisper();
      setTimeout(function () { if (!openingDone) $("#enter-site").focus({ preventScroll: true }); }, reduce.matches ? 0 : 2500);
    }, reduce.matches ? 0 : 450);
  }

  function finishOpening(animated) {
    if (openingDone) return;
    openingDone = true;
    var reveal = function () {
      opening.hidden = true;
      opening.classList.remove("is-leaving");
      document.body.classList.remove("is-loading");
      hero.classList.add("is-ready");
      observeReveals(document);
      onScroll();
      if (location.hash && location.hash.length > 1) {
        var t = $(location.hash);
        if (t) window.scrollTo({ top: targetTop(t), behavior: "instant" });
      }
    };
    if (animated && !reduce.matches) pageTransition(reveal);
    else reveal();
  }

  $("#enter-site").addEventListener("click", function () {
    S.unlock();
    if ($("#enter-with-music").checked) S.startMusic();
    finishOpening(true);
  });
  $("#skip-intro").addEventListener("click", function () { finishOpening(false); });
  $("#replay-intro").addEventListener("click", function () {
    openingDone = false;
    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.classList.add("is-loading");
    opening.hidden = false;
    opening.classList.remove("is-playing");
    $("#whisper").textContent = "";
    void opening.offsetWidth;
    showStage();
  });

  // ---------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------
  renderIntro(false);
  applyVariant(current);
  preload().then(function () { if (!openingDone) showStage(); });
})();
