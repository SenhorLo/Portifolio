function qs(sel) {
  return document.querySelector(sel);
}

function setYear() {
  const el = qs("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupProjectDetailsToggle() {
  const btn = qs("#toggleProjects");
  const details = document.querySelectorAll(".project-details");
  if (!btn || !details.length) return;

  let hidden = false;

  const apply = () => {
    details.forEach((el) => el.classList.toggle("is-hidden", hidden));
    btn.textContent = hidden ? "Mostrar detalhes" : "Ocultar detalhes";
  };

  btn.addEventListener("click", () => {
    hidden = !hidden;
    apply();
  });

  apply();
}

function setupNavCollapseOnClick() {
  const navLinks = document.querySelectorAll("#navbarContent .nav-link");
  const collapseEl = qs("#navbarContent");
  if (!collapseEl || !navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (!collapseEl.classList.contains("show")) return;
      const bsCollapse = window.bootstrap?.Collapse?.getOrCreateInstance(collapseEl);
      bsCollapse?.hide();
    });
  });
}

function setupNavAnchorNavigation() {
  const nav = qs("#topNav");
  const navLinks = document.querySelectorAll("#topNav a[href*='#']");
  if (!nav || !navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const targetId = href.slice(hashIndex + 1);
      if (!targetId) return;

      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const navHeight = nav.offsetHeight || 0;
      window.setTimeout(() => {
        window.scrollBy({ top: -(navHeight + 12), behavior: "instant" });
      }, 260);

      history.replaceState(null, "", `#${targetId}`);
    });
  });
}

function setupCoursesToggle() {
  const btn = qs("#toggleCourses");
  const hiddenCourses = document.querySelectorAll(".course-extra");
  if (!btn || !hiddenCourses.length) return;

  let expanded = false;

  const apply = () => {
    hiddenCourses.forEach((el) => el.classList.toggle("is-hidden", !expanded));
    btn.textContent = expanded ? "Ver menos" : "Ver mais";
  };

  btn.addEventListener("click", () => {
    expanded = !expanded;
    apply();
  });

  apply();
}

function setupContactForm() {
  const form = qs("#contactForm");
  const status = qs("#formStatus");
  if (!form) return;

  const setStatus = (msg) => {
    if (status) status.textContent = msg || "";
  };

  const validate = () => {
    const nome = qs("#nome");
    const email = qs("#email");
    const mensagem = qs("#mensagem");
    if (!nome || !email || !mensagem) return false;

    let ok = true;

    if (!nome.value.trim()) ok = false;
    if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value.trim())) ok = false;
    if (!mensagem.value.trim()) ok = false;

    form.classList.add("was-validated");
    return ok;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    setStatus("");

    if (!validate()) {
      setStatus("Confira os campos e tente novamente.");
      return;
    }

    const nome = qs("#nome").value.trim();
    const email = qs("#email").value.trim();
    const mensagem = qs("#mensagem").value.trim();

    const subject = encodeURIComponent(`Contato pelo portfólio — ${nome}`);
    const body = encodeURIComponent(`Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}\n`);

    setStatus("Abrindo seu aplicativo de e-mail...");
    window.location.href = `mailto:lorenzotacca16@gmail.com?subject=${subject}&body=${body}`;
  });
}

function setupGsapAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = typeof window.gsap !== "undefined";

  if (!hasGsap || prefersReducedMotion) return;

  const { gsap } = window;
  const { ScrollTrigger } = window;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const heroTitle = document.querySelector(".hero h1");
  const heroLead = document.querySelector(".hero .lead");
  const heroButtons = document.querySelectorAll(".hero .btn");
  const sections = document.querySelectorAll("section");
  const cards = document.querySelectorAll(".card-surface, .mini-card");
  const chips = document.querySelectorAll(".chip");
  const bgFlow = document.querySelector(".bg-flow");
  const bubbles = document.querySelectorAll(".bg-flow .bubble");

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(heroTitle, { y: 36, opacity: 0, duration: 0.8 })
    .from(heroLead, { y: 24, opacity: 0, duration: 0.7 }, "-=0.45")
    .from(heroButtons, { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 }, "-=0.35");

  sections.forEach((section) => {
    const heading = section.querySelector("h2");
    const animTargets = section.querySelectorAll(".card-surface, .mini-card, .chip, .project-media-wrap");

    if (heading) {
      gsap.from(heading, {
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
        },
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    }

    if (animTargets.length) {
      gsap.from(animTargets, {
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
        },
        y: 32,
        opacity: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    }
  });

  if (bgFlow) {
    gsap.to(bgFlow, {
      yPercent: 10,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });
  }

  bubbles.forEach((bubble, index) => {
    gsap.to(bubble, {
      x: index % 2 === 0 ? "+=18" : "-=18",
      y: index % 3 === 0 ? "-=14" : "+=10",
      duration: 4 + index * 0.18,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  const interactiveCards = [...cards].filter((card) => card.matches(".card-surface"));
  interactiveCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      if (window.innerWidth < 992) return;

      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: relX * 8,
        rotateX: relY * -8,
        y: -6,
        transformPerspective: 900,
        duration: 0.32,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        duration: 0.45,
        ease: "power3.out",
      });
    });
  });

  const pointerTargets = [heroTitle, heroLead].filter(Boolean);
  window.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 992 || !pointerTargets.length) return;

    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;

    gsap.to(pointerTargets, {
      x: xRatio * 18,
      y: yRatio * 12,
      duration: 0.8,
      ease: "power2.out",
      overwrite: true,
    });
  });
}

setYear();
setupProjectDetailsToggle();
setupCoursesToggle();
setupNavAnchorNavigation();
setupNavCollapseOnClick();
setupContactForm();
setupGsapAnimations();
