/* =========================================================
   LIGTAS — script.js
   Vanilla JS + GSAP/ScrollTrigger + Chart.js + <model-viewer>
   ========================================================= */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const slowConnection = !!(conn && (conn.saveData || /(^|-)2g$/.test(conn.effectiveType || "")));

  if (reduceMotion) root.classList.add("reduced");

  const hasGSAP = typeof window.gsap !== "undefined";
  if (!hasGSAP) root.classList.add("no-gsap");
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------
     1. Intro (logo draw-in, total < 1.5 s)
     --------------------------------------------- */
  function runIntro() {
    const intro = document.getElementById("intro");
    if (!intro) return Promise.resolve();
    if (reduceMotion || !hasGSAP) {
      intro.remove();
      return Promise.resolve();
    }
    const shield = intro.querySelector(".intro-shield");
    const check = intro.querySelector(".intro-check");
    [shield, check].forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
    });
    return new Promise((resolve) => {
      gsap.timeline({ onComplete: () => { intro.remove(); resolve(); } })
        .to(shield, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" })
        .to(check, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, "-=0.1")
        .from(".intro-word", { y: 12, opacity: 0, duration: 0.3 }, "-=0.25")
        .to(intro, { opacity: 0, duration: 0.3, delay: 0.1 });
    });
  }

  /* ---------------------------------------------
     2. Split headings into words (for reveal)
     --------------------------------------------- */
  function splitWords(el) {
    if (!el) return [];
    const text = el.textContent.trim();
    el.innerHTML =
      `<span class="visually-hidden">${text}</span>` +
      text.split(/\s+/).map((w) => `<span class="word" aria-hidden="true"><span>${w}</span></span>`).join(" ");
    return el.querySelectorAll(".word > span");
  }

  /* ---------------------------------------------
     3. Header: solid on scroll + mobile menu
     --------------------------------------------- */
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");

  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) nav.querySelector("a").focus();
  }
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a") && !isDesktop()) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.addEventListener("resize", () => { if (isDesktop()) setMenu(false); });

  /* ---------------------------------------------
     4. Hero video: only on larger screens, fast
        connections and without reduced motion.
        Otherwise the poster image stays.
     --------------------------------------------- */
  const heroVideo = document.getElementById("heroVideo");
  const videoToggle = document.getElementById("videoToggle");

  function loadVideo(video) {
    const webm = video.dataset.srcWebm;
    const mp4 = video.dataset.srcMp4;
    if (webm) video.insertAdjacentHTML("beforeend", `<source src="${webm}" type="video/webm">`);
    if (mp4) video.insertAdjacentHTML("beforeend", `<source src="${mp4}" type="video/mp4">`);
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }

  if (heroVideo && !reduceMotion && !slowConnection && window.innerWidth >= 768) {
    loadVideo(heroVideo);
    videoToggle.hidden = false;
    videoToggle.addEventListener("click", () => {
      const paused = heroVideo.paused;
      paused ? heroVideo.play() : heroVideo.pause();
      videoToggle.setAttribute("aria-pressed", String(!paused));
      videoToggle.textContent = paused ? "Pause video" : "Play video";
    });
  }

  // Pledge explainer clip: load when visible, autoplay only without reduced motion
  const pledgeVideo = document.querySelector(".pledge-video");
  if (pledgeVideo) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduceMotion || slowConnection) {
          pledgeVideo.setAttribute("controls", "");
          pledgeVideo.insertAdjacentHTML("beforeend", `<source src="${pledgeVideo.dataset.srcMp4}" type="video/mp4">`);
          pledgeVideo.preload = "metadata";
          pledgeVideo.load();
        } else {
          loadVideo(pledgeVideo);
        }
      });
    }, { rootMargin: "200px" });
    io.observe(pledgeVideo);
  }

  /* ---------------------------------------------
     5. Flip cards (myths vs facts)
     --------------------------------------------- */
  document.querySelectorAll(".flip").forEach((card) => {
    card.addEventListener("click", () => {
      const flipped = card.getAttribute("aria-pressed") === "true";
      card.setAttribute("aria-pressed", String(!flipped));
      card.querySelector(".flip-front").setAttribute("aria-hidden", String(!flipped));
      card.querySelector(".flip-back").setAttribute("aria-hidden", String(flipped));
    });
  });

  /* ---------------------------------------------
     6. Laws accordion
     --------------------------------------------- */
  document.querySelectorAll(".law-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
      if (!open && hasGSAP && !reduceMotion) {
        gsap.fromTo(panel, { rotationX: -70, opacity: 0, transformPerspective: 800, transformOrigin: "50% 0%" }, { rotationX: 0, opacity: 1, duration: 0.5, ease: "back.out(1.4)" });
      }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------------------------------------------
     7. Charts (Chart.js), created on scroll
     --------------------------------------------- */
  const chartColors = { violet: "#9D84FF", teal: "#5FE0D3", coral: "#FF7B67", text: "#C9C0E6", grid: "rgba(255,255,255,.08)" };

  function makeBar(id, labels, data, colors, horizontal = false) {
    const el = document.getElementById(id);
    if (!el || typeof Chart === "undefined" || el.dataset.drawn) return;
    el.dataset.drawn = "1";
    new Chart(el, {
      type: "bar",
      data: { labels, datasets: [{ data, backgroundColor: colors, borderRadius: 8, maxBarThickness: 56 }] },
      options: {
        indexAxis: horizontal ? "y" : "x",
        responsive: true,
        maintainAspectRatio: false,
        animation: reduceMotion ? false : { duration: 800, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${c.parsed[horizontal ? "x" : "y"]}%` } },
        },
        scales: {
          x: horizontal
            ? { min: 0, max: 100, ticks: { color: chartColors.text, font: { family: "Atkinson Hyperlegible" }, callback: (v) => v + "%" }, grid: { color: chartColors.grid } }
            : { ticks: { color: chartColors.text, font: { family: "Atkinson Hyperlegible" } }, grid: { color: "transparent" } },
          y: horizontal
            ? { ticks: { color: chartColors.text, font: { family: "Atkinson Hyperlegible", weight: "bold" } }, grid: { color: "transparent" } }
            : { beginAtZero: true, max: 100, ticks: { color: chartColors.text, font: { family: "Atkinson Hyperlegible" }, callback: (v) => v + "%" }, grid: { color: chartColors.grid } },
        },
      },
    });
  }

  function drawCharts() {
    makeBar("chartTime", ["Daytime", "Night", "After midnight"], [70, 23, 1], [chartColors.coral, chartColors.violet, chartColors.teal]);
    makeBar("chartGender", ["Female", "Male", "LGBTQI"], [51, 32, 15], [chartColors.coral, chartColors.teal, chartColors.violet], true);
    makeBar("chartOnline", ["Frequently", "Very frequently"], [50, 33], [chartColors.violet, chartColors.coral]);
  }

  /* ---------------------------------------------
     8. Counters
     --------------------------------------------- */
  function runCounters() {
    document.querySelectorAll(".count").forEach((el) => {
      const target = Number(el.dataset.target);
      if (reduceMotion || !hasGSAP) { el.textContent = target; return; }
      const obj = { v: 0 };
      gsap.to(obj, { v: target, duration: 0.8, ease: "power1.out", onUpdate: () => (el.textContent = Math.round(obj.v)) });
    });
  }

  /* ---------------------------------------------
     9. Quiz: "Is this harassment?"
     --------------------------------------------- */
  const scenarios = [
    { q: "A group of guys whistles and shouts \"Hi sexy!\" as you walk past a sari-sari store.", a: "yes",
      why: "Wolf-whistling and catcalling are named in the Safe Spaces Act as gender-based street harassment." },
    { q: "A classmate asks if you'd like to join their study group for the exam.", a: "no",
      why: "A friendly, respectful invitation isn't harassment. It becomes a problem only if it's sexual, unwanted and persistent." },
    { q: "Someone you don't know keeps sending you sexual messages on Messenger even after you blocked their first account.", a: "yes",
      why: "Unwanted sexual messages and persistent contact online are gender-based online sexual harassment under the law." },
    { q: "A stranger on the jeepney keeps asking for your name, number and where you're getting off.", a: "yes",
      why: "Relentless requests for personal details are covered. You can tell the driver, who is expected to help." },
    { q: "A friend posts a funny group photo you agreed to be in.", a: "no",
      why: "You gave consent and nothing about it is sexual. Sharing intimate photos without consent, on the other hand, is illegal." },
    { q: "Someone calls a gay classmate a slur every time he walks by.", a: "yes",
      why: "Homophobic and transphobic slurs are explicitly listed as harassment in the Safe Spaces Act." },
  ];
  let qi = 0, score = 0;
  const qEl = document.getElementById("quizQ");
  const qProg = document.getElementById("quizProgress");
  const qFeed = document.getElementById("quizFeedback");
  const qNext = document.getElementById("quizNext");
  const qBtns = document.querySelectorAll(".quiz-answer");

  function renderQuiz() {
    if (qi >= scenarios.length) {
      qProg.textContent = "Done";
      qEl.textContent = `You got ${score} of ${scenarios.length} right.`;
      qFeed.innerHTML = `<p>Knowing what counts is the first step. If any of these happen to you, you can report them. The hotlines are just below.</p>`;
      qBtns.forEach((b) => (b.hidden = true));
      qNext.hidden = false;
      qNext.textContent = "Try again";
      return;
    }
    qProg.textContent = `Scenario ${qi + 1} of ${scenarios.length}`;
    qEl.textContent = scenarios[qi].q;
    qFeed.innerHTML = "";
    qBtns.forEach((b) => { b.hidden = false; b.disabled = false; });
    qNext.hidden = true;
  }

  qBtns.forEach((btn) => btn.addEventListener("click", () => {
    const s = scenarios[qi];
    const correct = btn.dataset.answer === s.a;
    if (correct) score++;
    qBtns.forEach((b) => (b.disabled = true));
    qFeed.innerHTML = `<p class="verdict ${correct ? "correct" : "wrong"}">${correct ? "Correct." : "Not quite."}</p><p>${s.why}</p>`;
    qNext.hidden = false;
    qNext.textContent = qi === scenarios.length - 1 ? "See my score" : "Next scenario";
    qNext.focus();
  }));

  qNext.addEventListener("click", () => {
    if (qi >= scenarios.length) { qi = 0; score = 0; }
    else qi++;
    renderQuiz();
    qEl.setAttribute("tabindex", "-1");
    qEl.focus();
  });
  renderQuiz();

  /* ---------------------------------------------
     10. Pledge form (saved in this browser)
     --------------------------------------------- */
  const KEY = "ligtas-pledges";
  const pForm = document.getElementById("pledgeForm");
  const pName = document.getElementById("pledgeName");
  const pErr = document.getElementById("pledgeError");
  const pCount = document.getElementById("pledgeCount");
  const pNoun = document.getElementById("pledgeNoun");
  const pList = document.getElementById("pledgeNames");

  function loadPledges() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function savePledges(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
  }
  function renderPledges(list, animate) {
    const n = list.length;
    pNoun.textContent = n === 1 ? "person has" : "people have";
    if (animate && hasGSAP && !reduceMotion) {
      const obj = { v: Number(pCount.textContent) || 0 };
      gsap.to(obj, { v: n, duration: 0.5, onUpdate: () => (pCount.textContent = Math.round(obj.v)) });
    } else {
      pCount.textContent = n;
    }
    pList.innerHTML = "";
    list.slice(-12).reverse().forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      pList.appendChild(li);
    });
  }
  let pledges = loadPledges();
  renderPledges(pledges, false);

  pForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = pName.value.trim().replace(/\s+/g, " ");
    if (!name) {
      pErr.style.color = "";
      pErr.textContent = "Enter a first name or nickname to add your pledge.";
      pName.setAttribute("aria-invalid", "true");
      pName.focus();
      return;
    }
    pErr.textContent = "";
    pName.removeAttribute("aria-invalid");
    pledges.push(name.slice(0, 30));
    savePledges(pledges);
    renderPledges(pledges, true);
    pForm.reset();
    pErr.textContent = `Thank you, ${name}. Your pledge was added.`;
    pErr.style.color = "var(--teal-ink)";
  });

  /* ---------------------------------------------
     11. 3D shield (<model-viewer>)
     --------------------------------------------- */
  const mv = document.getElementById("shieldModel");
  const shieldFallback = document.querySelector(".shield-fallback");

  function showShieldFallback() {
    if (mv) mv.remove();
    if (shieldFallback) shieldFallback.hidden = false;
  }

  if (reduceMotion) {
    showShieldFallback();
  } else if (mv) {
    mv.addEventListener("error", showShieldFallback);
    mv.addEventListener("load", () => {
      // The generated mesh is untextured, so give it the LIGTAS violet with a coral glow.
      try {
        mv.model.materials.forEach((m) => {
          m.pbrMetallicRoughness.setBaseColorFactor([0.43, 0.29, 0.88, 1]);
          m.pbrMetallicRoughness.setMetallicFactor(0.35);
          m.pbrMetallicRoughness.setRoughnessFactor(0.35);
          if (m.setEmissiveFactor) m.setEmissiveFactor([0.35, 0.12, 0.08]);
        });
      } catch (err) { /* keep default material */ }
    });
    // Pause auto-rotation while hovering so people can inspect it
    mv.addEventListener("pointerenter", () => mv.removeAttribute("auto-rotate"));
    mv.addEventListener("pointerleave", () => mv.setAttribute("auto-rotate", ""));
  }

  /* ---------------------------------------------
     11b. Hero 3D scene (Three.js): outlined low-poly
          shapes and extruded shields that float, follow
          the pointer and roll as you scroll.
     --------------------------------------------- */
  function initHero3D() {
    const canvas = document.getElementById("hero3d");
    if (!canvas || reduceMotion || typeof THREE === "undefined") return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) { return; } // no WebGL: the pattern background stays
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 15;
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(6, 8, 10);
    scene.add(key);

    // Shield outline as an extruded shape
    const sh = new THREE.Shape();
    sh.moveTo(0, 1.4);
    sh.lineTo(-1.15, 0.95);
    sh.lineTo(-1.15, 0.1);
    sh.quadraticCurveTo(-1.1, -1.0, 0, -1.55);
    sh.quadraticCurveTo(1.1, -1.0, 1.15, 0.1);
    sh.lineTo(1.15, 0.95);
    sh.closePath();
    const shieldGeo = new THREE.ExtrudeGeometry(sh, { depth: 0.45, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 1 });
    shieldGeo.center();

    const geos = [
      shieldGeo,
      new THREE.TorusGeometry(0.8, 0.3, 10, 24),
      new THREE.IcosahedronGeometry(0.9, 0),
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.TorusKnotGeometry(0.55, 0.2, 48, 8),
      new THREE.ConeGeometry(0.8, 1.4, 5),
    ];
    const palette = [0xffe14d, 0x19b3a7, 0xff7b67, 0xe3daff, 0xfff6e9, 0xffd9d2];
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x1a1230 });

    const group = new THREE.Group();
    scene.add(group);
    const count = window.innerWidth < 768 ? 7 : 13;
    const items = [];
    for (let i = 0; i < count; i++) {
      const geo = geos[i % geos.length];
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: palette[i % palette.length], flatShading: true, roughness: 0.55, metalness: 0.05,
      }));
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), edgeMat));
      // Positions are stored as fractions of the visible frame so the layout
      // holds at any width. Shapes hug the right side and the far-left edge,
      // keeping the headline area clear.
      const z = -2 - Math.random() * 6;
      const leftEdge = i % 4 === 0;
      const fx = leftEdge ? -(0.88 + Math.random() * 0.2) : 0.38 + Math.random() * 0.68;
      const fy = (Math.random() - 0.5) * 1.8;
      mesh.position.set(0, 0, z);
      mesh.userData = { fx, fy };
      const sc = (0.55 + Math.random() * 0.75) * (window.innerWidth < 768 ? 0.65 : 1);
      mesh.scale.setScalar(sc);
      mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      group.add(mesh);
      items.push({
        mesh,
        spin: new THREE.Vector3((Math.random() - 0.5) * 0.012, (Math.random() - 0.5) * 0.016, (Math.random() - 0.5) * 0.01),
        bob: Math.random() * Math.PI * 2,
        baseY: 0,
      });
    }

    const hero = canvas.parentElement;
    function resize() {
      const w = hero.clientWidth, h = hero.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const narrow = w < 768;
      items.forEach((it) => {
        const d = camera.position.z - it.mesh.position.z;
        const halfH = d * tanHalf, halfW = halfH * camera.aspect;
        let { fx, fy } = it.mesh.userData;
        // On phones the copy fills the width, so push every shape to an edge
        if (narrow) fx = Math.sign(fx || 1) * Math.max(Math.abs(fx), 0.95);
        it.mesh.position.x = fx * halfW;
        it.baseY = fy * halfH * 0.9;
      });
    }
    resize();
    new ResizeObserver(resize).observe(hero);

    const pointer = { x: 0, y: 0 };
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    let visible = true;
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(hero);

    const clock = new THREE.Clock();
    (function tick() {
      requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const scrollP = Math.min(window.scrollY / hero.clientHeight, 1);
      items.forEach((it) => {
        it.mesh.rotation.x += it.spin.x;
        it.mesh.rotation.y += it.spin.y;
        it.mesh.rotation.z += it.spin.z;
        it.mesh.position.y = it.baseY + Math.sin(t * 0.8 + it.bob) * 0.35;
      });
      group.rotation.y += (pointer.x * 0.5 - group.rotation.y) * 0.05;
      group.rotation.x += (pointer.y * 0.3 + scrollP * 0.9 - group.rotation.x) * 0.05;
      group.position.y = scrollP * 4;
      renderer.render(scene, camera);
    })();
  }

  /* ---------------------------------------------
     11c. 3D collage parallax + footer wordmark tilt
     --------------------------------------------- */
  function initCollage3D() {
    if (!hasGSAP || reduceMotion) return;
    const hero = document.querySelector(".hero");
    const layers = document.querySelectorAll("[data-depth]");
    gsap.set(layers, { transformPerspective: 900 });

    // Layers fly in from depth on load
    gsap.from(layers, {
      z: -400, rotationY: (i) => (i % 2 ? 35 : -35), opacity: 0,
      duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.2,
    });

    if (finePointer) {
      hero.addEventListener("pointermove", (e) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        layers.forEach((el) => {
          const d = Number(el.dataset.depth) || 40;
          gsap.to(el, { x: dx * d * 0.6, y: dy * d * 0.6, rotationY: dx * 16, rotationX: -dy * 12, duration: 0.6, ease: "power2.out" });
        });
      });
      hero.addEventListener("pointerleave", () => gsap.to(layers, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.8 }));
    }

    // Footer wordmark: rises out of the page in 3D, then follows the pointer
    const brand = document.getElementById("footerBrand");
    if (brand && window.ScrollTrigger) {
      gsap.from(brand, {
        rotationX: 75, y: 80, opacity: 0, transformPerspective: 900, transformOrigin: "50% 100%",
        duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".site-footer", start: "top 85%", once: true },
      });
      if (finePointer) {
        const footer = document.querySelector(".site-footer");
        footer.addEventListener("pointermove", (e) => {
          const r = footer.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          const dy = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(brand, { rotationY: dx * 24, rotationX: -dy * 18, transformPerspective: 900, duration: 0.5 });
        });
        footer.addEventListener("pointerleave", () => gsap.to(brand, { rotationX: 0, rotationY: 0, duration: 0.8 }));
      }
    }
  }

  /* ---------------------------------------------
     12. Micro-interactions (desktop pointer only)
     --------------------------------------------- */
  function initPointerFX() {
    if (!finePointer || reduceMotion) return;

    // Custom cursor
    const cursor = document.querySelector(".cursor");
    root.classList.add("has-cursor");
    const xTo = hasGSAP ? gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" }) : (v) => (cursor.style.left = v + "px");
    const yTo = hasGSAP ? gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" }) : (v) => (cursor.style.top = v + "px");
    window.addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.querySelectorAll("a, button, input, model-viewer").forEach((el) => {
      el.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
      el.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
    });

    if (!hasGSAP) return;

    // Magnetic buttons
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.3, ease: "power3.out" });
      });
      btn.addEventListener("pointerleave", () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, .4)" }));
    });

    // Card tilt
    document.querySelectorAll(".tilt, .hotline, .counter, .chart-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: px * 14, rotateX: -py * 14, transformPerspective: 700, duration: 0.4, ease: "power2.out" });
      });
      card.addEventListener("pointerleave", () => gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" }));
    });
  }

  /* ---------------------------------------------
     13. Scroll animations
     --------------------------------------------- */
  function initScroll() {
    const heroWords = splitWords(document.querySelector(".hero-line-1"));

    if (reduceMotion || !hasGSAP || !window.ScrollTrigger) {
      // Draw everything immediately
      const numbers = document.getElementById("numbers");
      const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { io.disconnect(); runCounters(); drawCharts(); }
      }, { threshold: 0.15 });
      io.observe(numbers);
      return;
    }

    // Counters start from zero only when they will be animated
    document.querySelectorAll(".count").forEach((el) => (el.textContent = "0"));

    // Hero: word-by-word headline
    gsap.timeline()
      .from(heroWords, { yPercent: 110, duration: 0.7, ease: "power3.out", stagger: 0.07 })
      .from(".hero-line-2", { rotationX: -90, opacity: 0, transformPerspective: 600, transformOrigin: "50% 0%", duration: 0.6, ease: "back.out(1.6)" }, "-=0.3")
      .from(".sticker", { scale: 0, rotation: -30, duration: 0.4, stagger: 0.08, ease: "back.out(2)" }, "-=0.4")
      .from(".hero-sub", { y: 20, opacity: 0, duration: 0.6 }, "-=0.35")
      .from(".hero-ctas .btn", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");

    // 3D reveals: cards swing up out of the page, batched for stagger
    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: 60, rotationX: -45, transformPerspective: 900, transformOrigin: "50% 100%" },
        { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, overwrite: true }),
    });

    // Section headings tip forward in 3D
    gsap.utils.toArray(".section-title").forEach((h) => {
      gsap.from(h, {
        rotationX: 80, opacity: 0, transformPerspective: 700, transformOrigin: "50% 100%",
        duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: h, start: "top 90%", once: true },
      });
    });

    // Counters flip in on their vertical axis
    ScrollTrigger.create({
      trigger: ".counters", start: "top 85%", once: true,
      onEnter: () => gsap.from(".counter", {
        rotationY: -95, opacity: 0, transformPerspective: 1000, transformOrigin: "0% 50%",
        duration: 0.8, ease: "power3.out", stagger: 0.12,
      }),
    });

    // 3D shield section: the stage swings in and the orbit rings tilt with scroll
    gsap.from(".shield-stage", {
      rotationY: -60, rotationX: 20, scale: 0.7, opacity: 0, transformPerspective: 1200,
      duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: ".shield-section", start: "top 75%", once: true },
    });
    gsap.fromTo(".orbit", { rotationX: 80 }, {
      rotationX: 55, ease: "none",
      scrollTrigger: { trigger: ".shield-section", start: "top bottom", end: "bottom top", scrub: true },
    });

    const mm = gsap.matchMedia();

    // Parallax on section images (desktop + tablet)
    mm.add("(min-width: 768px)", () => {
      document.querySelectorAll("[data-parallax] img").forEach((img) => {
        gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
          yPercent: 6, ease: "none",
          scrollTrigger: { trigger: img.closest("[data-parallax]"), start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    // By the Numbers: pinned on desktop while the counters run
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: ".numbers-pin",
        start: "top top",
        end: "+=60%",
        pin: true,
        onEnter: runCounters,
      });
    });
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({ trigger: ".counters", start: "top 80%", once: true, onEnter: runCounters });
    });

    // Charts draw when their row scrolls in
    ScrollTrigger.create({ trigger: ".charts", start: "top 80%", once: true, onEnter: drawCharts });

    // 3D shield reacts to scroll: turn it as the section passes
    if (mv) {
      ScrollTrigger.create({
        trigger: ".shield-section",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          if (!mv.isConnected || mv.matches(":hover")) return;
          const theta = -40 + self.progress * 80;
          mv.cameraOrbit = `${theta}deg 80deg auto`;
        },
      });
    }
  }

  /* ---------------------------------------------
     Boot
     --------------------------------------------- */
  runIntro().then(() => {
    initScroll();
    initHero3D();
    initCollage3D();
    initPointerFX();
  });
})();
