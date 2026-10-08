const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const caregiverLink = document.querySelector('[data-caregiver-link]');
const notice = document.querySelector('.notice');

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

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}, { passive: true });

caregiverLink.addEventListener('click', (event) => {
  event.preventDefault();
  notice.hidden = false;
  window.clearTimeout(caregiverLink.noticeTimer);
  caregiverLink.noticeTimer = window.setTimeout(() => { notice.hidden = true; }, 3200);
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}


const whyCharacterTrigger = document.querySelector('.why-character-trigger');
const whyCharacterBubble = document.querySelector('#why-character-bubble');

whyCharacterTrigger?.addEventListener('click', () => {
  const willOpen = whyCharacterBubble.hidden;
  whyCharacterBubble.hidden = !willOpen;
  whyCharacterTrigger.setAttribute('aria-expanded', String(willOpen));
});

document.querySelectorAll('[data-companion-message]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const message = document.querySelector(`#${trigger.dataset.companionMessage}`);
    if (!message) return;
    const willOpen = message.hidden;
    message.hidden = !willOpen;
    trigger.setAttribute('aria-expanded', String(willOpen));
  });
});

const customizer = document.querySelector('#personalizador');
const customizerClose = customizer.querySelector('.customizer-close');
const customizerOpeners = document.querySelectorAll('[data-open-customizer]');
const customizerClosers = customizer.querySelectorAll('[data-close-customizer]');
const avatarStage = document.querySelector('#avatar-stage');
const avatar = document.querySelector('#avatar');
const avatarBody = avatar.querySelector('.avatar-body');
const avatarFace = avatar.querySelector('.avatar-face');
const heroVisual = document.querySelector('.hero-visual');
const heroBody = document.querySelector('.hero-avatar-body');
const heroFace = document.querySelector('.hero-avatar-face');
const heroMessage = document.querySelector('#hero-character-message');
const heroMessageArt = heroMessage.querySelector('.hero-message-art');
const fruitButtons = [...document.querySelectorAll('[data-fruit]')];
const shapeButtons = [...document.querySelectorAll('[data-shape]')];
const expressionOptions = document.querySelector('#expression-options');
const colorButtons = [...document.querySelectorAll('[data-color]')];
const finishButton = document.querySelector('.finish-character');
const nameInput = document.querySelector('#character-name');
// Clave propia de esta propuesta. La versión anterior no debe aparecer ya personalizada aquí.
const storageKey = 'itasoRedesignCharacterV2';
const pointsStorageKey = 'itaso-nna-points-v1';
const removedExpression = 11;
const expressionReward = { expression: 'recompensa', threshold: 40 };
let hasCustomizedThisVisit = false;

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

const initialState = () => ({
  fruit: null,
  shape: null,
  expression: null,
  background: '#ffd21f',
  name: ''
});

let characterState = initialState();
let lastCustomizerOpener = null;

function readSavedCharacter() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    return saved && characterAssets[saved.fruit] ? saved : null;
  } catch (_) {
    return null;
  }
}

function saveCharacter(character) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(character));
  } catch (_) {
    // La personalización sigue funcionando aunque el navegador bloquee localStorage.
  }
}

function hasExpressionReward() {
  try {
    const state = JSON.parse(window.localStorage.getItem(pointsStorageKey));
    return Number(state?.total || 0) >= expressionReward.threshold;
  } catch (_) {
    return false;
  }
}

function hasPointReward(threshold) {
  try {
    const state = JSON.parse(window.localStorage.getItem(pointsStorageKey));
    return Number(state?.total || 0) >= threshold;
  } catch (_) {
    return false;
  }
}

fruitButtons.forEach((button) => {
  const threshold = Number(button.dataset.unlockThreshold || 0);
  if (!threshold) return;
  const unlocked = hasPointReward(threshold);
  button.disabled = !unlocked;
  button.classList.toggle('is-locked-reward', !unlocked);
  button.setAttribute('aria-label', unlocked ? 'Fresa' : `Fresa, se desbloquea con ${threshold} puntos`);
  button.title = unlocked ? 'Fresa desbloqueada' : `${threshold} puntos para desbloquear la fresa`;
});

const availableExpressions = Array.from({ length: 12 }, (_, index) => index + 1)
  .filter((index) => index !== removedExpression);
if (hasExpressionReward()) availableExpressions.push(expressionReward.expression);

function expressionSource(expression) {
  return expression === expressionReward.expression
    ? '../assets/recompensa-nueva-expresion.svg'
    : `../assets/expressions-svg/expression-${expression}.png`;
}

for (const index of availableExpressions) {
  const button = document.createElement('button');
  button.className = 'option expression-option';
  button.type = 'button';
  button.dataset.expression = String(index);
  button.disabled = true;
  button.setAttribute('aria-label', index === expressionReward.expression ? 'Expresión desbloqueada' : `Expresión ${index}`);
  button.setAttribute('aria-pressed', 'false');
  button.innerHTML = `<img src="${expressionSource(index)}" alt="">`;
  expressionOptions.append(button);
}

const expressionButtons = [...document.querySelectorAll('[data-expression]')];

function markSelected(buttons, selectedButton) {
  buttons.forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle('is-selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

function setFacePlacement(target, fruit = characterState.fruit, shape = characterState.shape) {
  if (!fruit || shape === null) return;
  const setting = faceSettings[fruit][shape];
  target.style.top = `${setting.top}%`;
  target.style.width = `${setting.width}%`;
}

function renderCustomizerAvatar() {
  const hasBody = characterState.fruit && characterState.shape !== null;
  avatar.classList.toggle('is-empty', !hasBody);
  if (hasBody) avatarBody.src = characterAssets[characterState.fruit][characterState.shape];
  else avatarBody.removeAttribute('src');
  avatarBody.alt = hasBody ? `Personaje ${characterState.fruit}` : '';
  if (characterState.expression) avatarFace.src = expressionSource(characterState.expression);
  else avatarFace.removeAttribute('src');
  avatarFace.hidden = !hasBody || !characterState.expression;
  if (hasBody) setFacePlacement(avatarFace);
  avatarStage.style.backgroundColor = characterState.background;
  finishButton.disabled = !hasBody;
}

function updateShapeChoices() {
  const assets = characterState.fruit ? characterAssets[characterState.fruit] : [];
  shapeButtons.forEach((button, index) => {
    button.disabled = !characterState.fruit;
    if (assets[index]) button.querySelector('img').src = assets[index];
    else button.querySelector('img').removeAttribute('src');
    button.querySelector('img').alt = characterState.fruit ? `Forma ${index + 1} de ${characterState.fruit}` : '';
  });
}

function selectFruit(fruit, preserveShape = false) {
  characterState.fruit = fruit;
  if (!preserveShape) {
    characterState.shape = null;
    characterState.expression = null;
  }
  markSelected(fruitButtons, fruitButtons.find((button) => button.dataset.fruit === fruit));
  markSelected(shapeButtons, null);
  markSelected(expressionButtons, null);
  updateShapeChoices();
  expressionButtons.forEach((button) => { button.disabled = characterState.shape === null; });
  renderCustomizerAvatar();
}

function selectShape(shape) {
  characterState.shape = Number(shape);
  markSelected(shapeButtons, shapeButtons.find((button) => Number(button.dataset.shape) === characterState.shape));
  expressionButtons.forEach((button) => { button.disabled = false; });
  renderCustomizerAvatar();
}

function selectExpression(expression) {
  characterState.expression = expression === expressionReward.expression ? expressionReward.expression : Number(expression);
  markSelected(expressionButtons, expressionButtons.find((button) => {
    const value = button.dataset.expression === expressionReward.expression ? expressionReward.expression : Number(button.dataset.expression);
    return value === characterState.expression;
  }));
  renderCustomizerAvatar();
}

function selectBackground(background) {
  characterState.background = background;
  markSelected(colorButtons, colorButtons.find((button) => button.dataset.color === background));
  renderCustomizerAvatar();
}

function resetCustomizer() {
  characterState = initialState();
  markSelected(fruitButtons, null);
  markSelected(shapeButtons, null);
  markSelected(expressionButtons, null);
  updateShapeChoices();
  expressionButtons.forEach((button) => { button.disabled = true; });
  nameInput.value = '';
  selectBackground(characterState.background);
  renderCustomizerAvatar();
}

function loadCharacterIntoCustomizer(saved) {
  resetCustomizer();
  characterState = {
    ...initialState(),
    fruit: saved.fruit,
    shape: saved.shape,
    expression: availableExpressions.includes(saved.expression) ? saved.expression : null,
    background: saved.background || '#ffd21f',
    name: saved.name || ''
  };
  selectFruit(characterState.fruit, true);
  selectShape(characterState.shape);
  if (characterState.expression) selectExpression(characterState.expression);
  selectBackground(characterState.background);
  nameInput.value = characterState.name || '';
}

function renderHeroCharacter(saved) {
  if (!saved || !characterAssets[saved.fruit] || saved.shape === null) return;
  heroBody.src = characterAssets[saved.fruit][saved.shape];
  heroBody.alt = `Personaje ${saved.fruit} personalizado`;
  heroFace.src = saved.expression ? expressionSource(saved.expression) : '';
  heroFace.hidden = !saved.expression;
  if (saved.expression) setFacePlacement(heroFace, saved.fruit, saved.shape);
  heroVisual.style.setProperty('--hero-bg', saved.background || '#ffd21f');
  heroMessageArt.src = '../assets/texto-2.svg';
  heroMessageArt.alt = saved.name
    ? `Todo listo, ${saved.name}. Tu personaje está listo para descubrir.`
    : 'Tu personaje está listo para descubrir.';
}

function openCustomizer(event) {
  if (event) event.preventDefault();
  lastCustomizerOpener = event?.currentTarget || document.activeElement;
  const saved = hasCustomizedThisVisit ? readSavedCharacter() : null;
  if (saved) loadCharacterIntoCustomizer(saved);
  else resetCustomizer();
  customizer.hidden = false;
  document.body.classList.add('customizing');
  customizer.scrollTop = 0;
  customizerClose.focus();
}

function closeCustomizer() {
  if (customizer.hidden) return;
  customizer.hidden = true;
  document.body.classList.remove('customizing');
  lastCustomizerOpener?.focus();
}

customizerOpeners.forEach((opener) => opener.addEventListener('click', openCustomizer));
customizerClosers.forEach((closer) => closer.addEventListener('click', closeCustomizer));

fruitButtons.forEach((button) => button.addEventListener('click', () => selectFruit(button.dataset.fruit)));
shapeButtons.forEach((button) => button.addEventListener('click', () => selectShape(button.dataset.shape)));
expressionButtons.forEach((button) => button.addEventListener('click', () => selectExpression(button.dataset.expression)));
colorButtons.forEach((button) => button.addEventListener('click', () => selectBackground(button.dataset.color)));

finishButton.addEventListener('click', () => {
  if (!characterState.fruit || characterState.shape === null) return;
  characterState.name = nameInput.value.trim();
  saveCharacter(characterState);
  hasCustomizedThisVisit = true;
  renderHeroCharacter(characterState);
  closeCustomizer();
});


document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!customizer.hidden) closeCustomizer();
  else closeMenu();
});
