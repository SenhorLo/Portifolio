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

setYear();
setupProjectDetailsToggle();
setupCoursesToggle();
setupNavAnchorNavigation();
setupNavCollapseOnClick();
setupContactForm();
