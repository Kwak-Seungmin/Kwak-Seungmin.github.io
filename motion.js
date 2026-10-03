// ---------- 모션: 스크롤 유도 아이콘 · 스크롤 리빌 ----------
// html.motion 은 <head> 의 인라인 스크립트가 붙인다 (동작 줄이기 설정이면 붙지 않음).
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;

  // 스플래시는 세션당 한 번 — 끝나면 클래스를 떼어 이후 렌더에 영향이 없게 한다
  if (root.classList.contains('splash')) {
    try { sessionStorage.setItem('ksm-splash', '1'); } catch (e) { /* 저장 불가 환경은 무시 */ }
    setTimeout(() => {
      root.classList.remove('splash');
      const el = document.querySelector('.splash-screen');
      if (el) el.remove();
    }, 3100);
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

  // 상단 스크롤 진행 바 + 히어로 영상 패럴랙스 (한 프레임에 한 번만 계산)
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  const heroVideo = intro && intro.querySelector('.video');
  const timeline = document.querySelector('.tl');
  const tlItems = timeline ? [...timeline.querySelectorAll('.tl-item')] : [];
  // 항목마다 세로 위치(0~1) — 점·날짜 색이 하늘색에서 초록으로 변한다
  tlItems.forEach((item, i) => item.style.setProperty('--pos', (tlItems.length > 1 ? i / (tlItems.length - 1) : 0).toFixed(3)));
  let ticking = false;
  const onScrollFrame = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    // 타임라인 가운데 선 — 화면 가운데가 지나간 만큼 위에서부터 그려진다
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const mark = window.innerHeight * 0.6;
      const p = (mark - r.top) / r.height;
      timeline.style.setProperty('--tl-progress', Math.max(0, Math.min(1, p)).toFixed(3));
      // 선 끝(화면 60% 지점)에 가장 가까운 항목을 강조
      let best = null, bestDist = Infinity;
      tlItems.forEach(item => {
        const d = Math.abs(item.getBoundingClientRect().top + 30 - mark);
        if (d < bestDist) { bestDist = d; best = item; }
      });
      tlItems.forEach(item => item.classList.toggle('is-active', item === best && bestDist < window.innerHeight * 0.35));
      // 선 끝의 동그라미(헤드)가 항목의 점에 닿으면 열고, 위로 되돌아가면 닫는다
      const headY = r.top + Math.max(0, Math.min(1, p)) * r.height;
      tlItems.forEach(item => {
        const dot = item.querySelector('.tl-dot').getBoundingClientRect();
        item.classList.toggle('is-open', dot.top + dot.height / 2 <= headY + 2);
      });
    }
    if (heroVideo && window.scrollY < window.innerHeight) {
      heroVideo.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.04)`;
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }, { passive: true });
  onScrollFrame();

  // 포트폴리오 카드 3D 틸트 + 커서를 따라가는 빛 — 마우스가 있는 기기에서만
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const MAX_TILT = 6;
    document.querySelectorAll('.portfolio-item').forEach(card => {
      const glare = document.createElement('span');
      glare.className = 'glare';
      card.appendChild(glare);
      // 등장 순서용 지연(--d)이 틸트에 걸리지 않도록 첫 진입부터 지연 없는 전환으로
      card.addEventListener('mouseenter', () => card.classList.add('tilt-ready'));
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.classList.add('tilting');
        card.style.transform = `rotateY(${(px - 0.5) * MAX_TILT * 2}deg) rotateX(${(0.5 - py) * MAX_TILT * 2}deg)`;
        card.style.setProperty('--gx', `${px * 100}%`);
        card.style.setProperty('--gy', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('tilting');
        card.style.transform = '';
      });
    });
  }

  // 스크롤 리빌 대상 — 같은 부모 안의 형제끼리는 순서대로 조금씩 늦게 등장
  const GROUPS = [
    '.section-header h2', '.section-header p', '.section-eyebrow',
    '#portfolio-flters', '.portfolio-item',
    '.tl-year', '.gj', '.paper', '.pipe-fold', '.fx-notes li',
    '.profile-card', '.cv-card',
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
      // 타임라인은 스크롤 위치대로 하나씩 나오므로 형제 순서 지연을 두지 않는다
      const delay = el.matches('.tl-year, .tl-item') ? 0 : Math.min(order * STEP, MAX_DELAY);
      el.style.setProperty('--d', delay + 's');
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
