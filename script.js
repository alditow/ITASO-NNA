const notice = document.querySelector('.route-notice');
let noticeTimer;
function showNotice(message) {
  clearTimeout(noticeTimer);
  notice.textContent = message;
  notice.classList.add('is-visible');
  noticeTimer = setTimeout(() => notice.classList.remove('is-visible'), 2200);
}

document.querySelectorAll('[data-pending]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showNotice(`${link.dataset.pending} estará disponible en la siguiente etapa.`);
  });
});

const downSign = document.querySelector('.down-sign');
window.addEventListener('scroll', () => {
  const fadeDistance = Math.min(window.innerHeight * .34, 280);
  downSign.style.opacity = String(Math.max(0, 1 - window.scrollY / fadeDistance));
}, { passive: true });

const customizer = document.querySelector('.customizer');
const openCustomizer = document.querySelector('#open-customizer');
const closeCustomizer = document.querySelector('#close-customizer');
const avatar = document.querySelector('#avatar');
const avatarBody = avatar.querySelector('.avatar-body');
const avatarFace = avatar.querySelector('.avatar-face');
const avatarStage = document.querySelector('#avatar-stage');
const expressionOptions = document.querySelector('#expression-options');
const experienceScreens = document.querySelectorAll('.experience-screen');
let savedCharacter = null;
const assetForFruit = {
  tomate: ['assets/tomate-1.svg', 'assets/tomate-2.svg', 'assets/tomate-3.svg'],
  zanahoria: ['assets/zanahoria-1.svg', 'assets/zanahoria-2.svg', 'assets/zanahoria-3.svg'],
  naranja: ['assets/naranja-1.svg', 'assets/naranja-2.svg', 'assets/naranja-3.svg'],
  berenjena: ['assets/berenjena-1.svg', 'assets/berenjena-2.svg', 'assets/berenjena-3.svg']
};
let currentFruit = null;
let currentShape = null;
let currentExpression = null;
let currentBackground = null;
let characterRevealTimer;

function selectInGroup(selector, selected) {
  document.querySelectorAll(selector).forEach((item) => item.classList.toggle('is-selected', item === selected));
}

function sheetPosition(index, count) {
  return count === 1 ? '0%' : `${(index / (count - 1)) * 100}%`;
}

function updateAvatar() {
  if (!currentFruit || currentShape === null) {
    avatar.classList.add('is-empty');
    avatar.removeAttribute('data-fruit');
    avatar.removeAttribute('data-shape');
    avatarBody.removeAttribute('src');
    avatarFace.removeAttribute('src');
    return;
  }
  const assets = assetForFruit[currentFruit];
  avatar.classList.remove('is-empty');
  avatar.dataset.fruit = currentFruit;
  avatar.dataset.shape = currentShape;
  avatarBody.src = assets[currentShape];
  if (currentExpression !== null) avatarFace.src = `assets/expressions-svg/expression-${currentExpression + 1}.png`;
  else avatarFace.removeAttribute('src');
  document.querySelectorAll('.shape-option img').forEach((preview, index) => {
    preview.src = assets[index];
  });
}

for (let index = 0; index < 12; index += 1) {
  const button = document.createElement('button');
  const face = document.createElement('img');
  button.type = 'button';
  button.className = 'option expression-option';
  button.disabled = true;
  button.setAttribute('aria-label', `Expresión ${index + 1}`);
  face.src = `assets/expressions-svg/expression-${index + 1}.png`;
  face.alt = '';
  button.append(face);
  button.addEventListener('click', () => {
    if (currentShape === null) return;
    currentExpression = index;
    selectInGroup('.expression-option', button);
    updateAvatar();
  });
  expressionOptions.append(button);
}

document.querySelectorAll('.fruit-option').forEach((button) => {
  button.addEventListener('click', () => {
    currentFruit = button.dataset.fruit;
    currentShape = null;
    currentExpression = null;
    selectInGroup('.fruit-option', button);
    selectInGroup('.shape-option', null);
    selectInGroup('.expression-option', null);
    const assets = assetForFruit[currentFruit];
    document.querySelectorAll('.shape-option').forEach((shapeButton, index) => {
      shapeButton.disabled = false;
      shapeButton.querySelector('img').src = assets[index];
    });
    document.querySelectorAll('.expression-option').forEach((item) => { item.disabled = true; });
    updateAvatar();
  });
});
document.querySelectorAll('.shape-option').forEach((button) => {
  button.addEventListener('click', () => {
    currentShape = Number(button.dataset.shape);
    currentExpression = null;
    selectInGroup('.shape-option', button);
    selectInGroup('.expression-option', null);
    document.querySelectorAll('.expression-option').forEach((item) => { item.disabled = false; });
    updateAvatar();
  });
});
document.querySelectorAll('.color-option').forEach((button) => {
  button.addEventListener('click', () => {
    currentBackground = button.dataset.color;
    avatarStage.style.backgroundColor = button.dataset.color;
    selectInGroup('.color-option', button);
  });
});

function setCustomizer(open, options = {}) {
  if (open) {
    if (options.preserve && savedCharacter?.body) populateCustomizerFromSaved();
    else resetCustomizer();
  }
  customizer.hidden = !open;
  document.body.classList.toggle('customizing', open);
  const floating = document.querySelector('.floating-character');
  if (open) floating.hidden = true;
  else {
    const activeRoute = document.querySelector('.experience-screen:not([hidden])')?.id;
    floating.hidden = !savedCharacter?.body || !activeRoute || activeRoute === 'menu-nna';
  }
  if (open) {
    closeCustomizer.focus({ preventScroll: true });
    requestAnimationFrame(() => customizer.scrollTo({ top: 0, behavior: 'instant' }));
  }
}
function populateCustomizerFromSaved() {
  currentFruit = savedCharacter.fruit;
  currentShape = savedCharacter.shape;
  currentExpression = savedCharacter.expression;
  currentBackground = savedCharacter.background || '#ffd20a';
  document.querySelector('#character-name').value = savedCharacter.name || '';
  document.querySelectorAll('input[name="age"]').forEach((input) => { input.checked = input.value === savedCharacter.age; });
  document.querySelectorAll('.fruit-option').forEach((button) => button.classList.toggle('is-selected', button.dataset.fruit === currentFruit));
  const assets = assetForFruit[currentFruit];
  document.querySelectorAll('.shape-option').forEach((button, index) => {
    button.disabled = false;
    button.querySelector('img').src = assets[index];
    button.classList.toggle('is-selected', Number(button.dataset.shape) === currentShape);
  });
  document.querySelectorAll('.expression-option').forEach((button, index) => {
    button.disabled = false;
    button.classList.toggle('is-selected', index === currentExpression);
  });
  document.querySelectorAll('.color-option').forEach((button) => button.classList.toggle('is-selected', button.dataset.color === currentBackground));
  avatarStage.style.backgroundColor = currentBackground;
  updateAvatar();
}
function resetCustomizer() {
  currentFruit = null;
  currentShape = null;
  currentExpression = null;
  currentBackground = null;
  document.querySelector('#character-name').value = '';
  document.querySelectorAll('input[name="age"]').forEach((input) => { input.checked = false; });
  document.querySelectorAll('.fruit-option,.shape-option,.expression-option,.color-option').forEach((item) => item.classList.remove('is-selected'));
  document.querySelectorAll('.shape-option').forEach((button) => {
    button.disabled = true;
    button.querySelector('img').removeAttribute('src');
  });
  document.querySelectorAll('.expression-option').forEach((button) => { button.disabled = true; });
  avatarStage.style.backgroundColor = '#ffd20a';
  updateAvatar();
}
openCustomizer.addEventListener('click', () => setCustomizer(true));
closeCustomizer.addEventListener('click', () => setCustomizer(false));
document.querySelector('.finish-character').addEventListener('click', () => {
  const name = document.querySelector('#character-name').value.trim();
  const age = document.querySelector('input[name="age"]:checked')?.value || '';
  savedCharacter = currentFruit && currentShape !== null ? {
    fruit: currentFruit,
    shape: currentShape,
    expression: currentExpression,
    body: assetForFruit[currentFruit][currentShape],
    face: currentExpression === null ? null : `assets/expressions-svg/expression-${currentExpression + 1}.png`,
    name,
    age,
    background: currentBackground || '#ffd20a'
  } : { name };
  renderMenuCharacter();
  setCustomizer(false);
  showExperience('menu-nna');
});
resetCustomizer();

function renderMenuCharacter() {
  const wrapper = document.querySelector('.menu-character');
  const floatingWrapper = document.querySelector('.floating-character');
  const menuName = document.querySelector('.menu-name');
  const menuComma = document.querySelector('.menu-comma');
  const body = document.querySelector('.menu-character-body');
  const face = document.querySelector('.menu-character-face');
  const hasBody = Boolean(savedCharacter?.body);
  wrapper.hidden = !hasBody;
  wrapper.classList.remove('is-visible');
  menuComma.textContent = savedCharacter?.name ? ',' : '';
  menuName.textContent = savedCharacter?.name ? ` ${savedCharacter.name}` : '';
  floatingWrapper.hidden = !hasBody;
  if (!hasBody) return;
  wrapper.style.backgroundColor = savedCharacter.background || '#18b5dd';
  wrapper.dataset.fruit = savedCharacter.fruit;
  wrapper.dataset.shape = savedCharacter.shape;
  body.src = savedCharacter.body;
  if (savedCharacter.face) {
    face.src = savedCharacter.face;
    face.hidden = false;
  } else {
    face.hidden = true;
  }
  const faceSettings = getFaceSettings(savedCharacter.fruit, savedCharacter.shape);
  face.style.top = `${faceSettings.top}%`;
  face.style.width = `${faceSettings.width}%`;
  const floatingBody = floatingWrapper.querySelector('.floating-character-body');
  const floatingFace = floatingWrapper.querySelector('.floating-character-face');
  floatingBody.src = savedCharacter.body;
  floatingWrapper.dataset.fruit = savedCharacter.fruit;
  floatingWrapper.dataset.shape = savedCharacter.shape;
  if (savedCharacter.face) {
    floatingFace.src = savedCharacter.face;
    floatingFace.hidden = false;
  } else floatingFace.hidden = true;
  floatingFace.style.top = `${faceSettings.top}%`;
  floatingFace.style.width = `${faceSettings.width}%`;
}

function getFaceSettings(fruit, shape) {
  return {
    tomate: [{top:52,width:28},{top:55,width:25},{top:50,width:23}],
    zanahoria: [{top:50,width:22},{top:58,width:20},{top:62,width:19}],
    naranja: [{top:50,width:25},{top:51,width:23},{top:50,width:22}],
    berenjena: [{top:51,width:23},{top:54,width:29},{top:52,width:20}]
  }[fruit][shape];
}

let menuReturnRoute = 'recursos';
function showExperience(route, options = {}) {
  if (route === 'menu-nna' && !savedCharacter?.body) route = 'recursos';
  experienceScreens.forEach((screen) => { screen.hidden = screen.id !== route; });
  document.body.classList.add('experience-active');
  clearTimeout(characterRevealTimer);
  const menuCharacter = document.querySelector('.menu-character');
  const floatingCharacter = document.querySelector('.floating-character');
  const menuClose = document.querySelector('.menu-overlay-close');
  menuCharacter.classList.remove('is-visible');
  if (route === 'menu-nna' && savedCharacter?.body) {
    characterRevealTimer = setTimeout(() => menuCharacter.classList.add('is-visible'), 1000);
  }
  floatingCharacter.hidden = !savedCharacter?.body || route === 'menu-nna';
  menuClose.hidden = route !== 'menu-nna' || !options.fromAvatar;
  if (route === 'memorama') startMemoryGame();
  if (route === 'cual-tiene-mas') startCompareGame();
  if (route === 'recursos') awardPoints('area-recursos', 5);
  if (route === 'juegos') awardPoints('area-juegos', 5);
  if (route === 'misiones') awardPoints('area-misiones', 5);
  if (route === 'logros') renderRewards();
  window.scrollTo({ top: 0, behavior: 'instant' });
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  history.replaceState(null, '', `#${route}`);
}

function leaveExperience() {
  experienceScreens.forEach((screen) => { screen.hidden = true; });
  document.body.classList.remove('experience-active');
  history.replaceState(null, '', '#inicio');
  document.querySelector('#inicio').scrollIntoView({ behavior: 'instant' });
}

document.querySelectorAll('.experience-logo').forEach((button) => {
  button.removeAttribute('data-route');
  button.classList.add('intro-return');
  button.setAttribute('aria-label', 'Volver al principio de ITASO');
});

document.querySelectorAll('.experience-header nav').forEach((nav) => {
  const screenId = nav.closest('.experience-screen')?.id;
  ['recursos', 'juegos', 'misiones', 'logros', 'compartir'].forEach((route) => {
    let button = nav.querySelector(`[data-route="${route}"]`);
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.dataset.route = route;
      button.textContent = route.charAt(0).toUpperCase() + route.slice(1);
      nav.append(button);
    }
    button.classList.toggle('is-current', screenId === route || (screenId === 'memorama' && route === 'juegos') || (screenId === 'cual-tiene-mas' && route === 'juegos'));
  });
});

document.querySelectorAll('.site-header,.experience-header').forEach((header) => {
  const account = document.createElement('div');
  account.className = 'account-control';
  account.innerHTML = '<button class="account-trigger" type="button" aria-expanded="false">Cuenta</button><div class="account-popover" hidden><button type="button">Iniciar sesión</button><button type="button">Registrarse</button></div>';
  const trigger = account.querySelector('.account-trigger');
  const popover = account.querySelector('.account-popover');
  trigger.addEventListener('click', () => {
    const open = popover.hidden;
    document.querySelectorAll('.account-popover').forEach((menu) => { menu.hidden = true; });
    document.querySelectorAll('.account-trigger').forEach((item) => item.setAttribute('aria-expanded', 'false'));
    popover.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
  });
  popover.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    showNotice(`${button.textContent} estará disponible en la siguiente etapa.`);
    popover.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }));
  header.append(account);
});

document.querySelectorAll('.share-prompts button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.share-prompts button').forEach((item) => item.classList.toggle('is-selected', item === button));
    document.querySelector('#share-preview-text').textContent = button.querySelector('span').textContent;
    awardPoints(`descubrimiento-${button.textContent.trim()}`, 5);
  });
});

document.querySelectorAll('[data-route]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (button.dataset.route === 'juegos') {
      window.location.href = 'propuesta-rediseño/juegos.html';
      return;
    }
    if (button.dataset.route === 'misiones') {
      window.location.href = 'propuesta-rediseño/misiones.html';
      return;
    }
    if (button.dataset.route === 'logros') {
      window.location.href = 'propuesta-rediseño/logros.html';
      return;
    }
    if (button.dataset.route === 'compartir') {
      window.location.href = 'propuesta-rediseño/compartir.html';
      return;
    }
    if (button.dataset.route === 'recursos' && button.closest('#memorama, #cual-tiene-mas')) {
      window.location.href = 'propuesta-rediseño/recursos.html';
      return;
    }
    showExperience(button.dataset.route);
  });
});
document.querySelectorAll('.edit-character').forEach((button) => {
  button.addEventListener('click', () => setCustomizer(true, { preserve: true }));
});
document.querySelectorAll('.intro-return').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.closest('#memorama, #cual-tiene-mas')) {
      window.location.href = 'propuesta-rediseño/index.html';
      return;
    }
    leaveExperience();
  });
});
document.querySelector('#enter-without-character').addEventListener('click', () => {
  savedCharacter = null;
  renderMenuCharacter();
  showExperience('recursos');
});
document.querySelectorAll('.resource-layout button,.game button:not([data-route]),.missions-layout button').forEach((button, index) => {
  button.addEventListener('click', () => {
    const area = button.closest('.resource-layout') ? 'recurso' : button.closest('.missions-layout') ? 'mision' : 'juego';
    awardPoints(`${area}-${index}-${button.closest('article')?.querySelector('h3')?.textContent || button.textContent}`, area === 'mision' ? 10 : 5);
    showNotice('Este contenido se desarrollará en la siguiente etapa.');
  });
});

const rewardsCatalog = [
  { threshold: 40, name: 'Nueva expresión', type: 'Expresión', image: 'assets/recompensa-nueva-expresion.svg' },
  { threshold: 80, name: 'Insignia exploradora', type: 'Insignia', image: 'assets/recompensa-trofeo.svg' },
  { threshold: 140, name: 'Nuevo personaje', type: 'Personaje', image: 'assets/recompensa-nuevo-personaje.svg' },
  { threshold: 210, name: 'Movimiento sorpresa', type: 'Animación', image: 'assets/menu-juegos.svg' }
];
const pointsKey = 'itaso-nna-points-v1';
let pointsState = loadPoints();

function loadPoints() {
  try { return JSON.parse(localStorage.getItem(pointsKey)) || { total: 0, events: {} }; }
  catch { return { total: 0, events: {} }; }
}

function awardPoints(eventKey, amount) {
  if (pointsState.events[eventKey]) return;
  pointsState.events[eventKey] = amount;
  pointsState.total += amount;
  try { localStorage.setItem(pointsKey, JSON.stringify(pointsState)); } catch {}
  renderRewards();
}

function rewardCard(reward, unlocked) {
  const article = document.createElement('article');
  article.className = `reward-card ${unlocked ? 'is-unlocked' : 'is-locked'}`;
  article.innerHTML = `<img src="${reward.image}" alt=""><div><span>${reward.type}</span><strong>${reward.name}</strong><small>${unlocked ? 'Desbloqueada' : `${reward.threshold} puntos`}</small></div>`;
  return article;
}

function renderRewards() {
  const total = document.querySelector('#points-total');
  if (!total) return;
  total.textContent = pointsState.total;
  const unlocked = rewardsCatalog.filter((reward) => pointsState.total >= reward.threshold);
  const locked = rewardsCatalog.filter((reward) => pointsState.total < reward.threshold);
  const next = locked[0];
  document.querySelector('#unlocked-rewards').replaceChildren(...(unlocked.length ? unlocked.map((reward) => rewardCard(reward, true)) : [Object.assign(document.createElement('p'), { className: 'empty-rewards', textContent: 'Explora ITASO para descubrir tu primera recompensa.' })]));
  document.querySelector('#locked-rewards').replaceChildren(...locked.map((reward) => rewardCard(reward, false)));
  const nextName = document.querySelector('#next-reward-name');
  const nextCopy = document.querySelector('#next-reward-copy');
  const nextImage = document.querySelector('#next-reward-image');
  const progress = document.querySelector('#reward-progress-bar');
  if (!next) {
    nextName.textContent = 'Colección completa';
    nextCopy.textContent = 'Has descubierto todas las recompensas disponibles.';
    nextImage.src = 'assets/menu-logros.svg';
    progress.style.width = '100%';
    return;
  }
  const previousThreshold = unlocked.at(-1)?.threshold || 0;
  nextName.textContent = next.name;
  nextCopy.textContent = `${next.threshold - pointsState.total} puntos más para desbloquearla`;
  nextImage.src = next.image;
  progress.style.width = `${Math.max(0, Math.min(100, ((pointsState.total - previousThreshold) / (next.threshold - previousThreshold)) * 100))}%`;
}

renderRewards();

const floatingCharacter = document.querySelector('.floating-character');
let floatingDrag = null;
let floatingMoved = false;
try {
  const position = JSON.parse(localStorage.getItem('itaso-nna-character-position'));
  if (position) {
    floatingCharacter.style.left = `${position.x}px`;
    floatingCharacter.style.top = `${position.y}px`;
    floatingCharacter.style.right = 'auto';
    floatingCharacter.style.bottom = 'auto';
  }
} catch {}
floatingCharacter.addEventListener('pointerdown', (event) => {
  const box = floatingCharacter.getBoundingClientRect();
  floatingDrag = { offsetX: event.clientX - box.left, offsetY: event.clientY - box.top };
  floatingMoved = false;
  floatingCharacter.setPointerCapture(event.pointerId);
  floatingCharacter.classList.add('is-dragging');
});
floatingCharacter.addEventListener('pointermove', (event) => {
  if (!floatingDrag) return;
  if (Math.abs(event.clientX - floatingDrag.offsetX - floatingCharacter.offsetLeft) > 6 || Math.abs(event.clientY - floatingDrag.offsetY - floatingCharacter.offsetTop) > 6) floatingMoved = true;
  const x = Math.max(8, Math.min(innerWidth - floatingCharacter.offsetWidth - 8, event.clientX - floatingDrag.offsetX));
  const y = Math.max(94, Math.min(innerHeight - floatingCharacter.offsetHeight - 8, event.clientY - floatingDrag.offsetY));
  floatingCharacter.style.left = `${x}px`;
  floatingCharacter.style.top = `${y}px`;
  floatingCharacter.style.right = 'auto';
  floatingCharacter.style.bottom = 'auto';
});
floatingCharacter.addEventListener('pointerup', (event) => {
  if (!floatingDrag) return;
  floatingCharacter.releasePointerCapture(event.pointerId);
  floatingDrag = null;
  floatingCharacter.classList.remove('is-dragging');
  try { localStorage.setItem('itaso-nna-character-position', JSON.stringify({ x: floatingCharacter.offsetLeft, y: floatingCharacter.offsetTop })); } catch {}
  if (!floatingMoved) {
    setCustomizer(true, { preserve: true });
  }
});
document.querySelector('.menu-overlay-close').addEventListener('click', () => showExperience(menuReturnRoute));

const compareProducts = new Map(window.CUAL_TIENE_MAS_PRODUCTS.map((product) => [product.id, product]));
const compareLeft = document.querySelector('#compare-left');
const compareRight = document.querySelector('#compare-right');
const compareResult = document.querySelector('#compare-result');
const compareFinish = document.querySelector('#compare-finish');
let compareRoundIndex = 0;
let compareLocked = false;
let compareAnswers = [];

function fillCompareChoice(button, product) {
  button.dataset.productId = product.id;
  button.setAttribute('aria-label', `Elegir ${product.name}`);
  const image = button.querySelector('img');
  image.src = product.image;
  image.alt = product.name;
  button.querySelector('strong').textContent = product.name;
  button.classList.remove('is-selected', 'is-higher', 'is-lower');
  button.disabled = false;
}

function renderCompareRound() {
  const pair = window.CUAL_TIENE_MAS_ROUNDS[compareRoundIndex];
  const products = pair.map((id) => compareProducts.get(id));
  if (Math.random() > .5) products.reverse();
  fillCompareChoice(compareLeft, products[0]);
  fillCompareChoice(compareRight, products[1]);
  compareResult.hidden = true;
  compareFinish.hidden = true;
  document.querySelector('#compare-arena').hidden = false;
  document.querySelector('.compare-progress').hidden = false;
  renderCompareProgress();
  compareLocked = false;
}

function startCompareGame() {
  compareRoundIndex = 0;
  compareAnswers = [];
  renderCompareRound();
}

function renderCompareProgress() {
  const correctAnswers = compareAnswers.filter(Boolean).length;
  document.querySelector('#compare-progress-text').textContent = `Aciertos: ${correctAnswers} de ${window.CUAL_TIENE_MAS_ROUNDS.length}`;
  const track = document.querySelector('#compare-progress-track');
  track.replaceChildren();
  window.CUAL_TIENE_MAS_ROUNDS.forEach((_, index) => {
    const segment = document.createElement('i');
    if (index < compareAnswers.length) segment.className = compareAnswers[index] ? 'is-correct' : 'is-error';
    else if (index === compareRoundIndex) segment.className = 'is-current';
    track.append(segment);
  });
}

function chooseCompareProduct(button) {
  if (compareLocked) return;
  compareLocked = true;
  const leftProduct = compareProducts.get(compareLeft.dataset.productId);
  const rightProduct = compareProducts.get(compareRight.dataset.productId);
  const higher = leftProduct.sugarPer100 > rightProduct.sugarPer100 ? leftProduct : rightProduct;
  const lower = higher === leftProduct ? rightProduct : leftProduct;
  const chosen = compareProducts.get(button.dataset.productId);
  compareLeft.disabled = true;
  compareRight.disabled = true;
  const isCorrect = chosen === higher;
  compareAnswers.push(isCorrect);
  renderCompareProgress();
  button.classList.add('is-selected');
  (higher === leftProduct ? compareLeft : compareRight).classList.add('is-higher');
  (lower === leftProduct ? compareLeft : compareRight).classList.add('is-lower');
  const leftValue = document.querySelector('#compare-left-value');
  const rightValue = document.querySelector('#compare-right-value');
  leftValue.textContent = '0.0 g';
  rightValue.textContent = '0.0 g';
  compareResult.classList.toggle('is-correct', isCorrect);
  compareResult.classList.toggle('is-error', !isCorrect);
  document.querySelector('#compare-result-title').textContent = isCorrect ? 'CORRECTO' : 'REVISA LOS DATOS';
  const difference = Math.abs(higher.sugarPer100 - lower.sugarPer100);
  document.querySelector('#compare-result-copy').textContent = difference < .25
    ? `${higher.name} y ${lower.name} tienen cantidades muy parecidas por 100 ml.`
    : `${higher.name} declara más azúcares por 100 ml que ${lower.name}. Esto no vuelve bueno o malo a ninguno: la cifra sirve para compararlos.`;
  const resultMessage = document.querySelector('.compare-message');
  const nextButton = document.querySelector('#compare-next');
  resultMessage.hidden = true;
  nextButton.hidden = true;
  compareResult.hidden = false;
  compareResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
  nextButton.textContent = compareRoundIndex === window.CUAL_TIENE_MAS_ROUNDS.length - 1 ? 'Ver resultado final' : 'Siguiente comparación';
  Promise.all([
    animateCompareValue(leftValue, leftProduct),
    animateCompareValue(rightValue, rightProduct)
  ]).then(() => {
    resultMessage.hidden = false;
    nextButton.hidden = false;
    nextButton.focus();
  });
}

function animateCompareValue(element, product) {
  return new Promise((resolve) => {
    const startedAt = performance.now();
    const duration = 1150;
    const approximate = product.display.trim().startsWith('≈');
    function tick(now) {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${approximate ? '≈ ' : ''}${(product.sugarPer100 * eased).toFixed(1)} g`;
      if (progress < 1) requestAnimationFrame(tick);
      else {
        element.textContent = product.display;
        resolve();
      }
    }
    requestAnimationFrame(tick);
  });
}

[compareLeft, compareRight].forEach((button) => button.addEventListener('click', () => chooseCompareProduct(button)));
document.querySelector('#compare-next').addEventListener('click', () => {
  compareRoundIndex += 1;
  if (compareRoundIndex >= window.CUAL_TIENE_MAS_ROUNDS.length) {
    document.querySelector('#compare-arena').hidden = true;
    document.querySelector('.compare-progress').hidden = true;
    compareResult.hidden = true;
    compareFinish.hidden = false;
    awardPoints('juego-cual-tiene-mas-completo', 20);
    document.querySelector('#compare-restart').focus();
  } else renderCompareRound();
});
document.querySelector('#compare-restart').addEventListener('click', startCompareGame);

const memoryBoard = document.querySelector('#memory-board');
const learningOverlay = document.querySelector('#memory-learning');
const finishOverlay = document.querySelector('#memory-finish');
let memoryDeck = [];
let firstMemoryCard = null;
let secondMemoryCard = null;
let memoryLocked = false;
let matchedProducts = new Set();
let pendingCompletedGame = false;

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function createMemoryDeck() {
  return shuffle(window.MEMORAMA_PRODUCTS.flatMap((product) => [
    { ...product, id: `${product.productId}-1` },
    { ...product, id: `${product.productId}-2` }
  ]));
}

function startMemoryGame() {
  memoryDeck = createMemoryDeck();
  firstMemoryCard = null;
  secondMemoryCard = null;
  memoryLocked = false;
  pendingCompletedGame = false;
  matchedProducts = new Set();
  learningOverlay.hidden = true;
  finishOverlay.hidden = true;
  renderMemoryBoard();
  updateMemoryStatus();
}

function renderMemoryBoard() {
  memoryBoard.replaceChildren();
  memoryDeck.forEach((card, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'memory-card';
    button.dataset.cardId = card.id;
    button.setAttribute('aria-label', `Carta ${index + 1}, boca abajo`);
    button.innerHTML = `
      <span class="memory-card-inner">
        <span class="memory-card-face memory-card-back"><img src="assets/memorama/reverso.svg" alt=""></span>
        <span class="memory-card-face memory-card-front"><img src="${card.image}" alt="${card.name}"><span>${card.name}</span></span>
      </span>`;
    button.addEventListener('click', () => flipMemoryCard(button, card));
    memoryBoard.append(button);
  });
}

function flipMemoryCard(button, card) {
  if (memoryLocked || button.classList.contains('is-flipped') || button.classList.contains('is-matched')) return;
  button.classList.add('is-flipped');
  button.setAttribute('aria-label', `${card.name}, carta volteada`);
  if (!firstMemoryCard) {
    firstMemoryCard = { button, card };
    return;
  }
  secondMemoryCard = { button, card };
  memoryLocked = true;
  if (firstMemoryCard.card.productId === secondMemoryCard.card.productId) {
    firstMemoryCard.button.classList.add('is-matched');
    secondMemoryCard.button.classList.add('is-matched');
    matchedProducts.add(card.productId);
    pendingCompletedGame = matchedProducts.size === window.MEMORAMA_PRODUCTS.length;
    updateMemoryStatus();
    const matchedProduct = card;
    window.setTimeout(() => showLearningMoment(matchedProduct), 620);
  } else {
    window.setTimeout(() => {
      [firstMemoryCard, secondMemoryCard].forEach(({ button: cardButton }, index) => {
        cardButton.classList.remove('is-flipped');
        const cardNumber = [...memoryBoard.children].indexOf(cardButton) + 1;
        cardButton.setAttribute('aria-label', `Carta ${cardNumber}, boca abajo`);
      });
      clearMemoryTurn();
    }, 900);
  }
}

function clearMemoryTurn() {
  firstMemoryCard = null;
  secondMemoryCard = null;
  memoryLocked = false;
}

function updateMemoryStatus() {
  document.querySelector('#memory-pairs').textContent = `${matchedProducts.size} de ${window.MEMORAMA_PRODUCTS.length} parejas`;
}

function createWarningSeal(type) {
  const seal = document.createElement('div');
  seal.className = 'warning-seal';
  seal.dataset.sealType = type;
  seal.textContent = type === 'sugar' ? 'Exceso de azúcares' : 'Exceso de calorías';
  return seal;
}

function renderMemoryCharacter(containerSelector) {
  const container = document.querySelector(containerSelector);
  const body = container.querySelector('img:first-child');
  const face = container.querySelector('img:last-child');
  if (savedCharacter?.body) {
    body.src = savedCharacter.body;
    const settings = getFaceSettings(savedCharacter.fruit, savedCharacter.shape);
    if (savedCharacter.face) {
      face.src = savedCharacter.face;
      face.hidden = false;
      face.style.top = `${settings.top}%`;
      face.style.width = `${settings.width}%`;
    } else {
      face.hidden = true;
    }
  } else {
    body.src = 'assets/tomate-hero.svg';
    face.hidden = true;
  }
}

function showLearningMoment(product) {
  const productImage = document.querySelector('#learning-product-image');
  productImage.src = product.image;
  productImage.alt = product.name;
  document.querySelector('#learning-product-name').textContent = product.name;
  document.querySelector('#learning-message').textContent = product.message;
  const sealList = document.querySelector('#learning-seals');
  sealList.replaceChildren();
  if (product.seals.length) product.seals.forEach((type) => sealList.append(createWarningSeal(type)));
  else {
    const noSeals = document.createElement('div');
    noSeals.className = 'no-seals';
    noSeals.textContent = 'Sin sellos de advertencia';
    sealList.append(noSeals);
  }

  const sugar = product.sugar;
  document.querySelector('#learning-sugar-kicker').textContent = sugar.value === null ? 'Información de azúcar' : 'Azúcares añadidos';
  document.querySelector('#learning-sugar-value').textContent = sugar.display;
  document.querySelector('#learning-sugar-qualifier').textContent = sugar.qualifier;
  document.querySelector('#learning-sugar-basis').textContent = sugar.basis;
  document.querySelector('#learning-teaspoons-label').textContent = sugar.teaspoonsLabel;

  const teaspoonVisual = document.querySelector('#learning-teaspoons');
  teaspoonVisual.replaceChildren();
  if (sugar.teaspoons !== null) {
    const completeSpoons = Math.floor(sugar.teaspoons);
    const fraction = sugar.teaspoons - completeSpoons;
    const spoonCount = completeSpoons + (fraction > 0 ? 1 : 0);
    for (let index = 0; index < spoonCount; index += 1) {
      const spoon = document.createElement('span');
      spoon.className = 'teaspoon-icon';
      spoon.setAttribute('aria-hidden', 'true');
      if (index === spoonCount - 1 && fraction > 0) {
        spoon.style.opacity = String(Math.max(.3, fraction));
      }
      teaspoonVisual.append(spoon);
    }
    teaspoonVisual.setAttribute('aria-label', sugar.teaspoonsLabel);
  } else {
    teaspoonVisual.setAttribute('aria-label', 'Aproximación pendiente');
  }

  const comparison = document.querySelector('#learning-comparison');
  const comparisonName = document.querySelector('#comparison-product-name');
  const comparisonValue = document.querySelector('#comparison-product-value');
  const comparisonNote = document.querySelector('#comparison-note');
  if (product.comparison) {
    comparison.classList.remove('is-pending');
    comparisonName.textContent = product.comparison.label;
    comparisonValue.textContent = product.comparison.value;
    comparisonNote.textContent = product.comparison.note || 'Comparación con la información declarada en el empaque.';
  } else {
    comparison.classList.add('is-pending');
    comparisonName.textContent = 'Comparación numérica';
    comparisonValue.textContent = 'Pendiente';
    comparisonNote.textContent = 'Se mostrará cuando el dato esté confirmado.';
  }

  renderMemoryCharacter('.memory-guide-character');
  learningOverlay.hidden = false;
  document.querySelector('#continue-memory').focus();
}

document.querySelector('#continue-memory').addEventListener('click', () => {
  learningOverlay.hidden = true;
  clearMemoryTurn();
  if (pendingCompletedGame) showMemoryFinish();
  else memoryBoard.querySelector('.memory-card:not(.is-matched)')?.focus();
});

function showMemoryFinish() {
  awardPoints('juego-memorama-completo', 20);
  renderMemoryCharacter('.memory-celebration-character');
  finishOverlay.hidden = false;
  document.querySelector('#play-memory-again').focus();
}

document.querySelector('#restart-memory').addEventListener('click', startMemoryGame);
document.querySelector('#play-memory-again').addEventListener('click', startMemoryGame);

const initialRoute = location.hash.slice(1);
if (initialRoute === 'juegos' || initialRoute === 'misiones' || initialRoute === 'logros' || initialRoute === 'compartir') {
  window.location.replace(`propuesta-rediseño/${initialRoute}.html`);
} else if (['menu-nna', 'recursos', 'logros', 'compartir', 'cual-tiene-mas', 'memorama'].includes(initialRoute)) {
  showExperience(initialRoute);
}
