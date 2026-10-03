// ---------- 마우스를 따라오는 작은 파란 반딧불 ----------
// 마우스가 움직이면 작은 빛 알갱이가 생겨 천천히 떠다니며 깜빡이다 사라진다. 마우스 기기 + 모션 허용일 때만.
(() => {
  const root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const MAX = 40;          // 화면에 동시에 있는 알갱이 수 상한
  const SPAWN_DIST = 14;   // 이 거리(px)만큼 움직일 때마다 1개 생성
  const LIFE = [900, 1600]; // 수명(ms)
  const SIZE = [1.2, 2.2];  // 반지름(px) — 작게
  const COLORS = ['10,160,210', '127,212,245', '90,190,240'];

  const cv = document.createElement('canvas');
  cv.className = 'firefly-layer';
  cv.setAttribute('aria-hidden', 'true');
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
  };
  resize();
  addEventListener('resize', resize);

  const rnd = (a, b) => a + Math.random() * (b - a);
  let flies = [];
  let last = null;
  let running = false;

  const spawn = (x, y) => {
    if (flies.length >= MAX) flies = flies.slice(1);
    flies = [...flies, {
      x: x + rnd(-6, 6), y: y + rnd(-6, 6),
      vx: rnd(-0.25, 0.25), vy: rnd(-0.45, -0.05),
      r: rnd(SIZE[0], SIZE[1]), born: performance.now(), life: rnd(LIFE[0], LIFE[1]),
      phase: rnd(0, Math.PI * 2), c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }];
    if (!running) { running = true; requestAnimationFrame(tick); }
  };

  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (!last) { last = { x: e.clientX, y: e.clientY }; return; }
    const d = Math.hypot(e.clientX - last.x, e.clientY - last.y);
    if (d < SPAWN_DIST) return;
    last = { x: e.clientX, y: e.clientY };
    spawn(e.clientX, e.clientY);
  }, { passive: true });

  function tick(now) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    flies = flies.filter(f => now - f.born < f.life);
    flies.forEach(f => {
      const t = (now - f.born) / f.life;
      f.x += f.vx + Math.sin(now / 420 + f.phase) * 0.18; // 살랑이는 반딧불 움직임
      f.y += f.vy;
      const flicker = 0.65 + 0.35 * Math.sin(now / 110 + f.phase);
      const a = Math.sin(Math.PI * t) * flicker;            // 서서히 켜졌다 꺼진다
      ctx.fillStyle = `rgba(${f.c},${(0.95 * a).toFixed(3)})`; // 글로우 없이 작은 점만
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
    });
    if (flies.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
})();
