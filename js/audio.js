/*
 * Ezoth — sound.
 * Every sound is synthesised live with the Web Audio API (no audio files,
 * nothing licensed). The AudioContext is only created after a user gesture,
 * so nothing ever autoplays. Music is off until the visitor turns it on.
 */
(function () {
  "use strict";

  var STORE_KEY = "ezoth.sound";
  var ctx = null, master, sfxBus, musicBus, verb;
  var muted = false;
  var musicOn = false;
  var lastHover = 0;
  var listeners = [];

  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    muted = !!saved.muted;
  } catch (e) { /* storage unavailable: defaults are fine */ }

  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ muted: muted })); } catch (e) {}
  }

  function emit() { listeners.forEach(function (fn) { fn({ muted: muted, music: musicOn }); }); }

  // Create the graph lazily, inside a user gesture.
  function ensure() {
    if (ctx) {
      if (ctx.state === "suspended") ctx.resume();
      return true;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);

    sfxBus = ctx.createGain(); sfxBus.gain.value = .5; sfxBus.connect(master);
    musicBus = ctx.createGain(); musicBus.gain.value = 0; musicBus.connect(master);

    // Small generated hall for the music box and bells
    verb = ctx.createConvolver();
    var len = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = ir.getChannelData(c);
      for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    verb.buffer = ir;
    var verbOut = ctx.createGain(); verbOut.gain.value = .35;
    verb.connect(verbOut); verbOut.connect(master);
    return true;
  }

  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  // A single enveloped oscillator voice.
  function voice(opts) {
    var t = opts.t || ctx.currentTime;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = opts.type || "sine";
    o.frequency.setValueAtTime(opts.f, t);
    if (opts.f2) o.frequency.exponentialRampToValueAtTime(opts.f2, t + (opts.glide || opts.d));
    if (opts.detune) o.detune.value = opts.detune;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.v, t + (opts.a || .005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.d);
    o.connect(g);
    var out = g;
    if (opts.lp) {
      var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = opts.lp;
      g.connect(f); out = f;
    }
    out.connect(opts.bus || sfxBus);
    if (opts.wet) { var w = ctx.createGain(); w.gain.value = opts.wet; out.connect(w); w.connect(verb); }
    o.start(t); o.stop(t + opts.d + .05);
  }

  function noise(t, dur, freq, q, vol) {
    var len = Math.floor(ctx.sampleRate * dur), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var s = ctx.createBufferSource(); s.buffer = b;
    var f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    var g = ctx.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t);
  }

  // ---------- Sound effects ----------
  var sfx = {
    // tiny glassy tick
    hover: function () {
      var now = performance.now();
      if (now - lastHover < 70) return;
      lastHover = now;
      voice({ f: 1760 + Math.random() * 220, d: .09, v: .035, wet: .3 });
    },
    // heartbeat "lub-dub"
    click: function () {
      var t = ctx.currentTime;
      voice({ t: t, f: 92, f2: 48, d: .16, v: .55, lp: 400 });
      voice({ t: t + .13, f: 80, f2: 42, d: .14, v: .38, lp: 360 });
      voice({ t: t, f: 2400, d: .03, v: .02, type: "triangle" });
    },
    // rising music-box flourish (D minor)
    gallery: function () {
      var t = ctx.currentTime;
      [74, 77, 81, 86].forEach(function (n, i) {
        voice({ t: t + i * .07, f: hz(n), d: 1.1, v: .09, wet: .8 });
        voice({ t: t + i * .07, f: hz(n + 12), d: .5, v: .025, wet: .8 });
      });
    },
    // paper rustle + wax seal crack
    archive: function () {
      var t = ctx.currentTime;
      noise(t, .22, 2600, .7, .22);
      noise(t + .05, .16, 5200, 1.2, .1);
      voice({ t: t + .02, f: 180, f2: 70, d: .12, v: .3, lp: 900, type: "triangle" });
    },
    close: function () {
      var t = ctx.currentTime;
      voice({ t: t, f: hz(81), d: .5, v: .05, wet: .6 });
      voice({ t: t + .08, f: hz(74), d: .7, v: .05, wet: .6 });
    },
    flip: function () {
      noise(ctx.currentTime, .1, 3600, 1.4, .12);
    },
    // the easter egg: low minor chord + bells
    claim: function () {
      var t = ctx.currentTime;
      [38, 45, 50, 53].forEach(function (n) {
        voice({ t: t, f: hz(n), d: 2.6, v: .06, a: .25, type: "sawtooth", lp: 700, wet: .5, detune: (Math.random() - .5) * 14 });
      });
      [86, 89, 93, 98, 93].forEach(function (n, i) {
        voice({ t: t + .25 + i * .11, f: hz(n), d: 1.4, v: .06, wet: .9 });
      });
      sfx.click();
    }
  };

  // ---------- Background music: a slow music-box waltz in D minor ----------
  // i – VI – iv – V   (Dm – B♭ – Gm – A), 3/4 at ~66 bpm, endlessly varied.
  var CHORDS = [
    { bass: 38, tones: [62, 65, 69, 74, 77] },
    { bass: 34, tones: [58, 62, 65, 70, 74] },
    { bass: 31, tones: [55, 58, 62, 67, 70] },
    { bass: 33, tones: [57, 61, 64, 69, 73] }
  ];
  var MELODY = [ // bar-wise top-line options (MIDI), picked with some randomness
    [77, 76, 74], [74, null, 77], [81, 79, 77], [76, null, null],
    [74, 77, 82], [81, null, 77], [79, 77, 74], [73, 76, 81]
  ];
  var beat = 60 / 66, bar = 0, nextTime = 0, timer = null;

  function scheduleBar(t) {
    var ch = CHORDS[bar % 4];
    // soft bass on 1
    voice({ t: t, f: hz(ch.bass + 12), d: beat * 2.6, v: .07, a: .03, lp: 500, bus: musicBus });
    // pad
    ch.tones.slice(0, 3).forEach(function (n) {
      voice({ t: t, f: hz(n - 12), d: beat * 3.2, v: .018, a: .6, type: "triangle", lp: 900, bus: musicBus, detune: (Math.random() - .5) * 10 });
    });
    // music box arpeggio on 2 and 3 (+ eighths)
    var pattern = Math.random() < .5 ? [1, 2] : [1, 1.5, 2, 2.5];
    pattern.forEach(function (b) {
      var n = ch.tones[1 + Math.floor(Math.random() * 4)];
      voice({ t: t + b * beat, f: hz(n), d: 1.4, v: .03, bus: musicBus, wet: .7 });
    });
    // melody every other phrase
    if (Math.floor(bar / 4) % 2 === 1 || Math.random() < .25) {
      var line = MELODY[(bar + (Math.random() < .3 ? 4 : 0)) % MELODY.length];
      line.forEach(function (n, i) {
        if (n == null) return;
        voice({ t: t + i * beat, f: hz(n + 12), d: 1.8, v: .028, bus: musicBus, wet: .9 });
        voice({ t: t + i * beat, f: hz(n + 24), d: .5, v: .006, bus: musicBus, wet: .9 });
      });
    }
    // a faint heartbeat every 4th bar
    if (bar % 4 === 3) {
      voice({ t: t + beat * 2, f: 70, f2: 42, d: .18, v: .1, lp: 260, bus: musicBus });
      voice({ t: t + beat * 2 + .16, f: 62, f2: 40, d: .16, v: .07, lp: 240, bus: musicBus });
    }
    bar++;
  }

  function tick() {
    while (nextTime < ctx.currentTime + .4) {
      scheduleBar(nextTime);
      nextTime += beat * 3;
    }
  }

  function startMusic() {
    if (!ensure()) return;
    if (timer) return;
    musicOn = true;
    bar = 0;
    nextTime = ctx.currentTime + .1;
    musicBus.gain.cancelScheduledValues(ctx.currentTime);
    musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
    musicBus.gain.linearRampToValueAtTime(.9, ctx.currentTime + 2.5);
    tick();
    timer = setInterval(tick, 120);
    emit();
  }

  function stopMusic() {
    musicOn = false;
    if (ctx) {
      musicBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
      musicBus.gain.linearRampToValueAtTime(0, ctx.currentTime + .8);
    }
    clearInterval(timer); timer = null;
    emit();
  }

  // Keep the scheduler honest when the tab is hidden.
  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (musicOn || !muted) ctx.resume();
  });

  window.EzothSound = {
    play: function (name) {
      if (muted || !sfx[name]) return;
      if (!ensure()) return;
      try { sfx[name](); } catch (e) { /* never let sound break the page */ }
    },
    unlock: ensure,
    setMuted: function (m) {
      muted = !!m;
      if (ctx) {
        master.gain.cancelScheduledValues(ctx.currentTime);
        master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, .05);
      }
      persist(); emit();
    },
    toggleMute: function () { this.setMuted(!muted); },
    toggleMusic: function () {
      if (musicOn) { stopMusic(); return; }
      if (muted) this.setMuted(false);
      startMusic();
    },
    startMusic: function () { if (muted) this.setMuted(false); startMusic(); },
    get muted() { return muted; },
    get music() { return musicOn; },
    onChange: function (fn) { listeners.push(fn); fn({ muted: muted, music: musicOn }); }
  };
})();
