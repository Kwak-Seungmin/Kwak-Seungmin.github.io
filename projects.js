// 프로젝트 상세 데이터 — 텍스트는 기존 포트폴리오 원문 기준
// media: [{type:'video'|'image', src, poster?, cap} | {type:'youtube', id, poster, cap}] — 모달에서 한 장씩 넘겨 본다
// links?: [{label, href}] — 본문 아래 외부 링크 버튼
const PROJECTS = {
  aiartpipeline: {
    cat: 'Tool / Automation',
    title: 'AI Game & Art Pipeline',
    meta: 'A2Z GameSpec-Bench (arXiv 2026 · Co-author) · Claude Code Agent Pipeline',
    lead: 'A2Z GameSpec-Bench: How Faithfully Can Coding Agents Generate Games from Game Design Specifications?',
    text: [
      'KRAFTON AI가 발표한 A2Z GameSpec-Bench 논문(arXiv 2609.39564)에 공동 저자로 참여했습니다. 코딩 에이전트가 긴 게임 기획서(GDD)를 플레이 가능한 게임으로 얼마나 충실하게 구현하는지 측정하는 벤치마크로, 100개의 GDD(Small 50 · Big 50)를 각각 고정된 Dependency-Aware Contract로 변환하고 소스 코드 검사 · 시나리오 기반 리플레이 · 적응형 플레이테스트 세 축으로 같은 요구사항을 평가합니다.',
      '평가 결과, 현재 에이전트들은 코드 구현과 실제 플레이 양쪽에서 서로 얽힌 요구사항을 함께 만족시키는 데 어려움을 겪었습니다. 요구사항별 피드백은 두 라운드 뒤 self-revision 대비 GDD Fidelity를 10.9% (상대 향상) 끌어올렸습니다.',
      '게임 기획서(GDD)의 아트 바이블 섹션을 입력으로 받아, 컨셉 아트에서 2D 에셋을 거쳐 픽셀 스프라이트까지 만들어내는 에셋 생성 파이프라인입니다. 컨셉·2D·픽셀 단계를 각각 독립된 에이전트로 분리하고, 단계마다 자체 품질 게이트를 두어 기준에 못 미치면 다음 단계로 넘기지 않도록 구성했습니다.',
      '아트 바이블의 에셋 스펙을 단일 기준으로 삼는 것이 핵심입니다. 캔버스 크기와 에셋 종류, 프레임 수, fps, 팔레트, 네이밍까지 기획서에 명시된 값만 사용하고, 파일명이나 설명에서 추론하지 않습니다. 값이 비어 있으면 작업을 멈추고 기획서를 채우도록 되돌립니다. 픽셀 변환에는 생성 모델을 쓰지 않고 색과 형태를 분리해 팔레트를 밝기 순으로 직접 할당하며, 타일셋은 이어 붙였을 때 이음매가 보이지 않는지 따로 검증합니다.'
    ],
    media: [
      { type:'video', src:'assets/video/paper_case_study.mp4?v=84', poster:'assets/video/poster_paper_case_study.jpg', cap:'A2Z GameSpec-Bench 케이스 스터디 — GDD로 생성된 게임과, 요구사항 피드백 전후의 빌드 비교 (논문)' },
      { type:'image', src:'assets/img/paper/teaser.jpg', cap:'A2Z GameSpec-Bench 평가 구조 — Dependency-Aware Contract → 소스 검사 · 시나리오 리플레이 · 적응형 플레이테스트 → 요구사항 단위 피드백 (논문)' },
      { type:'video', src:'assets/video/game_abyssal.mp4?v=84', poster:'assets/video/poster_game_abyssal.jpg', cap:'심연의 사슬 — 체인을 이어 터뜨리는 심해 아케이드 (인게임)' },
      { type:'video', src:'assets/video/game_starless.mp4?v=84', poster:'assets/video/poster_game_starless.jpg', cap:'별이 스러지는 밤에 — 에셋 97종으로 구성한 비주얼 노벨 (인게임)' },
      { type:'video', src:'assets/video/game_pixelrunner.mp4?v=84', poster:'assets/video/poster_game_pixelrunner.jpg', cap:'픽셀런너 8-9 — 파이프라인 에셋으로 만든 2D 플랫포머 (인게임)' },
      { type:'video', src:'assets/video/game_sprout.mp4?v=84', poster:'assets/video/poster_game_sprout.jpg', cap:'새싹 요새 — 타워 6종, 15웨이브 타워 디펜스 (인게임)' },
      { type:'video', src:'assets/video/game_fogfall.mp4?v=84', poster:'assets/video/poster_game_fogfall.jpg', cap:'안개 항로 — 항로를 그려 화물을 옮기는 경로 계획 퍼즐 (인게임)' },
      { type:'image', src:'assets/img/unity_boss.jpg', cap:'3D AI 아트 파이프라인으로 만든 에셋을 Unity 씬으로 구성 — 안개 낀 성채' },
      { type:'video', src:'assets/video/pipe_normalmap.mp4', poster:'assets/video/poster_pipe_normalmap.jpg', cap:'픽셀 노멀맵 · 양자화 라이팅 — 40×60 도트, 16색 팔레트, 5방향 노멀' },
      { type:'video', src:'assets/video/pipe_humanoid_normal.mp4', poster:'assets/video/poster_pipe_humanoid_normal.jpg', cap:'휴머노이드 스프라이트 노멀맵 라이팅 — 64×88, 6프레임 각각에 노멀 매칭' }
    ],
    links: [
      { label:'arXiv 논문', href:'https://arxiv.org/abs/2609.39564' },
      { label:'Project Page', href:'https://a2z-gamespec-bench.github.io' },
      { label:'논문 GitHub', href:'https://github.com/krafton-ai/a2z-gamespec-bench' },
      { label:'파이프라인 GitHub', href:'https://github.com/Kwak-Seungmin/game-art-pipeline' }
    ]
  },

  naevis: {
    cat: 'SM Entertainment · IP Showcase · Team Lead (80%)',
    title: 'nævis Project',
    meta: 'Midjourney · Runway AI · Maya · Unreal Engine 5 — KOCCA 2024.12.18–19 / MNM Team',
    lead: '가상에서 현실로 온다.',
    text: [
      'SM엔터테인먼트 기업연계 프로젝트로, 6개월에 걸쳐 SM의 첫 번째 버추얼 아티스트 나이비스의 IP를 기반으로 한 쇼케이스 전시를 기획했습니다. 세바스, 블랙맘바, 에테르펜 세 개의 에피소드를 중심으로 세계관을 구성했고, AI 영상·언리얼 숏폼·마야 로딩 스크린·포스터·캡션·컨셉 아트북·스티커까지 일곱 가지 결과물로 완성해 KOCCA 쇼케이스에서 선보였습니다.',
      'MNM 팀 프로젝트에서 팀 리더로 참여해 컨셉 이미지 제작과 포스터 비주얼, 세바스·코도리의 3D 모델링, AI 영상, Unreal Engine 숏폼 연출·제작을 담당했습니다. Midjourney로 에피소드별 컨셉 이미지를 만들고 Photoshop으로 보정해 포스터로 완성했으며, 완성된 캐릭터로 언리얼 숏폼 3부작을 제작했습니다.'
    ],
    media: [
      { type:'image', src:'assets/img/naevis_hero.png', cap:'나이비스 포트레이트' },
      { type:'youtube', id:'1xPpFn-jTrU', poster:'assets/img/p07_youtube_thumb.jpg', cap:'프로젝트 영상 — [NCA 단기과정 2기] Welcome to MY World (에듀코카 YouTube)' },
      { type:'image', src:'assets/img/p07_concept_sheet.jpg', cap:'나이비스 · 빌런 컨셉 아트 시트 — 모든 결과물의 출발점' },
      { type:'image', src:'assets/img/p07_poster.jpg', cap:'쇼케이스 메인 포스터, KOCCA' },
      { type:'image', src:'assets/img/p07_sevas_poster.jpg', cap:'SEVAS 캐릭터 포스터' },
      { type:'image', src:'assets/img/p07_blackmamba_poster.jpg', cap:'BLACKMAMBA 포스터' },
      { type:'image', src:'assets/img/p07_walk.jpg', cap:'리얼월드 거리를 세바스와 함께 걷는 나이비스' },
      { type:'image', src:'assets/img/p07_loading.jpg', cap:'Maya 뷰포트 로딩 스크린 — naevis_cat · naevis_pose' },
      { type:'image', src:'assets/img/p07_caption.jpg', cap:'에피소드 캡션 3종 — 세바스 · 블랙맘바 · 에테르' },
      { type:'image', src:'assets/img/p07_showcase.jpg', cap:'KOCCA 쇼케이스 전시장 · 크레딧' },
      { type:'image', src:'assets/img/p07_kocca_booth.jpg', cap:'KOCCA 쇼케이스 MNM 부스 — 포스터 · 숏폼 모니터 · 컨셉 아트북 · 굿즈 (사진: 에듀코카 성과아카이브)' },
      { type:'image', src:'assets/img/p07_kocca_booth_side.jpg', cap:'MNM 부스 측면 — 헤드폰으로 숏폼을 감상하는 관람객 (사진: 에듀코카 성과아카이브)' }
    ],
    links: [
      { label:'KOCCA 성과아카이브', href:'https://edu.kocca.kr/edu/archiveUser/contentsDeptList.do?menuNo=500266&taskSeq=338' },
      { label:'프로젝트 영상 · YouTube', href:'https://www.youtube.com/watch?v=1xPpFn-jTrU' }
    ]
  },

  utopia: {
    cat: 'Creature / Hard-surface · Solo 100%',
    title: 'Utopia Garden',
    meta: 'Unreal · Maya · Arnold · Substance Painter — 2024.04–06 (2개월)',
    lead: '고도의 인공지능을 지닌 정교한 기계 곤충들이 희귀 식물들의 보호구역, 유토피아 가든을 관리한다.',
    text: [
      '미래의 씨앗 보관소이자 온갖 희귀 식물들의 보호구역인 유토피아 가든은 혁신적인 기술과 진보된 자동화 시스템이 결합된 공간입니다. 하드서페이스 기반의 자동차·전구 부품을 곤충 형태의 로봇으로 재조합해 자연과 기술이 조화를 이루는 미래의 식물원을 시각적으로 표현하고자 했습니다.',
      '짧은 단편 3D 영상을 만들기 위한 워크플로우와 모델링·텍스처링·리깅을 처음부터 직접 익히려는 목적으로 시작했습니다. 테라리움·미래 식물원 레퍼런스로 그린 3단 팔레트를 먼저 정하고, 벌에게는 수분, 무당벌레에게는 식물 관리, 잠자리에게는 정찰이라는 역할을 부여해 씬·컷 단위 스토리보드로 카메라 동선을 설계했습니다. 부품의 원형이 그대로 느껴지도록 실루엣을 지키는 것을 모델링의 원칙으로 삼았습니다.'
    ],
    media: [
      { type:'video', src:'assets/video/utopia_turntable.mp4', poster:'assets/video/poster_utopia_tt.jpg', cap:'턴테이블 — 기계 곤충 유닛' },
      { type:'image', src:'assets/img/utopia_01.png', cap:'히비스커스 꽃가루를 향해 비행하는 벌 로봇' },
      { type:'image', src:'assets/img/utopia_13.png', cap:'컬러 레퍼런스 보드 — 그린 3단 팔레트' },
      { type:'image', src:'assets/img/utopia_14.png', cap:'스토리보드 — 곤충의 역할과 카메라 동선' },
      { type:'image', src:'assets/img/p03_dragonfly.jpg', cap:'Dragonfly, 3방향 렌더 — 전구·차량 부품을 재조합한 잠자리형 로봇' },
      { type:'image', src:'assets/img/p03_dragonfly_wire.jpg', cap:'Dragonfly, 와이어프레임 — 하드서페이스 토폴로지 검수용 3방향' },
      { type:'image', src:'assets/img/p03_ladybug.jpg', cap:'Ladybug, 3방향 렌더 — 붉은 겉날개에 부식 텍스처' },
      { type:'image', src:'assets/img/p03_ladybug_wire.jpg', cap:'Ladybug, 와이어프레임 — 겉날개와 몸통의 3방향 토폴로지' },
      { type:'image', src:'assets/img/p03_bee_3view.jpg', cap:'Bee Robot, 3방향 렌더 — 전구 유리를 복부로 치환' },
      { type:'image', src:'assets/img/p03_bee_wire.jpg', cap:'Bee Robot, 와이어프레임 — 복부와 날개의 3방향 토폴로지' },
      { type:'image', src:'assets/img/utopia_bee_closeup.jpg', cap:'Bee Robot 클로즈업 — 전구 유리를 옮겨온 복부의 수분 유닛' },
      { type:'image', src:'assets/img/utopia_09.jpg', cap:'Ladybug 클로즈업' },
      { type:'image', src:'assets/img/utopia_12.jpeg', cap:'Dragonfly 클로즈업' }
    ]
  },

  mongsungi: {
    cat: 'Character Design · Avene 캐릭터 공모전 · Solo 100%',
    title: 'Mongsungi',
    meta: 'Maya 2024 · Unreal Engine 5 — 2024.01–02',
    lead: '온천수 물방울과 라이브 코랄 — 아벤느 브랜드의 회복하는 느낌을 담은 캐릭터.',
    text: [
      '온천수를 활용해 화장품을 만드는 Avene 브랜드의 캐릭터 공모전 작업으로 \'몽숭이\'라는 캐릭터를 창작했습니다. 자연과 휴식을 조화롭게 담아낸, 온천의 편안하고 상쾌한 이미지를 상징하는 캐릭터로, 아벤느 브랜드가 지닌 본질과 온천이 주는 회복의 느낌을 담아내고자 했습니다.',
      '아벤느의 상징인 온천수를 몸 곳곳의 물방울로, 메인 키컬러인 라이브 코랄을 몸 색상으로 표현했습니다. 캐릭터 설계부터 모델링, 리깅을 고려한 라운드 토폴로지, Unreal Engine 키비주얼까지 전부 직접 만들어 제출했습니다. 브랜드의 색과 제품 특성을 캐릭터에 얼마나 직접적으로 드러낼지의 균형이 가장 큰 고민이었습니다.'
    ],
    media: [
      { type:'image', src:'assets/img/p06_meditation.jpg', cap:'온천 속 명상, 몽숭이' },
      { type:'image', src:'assets/img/p06_3view.jpg', cap:'정면·측면·후면 — 온천수 물방울과 라이브 코랄 컬러' },
      { type:'image', src:'assets/img/p06_wire.jpg', cap:'와이어프레임 — 리깅을 고려한 라운드 토폴로지' },
      { type:'image', src:'assets/img/p06_cutout.png', cap:'캐릭터 컷아웃' },
      { type:'image', src:'assets/img/p06_spring.jpg', cap:'온천의 새벽, UE5 키비주얼' },
      { type:'image', src:'assets/img/p06_pose_sheet.jpg', cap:'응용 동작 시트 — 온천 안개 속 세 가지 포즈' },
      { type:'image', src:'assets/img/p06_turn_sheet.jpg', cap:'앞·옆·뒤 턴어라운드 — 공모전 제출 시트' }
    ]
  },

  arcimboldo: {
    cat: 'Organic 3D Modeling · Solo 100%',
    title: 'Arcimboldo Winter',
    meta: 'Maya · ZBrush · Unreal Engine 5 — 2024.10–12 (2개월)',
    lead: '옆모습 뒤에 감춰진, 상상으로 채운 반대편.',
    text: [
      '주세페 아르침볼도의 회화 「겨울(Winter)」을 모티브로, 그의 독창적인 인물 구성 방식을 3D로 재해석해 영상으로 풀어낸 프로젝트입니다. 원작 속 인물의 얼굴을 모델링하고 텍스처링해 계절의 찬 기운과 생명력의 부재를 표현했고, 이후 점진적으로 봄의 이미지로 전환되며 새가 날아드는 장면을 통해 생명의 회복과 계절의 흐름을 담아내고자 했습니다.',
      '아르침볼도의 인물화는 대부분 옆모습만 그려져 있고 반대편은 상상의 영역으로 남아 있어, 보이지 않는 반대쪽에 상상을 더해 재해석해보고 싶었습니다. Unreal Engine 페이셜 캡처로 표정 애니메이션을 만들고 ZBrush로 정밀한 모델링을 연습하고 싶었던 목적도 있었습니다. 원작 리서치부터 얼굴 조형·텍스처링, 표정 애니메이션까지 진행했습니다.'
    ],
    media: [
      { type:'image', src:'assets/img/p04_cover.jpg', cap:'Arcimboldo Winter — 원작과 3D 재해석' },
      { type:'image', src:'assets/img/p04_storyboard.jpg', cap:'스토리보드 — 겨울에서 봄으로, 새가 날아드는 여섯 컷' },
      { type:'video', src:'assets/video/arcimboldo_turntable.mp4', poster:'assets/video/poster_arcimboldo_tt.jpg', cap:'턴테이블 — Winter Head' },
      { type:'image', src:'assets/img/p04_woodhead_3view.jpg', cap:'Winter Head, 3방향 — 갈라진 수피 텍스처와 옹이 코' },
      { type:'image', src:'assets/img/p04_woodhead_clay.jpg', cap:'클레이 렌더 — 조형 검수용 3방향' },
      { type:'image', src:'assets/img/p04_winter_close.jpg', cap:'Winter Head, 클로즈업' },
      { type:'image', src:'assets/img/p04_nest.jpg', cap:'눈에 튼 새 둥지 — 겨울에서 봄으로' },
      { type:'image', src:'assets/img/p04_title.jpg', cap:'Winter 타이틀 컷' }
    ]
  },

  bio: {
    cat: 'Organic 3D Modeling · Solo 100%',
    title: 'Bio Project',
    meta: 'Maya · ZBrush · Arnold — 2024.08–10 (2개월)',
    lead: '인간의 몸이 에너지가 된다.',
    text: [
      '미래에 생체기술이 극단적으로 발전하면서, 인간의 몸 즉 생체가 에너지로 쓰이고 그것을 활용하게 된 세계관을 배경으로 합니다. Lab 특유의 차갑고 기괴한 느낌을 살린 컨셉으로 재료가 된 인간의 모습을 조형했습니다.',
      '세계관 설정부터 캐릭터 조형, 텍스처링, 라이팅까지 진행했습니다. 반복된 시술로 변색되고 부풀어 오른 피부는 Substance Painter로 상처와 멍 텍스처를 만들어 생체 조작의 흔적을 기록했습니다.'
    ],
    media: [
      { type:'video', src:'assets/video/bio_lab.mp4', poster:'assets/video/poster_bio_lab.jpg', cap:'Lab 시퀀스 — 수술대 위의 실험체 (15초)' },
      { type:'image', src:'assets/img/p05_torso_v2.png', cap:'누워있는 실험체' },
      { type:'image', src:'assets/img/p05_head_3view.jpg', cap:'실험체 헤드, 3방향 — 변색되고 부풀어 오른 피부' },
      { type:'image', src:'assets/img/p05_face_close.jpg', cap:'헤드 클로즈업 — 함몰된 눈두덩과 피하 출혈 디테일' },
      { type:'image', src:'assets/img/p05_feet.jpg', cap:'수술대의 발, 역광 — 실루엣 스터디' },
      { type:'image', src:'assets/img/p05_subject.jpg', cap:'토르소, 로우키 라이팅' }
    ]
  },

  honor: {
    cat: 'AI Short Film · Runtime 4–5 min · Solo 100%',
    title: 'The Weight of Honor',
    meta: 'GPT Image 2 · Seedance2 · Kling 3.0 · Sora 2',
    lead: '명예를 잃은 검과 고국을 잃은 검이 하나의 다리 위에서 만난다.',
    text: [
      '명예를 잃은 기사 워든과 고국을 잃은 사무라이 켄세이가 안개 낀 전장에서 마주치는 4~5분 분량의 AI 단편영화입니다. GPT Image 2로 생성한 75컷의 프레임을 Seedance2, Kling 3.0, Sora 2로 영상화했고, 어두운 분위기에서 시작해 따뜻한 아침빛으로 서서히 물드는 색감 흐름으로 이야기를 다루었습니다.',
      'Game Cinematic 같은 느낌의 영상을 AI로 만들어보고 싶었고, 기획부터 제작까지 전 과정을 에이전틱하게 풀어내려고 했습니다. 캐릭터가 소지한 무기·방어구 프랍(멘포, 노다치, 롱소드)과 배경 프랍(경계의 다리)은 영상 생성 전에 AI가 레퍼런스 소스까지 자동으로 만들도록 했고, 75컷의 프레임 생성부터 영상화까지 전 과정을 진행했습니다.'
    ],
    media: [
      { type:'video', src:'assets/video/weight_of_honor.mp4', poster:'assets/video/poster_woh.jpg', cap:'본편 — The Weight of Honor (4분 9초)' },
      { type:'image', src:'assets/img/p01_still1.jpg', cap:'전장 전경 — 깃발이 늘어선 진흙 벌판' },
      { type:'image', src:'assets/img/p01_still2.jpg', cap:'눈보라 속 교전' },
      { type:'image', src:'assets/img/p01_still4.jpg', cap:'에이든 클로즈업 — 이마에 남은 상처' },
      { type:'image', src:'assets/img/p01_still5.jpg', cap:'진흙에 꽂힌 롱소드 위의 까마귀' },
      { type:'image', src:'assets/img/p01_duel.jpg', cap:'경계의 다리, 결투' },
      { type:'image', src:'assets/img/p01_knight.jpg', cap:'에이든, 나이트 워든 — 학살 명령을 거부하고 떠난 탈영병' },
      { type:'image', src:'assets/img/p01_samurai.jpg', cap:'카게마사, 사무라이 켄세이 — 부하를 모두 잃은 무사' },
      { type:'image', src:'assets/img/p01_menpo.jpg', cap:'멘포, 3방향' },
      { type:'image', src:'assets/img/p01_nodachi.jpg', cap:'노다치 · 츠바 · 도신' },
      { type:'image', src:'assets/img/p01_longsword.jpg', cap:"Aiden's Longsword, 120cm" },
      { type:'image', src:'assets/img/p01_bridge_side.jpg', cap:'경계의 다리, 측면 전경' }
    ]
  },

  bonfire: {
    cat: 'AI Short Film · Short-form Series 2–3 min · Solo 100%',
    title: 'The Bonfire Will Die',
    meta: 'GPT Image 2 · Seedance2',
    lead: '심장을 꺼내는 일이 축복이 되는 세계.',
    text: [
      '이영도의 소설 「눈물을 마시는 새」 속 나가 종족의 세계관을 배경으로 한 2~3분 분량의 숏폼들입니다. 심장을 내어주는 성인식, 여신 앞의 기도, 춤채로 피워내는 열의 예술을 대사 없이 보여주는 비주얼 내러티브로 제작했습니다. 나가의 적외선 시야를 인간의 가시광선과 교차시켜, 같은 세계를 전혀 다르게 보는 종족의 감각을 표현하고자 했습니다.',
      '소설 속에서 비중이 비교적 적은 나가 종족의 세계를, 전투적이고 적대적인 모습이 아니라 성인식이나 기도 같은 생활상으로 보여주고 싶었습니다. 세계관 재해석부터 캐릭터·공간 디자인, GPT Image 2 생성, Seedance2 영상화까지 진행했습니다.'
    ],
    media: [
      { type:'video', src:'assets/video/bonfire_ep1.mp4', poster:'assets/video/poster_bonfire_ep1.jpg', cap:'Episode 1 — 횃불의 춤 (1:08)' },
      { type:'video', src:'assets/video/bonfire_ep2.mp4', poster:'assets/video/poster_bonfire_ep2.jpg', cap:'Episode 2 — 심장탑, 여신의 의식 (0:51)' },
      { type:'video', src:'assets/video/bonfire_ep3.mp4', poster:'assets/video/poster_bonfire_ep3.jpg', cap:'Episode 3 — 심장 적출 성인식 (0:30)' },
      { type:'image', src:'assets/img/p02_hearttower.jpg', cap:'심장탑 전경 — 세대가 축적되는 신전' },
      { type:'image', src:'assets/img/p02_shaman_night.jpg', cap:'여신 앞의 기도, 춤채를 든 샤먼' }
    ]
  },

  keloid: {
    cat: 'Graduation Exhibition · Conceptual Cinematic · Solo 100%',
    title: 'Keloid',
    meta: 'Unreal Engine 5 · Veo 3 · Krea AI · Seedream AI — 2025.02–12',
    lead: '인간의 욕망과 자연의 욕망.',
    text: [
      '졸업전시 작업으로 진행한 컨셉추얼 시네마틱입니다. 핵전쟁 이후 대부분 사막으로 변한 세계에서, 생명체를 되살리는 신비한 광석이 존재한다는 \'섬\'의 소문을 듣고 도착한 이들은 식물·동물·인간이 뒤엉켜 변형된 생명체들을 마주하게 됩니다. 섬의 광석은 생명을 구하는 것이 아니라 생명체를 자연의 일부처럼 변형시켜버리는 힘을 지니고 있었습니다.',
      'Unreal Engine과 AI를 함께 활용하는 방식으로 접근했습니다. 당시 기준으로 AI만으로는 좋은 퀄리티를 내기 어려워서, 기본이 되는 형태를 3D로 먼저 만들고 그 위에 AI로 디테일을 더하거나 변형시키는 방법을 택했습니다. 변형되는 생명체를 다루는 컨셉인 만큼 제작 방식 자체도 같은 구조를 따르고 싶었습니다. 언리얼에서 기본 새 애니메이션을 먼저 만들고, 그 시퀀스를 기반으로 Veo 3로 변형된 새를 생성해 영상화했습니다.'
    ],
    media: [
      { type:'image', src:'assets/img/p10_plan_02.jpg', cap:'해안가 — 손가락과 합쳐진 꽃게, 나무가 자란 고래' },
      { type:'image', src:'assets/img/p10_plan_03.jpg', cap:'숲 — 장기와 결합한 나무와 변형된 동물들' },
      { type:'image', src:'assets/img/p10_plan_04.jpg', cap:'동굴 — 섬에서 유일하게 색을 지닌 광석' },
      { type:'image', src:'assets/img/p10_plan_05.jpg', cap:'절벽 — 모든 것을 집어삼켜 하나로 굳은 동굴 천장' },
      { type:'video', src:'assets/video/keloid_shore.mp4', poster:'assets/video/poster_keloid_shore.jpg', cap:'해안가 시퀀스 — 섬에 도착한 탐사대원' },
      { type:'image', src:'assets/img/p10_arrival.png', cap:'안개 낀 해안, 섬에 도착한 탐사대' },
      { type:'video', src:'assets/video/keloid_bird.mp4', poster:'assets/video/poster_keloid_bird.jpg', cap:'변형된 새 — 언리얼 기본 애니메이션 시퀀스를 Veo 3로 변형' },
      { type:'image', src:'assets/img/p10_crow_skulls.jpg', cap:'두개골 사이의 까마귀 — 안개 속 바위섬' },
      { type:'image', src:'assets/img/p10_creature_3d.jpg', cap:'변형 생명체 3D — 갈라진 다리와 광물화된 껍질' },
      { type:'image', src:'assets/img/p10_helmet.jpg', cap:'헬멧 안에서 광석에 침식된 탐사대원' },
      { type:'image', src:'assets/img/p10_credits.jpg', cap:'Project Credits — Director · Sound Design · Supervisor' }
    ]
  }
};
