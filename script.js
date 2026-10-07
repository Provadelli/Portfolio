(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = (k, d) => (window.i18n ? window.i18n.t(k, d) : d);
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

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
     MAGNETIC BUTTONS
  --------------------------------------------- */
  if (!isTouch && !reduceMotion){
    document.querySelectorAll(".magnetic").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.22}px, ${relY * 0.32}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = "translate(0,0)"; });
    });
  }

  /* ---------------------------------------------
     CARROSSEL CONTÍNUO DE PROJETOS (faixa infinita)
  --------------------------------------------- */
  const track = document.getElementById("carouselTrack");
  if (track){
    const carousel = document.getElementById("carousel");
    const toggleBtn = document.getElementById("carToggle");

    // Duplica os cards para o loop contínuo; as cópias ficam fora da árvore de acessibilidade
    Array.from(track.children).forEach(li => {
      const clone = li.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("inert", "");
      clone.classList.add("is-clone");
      track.appendChild(clone);
    });

    // Fade entre as imagens de cada projeto, uma a uma
    track.querySelectorAll(".card__media").forEach((media, n) => {
      const imgs = media.querySelectorAll("img");
      if (imgs.length < 2 || reduceMotion) return;
      let cur = 0;
      setTimeout(() => {
        setInterval(() => {
          if (carousel.classList.contains("is-paused")) return;
          imgs[cur].classList.remove("is-on");
          cur = (cur + 1) % imgs.length;
          imgs[cur].classList.add("is-on");
        }, 3500);
      }, (n % 5) * 700);
    });

    let userPaused = reduceMotion;
    function sync(){
      carousel.classList.toggle("is-paused", userPaused);
      toggleBtn.setAttribute("aria-pressed", String(userPaused));
      toggleBtn.setAttribute("aria-label", userPaused ? T("car_resume", "Retomar rotação automática") : T("car_pause", "Pausar rotação automática"));
      toggleBtn.textContent = userPaused ? "▶" : "❚❚";
    }
    toggleBtn.addEventListener("click", () => { userPaused = !userPaused; sync(); });
    document.addEventListener("langchange", sync);
    sync();
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
