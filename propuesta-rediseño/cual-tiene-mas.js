const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const caregiverLink = document.querySelector('[data-caregiver-link]');
const notice = document.querySelector('.notice');

const introState = document.querySelector('#intro-state');
const questionState = document.querySelector('#question-state');
const resultState = document.querySelector('#result-state');
const finishState = document.querySelector('#finish-state');
const roundLabel = document.querySelector('#round-label');
const leftChoice = document.querySelector('#choice-left');
const rightChoice = document.querySelector('#choice-right');
const tieChoice = document.querySelector('#choice-tie');
const resultTitle = document.querySelector('#result-title');
const resultMessage = document.querySelector('#result-message');
const resultProducts = document.querySelector('#result-products');
const nextRound = document.querySelector('#next-round');
const restartGame = document.querySelector('#restart-game');
const startGameButton = document.querySelector('#start-game');

const DAILY_REFERENCE_G = 25;
const REFERENCE_TEASPOONS = 6;
const ROUNDS_PER_GAME = 5;
const POINTS_KEY = 'itaso-nna-points-v1';
const COMPLETION_EVENT = 'juego-cual-tiene-mas-completo';
const CHARACTER_KEY = 'itasoRedesignCharacterV2';
const drinks = new Map((window.ITASO_DRINKS || []).map((drink) => [drink.id, drink]));
const comparisonBank = window.ITASO_COMPARISON_BANK || [];

let rounds = [];
let roundIndex = 0;
let activePair = [];

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

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function buildRounds() {
  const tutorial = comparisonBank.find((comparison) => comparison.tutorial);
  const remaining = shuffle(comparisonBank.filter((comparison) => !comparison.tutorial)).slice(0, ROUNDS_PER_GAME - 1);
  return tutorial ? [tutorial, ...remaining] : remaining.slice(0, ROUNDS_PER_GAME);
}

function formatNumber(number) {
  return Number.isInteger(number) ? String(number) : number.toFixed(1).replace(/\.0$/, '');
}

function presentationLabel(drink) {
  return `${formatNumber(drink.presentation)} ${drink.unit}`;
}

function teaspoonsFor(grams) {
  return formatNumber(Math.round((grams * REFERENCE_TEASPOONS / DAILY_REFERENCE_G) * 10) / 10);
}

function fillChoice(button, drink) {
  const image = button.querySelector('img');
  image.src = drink.image;
  image.alt = drink.name;
  button.querySelector('strong').textContent = drink.name;
  button.querySelector('small').textContent = presentationLabel(drink);
  button.dataset.drinkId = drink.id;
  button.setAttribute('aria-label', `${drink.name}, envase de ${presentationLabel(drink)}`);
}

function showState(state) {
  document.querySelector('.compare-shell').classList.toggle('is-intro', state === 'intro');
  introState.hidden = state !== 'intro';
  questionState.hidden = state !== 'question';
  resultState.hidden = state !== 'result';
  finishState.hidden = state !== 'finish';
}

function renderIntroCharacter() {
  const characterBox = document.querySelector('.intro-character');
  const body = document.querySelector('.intro-character-body');
  const face = document.querySelector('.intro-character-face');
  if (!characterBox || !body || !face) return;
  characterBox.dataset.fruit = 'tomate';
  characterBox.dataset.shape = 'intro';
  body.src = '../assets/tomate-inicio.svg';
  body.alt = 'Personaje de ITASO';
  face.hidden = true;
  try {
    const character = JSON.parse(window.localStorage.getItem(CHARACTER_KEY));
    const asset = characterAssets[character?.fruit]?.[character?.shape];
    if (!asset) return;
    characterBox.dataset.fruit = character.fruit;
    characterBox.dataset.shape = String(character.shape);
    body.src = asset;
    body.alt = character.name ? `Personaje de ${character.name}` : 'Tu personaje de ITASO';
    if (character.expression) {
      const placement = faceSettings[character.fruit][character.shape];
      face.src = character.expression === 'recompensa' ? '../assets/recompensa-nueva-expresion.svg' : `../assets/expressions-svg/expression-${character.expression}.png`;
      face.style.top = `${placement.top}%`;
      face.style.width = `${placement.width}%`;
      face.hidden = false;
    }
  } catch (_) {
    // El personaje inicial permanece visible si no existe personalización guardada.
  }
}

function renderRound() {
  const comparison = rounds[roundIndex];
  if (!comparison) {
    renderFinish();
    return;
  }

  activePair = shuffle(comparison.products.map((id) => drinks.get(id)).filter(Boolean));
  if (activePair.length !== 2) {
    showNotice('Falta información para cargar esta comparación.');
    renderFinish();
    return;
  }

  fillChoice(leftChoice, activePair[0]);
  fillChoice(rightChoice, activePair[1]);
  roundLabel.textContent = `Ronda ${roundIndex + 1} de ${rounds.length}`;
  showState('question');
  document.querySelector('#game-question').focus({ preventScroll: true });
}

function resultCard(drink) {
  const article = document.createElement('article');
  article.className = 'result-product';

  const image = document.createElement('img');
  image.src = drink.image;
  image.alt = '';

  const content = document.createElement('div');
  const heading = document.createElement('h2');
  heading.textContent = drink.name;
  const presentation = document.createElement('span');
  presentation.className = 'result-presentation';
  presentation.textContent = presentationLabel(drink);

  const amount = document.createElement('p');
  amount.className = 'result-amount';
  const grams = document.createElement('strong');
  grams.textContent = `${formatNumber(drink.addedSugarG)} g`;
  const teaspoons = document.createElement('span');
  teaspoons.textContent = `≈ ${teaspoonsFor(drink.addedSugarG)} cucharaditas`;
  amount.append(grams, teaspoons);

  const scale = document.createElement('div');
  scale.className = 'sugar-scale';
  scale.setAttribute('aria-label', `${formatNumber(drink.addedSugarG)} gramos frente a la referencia de 25 gramos`);
  const fill = document.createElement('i');
  fill.style.setProperty('--fill-width', `${Math.min(100, (drink.addedSugarG / 50) * 100)}%`);
  scale.append(fill);

  const relation = document.createElement('p');
  relation.className = 'result-reference-copy';
  relation.textContent = referenceRelation(drink.addedSugarG);

  content.append(heading, presentation, amount, scale, relation);
  article.append(image, content);
  return article;
}

function referenceRelation(grams) {
  if (Math.abs(grams - DAILY_REFERENCE_G) <= 3) return 'Está cerca de nuestra referencia de 25 g.';
  if (grams < DAILY_REFERENCE_G) return 'Representa una parte de nuestra referencia de 25 g.';
  return 'Esta cantidad supera nuestra referencia de 25 g.';
}

function educationalMessage(first, second) {
  const difference = Math.abs(first.addedSugarG - second.addedSugarG);
  const isTie = difference < 0.001;
  const sizeRatio = Math.max(first.presentation, second.presentation) / Math.min(first.presentation, second.presentation);
  const parts = [];

  if (isTie) {
    parts.push('¡Tienen la misma cantidad! Dos bebidas distintas pueden quedar iguales.');
  } else if (difference <= 2.5) {
    parts.push('¡Están muy cerca! Por eso comparar ayuda más que adivinar.');
  } else if (sizeRatio >= 1.5) {
    parts.push('El tamaño del envase también cambia cuánto consumes.');
  }

  if (!parts.length) parts.push('Compara los gramos de cada envase para entender mejor la diferencia.');
  return parts.join(' ');
}

function choose(answer) {
  const [first, second] = activePair;
  const isTie = Math.abs(first.addedSugarG - second.addedSugarG) < 0.001;
  const higher = first.addedSugarG > second.addedSugarG ? first : second;
  const foundIt = isTie ? answer === 'tie' : answer === higher.id;

  resultTitle.textContent = foundIt ? 'Mira lo que encontraste' : 'La etiqueta cambia la respuesta';
  resultMessage.textContent = educationalMessage(first, second);
  resultProducts.replaceChildren(resultCard(first), resultCard(second));
  nextRound.innerHTML = roundIndex === rounds.length - 1 ? 'Terminar <span aria-hidden="true">→</span>' : 'Siguiente <span aria-hidden="true">→</span>';
  showState('result');
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      resultProducts.querySelectorAll('.sugar-scale i').forEach((fill) => fill.classList.add('is-filled'));
    });
  });
  resultTitle.focus({ preventScroll: true });
}

function readPoints() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(POINTS_KEY));
    return stored && typeof stored.total === 'number'
      ? { total: stored.total, events: stored.events || {} }
      : { total: 0, events: {} };
  } catch (_) {
    return { total: 0, events: {} };
  }
}

function awardCompletion() {
  const points = readPoints();
  if (points.events[COMPLETION_EVENT]) return;
  points.total += 20;
  points.events[COMPLETION_EVENT] = 20;
  try {
    window.localStorage.setItem(POINTS_KEY, JSON.stringify(points));
  } catch (_) {
    // El juego sigue funcionando aunque el navegador bloquee el almacenamiento local.
  }
}

function renderFinish() {
  roundLabel.textContent = 'Juego terminado';
  showState('finish');
  awardCompletion();
  document.querySelector('#finish-title').focus({ preventScroll: true });
}

function startGame() {
  rounds = buildRounds();
  roundIndex = 0;
  roundLabel.textContent = 'Antes de empezar';
  renderIntroCharacter();
  showState('intro');
  introState.focus({ preventScroll: true });
}

leftChoice.addEventListener('click', () => choose(leftChoice.dataset.drinkId));
rightChoice.addEventListener('click', () => choose(rightChoice.dataset.drinkId));
tieChoice.addEventListener('click', () => choose('tie'));
nextRound.addEventListener('click', () => {
  roundIndex += 1;
  renderRound();
});
restartGame.addEventListener('click', startGame);
startGameButton.addEventListener('click', renderRound);

startGame();
