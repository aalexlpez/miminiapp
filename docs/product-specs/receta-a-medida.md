# Receta a medida · Recipe Resizer

**Ficha v03 · Aprobada · 27 de noviembre de 2026.** El propietario de MiMiniApp confirma el alcance funcional y autoriza I1 de RM-01 con «Vale, perfecto. Vamos con la primera iteración». La dirección de pantalla se revisa en I1 y la recuperación de sesión permanece en propuesta mediante ADR-MMA-026. La ficha parte del borrador v02 aportado en la conversación.

## Identificación y propósito

| Campo | Propuesta |
| --- | --- |
| Nombre ES / EN | **Receta a medida** / **Recipe Resizer** |
| ID, slug y categoría | `receta-a-medida` · `calculator` |
| Rutas previstas | `/es/apps/receta-a-medida/` y `/en/apps/receta-a-medida/` |
| Usuario | Alguien que ya tiene una receta y está decidiendo cuánto cocinar, a menudo desde el móvil en la cocina. |

**Promesa.** Pega los ingredientes y ajusta la receta a las raciones que necesitas o a la cantidad que tienes de uno de ellos.

La interacción distintiva es tocar **3 huevos** en la lista, escribir **2** y ver el resto adaptarse en esa misma pantalla. La lista muestra en qué se basa el ajuste, de dónde sale cada cantidad que cambia y qué líneas requieren revisión. Quien conozca las raciones puede cambiarlas directamente con el teclado o con **− / +**.

## Investigación y decisiones de alcance

| Referencia | Implicación para Receta a medida |
| --- | --- |
| Cuadra tu Plato ya ofrece pegado, escalado en vivo por raciones y entrada con coma y fracciones. [Cuadra tu Plato](https://cuadratuplato.com/escalar-recetas/) | El cálculo inmediato y un lector de texto útil son requisitos básicos. |
| Dzzz ya ajusta por un ingrediente y muestra originales, factor y copia. Pide elegir el modo y rellenar filas. Hay herramientas que también combinan pegado y ajuste por ingrediente. [Dzzz](https://dzzz.ai/es/tools/recipe-scaler/), [Recipe scaler de Chris Collins](https://geekychris.github.io/tools/recipe/) | La hipótesis a comprobar es que se descubre y completa más fácilmente el ajuste al actuar sobre la cantidad de la propia lista. |
| Cookidoo ofrece cambios de raciones en recetas de su catálogo, con una versión editable cuando procede. También usa «recetas a medida» como expresión descriptiva. [Cookidoo](https://cookidoo.es/foundation/es-ES/articles/scaled-recipes) | Mantener el nombre propuesto y presentar la herramienta con el caso concreto «Solo tengo dos huevos». |
| King Arthur Baking recomienda dividir el huevo por peso y revisar recipiente y cocción cuando se reduce una receta. [King Arthur Baking](https://www.kingarthurbaking.com/blog/2020/11/23/how-to-reduce-a-recipe) | Mostrar la fracción calculada y, cuando proceda, cómo medirla. Los ingredientes son el único cálculo culinario de esta versión. |

**Primera versión propuesta.** Una pantalla con ingredientes pegados o escritos, resultado en vivo, ajuste por raciones o por una cantidad disponible, unidades originales, revisión de líneas, ejemplo, copia y reinicio. Interfaz y metadatos ES/EN. Procesamiento local y recuperación temporal de sesión según la decisión pendiente.

**Ampliaciones.** El cambio de molde, la conversión de unidades y el menú nativo de compartir se evalúan después del recorrido principal. Una conversión futura debe identificar la convención de origen. NIST publica 240 ml como equivalencia aproximada para cocina y una onza líquida estadounidense equivale a unos 29,5735 ml, de donde se obtienen unos 236,59 ml por ocho onzas líquidas. Pasar de tazas a gramos requeriría además conocer el ingrediente. [NIST Metric Kitchen](https://www.nist.gov/pml/owm/metric-si/metric-kitchen/metric-kitchen-cooking-measurement-equivalencies), [NIST Handbook 130](https://www.nist.gov/system/files/documents/2025/12/23/2026_HB_130_Full-Document-20251223.pdf), [tabla de pesos de King Arthur Baking](https://www.kingarthurbaking.com/learn/ingredient-weight-chart).

Fuera de alcance inicial quedan la importación por URL o foto, el recetario, el historial, la nutrición, la IA, las cuentas, la analítica y el cálculo de tiempos y temperaturas. Se propone reutilizar el stack existente y los recursos de marca locales.

## Contrato funcional

### Entradas y lectura

* **Ingredientes.** Un ingrediente por línea. Hasta 60 líneas no vacías y 4000 puntos de código. Mantener el texto editable si excede el límite e indicar cómo corregirlo. Se ignoran las líneas vacías para el cálculo y las viñetas iniciales para reconocer la cantidad.
* **Raciones de la receta.** Campo opcional, entero de 1 a 99. Empieza vacío en una receta propia. Cuando se indica, el objetivo toma ese mismo número hasta que la persona elige otro.
* **Objetivo por raciones.** Entero de 1 a 99, editable cuando se conocen las raciones originales. El control admite escritura y botones con incremento de uno.
* **Cantidad disponible.** Número positivo en la unidad original de una línea que tenga una sola cantidad reconocida. Admite decimales y fracciones. La línea de referencia es única.

Leer el mismo texto igual en ES y EN. La interfaz adapta sus números de salida al idioma. Solo se sustituye la cantidad reconocida. Unidades, nombres, calificativos y orden proceden del texto pegado. Admitir número pegado a una abreviatura conocida, como `200g`, y dar preferencia a unidades compuestas como `vaso de yogur`.

| Entrada | Interpretación y resultado |
| --- | --- |
| `200 g de harina`, `2 limones`, `200g sugar` | Cantidad inicial reconocida. Se puede usar como referencia. |
| `1,5 l de leche`, `1.5 l milk`, `0,125 g de sal` | Decimales inequívocos. El valor es idéntico en ambas interfaces. |
| `1,500 g de harina`, `1.500 g de harina`, `1 500 g de harina` | **Revisar separador.** Una coma o un punto seguidos de tres cifras pueden indicar miles cuando el bloque anterior tiene de una a tres cifras y empieza por una cifra distinta de cero. Pedir un formato inequívoco, como `1500` o `1,5`. Quitar las agrupaciones de miles al editar. |
| `1/2 cdta de sal`, `½ cup oil`, `1 1/2 cups flour`, `1½ vasos de leche` | Fracciones simples y mixtas. Conservar como fracción cuando resulte legible. |
| `2–3 limones`, `2 a 3 tomates`, `2 to 3 eggs` | Escalar ambos extremos de un rango creciente. La fila queda fuera de la edición por cantidad disponible. |
| `2 latas de 400 g de tomate`, `100 g de chocolate (70 % cacao)` | Escalar 2 latas o 100 g. Conservar el peso por envase y el porcentaje explícitos. |
| `sal al gusto`, `una pizca de canela`, `a pinch of salt` | **Tal cual.** Indicaciones útiles sin cantidad que calcular. |
| `2 huevos y 1 yema`, `harina 200 g`, `1/0 l de leche` | **Revisar.** Conservar la línea completa y dar un motivo. Se puede volver al editor para partirla o corregirla. |
| `Para la salsa`, `For the sauce`, `180 °C`, `20 min`, `1. Mezcla…` | Conservar encabezados y notas reconocibles. Una sección encabezada por «Preparación», «Instrucciones», «Method» o «Directions» se conserva en el editor y queda fuera de la lista copiable de ingredientes. |

Identificar números compuestos y notas antes de aceptar el primer número de una línea. Un valor cero, negativo o inválido y una cantidad sin ingrediente pasan a **Revisar**. Mantener el texto visible en estos casos. Si ninguna línea es calculable, mostrar la razón y una entrada válida de ejemplo. La copia requiere al menos una cantidad reconocida.

### Ajuste y edición

| Acción | Resultado |
| --- | --- |
| Pegar o escribir ingredientes | La lista se actualiza en vivo. En una receta nueva comienza con `×1`. |
| Cambiar el objetivo por raciones | Aplicar `raciones objetivo ÷ raciones originales` a las cantidades de entrada. |
| Tocar una cantidad y editar «Tengo…» | Previsualizar con `cantidad disponible ÷ cantidad original de esa fila` tras cada entrada válida. «Usar cantidad» o Enter confirma. «Cancelar» o Escape restaura el ajuste previo. Salir del campo conserva el borrador abierto. |
| Cambiar las raciones originales | Si se ajusta por raciones, conservar el último objetivo elegido o igualarlo al origen si nunca se eligió uno. Con una referencia activa, conservar el factor y recalcular el rendimiento orientativo. Si el campo se vacía y se sale de él, ocultar el rendimiento. Recuperar `×1` en el ajuste por raciones y mantener el factor en el ajuste por ingrediente. |
| Volver a raciones | Usar el último objetivo elegido o las raciones originales si nunca se eligió uno. Si se desconoce el origen, volver a `×1` y ofrecer el campo de raciones. |
| Editar el texto con una referencia activa | Mantenerla si la línea original sigue identificándose de forma inequívoca. Si se elimina, se modifica o se vuelve ambigua, recuperar el ajuste por raciones y explicarlo junto al resultado. |

Con una referencia activa, mostrar **«Según 2 huevos»** y, cuando se conozca el rendimiento de la receta inicial, **«Rinde ≈ 5,3 raciones»**. La cantidad disponible fija el factor, incluso si el resultado representado en raciones se abrevia. Si la cantidad original es un rango o se desconoce, la fila conserva su resultado y su estado sin ofrecer el editor de referencia.

Con entradas de formulario inválidas, conservar el último resultado válido identificado como tal y suspender su copia hasta corregir el campo. En una previsualización de cantidad, la copia espera a «Usar cantidad» o «Cancelar». Un ajuste deliberado por raciones durante esa previsualización cancela el borrador de cantidad y parte del estado confirmado. Vaciar los ingredientes elimina la lista y la referencia. «Empezar otra vez» vacía también las raciones. Aceptar cualquier combinación válida de raciones de 1 a 99, incluido 12 → 1. Para cantidad disponible, exigir un factor positivo y resultados representables.

### Presentación y copia

* **Cálculo.** Multiplicar desde el original en cada ajuste. Tratar los extremos de un rango por separado. En `×1` y en la fila de referencia se muestra la cantidad completa con el formato numérico del idioma y en su unidad original.
* **Cantidades.** Usar enteros o fracciones exactas para piezas y medidas caseras, como `2⅔` o `3 7/16`. En masas y volúmenes graduados se propone mostrar hasta dos decimales, con **≈** si hay redondeo. Si una cantidad positiva se mostraría como cero o se desviaría más de un 2 %, mostrar más precisión o su fracción exacta. El umbral es una regla de presentación de la propuesta.
* **Factor y detalle.** El factor admite fracción simple exacta o decimal breve con **≈** cuando se abrevie. Mostrar el rendimiento fraccionario con **≈** y un decimal, o con más precisión si se mostraría como cero. Cada fila cuyo valor cambia muestra su cantidad original debajo. Junto a **≈**, ofrecer una acción independiente de **«Tengo…»** para consultar el valor exacto.
* **Contables partidos.** Mantener el valor calculado. Para huevos, sugerir batir y medir la parte correspondiente. Para sobres, indicar la fracción del sobre. Mostrar el aviso breve junto a la cantidad pertinente.
* **Copia.** «Copiar ingredientes» pone la lista ajustada en el portapapeles con su orden, las indicaciones literales y la marca **≈** donde proceda. Incluir una cabecera con el factor y las raciones conocidas. Si hay líneas **Revisar**, el texto incluye un aviso de que se conservaron sin ajustar. Si falla el portapapeles, mostrar el mismo texto seleccionable. Confirmar la copia solo después de que el navegador la complete. [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText).

### Persistencia y privacidad

**Propuesta ADR-MMA-026.** Guardar texto dentro de los límites, raciones, referencia confirmada y estado del ejemplo en `sessionStorage` bajo `miminiapp.receta-a-medida.v1`. El esquema se valida y el resultado se recalcula al restaurar. Conservar el estado confirmado al recargar o cambiar de idioma en la misma pestaña. El borrador de «Tengo…» y la opción temporal de deshacer viven en memoria. [Comportamiento de sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

Si el almacenamiento está bloqueado, seguir en memoria e indicar que la recarga o la navegación a otro idioma pueden perder el trabajo. Si hay un estado ilegible o incompatible, empezar con los campos vacíos y explicar la recuperación. «Empezar otra vez» borra la clave de la herramienta. Si el borrado falla, avisar de que el navegador puede restaurar el texto anterior. «Deshacer» restaura el estado anterior y su sesión si el navegador lo permite. La acción Deshacer sigue disponible hasta descartarla o comenzar una receta nueva.

La miniapp procesa el texto en el navegador. Los datos de la receta quedan fuera de URL, título de la página, registro y peticiones de red. Copiar es una acción explícita hacia el portapapeles. Tras cargar la herramienta, la edición, el cálculo, el ejemplo y la copia o su alternativa manual funcionan sin conexión.

## Experiencia y demostración

### Pantalla e interacción

* **Entrada vacía.** Mostrar el campo «Pega los ingredientes», una ayuda de una línea y «Ver un ejemplo». Pedir las raciones originales como campo opcional. El primer pegado válido muestra el resultado sin cerrar el editor ni quitarle el foco. «Ver resultado» acerca la lista y permite plegar el editor en móvil.
* **Resultado móvil.** Cantidades grandes y claramente pulsables en la columna izquierda. El ingrediente se lee a su lado y el original figura debajo cuando cambia. El encabezado muestra el factor y la base del cálculo, como «Por raciones» o «Según 2 huevos». Una línea de ayuda enseña que tocar una cantidad ajusta toda la lista. Al activar «Tengo…», la edición aparece debajo de la fila elegida.
* **Controles al alcance.** En móvil, una barra inferior con raciones y «Copiar ingredientes» cuando no se está escribiendo. Con una referencia confirmada, la barra muestra el rendimiento disponible y la vuelta a raciones se ofrece junto a la referencia. Con pantalla estrecha, zoom o teclado, la barra vuelve al flujo de la página si hace falta para mantener el foco, el error y las acciones alcanzables. En escritorio, editor a la izquierda y resultado a la derecha, con controles sobre la lista.
* **Identidad.** Utilizar tokens claro/oscuro/sistema de Laboratorio creativo, Space Grotesk en cantidades y DM Sans en el resto. El acento violeta indica la referencia y los controles activos. Cada aviso tiene texto. Comprobar cifras tabulares con la fuente local. La presentación `focused` se propone como punto de partida para la maqueta con el marco existente.
* **Movimiento.** Dejar fijas las posiciones de los controles al recalcular. Transición breve de opacidad o desplazamiento para el factor y la referencia confirmada. Las cantidades se actualizan al instante, también al pulsar repetidamente. Respetar `prefers-reduced-motion` en la miniapp.
* **Accesibilidad.** Dianas táctiles de 48 px como objetivo de MiMiniApp. Teclado completo, foco visible y devuelto a la cantidad al cerrar su editor. Etiquetar el control con el nombre del ingrediente y su cantidad. Un único anuncio de resultado agrupado tras la última edición válida, con errores asociados al campo. Validar reflujo a 320 px y zoom al 200 %. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

```text
Ingredientes ajustados             ×⅔
Según 2 huevos     Volver a 8 raciones
Rinde ≈ 5,3 raciones

[ 2 ]  huevos
       Original 3
[ ⅔ ]  vaso de yogur de aceite
[1⅓ ]  vasos de yogur de azúcar
[ 2 ]  vasos de yogur de harina

Editar ingredientes   Copiar ingredientes
```

### Textos de referencia ES / EN

| Uso | ES | EN |
| --- | --- | --- |
| Descripción | Ajusta una receta a tus raciones o a la cantidad que tienes de un ingrediente. | Scale a recipe by servings or by how much of one ingredient you have. |
| Entrada | Pega los ingredientes | Paste your ingredients |
| Ayuda | Una línea por ingrediente, con la cantidad delante. | One ingredient per line, with the amount first. |
| Origen / objetivo | Raciones de la receta / Raciones que quiero | Original servings / Servings I want |
| Ayuda del resultado | Toca una cantidad para ajustar toda la receta a lo que tienes. | Tap an amount to scale the whole recipe to what you have. |
| Editor | Tengo… / Usar cantidad / Cancelar | I have… / Use this amount / Cancel |
| Referencia | Según {línea ajustada} | Based on {adjusted line} |
| Rendimiento | Rinde ≈ {raciones} raciones | Makes ≈ {servings} servings |
| Estado de línea | Tal cual / Revisar separador / Revisar cantidad | As written / Check number separator / Check amount |
| Vista válida anterior | Mostrando el último ajuste válido | Showing the last valid adjustment |
| Acciones | Ver un ejemplo / Copiar ingredientes / Empezar otra vez / Deshacer | Try an example / Copy ingredients / Start over / Undo |

El catálogo de textos se completa con errores, nombres accesibles, plurales y estados de copia y almacenamiento. El ejemplo se carga en el idioma elegido en ese momento. Su etiqueta sigue visible hasta editar el texto de los ingredientes. Cambiar de idioma conserva el texto ya cargado como cualquier receta.

### Demostración reproducible

**ES · Bizcocho de yogur para 8.** `1 yogur natural`, `3 huevos`, `1 vaso de yogur de aceite`, `2 vasos de yogur de azúcar`, `3 vasos de yogur de harina`, `1 sobre de levadura química (16 g por sobre)` y `una pizca de sal`. Tocar los huevos, escribir 2 y confirmar. Factor `2/3`, rendimiento `16/3` mostrado como `≈ 5,3`, 2 huevos, ⅔ de vaso de aceite, 1⅓ de azúcar, 2 de harina y ⅔ del sobre. La pizca y los 16 g por sobre se conservan. Volver a 8 raciones restaura el factor `×1`.

**EN · Pancakes for 4.** `1½ cups flour`, `2 tbsp sugar`, `2 tsp baking powder`, `1¼ cups milk`, `1 egg`, `3 tbsp melted butter` y `a pinch of salt`. Cambiar el objetivo a 11. Factor `11/4`, 4⅛ cups de harina, 5½ tbsp de azúcar, 5½ tsp de impulsor, 3 7/16 cups de leche, 2¾ huevos y 8¼ tbsp de mantequilla. La pizca se conserva.

**Vídeo 9:16.** Abrir con «Solo me quedan dos huevos». Mostrar el 3 en la primera toma y dejar que se lea «Según 2 huevos» en la siguiente. Cerrar copiando la lista ajustada. Usar el ejemplo funcional y comprobar que se leen la cantidad, el ingrediente y el factor en el encuadre.

**Revisión de la maqueta.** Plantear «Haz este bizcocho con dos huevos» y comprobar que la acción se descubre desde la lista con la ayuda de pantalla. Pedir después ajustar otra receta a 11 raciones y copiarla con una línea ambigua. La revisión comprueba si se entiende el origen de las cantidades y qué queda por comprobar antes de cocinar.

## Encaje con MiMiniApp

Seguir la [guía de miniapps](../guides/miniapps.md) y el [estándar frontend](../standards/FRONTEND.md). El módulo previsto vive en `src/miniapps/receta-a-medida/`, con metadatos ES/EN, dominio separado y estilos propios. `SiteLayout` aporta el marco y el título. `validateTranslationParity` comprueba los textos propios. El alta futura usa `src/miniapps/registry.ts` y las rutas genéricas de ADR-MMA-011/016. ADR-MMA-017/019/022 cubren identidad, apariencia y calidad. ADR-MMA-023 aporta la opción `focused` del marco.

La base `fa6a0ad` incorpora ADR-MMA-025 y admite un icono local opcional en el descriptor. Si se incorpora un recurso de marca propio, I4 validará también su asignación en `scripts/publication/public-assets.json` con el selector de publicación vigente. [Arquitectura](../../ARCHITECTURE.md), [publicación selectiva](../guides/selective-publication.md).

## Aceptación y evidencia

| ID | Resultado verificable | Evidencia prevista |
| --- | --- | --- |
| RM-01 | Pegado con viñetas y números de ambos idiomas. Rango y envases reconocidos. `1,500 g`, cantidades múltiples y líneas de pasos reciben el tratamiento documentado. | Casos de tabla de dominio y prueba de copiar con texto literal. |
| RM-02 | 4 → 11 da `11/4`. 12 → 1 da `1/12`. 3 → 2 huevos da `2/3`, incluso sin raciones originales. Cambiar idioma, repetir un ajuste y volver a la base produce el mismo valor. | Expectativas independientes y E2E ES/EN. |
| RM-03 | Valores pequeños positivos siguen siendo positivos. `2⅔` huevos y `⅔` de sobre conservan la proporción. Una aproximación de pantalla queda indicada también en la copia. | Casos de fracciones, números pequeños y redondeos, verificación del texto copiado y alternativa manual. |
| RM-04 | Pegar conserva el foco. Vista previa, invalidación, confirmación, cancelación, cambio de raciones y eliminación de una referencia siguen el contrato. El selector de idioma y «Deshacer» restauran estado confirmado. | Componentes y E2E con entrada larga, sesión bloqueada/corrupta, recarga y cambio ES/EN. |
| RM-05 | La acción «Tengo…» se encuentra en la lista. Cantidades y errores legibles con teclado abierto, a 320/393/1440 px y con zoom. Los cambios se comprenden con teclado y lector de pantalla. | Maqueta con texto real para revisión del propietario, capturas claro/oscuro, axe, prueba manual con Safari en iPhone y Chrome en Android, movimiento reducido. |
| RM-06 | Tras la carga, la receta de prueba se ajusta y copia en modo avión. El contenido introducido queda en el dispositivo salvo el paso explícito al portapapeles. | Registro de red con datos sintéticos, navegador desconectado y comprobación física. |
| RM-07 | El ajuste responde al teclear y el resumen permanece localizable. Medir cálculo de 60 líneas con CPU ralentizada 4×, objetivo de 16 ms, y JS/CSS propio adicional de hasta 40 KiB sin comprimir. Informar del total servido. | Perfil de las tres acciones principales, pulsaciones rápidas y revisión geométrica del foco. Las métricas de laboratorio se consignan como tales. [INP](https://web.dev/articles/inp). |
| RM-08 | Las rutas, traducciones y el catálogo funcionan en la candidata. El módulo se carga solo en sus rutas y Plan B conserva su recorrido. | `npm run verify`, CI, matriz manual y regresión sobre una base identificada en el ExecPlan. |

**Plan de ejecución.** El [ExecPlan RM-01](../exec-plans/active/RM-01-receta-a-medida.md) define las iteraciones, los criterios de cierre y el seguimiento de avisos y commits. La aprobación de la ficha, la decisión de sesión y el ExecPlan corresponden al propietario.

**Decisiones para revisión.** Confirmar que la primera versión conserva las unidades de origen, que «Tengo…» confirma tras una previsualización en vivo y que la sesión conserva el ajuste confirmado. Elegir la presentación del marco sobre la maqueta. La revisión de experiencia de esta ficha se hizo manualmente con los criterios de Impeccable en un solo contexto.
