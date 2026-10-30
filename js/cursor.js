/*
 * Ezoth — signature cursor + particle layer.
 * - The heart cursor only runs on devices with a fine, hovering pointer.
 *   Touch devices keep their normal behaviour.
 * - The canvas particle layer is shared: the easter egg uses it on every device.
 * - One rAF loop, which sleeps when nothing is moving.
 * - prefers-reduced-motion: cursor follows directly, no trail, no bursts.
 */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  var canvas = document.getElementById("cursor-fx");
  var g = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  var parts = [];
  var MAX = 140;
  var COLORS = ["#c81d3a", "#e63e5f", "#e9b4bd", "#f7efec", "#491722"];

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  function heartPath(ctx, s) {
    // heart centred on 0,0 with size s
    ctx.beginPath();
    ctx.moveTo(0, s * .35);
    ctx.bezierCurveTo(-s * .9, -s * .2, -s * .45, -s * .85, 0, -s * .38);
    ctx.bezierCurveTo(s * .45, -s * .85, s * .9, -s * .2, 0, s * .35);
    ctx.closePath();
  }
  function sparkPath(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(0, 0, s, 0);
    ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.closePath();
  }

  function spawn(x, y, o) {
    if (parts.length >= MAX) parts.shift();
    parts.push({
      x: x, y: y,
      vx: o.vx, vy: o.vy,
      g: o.g == null ? .04 : o.g,
      life: 0, max: o.max || 50,
      size: o.size || 4,
      rot: Math.random() * 6.28, vr: (Math.random() - .5) * .2,
      kind: o.kind || "spark",
      color: o.color || COLORS[(Math.random() * COLORS.length) | 0]
    });
    wake();
  }

  // ---------- Cursor state ----------
  var el = document.getElementById("cursor");
  var label = el.querySelector(".cursor__label");
  var enabled = false;
  var mx = -100, my = -100, cx = -100, cy = -100, lastX = 0, lastY = 0, tilt = 0;
  var trailAcc = 0;
  var running = false;
  var hoverEl = null;

  var HOVER_SEL = "a, button, [role='button'], label, input, [data-cursor], .tag, .g-item, .tilt";

  function wake() { if (!running) { running = true; requestAnimationFrame(loop); } }

  function loop() {
    // cursor follow
    if (enabled) {
      var k = reduce.matches ? 1 : .32;
      cx += (mx - cx) * k; cy += (my - cy) * k;
      var vx = cx - lastX;
      tilt += ((Math.max(-25, Math.min(25, vx * 1.6))) - tilt) * .2;
      lastX = cx; lastY = cy;
      el.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      el.style.setProperty("--tilt", tilt.toFixed(1) + "deg");
    }

    // particles
    g.clearRect(0, 0, W, H);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.life++;
      if (p.life > p.max) { parts.splice(i, 1); continue; }
      p.vy += p.g; p.vx *= .985; p.vy *= .985;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      var t = p.life / p.max;
      g.save();
      g.globalAlpha = t < .15 ? t / .15 : 1 - (t - .15) / .85;
      g.translate(p.x, p.y);
      g.rotate(p.kind === "heart" ? p.vr * 2 : p.rot);
      g.fillStyle = p.color;
      var s = p.size * (p.kind === "spark" ? (1 - t * .6) : 1);
      if (p.kind === "heart") heartPath(g, s * 2); else sparkPath(g, s);
      g.fill();
      if (p.kind === "heart") { g.strokeStyle = "rgba(22,17,20,.35)"; g.lineWidth = .6; g.stroke(); }
      g.restore();
    }

    var moving = enabled && (Math.abs(mx - cx) > .1 || Math.abs(my - cy) > .1 || Math.abs(tilt) > .1);
    if (parts.length || moving) requestAnimationFrame(loop);
    else running = false;
  }

  function onMove(e) {
    if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    var dx = e.clientX - mx, dy = e.clientY - my;
    mx = e.clientX; my = e.clientY;
    if (cx < -50) { cx = mx; cy = my; }
    el.classList.remove("is-hidden");

    if (!reduce.matches) {
      trailAcc += Math.sqrt(dx * dx + dy * dy);
      while (trailAcc > 22) {
        trailAcc -= 22;
        var heart = Math.random() < .28;
        spawn(mx + (Math.random() - .5) * 8, my + (Math.random() - .5) * 8, {
          vx: (Math.random() - .5) * .8 - dx * .02,
          vy: (Math.random() - .5) * .8 - .3,
          g: heart ? -.012 : .02,
          size: heart ? 3 + Math.random() * 2 : 1.6 + Math.random() * 2.2,
          kind: heart ? "heart" : "spark",
          max: heart ? 55 : 32 + Math.random() * 18,
          color: heart ? (Math.random() < .6 ? "#e63e5f" : "#c81d3a") : undefined
        });
      }
    }
    wake();
  }

  function setHover(target) {
    var h = target && target.closest ? target.closest(HOVER_SEL) : null;
    el.classList.toggle("on-dark", !!(target && target.closest && target.closest(".archive, .site-foot, .lightbox, .mobile-menu")));
    if (h === hoverEl) return;
    hoverEl = h;
    var mode = h && h.getAttribute("data-cursor");
    if (!mode && h && (h.classList.contains("g-item") || h.classList.contains("tilt"))) mode = "view";
    el.classList.toggle("is-hover", !!h && mode !== "view");
    el.classList.toggle("is-view", mode === "view");
    label.textContent = mode === "view" ? "view" : "";
    if (h && window.EzothSound) window.EzothSound.play("hover");
  }

  function onOver(e) { if (enabled) setHover(e.target); }

  function burst(x, y, n, opts) {
    opts = opts || {};
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, sp = (opts.speed || 2.4) * (.4 + Math.random());
      var heart = opts.hearts ? Math.random() < .7 : Math.random() < .35;
      spawn(x, y, {
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (opts.lift || .6),
        g: heart ? .03 : .05,
        size: heart ? 3 + Math.random() * 3 : 1.6 + Math.random() * 2,
        kind: heart ? "heart" : "spark",
        max: 40 + Math.random() * 30
      });
    }
  }

  function onDown(e) {
    if (!enabled || (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen")) return;
    el.classList.add("is-down");
    if (!reduce.matches) burst(e.clientX, e.clientY, 12);
  }
  function onUp() { el.classList.remove("is-down"); }

  function enable() {
    if (enabled) return;
    enabled = true;
    document.documentElement.classList.add("has-cursor");
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
  }
  function disable() {
    if (!enabled) return;
    enabled = false;
    document.documentElement.classList.remove("has-cursor");
    document.removeEventListener("pointerover", onOver);
    document.removeEventListener("pointerdown", onDown);
    document.removeEventListener("pointerup", onUp);
  }
  function sync() { if (finePointer.matches) enable(); else disable(); }

  document.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", function () { el.classList.add("is-hidden"); });
  document.documentElement.addEventListener("mouseleave", function () { el.classList.add("is-hidden"); });
  window.addEventListener("blur", function () { el.classList.remove("is-down"); });
  if (finePointer.addEventListener) finePointer.addEventListener("change", sync);
  sync();

  window.EzothFX = {
    burst: function (x, y, n, opts) { if (!reduce.matches) burst(x, y, n, opts); },
    // hearts falling across the whole screen (easter egg)
    rain: function (count) {
      if (reduce.matches) return;
      var i = 0;
      (function drop() {
        for (var k = 0; k < 4 && i < count; k++, i++) {
          spawn(Math.random() * W, -20, {
            vx: (Math.random() - .5) * 1.2, vy: 1.5 + Math.random() * 2.5, g: .05,
            size: 3 + Math.random() * 5, kind: Math.random() < .8 ? "heart" : "spark", max: 120 + Math.random() * 60
          });
        }
        if (i < count) setTimeout(drop, 40);
      })();
    },
    get cursorEnabled() { return enabled; }
  };
})();
