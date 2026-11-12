// One playback owner: only visible videos compete for network and decoding.
(() => {
  const videos = [...document.querySelectorAll('video:not(.m-video)')];
  const wanted = new Set();
  const manuallyPaused = new WeakSet();
  const mobile = matchMedia('(max-width: 760px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.querySelector('#modal');
  let manualVideo = null;
  let frame = 0;

  const visibility = video => {
    if (video.closest('details:not([open])')) return 0;
    const box = video.getBoundingClientRect();
    if (!box.width || !box.height) return 0;
    const width = Math.max(0, Math.min(box.right, innerWidth) - Math.max(box.left, 0));
    const height = Math.max(0, Math.min(box.bottom, innerHeight) - Math.max(box.top, 0));
    return width * height / (box.width * box.height);
  };
  const pause = video => {
    wanted.delete(video);
    if (!video.paused) video.pause();
  };
  const sync = () => {
    frame = 0;
    const blocked = document.hidden || dialog?.classList.contains('open');
    const automatic = !reduced.matches && !navigator.connection?.saveData;
    const visible = videos.filter(video => visibility(video) >= 0.45);
    if (manualVideo && !visible.includes(manualVideo)) manualVideo = null;
    const candidates = blocked ? [] : visible.filter(video =>
      video === manualVideo || (automatic && video.muted && !manuallyPaused.has(video) && !(mobile.matches && video.closest('#intro')))
    );
    candidates.sort((a, b) => {
      if (a === manualVideo) return -1;
      if (b === manualVideo) return 1;
      const distance = v => Math.abs(v.getBoundingClientRect().top + v.getBoundingClientRect().height / 2 - innerHeight / 2);
      return distance(a) - distance(b);
    });
    const selected = new Set(candidates.slice(0, mobile.matches ? 1 : 2));
    videos.forEach(video => {
      if (!selected.has(video)) return pause(video);
      if (wanted.has(video)) return;
      wanted.add(video);
      video.play().catch(() => wanted.delete(video));
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(sync); };
  videos.forEach(video => {
    video.preload = 'none';
    video.removeAttribute('autoplay');
    video.pause();
    video.addEventListener('play', () => {
      if (!wanted.has(video)) {
        manualVideo = video;
        manuallyPaused.delete(video);
        schedule();
      }
    });
    video.addEventListener('pause', () => {
      if (wanted.has(video)) {
        wanted.delete(video);
        manuallyPaused.add(video);
        if (manualVideo === video) manualVideo = null;
      }
    });
  });
  const observer = new IntersectionObserver(schedule, { threshold: [0, 0.45, 0.8, 1] });
  videos.forEach(video => observer.observe(video));
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', schedule));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) document.querySelector('.m-video')?.pause();
    schedule();
  });
  if (dialog) new MutationObserver(schedule).observe(dialog, { attributes: true, attributeFilter: ['class'] });
  schedule();
})();
