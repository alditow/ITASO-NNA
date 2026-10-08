const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const caregiverLink = document.querySelector('[data-caregiver-link]');
const notice = document.querySelector('.notice');
const pointsKey = 'itaso-nna-points-v1';
const characterKey = 'itasoRedesignCharacterV2';

const rewardsCatalog = [
  { threshold: 40, name: 'Nueva expresión', type: 'Expresión', image: '../assets/recompensa-nueva-expresion.svg' },
  { threshold: 140, name: 'Personaje fresa', type: 'Personaje', image: '../assets/fresa-1.svg' },
  { threshold: 210, name: 'Movimiento sorpresa', type: 'Animación', image: '../assets/movimiento-sorpresa.svg' }
];

const achievementsCatalog = [
  { number: '01', name: 'Primera comparación', copy: 'Se activa cuando terminas por primera vez “¿Cuál tiene más?”.', event: 'juego-cual-tiene-mas-completo', href: 'cual-tiene-mas.html', action: 'Probar el juego', className: 'badge-compare' },
  { number: '02', name: 'Memoria atenta', copy: 'Encuentra todas las parejas del memorama.', event: 'juego-memorama-completo', href: 'memorama.html', action: 'Ir al memorama', className: 'badge-memory' },
  { number: '03', name: 'Explorador de etiquetas', copy: 'Visita los recursos sobre empaques y sellos.', test: (events) => Object.keys(events).some((key) => key === 'area-recursos' || key.startsWith('recurso-')), href: 'recursos.html', action: 'Explorar recursos', className: 'badge-explorer' }
];

const characterAssets = {
  tomate: ['../assets/tomate-1.svg', '../assets/tomate-2.svg', '../assets/tomate-3.svg'],
  zanahoria: ['../assets/zanahoria-1.svg', '../assets/zanahoria-2.svg', '../assets/zanahoria-3.svg'],
  naranja: ['../assets/naranja-1.svg', '../assets/naranja-2.svg', '../assets/naranja-3.svg'],
  berenjena: ['../assets/berenjena-1.svg', '../assets/berenjena-2.svg', '../assets/berenjena-3.svg'],
  fresa: ['../assets/fresa-1.svg', '../assets/fresa-2.svg', '../assets/fresa-3.svg']
};
const faceSettings = {
  tomate: [{ top: 52, width: 32 }, { top: 51, width: 25 }, { top: 50, width: 27 }],
  zanahoria: [{ top: 50, width: 25 }, { top: 58, width: 23 }, { top: 68, width: 22 }],
  naranja: [{ top: 50, width: 29 }, { top: 51, width: 27 }, { top: 50, width: 26 }],
  berenjena: [{ top: 51, width: 27 }, { top: 54, width: 33 }, { top: 52, width: 24 }],
  fresa: [{ top: 53, width: 28 }, { top: 54, width: 27 }, { top: 55, width: 27 }]
};

function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const willOpen = !navigation.classList.contains('is-open');
  navigation.classList.toggle('is-open', willOpen);
  menuToggle.setAttribute('aria-expanded', String(willOpen));
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 18), { passive: true });

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => { notice.hidden = true; }, 3000);
}

caregiverLink.addEventListener('click', (event) => {
  event.preventDefault();
  showNotice('El acceso para cuidadores se conectará en la siguiente etapa.');
});

function readPoints() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(pointsKey));
    return stored && typeof stored.total === 'number' ? { total: stored.total, events: stored.events || {} } : { total: 0, events: {} };
  } catch (_) {
    return { total: 0, events: {} };
  }
}

function readCharacter() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(characterKey));
    return stored && characterAssets[stored.fruit] ? stored : null;
  } catch (_) {
    return null;
  }
}

function renderCharacter() {
  const character = readCharacter();
  if (!character || character.shape === null || !characterAssets[character.fruit]?.[character.shape]) return;
  const body = document.querySelector('.summary-body');
  const face = document.querySelector('.summary-face');
  if (!body || !face) return;
  body.src = characterAssets[character.fruit][character.shape];
  body.alt = character.name ? `Personaje de ${character.name}` : 'Tu personaje de ITASO';
  if (character.expression) {
    const placement = faceSettings[character.fruit][character.shape];
    face.src = character.expression === 'recompensa' ? '../assets/recompensa-nueva-expresion.svg' : `../assets/expressions-svg/expression-${character.expression}.png`;
    face.style.top = `${placement.top}%`;
    face.style.width = `${placement.width}%`;
    face.hidden = false;
  }
}

function rewardCard(reward, unlocked) {
  const article = document.createElement('article');
  article.className = `reward-card ${unlocked ? 'is-unlocked' : 'is-locked'}`;
  article.innerHTML = `<img class="reward-image" src="${reward.image}" alt=""><div><span>${reward.type}</span><strong>${reward.name}</strong><small>${unlocked ? 'Desbloqueada' : `${reward.threshold} puntos para descubrirla`}</small></div><img class="reward-state-icon" src="../assets/${unlocked ? 'candabierto' : 'candcerrado'}.svg" alt="" aria-hidden="true">`;
  return article;
}

function renderAchievements(events) {
  const list = document.querySelector('#achievement-list');
  const cards = achievementsCatalog.map((achievement) => {
    const unlocked = achievement.test ? achievement.test(events) : Boolean(events[achievement.event]);
    const article = document.createElement('article');
    article.className = `achievement-card ${achievement.className} ${unlocked ? 'is-unlocked' : 'is-locked'} achievement-reveal`;
    article.dataset.number = achievement.number;
    article.innerHTML = `<span class="achievement-state">${unlocked ? 'Desbloqueado' : 'Por descubrir'}</span><span class="achievement-mark" aria-hidden="true">${unlocked ? '✓' : achievement.number}</span><h3>${achievement.name}</h3><p>${achievement.copy}</p><a href="${achievement.href}">${achievement.action} <span aria-hidden="true">→</span></a>`;
    return article;
  });
  list.replaceChildren(...cards);
}

function renderRewards() {
  const state = readPoints();
  document.querySelector('#points-total').textContent = state.total;
  const unlocked = rewardsCatalog.filter((reward) => state.total >= reward.threshold);
  const locked = rewardsCatalog.filter((reward) => state.total < reward.threshold);
  const unlockedList = document.querySelector('#unlocked-rewards');
  const lockedList = document.querySelector('#locked-rewards');
  unlockedList.replaceChildren(...(unlocked.length ? unlocked.map((reward) => rewardCard(reward, true)) : [Object.assign(document.createElement('p'), { className: 'empty-rewards', textContent: 'Explora ITASO para descubrir tu primera recompensa.' })]));
  lockedList.replaceChildren(...locked.map((reward) => rewardCard(reward, false)));

  const next = locked[0];
  const nextName = document.querySelector('#next-reward-heading');
  const nextCopy = document.querySelector('#next-reward-copy');
  const nextImage = document.querySelector('#next-reward-image');
  const progress = document.querySelector('#reward-progress-bar');
  const progressWrap = progress.parentElement;
  const progressLabel = document.querySelector('#reward-progress-label');
  if (!next) {
    nextName.textContent = 'Colección completa';
    nextCopy.textContent = 'Has descubierto todas las recompensas disponibles.';
    nextImage.src = '../assets/menu-logros.svg';
    progress.style.width = '100%';
    progressWrap.setAttribute('aria-valuemin', '0');
    progressWrap.setAttribute('aria-valuemax', String(state.total));
    progressWrap.setAttribute('aria-valuenow', String(state.total));
    progressLabel.textContent = `${state.total} puntos reunidos`;
  } else {
    const percent = Math.max(0, Math.min(100, (state.total / next.threshold) * 100));
    nextName.textContent = next.name;
    nextCopy.textContent = `${next.threshold - state.total} puntos para desbloquearla`;
    nextImage.src = next.image;
    progress.style.width = `${percent}%`;
    progressWrap.setAttribute('aria-valuemin', '0');
    progressWrap.setAttribute('aria-valuemax', String(next.threshold));
    progressWrap.setAttribute('aria-valuenow', String(state.total));
    progressLabel.textContent = `${state.total} de ${next.threshold} puntos`;
  }
  renderAchievements(state.events);
}

function revealContent() {
  const items = document.querySelectorAll('.achievement-reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  items.forEach((item) => observer.observe(item));
}

renderCharacter();
renderRewards();
revealContent();
