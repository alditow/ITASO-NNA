const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const caregiverLink = document.querySelector('[data-caregiver-link]');
const notice = document.querySelector('.notice');
const resourceModal = document.querySelector('#resource-modal');
const resourceDialog = resourceModal.querySelector('.resource-dialog');
const modalKicker = document.querySelector('#resource-modal-kicker');
const modalTitle = document.querySelector('#resource-modal-title');
const modalDescription = document.querySelector('#resource-modal-description');
const modalInformation = document.querySelector('#resource-modal-information');
const modalKeyVisual = document.querySelector('#resource-key-visual');
const modalFact = document.querySelector('#resource-modal-fact');
const modalRemember = document.querySelector('#resource-modal-remember');
const modalSource = document.querySelector('#resource-modal-source');
const resourceScrollCue = document.querySelector('.resource-scroll-cue');
let lastResourceButton = null;

const officialSources = {
  guides: {
    label: 'Guías Alimentarias Saludables y Sostenibles para la Población Mexicana 2025',
    href: 'https://www.dof.gob.mx/2025/SS/GUIASALIMENTARIAS2025.pdf'
  },
  labels: {
    label: 'Secretaría de Salud · NOM-051',
    href: 'https://www.gob.mx/promosalud/acciones-y-programas/etiquetado-de-alimentos'
  },
  movement: {
    label: 'Organización Mundial de la Salud · Directrices sobre actividad física y hábitos sedentarios',
    href: 'https://iris.who.int/bitstream/handle/10665/337004/9789240014817-spa.pdf'
  }
};

// Contenido editable de los cinco recursos. Cada entrada usa el mismo componente editorial.
const resourceContent = {
  sellos: {
    accent: 'orange',
    kicker: 'ETIQUETADO FRONTAL',
    title: '¿QUÉ DICEN LOS SELLOS?',
    description: 'Los sellos son octágonos negros que aparecen en algunos alimentos y bebidas empacados. Cada uno avisa sobre un componente diferente.',
    keyVisual: `
      <div class="editorial-number">5</div>
      <p class="editorial-number-label">Hay 5 sellos de advertencia.</p>
      <div class="editorial-token-list seal-token-list">
        <span>Calorías</span><span>Azúcares</span><span>Grasas saturadas</span><span>Grasas trans</span><span>Sodio</span>
      </div>`,
    blocks: [
      { visual: '<strong>SELLOS</strong> <b>+</b> <strong>AVISOS</strong> <b>=</b> <em>PISTAS DEL EMPAQUE</em>' },
      { visual: '<small>UN PRODUCTO PUEDE TENER</small><strong>UNO</strong> <b>+</b> <strong>VARIOS</strong> <b>+</b> <strong>NINGUNO</strong>' },
      { visual: '<em>EL SELLO TE AVISA,<br>PERO NO TE DICE CUÁNTO HAY.</em>', note: 'Si quieres saber la cantidad, puedes buscarla en la tabla nutrimental.' }
    ],
    fact: 'También hay leyendas que avisan si contiene cafeína o edulcorantes no recomendados para niñas y niños.',
    remember: 'Tener sellos no convierte automáticamente a un alimento en “malo”. Los sellos son una pista rápida para observar y comparar.',
    source: officialSources.labels
  },
  bebidas: {
    accent: 'green',
    kicker: 'HIDRATACIÓN',
    title: '¿QUÉ HAY EN LO QUE TOMAS?',
    description: 'La información del envase ayuda a observar y comparar lo que contienen distintas bebidas.',
    keyVisual: `
      <div class="editorial-number">2</div>
      <p class="editorial-number-label">bebidas parecidas pueden tener cantidades diferentes de azúcar.</p>
      <div class="editorial-token-list">
        <span>Sabor</span><span>Tamaño</span><span>Azúcar añadida</span>
      </div>`,
    blocks: [
      { visual: '<strong>MISMA CANTIDAD</strong> <b>+</b> <strong>GRAMOS</strong> <b>=</b> <em>UNA COMPARACIÓN MÁS CLARA</em>' },
      { visual: '<em>EL TAMAÑO DEL ENVASE<br>TAMBIÉN CAMBIA LA CANTIDAD</em>' },
      { visual: '<strong>25 g</strong> <b>≈</b> <em>6 CUCHARADITAS</em>', note: 'Esta referencia nos puede ayudar a entender mejor las cantidades.' }
    ],
    fact: 'Para compararlas mejor, fíjate en la misma cantidad de bebida.',
    remember: 'El agua natural es la bebida recomendada para el consumo cotidiano.',
    source: officialSources.guides
  },
  grupos: {
    accent: 'blue',
    kicker: 'VARIEDAD',
    title: 'NO TODOS LOS ALIMENTOS APORTAN LO MISMO',
    description: 'Los alimentos pueden agruparse porque comparten algunas características. Cada grupo aporta cosas distintas.',
    keyVisual: `
      <div class="editorial-number">5</div>
      <p class="editorial-number-label">La guía actual presenta 5 grupos.</p>
      <div class="editorial-token-list group-token-list">
        <span>Verduras y frutas</span><span>Cereales, granos y tubérculos</span><span>Leguminosas</span><span>Origen animal</span><span>Aceites y grasas saludables</span>
      </div>`,
    blocks: [
      { visual: '<strong>ALIMENTOS DIFERENTES</strong> <b>=</b> <em>GRUPOS DIFERENTES</em>' },
      { visual: '<em>UNA COMIDA PUEDE JUNTAR<br>VARIOS GRUPOS</em>' },
      { visual: '<em>NO TODOS LOS ALIMENTOS<br>NOS DAN LO MISMO.</em>', note: 'Por eso podemos encontrar distintos grupos en lo que comemos.' }
    ],
    fact: 'Los grupos son: verduras y frutas; cereales, granos y tubérculos; leguminosas; alimentos de origen animal; y aceites y grasas saludables.',
    remember: 'Los grupos son una herramienta para observar; no clasifican alimentos como “buenos” o “malos”.',
    source: officialSources.guides
  },
  empaque: {
    accent: 'yellow',
    kicker: 'ETIQUETADO',
    title: 'UN EMPAQUE CUENTA MÁS DE LO QUE PARECE',
    description: 'Puedes aprender dónde buscar información sin tener que interpretar todavía todos los números de la etiqueta.',
    keyVisual: `
      <div class="editorial-number">3</div>
      <p class="editorial-number-label">lugares del empaque pueden darte información.</p>
      <div class="editorial-token-list">
        <span>Frente</span><span>Tabla nutrimental</span><span>Ingredientes</span>
      </div>`,
    blocks: [
      { visual: '<strong>FRENTE</strong> <b>+</b> <strong>TABLA</strong> <b>+</b> <em>INGREDIENTES</em>' },
      { visual: '<em>DIBUJOS Y COLORES<br>NO CUENTAN TODA LA HISTORIA</em>' },
      { visual: '<em>CADA PARTE DEL EMPAQUE<br>TE CUENTA ALGO DIFERENTE.</em>', note: 'Puedes mirar más de una parte para conocer mejor un producto.' }
    ],
    fact: 'No todo está en los dibujos o colores del frente.',
    remember: 'Encontrar estas tres partes te ayuda a saber dónde mirar antes de comparar un producto.',
    source: officialSources.labels
  },
  movimiento: {
    accent: 'red',
    kicker: 'ACTIVIDAD FÍSICA',
    title: 'MOVERTE ES MÁS QUE HACER DEPORTE',
    description: 'La actividad física forma parte de muchas situaciones del día, dentro y fuera del deporte.',
    keyVisual: `
      <div class="editorial-number">60</div>
      <p class="editorial-number-label">minutos al día es el tiempo de movimiento recomendado para niñas, niños y adolescentes.</p>
      <div class="editorial-token-list">
        <span>Jugar</span><span>Caminar</span><span>Bailar</span>
      </div>`,
    blocks: [
      { visual: '<strong>JUGAR</strong> <b>+</b> <strong>CAMINAR</strong> <b>+</b> <strong>BAILAR</strong> <b>=</b> <em>FORMAS DE MOVERTE</em>' },
      { visual: '<em>MOVERTE<br>NO ES SOLO HACER DEPORTE</em>' },
      { visual: '<em>PUEDES MOVERTE<br>EN DISTINTOS MOMENTOS DEL DÍA.</em>', note: 'Caminar, jugar, bailar o andar en bici también pueden formar parte de tu día.' }
    ],
    fact: 'No tiene que ser todo de una vez. Moverte de distintas formas durante el día también cuenta.',
    remember: 'Moverte puede formar parte de muchos momentos de tu día.',
    source: officialSources.movement
  }
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

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}, { passive: true });

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

function openResource(key, trigger) {
  const content = resourceContent[key];
  if (!content) return;

  lastResourceButton = trigger;
  resourceDialog.dataset.modalAccent = content.accent;
  modalKicker.textContent = content.kicker;
  modalTitle.textContent = content.title;
  modalDescription.textContent = content.description;
  modalInformation.innerHTML = content.blocks.map((block, index) => `
    <article class="information-block">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <div class="information-equation">
        <div class="equation-row">${block.visual}</div>
        ${block.note ? `<p class="equation-note">${block.note}</p>` : ''}
      </div>
    </article>
  `).join('');
  modalKeyVisual.innerHTML = content.keyVisual;
  modalFact.textContent = content.fact;
  modalRemember.textContent = content.remember;
  modalSource.textContent = content.source.label;
  modalSource.href = content.source.href;

  resourceModal.hidden = false;
  document.body.classList.add('resource-modal-open');
  resourceDialog.scrollTop = 0;
  window.requestAnimationFrame(updateResourceScrollCue);
  resourceModal.querySelector('.resource-close').focus();
}

function updateResourceScrollCue() {
  const canScroll = resourceDialog.scrollHeight > resourceDialog.clientHeight + 8;
  const reachedEnd = resourceDialog.scrollTop + resourceDialog.clientHeight >= resourceDialog.scrollHeight - 18;
  resourceScrollCue.hidden = !canScroll || reachedEnd;
}

function closeResource() {
  resourceModal.hidden = true;
  document.body.classList.remove('resource-modal-open');
  modalKeyVisual.innerHTML = '';
  lastResourceButton?.focus();
}

document.querySelectorAll('[data-resource]').forEach((button) => {
  button.addEventListener('click', () => openResource(button.dataset.resource, button));
});

document.querySelectorAll('[data-close-resource]').forEach((button) => button.addEventListener('click', closeResource));
resourceModal.addEventListener('click', (event) => { if (event.target === resourceModal) closeResource(); });
resourceDialog.addEventListener('scroll', updateResourceScrollCue, { passive: true });
window.addEventListener('resize', () => { if (!resourceModal.hidden) updateResourceScrollCue(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !resourceModal.hidden) closeResource(); });

const revealItems = document.querySelectorAll('.resource-reveal');
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
