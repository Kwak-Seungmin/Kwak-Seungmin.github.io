// ---------- AI Game & Art Pipeline 블록 모션 ----------
// 카드 등장 · 커서 빛 · 흐름 단계 스윕 · 루브릭 · 칩 · 미니 흐름도(그리기 + 흐르는 점) · 게임 정보 전환
(() => {
  const root = document.documentElement;
  const fold = document.getElementById('art-pipeline');
  if (!fold || !root.classList.contains('motion') || !('IntersectionObserver' in window)) return;
  root.classList.add('pm');

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  // 접힌 블록 안의 요소는 펼쳐져 화면에 들어올 때 교차가 잡힌다
  const onceVisible = (els, cb, threshold = 0.2) => {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      cb(en.target);
    }), { threshold });
    els.forEach(el => io.observe(el));
  };
  const stagger = (els, step, base = 0) =>
    els.forEach((el, i) => el.style.setProperty('--pd', (base + i * step).toFixed(2) + 's'));

  /* 칼럼 머리 · 카드 — 칼럼 안에서 순서대로 */
  fold.querySelectorAll('.tool-col').forEach(col => {
    const items = [...col.querySelectorAll('.col-head, .tool-card')];
    stagger(items, 0.12);
    onceVisible(items, el => el.classList.add('pm-in'), 0.08);
  });

  /* 커서를 따라가는 빛 */
  if (fine) {
    fold.querySelectorAll('.tool-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      card.addEventListener('mouseenter', () => card.classList.add('pm-hover'));
      card.addEventListener('mouseleave', () => card.classList.remove('pm-hover'));
    });
  }

  /* 루브릭 · 칩 — 목록 안에서 차례로 */
  const lists = [...fold.querySelectorAll('.rubric, .pipe-fold-body .chips')];
  lists.forEach(list => stagger([...list.children], list.matches('.rubric') ? 0.1 : 0.05));
  onceVisible(lists, el => el.classList.add('pm-in'), 0.3);

  /* 흐름 단계 — 화면에 보이는 동안 한 칸씩 불이 들어온다 */
  fold.querySelectorAll('.flow').forEach(flow => {
    const steps = [...flow.querySelectorAll('span:not(.arw)')];
    const arrows = [...flow.querySelectorAll('.arw')];
    const STEP_MS = 900;
    let i = 0, timer = null;
    const tick = () => {
      steps.forEach((s, k) => s.classList.toggle('pm-lit', k === i));
      arrows.forEach((a, k) => a.classList.toggle('pm-lit', k === i));
      i = (i + 1) % (steps.length + 1); // 마지막 뒤에 한 박자 쉰다
      timer = setTimeout(tick, STEP_MS);
    };
    new IntersectionObserver(([en]) => {
      clearTimeout(timer);
      if (en.isIntersecting) tick();
      else [...steps, ...arrows].forEach(s => s.classList.remove('pm-lit'));
    }, { threshold: 0.5 }).observe(flow);
  });

  /* 미니 흐름도 — 위에서부터 그려지고, 다 그려지면 점이 2D · 재생성 · 3D 경로를 번갈아 흐른다 */
  const mini = fold.querySelector('.mini');
  const svg = mini && mini.querySelector('svg');
  if (svg) {
    const nodes = [...svg.querySelectorAll('.mn')];
    const labels = [...svg.querySelectorAll('.mb, .mwt')];
    const lines = [...svg.querySelectorAll('.mln')];
    const DRAW_SPAN = 1.6; // 맨 위에서 맨 아래까지 그려지는 데 걸리는 시간(초)
    lines.forEach(l => { if (!l.classList.contains('mwarn')) l.setAttribute('pathLength', '1'); });

    // 선: 0 기획→LLM · 1·2 LLM→가이드/시트 · 3·4 →생성 실행 · 5 →AI 피드백 · 6 →업스케일 · 7·8 →스프라이트/3D
    //     9·10 →애니/리토폴 · 11·12 합류 · 13 →엔진 · 14 피드백 루프(재생성)
    const ROUTES = [
      [0, 1, 3, 5, 6, 7, 9, 11, 13],        // 2D
      [0, 1, 3, 5, 14, 3, 5, 6, 8, 10, 12, 13], // AI가 걸러 재생성 후 3D
      [0, 2, 4, 5, 6, 8, 10, 12, 13],       // 3D
    ];
    const SPEED = 0.16; // px/ms
    const GAP_MS = 220; // 노드를 통과하는 시간

    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('r', '3.5');
    dot.setAttribute('class', 'pm-dot');
    svg.appendChild(dot);

    // 선 끝이 닿는 노드 — 화살표 끝점에서 가장 가까운 사각형
    // getBBox 는 접힌 블록 안에서 0 을 돌려주므로 처음 보일 때 잰다
    let rects = [];
    const nodeAt = pt => {
      let best = null, bestD = 14;
      rects.forEach(({ n, b }) => {
        const dx = Math.max(b.x - pt.x, 0, pt.x - (b.x + b.width));
        const dy = Math.max(b.y - pt.y, 0, pt.y - (b.y + b.height));
        const d = Math.hypot(dx, dy);
        if (d < bestD) { bestD = d; best = n; }
      });
      return best;
    };
    const hit = (n, warn) => {
      if (!n) return;
      const cls = warn ? 'pm-hit-warn' : 'pm-hit';
      n.classList.add('pm-hit', cls);
      setTimeout(() => n.classList.remove('pm-hit', 'pm-hit-warn'), 650);
    };

    let routeIdx = 0, raf = null, running = false, visible = false;
    const runRoute = () => {
      if (!running) return;
      const route = ROUTES[routeIdx];
      routeIdx = (routeIdx + 1) % ROUTES.length;
      const segs = route.map(k => lines[k]).filter(Boolean).map(p => ({ p, len: p.getTotalLength() }));
      hit(nodeAt(segs[0].p.getPointAtLength(0)));
      let s = 0, t0 = performance.now();
      const step = now => {
        if (!running) return;
        const seg = segs[s];
        const warn = seg.p.classList.contains('mwarn');
        const dur = seg.len / SPEED;
        const el = now - t0;
        dot.classList.toggle('is-warn', warn);
        if (el < dur) {
          const pt = seg.p.getPointAtLength(seg.len * (el / dur));
          dot.setAttribute('cx', pt.x);
          dot.setAttribute('cy', pt.y);
          dot.style.opacity = 1;
        } else if (el < dur + GAP_MS) {
          if (dot.style.opacity !== '0') hit(nodeAt(seg.p.getPointAtLength(seg.len)), warn);
          dot.style.opacity = 0;
        } else {
          s++; t0 = now;
          if (s >= segs.length) { raf = setTimeout(runRoute, 700); return; }
        }
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const start = () => {
      if (running || !visible || !mini.classList.contains('pm-flowing')) return;
      running = true;
      runRoute();
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf); clearTimeout(raf);
      dot.style.opacity = 0;
    };

    onceVisible([mini], () => {
      rects = nodes.map(n => ({ n, b: n.querySelector('rect').getBBox() }));
      const H = svg.viewBox.baseVal.height || 556;
      [...nodes, ...labels, ...lines].forEach(el =>
        el.style.setProperty('--pd', (el.getBBox().y / H * DRAW_SPAN).toFixed(2) + 's'));
      void mini.offsetWidth;
      mini.classList.add('pm-in');
      setTimeout(() => { mini.classList.add('pm-flowing'); start(); }, (DRAW_SPAN + 0.6) * 1000);
    }, 0.25);
    new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0.15 }).observe(mini);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  }

  /* 게임 쇼케이스 — 게임이 바뀌면 장르 · 제목 · 설명 · 스펙이 차례로 다시 나타난다 */
  const info = fold.querySelector('.gj-info');
  const spec = document.getElementById('gjSpec');
  if (info && spec) {
    new MutationObserver(() => {
      const parts = [...info.querySelectorAll('.gj-badge, h4, .gj-desc p, .gj-spec > div')];
      stagger(parts, 0.04);
      info.classList.remove('pm-swap');
      void info.offsetWidth;
      info.classList.add('pm-swap');
    }).observe(spec, { childList: true });
  }
})();
