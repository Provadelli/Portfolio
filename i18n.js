/* Troca de idioma PT/EN. O português vem do próprio HTML; aqui ficam só as traduções para inglês. */
(() => {
  "use strict";

  const EN = {
    skip: "Skip to content",
    nav_main: "Main navigation", nav_mobile: "Mobile menu", lang_group: "Language", gh_label: "Pedro's GitHub (opens in a new tab)",
    nav_about: "About", nav_projects: "Projects", nav_services: "Services", nav_tech: "Technologies", nav_path: "Journey", nav_contact: "Contact",
    newtab_p: " (opens in a new tab)", newtab_b: "(opens in a new tab)",
    meta_desc: "Portfolio of Pedro Lucas Provadelli, Software Engineering student at FIAP and developer in the making.",

    hero_status: "Open to new projects", hero_hi: "Hi, I'm", hero_cap: "pedro, 2026",
    ty1: "a Software Engineering student at FIAP.", ty2: "an Electronics technician from FAETEC.", ty3: "the founder of NP Code Solutions.", ty4: "someone who learns by building.",
    n1_k: "now", n1: "studying APIs and AI", n2_k: "base", n2: "Electronics, circuits and Arduino", n3_k: "always", n3: "learning by doing",
    log_label: "Short history", g1: "Electronics technician (FAETEC)", g2: "first websites live", g3: "founded NP Code Solutions", g4: "Software Engineering (FIAP)",
    hero_pill: "FIAP · Software Engineering · Web Development",
    hero_lede: "Turning ideas into digital solutions and high-impact software, one commit at a time.",
    hero_cta1: "Start a conversation", hero_cta2: "See projects",
    stat_projects: "Published projects", stat_edu: "Programs", stat_langs: "Languages",

    card_label: "Introduction card", photo_alt: "Portrait of Pedro Lucas Provadelli",
    founder_role: "Founder · NP Code Solutions",
    quote: "“The beginning is the most important part of the work.”", quote_by: "— Plato",
    about_title: "A little <em>about me.</em>", founder_sub: "Software Engineering · FIAP",
    about_eyebrow: "01 — About · Who is behind this",
    about_role: "Founder &amp; Developer · NP Code Solutions",
    about_p1: "I am a Software Engineering student at <strong>FIAP</strong> and hold a Technical degree in Electronics from <strong>FAETEC</strong>. My path in technology involves web development, programming and building digital solutions, always looking to turn ideas into working, relevant projects.",
    about_p2: "I have experience with technologies such as HTML, CSS, JavaScript, Python and C++, plus an interest in AI, automation and systems development. I like learning by doing, exploring new technologies and turning challenges into opportunities to create.",
    edu1_label: "FIAP · In progress", edu1_title: "Software Engineering",
    edu2_label: "FAETEC · Technical", edu2_title: "Electronics",
    lbl_tech: "Technologies", lbl_interests: "Interests", lbl_facts: "Quick summary",
    int1: "Web development", int2: "Artificial Intelligence", int3: "Automation", int4: "Embedded systems", int5: "Systems development",
    f1_t: "Education", f1_d: "Software Engineering (FIAP, in progress) and Technical degree in Electronics (FAETEC)",
    f2_t: "Role", f2_d: "Founder and developer at NP Code Solutions",
    f3_t: "Focus", f3_d: "Web, Python automation and embedded systems",
    f4_t: "Projects", f4_d: "5 projects published in this portfolio",
    f5_t: "Contact",

    proj_eyebrow: "02 — Selected projects",
    proj_title: "From the repository<br><em>to the real world.</em>",
    proj_region: "Selected projects", carousel_word: "carousel", proj_list: "Project list",
    see_project: "View project", see_repo: "View repository",
    pele_alt1: "Home screen of the Pelé Next Gen platform", pele_alt2: "Another screen of the Pelé Next Gen platform",
    atelier_alt1: "Home screen of the Atelier Residences website", atelier_alt2: "Another screen of the Atelier Residences website",
    space_alt: "Electronic circuit of the Space Guardian project built with Arduino",
    np_alt1: "Home screen of the NP Code Solutions website", np_alt2: "Another screen of the NP Code Solutions website",
    shin_alt1: "Home screen of the Shinatal digital experience", shin_alt2: "Another screen of the Shinatal digital experience",
    pele_desc: "Sports platform that connects athletes, clubs and opportunities, widening access to tryouts and evaluation processes.",
    atelier_desc: "Website for a high-end real estate agency: development showcase, residence portfolio, differentiators, testimonials, FAQ and contact form.",
    space_desc: "Academic embedded systems project focused on monitoring and onboard autonomy.",
    np_desc: "Custom websites and digital solutions for companies, from brief to launch.",
    shin_desc: "Digital experience that turns the success of every contract into rewards for the team and impact for society.",

    serv_eyebrow: "03 — What I do",
    serv_title: "From idea to <em>deploy.</em>",
    serv_lede: "I handle the whole cycle: understanding the problem, designing, coding, publishing and evolving. These are the areas I work in today.",
    s1_t: "Websites and landing pages", s1_d: "Fast, responsive, search-optimized pages, from brief to launch. Focus on performance, accessibility and visual identity.",
    s2_t: "Web applications", s2_d: "Interfaces and platforms with HTML, CSS, JavaScript and TypeScript, such as Pelé Next Gen and Shinatal.",
    s3_t: "Python automation", s3_d: "Scripts and routines that remove repetitive tasks and make processes more reliable.",
    s4_t: "Embedded systems", s4_d: "Arduino and C++ prototypes for monitoring and autonomy, a legacy of my technical training in Electronics.",
    start_project: "Start a project",

    tech_eyebrow: "04 — Technologies", tech_title: "Tools of the <em>trade.</em>",
    tech_dev: "Development", tech_tools: "Tools", tech_learning: "Studying now",
    lv_daily: "Daily use", lv_mid: "Intermediate", lv_acad: "Academic", lv_git: "Version control", lv_gh: "Collaboration", lv_ed: "Editor", lv_dep: "Deploy",
    l1: "Data Structures", l2: "Databases", l3: "Software Engineering", l5: "Artificial Intelligence",

    path_eyebrow: "05 — Journey", path_title: "A path <em>under construction.</em>",
    t1: "Technical degree in Electronics. Foundation in circuits, logic and embedded systems, which shapes my Arduino and C++ projects.",
    t2_t: "Web Development", t2: "First projects and experience building websites, learning by doing with HTML, CSS and JavaScript.",
    t3: "Founder and developer. Custom websites and digital solutions for companies, from brief to launch.",
    t4: "Studying Software Engineering, with coursework in data structures, databases, APIs and artificial intelligence.",

    faq_eyebrow: "06 — FAQ", faq_title: "Got <em>any questions?</em>",
    q1: "Who is Pedro Provadelli?", a1: "Software Engineering student at FIAP, Electronics technician from FAETEC and founder of NP Code Solutions, where he builds websites and digital solutions.",
    q2: "What do you work with?", a2: "Web development (HTML, CSS, JavaScript and TypeScript), Python for automation and C++ with Arduino for embedded systems.",
    q3: "What kind of projects do you take?", a3: "Corporate websites, landing pages, web applications and automations. Tell me your idea through the form and I will reply with next steps.",
    q4: "Do you have published projects?", a4: "Yes. The Projects section has five works: live websites (Pelé Next Gen, Atelier Residences, NP Code Solutions and Shinatal) and an academic embedded systems project (Space Guardian).",
    q5: "How can I get in touch?", a5: "Through the form on this page, by e-mail at pedroprovadelli@gmail.com, or via LinkedIn and GitHub.",
    q6: "What happens to the data I send?", a6: "It is used only to reply to your message, in accordance with the LGPD (Brazilian data protection law). See the <a href=\"privacidade.html\">Privacy Policy</a>.",

    contact_eyebrow: "07 — Contact",
    contact_title: "Got an idea, project<br>or opportunity? <em>Let's talk.</em>",
    email_lbl: "E-mail", form_title: "Send a message", f_name: "Name", f_msg: "Message",
    f_consent: "I have read and agree to the processing of my data to answer this message, as described in the <a href=\"privacidade.html\">Privacy Policy</a> (LGPD).",
    f_send: "Send message", f_note: "Fields marked with * are required.",
    err_name: "Enter your name.", err_email: "Enter a valid e-mail.", err_msg: "Write a message with at least 10 characters.", err_consent: "You must agree before sending the message.",
    form_mail: "Opening your e-mail app to finish sending.", form_sending: "Sending...", form_ok: "Message sent! I will reply soon.",
    form_fail: "Could not send. Try again or write to pedroprovadelli@gmail.com.",
    car_pause: "Pause automatic rotation", car_resume: "Resume automatic rotation",
    menu_open: "Open menu", menu_close: "Close menu",

    foot_bio: "Software Engineering student at FIAP, building digital solutions from the first commit to deploy.",
    foot_nav: "Navigation", foot_nav_l: "Footer: navigation", foot_faq: "FAQ", foot_legal: "Legal", foot_legal_l: "Footer: legal",
    privacy: "Privacy Policy", a11y: "Accessibility",
    copy: "© 2026 Pedro Lucas Provadelli. All rights reserved.", to_top: "Back to top ↑",

    /* Páginas legais */
    nf_code: "file not found", nf_title: "This page doesn't exist, or it moved.",
    nf_text: "The address you tried to open was not found. It may have been mistyped or the page was moved. Shall we get back on track?",
    nf_home: "Back to home", nf_projects: "See projects", nf_contact: "Talk to me",
    back: "← Back to portfolio",
    pv_title: "Privacy Policy", pv_meta: "Last updated: October 7, 2026 · In compliance with the Brazilian General Data Protection Law (Law No. 13,709/2018).",
    pv_h1: "1. Who the controller is", pv_p1: "Pedro Lucas Provadelli, responsible for this portfolio. Privacy contact: <a href=\"mailto:pedroprovadelli@gmail.com\">pedroprovadelli@gmail.com</a>.",
    pv_h2: "2. What data we collect", pv_p2: "Only the data you voluntarily provide in the contact form:",
    pv_l1: "name;", pv_l2: "e-mail address;", pv_l3: "message content.",
    pv_p2b: "This website <strong>does not use tracking cookies, advertising or analytics tools</strong>, so no cookie banner is shown. If that changes, this policy will be updated and consent requested before any collection.",
    pv_h3: "3. Purpose and legal basis", pv_p3: "Data is used solely to read and reply to your message. The legal basis is your <strong>consent</strong> (art. 7, I, LGPD), given by ticking the agreement box before sending.",
    pv_h4: "4. Sharing", pv_p4: "Data is neither sold nor shared for commercial purposes. The form is processed by <strong>Web3Forms</strong> (processor), which forwards the message to the controller's e-mail. Fonts are loaded from Google Fonts, which may log your IP address when delivering files. The site is hosted on Vercel.",
    pv_h5: "5. Retention", pv_p5: "Messages are kept only as long as needed to reply and for a reasonable record of the conversation, and are deleted on request or when no longer useful.",
    pv_h6: "6. Your rights (art. 18)", pv_p6: "You may at any time request: confirmation of processing; access; correction; anonymization, blocking or deletion; portability; information about sharing; and withdrawal of consent. Just write to <a href=\"mailto:pedroprovadelli@gmail.com\">pedroprovadelli@gmail.com</a>. You may also petition the Brazilian National Data Protection Authority (ANPD).",
    pv_h7: "7. Security", pv_p7: "Communication with the site and the form service uses HTTPS. We adopt reasonable measures to protect data against unauthorized access.",
    pv_h8: "8. Changes", pv_p8: "This policy may be updated; the date at the top shows the current version.",

    ac_title: "Accessibility Statement", ac_meta: "Last updated: October 7, 2026.",
    ac_p1: "This portfolio aims to meet the Web Content Accessibility Guidelines (WCAG) 2.2, level AA, and the principles of the Brazilian Inclusion Law (Law No. 13,146/2015).",
    ac_h1: "Available features",
    ac_l1: "“Skip to content” link at the start of every page.",
    ac_l2: "Full keyboard navigation with a visible focus indicator; the mobile menu closes with the Esc key.",
    ac_l3: "Semantic structure with landmarks (header, nav, main, footer) and a heading hierarchy.",
    ac_l4: "Colors with a minimum contrast of 4.5:1 for text and 3:1 for interface components.",
    ac_l5: "Project carousel with a pause button; it pauses on hover and focus. Automatic motion is off for users who prefer reduced motion.",
    ac_l6: "Animations respect <code>prefers-reduced-motion</code>.",
    ac_l7: "Form with associated labels, error messages announced by screen readers and required-field indication.",
    ac_l8: "Alternative text on images and a notice for links that open in a new tab.",
    ac_l9: "Language switch between Portuguese and English.",
    ac_h2: "Known limitations", ac_p2: "The external sites listed in the projects (such as Pelé Next Gen and Atelier Residences) are maintained separately and may not fully meet the same criteria.",
    ac_h3: "Report a problem", ac_p3: "Found an access barrier? Write to <a href=\"mailto:pedroprovadelli@gmail.com\">pedroprovadelli@gmail.com</a> with the page and the issue. We aim to reply within 5 business days."
  };

  const KEY = "lang";
  const store = { pt: {}, attrs: [] };

  function read(){
    document.querySelectorAll("[data-i18n]").forEach(el => {
      store.pt[el.dataset.i18n] = store.pt[el.dataset.i18n] ?? el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.dataset.i18nAttr.split(";").forEach(pair => {
        const [attr, key] = pair.split(":");
        store.pt["@" + key] = store.pt["@" + key] ?? el.getAttribute(attr);
        store.attrs.push([el, attr, key]);
      });
    });
    store.title = document.title;
  }

  function t(key, ptDefault){
    const lang = document.documentElement.dataset.lang || "pt";
    if (lang === "en" && EN[key] != null) return EN[key];
    return store.pt[key] ?? store.pt["@" + key] ?? ptDefault ?? key;
  }

  function apply(lang){
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.dataset.i18n;
      el.innerHTML = lang === "en" && EN[k] != null ? EN[k] : store.pt[k];
    });
    store.attrs.forEach(([el, attr, key]) => {
      const v = lang === "en" && EN[key] != null ? EN[key] : store.pt["@" + key];
      if (v != null) el.setAttribute(attr, v);
    });
    document.querySelectorAll(".lang__btn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    const og = document.querySelector('meta[property="og:locale"]');
    if (og) og.setAttribute("content", lang === "en" ? "en_US" : "pt_BR");
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function setLang(lang){
    try { localStorage.setItem(KEY, lang); } catch (e) { /* sem armazenamento */ }
    apply(lang);
  }

  window.i18n = { t, setLang, get lang(){ return document.documentElement.dataset.lang || "pt"; } };

  read();
  document.querySelectorAll(".lang__btn").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* ignora */ }
  const initial = saved || ((navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en");
  document.documentElement.dataset.lang = "pt";
  if (initial === "en") apply("en");
})();
