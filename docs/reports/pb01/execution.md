# PB-01 — Ejecución de Plan B

**Actualizado:** 2026-11-17. **Responsable:** propietario de MiMiniApp. **Plan canónico:** [PB-01](../../exec-plans/active/PB-01-plan-b.md). Un solo informe para I1–I6; las secciones futuras se completarán con evidencia real.

## I1 — Base lógica y referencia

### Alcance y base

El propietario solicita repasar la documentación y comenzar la primera iteración. Se registra selección de Plan B, ficha v06 aprobada y ejecución parcial de I1. La entrega sigue la instrucción previa de usar el marco: rama, verificaciones, commit/push y PR a staging, con merge humano. No se ejecutan I2–I6 ni se aprueban ADR-MMA-020/021 por esta instrucción.

Rama `feature/pb01-i1-base` desde staging `d3d8386e6077911d84ee85bcc16981177f3d3b1d`, árbol `5136a7fa29ebbcaab95f8a53df08b8038483965e`. Frente a la base de planificación `07b95fd6b168b9b03150a48a9541ddbd3767748e`, los cambios son documentales: plan único, cierres aceptados y contrato de entrega actualizado; no cambia aplicación, pruebas, dependencias, configuración o activos de la plataforma.

Repaso previo: AGENTS, reglas de PLANS (un estado y autorización parcial, cierre global I6), definición y ficha v06, decisiones técnicas aplicables, arquitectura real, guía de miniapps, convenciones frontend, seguridad, evidencias y deuda. Se conserva la identidad común, ES/EN, el registro vacío hasta I5, ausencia de nuevas dependencias y dominio sin navegador, traducciones o almacenamiento.

### Referencia reproducible anterior al código

Node **24.22.2**, npm **11.19.1**, Chromium **156.0.8078.4**, Playwright **1.64.1**, revisión **1248**. `ASTRO_TELEMETRY_DISABLED=1` y navegador fijado mediante `PLAYWRIGHT_BROWSERS_PATH`. Antes de implementar, `npm run verify` terminó con código 0: tipos sin diagnósticos, lint, formato, hosting, **343 unitarias**, **9 componentes**, **78 E2E** e integración modular satisfactorios.

Inventario de las páginas construidas con contexto frío, viewport 393×851, temas claro/oscuro, recursos locales y fuentes listas. Cada fila coincide en los dos temas:

| Ruta | HTTP | Solicitudes | Bytes solicitados sin comprimir | Suma gzip estimada |
| --- | --- | --- | --- | --- |
| `/es/` | 200 | 4 | 196432 | 151480 |
| `/en/` | 200 | 4 | 196345 | 151419 |
| Ruta inexistente `/pb-i1-missing/` | 404 | 4 | 193761 | 150986 |

Recursos: documento, CSS común y las dos fuentes WOFF2. **Cero solicitudes externas**. La cifra gzip es la suma de comprimir cada cuerpo con gzip de Node, no una medición de Content-Encoding o Core Web Vitals. Se guardaron capturas mínimas ES/claro y EN/oscuro con animaciones desactivadas para comparación local; no son una revisión visual humana ni evidencia pública enlazada.

Se registraron hashes de los **19 archivos** del build. El inventario de deuda previo tiene blob Git `1e97e316c4336a53c888f5caf901084ecff13bbe`: PEND-007 (dependencias de desarrollo), PEND-009 (operación/mantenimiento) y PEND-010 (documentos históricos), entre otros; no se modifica ni declara resuelta esa deuda. Se conservan los límites aceptados de CP-02 e I-03. No se ejecutó una auditoría nueva de paquetes ni se confundieron sus cifras históricas con un resultado actual.

### Implementación

* `domain/validation.ts`: tipos de entradas, códigos de error independientes del idioma, trim exterior y límites por puntos de código; saltos pegados se rechazan antes del trim. Mantiene texto, puntuación, mayúsculas y Unicode, sin truncar ni interpretar HTML. Obstáculos cerrados, validación condicional de Otro, hora opcional y conjunto de días sin duplicados o huecos. Los valores normalizados del resultado no sustituyen al estado editable de futuros pasos.
* `domain/narrative-date.ts`: reloj inyectado consultado una vez; fecha local actual y primer día del siguiente mes natural, con año correcto y variante de enero. Copia inmutable de valores numéricos, independiente de posteriores cambios de reloj o del objeto Date entregado.
* `metadata.ts`: descriptor draft puro, título/descripción ES/EN y categoría everyday. Sin fecha de publicación, loader, entrada de producto o inscripción en el registro real.
* Helpers y fixture propios: copias temporales del proyecto con dependencias ya instaladas, registro sustituido solo en la copia y entrada sintética. Construyen variante draft con catálogo vacío y variante publicada de prueba; puertos asignados por el SO, baseURL propio, reutilización segura ante arranques simultáneos y limpieza de servidores/directorios.
* Las pruebas heredan el control de consola/red de `tests/e2e/fixtures.ts`. Comparan hashes del código copiado y comprueban que ni src ni dist reales cambian durante su ejecución; rechazan rutas y marcas de Plan B en el build público.

Ajustes comunes mecánicos necesarios: `tests/integration/modular-build.ts` limita su subejecución de unitarias a los módulos sintéticos I-02. Conserva sus expectativas de 2/4 pruebas y todos sus controles negativos; la batería general ejecuta además las nuevas pruebas reales de Plan B. `playwright.config.ts` excluye únicamente `.local/` del descubrimiento, porque contiene copias generadas con specs que no son suites independientes. No se desactivan pruebas del producto ni se cambia el catálogo para conseguir verde.

### Hallazgos y correcciones

| Hallazgo | Origen / impacto | Corrección y comprobación |
| --- | --- | --- |
| Conteo de fixtures I-02 incorporaría pruebas reales copiadas. | Supuesto previo del arnés, descubierto al añadir el primer módulo; produciría un falso fallo. | Filtro por path de las fixtures; pruebas de Plan B siguen en test:unit y E2E general. |
| Descubrimiento de specs duplicadas dentro de `.local/` al repetir verify. | Supuesto previo de Playwright con testDir raíz, expuesto por las copias del primer módulo con E2E; la primera ejecución pasaba y la siguiente fallaba al cargar una fixture desde esas copias. | testIgnore específico de artefactos; repetir verify manteniendo las copias existentes, con los 88 E2E reales descubiertos. |
| Regla CSS adicional de 29 bytes generada desde el nombre de una prueba. | Interacción con detección automática de Tailwind; alteraba el build público aunque no se registró la miniapp. | Nombre de prueba ajustado sin modificar sus aserciones o estilos globales; comparación final del build con la referencia. |
| Preview programático rechazaba un root en forma de URL. | Helper nuevo; el API público de Astro fijado usa la ruta como string al explorar rutas. | Se pasa la ruta absoluta; pruebas reales de ambas variantes y navegación ES/EN satisfactorias. |
| Lint interpretaba el callback de fixture como hook React. | Helper nuevo dentro del módulo. | Callback renombrado y estructura de cierre corregida; sin cambiar reglas globales ni desactivar lint. |
| Una ejecución dirigida de check no llevaba la variable de telemetría. | Entorno: intento de crear configuración Astro fuera del workspace. | Repetida con `ASTRO_TELEMETRY_DISABLED=1`, sin ampliar permisos ni cambiar HOME; tipos sin diagnósticos. Para el log de Wrangler se usa `WRANGLER_LOG_PATH` en un directorio temporal escribible, sin cambiar hosting o credenciales. |

### Dispositivos y acceso de I4

El propietario confirma que por ahora dispone de **Chrome de escritorio**; no se han aportado modelo/versión o acceso a iPhone/Safari y Android/Chrome. Chromium de escritorio y Pixel 7 emulado prueban el código automatizado, no equivalen a esos teléfonos físicos.

Existe staging HTTPS, que sirve el código fusionado. No hay una preview HTTPS autorizada del candidato de una rama feature. Esto no bloquea I1, pero sí las comprobaciones esenciales de I4; no se rebaja la matriz de la ficha por falta de dispositivos.

**Propuesta concreta, sin activar:** si se mantienen los teléfonos como objetivo, habilitar un Worker estático temporal separado, `miminiapp-plan-b-preview`, para el build de la candidata identificada por SHA, solo con datos sintéticos. URL pública a confirmar bajo el subdominio existente, sin secretos o persistencia remota; ciclo de vida limitado hasta terminar la validación. Objetivo de coste 0 USD sujeto a comprobar cuotas. Requiere decisión/autorización del propietario para crear el recurso, acceso de publicación limitado a ese Worker, publicación de la candidata y retirada posterior. No modifica staging/producción ni sus publicadores, no se crea por este informe y no se promete que resuelva la disponibilidad física de teléfonos. Otra matriz de dispositivos requiere revisar expresamente la ficha antes de I4.

### Verificación y entrega

Esta sección registra las comprobaciones locales. La evidencia remota se adjunta a la PR de entrega para su SHA; no se atribuyen resultados remotos al workspace. No se ha fusionado ni publicado la miniapp.

**Resultado local final: satisfactorio**, `npm run verify` con código 0: tipos sin errores/warnings/hints, lint, formato, hosting offline, **412 unitarias** (69 nuevas de dominio/metadatos de Plan B), **9 componentes**, **88 E2E** (10 nuevos de aislamiento, en dos perfiles Chromium) e integración modular. Se repitió con las copias `.local/` de una ejecución anterior presentes: no se redescubren como suites. Las unitarias del módulo también pasan en `TZ=America/New_York` y `TZ=Pacific/Kiritimati` (69 en cada zona).

La comparación posterior da los **19 archivos públicos idénticos byte a byte** a la referencia, con iguales solicitudes, cuerpos, hashes y estimaciones gzip para ES/EN/404 en claro y oscuro. Cero recursos adicionales de Plan B solicitados; no equivale a medir el presupuesto del producto futuro o Core Web Vitals de campo. Se conserva el catálogo vacío y sus aserciones originales. Los helpers cierran sus previews y retiran sus directorios propios; las copias históricas de integración I-02 permanecen como artefactos ignorados.

| Criterio de I1 | Evidencia / resultado |
| --- | --- |
| PB-I1-01 | Base/árbol, entorno, batería previa, inventario de seis vistas y deuda registrados. Cumple. |
| PB-I1-02 | Unicode, límites, saltos, Otro, hora/días, meses y sesión a medianoche; dos zonas adicionales. Cumple. |
| PB-I1-03 | Variantes draft/publicada sintética en builds/previews independientes, hashes antes/después, exclusión pública y limpieza; 10 E2E nuevos satisfactorios. Cumple. |
| PB-I1-04 | Diff acotado, batería completa y alcance del dispositivo/HTTPS explícito. Chrome de escritorio disponible; móviles físicos/preview HTTPS pendientes para I4. Cumple el inventario, sin atribuir pruebas móviles realizadas. |

**Handoff para I2:** dominio y descriptor draft listos, sin UI real ni registro público. IDs implementados: time/tiempo, motivation/motivación, unexpected/imprevisto, overload/exceso, forgetting/olvido y other/otro; días MO–SU. `captureNarrativeDate` se llama al empezar o cargar ejemplo y se conserva, no se recalcula al navegar. `validatePlanInputs` exige los campos activos completos; el futuro estado editable puede conservar entradas parciales sin intentar exportarlas. Reutilizar los helpers y su baseURL, no publicar fixtures. Antes de comenzar calendario se requieren la aprobación de ADR-MMA-021 y la autorización de I2. La selección de I1 como completada no acepta PB-01 completo: I2–I6 siguen sin iniciar.

No quedan fallos materiales abiertos de I1; las limitaciones físicas y de HTTPS son entradas futuras identificadas, sin pruebas sustitutivas. No hay nuevas dependencias, persistencia, exportaciones, cambios de plataforma o publicación.

### Integración posterior de I1

PR [#19](https://github.com/aalexlpez/miminiapp/pull/19) fusionada por el propietario en staging `782cdd4035e9698dbb59cf57f577b99659f91e5f`. [CI 43888635919](https://github.com/aalexlpez/miminiapp/actions/runs/43888635919) satisfactorio sobre el head `c1231be2a0fed9069a69b0915019a8afd02b584c`; [staging 43893827682](https://github.com/aalexlpez/miminiapp/actions/runs/43893827682) satisfactorio sobre el merge. No significa que Plan B esté publicada: el registro real sigue vacío.

## I2 — Calendario

### Base y autorización

Después de confirmar el merge, el propietario pide «Avanza con la siguiente iteración». Se registra ADR-MMA-021 Aprobada y ejecución parcial de I2. Rama `feature/pb01-i2-calendar`, base `782cdd4035e9698dbb59cf57f577b99659f91e5f`, árbol `3305be5122016931b596d5798ad53c188ed790d5`. Se reutilizan dominio, descriptor y helpers de I1; el merge no altera el contenido de I1. No se repite una batería previa sin cambios: su CI/staging ya acreditan la base y la nueva batería final incluye ambos dominios.

### Implementación y límites

* `domain/calendar.ts`: un modelo inmutable compartido con inicio/fin, días ordenados MO–SU, COUNT=4×n, UID, DTSTAMP y texto validado. La fecha local se lee del argumento de exportación, excluye hoy y busca desde mañana. Suma 15 minutos de reloj con cambio de fecha. La aritmética de días usa etiquetas gregorianas con UTC como herramienta interna; nunca convierte la hora flotante de los eventos a UTC.
* `domain/icalendar.ts`: VCALENDAR/VEVENT/VALARM, UID/DTSTAMP UTC, DTSTART/DTEND flotantes, regla semanal sin UNTIL, alarma DISPLAY al inicio. Escapa TEXT, escribe CRLF y pliega a 75 octetos UTF-8, contando el espacio de continuación y sin partir caracteres.
* `domain/google-calendar.ts`: devuelve una URL de plantilla con action/text/details/dates/recur, codificados con URLSearchParams. Consume el mismo modelo y texto que `.ics`; no abre Google ni ejecuta peticiones.
* `i18n/es.ts`, `en.ts` y `calendar-copy.ts`: subconjunto de textos de calendario de la ficha, con claves/placeholders equivalentes y sustitución literal en una sola pasada. No se vuelve a interpretar un placeholder que ya venía dentro de una frase personal; la lógica de dominio no importa traducciones.
* Helper `tests/helpers/calendar-samples.ts`: produce dos archivos de calendario y un JSON de enlaces con datos sintéticos. No utiliza almacenamiento, llama al navegador o instala dependencias.

`createCalendarEvent` recibe el reloj ya leído y el UID. El futuro adaptador de I4 debe proporcionar un UID nuevo mediante la API local al iniciar cada exportación y reutilizar el modelo al elegir un formato. No se presenta la inyección de un UID fijo de prueba como generación aleatoria de producción. Reimportar puede duplicar eventos; el futuro aviso de la ficha se conserva.

Se revalidan el modelo y los textos antes de serializar, evitando identidad, fechas, duración, recurrencia o entradas alteradas. Caracteres de control o sustitutos Unicode aislados que el formato no puede representar provocan error; nunca se eliminan o sustituyen en silencio. El adaptador de I4 debe conservar el plan y presentar el error recuperable. Los límites implementados son años 0001–9999 y un intervalo completo representable.

Los horarios flotantes conservan las etiquetas de hora, incluso en fechas con cambio horario. No garantizan la interpretación de horas ambiguas/inexistentes por cada cliente ni una zona fija al viajar. Google puede interpretar el horario según su configuración; construir el enlace no prueba importación, consentimiento, popup o guardado.

### Pruebas y contraste

**52 pruebas nuevas** de calendario, incluidas **889 combinaciones** dentro de una prueba exhaustiva (127 conjuntos no vacíos × siete días de exportación). Expectativas independientes del escritor: enumeración de fechas, lectura del subconjunto de propiedades emitido por componente, reconstrucción de TEXT y recuento de octetos. Ese lector de pruebas no es un validador general de todo iCalendar ni sustituye la importación en aplicaciones reales.

Casos: selección de 1/5/7 días y conjuntos intercalados, hoy antes de su hora, medianoche, febrero bisiesto/no bisiesto y diciembre/enero; series alrededor de DST sin normalizar 02:30. Ejemplo de ficha: exportar el 2026-11-15, lunes–viernes a las 20:00, produce inicio 16 de noviembre, fin 20:15, 20 eventos y última aparición 11 de diciembre. Ambas salidas conservan fechas, regla y texto validado.

Se prueban comas, punto y coma, barras, CRLF de las descripciones, acentos, emoji, secuencias compuestas y fronteras de plegado. Textos con aspecto de propiedades se mantienen como datos; identidades y entradas que intentan introducir saltos se rechazan. URLs con &, #, ?, %, +, llaves o texto de aspecto HTML se decodifican al valor literal esperado, sin parámetros nuevos. La prueba de ausencia de comunicación bloquea fetch antes de ejecutar el modelo y los dos generadores.

El primer lector de pruebas confundía DESCRIPTION del evento con DESCRIPTION de la alarma. Se corrigió el ámbito por componente y se mantienen las aserciones de unicidad dentro de cada componente, ambas propiedades y todos los controles negativos; no se eliminó la alarma ni se relajó el formato.

**Resultado final local:** `npm run verify`, código 0, Node 24.22.2/npm 11.19.1/Chromium r1248: tipos sin diagnósticos, lint, formato, hosting offline, **464 unitarias**, **9 componentes**, **88 E2E** e integración modular satisfactorios. I1+I2 pasan también con **121 unitarias en cada zona**, `America/New_York` y `Pacific/Kiritimati`. Los fixtures de integración conservan sus 2/4 pruebas propias y la exclusión de sus copias del descubrimiento.

El build público conserva sus **19 archivos idénticos byte a byte** a la referencia de I1. No se altera registro, rutas, layouts, estilos, plataforma, dependencias/lockfile, workflows o infraestructura. Sin nuevas solicitudes de recursos de Plan B y sin archivos de muestra en el catálogo o bundle público. La evidencia de CI para el SHA definitivo se adjunta en la PR de entrega, separada de estos resultados locales.

### Muestras reproducibles y fuente técnica

Comando existente y probado con Node fijado:

```sh
TZ=UTC node src/miniapps/plan-b/tests/helpers/calendar-samples.ts .local/verification/plan-b/i2
```

Genera `plan-b.ics`, `bad-day-plan.ics`, `calendar-urls.json` y una nota de límites, con el ejemplo sintético ES/EN de la ficha, fecha 2026-11-15 y UIDs fijos solo para pruebas. Los archivos son locales e ignorados: no se enlazan como evidencia compartida; el helper versionado permite regenerarlos. No se abrieron enlaces ni se importó la muestra en un calendario. La prueba física de los botones de I4 sigue pendiente.

Se contrastaron plegado, valores TEXT, tiempos flotantes y componentes con [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545), §§3.1, 3.3.5, 3.3.11, 3.6.1 y 3.6.6. No se añade un servicio o biblioteca de calendario ni se atribuye compatibilidad de un cliente a la validez del archivo.

| Criterio | Resultado |
| --- | --- |
| PB-I2-01 | Fechas, 15 minutos y cuatro apariciones por día contrastados mediante tablas y enumeración independiente. Cumple. |
| PB-I2-02 | Estructura emitida, escapes, CRLF, límites UTF-8 y rechazo de entradas inválidas contrastados, sin alterar texto silenciosamente. Cumple. |
| PB-I2-03 | Datos de ambos formatos equivalentes, texto ES/EN intacto y cero comunicaciones del generador. Cumple. |
| PB-I2-04 | Dominio I1, plataforma e integración siguen pasando; build público idéntico. Cumple. |

**Handoff para I3:** conservar APIs puras y un solo modelo de calendario; la fecha narrativa sigue siendo la de inicio de sesión y la del evento se toma al exportar. Extender los diccionarios existentes sin duplicar las claves de calendario o sus placeholders. Las acciones de descarga, UID aleatorio por exportación, consentimiento y APIs de navegador pertenecen a I4. ADR-MMA-020 continúa Propuesta y se requiere aprobarla/autorizar I3 antes de persistir o desarrollar su recorrido. Solo Chrome de escritorio disponible por ahora; matriz física y HTTPS de candidata mantienen sus pendientes para I4.

## Consolidación de I2 — rama estable y trazabilidad

El 2026-11-16 el propietario solicita una rama por ExecPlan, planes divididos en iteraciones y commits identificados por la iteración respectiva. Se registra [H-007](../../harness-decisions.md#h-007--una-rama-por-execplan-y-commits-por-iteración) y se aplica a PB-01 sin iniciar I3.

La API confirma [PR #20](https://github.com/aalexlpez/miminiapp/pull/20) fusionada en staging `e4c956e46a57fadcb7cecaf187df2aba592bad19`. El head integrado de I2 es `62add4d3be73a22452a2663a269172fdf7f4080c`; [CI 43900237824](https://github.com/aalexlpez/miminiapp/actions/runs/43900237824) satisfactorio. El merge tiene ese head como segundo padre y no altera sus archivos.

Rama estable adoptada: `feature/pb01-plan-b`. Los heads históricos de `feature/pb01-i1-base` (`c1231be2a0fed9069a69b0915019a8afd02b584c`) y `feature/pb01-i2-calendar` (`62add4d3be73a22452a2663a269172fdf7f4080c`) son ancestros de staging y sus PR #19/#20 están cerradas y fusionadas. Se retiran las referencias de esas dos ramas al publicar la rama estable, conservando todos los commits y la evidencia por SHA. El estado previo de las secciones I1/I2 describe su ejecución original.

La actualización actual es documentación de entrega/trazabilidad de I2, con commit `docs(PB-01/I2): ...`. Las siguientes iteraciones reutilizarán esta misma rama; si hay entregas parciales se sincroniza desde staging, sin reescribir commits. No se cambia configuración de GitHub, CI, aplicación o dependencias.

Revisión final: coherencia entre AGENTS, PLANS, plantilla, guía, decisión H-007 y control de PB-01; enlaces locales y diff; ascendencia de los heads retirados, conservación del historial y rama estable publicada. No se atribuye una nueva batería funcional local a este ajuste documental. La PR de entrega incorpora la verificación remota del candidato definitivo.

## I3 — Recorrido y estado

### Autorización y base

El propietario confirma la integración de I1/I2 en una rama y solicita continuar con la siguiente iteración. Se registra ADR-MMA-020 Aprobada y ejecución de I3, conservando el marco de entrega y merge humano. Rama estable `feature/pb01-plan-b`, sincronizada por fast-forward desde staging `4203db5ebc33e1f899a6768bdada7108068a08c5`, árbol `958a92a3088cc44f9865e8cad13a86a340d8a0f2`. I1/I2 y H-007 están integradas; no se reescribe historial ni se abre otra rama.

Repaso de AGENTS, PLANS/H-007, ficha v06, ADR-MMA-020/021, arquitectura, estándares frontend/seguridad y entradas/salidas de PB-01. No cambia el contrato funcional. La entrada real sigue sin inscripción en el registro público; pruebas sobre copias aisladas no equivalen a publicación.

### Implementación

* `entry.astro`/`App.tsx`/`app.css`: portada, propósito, obstáculos, plan y resultado ES/EN, foco por paso, errores asociados, contadores Unicode, Otro y hora/días opcionales. Atrás conserva entradas; Añadir hora retorna al control enfocado. Las sugerencias sustituyen solo su campo. El resultado usa el mismo formateador de texto validado que calendario y React lo presenta como texto.
* Diccionarios ES/EN ampliados con paridad estructural/placeholders comprobada. Ejemplo con valores de la ficha, etiqueta hasta modificación efectiva y conservación literal al cambiar de idioma. Fecha narrativa fijada al comenzar/ejemplo y restaurada sin recalcularla al navegar o cambiar de mes.
* `domain/session-state.ts`: esquema versionado validado, campos/IDs/días/fecha acotados y validación de pasos ya completados; permite entradas incompletas en el paso editable. Rechaza datos corruptos, incompatibles o inválidos con retorno explicado a portada.
* `browser/session.ts`/`controller.ts`: solo `miminiapp.plan-b.v1`; lectura/escritura/borrado protegidos, memoria con aviso explícito y eliminación de copia obsoleta ante escritura fallida cuando es posible. Reset limpia la memoria y su clave sin recrearla automáticamente; explica un borrado rechazado. No modifica apariencia ni claves ajenas.
* Con almacenamiento bloqueado, la navegación de idioma pide confirmación antes de perder la memoria. Listener limitado a enlaces equivalentes de esta miniapp, con retirada al desmontar; no cambia cabecera compartida ni historial del navegador.
* Helpers conservan el modo fixture de I1 y añaden modo UI real en sus copias; previews propios y auditoría de hashes/limpieza. Registro real, plataforma, dependencias, hosting, workflows y controles sin modificaciones.

No hay acciones de descarga, apertura Google, PNG o compartir simuladas. Pertenecen a I4; gris y movimiento del sello/integración pública se reservan a I5.

### Verificación y hallazgos

`npm run verify` completo, código 0: tipos sin diagnósticos, lint, formato, hosting offline, **493 unitarias**, **14 componentes**, **104 E2E** e integración modular satisfactorios. Node 24.22.2/npm 11.19.1/Chromium r1248, mismo entorno de I1/I2. Después de esa pasada solo se añade una prueba de componentes para conservar situación/acción al editar propósito/obstáculo y sustituir sugerencias de forma independiente: tipos/lint/formato y componentes repetidos, **15 componentes** satisfactorios. Runtime sin cambios desde la batería completa; CI del candidato final se verifica en la PR de entrega. Los fixtures de integración mantienen sus 2/4 pruebas propias.

Los E2E reales ejecutan ejemplo completo ES/EN, navegación/reload/reset, reloj de enero a febrero y cambio de idioma conservando texto, Otro, validación de días y texto similar a HTML. Interceptan peticiones/cuerpos y consola con centinela sintético: no sale en red, URL o título ni se interpreta como marcado. Comprueban lectura/escritura/borrado rechazados, cancelación/aceptación del aviso de idioma y apariencia intacta. axe no detecta infracciones en los cinco estados del recorrido en oscuro, en perfiles Chromium escritorio/móvil emulado; no certifica accesibilidad ni sustituye dispositivos reales.

La primera pasada E2E detectó selectores ambiguos entre el estado de movimiento común y el aviso de la miniapp; se acotan al módulo sin debilitar controles de plataforma. Tipos detectó una firma ambigua en el mock de Storage, corregida separando métodos de lectura/escritura. Los escenarios afectados se repiten en la batería final.

Inspección asistida de capturas sintéticas a 393 px, formulario claro y resultado oscuro: tipografía, tokens, controles y envoltura coherentes con el sitio, sin duplicar h1. Resultado sin desbordamiento horizontal a 320 px en ambos temas. Capturas locales de diagnóstico; no son aprobación visual humana ni el acabado de I5. No se añade librería ni dependencia.

### Comparación con la referencia

El build público conserva **19 archivos** y ninguna ruta o chunk de Plan B. No es idéntico byte a byte: usar cinco tokens ya aprobados (`tint-ink`, `selection`, `selection-ink`, `error-ink`, `radius-panel`) hace que Tailwind conserve sus declaraciones, antes eliminadas por falta de uso. **+127 bytes de CSS sin comprimir**, sin reglas de la UI. Los cuatro HTML solo cambian el nombre hash de ese CSS; se comprueba normalizando exactamente ese nombre y las cinco declaraciones. Resto de archivos idénticos.

| Ruta | Solicitudes | Bytes base → I3 | Gzip estimado base → I3 | Externas |
| --- | --- | --- | --- | --- |
| `/es/` | 4 → 4 | 196432 → 196559 | 151480 → 151506 | 0 |
| `/en/` | 4 → 4 | 196345 → 196472 | 151419 → 151444 | 0 |
| 404 | 4 → 4 | 193761 → 193888 | 150986 → 151012 | 0 |

Medición con el entorno/viewport/procedimiento de I1, ambos temas y contexto frío. El crecimiento es el coste de conservar tokens existentes, no carga de React o UI en portada; no se cambia el CSS global para ocultarlo. No constituye medición de Core Web Vitals ni presupuesto final del módulo, reservado a I5/I6.

### Criterios y handoff

| Criterio | Evidencia / resultado |
| --- | --- |
| PB-I3-01 | Componentes/E2E ES/EN: recorrido, validación, sugerencias, Atrás, foco y entradas conservadas. Cumple localmente. |
| PB-I3-02 | Ejemplo/edición efectiva, fecha/idioma, reset, catálogo y texto literal comprobados. Cumple localmente. |
| PB-I3-03 | Sesión válida restaurada, esquema inválido descartado y fallos de acceso/escritura/borrado explícitos; claves ajenas intactas. Cumple localmente. |
| PB-I3-04 | Batería completa y aislamiento de fuentes/previews; catálogo real vacío y diferencia de tokens cuantificada. Cumple localmente. |

**Handoff para I4:** `controller.getSnapshot().session` contiene entradas y narrativa; `validatePlanInputs` produce valores normalizados. Reutilizar formateo/modelo de I2. El evento lee la fecha al exportar, no la narrativa, y recibe UID nuevo. Las acciones externas requieren aviso/gesto/errores del contrato aprobado. Mantener entrada draft sin registro hasta I5. Solo Chrome de escritorio disponible: acceso HTTPS de candidata y matriz física iPhone/Safari + Android/Chrome pendientes. No crear hosting ni sustituir pruebas físicas por emulación.

PB-01 permanece `En curso`; cumplir I3 no acepta el producto ni autoriza I4. La entrega por commit `feat(PB-01/I3): ...`, push y PR usa la misma rama estable. El CI del head y la PR se enlazan en la entrega; el propietario conserva el merge manual.

## I4 — Imagen y exportaciones

### Alcance autorizado y base

El 2026-11-17 el propietario confirma el merge de I3 y pide continuar. Se autoriza implementar/probar localmente I4 y entregar mediante commit/push/PR, conservando la rama estable y merge humano. Base staging `8a22fb37c8baf5dd1f399ce28c09031beb2aeb61`, árbol `6784d884f131680daa29ec1e35c35a617102707d`; fast-forward de `feature/pb01-plan-b` desde PR #22. Mismo contenido funcional de I3, sin reinterpretar su evidencia como validación de exportaciones.

**I4 permanece abierta.** Solo consta Chrome de escritorio disponible. La implementación local puede avanzar según la autorización, pero no acredita la importación, guardado, recorte del fondo o modo avión físicos de iPhone/Safari y Android/Chrome. Tampoco hay vista previa HTTPS de candidata autorizada. Se conserva la propuesta de Worker temporal de I1, sin crear recursos, activar túneles ni publicar un prototipo. No se incorpora el descriptor al registro ni se inicia I5.

### Implementación y límites

* `ExportPanel.tsx` monta las salidas únicamente en resultado. Mantiene el plan ante errores/cancelaciones y muestra acciones en orden: calendario, imagen y enlace de la herramienta. Avisos ES/EN, diálogo nativo etiquetado, foco inicial en Cancelar y retorno al botón de origen. No anuncia que un calendario ya guardó/importó un evento.
* `.ics` usa el modelo/formateador de I2, fecha leída al exportar y `crypto.randomUUID()` nuevo por exportación. Descarga Blob con nombre ES/EN; avisa de duplicados. Las URLs de descarga se revocan a los 60 segundos para permitir su consumo, antes si se abandona resultado. No añade una variante iOS sin evidencia física.
* Google solo tras confirmación, sin petición ni URL personal previa. Comprueba la señal offline, abre una ventana vacía desde el gesto y comprueba que exista; anula su opener antes de adjuntar datos y navega con enlace `noopener noreferrer`/`no-referrer`. Esta secuencia permite detectar bloqueo sin confundir el retorno null normal de `window.open` con noopener con un error. Cancelar/Escape no exportan; fallo de ventana conserva plan y `.ics`. La prueba intercepta la navegación: no se envía texto real a Google ni se afirma compatibilidad del servicio.
* `domain/wallpaper-layout.ts` ajusta palabras/grafemas mediante `Intl.Segmenter`, conservando caracteres y separadores. PNG fijo 1179×2556, márgenes 10 %, bloque entre 32–72 %, etiqueta y frase íntegra, fuente desde 7 % hasta mínimo 4 % del ancho (47,16 px). Si no cabe o falla canvas/codificación, muestra error y reintento; no trunca ni usa elipsis.
* `browser/wallpaper.ts` espera fuentes locales, resuelve tokens del tema y libera el respaldo del canvas tras codificar. El PNG se prepara antes del clic para conservar la activación al compartir; se regenera al cambiar tema/sistema y descarta generaciones obsoletas. Vista previa, descarga o compartir archivo según capacidad; nota de que el destino puede recibir la imagen. Cancelación voluntaria sin éxito falso ni mensaje alarmante; fallo mantiene Abrir imagen como alternativa manual. Instrucciones genéricas sin prometer una opción de SO aún no comprobada.
* Compartir herramienta entrega únicamente texto promocional y URL limpia del origen/idioma actual. Copiar enlace confirma solo al resolver Clipboard; si falla, muestra URL seleccionable. Sin plan/hora/días en URL, títulos, logs o destinos no consentidos.
* Recursos vinculados al montaje del resultado: retirada del observador/media listener, invalidación de generación pendiente y revocación de previews/descargas al reset/volver. No se cambian plataforma, dependencias, configuración ni workflows.

### Verificación local

`npm run verify` final, código 0, después del ajuste de CSS: tipos sin diagnósticos, lint, formato, hosting offline, **502 unitarias**, **19 componentes**, **120 E2E** e integración modular satisfactorios. Se mantienen las 2/4 pruebas sintéticas de integración y todos los escenarios de I1–I3. Node 24.22.2/npm 11.19.1/Chromium 156.0.8078.4 r1248, mismo entorno fijado. Revisión documental: 62 Markdown y 523 enlaces locales válidos. CI del head final y PR se enlazan en la entrega; no se atribuye validación física a esa batería.

Ocho escenarios E2E nuevos por perfil Chromium escritorio/móvil emulado, sin sustituir teléfonos: descarga real `.ics` y PNG ES/EN offline; inicio 2026-11-18 desde reloj 2026-11-17, hora/duración/COUNT y UID nuevo; dimensiones PNG leídas del archivo. Continúa el ejemplo y vuelve a generar imagen tras desconectar, sin recargar. Comprueba Google offline y conservación del plan.

Consentimiento con Cancelar/Escape y foco, sin apertura previa; confirmación inspecciona el URL codificado, opener anulado y enlace sin referrer, bloqueando la navegación real. Compartir inspecciona payload limpio y activación al entregar el archivo ya preparado; fallos/cancelación/Clipboard denegado no producen éxito falso. PNG imposible de codificar puede reintentarse. Diez ciclos reales de generación/descarga/reset por perfil dejan **cero URLs Blob pendientes** tras cada reset. No es una medición total de heap ni una prueba de los destinos externos del menú nativo.

Textos máximos de 90+90 puntos de código, palabras sin espacios, CJK, tildes, combinaciones y emojis compuestos: unitarias conservan texto/grafemas; E2E registra llamadas reales de canvas, fuentes ≥47,16 px, ancho ≤943,2 px y posiciones dentro de la zona. Los colores corresponden al tema resuelto. axe del consentimiento claro/oscuro sin infracciones detectadas. Inspección asistida de PNG y diálogo con datos sintéticos; no es revisión visual humana ni aceptación de recortes bajo relojes reales. Reflujo de resultado a 320 px comprobado en ambos temas.

Hallazgos corregidos durante desarrollo: cancelación `AbortError` de otro contexto no reconocida mediante `instanceof Error` (ahora se comprueba el nombre sin depender del contexto); ajuste del centrado del diálogo tras inspección; entorno JSDOM sin matchMedia modelado en pruebas, sin omitir escenarios. No se alteran controles globales de consola/red ni aserciones anteriores para obtener verde.

### Regresión de plataforma y recursos

Build público **idéntico byte a byte a I3**, 19 archivos. Portadas ES/EN y 404, ambos temas, mismas cuatro peticiones y bytes/gzip de la tabla I3, cero externas y ningún chunk de UI en portada. El registro real sigue vacío; previews y archivos de diagnóstico no forman parte del entregable.

Inventario provisional de copia aislada: chunk propio `App` 39284 bytes sin comprimir; runtime separado `client` 212836 + `react` 7909 bytes. CSS fuente del módulo final 3015 bytes; estas cifras separan costes y no sustituyen el presupuesto final de JS/CSS entregado ni la medición total de I5/I6. No hay nuevas dependencias. El CSS fuente ya incluye el ajuste final del diálogo; el presupuesto entregado se vuelve a medir sobre el candidato de integración, sin ocultar runtime o CSS común bajo el presupuesto propio.

### Criterios y pendientes para cerrar

| Criterio | Evidencia local | Pendiente material |
| --- | --- | --- |
| PB-I4-01 | PNG íntegro/dimensiones/límites, fallback y error recuperable comprobados. | Guardado y fondo colocado bajo el reloj en ambos teléfonos; recorte real. |
| PB-I4-02 | `.ics` descargado y modelo/recurrencia/UID comprobados; consentimiento Google inspeccionado sin envío. | Incorporación real desde los botones en ambos móviles, serie/hora/descripción, zona y apps/versiones. |
| PB-I4-03 | Consentimiento, enlace limpio, cancelación y fallos de compartir/Clipboard comprobados. | Repetición de vías admitidas en dispositivos reales; no se afirma éxito externo. |
| PB-I4-04 | Recorrido, ejemplo y generación offline comprobados tras carga completa. | Modo avión y guardado/importación admitidos en ambos teléfonos, distinguiendo conexión de Google. |
| PB-I4-05 | Regresión I1–I3/plataforma y diez ciclos sin URLs pendientes. | Repetición física de las operaciones que dependan de SO/navegador. |

| Dispositivo requerido | SO/navegador/app/zona | Candidato HTTPS SHA/árbol | Importación/PNG/modo avión |
| --- | --- | --- | --- |
| iPhone / Safari | Pendiente; no disponible | Pendiente de capacidad autorizada | No ejecutado |
| Android / Chrome | Pendiente; no disponible | Pendiente de capacidad autorizada | No ejecutado |

Para la sesión manual: identificar dispositivo/versiones/zona y candidato; abrir por HTTPS; descargar/importar desde el botón real y revisar primera/última aparición y duración; guardar PNG y colocarlo bajo el reloj; cancelar y repetir; desconectar tras carga completa y repetir las acciones locales, sin presentar Google como offline. Registrar una vía real válida por móvil y sus límites. Si solo funciona Google, documentar la conexión obligatoria y ajustar el mensaje según evidencia. Si no funciona ninguna vía, corregir o revisar alcance antes del cierre.

**Entrega parcial de I4:** mismo nombre de rama, commit `feat(PB-01/I4): ...`, push y PR en borrador con evidencia local y bloqueos explícitos. Mantener PB-01 En curso e I4 sin marcar completada; merge humano no sustituye matriz física ni autoriza I5. HTTPS/dispositivos son condiciones del [plan](../../exec-plans/active/PB-01-plan-b.md#iteración-4--imagen-y-exportaciones), no una exigencia nueva de esta implementación.

## I5 — Identidad e integración

### Alcance solicitado y base

El 2026-11-17 el propietario confirma el merge de PR #23 y solicita «Comienza la siguiente iteración». Rama estable `feature/pb01-plan-b`, sincronizada por fast-forward desde staging `beed90cbb418e0c0f9525353c806ca9582ee7226`, árbol `abcd0f0041665e708470f1a4cb2e784869b9ba3d`. Ese merge conserva el contenido comprobado de I4.

La indicación permite preparar localmente el acabado y revisar el candidato aislado de I5, adelantando esa parte independiente respecto al orden inicialmente previsto. **No acredita ni cierra I4:** siguen pendientes teléfonos/HTTPS, importación y fondo/modo avión físicos. I5 tampoco queda completada o aceptada por esta preparación. La incorporación real se mantuvo pendiente hasta presentar la propuesta concreta de PR #24. El propietario responde «Autorizar el registro en la rama candidata»: queda expresamente autorizada la tarea 4 y se aplica el registro/fecha/rutas con pruebas del build real. Merge humano, criterios físicos y revisión visual/manual conservados; I6 sin comenzar.

### Implementación y revisión

`App.tsx` deriva el acabado del paso y la validez de las dos frases, sin persistir otro dato: gris completo en obstáculo/plan sin frases válidas; medio con una; color con ambas y resultado. CSS de 600 ms limitado a `.pb-app`; cabecera, pie y movimiento global conservan sus reglas. Selecciones con trazo interior visible también en gris, sin depender exclusivamente de color.

Sello de resultado con borde/tipografía/tokens existentes, giro −6° y entrada de escala 1,4 → 1 durante 300 ms. Tiene espacio propio y anchura acotada, sin superponer la frase ni desbordar a 320 px. Reduced-motion elimina giro/escala y transición de gris. No se añade coordinador, librería, preferencia, backend o estilo global.

Textos, nombres ES/EN y exportaciones mantienen el contrato. Tras el permiso expreso se incorpora el descriptor published, fecha prevista de primera incorporación 2026-11-17 y loader perezoso al registro real. El build de la candidata genera catálogo y rutas ES/EN. La incorporación de rama no se presenta como versión ya servida en staging; no se ha realizado merge/despliegue por el agente.

### Verificación

Primera pasada de preparación aislada: `npm run verify`, código 0, **502 unitarias**, **19 componentes**, **136 E2E** e integración. Tras la incorporación autorizada, pasada completa final con **503 unitarias**, **19 componentes**, **140 E2E** e integración, código 0: tipos sin diagnósticos, lint, formato y hosting offline satisfactorios. Se conservan las 2/4 pruebas de fixtures de integración, sin omisiones. Node 24.22.2/npm 11.19.1/Chromium 156.0.8078.4 r1248. Revisión documental: 62 Markdown y 528 enlaces locales válidos. CI del head final y PR se enlazan en la entrega.

E2E nuevos: cuatro combinaciones ES/EN × claro/oscuro verifican gris 100/50/0 %, contraste ≥4,5 por cálculo que incorpora la matriz de gris y axe en cada estado; selector, foco y marco de selección. Sello: se pausa su animación CSS y se inspeccionan matrices a 0/300 ms (escala 1,4/1; ángulo −6°), límites del viewport y separación de la frase. Reduced-motion sin filtro animado ni transformaciones del sello. Un selector inicial de cabecera ambiguo entre cabecera de plataforma y encabezado de miniapp se acotó sin modificar aserciones de plataforma.

Reflujo de los cinco estados a 320/393/768/1280/1440 px, ambos idiomas/temas; controles de al menos 48×48 px. CSS zoom ×2 suplementario, identificado como tal: **no es zoom nativo de navegador**. La comprobación posterior sobre el registro real usa la API de extensión de Chromium para zoom nativo 200 %, descrita más abajo. Catálogo poblado ES/EN de prueba: tarjeta/enlaces reales, título, h1 único y cambio de idioma equivalente con ejemplo literal conservado. Cero islas o solicitudes JS de Plan B/React por mostrar la tarjeta. El catálogo vacío real y los tests anteriores siguen comprobándose, sin omitir ni debilitar sus aserciones.

El entorno solo dispone de Chromium r1248. No se atribuye a Playwright Chromium una revisión de Safari o Firefox real ni se instalan/declaran sustitutos como dispositivos físicos.

### Capturas para aprobación visual

Tres capturas mínimas, cada una menor de 300 KB, con datos sintéticos, viewport 393×851 y movimiento reducido:

* [ES/claro, gris completo](../../review/pb01-i5/es-light-gray.png).
* [ES/claro, gris parcial](../../review/pb01-i5/es-light-half.png).
* [EN/oscuro, resultado y exportaciones](../../review/pb01-i5/en-dark-result.png).

[Manifiesto](../../review/pb01-i5/manifest.json): versiones, base, autorización y hashes del código/capturas del build real registrado. Las tres capturas se regeneran tras la autorización; no se presentan las de la copia de preparación como build definitivo. En movimiento reducido el sello se presenta sin giro; la animación normal se contrasta numéricamente en E2E. Inspección asistida realizada; revisión/aceptación visual del propietario pendiente. No son evidencia de teléfonos, reloj/recorte o compatibilidad externa.

### Bytes, recursos y medición local

Antes de incorporar el registro, el build público de preparación conservó los 19 archivos de I4 idénticos. La siguiente tabla corresponde a la **copia aislada poblada inicial**, no al registro final o staging; la comparación definitiva del build real se detalla después de ella.

Presupuesto propio conservador en esa copia: chunk App **39447 B** + bloque CSS inline que contiene el módulo **3343 B** = **42790 B / 41,79 KiB**, inferior a 50 KiB. Se cuenta completo ese bloque inline, aunque también agrupe reglas de plataforma. Runtime adicional separado: `client` 212836 B + `react` 7909 B = **220745 B**; CSS compartido solicitado **34204 B**. No se ocultan esos costes al informar el total. La integración real debe volver a medir su build, no asumir que la copia tenga idéntico CSS común generado por Tailwind.

Cinco pasadas con contextos fríos por ruta/perfil, mismo Node/Chromium, fuentes listas y reduced-motion; laboratorio local sin limitación artificial de red/CPU. Gzip es suma de gzip de cuerpos, no Content-Encoding observado. Todas las filas: cero solicitudes externas.

| Perfil / ruta de copia | Peticiones | Bytes / suma gzip | LCP mediana (rango), ms | CLS mediana | Clic → dos frames mediana (rango), ms |
| --- | --- | --- | --- | --- | --- |
| 393 / portada ES poblada | 4 | 198838 / 152462 | 196 (136–300) | 0 | — |
| 393 / Plan B | 7 | 471409 / 239757 | 136 (104–164) | 0,03 | 21,7 (7,8–34,7) |
| 1440 / portada ES poblada | 4 | 198838 / 152462 | 204 (188–252) | 0 | — |
| 1440 / Plan B | 7 | 471409 / 239757 | 184 (152–464) | 0,01 | 34,5 (14,9–51,4) |

El clic se mide desde su evento hasta dos requestAnimationFrame; **no se presenta como INP**. No son datos de campo, p75, caché caliente o certificación de rendimiento final. Se observa el desplazamiento inicial de hidratación, no una ausencia total de CLS. I6 conserva comparación final, caché caliente/fría y análisis global. Las regresiones de exportación/reset/recursos de I4 se vuelven a ejecutar sobre este CSS.

### Incorporación autorizada y candidata real

Permiso expreso del propietario: «Autorizar el registro en la rama candidata», tras presentar PR #24, las capturas y la propuesta. Se conserva id/slug `plan-b`, categoría `everyday`, copias ES/EN actuales; descriptor `status: 'published'`, `publishedAt: '2026-11-17'` y loader perezoso en el registro. Es fecha prevista de primera incorporación; si cambia el día de publicación, contrastar la fecha real antes de integrar. No equivale a despliegue realizado ni aceptación del producto.

El unitario conserva la proyección vacía y añade registro real con ambas rutas; el catálogo de navegador deriva las tarjetas del registro y mantiene las garantías de navegación, idioma, foco y metadatos. La copia draft conserva cero tarjetas/enlaces, mensaje vacío y 404 real. Sus cuatro iniciales M se contrastan con la geometría aprobada. La portada poblada tiene tres M (cabecera, pie y hero): la regresión detectó el antiguo conteo de cuatro, ligado a la tarjeta vacía, y se adaptó sin quitar la comparación de piezas. El selector del script auxiliar de capturas de apariencia admite panel vacío o tarjeta real.

Se añade recorrido crítico compartido del candidato real ES/EN: ruta directa, h1, ejemplo, resultado, PNG, reload y reset limitado a clave propia/respeto de apariencia. La suite remota reutiliza el mismo recorrido **después de comprobar identidad exacta**. Tipos/lint comprueban ese código, pero no se ejecuta test:remote contra una candidata no desplegada ni se inventa una identidad/URL para hacerlo pasar. El flujo existente lo ejecutará tras el merge autorizado sobre el artefacto publicado.

**Verificación final:** `npm run verify`, código 0, 503 unitarias / 19 componentes / 140 E2E e integración; conserva 2/4 pruebas propias de fixtures y cero omisiones. Artefacto estático final de **23 archivos**, sin fixtures: frente a I4 añade dos HTML de Plan B y tres chunks JS, sustituye el antiguo renderer no solicitado `client.FVv06Hs5.js` y cambia las dos portadas. Los otros 16 archivos, incluidos raíz, 404, CSS común y fuentes, conservan sus hashes.

El bundle propio sigue en **42790 B / 41,79 KiB**: App 39447 B y bloque inline 3343 B. El CSS común **34923 B** es idéntico al real de I4; runtime separado **220745 B**. Astro también incluye el bloque inline de 3343 B del módulo en las portadas al incorporar el registro. Se informa ese coste: los selectores están limitados a Plan B y no modifican sus elementos de plataforma, pero el HTML de portada sí transporta esos estilos. No se cambia el pipeline global para ocultar los bytes. Ninguna portada solicita JS de Plan B/React ni monta islas.

| Ruta real | Peticiones | Bytes I4 → candidata | Gzip estimado I4 → candidata | Externas |
| --- | --- | --- | --- | --- |
| ES portada | 4 → 4 | 196559 → 199557 | 151506 → 152594 | 0 |
| EN portada | 4 → 4 | 196472 → 199472 | 151444 → 152525 | 0 |
| 404 | 4 → 4 | 193888 → 193888 | 151012 → 151012 | 0 |

Incremento esperado de portada: tarjeta en lugar del mensaje vacío y estilos inline del módulo, **+2998/+3000 B** brutos. Sin aumento de peticiones o JS. Medición final del build real, cinco contextos fríos por ruta/perfil, mismo procedimiento y límites de laboratorio de la tabla inicial:

| Perfil / ruta real | Peticiones | Bytes / suma gzip | LCP mediana (rango), ms | CLS | Clic → dos frames mediana (rango), ms |
| --- | --- | --- | --- | --- | --- |
| 393 / ES portada | 4 | 199557 / 152594 | 352 (136–464) | 0 | — |
| 393 / Plan B | 7 | 472129 / 239889 | 204 (148–272) | 0,03 | 26,2 (18,2–30,5) |
| 1440 / ES portada | 4 | 199557 / 152594 | 196 (148–320) | 0 | — |
| 1440 / Plan B | 7 | 472129 / 239889 | 196 (164–220) | 0,01 | 20,6 (18,7–62,2) |

Los recursos totales incluyen HTML, runtime, CSS y fuentes; no se presenta el presupuesto propio como peso total. Tiempos variables de laboratorio, sin inferir regresión de CPU/INP de una diferencia aislada entre contextos/cargas. No se reemplaza la comparación final de I6 o los datos de campo.

**Zoom nativo complementario:** mismo mecanismo de `tests/visual/zoom.ts`, Chromium completo r1248 con extensión/perfil desechables fuera del producto; `chrome.tabs.setZoom(2)` y `getZoom` confirman factor 2, viewport pasa 1280 → 640 CSS px y devicePixelRatio se duplica. Se comprueban 20 estados (cinco pantallas × ES/EN × claro/oscuro), sin scroll horizontal, contenedor dentro del viewport y navegación por teclado. No usa CSS zoom, emulación de escala o una extensión entregada a usuarios. Resultado local satisfactorio; revisión visual humana y Safari/Firefox reales siguen pendientes.

### Criterios y siguiente paso

| Criterio | Preparado/comprobado localmente | Pendiente para cerrar I5 |
| --- | --- | --- |
| PB-I5-01 | Gris/sello, contraste, foco, reflujo, reduced-motion, zoom nativo y capturas reales. | Revisión visual humana y matriz real Safari/Firefox/dispositivos. |
| PB-I5-02 | Catálogo real registrado y caso vacío/draft en copia, sin retirar sus garantías. | Verificación de versión servida se conserva para el flujo remoto/I6. |
| PB-I5-03 | Permiso expreso, fecha/registro reales y verify del candidato comprobados. | Merge humano, despliegue/identidad remotos y aceptación sin atribuirlos a esta preparación. |
| PB-I5-04 | Presupuesto real ≤50 KiB; runtime/totales y coste CSS en portada informados, tarjeta sin JS de miniapp. | Revalidar sobre el candidato definitivo de I6, incluidas cachés y recursos. |
| PB-I5-05 | Regresión del código local y pendientes explícitos. | Criterios físicos de I4, incorporación y demás revisiones obligatorias; I6 sigue al final. |

Entrega de preparación por commit `feat(PB-01/I5): ...`, push y PR en borrador desde la misma rama. PB-01 En curso e I4/I5 sin marcar completadas. La incorporación cuenta ya con permiso expreso y pruebas reales. Se entrega otro commit PB-01/I5 en la misma PR; no se crea infraestructura ni se cambia el contrato de aceptación por ausencia de dispositivos.

## I6 — Regresión y análisis global

### Autorización, revisiones y alcance

El 2026-11-17 el propietario confirma la integración de PR #24 y solicita «listo la ultima iteración, continua». Se realiza I6 técnica en la misma rama feature/pb01-plan-b, con correcciones locales cubiertas por el contrato, commit/push/PR y merge humano. La indicación permite esta revisión aunque I4/I5 conserven evidencia física/manual pendiente; no la da por ejecutada ni acepta el producto. PB-01 continúa En curso.

| Referencia | Identidad y uso |
| --- | --- |
| Base real anterior a Plan B | SHA d3d8386e6077911d84ee85bcc16981177f3d3b1d; árbol 5136a7fa29ebbcaab95f8a53df08b8038483965e. Los 19 archivos reconstruidos coinciden por hash con el manifiesto conservado de I1; no se usa la base de planificación como sustituto. |
| Staging integrado / entrada I6 | SHA 3d28184f3c90db44fe57a7592e23a5e71c071f23; árbol b87a726f794591a0a28ac606bf0d8bd453cd5332, PR #24 integrada. La rama estable se sincroniza desde esa revisión, sin reescribir historia. |
| Candidato corregido | Base integrada anterior más dos correcciones locales, una prueba unitaria y tres casos E2E ejecutados en ambos proyectos. El commit PB-01/I6 y el head de su PR identifican el entregable; no se atribuyen esas correcciones al staging de entrada. |
| Entorno de verificación local | Node 24.22.2, npm 11.19.1, Chromium 156.0.8078.4 / r1248, Playwright 1.64.1, misma máquina y configuración en base/candidato. |

Se revisa el diff completo desde la base I1: dominio, traducciones, UI, sesión, calendario, canvas, navegador, metadatos, estilos y pruebas de Plan B; registro explícito de I5; adaptaciones de pruebas de catálogo vacío/poblado, integración/fixtures y recorrido remoto; documentación e historial de autorizaciones H-007. El único cambio común de aplicación sigue siendo el registro aprobado. Rutas/layouts/estilos globales, package/lockfile, workflows, credenciales y publicación no cambian en I6. No se añaden funciones, servicios o dependencias. Se conservan casos vacíos/draft, aislamiento y guards remotos.

### Hallazgos, correcciones y revalidación

| ID / criterio | Evidencia e impacto / origen | Acción y comprobación / residuo |
| --- | --- | --- |
| I6-F01 / PB-AC-02 | El editor nativo de hora con teclado permite una hora parcial visible con value vacío y validity.badInput=true. El formulario noValidate la interpretaba como hora opcional omitida y avanzaba al resultado sin calendario. Introducido en I3; defecto funcional material del contrato. Reproducido antes de corregir. | App.tsx consulta badInput al enviar y muestra el error localizado, conserva la pantalla y enfoca la hora. Nuevo E2E usa el editor nativo real, escribe una parte, comprueba el estado inválido y luego completa 21:30 y avanza. Perfil explícito Desktop Chrome dentro de ambos proyectos: el picker táctil no expone esa edición parcial. Sin mock de badInput ni skips. Corrección local comprobada; pendiente servirla y validarla tras merge. |
| I6-F02 / PB-AC-03 | Una sesión comenzada el 31 de enero mantiene correctamente febrero como mes narrativo; tras pasar a 1 de febrero y reset, la portada seguía anunciando febrero en lugar de marzo. El previewDate no se recapturaba. Introducido en I3; resultado de fecha incorrecto en portada. Reproducido con reloj controlado. | controller.reset recaptura solo la fecha de portada después de borrar su clave, sin volver a guardar ni alterar la narrativa activa. Una unitaria y E2E ES/EN comprueban sello febrero antes de reset y portada marzo después. El borrado fallido conserva su aviso. Corrección local comprobada; pendiente staging corregido. |
| I6-F03 / coherencia de documentación | SECURITY/QUALITY conservaban como estado vigente la ausencia de CI/staging y la fixture I-01 sin sesión/exportaciones. Inconsistencia previa, relacionada con PEND-010; no un permiso nuevo ni fallo del runtime. | Se distingue historia de estado actual y se describen los contratos ya aprobados ADR-MMA-020/021, I-03, auditoría actual y límites. No se cambian políticas, permisos ni se cierra PEND-010 globalmente. |
| I6-F04 / PB-AC-05/07/08/09/10/12 | Faltan dispositivos/importaciones/destinos/fondo/modo avión y revisiones humanas/motores reales. Pendiente esencial conocido desde I4/I5; no se resuelve con emulación o un merge. | La HTTPS de staging ya está disponible para la versión integrada I5, con identidad y pruebas remotas reales abajo. Quedan matriz física/humana y revalidar las correcciones tras merge; propietario y circuito existente completan esas evidencias. Impide cierre, no se rebaja a deuda admisible. |

La batería inicial anterior a estos hallazgos pasó 503/19/140: no se usa su recuento como prueba suficiente del contrato. Tras corregir, npm run verify termina con exit 0: check sin errores/advertencias/hints, lint, formato, build/hosting offline, **504 unitarias, 19 componentes, 146 E2E e integración modular (fixtures 2/4)**. Los seis E2E nuevos pasan sin omisiones. La suite de fechas/calendario/sesión/layout dirigida pasa además **160 casos en America/New_York y 160 en Pacific/Kiritimati**, conservando el reloj local y casos DST/medianoche.

Antes de desconectarse el entorno se comprobaron los 23 hashes del build final contra el runtime auditado: todos coinciden; no hubo cambios funcionales tras la batería completa y mediciones. El chequeo documental local anterior a esa desconexión validó 62 Markdown y 531 enlaces locales, y diff --check pasó. Los logs, JSON de medición y scripts auxiliares quedaron fuera del repo, con datos sintéticos; este informe conserva los resultados auditables sin presentar rutas locales como evidencia compartida.

### Identidad y prueba remota realmente observadas

Staging aprobado: https://miminiapp-staging.miminiapp-lab.workers.dev. GET /release-manifest.json devuelve schemaVersion 1, repository aalexlpez/miminiapp, repositoryId 1445849027, sourceSha **3d28184f3c90db44fe57a7592e23a5e71c071f23**, sourceTree **b87a726f794591a0a28ac606bf0d8bd453cd5332** y payloadSha256 **c4c0a15886c0855765d415f75e83522ba7986931bbb47f50b113cad063feca6d**.

[Staging run 44060190659](https://github.com/aalexlpez/miminiapp/actions/runs/44060190659) satisfactorio sobre ese SHA: [prepare 133959759963](https://github.com/aalexlpez/miminiapp/actions/runs/44060190659/job/133959759963) verifica y empaqueta el build probado; [remote-test 133961753400](https://github.com/aalexlpez/miminiapp/actions/runs/44060190659/job/133961753400) verifica artefacto/guards, publica staging y ejecuta identidad y recorrido remoto de plataforma/Plan B satisfactoriamente. La subida de evidencias de fallo se omite por no haber fallo; no es un test omitido.

Esta evidencia pertenece a **I5 integrada, antes de las dos correcciones I6**. No permite dar por probada remotamente la nueva revisión. Tras el merge manual de la PR I6, comprobar prepare/remote-test de su SHA, releer manifest y contrastar SHA/árbol/payload. Se conserva el circuito existente y sus variables de identidad/target, sin desactivar guards ni derivar expectativas confiables de una URL arbitraria.

### Bytes, cachés y rendimiento comparado

Base reconstruida: 19 archivos idénticos por hash al manifiesto I1. Candidato: 23 archivos, sin fixtures/borradores. Bundle propio **42903 B / 41,90 KiB**: App.DZmHqTrM.js **39560 B** y CSS inline **3343 B**, dentro de 50 KiB; +113 B JS respecto a I5. Runtime compartido client.Cd-EeyjT.js 212836 B y react.CvnImTBr.js 7909 B, total **220745 B**; CSS común global.BPX5XG5M.css **34923 B**. La portada no hidrata React ni solicita JS de Plan B; Astro sí incluye 3343 B de CSS del módulo en su HTML al registrar la herramienta. Ese coste se informa y no se cambia el pipeline global para esconderlo.

| Ruta | Peticiones frías base → candidato | Bytes brutos base → candidato | Suma gzip estimada base → candidato |
| --- | --- | --- | --- |
| Portada ES | 4 → 4 | 196432 → 199557 | 151480 → 152594 |
| Portada EN | 4 → 4 | 196345 → 199472 | 151419 → 152525 |
| 404 | 4 → 4 | 193761 → 193888 | 150986 → 151012 |
| Plan B ES, solo candidato | 7 | 472242 | 239920 |

Incrementos desde base: ES +3125 B, EN +3127 B (tarjeta y CSS inline), 404 +127 B (tokens aprobados/conservados de I3, ya explicados). Frente a I5 las portadas/404 no cambian. Cero recursos externos. El presupuesto propio no representa el total solicitado por la app.

Se realizan **140 observaciones**: cinco parejas fría/caliente por ruta y perfil, base/candidato intercalados; app solo candidato. Chromium fijado, perfiles 393×851 y 1440×1000, fuentes listas, reduced-motion, sin throttle artificial de CPU/red y después de finalizar la batería para reducir contención. En caliente se limpia únicamente la sesión propia para conservar la misma pantalla inicial, manteniendo la caché HTTP. Se excluyen cuerpos 304 del cómputo de payload; bytes brutos/gzip corresponden a respuestas frías. TransferSize describe transferencia observada con cabeceras/revalidaciones, no coste TCP o producción.

| Perfil / ruta | LCP frío base, mediana (rango) ms | LCP frío candidato | LCP caliente base | LCP caliente candidato |
| --- | --- | --- | --- | --- |
| 393 / ES | 64 (52–132) | 60 (44–68) | 32 (28–44) | 40 (32–52) |
| 393 / EN | 52 (52–60) | 56 (56–104) | 28 (24–36) | 32 (24–48) |
| 393 / 404 | 44 (40–52) | 44 (40–52) | 28 (24–32) | 36 (32–40) |
| 1440 / ES | 92 (64–104) | 56 (52–80) | 56 (32–68) | 48 (32–72) |
| 1440 / EN | 68 (56–68) | 60 (48–64) | 32 (28–56) | 28 (28–32) |
| 1440 / 404 | 60 (44–68) | 48 (40–56) | 28 (24–32) | 32 (24–48) |
| 393 / Plan B | — | 60 (48–60) | — | 36 (28–44) |
| 1440 / Plan B | — | 64 (56–72) | — | 32 (28–32) |

CLS portada/404 0; Plan B 0,03 en 393 y 0,01 en 1440. En Plan B, clic → dos frames: 393 frío 24,6 (17,6–26,1) ms, caliente 28,4 (27,2–29); 1440 frío 27 (13,2–28,8), caliente 29,9 (26,3–31,6). Es una observación sintética de respuesta/pintura, **no INP**. No se atribuye p75 de campo a cinco pasadas locales.

| Ruta candidata | TransferSize frío → caliente, B (ambos perfiles) |
| --- | --- |
| ES | 154034 → 1200 |
| EN | 153965 → 1200 |
| 404 | 152452 → 6248 |
| Plan B | 242260 → 2100 |

La navegación caliente revalida; no significa cero red o soporte de recarga offline. Las diferencias temporales pequeñas quedan dentro de la variabilidad observada. No se detecta degradación material reproducible en estas muestras; no se afirma ausencia absoluta de regresiones, métricas de teléfonos ni rendimientos de producción.

### Canvas, recursos y memoria

Una vuelta de calentamiento y **diez ciclos reales**: ejemplo → resultado → .ics/PNG descargados y completados → Atrás → resultado → reset. Inspección con instrumentación temporal fuera del producto; no se incorporan listeners de medición al runtime.

| Punto del ciclo | URLs Blob | Observadores de tema propios | Listeners media totales | document click | Canvas activo tras codificación |
| --- | --- | --- | --- | --- | --- |
| Resultado con exportaciones | 3 | 1 | 3 | 1 | 0 |
| Cada Atrás y cada reset | 0 | 0 | 2 de plataforma | 1 de selector de idioma | 0 |

El backstore se pone a cero tras toBlob; superficie RGBA teórica 1179×2556×4 = **12054096 B**, sin equipararla a memoria GPU medida. No quedan URLs/listeners propios entre ciclos. Los contadores de plataforma se mantienen constantes.

Heap JS tras calentamiento **2856992 → 3477688 B** tras diez ciclos y GC; embedder **1414456 → 1700648 B**; backingStorage **272998 → 273749 B**. La primera inspección retenía referencias de canvas/media para contar y elevaba embedder a 6635656 B; al liberar referencias exclusivas de la medición antes del GC final bajó a 1700648 B. Se distingue el sesgo de instrumentación del producto. No se deduce una fuga de una variación aislada del heap, ni se promete crecimiento cero o memoria GPU nula. Con los contadores y diez ciclos no se detecta retención material reproducible; las cifras conservan sus límites.

Coste real canvas desde getContext hasta callback toBlob con fuentes disponibles, cinco generaciones por caso, layout/dibujo/PNG incluidos:

| Caso sintético | Mediana (rango), ms |
| --- | --- |
| Ejemplo | 37,1 (22,8–54,9) |
| Dos palabras W de 90 caracteres | 75,1 (72,6–85) |
| CJK | 37,4 (31,9–154,8) |
| Emoji compuesto | 39,2 (21,5–55,2) |

El rango incluye primer uso de glifos/fallback; no se presenta como INP ni garantía física en móviles. Las pruebas verifican contenido, dimensiones, límites, ajuste por grafema, temas, fallo y liberación; legibilidad bajo reloj/recorte exige el fondo real guardado.

### Dependencias y deuda

Package.json y package-lock.json son idénticos a la base anterior al producto. npm audit de candidato y base, ejecutados el mismo día contra el mismo registro, dan **14 moderadas de desarrollo, 0 altas y 0 críticas**; omit=dev da **0 vulnerabilidades**. El recuento histórico de 11 en I-01 no es el actual ni convierte avisos posteriores en dependencias introducidas por Plan B.

Minimatch GHSA-g3hv-75wg-m249 afecta patrones de herramientas de lint; no recibe texto de usuario de Plan B. Astro GHSA-r3h5-4585-7x3w afecta el endpoint de imágenes de @astrojs/node; el adaptador no está instalado/desplegado y Workers sirve assets estáticos. No se cambian versiones ni se ejecuta audit fix. PEND-007 sigue abierto con impacto y seguimiento; no se eliminan PEND-001/002/004/009/010 ni se dan por resueltos por este análisis. Los dos defectos nuevos del producto se corrigen y no se trasladan a deuda.

### Matriz final PB-AC-01–12

Los estados describen evidencia observada; un éxito automatizado con operación esencial física pendiente no equivale a criterio completo. No hay tests omitidos para obtener verde; lo no ejecutado se identifica expresamente.

| Criterio | Resultado observado | Límite / condición de cierre |
| --- | --- | --- |
| PB-AC-01 | Pasado local: rutas/metadatos/catálogo ES/EN, slug, casos vacío/draft/publicado e integración modular. Recorrido remoto I5 pasado con identidad. | Revalidar el candidato corregido servido tras merge; no atribuirle el run de I5. |
| PB-AC-02 | Pasado local: recorrido/validación/sugerencias/Atrás/ejemplo/reset ES/EN; hora parcial corregida con teclado nativo y regresión. | Corrección todavía por servir; no se inventa revisión manual de navegadores faltantes. |
| PB-AC-03 | Pasado local: mes natural, bisiesto/año, narrativa estable y cambio de mes tras reset corregido, reloj controlado ES/EN. | Corrección todavía por validar en staging. |
| PB-AC-04 | Pasado local: esquema/versión, restauración, idioma, storage corrupto/bloqueado/fallo de borrado y aislamiento de apariencia. | No prometer borrado irreversible al cerrar pestaña; depende del navegador. |
| PB-AC-05 | Parcial: expectativas independientes para inicio mañana, 15 min, cuatro apariciones por día; 1/5/7 días, medianoche y DST, dos zonas adicionales. | No ejecutada importación real en cada vía conservada y ambos móviles. |
| PB-AC-06 | Pasado automatizado: UTF-8, escapes/plegado/emoji/inyección, URL Google segura, consentimiento/Cancelar/fallos y red interceptada. | No se llama a Google automáticamente; importación real pendiente en PB-AC-05/12. |
| PB-AC-07 | Parcial: PNG 1179×2556, texto íntegro, máximos/palabras largas/grafemas/tema/fallo y descarga comprobados localmente. | No ejecutados guardado/colocación real y legibilidad bajo reloj/recorte en ambos teléfonos. |
| PB-AC-08 | Parcial: enlace limpio, texto centinela preservado, recuperación clipboard/compartir y APIs controladas comprobados. | No ejecutada comprobación física de destinos nativos. |
| PB-AC-09 | Parcial: con página completamente cargada y abierta, ejemplo + .ics/PNG pasan en E2E desconectado. | No ejecutado modo avión físico en iPhone/Android; sin promesa de reload offline. |
| PB-AC-10 | Parcial: axe, contraste, teclado/foco/errores/dialogs, reflujo, temas y reduced-motion en batería local; zoom nativo I5 documentado sin cambio CSS posterior. | Revisión visual humana y Safari/Firefox reales pendientes. |
| PB-AC-11 | Pasado técnico local: bytes propios/totales, red consentida, storage y recursos auditados; límites de caché/memoria/performance explícitos. | Revalidar contenido servido corregido y conservar las limitaciones físicas; no afirmar datos de campo. |
| PB-AC-12 | Parcial: verify local final satisfactorio; run/prepare/remote-test e identidad reales de I5 confirmados. | CI del nuevo head y staging corregido por validar; matriz manual completa no ejecutada. |

### Criterios internos I6 y conclusión

| Criterio | Evaluación técnica / condición pendiente |
| --- | --- |
| PB-I6-01 | Doce PB-AC contrastados arriba; no cerrado: faltan comprobaciones esenciales físicas/manuales y revisión servida corregida. |
| PB-I6-02 | Referencia y candidato reproducibles, contratos de plataforma contrastados, bytes intencionales explicados; no se extrapola a motores ausentes. |
| PB-I6-03 | Dos defectos materiales encontrados y corregidos/reprobados localmente; sin transmisión no consentida o degradación material reproducible detectada. Compatibilidad física esencial sigue sin comprobar. |
| PB-I6-04 | Presupuesto/totales/cachés/canvas/recursos y auditoría comparados; deuda previa diferenciada, sin autoaceptar residuos. |
| PB-I6-05 | Verify final pasado y staging I5 acreditado; no cerrado hasta CI del head corregido, merge humano, nueva identidad/pruebas remotas y matriz física. |
| PB-I6-06 | Informe y fuentes vivas actualizados; ninguna función nueva después de la revisión. La entrega alternativa descrita abajo requiere validar su commit exacto mediante CI. |

**Resultado:** revisión técnica y dos correcciones listas para entrega; **no procede declarar PB-01 Verificado/Aceptado ni completar I4/I5/I6**. Quedan operaciones físicas/humanas esenciales y validación remota del runtime corregido después de su merge manual. I6 sigue siendo la última etapa; cualquier cambio funcional posterior requiere revalidar lo afectado y el conjunto cuando corresponda. No se crean planes adicionales ni se rebajan los criterios por falta de dispositivos.

### Entrega y continuidad ante desconexión

El entorno de ejecución se desconectó después de terminar la batería, mediciones, reporte local y comprobación de los 23 hashes, antes de poder ejecutar commit/push. GitHub conservaba todavía feature/pb01-plan-b en 61705e20532160519291e7519c3a72be05470097, cuyo árbol coincide con el staging integrado de entrada. No se presenta ese intento fallido como push.

Para conservar el trabajo revisable se prepara la entrega mediante el conector GitHub: mismo código de las dos correcciones y pruebas, documentación reconstruida desde la base integrada con los resultados anteriores. El nuevo commit tiene como padre el staging integrado 3d28184f3c90db44fe57a7592e23a5e71c071f23 y se actualiza la rama estable por fast-forward, con expected SHA y sin force. La PR identifica el commit resultante; su CI comprobará el contenido exacto entregado. La validación documental local citada arriba corresponde a los archivos previos a la desconexión; los enlaces de esta reconstrucción se revisan de nuevo antes de entregar: 62 Markdown y 537 enlaces locales válidos, contrastados contra el árbol y los anchors de los documentos. El workspace desconectado conserva cambios locales que deberán reconciliarse mediante diff al recuperarlo; no usar reset/clean ni descartar trabajo a ciegas.

Primer CI de la entrega reconstruida, run 44072446553 / head a32d02bd9ec816818cb9800fac61fafc2d716eb8: tipos y lint satisfactorios; format:check detectó una cadena de reset sin el salto de línea de Prettier en regression.spec.ts. Se corrige únicamente el formato, sin alterar los casos o runtime; el siguiente commit PB-01/I6 también alinea el resumen actual de autorización/HTTPS. El primer run no llegó a las pruebas funcionales y no se presenta como CI completo satisfactorio.
