# PB-01 — Ejecución de Plan B

**Actualizado:** 2026-11-16. **Responsable:** propietario de MiMiniApp. **Plan canónico:** [PB-01](../../exec-plans/active/PB-01-plan-b.md). Un solo informe para I1–I6; las secciones futuras se completarán con evidencia real.

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

## I3–I6

Sin comenzar. La autorización actual se limita a I2, además de I1 ya completada. I3 necesita ADR-MMA-020 aprobada y su autorización; I4–I6 conservan sus recursos y revisiones expresas. I6 permanece como cierre global de todo el producto.
