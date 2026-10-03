// ---------- 모션: 스크롤 유도 아이콘 · 스크롤 리빌 ----------
// html.motion 은 <head> 의 인라인 스크립트가 붙인다 (동작 줄이기 설정이면 붙지 않음).
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  // 스플래시는 세션당 한 번 — 끝나면 클래스를 떼어 이후 렌더에 영향이 없게 한다
  if (root.classList.contains('splash')) {
    try { sessionStorage.setItem('ksm-splash', '1'); } catch (e) { /* 저장 불가 환경은 무시 */ }
    setTimeout(() => root.classList.remove('splash'), 2300);
  }

  // 히어로 하단 스크롤 유도 아이콘 — 조금이라도 스크롤하면 사라진다
  const intro = document.getElementById('intro');
  if (intro) {
    const cue = document.createElement('span');
    cue.className = 'scroll-cue';
    cue.setAttribute('aria-hidden', 'true');
    intro.appendChild(cue);
    const hideCue = () => cue.classList.toggle('gone', window.scrollY > 40);
    window.addEventListener('scroll', hideCue, { passive: true });
  }

  // 스크롤 리빌 대상 — 같은 부모 안의 형제끼리는 순서대로 조금씩 늦게 등장
  const GROUPS = [
    '.section-header h2', '.section-header p', '.section-eyebrow',
    '#portfolio-flters', '.portfolio-item',
    '.exp-row', '.gj', '.paper', '.pipe-fold',
    '.about-photo', '.cv-row', '.about-actions',
    '.tool-header', '.tool-item',
    '.contact-links',
  ];
  const STEP = 0.07;
  const MAX_DELAY = 0.42;
  const targets = [];
  GROUPS.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.closest('.modal-back')) return;
      const siblings = [...el.parentElement.children].filter(s => s.matches(sel));
      const order = siblings.indexOf(el);
      el.style.setProperty('--d', Math.min(order * STEP, MAX_DELAY) + 's');
      el.classList.add('rv');
      targets.push(el);
    });
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-in'));
    return;
  }
  // clip-path 로 완전히 가린 요소(섹션 제목)는 교차 감지가 안 되므로 부모를 대신 관찰한다
  const watched = new Map();
  targets.forEach(el => {
    const probe = el.matches('.section-header h2') ? el.parentElement : el;
    watched.set(probe, [...(watched.get(probe) || []), el]);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      watched.get(entry.target).forEach(el => el.classList.add('is-in'));
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  watched.forEach((_, probe) => io.observe(probe));

  // 접힌 카드 안에서 펼쳐진 요소는 바로 보이게 (관찰 시점에 숨어 있었으므로)
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) d.querySelectorAll('.rv').forEach(el => el.classList.add('is-in'));
  }));
})();
