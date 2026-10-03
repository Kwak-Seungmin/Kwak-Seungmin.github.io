// ---------- About 모션: 순차 등장 딜레이 · 등장 후 정착 · 마우스 기울기 ----------
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const STEP = 0.09;
  const TILT = 4; // 최대 기울기(도)

  /* 프로필 카드 — 사진, 이름, 직함, 위치, 링크, 버튼 순서대로 딜레이 */
  const card = document.querySelector('.profile-card');
  if (card) {
    const seq = card.querySelectorAll('.photo-ring, .profile-name, .profile-role, .profile-loc, .profile-links a, .about-actions .btn');
    seq.forEach((el, i) => el.style.setProperty('--ad', (i * STEP).toFixed(2) + 's'));
    const settleAfter = (seq.length * STEP + 0.9) * 1000;
    new MutationObserver((_, mo) => {
      if (!card.classList.contains('is-in')) return;
      mo.disconnect();
      setTimeout(() => card.classList.add('settled'), settleAfter);
    }).observe(card, { attributes: true, attributeFilter: ['class'] });
  }

  /* 이력 카드 — 카드 안 항목이 차례로 */
  document.querySelectorAll('.cv-card').forEach(c => {
    c.querySelectorAll('.cv-row').forEach((row, i) => row.style.setProperty('--rd', (0.25 + i * 0.12).toFixed(2) + 's'));
  });

  /* 마우스 기울기 — 카드가 커서 쪽으로 살짝 기운다 */
  if (!fine) return;
  document.querySelectorAll('.cv-card, .profile-card').forEach(el => {
    el.addEventListener('mousemove', e => {
      if (!el.classList.contains('is-in')) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.classList.add('tilt');
      el.style.setProperty('--rx', (-py * TILT).toFixed(2) + 'deg');
      el.style.setProperty('--ry', (px * TILT).toFixed(2) + 'deg');
    });
    el.addEventListener('mouseleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      setTimeout(() => el.classList.remove('tilt'), 160);
    });
  });
})();
