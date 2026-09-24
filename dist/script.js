import { getHints, parseProfile, drawMember } from './profiles.mjs?v=reveal-card-only-20260915';
import { createTunnel } from './tunnel.mjs?v=tunnel-exit-20260914';
import { createLobbyMusic } from './lobby-music.mjs?v=hint-sfx-20260914';
import { createPackAudio } from './pack-audio.mjs?v=hint-sfx-audible-20260915';
import { loadKanbanBoard } from './kanban.mjs?v=supabase-kanban-20260924';

const members = [
  {
    id: 'taewoong',
    name: '엄태웅',
    cardImage: 'assets/cards/taewoong-card-cutout-v2.png',
    profilePath: 'team/엄태웅.md',
    tags: ['#웃음', '#여행', '#아이디어'],
    hints: ['코코네스쿨', '관광경영학과', '웃음'],
  },
  {
    id: 'youngkwang',
    name: '김영광',
    cardImage: 'assets/cards/youngkwang-card-cutout-v2.png',
    profilePath: 'team/김영광.md',
    tags: ['#긍정', '#적극성', '#실행력'],
    hints: ['코코네스쿨', '인공지능전공', '대구청년'],
  },
  {
    id: 'yejin',
    name: '한예진',
    cardImage: 'assets/cards/yejin-card-cutout-v2.png',
    profilePath: 'team/한예진.md',
    tags: ['#문제관찰', '#실행력', '#감응력'],
    hints: ['코코네스쿨', '소프트웨어전공', '범고래'],
  },
];

const experience = document.querySelector('#experience');
const scenes = new Map([...document.querySelectorAll('[data-view]')].map((scene) => [scene.dataset.view, scene]));
const openButton = document.querySelector('#open-pack');
const nextButton = document.querySelector('#next-pack');
const backButton = document.querySelector('#back-to-lobby');
const restartButton = document.querySelector('#restart-pack');
const homeRestartButton = document.querySelector('#home-restart');
const skipButton = document.querySelector('#skip-reveal');
const flash = document.querySelector('#white-flash');
const announcement = document.querySelector('#announcement');
const tunnelView = document.querySelector('#tunnel-view');
const tunnelCanvas = document.querySelector('#tunnel-canvas');
const hintCard = document.querySelector('#hint-card');
const hintTitle = document.querySelector('#hint-title');
const revealView = document.querySelector('#reveal-view');
const revealCard = document.querySelector('#reveal-card');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tunnel = createTunnel(tunnelCanvas, reducedMotion);
const packAudio = createPackAudio();
const lobbyMusic = createLobbyMusic(packAudio);

const PACK_IGNITION_MS = 250;
const TUNNEL_SETTLE_MS = 140;
const HINT_HOLD_MS = 600;
const HINT_GAP_MS = 110;
const TUNNEL_COAST_MS = 980;
const TUNNEL_DURATION_MS = TUNNEL_SETTLE_MS + (HINT_HOLD_MS * 3) + (HINT_GAP_MS * 2) + TUNNEL_COAST_MS;
const FLASH_LEAD_MS = 120;
const REVEAL_SETTLE_MS = 780;

let remaining = [];
let revealed = [];
let currentMember = null;
let sequenceId = 0;
let isOpening = false;
let isFinalizing = false;

const wait = (milliseconds) => new Promise((resolve) => {
  window.setTimeout(resolve, reducedMotion ? Math.min(milliseconds, 80) : milliseconds);
});

function showScene(name) {
  if (name !== 'tunnel') tunnel.stop();
  if (name !== 'tunnel' && name !== 'reveal') packAudio.stop();
  for (const [sceneName, scene] of scenes) scene.hidden = sceneName !== name;
  experience.dataset.scene = name;
  lobbyMusic.setActive(name === 'lobby');
}

function updateProgress() {
  openButton.disabled = isOpening || remaining.length === 0;
  nextButton.disabled = isOpening || isFinalizing;
  openButton.setAttribute('aria-label', revealed.length ? '다음 멤버 팩 열기' : '멤버 팩 열기');
}

function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

function triggerFlash() {
  restartAnimation(flash, 'is-bursting');
}

function resetPackTilt() {
  openButton.style.setProperty('--pack-tilt-x', '0deg');
  openButton.style.setProperty('--pack-tilt-y', '0deg');
  openButton.style.setProperty('--pack-glint-x', '50%');
  openButton.style.setProperty('--pack-glint-y', '50%');
}

function updatePackTilt(event) {
  if (reducedMotion || openButton.disabled || event.pointerType === 'touch') return;
  const bounds = openButton.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  openButton.style.setProperty('--pack-tilt-x', `${y * -7}deg`);
  openButton.style.setProperty('--pack-tilt-y', `${x * 9}deg`);
  openButton.style.setProperty('--pack-glint-x', `${(x + .5) * 100}%`);
  openButton.style.setProperty('--pack-glint-y', `${(y + .5) * 100}%`);
}

function createMemberCard(member) {
  const card = document.createElement('div');
  card.className = 'member-card';
  card.dataset.member = member.id;

  const image = document.createElement('img');
  image.src = member.cardImage;
  image.alt = `${member.name} 팀원 카드`;
  image.decoding = 'async';
  image.draggable = false;

  card.append(image);
  return card;
}

function setHint(title, index) {
  hintTitle.textContent = title;
  hintCard.hidden = false;
  tunnel.pulse(index);
  packAudio.hint(index);
  restartAnimation(hintCard, 'is-entering');
  announcement.textContent = `${index + 1}번째 공개 정보: ${title}`;
}

function clearHint() {
  hintTitle.textContent = '';
  hintCard.hidden = true;
}

function renderReveal(member) {
  revealCard.replaceChildren(createMemberCard(member));
  revealView.dataset.member = member.id;
  nextButton.textContent = remaining.length ? '다음 팩' : '협업 과정 보기';
}

async function finishReveal(member) {
  if (!member || isFinalizing) return;
  isFinalizing = true;
  clearHint();
  triggerFlash();
  await wait(FLASH_LEAD_MS);
  if (!revealed.some((item) => item.id === member.id)) revealed.push(member);
  renderReveal(member);
  showScene('reveal');
  packAudio.reveal();
  restartAnimation(revealView, 'is-arriving');
  announcement.textContent = `${member.name} 팀원 카드가 공개되었습니다.`;
  await wait(REVEAL_SETTLE_MS);
  isOpening = false;
  isFinalizing = false;
  openButton.classList.remove('is-opening');
  updateProgress();
  nextButton.focus({ preventScroll: true });
}

async function openPack(immediate = false) {
  if (isOpening || isFinalizing || remaining.length === 0) return;
  void lobbyMusic.unlockEffects();
  isOpening = true;
  updateProgress();
  const selectedMember = drawMember(remaining);
  const revealHints = [...selectedMember.hints];
  currentMember = selectedMember;
  const run = ++sequenceId;
  clearHint();
  openButton.classList.add('is-opening');
  announcement.textContent = '멤버 팩이 열립니다.';

  if (!immediate) {
    await wait(PACK_IGNITION_MS);
    if (run !== sequenceId) return;
  }
  showScene('tunnel');
  tunnel.start(TUNNEL_DURATION_MS);
  await wait(TUNNEL_SETTLE_MS);

  for (const [index, hint] of revealHints.entries()) {
    if (run !== sequenceId) return;
    setHint(hint, index);
    await wait(HINT_HOLD_MS);
    clearHint();
    if (index < revealHints.length - 1) await wait(HINT_GAP_MS);
  }

  if (run !== sequenceId) return;
  await wait(TUNNEL_COAST_MS);
  if (run !== sequenceId) return;
  await finishReveal(selectedMember);
}

async function skipReveal() {
  if (!isOpening || !currentMember || isFinalizing) return;
  const selectedMember = currentMember;
  sequenceId += 1;
  await finishReveal(selectedMember);
}

function renderCollection() {
  const container = document.querySelector('#collection-cards');
  container.replaceChildren();
  revealed.forEach((member) => {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.append(createMemberCard(member));
    container.append(card);
  });
  announcement.textContent = '세 장의 팀원 카드가 공개되었습니다.';
}

function nextScene() {
  if (isOpening || isFinalizing) return;
  if (remaining.length > 0) {
    currentMember = null;
    void openPack(true);
    return;
  }
  showScene('home');
  announcement.textContent = '세 장의 카드가 하나의 팀으로 완성되었습니다.';
}

function returnToPreviousScene() {
  if (isOpening || isFinalizing) return;
  if (remaining.length === 0) {
    showScene('home');
    announcement.textContent = '세 장의 카드가 하나의 팀으로 완성되었습니다.';
    return;
  }
  currentMember = null;
  showScene('lobby');
  updateProgress();
  openButton.focus({ preventScroll: true });
}

function restart() {
  sequenceId += 1;
  remaining = [...members];
  revealed = [];
  currentMember = null;
  isOpening = false;
  isFinalizing = false;
  openButton.classList.remove('is-opening');
  clearHint();
  showScene('lobby');
  updateProgress();
  announcement.textContent = '팀 5 멤버 팩이 준비되었습니다.';
}

async function loadProfiles() {
  await Promise.all(members.map(async (member) => {
    try {
      const response = await fetch(member.profilePath, { cache: 'no-cache' });
      if (!response.ok) return;
      const profile = parseProfile(await response.text(), member.name);
      const profileHints = getHints(profile).map((hint) => hint.text);
      if (profileHints.length === 3) member.hints = profileHints;
      if (profile.tags.length) member.tags = profile.tags;
    } catch {
      // 프로필 원본을 불러올 수 없을 때는 위의 기본 정보로 진행합니다.
    }
  }));
}

openButton.addEventListener('click', openPack);
openButton.addEventListener('pointermove', updatePackTilt);
openButton.addEventListener('pointerleave', resetPackTilt);
nextButton.addEventListener('click', nextScene);
backButton.addEventListener('click', returnToPreviousScene);
restartButton.addEventListener('click', restart);
homeRestartButton.addEventListener('click', restart);
skipButton.addEventListener('click', skipReveal);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && experience.dataset.scene === 'tunnel') skipReveal();
});

restart();
resetPackTilt();
loadProfiles();
loadKanbanBoard();
