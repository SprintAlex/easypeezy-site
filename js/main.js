// ===== Nav: shadow on scroll + mobile menu =====
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  burger.classList.toggle('open');
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  }
});

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const revObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revObserver.observe(el);
});

// ===== Animated stat counters =====
const stats = document.querySelectorAll('.stat__num');
const animateStat = (el) => {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent = `${prefix}${val}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = `${prefix}${target}${suffix}`;
  };
  requestAnimationFrame(step);
};
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateStat(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
stats.forEach((s) => statObserver.observe(s));

// ===== Contact form -> mailto (static, OVH-ready) =====
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = form.elements;
  if (!f.name.value.trim() || !f.email.value.trim()) {
    f.name.value.trim() || f.name.focus();
    form.reportValidity();
    return;
  }
  const subject = encodeURIComponent(`Demande de devis — ${f.name.value}`);
  const body = encodeURIComponent(
    `Nom / structure : ${f.name.value}\n` +
    `Email : ${f.email.value}\n` +
    `Événement : ${f.event.value}\n` +
    `Affluence attendue : ${f.affluence.value}\n\n` +
    `Message :\n${f.message.value}`
  );
  window.location.href = `mailto:easypeezy.ep@gmail.com?subject=${subject}&body=${body}`;
  form.classList.add('sent');
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Merci ! Votre client mail va s\'ouvrir ✓';
});
