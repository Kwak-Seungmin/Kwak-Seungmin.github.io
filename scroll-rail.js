// ---------- Experience 한국어 토글 ----------
(() => {
  /* Experience 카드: 버튼으로 영어 ↔ 한국어 */
  document.querySelectorAll('.tl-card').forEach(card => {
    const btn = card.querySelector('.tl-lang');
    if (!btn) return;
    const parts = [...card.querySelectorAll('[data-ko]')];
    parts.forEach(el => { el.dataset.en = el.innerHTML; });
    btn.addEventListener('click', () => {
      const toKo = btn.getAttribute('aria-pressed') !== 'true';
      parts.forEach(el => {
        if (toKo) el.textContent = el.dataset.ko; else el.innerHTML = el.dataset.en;
        el.classList.toggle('is-ko', toKo);
        el.classList.remove('lang-swap'); void el.offsetWidth; el.classList.add('lang-swap');
      });
      btn.setAttribute('aria-pressed', String(toKo));
      btn.textContent = toKo ? 'English' : '한국어';
    });
  });

})();
