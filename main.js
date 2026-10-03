// ---------- 헤더 스크롤 상태 + 맨 위로 버튼 ----------
const header = document.getElementById('header');
const backTop = document.querySelector('.back-top');

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 80);
  backTop.classList.toggle('show', y > 400);

  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 140 && rect.bottom > 140) current = sec.id;
  });
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- 모바일 메뉴 ----------
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

const setMenu = (open) => {
  header.classList.toggle('menu-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
};
navToggle.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', (e) => { if (!header.contains(e.target)) setMenu(false); });

// ---------- 논문 카드: 펼쳐져 있고 화면에 보일 때만 티저 영상 재생 ----------
const paper = document.getElementById('paper');
const paperVideo = paper && paper.querySelector('.paper-video');
if (paperVideo) {
  let inView = false;
  const sync = () => {
    if (paper.open && inView) paperVideo.play().catch(() => {});
    else paperVideo.pause();
  };
  new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0.4 })
    .observe(paperVideo);
  paper.addEventListener('toggle', sync);
}

// ---------- 인트로 영상: 모바일에서는 포스터만 ----------
const heroVideo = document.querySelector('#intro .video');
if (heroVideo && window.matchMedia('(min-width:761px)').matches) {
  heroVideo.src = heroVideo.dataset.src;
}

// ---------- 인트로 직함 타이핑 — 'Artist' 는 고정, 앞 단어만 번갈아 쓰고 지운다 ----------
const TITLES = ['Technical', 'AI'];
const TYPE_MS = 90;
const ERASE_MS = 45;
const HOLD_MS = 2200;
const typedEl = document.getElementById('typed');
let titleIndex = 0;
let charIndex = 0;
let erasing = false;

const tick = () => {
  const title = TITLES[titleIndex];
  if (!erasing) {
    charIndex += 1;
    typedEl.textContent = title.slice(0, charIndex);
    if (charIndex >= title.length) {
      erasing = true;
      setTimeout(tick, HOLD_MS);
      return;
    }
    setTimeout(tick, TYPE_MS);
    return;
  }
  charIndex -= 1;
  typedEl.textContent = title.slice(0, charIndex);
  if (charIndex <= 0) {
    erasing = false;
    titleIndex = (titleIndex + 1) % TITLES.length;
  }
  setTimeout(tick, ERASE_MS);
};
tick();

// ---------- 포트폴리오 필터 ----------
const filterItems = document.querySelectorAll('#portfolio-flters li');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterItems.forEach(li => {
  li.addEventListener('click', () => {
    const filter = li.dataset.filter;
    filterItems.forEach(el => el.classList.toggle('filter-active', el === li));
    portfolioItems.forEach(item => {
      const cats = (item.dataset.cat || '').split(' ');
      item.hidden = filter !== 'all' && !cats.includes(filter);
    });
  });
});

// ---------- 프로젝트 상세 모달 (미디어 슬라이더) ----------
const modal = document.getElementById('modal');
const mHero = modal.querySelector('.m-hero');
const mVideo = modal.querySelector('.m-video');
const mYt = modal.querySelector('.m-yt');
const mLinks = modal.querySelector('.m-links');
const mCat = modal.querySelector('.m-cat');
const mTitle = modal.querySelector('h3');
const mMeta = modal.querySelector('.m-meta');
const mLead = modal.querySelector('.m-lead');
const mText = modal.querySelector('.m-text');
const mThumbs = modal.querySelector('.m-thumbs');
const mCaption = modal.querySelector('.m-caption');
const mCounter = modal.querySelector('.m-counter');
const mPrev = modal.querySelector('.m-prev');
const mNext = modal.querySelector('.m-next');

let slides = [];
let slideIndex = 0;

// 유튜브 iframe 을 비워 재생을 멈춘다
const stopYoutube = () => {
  mYt.classList.remove('show');
  mYt.removeAttribute('src');
};

// 한 장씩 보여준다 — 영상이면 플레이어, 유튜브면 iframe, 이미지면 <img>
const showSlide = (i, autoplay = false) => {
  if (!slides.length) return;
  slideIndex = (i + slides.length) % slides.length;
  const s = slides[slideIndex];

  if (s.type === 'youtube') {
    mVideo.pause();
    mVideo.classList.remove('show');
    mVideo.removeAttribute('src');
    mHero.classList.add('hide');
    mHero.removeAttribute('src');
    mYt.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(s.id)}?rel=0&playsinline=1${autoplay ? '&autoplay=1' : ''}`;
    mYt.classList.add('show');
  } else if (s.type === 'video') {
    stopYoutube();
    mVideo.src = s.src;
    if (s.poster) mVideo.poster = s.poster;
    mVideo.classList.add('show');
    mHero.classList.add('hide');
    mHero.removeAttribute('src');
    if (autoplay) mVideo.play().catch(() => {});
  } else {
    stopYoutube();
    mVideo.pause();
    mVideo.classList.remove('show');
    mVideo.removeAttribute('src');
    mHero.classList.remove('hide');
    mHero.src = s.src;
    mHero.alt = s.cap || '';
  }

  mCaption.textContent = s.cap || '';
  mCounter.textContent = (slideIndex + 1) + ' / ' + slides.length;

  mThumbs.querySelectorAll('button').forEach((b, bi) => {
    b.classList.toggle('active', bi === slideIndex);
  });
  const active = mThumbs.children[slideIndex];
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
};

const openProject = (key) => {
  const p = PROJECTS[key];
  if (!p) return;

  slides = p.media || [];

  // 썸네일 스트립
  mThumbs.innerHTML = '';
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'm-thumb' + (i === 0 ? ' active' : '');
    const isMotion = s.type === 'video' || s.type === 'youtube';
    const thumbSrc = isMotion ? (s.poster || '') : s.src;
    btn.innerHTML = `<img src="${thumbSrc}" alt="" loading="lazy">` +
                    (isMotion ? '<span class="t-play">▶</span>' : '');
    btn.addEventListener('click', () => showSlide(i, true));
    mThumbs.appendChild(btn);
  });
  mThumbs.style.display = slides.length > 1 ? '' : 'none';
  mPrev.style.display = mNext.style.display = slides.length > 1 ? '' : 'none';
  mCounter.style.display = slides.length > 1 ? '' : 'none';

  mCat.textContent = p.cat;
  mTitle.textContent = p.title;
  mMeta.textContent = p.meta;
  mLead.textContent = p.lead;
  mMeta.style.display = p.meta ? '' : 'none';
  mLead.style.display = p.lead ? '' : 'none';

  mText.innerHTML = '';
  (p.text || []).forEach(paragraph => {
    const el = document.createElement('p');
    el.className = 'kr';
    el.textContent = paragraph;
    mText.appendChild(el);
  });

  mLinks.innerHTML = '';
  (p.links || []).forEach(({ label, href }) => {
    const a = document.createElement('a');
    a.className = 'btn';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = label + ' ↗';
    mLinks.appendChild(a);
  });
  mLinks.style.display = (p.links || []).length ? '' : 'none';

  showSlide(0);
  modal.classList.add('open');
  modal.querySelector('.modal-box').scrollTop = 0;
  document.body.style.overflow = 'hidden';
};

mPrev.addEventListener('click', (e) => { e.stopPropagation(); showSlide(slideIndex - 1, true); });
mNext.addEventListener('click', (e) => { e.stopPropagation(); showSlide(slideIndex + 1, true); });

const closeModal = () => {
  modal.classList.remove('open');
  mVideo.pause();
  stopYoutube();
  document.body.style.overflow = '';
};

portfolioItems.forEach(item => {
  item.addEventListener('click', () => openProject(item.dataset.project));
});

modal.addEventListener('click', (e) => {
  if (e.target === modal || e.target.classList.contains('modal-close')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
  if (!modal.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') showSlide(slideIndex - 1, true);
  if (e.key === 'ArrowRight') showSlide(slideIndex + 1, true);
});

/* ── 파이프라인으로 만든 게임 쇼케이스 ───────────────────────── */
(() => {
  const list = window.GAME_SHOWCASE;
  const video = document.getElementById('gjVideo');
  if (!list || !list.length || !video) return;

  const V = document.querySelector('#pipeline .gj');
  const els = {
    title: document.getElementById('gjTitle'),
    genre: document.getElementById('gjGenre'),
    desc:  document.getElementById('gjDesc'),
    spec:  document.getElementById('gjSpec'),
    now:   document.getElementById('gjNow'),
  };
  const thumbs = [...V.querySelectorAll('.gj-thumb')];
  const ver = (document.querySelector('script[src*="main.js"]')?.src.split('?v=')[1]) || '';
  const q = ver ? '?v=' + ver : '';
  let index = 0, autoplay = false;

  const show = (i) => {
    index = (i + list.length) % list.length;
    const g = list[index];

    video.pause();
    video.poster = g.poster + q;
    video.src = g.src + q;
    video.load();
    // 사용자가 한 번이라도 재생을 시작했다면 다음 항목도 이어서 재생한다
    if (autoplay) video.play().catch(() => {});

    els.title.textContent = g.title;
    els.genre.textContent = g.genre;
    els.now.textContent   = index + 1;

    els.desc.replaceChildren(...g.desc.map(t => {
      const p = document.createElement('p');
      p.textContent = t;
      return p;
    }));
    els.spec.replaceChildren(...g.specs.map(([label, value]) => {
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value;
      row.append(dt, dd);
      return row;
    }));

    thumbs.forEach((t, n) => t.classList.toggle('is-on', n === index));
    thumbs[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  video.addEventListener('play', () => { autoplay = true; });
  V.querySelector('.gj-prev').addEventListener('click', () => show(index - 1));
  V.querySelector('.gj-next').addEventListener('click', () => show(index + 1));
  thumbs.forEach(t => t.addEventListener('click', () => show(Number(t.dataset.i))));

  // 캐러셀에 포커스가 있을 때만 좌우 키를 받는다 (모달 조작과 겹치지 않게)
  V.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); show(index - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
  });
})();
