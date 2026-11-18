# FE-02 — Plan B: selección rápida, identidad y catálogo compacto

## Control

* **Estado:** `En curso`.
* **Responsable de aprobación, autorización y aceptación:** propietario de MiMiniApp (Alexander / Ale).
* **Creado / actualizado:** 2026-11-18.
* **Rama estable:** feature/fe01-frontend-quality, reutilizada por instrucción expresa del propietario; excepción acotada a H-007, sin trabajo concurrente de FE-01.
* **Base:** staging 7cf32ca9cd2b9085600fac202f4455027c11becc, merge de PR #28. Rama sincronizada mediante fast-forward. FE-01 conserva historia y aceptación propia pendiente; FE-02 mejora el contenido integrado, no depende de aceptar FE-01 ni lo declara aceptado.
* **Autorización:** «De resto me suena bien lo que planteaste» y «Vamos a generar un nuevo plan en la misma rama, hacemos las iteraciones y luego subimos la PR», incorporando selección simple/personalizada en Si/entonces y logo/identidad en el PNG. Aprueba este alcance y autoriza ejecución local secuencial y entrega conjunta final. No informes al usuario por iteración ni nuevas demos; una sola imagen de ejemplo real. Merge manual y revisión visual en staging.
* **Iteración actual:** I6 — regresión local completada; entrega por PR, CI del head y staging pendientes.

## Objetivo y contrato aprobado

Reducir escritura y ambigüedad manteniendo cuatro preguntas. Propósito libre con ideas; obstáculo seleccionable con continuar explícito; situación y acción con selección simple de sugerencias y opción de escribir una personalizada. Valores reales, literales y editables, sin inferencia semántica sobre propósitos libres. Restauración v1, fechas, validación y salidas conservadas.

Pregunta, campo/opciones y acción principal tienen prioridad. Una sola indicación de progreso. «Si»/«entonces» se muestran como conectores, fuera del valor editable; una duplicación se explica y solo se corrige mediante acción explícita. Ideas y campo Otro se revelan con movimiento breve/reducible sin enfocar automáticamente y provocar saltos. Pregunta/etiqueta accesible y ejemplos concretos, sin explicaciones repetidas.

Privacidad general en pie de la herramienta, fuera del workspace, sin overlay fijo. Avisos operativos y consentimiento se conservan donde corresponden. Resultado con dos acciones visibles: descargar imagen y añadir recordatorio. Este último abre editor inline con hora nativa, presets todos/laborables y selección de días. Exportar confirma atómicamente el borrador válido y descarga .ics o pide consentimiento Google, sin un paso obligatorio intermedio de preparar. Guardado de imagen conserva alternativas compatibles y cancelación; editar y compartir herramienta son secundarios.

Logo vectorial propio de Plan B, con un trazo B y continuidad; usar en UI y PNG junto a la firma MiMiniApp. Identidad/tokens/fuentes existentes, sin sustituir la marca matriz. PNG 1179×2556, texto íntegro en zona segura, marca separada de la frase. Enmienda aprobada ADR-MMA-024 y ficha v08; reemplazan las cláusulas v07 de texto libre inicial, calendario oculto y PNG sin marca. La ampliación I5/ADR-MMA-025 sustituye el símbolo vectorial inicial por el recurso original suministrado por el propietario, conservando su identidad en catálogo, cabecera y UI/PNG.

## Exclusiones

Sin backend, IA generativa en producto, analítica, dependencias nuevas, cambio de persistencia/formatos de calendario/infraestructura/workflows o promoción a producción. Sin más prototipos o matrices de capturas versionadas. Las operaciones físicas pendientes de PB-01 no se declaran ejecutadas. La aprobación del propietario basta para aceptación humana.

## Iteraciones secuenciales

| Iteración | Trabajo y archivos | Comprobación / salida |
| --- | --- | --- |
| I1 — contrato y base | Registrar aprobación, ficha/ADR, rama y referencia del runtime integrado; leer Impeccable Operate/clarify y Vercel adaptados. | Base identificada, límites y criterios completos antes de editar runtime. |
| I2 — wizard | App, componente de selección simple, diccionarios ES/EN y CSS. Ideas de propósito, opciones/personalizada, Otro suave, continuar coherente, jerarquía y pie. | Pruebas dirigidas de selección/personalizada, conservar textos/estado, teclado y reflujo; commit FE-02/I2. |
| I3 — resultado e identidad | ScheduleEditor, ExportPanel, logo compartido UI/canvas, renderer y traducciones. Acciones visibles, presets, exportación directa del horario validado y PNG con marcas. | Exportaciones/errores/consentimiento/offline, branding, texto máximo y recursos probados; commit FE-02/I3. |
| I4 — regresión y análisis final | Revisar diff contra base, repetir verify, medir bytes/PNG/limpieza y deuda; una sola imagen real. Actualizar este plan con resumen final y entregar PR conjunta. | Tests/estáticos/build y evidencia final identificados, límites y deuda declarados; CI del head y staging tras merge humano. Sin cambios funcionales posteriores sin revalidación. |
| I5 — catálogo e icono suministrado | Ampliación expresa del propietario: sustituir tarjetas por icono/nombre, utilidad breve al hover/foco y acceso táctil. Metadato de recurso estático local. Incorporar la imagen original de Plan B cuando su archivo esté accesible, sin usar la propuesta C rechazada o recrear el gráfico. | Catálogo ES/EN compacto, navegación directa, popover descartable con Escape y hover persistente; original de marca integrado. |
| I6 — regresión de la ampliación | Revisar cambios compartidos, rutas/catálogo/aislamiento, accesibilidad, reflujo y marca en ambos temas. Actualizar este resumen único y entregar por PR tras completar el recurso. | Comprobaciones dirigidas durante preparación; verificación final al completar I5. Sin nuevas demos ni publicación incompleta. |

## Criterios de aceptación

* FE2-AC01: cuatro preguntas ES/EN con elección simple en situación/acción, personalizada, ejemplos comprensibles y Atrás/restauración sin perder texto.
* FE2-AC02: selección por teclado, foco visible, errores asociados, sin autoFocus/scroll por Otro; reflujo 320/393 y escritorio, movimiento reducido.
* FE2-AC03: pie de privacidad fuera del workspace; avisos de fallos/consentimiento siguen accesibles.
* FE2-AC04: imagen y recordatorio visibles; hora/días cómodos, exportación directa con validación, consentimiento y borrador persistido solo al confirmar.
* FE2-AC05: logo Plan B consistente UI/PNG y firma MiMiniApp; PNG íntegro y legible con texto máximo/Unicode en ambos temas.
* FE2-AC06: sesión v1, privacidad, fechas/DST/recurrencia, reset y offline tras carga mantienen su contrato.
* FE2-AC07: presupuesto propio de 50 KiB medido, generación PNG y diez ciclos sin retenciones introducidas; comparación con base y deuda revisadas.
* FE2-AC08: verify y CI satisfactorios, PR identificada; validación de staging y aprobación humana posteriores al merge. Una sola imagen real para revisión, sin prometer medición humana en dos minutos.
* FE2-AC09: icono y nombre sustituyen las tarjetas grandes; descripción solo bajo interacción, accesible con teclado y tacto, sin hidratar Plan B. La imagen principal corresponde al archivo exacto suministrado por el propietario, sin reinterpretación.

## Verificación, riesgos y recuperación

Node 24.22.2, npm 11.19.1 y Chromium fijado r1248. Usar pruebas dirigidas en I2/I3 y npm run verify final; no repetir baterías completas por cambios documentales sin efecto runtime. El resumen técnico final se registra aquí, sin informes separados por iteración. Logs/sondas fuera del repo. Se conserva únicamente una imagen necesaria para la revisión.

PEND-007 permanece deuda no bloqueante aceptada por el propietario, con revisión mensual (próxima objetivo 2026-12-18). Revisar que candidato/lockfile no amplían la exposición: dependencias, globs y controles de entrega siguen iguales; conservar el riesgo aceptado, sin solicitar la misma excepción de nuevo por cambios de UI. Hallazgos nuevos se evalúan por evidencia. No activar automatizaciones.

Riesgos: unificar exportación con validación sin usar el horario anterior, no confundir descarga con éxito de importación, sugerencias sin relación semántica garantizada con texto libre, marcas sin invadir frase/zona segura. Rollback mediante revert de commits FE-02 por PR, sin reset/force push ni borrar sesiones ajenas.

## Progreso

| Iteración | Inicio | Fin | Resultado / siguiente paso |
| --- | --- | --- | --- |
| I1 | 2026-11-18 | 2026-11-18 | Base PR #28 sincronizada; contrato y autorización registrados en a28cc7d. |
| I2 | 2026-11-18 | 2026-11-18 | Selección simple/personalizada, Otro sin autoFocus, pie y jerarquía implementados. Pruebas dirigidas de teclado/valor/restauración y tipos satisfactorios; regresión completa al final. |
| I3 | 2026-11-18 | 2026-11-18 | Resultado, editor directo con presets, símbolo UI/PNG y firma MiMiniApp implementados. 27 componentes y 23 E2E dirigidas de escritorio satisfactorias, incluidos valores rápidos/personalizados, .ics directo/Google, branding máximo, diez ciclos y doble exportación; I4 repetirá la batería global sobre el candidato final. |
| I4 | 2026-11-18 | 2026-11-18 | Regresión local satisfactoria sobre b37f5a5: 518 unitarias, 27 componentes, 162 E2E e integración. CI del head aaf5aba satisfactorio (Actions 44304268344); PR #29 merged manualmente en 0d78dd3. Evidencia histórica anterior a la ampliación I5; no equivale a aceptación humana global. |
| I5 | 2026-11-18 | 2026-11-18 | Catálogo compacto y ayudas accesibles implementados; original recibido por GitHub y renombrado sin alterar sus bytes, integrado en catálogo/cabecera/Plan B/PNG. Base c918c4c incorpora únicamente la carga del recurso frente a staging 0d78dd3. Pruebas dirigidas de marca, exportación/offline y catálogo antes de la regresión global I6. |
| I6 | 2026-11-18 | 2026-11-18 | Regresión local final sobre f58be24: tipos/lint/formato/hosting/build, 529 unitarias, 27 componentes, 166 E2E e integración satisfactorios. Resumen único actualizado abajo; entrega por la rama estable, CI final y staging pendientes. |

## Historial

| Fecha | Estado | Actor | Evidencia |
| --- | --- | --- | --- |
| 2026-11-18 | Borrador → Aprobado → Autorizado → En curso | Propietario / Codex | Solicita nuevo plan, acepta la propuesta con selección simple/personalizada y logo, pide reutilizar rama y ejecutar iteraciones antes de PR conjunta. Se registra el alcance antes de implementar. |

## Evidencia histórica de I1–I4 (PR #29)

**Candidato funcional:** b37f5a5ee0ca7a723802c4304da654a442e9980e, comparado con staging 7cf32ca. Cambios de runtime limitados a Plan B; package/lockfile, dominio de calendario/validación/persistencia, workflows, controles de publicación y plataforma compartida conservados. La ficha v08 sustituye solo el recorrido/visibilidad y PNG sin marca de v07. Sin funciones nuevas después de esta revisión.

**Verificación local final:** npm run verify satisfactorio en Node 24.22.2 / npm 11.19.1 / Chromium 156.0.8078.4/r1248: tipos sin errores/advertencias/hints, lint/formato/hosting/build, **518 unitarias, 27 componentes, 162 E2E, dos builds y cuatro pantallas de integración**. Cobertura ES/EN, temas, ejemplo/selección/personalizada, restauración v1, errores sin selección, texto literal/Unicode máximo, mes/DST/recurrencia, consentimiento/cancelación, offline tras carga, teclado, reduced-motion, reflujo 320–1440 y zoom CSS 200 %, catálogo/identidad/404. No acredita comprensión universal en dos minutos, zoom nativo, otros motores o operaciones físicas de PB-01.

**Hallazgos resueltos y revalidados:** horario Google confirmado en estado React en lugar de un ref dentro de callback de render; protección de doble exportación trasladada a los nuevos botones y al Enter repetido dentro del campo nativo de hora; aviso/foco al continuar sin obstáculo u opción; tamaño táctil de radio evaluado sobre su etiqueta completa, y días distribuidos en cuatro columnas en móvil. La batería final pasa sin omisiones, skips o relajación del umbral de accesibilidad.

**Recursos:** 38692 B JS + 11185 B CSS propios = **49877 B / 48,71 KiB**, frente a 43469 B de base y límite 51200 B; margen 1323 B. Siete solicitudes iniciales de Plan B ES, 487044 B completos, cero externas/errores en la observación. No nuevas dependencias o solicitudes de marca; trazos vectoriales locales. El CSS global sigue en 34900 B y runtime compartido en 220745 B. Los 23 archivos públicos excluyen skills/motor/cachés y material de revisión.

**PNG y recursos de exportación:** cinco generaciones reales por creación/cambios de tema, 21,1–52,0 ms (mediana 26,9), después de cargar fuentes, loopback sin throttling y reloj real; excluyen carga previa/guardado del SO y no son una comparación de campo. Diez ciclos de exportación/editar/reset en cada perfil Chromium pasan sin URLs, callbacks o lienzos retenidos. Texto máximo/emoji y marca se comprueban en ambos temas; no se afirma que el fondo esté probado físicamente bajo un reloj.

**Observación de UI:** resultado e imagen real inspeccionados a 393×851; acciones principales terminan a 514 px del viewport, sin overflow horizontal. Días de 85×48 px en dos filas. El objetivo se completa mediante selección de «Leer más», falta de tiempo, «llego tarde a casa» y «leo una página»; las sugerencias para propósitos libres no prometen comprensión semántica. No se usan servicios externos o nuevos catálogos.

**Skills:** aplicación manual de Impeccable 4.9.2/Operate/clarify y Vercel con reglas fijadas 434b7f91364665f2f733b310ec54809bf8f37937; un solo contexto, no revisión independiente. Integridad de 62 archivos correcta y detector final sin hallazgos. Sin hooks, subagentes, nuevos servicios o afirmaciones de descubrimiento nativo.

**Deuda:** auditoría lock-only actual: 21 altas/11 moderadas/0 críticas; omit=dev: cero. Mismas raíces picomatch/minimatch/Astro, sin cambio de package/lockfile o exposición por globs. PEND-007 sigue como deuda no bloqueante aceptada, con revisión mensual y objetivo 2026-12-18; no se declara resuelta ni se activa automatización. Sin nuevos hallazgos funcionales materiales abiertos en el alcance revisado.

**Única imagen de revisión:** [PNG descargado real](../../review/fe02/example.png), ES/claro, 1179×2556, **125520 B**, SHA-256 fa1584d742bf9006dd6a6a23247053fd535fc3d1588fa39ed2b9fd31bf7e64d5. Incluye símbolo Plan B y firma MiMiniApp. Capturas auxiliares/logs/sondas permanecen fuera del entregable; no se crean informes por iteración o demos adicionales.

FE2-AC01–07 comprobados localmente con los límites anteriores. FE2-AC08 conserva pendientes CI del head final, merge humano, identidad/recorrido de staging y aceptación del propietario. Revisar en staging tras su merge; producción y aceptación de PB-01 siguen separadas.

Cierre documental: 126 Markdown/823 enlaces locales revisados sin roturas reales; solo el ejemplo literal upstream ya conocido. diff --check satisfactorio y los 23 archivos públicos idénticos tras la documentación. La validación CI remota se enlazará en la PR del head final; no se presenta esta evidencia local como remota.

**Reanudación I4 — 2026-11-18:** la PR #29 ya existe. CI anterior satisfactorio sobre 3cdb571 (Actions 44288791142), pero no acredita el último arreglo. Una sonda nativa encontró dos descargas al mantener Enter en el campo de hora; b37f5a5 cancela únicamente el keydown repetido y la regresión de exportación verifica una sola descarga y una pulsación posterior válida. Verify completo sobre b37f5a5 satisfactorio con los recuentos anteriores. Renderer, marca, traducciones y CSS son idénticos al candidato de la imagen: se reutiliza la misma imagen y las observaciones visuales/PNG, sin crear otra demo. PR temporalmente en borrador hasta entregar y validar el head corregido; merge manual/staging/aceptación pendientes.

**Ampliación I5 — preparación local sobre 0d78dd3:** catálogo sin paneles grandes, enlace en icono/nombre, utilidad traducida en popover nativo con Escape/cierre exterior y botón táctil de 48 px. Iconos de 80 px, nombres de 14 px y celdas hasta 128 px; movimiento reducido respetado. Descriptor `icon` opcional local bajo `/brand/`, sin imports de UI, dominios externos, traversal o parámetros. No cambian código funcional/exportaciones de Plan B, package/lockfile o publicación. Impeccable/distill/craft-floor y reglas Vercel aplicadas manualmente, un solo contexto; detector sin hallazgos.

Tipos, lint, formato y build satisfactorios; 55 pruebas dirigidas de registro y 30 E2E de catálogo/accesibilidad en ES/EN y perfiles Chromium escritorio/móvil pasan. Integración modular satisfactoria: dos builds aislados, fixture A estable al añadir B, borradores excluidos y seis pruebas de módulo acumuladas (2 + 4). Sonda adicional con popover abierto en claro/oscuro a 320/1440: sin desbordamientos o violaciones axe; botón informativo funciona sin JavaScript. Revisión visual interna del layout, sin añadir otra demo al entregable. No se repite verify global antes de disponer de la marca final.

**Recurso recibido — 2026-11-18:** el propietario aporta `master/public/brand/icon.png.png` por enlace GitHub y autoriza corregir el nombre. Rama sincronizada mediante fast-forward a c918c4c: frente a staging 0d78dd3 solo añade ese PNG. Se renombra a `public/brand/plan-b/icon.png`, conservando sus 27348 B, dimensiones 202×190, RGBA/transparencia y SHA-256 8828ac8a17a4c450005e2f3d91058729697c0b5e4323b4f6d82fcda0d248e608 (blob Git 9c72909251e2bc106b836b3904fc3f5dbcaf1c5f). Integración autorizada en catálogo, cabecera y marcas UI/PNG, sin recrear el original. I6 revisará también la carga local, offline y errores del recurso.

**Hallazgo I6:** la regresión detectó ocho fallos de los controles de integración históricos: I5 añadía un segundo módulo inline a la portada. Las ayudas se integran en el coordinador existente de `SiteLayout.astro`, mediante `src/scripts/catalogue.ts`; se elimina el componente de script separado. Se conservan intactas las aserciones de un único módulo, ausencia de scripts externos y presupuestos de movimiento. Astro externalizaba el bundle combinado al superar su umbral predeterminado de 4 KiB: regla de inlining exclusiva del entry de SiteLayout hasta 5 KiB sin comprimir, manteniendo el valor predeterminado para los demás assets. El módulo final mide 4859 B / 1793 B gzip. Las 12 E2E dirigidas de identidad, movimiento y catálogo pasan sin modificar las pruebas históricas. Regresión global final a continuación.

## Resumen final de I5–I6

**Candidato funcional:** f58be24e9ff9156a1a46eeb5df063467e6b066b2 sobre staging 0d78dd3, incorporando el recurso del propietario desde master c918c4c. Icono renombrado sin cambiar sus bytes a `public/brand/plan-b/icon.png`; se usa en catálogo, cabecera, marcas de Plan B y exportación PNG. Catálogo con iconos de 80 px y nombres de 14 px; utilidad en popover accesible por hover, foco o información táctil de 48 px. No se modifica el dominio de calendario, validación, sesión v1, formatos o consentimiento.

**Verificación final:** `npm run verify` satisfactorio en Node 24.22.2/npm 11.19.1 y Chromium fijado r1248: tipos sin errores/advertencias/hints, lint/formato/hosting/build, **529 unitarias, 27 componentes, 166 E2E e integración modular**. Dos builds aislados, pruebas de módulo 2 + 4 y fixture A estable al añadir B, sin publicar borradores o fixtures. Se conservan intactas las pruebas históricas de identidad, movimiento, un solo módulo inline y ausencia de scripts externos. La revisión corrigió el empaquetado del coordinador antes de repetir toda la batería; no se relajaron aserciones ni se omitieron pruebas.

**Recursos:** Plan B propio **38437 B JS + 11176 B CSS = 49613 B / 48,45 KiB**, frente a 49877 B del candidato I4 y límite 51200 B; margen 1587 B. El coordinador compartido mide 4859 B / 1793 B gzip, inline y acotado a 5 KiB sin comprimir mediante una regla exclusiva de su entry; el resto de assets conserva el umbral predeterminado. Global CSS 35394 B y React/Astro compartidos 220745 B. La marca añade un único recurso PNG local de 27348 B, reutilizado entre cabecera/interfaz/canvas. Observación ES/claro a 393×851: ocho solicitudes, **515761 B reales sin comprimir** y 271006 B estimados al comprimir cada respuesta con gzip; cero solicitudes externas/errores. El presupuesto propio no incluye la marca, fuentes o runtimes compartidos.

**PNG y revisión visual:** se reutiliza una sola imagen real de revisión, actualizada con la marca original: [example.png](../../review/fe02/example.png), 1179×2556, 129255 B, SHA-256 f1a088e9720346dd0ae9bfeea5c1fa6cea4b3cf451ec3fd4238db0dedde616c1. Marca morada/lima comprobada en los píxeles exportados de ambos temas, texto máximo íntegro, firma MiMiniApp y diez ciclos sin URLs/lienzos/callbacks retenidos. Generación y exportaciones offline conservadas. Cinco observaciones de dibujo/codificación tras fuentes/icono listos: 23,1–82,1 ms, mediana 69,2 ms, loopback durante la regresión; excluyen carga previa, guardado del SO y rendimiento de campo. Resultado revisado a 393×851, botón principal termina a 517,3 px y sin overflow. Catálogo inspeccionado en escritorio/claro y móvil/oscuro; capturas técnicas fuera del repo, sin nuevas demos.

**Calidad y deuda:** Impeccable y Vercel adaptados, revisión manual en un solo contexto; detector sin hallazgos sobre las superficies modificadas. Sin nuevas dependencias, cambios de lockfile, hosting, workflows, persistencia, backend o analítica. PEND-007 conserva el riesgo aceptado y revisión mensual objetivo 2026-12-18; no se repite auditoría de dependencias sin cambios ni se declara resuelta esa deuda. Pruebas físicas/aceptación global PB-01 y aceptación humana FE-01/FE-02 siguen separadas.

**Entrega:** I5 e I6 completadas localmente en la rama estable `feature/fe01-frontend-quality`. PR hacia staging tras consolidar este resumen; CI del head, merge manual, identidad/recorrido de staging y aprobación visual del propietario pendientes. No es autorización de auto-merge, promoción a producción o aceptación global. La evidencia de entrega/CI se enlaza en la PR correspondiente, sin crear otro informe o ExecPlan.
