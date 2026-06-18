/* ===================================================================
   КИБЕРМОСКВА — логика лендинга
   Разделы: меню, навигация-скролл, фильтр афиши, форма регистрации,
   индикатор прогресса, кнопка "наверх", фрейм Яндекс Формы
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- год в футере ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===================== МОБИЛЬНОЕ МЕНЮ ===================== */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobileMenu() {
    if (!mobileNav || !burgerBtn) return;
    mobileNav.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Открыть меню');
  }

  function toggleMobileMenu() {
    if (!mobileNav || !burgerBtn) return;
    const isOpen = mobileNav.classList.toggle('is-open');
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
    burgerBtn.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  }

  if (burgerBtn) burgerBtn.addEventListener('click', toggleMobileMenu);

  // закрывать мобильное меню при клике на любую ссылку якоря
  document.querySelectorAll('[data-nav]').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ===================== АКТИВНЫЙ ПУНКТ НАВИГАЦИИ + ПРОГРЕСС ===================== */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[data-nav], .mobile-nav a[data-nav]'));
  const progressFill = document.getElementById('progressFill');

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === `#${id}`);
    });
  }

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    if (progressFill) progressFill.style.width = `${pct}%`;
  }

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ===================== КНОПКА "НАВЕРХ" ===================== */
  const toTopBtn = document.getElementById('toTopBtn');

  function updateToTopVisibility() {
    if (!toTopBtn) return;
    toTopBtn.classList.toggle('is-visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', updateToTopVisibility, { passive: true });
  updateToTopVisibility();

  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===================== ФИЛЬТР АФИШИ (отключён — теперь список) ===================== */
  // Блок афиши переделан в простой список-расписание без плиток и фильтров.

  /* ===================== ВАЛИДАЦИЯ ФОРМЫ РЕГИСТРАЦИИ ===================== */
  const regForm = document.getElementById('regForm');
  const formStatus = document.getElementById('formStatus');

  const PHONE_RE = /^[+0-9()\-\s]{10,18}$/;
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFieldError(fieldName, message) {
    const errorEl = regForm.querySelector(`[data-error-for="${fieldName}"]`);
    const inputEl = regForm.querySelector(`#${fieldName}`);
    if (errorEl) errorEl.textContent = message || '';
    if (inputEl) inputEl.classList.toggle('is-invalid', Boolean(message));
  }

  function validateRegForm() {
    let isValid = true;
    const data = new FormData(regForm);

    const email = (data.get('email') || '').toString().trim();
    if (!EMAIL_RE.test(email)) {
      showFieldError('email', 'Проверьте формат почты');
      isValid = false;
    } else {
      showFieldError('email', '');
    }

    return isValid;
  }

  if (regForm) {
    // снимать ошибку при вводе в конкретное поле
    regForm.querySelectorAll('input, select').forEach((field) => {
      field.addEventListener('input', () => {
        field.classList.remove('is-invalid');
        const errorEl = regForm.querySelector(`[data-error-for="${field.name}"]`);
        if (errorEl) errorEl.textContent = '';
      });
    });

    regForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!validateRegForm()) {
        if (formStatus) {
          formStatus.textContent = 'Пожалуйста, проверьте поля, отмеченные красным.';
          formStatus.className = 'form-status is-error';
        }
        return;
      }

      // ЗАМЕНИТЬ: здесь должна быть реальная отправка данных
      // (на ваш backend, в Google/Яндекс Таблицу или сервис форм).
      // Сейчас форма работает в демо-режиме без реальной отправки.
      console.info('[КиберМосква] Демо-режим формы. Данные не отправлены на сервер:', Object.fromEntries(new FormData(regForm)));

      if (formStatus) {
        formStatus.textContent = 'Готово! Приглашение придёт на указанную почту.';
        formStatus.className = 'form-status is-success';
      }
      regForm.reset();
    });
  }

  /* ===================== ФРЕЙМ ЯНДЕКС ФОРМЫ ===================== */
  const testFrame = document.getElementById('testFrame');
  const testFrameLoading = document.getElementById('testFrameLoading');

  if (testFrame && testFrameLoading) {
    testFrame.addEventListener('load', () => {
      testFrameLoading.style.display = 'none';
    });

    // подстраховка: если событие load не сработает (некоторые блокировщики),
    // скрыть индикатор загрузки через 6 секунд
    window.setTimeout(() => {
      testFrameLoading.style.display = 'none';
    }, 6000);
  }

});
