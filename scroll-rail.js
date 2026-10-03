// ---------- 오른쪽 스크롤 레일 · Experience 한국어 토글 ----------
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

  /* 스크롤 레일: 진행률 + 섹션 점(클릭 시 이동) */
  const sections = [...document.querySelectorAll('section[id]')].filter(s => s.id !== 'intro');
  if (!sections.length) return;
  const rail = document.createElement('nav');
  rail.className = 'scroll-rail';
  rail.setAttribute('aria-label', '섹션 진행');
  rail.innerHTML = '<span class="sr-track"></span><span class="sr-fill"></span><span class="sr-head"></span>';
  const navName = id => {
    const a = document.querySelector(`.nav-menu a[href="#${id}"]`);
    return a ? a.textContent.trim() : id;
  };
  const dots = sections.map(sec => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sr-dot';
    b.setAttribute('aria-label', navName(sec.id));
    b.innerHTML = `<span class="sr-label">${navName(sec.id)}</span>`;
    b.addEventListener('click', () => sec.scrollIntoView({ behavior: 'smooth' }));
    rail.appendChild(b);
    return b;
  });
  document.body.appendChild(rail);

  let cur = -1;
  const layout = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    sections.forEach((sec, i) => { dots[i].style.top = (Math.min(1, sec.offsetTop / max) * 100) + '%'; });
  };
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const p = Math.min(1, Math.max(0, scrollY / max));
    rail.style.setProperty('--p', p.toFixed(4));
    rail.classList.toggle('is-on', scrollY > innerHeight * 0.5);
    let idx = -1;
    sections.forEach((sec, i) => { if (sec.offsetTop - innerHeight * 0.4 <= scrollY) idx = i; });
    dots.forEach((d, i) => { d.classList.toggle('is-past', i < idx); d.classList.toggle('is-cur', i === idx); });
    if (idx !== cur && idx >= 0) {
      cur = idx;
      const lab = dots[idx].querySelector('.sr-label');
      lab.classList.add('flash');
      clearTimeout(lab._t);
      lab._t = setTimeout(() => lab.classList.remove('flash'), 1400);
    }
  };
  layout();
  update();
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', () => { layout(); update(); });
  // 접힌 영역을 펼치면 문서 길이가 바뀌므로 점 위치를 다시 계산
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => setTimeout(() => { layout(); update(); }, 50)));
  if ('ResizeObserver' in window) new ResizeObserver(() => { layout(); update(); }).observe(document.body);
})();
