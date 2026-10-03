// ---------- 아트 파이프라인 구조도: 단계 탭 + 흐름 애니메이션 ----------
// 단계마다 해당 노드를 밝히고, 연결선에 흐르는 점선과 이동하는 점을 보낸다. 탭은 진행 바가 차면 다음 단계로.
(() => {
  const fig = document.querySelector('.arch');
  const svg = fig && fig.querySelector('svg');
  if (!svg) return;
  const motion = document.documentElement.classList.contains('motion');
  const STEP_MS = 3200;
  const NS = 'http://www.w3.org/2000/svg';

  const nodes = [...svg.querySelectorAll('.nd')];
  const edges = [...svg.querySelectorAll('path.ln')];
  // 노드: 0 GDD · 1 art-bible · 2 Spec · 3 Concept · 4 2D · 5 Pixel · 6 런타임 에셋 · 7 엔진
  // 선:   0·1 입력 → 2 합류 → 3 스펙→컨셉 · 4 컨셉→2D · 5 2D→픽셀 · 6 픽셀→출력 · 7 2D→출력(우회) · 8 출력→엔진 · 9 중단
  const STEPS = [
    { tab: 'Input', nodes: [0, 1], edges: [0, 1, 2], text: '게임 기획서와 아트 바이블(에셋 스펙 · 품질 기준)을 입력으로 받습니다.' },
    { tab: 'Spec Check', nodes: [2], edges: [9], text: '에셋 스펙을 확인합니다. 스펙이 비어 있으면 추론하지 않고 기획서로 되돌려 작업을 멈춥니다.' },
    { tab: 'Concept', nodes: [3], edges: [3], text: '스펙을 통과하면 컨셉 아트를 만듭니다.' },
    { tab: '2D Asset', nodes: [4], edges: [4], text: '컨셉이 확정되면 2D 에셋과 프레임을 만듭니다.' },
    { tab: 'Pixel', nodes: [5], edges: [5, 6], text: 'GDD에 픽셀 아트로 명시된 경우에만 픽셀로 변환합니다. 그 외에는 2D 에셋을 그대로 씁니다.' },
    { tab: 'Output', nodes: [6, 7], edges: [7, 8], text: '규격을 맞춘 런타임 에셋(스프라이트 · 타일셋 · UI)이 변환 없이 그대로 엔진에 올라갑니다.' },
  ];

  /* 단계 탭 + 설명 */
  const bar = document.createElement('div');
  bar.className = 'arch-steps';
  bar.innerHTML = `<div class="as-tabs" role="tablist">${STEPS.map((s, i) =>
    `<button type="button" role="tab" class="as-tab" data-i="${i}"><span class="as-num">0${i + 1}</span>${s.tab}<span class="as-bar"><i></i></span></button>`).join('')}</div>
    <p class="as-text kr" aria-live="polite"></p>`;
  const cap = fig.querySelector('figcaption');
  fig.insertBefore(bar, cap);
  const tabs = [...bar.querySelectorAll('.as-tab')];
  const text = bar.querySelector('.as-text');

  /* 이동하는 점 */
  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('r', '4');
  dot.setAttribute('class', 'af-dot');
  svg.appendChild(dot);

  let cur = 0, timer = null, raf = null, t0 = 0, inView = false, userPaused = false;

  const runDot = idxs => {
    cancelAnimationFrame(raf);
    const paths = idxs.map(i => edges[i]).filter(Boolean);
    if (!motion || !paths.length) { dot.style.opacity = 0; return; }
    const lens = paths.map(p => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    const start = performance.now(), DUR = Math.min(STEP_MS - 400, 900 + total * 2.2);
    const tick = now => {
      let d = Math.min(1, (now - start) / DUR) * total;
      let k = 0;
      while (k < lens.length - 1 && d > lens[k]) { d -= lens[k]; k++; }
      const pt = paths[k].getPointAtLength(Math.min(d, lens[k]));
      dot.setAttribute('cx', pt.x);
      dot.setAttribute('cy', pt.y);
      dot.style.opacity = (now - start) / DUR < 1 ? 1 : 0;
      if (now - start < DUR) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  const show = i => {
    cur = (i + STEPS.length) % STEPS.length;
    const s = STEPS[cur];
    svg.classList.add('af-on');
    nodes.forEach((n, k) => n.classList.toggle('af-active', s.nodes.includes(k)));
    edges.forEach((e, k) => e.classList.toggle('af-flow', s.edges.includes(k)));
    tabs.forEach((t, k) => {
      t.classList.toggle('is-on', k === cur);
      t.classList.toggle('is-done', k < cur);
      t.setAttribute('aria-selected', String(k === cur));
    });
    text.textContent = s.text;
    text.classList.remove('as-swap'); void text.offsetWidth; text.classList.add('as-swap');
    runDot(s.edges);
    restartBar();
  };

  const restartBar = () => {
    clearTimeout(timer);
    const fill = tabs[cur].querySelector('.as-bar i');
    tabs.forEach(t => { const f = t.querySelector('.as-bar i'); f.style.transition = 'none'; f.style.transform = 'scaleX(0)'; });
    if (!motion || userPaused || !inView) { fill.style.transform = 'scaleX(1)'; return; }
    void fill.offsetWidth;
    fill.style.transition = `transform ${STEP_MS}ms linear`;
    fill.style.transform = 'scaleX(1)';
    timer = setTimeout(() => show(cur + 1), STEP_MS);
  };

  tabs.forEach((t, i) => t.addEventListener('click', () => { userPaused = true; show(i); }));
  bar.addEventListener('mouseleave', () => { if (userPaused) { userPaused = false; restartBar(); } });

  new IntersectionObserver(es => es.forEach(en => {
    inView = en.isIntersecting;
    if (inView) show(cur); else { clearTimeout(timer); cancelAnimationFrame(raf); }
  }), { threshold: 0.35 }).observe(fig);
  show(0);
})();
