// ---------- 모션 추가: 커서 · 마그넷 · 키워드 띠 · 와이프 · 카운트업 · 영상 자동재생 · 헤더 숨김 · 맨 위로 링 · 스크램블 ----------
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  /* 커서 링 — 링은 부드럽게 따라오고 점은 즉시. 링크·미디어 위에서 모양이 바뀐다 */
  if (fine) {
    const ring = document.createElement('div');
    const dot = document.createElement('div');
    ring.className = 'cursor-ring';
    dot.className = 'cursor-dot';
    document.body.append(ring, dot);
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      root.classList.add('has-cursor');
    }, { passive: true });
    document.addEventListener('mouseleave', () => root.classList.remove('has-cursor'));
    window.addEventListener('mousedown', () => ring.classList.add('is-down'));
    window.addEventListener('mouseup', () => ring.classList.remove('is-down'));
    const loop = () => {
      rx = lerp(rx, mx, 0.18); ry = lerp(ry, my, 0.18);
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    };
    loop();
    document.addEventListener('mouseover', e => {
      const media = e.target.closest('.portfolio-item, .rnd-media figure, .pg-grid figure');
      const link = !media && e.target.closest('a, button, summary, [role="button"], #portfolio-flters li');
      ring.classList.toggle('is-media', !!media);
      ring.classList.toggle('is-link', !!link);
    });
  }

  /* 마그넷 버튼 — 커서 쪽으로 살짝 끌려온다 */
  if (fine) {
    document.querySelectorAll('.btn, .profile-links a, .back-top').forEach(el => {
      const STRENGTH = 0.28;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * STRENGTH}px, ${dy * STRENGTH}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* 버튼 클릭 물결 */
  document.querySelectorAll('.btn').forEach(btn => btn.addEventListener('click', e => {
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    btn.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }));

  /* 히어로 이름을 글자 단위로 쪼갠다 (호버 시 하나씩 튀어오름) */
  const h1 = document.querySelector('#intro h1');
  if (h1) {
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach(c => {
            if (c === ' ') { frag.append(' '); return; }
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = c;
            frag.append(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(h1);
  }

  /* 키워드 띠 — Portfolio 와 Experience 사이, 스크롤 속도만큼 빨라지고 방향도 따라간다 */
  const exp = document.getElementById('experience');
  if (exp) {
    const words2 = ['Technical Artist', 'AI Pipeline', 'Unreal Engine', 'Niagara', 'PCG', 'World Model', 'A2Z GameSpec-Bench', 'Sequencer', 'Python'];
    const band = document.createElement('div');
    band.className = 'marquee';
    band.setAttribute('aria-hidden', 'true');
    const html = words2.map((w, i) => (i % 2 ? `<b>${w}</b>` : w) + '<i></i>').join('');
    band.innerHTML = `<div class="marquee-track"><span>${html}</span><span>${html}</span></div>`;
    exp.parentNode.insertBefore(band, exp);
    const track = band.firstElementChild;
    let x = 0, lastY = window.scrollY, vel = 0, dir = -1;
    const run = () => {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? -1 : 1;
      vel = lerp(vel, Math.min(Math.abs(dy), 60), 0.1);
      const half = track.scrollWidth / 2;
      x += dir * (0.6 + vel * 0.25);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(run);
    };
    run();
  }

  /* 헤더 숨김 + 맨 위로 버튼 진행 링 */
  const header = document.getElementById('header');
  const back = document.querySelector('.back-top');
  if (back) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'ring');
    svg.setAttribute('viewBox', '0 0 52 52');
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', '26'); c.setAttribute('cy', '26'); c.setAttribute('r', '24');
    svg.appendChild(c);
    back.style.setProperty('--len', (2 * Math.PI * 24).toFixed(1));
    back.appendChild(svg);
  }
  let prevY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const menuOpen = header && header.classList.contains('menu-open');
    if (header && !menuOpen) header.classList.toggle('hide-up', y > prevY && y > 400);
    prevY = y;
    if (back) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      back.style.setProperty('--p', max > 0 ? (y / max).toFixed(3) : 0);
    }
  }, { passive: true });

  /* 미디어 와이프 — 화면에 들어오면 아래에서 위로 열린다 */
  const wipeTargets = document.querySelectorAll('.rnd-media figure, .pg-grid figure, .paper-header, .paper-teaser, .gj-stage');
  wipeTargets.forEach(el => {
    const sib = [...el.parentElement.children].indexOf(el);
    el.style.setProperty('--wd', Math.min(sib * 0.08, 0.4) + 's');
    el.classList.add('wipe');
  });
  // 완전히 가려진(clip-path 100%) 요소는 교차 감지가 안 되므로 부모를 관찰해 자식을 연다
  const wipeGroups = new Map();
  wipeTargets.forEach(el => wipeGroups.set(el.parentElement, [...(wipeGroups.get(el.parentElement) || []), el]));
  const wipeIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    wipeGroups.get(en.target).forEach(el => el.classList.add('is-in'));
    wipeIO.unobserve(en.target);
  }), { threshold: 0.12 });
  wipeGroups.forEach((_, parent) => wipeIO.observe(parent));
  document.querySelectorAll('details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) d.querySelectorAll('.wipe').forEach(el => setTimeout(() => el.classList.add('is-in'), 120));
  }));

  /* 숫자 카운트업 — 논문 표·노트의 숫자 */
  const counters = [];
  document.querySelectorAll('.paper-table td, .paper-block p b').forEach(el => {
    const m = el.textContent.trim().match(/^([\d,]+(?:\.\d+)?)(%?)/);
    if (!m) return;
    const target = parseFloat(m[1].replace(/,/g, ''));
    if (!isFinite(target) || target < 2) return;
    const decimals = (m[1].split('.')[1] || '').length;
    const comma = m[1].includes(',');
    const rest = el.textContent.trim().slice(m[0].length);
    counters.push({ el, target, decimals, comma, suffix: m[2] + rest });
  });
  const fmt = (v, c) => {
    const s = v.toFixed(c.decimals);
    return (c.comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: c.decimals }) : s) + c.suffix;
  };
  const countIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const c = counters.find(k => k.el === en.target);
    countIO.unobserve(en.target);
    const t0 = performance.now(), DUR = 1400;
    const tick = now => {
      const k = Math.min(1, (now - t0) / DUR);
      const e = 1 - Math.pow(1 - k, 3);
      c.el.textContent = fmt(c.target * e, c);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: 0.6 });
  counters.forEach(c => { c.el.classList.add('count'); countIO.observe(c.el); });

  /* 무음 영상은 화면에 보일 때만 재생, 벗어나면 정지 */
  const vidIO = new IntersectionObserver(entries => entries.forEach(en => {
    const v = en.target;
    if (en.isIntersecting) { if (v.muted) v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.45 });
  // 영상도 와이프로 가려질 수 있으므로 감싸는 figure/stage 를 관찰한다
  const vidMap = new Map();
  document.querySelectorAll('#gjVideo, .rnd-media video').forEach(v => {
    v.preload = 'metadata';
    const box = v.closest('.rnd-media') || v.closest('.gj-stage')?.parentElement || v.parentElement;
    vidMap.set(box, [...(vidMap.get(box) || []), v]);
  });
  const vidIO2 = new IntersectionObserver(entries => entries.forEach(en => {
    vidMap.get(en.target).forEach(v => {
      if (en.isIntersecting) { if (v.muted) v.play().catch(() => {}); } else v.pause();
    });
  }), { threshold: 0.35 });
  vidMap.forEach((_, box) => vidIO2.observe(box));

  /* 글자 스크램블 — 메뉴 호버, 섹션 아이브로우 등장 */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·_';
  const scramble = el => {
    if (el.dataset.scrambling) return;
    const final = el.dataset.text || el.textContent;
    el.dataset.text = final;
    el.dataset.scrambling = '1';
    let frame = 0;
    const total = 16;
    const step = () => {
      frame++;
      el.textContent = [...final].map((ch, i) => {
        if (ch === ' ' || frame / total > i / final.length) return ch;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');
      if (frame < total) requestAnimationFrame(step);
      else { el.textContent = final; delete el.dataset.scrambling; }
    };
    step();
  };
  if (fine) document.querySelectorAll('.nav-menu a').forEach(a => a.addEventListener('mouseenter', () => scramble(a)));
  const eyeIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { scramble(en.target); eyeIO.unobserve(en.target); }
  }), { threshold: 0.8 });
  document.querySelectorAll('.section-eyebrow').forEach(el => eyeIO.observe(el));

  /* 포트폴리오 필터 — 바뀔 때 카드가 차례로 다시 나타난다 */
  document.querySelectorAll('#portfolio-flters li').forEach(li => li.addEventListener('click', () => {
    requestAnimationFrame(() => {
      let n = 0;
      document.querySelectorAll('.portfolio-item').forEach(item => {
        if (item.hidden) return;
        item.classList.remove('filter-pop');
        void item.offsetWidth;
        item.style.setProperty('--fd', (n++ * 0.05) + 's');
        item.classList.add('filter-pop');
      });
    });
  }));
})();
