# ITASO NNA — Sistema UI

Este documento es la fuente de verdad para web y para la futura reconstrucción en Figma.

## Retícula

| Rango | Columnas | Gutter | Margen lateral |
|---|---:|---:|---:|
| Desktop, 1100 px o más | 12 | 24 px | `clamp(24px, 7vw, 110px)` |
| Tablet, 680–1099 px | 8 | 20 px | `clamp(24px, 7vw, 110px)` |
| Móvil, hasta 679 px | 4 | 16 px | 20 px |

La retícula global controla contenedores y alineaciones entre secciones. Juegos, tarjetas y modales pueden usar subretículas internas cuando su función lo requiera.

## Tipografía

Inter es la única familia del producto. La escala se define mediante tokens `--type-*` en `styles.css`.

| Estilo | Uso |
|---|---|
| Display | Hero principal |
| Page title | Título principal de Recursos, Juegos, Misiones, Logros y Compartir |
| Section title | Títulos de bloques editoriales |
| Card title | Títulos de tarjetas |
| Modal title | Títulos de diálogos y contenidos ampliados |
| Lead | Introducciones y textos destacados |
| Body large | Explicaciones destacadas |
| Body | Lectura general |
| Body small | Apoyo y metadatos |
| Label | Etiquetas editoriales en mayúsculas |

## Espaciado

La escala `--space-1` a `--space-14` parte de 4 px. Las excepciones deben responder a una necesidad compositiva documentada y no crear nuevos valores arbitrarios.

## Radios

| Token | Uso |
|---|---|
| `--radius-control` | Campos, chips y controles compactos |
| `--radius-button` | Botones |
| `--radius-card-sm` | Tarjetas internas |
| `--radius-card` | Tarjeta editorial base |
| `--radius-card-lg` | Tarjetas protagonistas |
| `--radius-section` | Bloques amplios de página |
| `--radius-pill` | Cápsulas e indicadores |

## Estados interactivos

Cada componente interactivo debe contemplar: `default`, `hover`, `focus-visible`, `active`, `disabled` y, cuando aplique, `selected`, `locked` y `unlocked`.

El foco debe permanecer visible. `outline:none` solo es válido cuando se sustituye por un indicador equivalente o más claro.

## Colores por área

- Recursos: naranja.
- Juegos: verde.
- Misiones: azul, con acentos funcionales por tarjeta.
- Logros: amarillo, verde y azul según estado.
- Compartir: rojo, amarillo y azul según tarjeta.

Los fondos suaves usan los tokens `--orange-soft`, `--green-soft`, `--blue-soft`, `--yellow-soft` y `--red-soft`.

## Arquitectura de implementación

- `styles.css`: tokens, base global, navegación y componentes compartidos existentes.
- `ui-system.css`: capa final de sistema. Normaliza títulos, contenedores, espaciado, tarjetas, botones, foco y responsive.
- `recursos.css`, `juegos.css`, `misiones.css`, `logros.css`, `compartir.css`: composición y excepciones propias de cada sección.
- `cual-tiene-mas.css` y `memorama.css`: estados y composición de los juegos a pantalla completa.
- `guia-ui.html`: muestra visual y comprobable de las decisiones del sistema.

## Regla para cambios futuros

Antes de agregar un valor nuevo, debe revisarse si ya existe un token adecuado. Un cambio transversal se hace en `styles.css` o `ui-system.css`; un ajuste que solo corresponde a la narrativa o ilustración de una sección permanece en su hoja local.

Las pruebas mínimas son 1440 × 900, 768 × 1024 y 390 × 844. En cada una se revisan desbordamiento horizontal, legibilidad, orden visual, foco de teclado y tamaño de controles.
