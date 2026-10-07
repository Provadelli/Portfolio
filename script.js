(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = (k, d) => (window.i18n ? window.i18n.t(k, d) : d);

  /* ---------------------------------------------
     HEADER: blur + shrink on scroll, progress thread
  --------------------------------------------- */
  const header = document.getElementById("header");
  const progressFill = document.querySelector(".progress-thread__fill");
  let ticking = false;

  function update(){
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + "%";
  }
  function requestUpdate(){
    if (!ticking){ ticking = true; requestAnimationFrame(update); }
  }
  document.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();

  /* ---------------------------------------------
     MOBILE MENU
  --------------------------------------------- */
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  function setMenu(open){
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.toggleAttribute("inert", !open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? T("menu_close", "Fechar menu") : T("menu_open", "Abrir menu"));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burger && mobileMenu){
    burger.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("is-open")));
    mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
    window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")){
        setMenu(false);
        burger.focus();
      }
    });
  }

  /* ---------------------------------------------
     SCROLL REVEAL
  --------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal, .timeline__item");

  if ("IntersectionObserver" in window && !reduceMotion){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------
     FOTO: sai do hero (direita) e desce até o Sobre (esquerda)
  --------------------------------------------- */
  const founder = document.getElementById("founder");
  const heroSlot = document.getElementById("heroSlot");
  const aboutSlot = document.getElementById("aboutSlot");
  const floatMQ = window.matchMedia("(min-width: 981px)");
  let floating = false, fTick = false;

  function measureSlots(){
    // mede o cartão no fluxo normal para reservar o espaço nos dois lugares
    const was = founder.classList.contains("is-float");
    founder.classList.remove("is-float");
    const h = founder.offsetHeight;
    heroSlot.style.minHeight = aboutSlot.style.minHeight = h + "px";
    if (was) founder.classList.add("is-float");
  }

  function layoutFounder(){
    fTick = false;
    if (!floating) return;
    const t = Math.min(Math.max(window.scrollY / (window.innerHeight * 0.85), 0), 1);
    const e = t * t * (3 - 2 * t);
    const a = heroSlot.getBoundingClientRect();
    const b = aboutSlot.getBoundingClientRect();
    const x = a.left + (b.left - a.left) * e;
    const y = a.top + (b.top - a.top) * e;
    founder.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
  function queueLayout(){ if (!fTick){ fTick = true; requestAnimationFrame(layoutFounder); } }

  function setFloat(on){
    floating = on;
    measureSlots();
    document.documentElement.classList.toggle("float-on", on);
    founder.classList.toggle("is-float", on);
    if (!on){ founder.style.transform = ""; }
    layoutFounder();
  }

  if (founder && heroSlot && aboutSlot){
    const evaluate = () => setFloat(floatMQ.matches && !reduceMotion);
    window.addEventListener("scroll", queueLayout, { passive: true });
    window.addEventListener("resize", () => { measureSlots(); queueLayout(); });
    document.addEventListener("langchange", () => { measureSlots(); queueLayout(); });
    window.addEventListener("load", () => { measureSlots(); queueLayout(); });
    floatMQ.addEventListener("change", evaluate);
    evaluate();
  }

  /* ---------------------------------------------
     TEXTO DIGITADO NO HERO
  --------------------------------------------- */
  const typedEl = document.getElementById("typed");
  const typedSrc = document.getElementById("typedSrc");
  if (typedEl && typedSrc){
    let phrases = [];
    let p = 0, c = 0, del = false, timer = null;
    const load = () => { phrases = Array.from(typedSrc.children).map(li => li.textContent.trim()); };
    function tick(){
      const full = phrases[p];
      if (reduceMotion){ typedEl.textContent = full; return; }
      c += del ? -1 : 1;
      typedEl.textContent = full.slice(0, c);
      let wait = del ? 28 : 55;
      if (!del && c === full.length){ del = true; wait = 1800; }
      else if (del && c === 0){ del = false; p = (p + 1) % phrases.length; wait = 350; }
      timer = setTimeout(tick, wait);
    }
    function restart(){ clearTimeout(timer); load(); p = 0; c = 0; del = false; typedEl.textContent = ""; tick(); }
    document.addEventListener("langchange", restart);
    restart();
  }

  /* ---------------------------------------------
     CARROSSEL DE PROJETOS
     faixa contínua e lenta (rolagem por rAF) que pode ser
     arrastada com o mouse, deslizada no toque ou navegada por teclado
  --------------------------------------------- */
  const track = document.getElementById("carouselTrack");
  if (track){
    const carousel = document.getElementById("carousel");
    const btnToggle = document.getElementById("carToggle");
    const SPEED = 60;            // px por segundo (calmo, porém fluido)
    const RESUME_MS = 2200;      // retoma após interação de toque/roda

    const originals = Array.from(track.children);

    // Laço sem começo nem fim: [cópias][originais][cópias]. As cópias saem do foco e da leitura, mas continuam clicáveis
    const makeClone = (li) => {
      const clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.classList.add("is-clone");
      clone.querySelectorAll("a, button").forEach(el => el.setAttribute("tabindex", "-1"));
      return clone;
    };
    const first = originals[0];
    originals.forEach(li => track.insertBefore(makeClone(li), first));
    originals.forEach(li => track.appendChild(makeClone(li)));

    let pos = 0, userPaused = reduceMotion;
    let hovering = false, focusing = false, dragging = false, pressing = false, onScreen = false;
    let lastUser = 0, velocity = 0, lastFrame = 0, programmatic = 0;

    // largura de um ciclo completo; a posição vive sempre em [w, 2w)
    const loopWidth = () => {
      const after = track.children[originals.length * 2];
      return after ? after.offsetLeft - originals[0].offsetLeft : 0;
    };
    const wrap = (x) => {
      const w = loopWidth();
      if (!w) return x;
      while (x >= 2 * w) x -= w;
      while (x < w) x += w;
      return x;
    };
    const setPos = (x) => { pos = wrap(x); track.scrollLeft = pos; };

    // mantém `pos` em sincronia quando o usuário rola (toque, roda, teclado)
    track.addEventListener("scroll", () => {
      if (performance.now() < programmatic) return;
      pos = track.scrollLeft;
      const w = loopWidth();
      if (w && (pos >= 2 * w || pos < w)){ setPos(pos); }
    }, { passive: true });

    function touchedByUser(){ lastUser = performance.now(); }
    track.addEventListener("touchstart", touchedByUser, { passive: true });
    track.addEventListener("touchmove", touchedByUser, { passive: true });
    track.addEventListener("touchend", touchedByUser, { passive: true });
    track.addEventListener("wheel", touchedByUser, { passive: true });

    /* ---- arrastar com o mouse ---- */
    let startX = 0, lastX = 0, lastT = 0, suppressClick = false;

    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      pressing = true; dragging = false; velocity = 0;
      startX = lastX = e.clientX; lastT = e.timeStamp;
    });
    track.addEventListener("pointermove", (e) => {
      if (!pressing) return;
      const dx = e.clientX - startX;
      if (!dragging){
        if (Math.abs(dx) < 6) return;
        dragging = true;
        track.classList.add("is-dragging");
        try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
      }
      const dt = Math.max(e.timeStamp - lastT, 1);
      const d = lastX - e.clientX;
      velocity = d / dt * 1000;                     // px/s
      lastX = e.clientX; lastT = e.timeStamp;
      programmatic = performance.now() + 50;
      setPos(pos + d);
    });
    function endDrag(e){
      if (!pressing) return;
      pressing = false;
      if (!dragging) return;
      dragging = false;
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
      try { track.releasePointerCapture(e.pointerId); } catch (err) { /* ignora */ }
      track.classList.remove("is-dragging");
      if (performance.now() - lastT > 90) velocity = 0;
    }
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", (e) => { if (suppressClick){ e.preventDefault(); e.stopPropagation(); } }, true);
    track.addEventListener("dragstart", (e) => e.preventDefault());

    /* ---- rolagem por card (botões e teclado) ---- */
    function step(dir){
      const card = originals[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
      touchedByUser();
      const from = track.scrollLeft;
      programmatic = performance.now() + 700;
      if (reduceMotion){ setPos(from + dir * card); return; }
      track.scrollTo({ left: from + dir * card, behavior: "smooth" });
      setTimeout(() => { programmatic = 0; pos = track.scrollLeft; setPos(pos); }, 720);
    }
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight"){ e.preventDefault(); step(1); }
      else if (e.key === "ArrowLeft"){ e.preventDefault(); step(-1); }
    });

    /* ---- laço de animação ---- */
    const canPlay = () => !userPaused && !hovering && !focusing && !dragging && onScreen && !document.hidden
      && performance.now() - lastUser > RESUME_MS;

    function frame(t){
      const dt = Math.min((t - (lastFrame || t)) / 1000, 0.25);
      lastFrame = t;
      if (dragging){
        // posição controlada pelo ponteiro
      } else if (Math.abs(velocity) > 8){
        // inércia após soltar
        velocity *= Math.pow(0.0035, dt);
        programmatic = performance.now() + 50;
        setPos(pos + velocity * dt);
      } else if (canPlay()){
        velocity = 0;
        programmatic = performance.now() + 50;
        setPos(pos + SPEED * dt);
      }
      requestAnimationFrame(frame);
    }

    carousel.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") hovering = true; });
    carousel.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") hovering = false; });
    carousel.addEventListener("focusin", () => { focusing = true; });
    carousel.addEventListener("focusout", () => { focusing = false; });

    function syncToggle(){
      btnToggle.setAttribute("aria-pressed", String(userPaused));
      btnToggle.setAttribute("aria-label", userPaused ? T("car_resume", "Retomar rotação automática") : T("car_pause", "Pausar rotação automática"));
      btnToggle.textContent = userPaused ? "▶" : "❚❚";
    }
    btnToggle.addEventListener("click", () => { userPaused = !userPaused; syncToggle(); });
    document.addEventListener("langchange", syncToggle);
    syncToggle();

    /* ---- troca de imagens dentro de cada card ---- */
    const fades = Array.from(track.querySelectorAll(".card__media")).map(m => ({ imgs: Array.from(m.querySelectorAll("img")), cur: 0 })).filter(f => f.imgs.length > 1);
    if (fades.length && !reduceMotion){
      setInterval(() => {
        if (!onScreen || document.hidden) return;
        fades.forEach(f => {
          f.imgs[f.cur].classList.remove("is-on");
          f.cur = (f.cur + 1) % f.imgs.length;
          f.imgs[f.cur].classList.add("is-on");
        });
      }, 3800);
    }

    if ("IntersectionObserver" in window){
      new IntersectionObserver((entries) => { onScreen = entries[0].isIntersecting; }, { threshold: 0.2 }).observe(carousel);
    } else { onScreen = true; }

    // começa no meio do laço, com margem de sobra dos dois lados
    const start = () => { programmatic = performance.now() + 50; setPos(loopWidth()); };
    start();
    window.addEventListener("load", start);
    if ("ResizeObserver" in window) new ResizeObserver(() => { const w = loopWidth(); if (w) setPos(pos < w ? w : pos); }).observe(track);

    if (!reduceMotion) requestAnimationFrame(frame);
  }

  /* ---------------------------------------------
     FORMULÁRIO DE CONTATO (validação + envio)
  --------------------------------------------- */
  const form = document.getElementById("contactForm");
  if (form){
    const statusEl = document.getElementById("formStatus");
    const submitBtn = document.getElementById("formSubmit");
    const MAIL = "pedroprovadelli@gmail.com";

    const rules = {
      name: v => v.trim().length >= 2 ? "" : T("err_name", "Informe seu nome."),
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : T("err_email", "Informe um e-mail válido."),
      message: v => v.trim().length >= 10 ? "" : T("err_msg", "Escreva uma mensagem com pelo menos 10 caracteres.")
    };

    function validateField(input){
      const wrap = input.closest(".field");
      const err = wrap.querySelector(".field__error");
      let msg = "";
      if (input.name === "consent") msg = input.checked ? "" : T("err_consent", "É necessário concordar para enviar a mensagem.");
      else if (rules[input.name]) msg = rules[input.name](input.value);
      err.textContent = msg;
      wrap.dataset.invalid = msg ? "true" : "false";
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    }

    const fields = Array.from(form.querySelectorAll("#f-nome, #f-email, #f-msg, #f-lgpd"));
    fields.forEach(f => f.addEventListener("blur", () => validateField(f)));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.removeAttribute("data-state");

      const results = fields.map(validateField);
      const firstBad = fields[results.indexOf(false)];
      if (firstBad){ firstBad.focus(); return; }
      if (form.botcheck && form.botcheck.checked) return;

      const data = new FormData(form);
      const key = data.get("access_key");

      // Sem chave configurada: abre o app de e-mail com a mensagem preenchida
      if (!key || key === "SUA_CHAVE_WEB3FORMS"){
        const body = `${data.get("message")}\n\n— ${data.get("name")} (${data.get("email")})`;
        window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent("Contato pelo portfólio")}&body=${encodeURIComponent(body)}`;
        statusEl.dataset.state = "ok";
        statusEl.textContent = T("form_mail", "Abrindo seu aplicativo de e-mail para concluir o envio.");
        return;
      }

      submitBtn.disabled = true;
      statusEl.textContent = T("form_sending", "Enviando...");
      try{
        const res = await fetch(form.action, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Falha no envio");
        statusEl.dataset.state = "ok";
        statusEl.textContent = T("form_ok", "Mensagem enviada! Responderei em breve.");
        form.reset();
        fields.forEach(f => { f.removeAttribute("aria-invalid"); f.closest(".field").dataset.invalid = "false"; });
      } catch (err){
        statusEl.dataset.state = "error";
        statusEl.textContent = T("form_fail", `Não foi possível enviar. Tente novamente ou escreva para ${MAIL}.`);
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

})();
