const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const caregiverLink = document.querySelector('[data-caregiver-link]');
const notice = document.querySelector('.notice');
const modal = document.querySelector('#share-modal');
const composeStep = document.querySelector('[data-compose-step]');
const previewStep = document.querySelector('[data-preview-step]');
const modalTitle = document.querySelector('#share-modal-title');
const modalDescription = document.querySelector('#share-modal-description');
const modalKicker = document.querySelector('#share-modal-kicker');
const discoveryChoices = document.querySelector('[data-discovery-choices]');
const achievementSummary = document.querySelector('[data-achievement-summary]');
const questionField = document.querySelector('[data-question-field]');
const questionInput = document.querySelector('#share-question');
const questionCount = document.querySelector('#question-count');
const buildPreviewButton = document.querySelector('[data-build-preview]');
const previewKicker = document.querySelector('#preview-kicker');
const previewContent = document.querySelector('#preview-content');
const composeArt = document.querySelector('#share-compose-art');
const previewArt = document.querySelector('#share-preview-art');
const pointsKey = 'itaso-nna-points-v1';
const missionsKey = 'itaso-nna-missions-v1';
let activeShare = null;
let selectedDiscovery = '';
let lastShareButton = null;

const shareModes = {
  discovery: { kicker: 'UN DESCUBRIMIENTO', title: '¿Qué encontraste?', description: 'Elige una idea para preparar una tarjeta.', art: 'assets/tomatedesc.svg', artAlt: 'Tomate que representa un descubrimiento' },
  achievements: { kicker: 'MIS LOGROS', title: 'Muestra tu recorrido', description: 'Usaremos tus puntos y recompensas actuales.', art: 'assets/logros-compartir.svg', artAlt: 'Trofeo que representa los logros' },
  question: { kicker: 'UNA PREGUNTA', title: '¿Qué quieres preguntar?', description: 'Escribe una pregunta corta para platicarla en persona.', art: 'assets/berenjena-pensativa-compartir.svg', artAlt: 'Berenjena pensando una pregunta' }
};

function setShareArt(data) {
  composeArt.src = data.art;
  previewArt.src = data.art;
  previewArt.alt = data.artAlt;
}

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

function achievementText(state) {
  const unlocked = [40, 80, 140, 210].filter((threshold) => state.total >= threshold).length;
  const completed = Object.keys(state.events).filter((key) => key.includes('completo') || key.startsWith('mision-')).length;
  if (!state.total) return 'Estoy comenzando mi recorrido en ITASO.';
  const completedLabel = completed === 1 ? 'recorrido' : 'recorridos';
  const rewardLabel = unlocked === 1 ? 'recompensa' : 'recompensas';
  return `He reunido ${state.total} puntos, completado ${completed} ${completedLabel} y desbloqueado ${unlocked} ${rewardLabel}.`;
}

function updateBuildState() {
  buildPreviewButton.disabled = activeShare === 'discovery' ? !selectedDiscovery : activeShare === 'question' ? !questionInput.value.trim() : false;
}

function openShare(mode, trigger) {
  activeShare = mode;
  modal.dataset.shareMode = mode;
  modal.classList.remove('is-mission-share');
  lastShareButton = trigger;
  selectedDiscovery = '';
  questionInput.value = '';
  questionCount.textContent = '0';
  discoveryChoices.querySelectorAll('button').forEach((button) => button.classList.remove('is-selected'));
  const data = shareModes[mode];
  setShareArt(data);
  document.querySelector('[data-edit-share]').hidden = false;
  modalKicker.textContent = data.kicker;
  modalTitle.textContent = data.title;
  modalDescription.textContent = data.description;
  discoveryChoices.hidden = mode !== 'discovery';
  achievementSummary.hidden = mode !== 'achievements';
  questionField.hidden = mode !== 'question';
  if (mode === 'achievements') {
    const state = readPoints();
    document.querySelector('#share-points').textContent = state.total;
    document.querySelector('#share-achievement-copy').textContent = achievementText(state);
  }
  composeStep.hidden = false;
  previewStep.hidden = true;
  modal.hidden = false;
  document.body.classList.add('share-open');
  updateBuildState();
  modal.querySelector('button:not([hidden]), textarea')?.focus();
}

function closeShare() {
  modal.hidden = true;
  document.body.classList.remove('share-open');
  lastShareButton?.focus();
}

document.querySelectorAll('[data-share]').forEach((button) => button.addEventListener('click', () => openShare(button.dataset.share, button)));
document.querySelectorAll('[data-close-share]').forEach((button) => button.addEventListener('click', closeShare));

discoveryChoices.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', () => {
    selectedDiscovery = button.dataset.discovery;
    discoveryChoices.querySelectorAll('button').forEach((item) => item.classList.toggle('is-selected', item === button));
    updateBuildState();
  });
});

questionInput.addEventListener('input', () => {
  questionCount.textContent = String(questionInput.value.length);
  updateBuildState();
});

buildPreviewButton.addEventListener('click', () => {
  if (buildPreviewButton.disabled) return;
  const state = readPoints();
  const content = activeShare === 'discovery' ? selectedDiscovery : activeShare === 'achievements' ? achievementText(state) : questionInput.value.trim();
  previewKicker.textContent = activeShare === 'question' ? 'QUIERO PREGUNTAR…' : activeShare === 'achievements' ? 'QUIERO MOSTRARTE…' : 'HOY DESCUBRÍ QUE…';
  previewContent.textContent = content;
  composeStep.hidden = true;
  previewStep.hidden = false;
  previewStep.focus();
});

document.querySelector('[data-edit-share]').addEventListener('click', () => {
  previewStep.hidden = true;
  composeStep.hidden = false;
  buildPreviewButton.focus();
});

function recordPreparedShare() {
  try {
    const state = readPoints();
    const eventKey = `descubrimiento-compartido-${activeShare}`;
    if (!state.events[eventKey]) {
      state.events[eventKey] = 5;
      state.total += 5;
      window.localStorage.setItem(pointsKey, JSON.stringify(state));
    }
  } catch (_) {
    // La tarjeta sigue funcionando si el navegador bloquea el almacenamiento local.
  }
}

document.querySelector('[data-finish-share]').addEventListener('click', () => {
  recordPreparedShare();
  if (activeShare?.startsWith('mission-')) {
    window.location.href = 'index.html?page=misiones';
    return;
  }
  closeShare();
  showNotice('Tarjeta lista para mostrar en persona.');
});

function openCompletedMission(key) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(missionsKey)) || {};
    const mission = saved[key];
    if (!mission) return;
    activeShare = `mission-${key}`;
    modal.dataset.shareMode = ({ empaques: 'orange', grupos: 'green', agua: 'blue', alrededor: 'red' })[key] || 'red';
    modal.classList.add('is-mission-share');
    lastShareButton = null;
    previewKicker.textContent = 'COMPLETÉ UNA MISIÓN';
    document.querySelector('[data-edit-share]').hidden = true;
    const shortLearning = mission.learning.replace('para que puedas encontrarlos rápidamente', 'para encontrarlos rápido');
    previewContent.textContent = key === 'agua'
      ? `${mission.title}\n\n${mission.observed}\n${mission.found}\n\nHoy descubrí una forma sencilla de tener agua cerca durante mi día.`
      : `${mission.title}\n\nObservé: ${mission.observed}\n${mission.found}\n\nAprendí: ${shortLearning}`;
    composeStep.hidden = true;
    previewStep.hidden = false;
    modal.hidden = false;
    document.body.classList.add('share-open');
    previewStep.focus();
  } catch (_) {
    // Compartir sigue disponible aunque no haya una misión guardada.
  }
}

const missionToShare = new URLSearchParams(window.location.search).get('mission');
if (missionToShare) openCompletedMission(missionToShare);

modal.addEventListener('click', (event) => { if (event.target === modal) closeShare(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeShare(); });

const revealItems = document.querySelectorAll('.share-reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
