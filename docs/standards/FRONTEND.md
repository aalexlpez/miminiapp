# Frontend — criterios y estado de aprobación

**Estado:** I-01 Aceptado y archivado el 2026-11-05. I-02 aprobado y autorizado expresamente el mismo día, Aceptado expresamente por el propietario el 2026-11-05 y archivado, conforme a ADR-MMA-011/016/017: catálogo, rutas ES/EN y segunda composición visual aprobada. La evidencia de I-01 es histórica; las verificaciones y capturas de la interfaz nueva se registran por separado.
**Responsable:** propietario de MiMiniApp.

## FE-01 — estándar de calidad frontend

**Estado de este apartado:** `Aprobado` el 2026-11-17 por el propietario de MiMiniApp mediante la aceptación de ADR-MMA-022, con el ajuste de que su aprobación basta como aceptación humana. Las pruebas con otras personas son opcionales y no bloquean el cierre; se mantienen las verificaciones técnicas y los criterios de producto aplicables. Referencia técnica en el [registro](../design-docs/index.md); selección/permisos de skills en H-008. La aprobación del estándar no sustituye la de una UI concreta. Skills incorporadas y uso manual comprobado en I2; dirección/contrato de Plan B aprobados en I3 mediante ADR-MMA-023. La aprobación del acabado sigue en I6. [Paquete de I1 y evidencia](../reports/fe01/execution.md#i1--base-y-propuesta-del-estándar).

### Criterios de calidad

| ID | Criterio | Evidencia para revisarlo |
| --- | --- | --- |
| FE-Q01 | Una persona nueva debe poder identificar para qué sirve la herramienta, qué resultado obtendrá y cuál es su siguiente acción. Mostrar ayudas breves en contexto y ejemplos utilizables. | Recorrido real con contenido ES/EN y revisión/aprobación del propietario. Las observaciones de otras personas pueden complementar esa revisión, sin ser requisito de aceptación. |
| FE-Q02 | Organizar cada pantalla en torno a una decisión o grupo coherente; mostrar configuración secundaria cuando sea útil. Elegir el patrón por la tarea y comprobar su densidad, sin convertir un número fijo de pasos en regla para todas las miniapps. | Flujo y estados completos, incluidos Atrás, edición, errores y restauración; dirección aprobada antes de implementar cambios materiales. |
| FE-Q03 | Distinguir pregunta, entrada, ayuda, sugerencia y acción principal mediante jerarquía visual. La composición aprovecha escritorio y móvil de forma deliberada y expresa la identidad existente con sus tokens/fuentes. | Pantallas renderizadas representativas, claro/oscuro, textos reales/máximos y revisión visual humana. Una tarjeta o efecto se justifica por su función. |
| FE-Q04 | Reducir desplazamiento innecesario para completar la tarea en los viewports acordados. Con teclado, zoom, contenido largo o pantalla pequeña, controles y errores siguen alcanzables y el foco visible. | Geometría y navegación a 393×851/1440×900 como referencia inicial, reflujo a 320 px y zoom nativo cuando esté disponible. No ocultar contenido/overflow o desactivar zoom para aparentar que cabe. |
| FE-Q05 | Movimiento breve, interrumpible y ligado a progreso/selección/cambio de estado. Mantener consistencia espacial y capacidad de responder a una acción rápida; aplicar reduced-motion en el ámbito de la UI. | Transiciones reales, pulsaciones repetidas, teclado y variante reducida. Las excepciones del hero/plataforma siguen su decisión aprobada y se identifican separadamente. |
| FE-Q06 | Diseñar carga, vacío, error, cancelación y éxito con información útil, conservando entradas y contexto. Los avisos de privacidad acompañan la acción correspondiente, con consentimiento cuando se requiere. | Navegador y pruebas de los fallos/recuperaciones pertinentes, además del recorrido satisfactorio; ningún mensaje de éxito por una operación no observada. |
| FE-Q07 | Tratar resultado y exportaciones como piezas del producto: composición cuidada, texto completo/legible, contraste y destino de uso. Conservar el texto validado y las garantías de formatos/consentimiento. | Resultado y archivo real con entradas cortas/máximas, Unicode y ambos temas; la prueba física del destino se distingue de generar/descargar el archivo. |
| FE-Q08 | Preservar aislamiento, rendimiento, privacidad y mantenibilidad. Usar el stack/tokens autorizados, medir coste propio y total y liberar recursos de interacción/exportación. | Comparación con base identificada, presupuestos del producto, red/almacenamiento, ciclos de uso y pruebas de plataforma. Las metas de campo no se acreditan con una medición local. |
| FE-Q09 | Revisar calidad técnica y dirección visual; el propietario acepta la experiencia y el resultado. Impeccable ayuda a diseñar/criticar y Vercel a revisar implementación. La observación de uso con otras personas es opcional. | Ficha/decisiones vigentes, revisiones de reglas/candidato, comprobaciones técnicas y aprobación del propietario. Registrar las condiciones de cualquier medición realizada; no exigir participantes externos para dar por correcto el desarrollo. |

Estos criterios se aplican al trabajo nuevo y las mejoras autorizadas. No reabren aceptaciones históricas ni autorizan un rediseño completo de portada/catálogo/hero. Plan B es el piloto; mover sus controles o cambiar sus pasos requiere actualizar/aprobar la ficha en FE-01/I3. Se conserva el texto y comportamiento vigente mientras esa decisión esté pendiente.

### Matriz de adopción y conflictos de I1

Integración de desarrollo y límites observados en I2: [guía de uso local](../guides/frontend-skills.md).
El perfil y motor están incorporados; el descubrimiento nativo del cliente sigue
pendiente. Esta situación no cambia las normas ni permite afirmar carga automática.

Referencias examinadas: [Impeccable d41d986](https://github.com/pbakaus/impeccable/tree/d41d9860b0094dcb68030657da63461212835aaa), [skill Vercel 1a2c79d](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/web-design-guidelines) y [reglas Vercel 434b7f9](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/command.md). Son fuentes de revisión; los estados del proyecto conservan su autoridad.

| ID / aporte | Resolución adoptada y motivo | Ámbito / comprobación |
| --- | --- | --- |
| FE-M01 — Modo Operate de Impeccable | Adoptar orientación a completar una tarea, claridad y familiaridad; expresar personalidad mediante composición y detalles útiles. | FE-Q01–03; flujo completo y primera visita. No usar reglas de landing promocional como sustituto de un formulario utilizable. |
| FE-M02 — Jerarquía, densidad y revelado progresivo | Adoptar el criterio. ADR-MMA-023 y ficha v07 aprueban cuatro preguntas con calendario opcional desde el resultado. | Piloto: contrato aprobado en I3, recorrido implementado localmente en I4; acabado de resultado/PNG en I5. No extiende ese recorrido a otras herramientas. |
| FE-M03 — No bloquear pegado, Vercel | Adaptar: mantener la excepción vigente que rechaza saltos de línea con error visible. Evaluar su conveniencia en el diseño del piloto antes de cambiarla. | Ficha Plan B §3, prueba de pegado y texto literal. La excepción no prohíbe todo pegado. |
| FE-M04 — Truncate/line-clamp/break-words | Elegir ajuste de línea compatible, preservando texto. No adoptar truncado de frases de Plan B para resolver un problema de layout. | Pantalla, PNG y calendario; textos máximos/grafemas. |
| FE-M05 — Reduced-motion en todo bucle, Vercel | Adaptar por ámbito: Plan B respeta su variante reducida; el hero conserva la enmienda aprobada ADR-MMA-018 del 2026-11-10, con pausa manual/visibilidad. | Pruebas separadas de miniapp/plataforma. Si se quiere cambiar esa política, presentar la decisión específica; no corregirla automáticamente desde una auditoría. |
| FE-M06 — Animar solo transform/opacity | Adoptar como preferencia de rendimiento para microinteracciones nuevas, con medición de excepciones. La excepción grayscale/filter de v06 es histórica: ficha v07 y ADR-MMA-023 aprueban retirarla junto al sello. | Plan B usa cambios breves de opacidad/desplazamiento, instantáneos con movimiento reducido. No altera el contrato de movimiento del hero ni autoriza efectos nuevos por inferencia. |
| FE-M07 — PRODUCT.md/DESIGN.md de Impeccable | Adaptar la lectura de contexto a ficha/decisiones/arquitectura/estándares/plan; conservar una única autoridad por dominio. | Skill local y prueba de contexto I2. No ejecutar init/document creando fuentes paralelas por defecto. |
| FE-M08 — Reglas Vercel frescas | Registrar el SHA o snapshot realmente utilizado y su candidato; una actualización externa no cambia las normas del repo automáticamente. | Informe de cada revisión, fuente/revisión y hallazgos aplicables. No afirmar reproducibilidad por fijar solo el SKILL.md. |
| FE-M09 — Motor, telemetría, catálogo y hooks | Adopción manual y acotada aprobada en H-008. Caché/motor solo de desarrollo si se verifica y autoriza, telemetría desactivada; catálogo y hooks fuera del permiso inicial. | Inventario/efectos de archivos y red en I2. Apagar telemetría no equivale a desactivar el catálogo. Ningún componente llega a dist. |
| FE-M10 — Crítica con subagentes | Conservar el requisito de permiso específico y declarar el tipo de revisión realmente realizada. | No se autoriza delegación por instalar una skill; una revisión de un solo contexto no se presenta como independiente. |
| FE-M11 — Generar otro design system | Conservar Laboratorio creativo, fuentes y tokens locales. Admitir alternativas de composición dentro de esa identidad; proponer un cambio de tokens/contrato compartido por su fuente si fuera necesario. | I3 y regresión de plataforma. Adoptar la metodología no autoriza cambiar de stack o añadir librerías. |
| FE-M12 — Checklists/score de calidad | Usar como apoyo y justificar reglas no aplicables. Exigir verificaciones técnicas aplicables y aprobación del propietario del recorrido/acabado; las pruebas con otras personas son opcionales. | FE-Q09 y procedimiento en QUALITY_SCORE. Una puntuación o CI por sí solos no sustituyen la aprobación humana; tampoco se exige un panel de usuarios para aceptar el desarrollo. |

La matriz queda adoptada con ADR-MMA-022. Sus cambios posteriores se revisan en la fuente correspondiente. Una excepción registra motivo, ámbito y condición para revisarla; un defecto esencial no se convierte en aceptable por anotarlo aquí. ADR-MMA-023 registra la nueva composición y los cambios funcionales aprobados en I3.

## Experiencia y contenido

La definición aprobada exige mobile-first con escritorio cuidado. Catálogo, miniapps, navegación, controles y resultados deben ser utilizables sin recortes ni scroll horizontal accidental, con estados de carga, vacío, error y éxito cuando proceda. No anunciar funciones o herramientas inexistentes.

La UI debe explicar brevemente para qué sirve cada herramienta y cómo usarla. Ejemplos reales y restablecimiento rápido permiten probar y grabar su funcionamiento; no se simula una capacidad para el vídeo. La legibilidad vertical 9:16 es un criterio de demostración y no limita la experiencia de escritorio.

## Convención de estilos

Aprobada por el propietario el 2026-11-15 como concreción de ADR-MMA-003 ([MT-01](../exec-plans/completed/MT-01-mantenimiento-y-colaboracion.md)). Describe la práctica ya existente y fija dónde va el código nuevo.

| Capa | Dónde | Cómo |
| --- | --- | --- |
| Tokens | `@theme` en `src/styles/global.css`; sus valores oscuros en `appearance.css` | Colores, tipografías y radios se definen una vez. El resto del código los usa por nombre. |
| Plataforma | `@layer components` en `src/styles/` | Clases semánticas (`site-header`, `catalogue-card`) para cabecera, portada, catálogo, apariencia y movimiento. |
| Miniapps | Dentro de `src/miniapps/<slug>/` | Utilidades de Tailwind en el marcado o un bloque `<style>` del propio componente. |

Reglas:

* Una miniapp no añade reglas a `src/styles/`. Esos archivos son compartidos y cada línea nueva es un conflicto potencial entre ramas.
* Se usan las utilidades derivadas de los tokens (`bg-surface`, `text-ink`, `text-muted`, `bg-brand`, `rounded-card`, `font-heading`), no la paleta fija de Tailwind ni colores literales. Solo así un componente respeta la apariencia clara y oscura.
* Un patrón que se repite en dos o más herramientas se promueve a la capa de plataforma en un PR propio.
* Añadir o cambiar un token es un cambio compartido: se revisa como tal.

La fixture técnica de I-01 usa la paleta fija de Tailwind porque es anterior al tema oscuro. No es un modelo para código nuevo.

## Idiomas y rutas

Español e inglés completos desde lanzamiento: contenido visible, formularios, errores, etiquetas accesibles y metadatos. El selector mantiene la miniapp equivalente. `/es/` y `/en/`, español predeterminado, slugs estables y separación/validación de traducciones están aprobados en ADR-MMA-016. Canónicas/hreflang absolutos y la comprobación del alojamiento siguen diferidos; Cloudflare se verificará en I-03.

Separar traducciones y formatos de la lógica de dominio. Formatear fechas, números e importes según locale cuando corresponda, manteniendo valores computacionales consistentes. La ejecución de I-02 comprueba enlaces directos, idioma y 404 real local; no acredita el futuro comportamiento del alojamiento.

El mecanismo propuesto por el dossier es `Intl` cuando proceda, sin mezclar el formato visual con los valores usados en cálculos; su configuración se comprobará con el stack de la iteración correspondiente.

## Dirección artística elegida para I-02

El 2026-11-05 el propietario elige expresamente **Laboratorio creativo moderno**: diseño limpio, profesional y minimalista, con elementos creativos, distintivos y atractivos, cuidado en móvil y escritorio y reconocible en TikTok, Instagram Reels y YouTube Shorts. Paleta inicial elegida: fondo `#F7F5F0`, texto `#242136`, violeta `#7950F2`, lima `#B9F65A` y coral `#FF9368`. Se permiten tonos funcionales derivados para contraste/accesibilidad.

El propietario aprueba expresamente el 2026-11-05 la segunda composición, con etiqueta «Laboratorio creativo», titular «Ideas que se vuelven herramientas» y navegación móvil visible, manteniendo la paleta y Space Grotesk/DM Sans bajo accesibilidad/licencias. ADR-MMA-017 registra esa aprobación, Tailwind mobile-first sin nuevas dependencias visuales, componentes que evolucionan de catálogo vacío a poblado sin rediseño, recursos locales y revisión mediante capturas móvil/escritorio accesibles en Codex Cloud. La [especificación visual](../design-docs/i02-visual-proposal.md) documenta los detalles de referencia, las futuras miniapps en encuadres 9:16 legibles y la verificación de licencias antes de incorporar recursos finales. Los ajustes mecánicos de tokens/archivos se comprobaron en la ejecución autorizada de I-02, Verificado el 2026-11-05. Se reutilizan Space Grotesk y DM Sans locales en TTF, con avisos SIL OFL 1.1 conservados; no se instala una dependencia para convertir a WOFF2. El formato TTF mantiene la familia, pesos y dirección aprobados. Se implementa la composición elegida sin generar alternativas.

## Accesibilidad y rendimiento

Objetivo de diseño: **WCAG 2.2 AA**, con teclado, foco visible, contraste, etiquetas, nombres accesibles y anuncios de resultado. axe u otras comprobaciones automáticas no sustituyen la revisión manual ni certifican cumplimiento completo.

Metas de referencia para datos de campo cuando exista audiencia suficiente: **LCP ≤ 2,5 s**, **INP ≤ 200 ms**, **CLS ≤ 0,1**. Una medición local o Lighthouse no demuestra el percentil 75 real. Se propone hidratar solo la interacción necesaria y comprobar presupuestos de descarga/memoria en dispositivos representativos; no se inventa un umbral de bundle sin evaluación.

## Verificación de I-02

La matriz de I-02 conserva Chromium de escritorio y móvil emulado, fijado a 156.0.8078.4 / revisión 1248 por Playwright 1.64.1. Incluye acceso directo ES/EN, navegación, idioma equivalente, 404, teclado/foco, axe y reflujo a 320/393/768/1280/1440 px, además de capturas reales móvil/escritorio y 1080×1920. Las comprobaciones de demo/reset de I-01 se conservan en sus pruebas técnicas aisladas, sin publicar una herramienta ficticia.

El catálogo pasa de cero a una o varias entradas mediante los mismos componentes; los estados poblados se ensayan solo con fixtures aisladas. Las fuentes y gráficos se sirven localmente. El registro y las rutas genéricas evitan cargar interfaces para mostrar los metadatos del catálogo. La portada no necesita hidratación React; una miniapp futura solo hidratará su interacción cuando proceda.

El [ExecPlan](../exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) y el [informe](../reports/i02/execution.md) registran resultados: 26 E2E, incluidos 6 axe, más capturas reales ES/EN en móvil (393 px), tablet (768 px), escritorio (1440 px), encuadres 1080×1920 y zoom real al 200 %. La revisión responsive automatizada cubre 320/393/768/1280/1440 px. Se corrigió el idioma de los nombres accesibles ES/EN detectado por axe y pasaron las comprobaciones afectadas. La comparación asistida con las maquetas y las capturas de tarjetas pobladas se documentan por separado; el propietario revisó personalmente las capturas reales de escritorio/móvil y aceptó I-02 el 2026-11-05. Las capturas no certifican WCAG completo ni reemplazan la aceptación del propietario. La revisión asistida de I-01 a 1280×900/393×851 se conserva en su [informe](../reports/i01/execution.md), sin presentarla como evidencia de I-02. Otros motores, dispositivos físicos y datos de rendimiento en campo permanecen fuera de esta iteración.

## Mejora futura de movimiento

Por indicación del propietario el 2026-11-05 se registra [PEND-008](../exec-plans/tech-debt-tracker.md#pend-008--movimiento-suave-y-microinteracciones-futuras): flotación suave de la ilustración principal y posibles microinteracciones/transiciones adicionales. Se conserva el diseño aceptado; no se implementa ahora. Deben respetar `prefers-reduced-motion`, mantener legibilidad y evitar desplazar contenido o interferir con controles. Aquel registro no cambió la política de movimiento de ADR-MMA-017 ni autorizó animación continua; su evolución visual posterior se distingue a continuación.


## Creative Playground — dirección aprobada y ejecución pendiente

El 2026-11-08 el propietario aprueba M modular integrada, wordmark compacto de interfaz/editorial de marca, ensamblaje expresivo, hover y hero B. Esta evolución delimitada de [ADR-MMA-017](../design-docs/creative-playground.md) permite el ambiente B con pausa accesible y reduced-motion; sustituye hacia adelante la exclusión continua descrita en la mejora futura anterior, sin modificar la aceptación de I-02.

La [decisión ADR-MMA-018](../design-docs/creative-playground.md#adr-mma-018--integración-y-accesibilidad) especifica SVG/CSS y coordinación nativa mínima, sin hidratación React, preferencias almacenadas o dependencias nuevas. El [ExecPlan CP-01](../exec-plans/completed/CP-01-creative-playground.md), aprobado formalmente el 2026-11-08, queda Aceptado y archivado tras ejecutar y aceptar sus dos iteraciones. La identidad estática está implementada en la rama feature/cp01-identidad-visual, aceptada visualmente por el propietario el 2026-11-08; Iteración 2 fue autorizada expresamente después y está implementada/verificada localmente, aceptada visualmente por el propietario el 2026-11-08. En Iteración 2, las pruebas permitirán el coordinador local de portada y conservarán el resto de garantías de scripts/red/almacenamiento; la raíz estática seguirá sin scripts.

La verificación local de Iteración 1 pasa con 314 unitarias, 9 componentes y 36 E2E/axe, además de integración modular. Las comparaciones reales y limitaciones están en el [informe CP-01](../reports/cp01/execution.md). No se ha publicado el candidato; CI/PR no implican merge autorizado.

Iteración 2 implementa ensamblaje/hover, siete bucles B con flotación central y pausa/reduced-motion progresivos. Astro integra un único módulo inline de 872 bytes gzip; se mantienen cero scripts externos e islas React en portada. La batería local pasa 314 unitarias, 9 componentes y 52 E2E más integración; visibilidad nativa y BFCache también acreditados. El [informe](../reports/cp01/execution.md) conserva recursos, CLS, comparaciones y vídeos, sin publicación del candidato.

CP-01 queda Aceptado y archivado tras verificación, CI final satisfactorio 779b88b (run42519701947) y aceptación expresa del propietario el 2026-11-08 de ambas iteraciones, incluido el movimiento. PR #6 continúa en borrador, sin publicación.

## CP-02 — Apariencia aprobada (2026-11-09)

ADR-MMA-019 autoriza light/dark/system con Sistema inicial y una sola clave localStorage. La dirección aprobada corrige el prototipo: tarjeta/M del hero siempre con sus colores originales CP-01; un botón visual con el icono activo que despliega tres opciones por icono; nombres accesibles ES/EN, expansión nativa, aria-pressed en opciones, foco y marca de selección. Se reserva su espacio aun sin JS, ocultando controles no operativos; el botón compacto cabe junto a navegación también en 320 px, sin fila adicional. El icono elegido gira 240 ms solo con movimiento permitido; no se añaden transiciones globales de tema. [Contrato y aprobación](../design-docs/appearance-proposal.md), [evidencia de implementación](../reports/cp02/execution.md). Las descripciones previas de cero preferencias almacenadas corresponden al alcance histórico CP-01: solo apariencia tiene una excepción, no movimiento.


Actualización aprobada por el propietario, 2026-11-09: sustituir los tres iconos siempre visibles por **un solo icono activo** en un botón de 48×48 px sin marco. Al pulsarlo, popover nativo compacto con las tres opciones por iconos; selección cierra y devuelve foco, Escape/clic exterior cierran. El botón comunica nombre del modo y expansión en ES/EN. Giro de 240 ms en el icono del botón tras elegir, salvo reduced-motion. Se elimina la fila móvil extra que requería el grupo grande. El resto del contrato de CP-02 permanece vigente. Cambio solicitado y autorizado expresamente dentro de CP-02/PR #7.
