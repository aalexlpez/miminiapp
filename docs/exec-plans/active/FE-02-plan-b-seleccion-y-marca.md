# FE-02 — Plan B: selección rápida, acciones visibles e identidad

## Control

* **Estado:** `En curso`.
* **Responsable de aprobación, autorización y aceptación:** propietario de MiMiniApp (Alexander / Ale).
* **Creado / actualizado:** 2026-11-18.
* **Rama estable:** feature/fe01-frontend-quality, reutilizada por instrucción expresa del propietario; excepción acotada a H-007, sin trabajo concurrente de FE-01.
* **Base:** staging 7cf32ca9cd2b9085600fac202f4455027c11becc, merge de PR #28. Rama sincronizada mediante fast-forward. FE-01 conserva historia y aceptación propia pendiente; FE-02 mejora el contenido integrado, no depende de aceptar FE-01 ni lo declara aceptado.
* **Autorización:** «De resto me suena bien lo que planteaste» y «Vamos a generar un nuevo plan en la misma rama, hacemos las iteraciones y luego subimos la PR», incorporando selección simple/personalizada en Si/entonces y logo/identidad en el PNG. Aprueba este alcance y autoriza ejecución local secuencial y entrega conjunta final. No informes al usuario por iteración ni nuevas demos; una sola imagen de ejemplo real. Merge manual y revisión visual en staging.
* **Iteración actual:** I2 — wizard de selección.

## Objetivo y contrato aprobado

Reducir escritura y ambigüedad manteniendo cuatro preguntas. Propósito libre con ideas; obstáculo seleccionable con continuar explícito; situación y acción con selección simple de sugerencias y opción de escribir una personalizada. Valores reales, literales y editables, sin inferencia semántica sobre propósitos libres. Restauración v1, fechas, validación y salidas conservadas.

Pregunta, campo/opciones y acción principal tienen prioridad. Una sola indicación de progreso. «Si»/«entonces» se muestran como conectores, fuera del valor editable; una duplicación se explica y solo se corrige mediante acción explícita. Ideas y campo Otro se revelan con movimiento breve/reducible sin enfocar automáticamente y provocar saltos. Pregunta/etiqueta accesible y ejemplos concretos, sin explicaciones repetidas.

Privacidad general en pie de la herramienta, fuera del workspace, sin overlay fijo. Avisos operativos y consentimiento se conservan donde corresponden. Resultado con dos acciones visibles: descargar imagen y añadir recordatorio. Este último abre editor inline con hora nativa, presets todos/laborables y selección de días. Exportar confirma atómicamente el borrador válido y descarga .ics o pide consentimiento Google, sin un paso obligatorio intermedio de preparar. Guardado de imagen conserva alternativas compatibles y cancelación; editar y compartir herramienta son secundarios.

Logo vectorial propio de Plan B, con un trazo B y continuidad; usar en UI y PNG junto a la firma MiMiniApp. Identidad/tokens/fuentes existentes, sin sustituir la marca matriz. PNG 1179×2556, texto íntegro en zona segura, marca separada de la frase. Enmienda aprobada ADR-MMA-024 y ficha v08; reemplazan las cláusulas v07 de texto libre inicial, calendario oculto y PNG sin marca.

## Exclusiones

Sin backend, IA generativa en producto, analítica, dependencias nuevas, cambio de persistencia/formatos de calendario/infraestructura/workflows o promoción a producción. Sin más prototipos o matrices de capturas versionadas. Las operaciones físicas pendientes de PB-01 no se declaran ejecutadas. La aprobación del propietario basta para aceptación humana.

## Iteraciones secuenciales

| Iteración | Trabajo y archivos | Comprobación / salida |
| --- | --- | --- |
| I1 — contrato y base | Registrar aprobación, ficha/ADR, rama y referencia del runtime integrado; leer Impeccable Operate/clarify y Vercel adaptados. | Base identificada, límites y criterios completos antes de editar runtime. |
| I2 — wizard | App, componente de selección simple, diccionarios ES/EN y CSS. Ideas de propósito, opciones/personalizada, Otro suave, continuar coherente, jerarquía y pie. | Pruebas dirigidas de selección/personalizada, conservar textos/estado, teclado y reflujo; commit FE-02/I2. |
| I3 — resultado e identidad | ScheduleEditor, ExportPanel, logo compartido UI/canvas, renderer y traducciones. Acciones visibles, presets, exportación directa del horario validado y PNG con marcas. | Exportaciones/errores/consentimiento/offline, branding, texto máximo y recursos probados; commit FE-02/I3. |
| I4 — regresión y análisis final | Revisar diff contra base, repetir verify, medir bytes/PNG/limpieza y deuda; una sola imagen real. Actualizar este plan con resumen final y entregar PR conjunta. | Tests/estáticos/build y evidencia final identificados, límites y deuda declarados; CI del head y staging tras merge humano. Sin cambios funcionales posteriores sin revalidación. |

## Criterios de aceptación

* FE2-AC01: cuatro preguntas ES/EN con elección simple en situación/acción, personalizada, ejemplos comprensibles y Atrás/restauración sin perder texto.
* FE2-AC02: selección por teclado, foco visible, errores asociados, sin autoFocus/scroll por Otro; reflujo 320/393 y escritorio, movimiento reducido.
* FE2-AC03: pie de privacidad fuera del workspace; avisos de fallos/consentimiento siguen accesibles.
* FE2-AC04: imagen y recordatorio visibles; hora/días cómodos, exportación directa con validación, consentimiento y borrador persistido solo al confirmar.
* FE2-AC05: logo Plan B consistente UI/PNG y firma MiMiniApp; PNG íntegro y legible con texto máximo/Unicode en ambos temas.
* FE2-AC06: sesión v1, privacidad, fechas/DST/recurrencia, reset y offline tras carga mantienen su contrato.
* FE2-AC07: presupuesto propio de 50 KiB medido, generación PNG y diez ciclos sin retenciones introducidas; comparación con base y deuda revisadas.
* FE2-AC08: verify y CI satisfactorios, PR identificada; validación de staging y aprobación humana posteriores al merge. Una sola imagen real para revisión, sin prometer medición humana en dos minutos.

## Verificación, riesgos y recuperación

Node 24.22.2, npm 11.19.1 y Chromium fijado r1248. Usar pruebas dirigidas en I2/I3 y npm run verify final; no repetir baterías completas por cambios documentales sin efecto runtime. El resumen técnico final se registra aquí, sin informes separados por iteración. Logs/sondas fuera del repo. Se conserva únicamente una imagen necesaria para la revisión.

PEND-007 permanece deuda no bloqueante aceptada por el propietario, con revisión mensual (próxima objetivo 2026-12-18). Revisar que candidato/lockfile no amplían la exposición: dependencias, globs y controles de entrega siguen iguales; conservar el riesgo aceptado, sin solicitar la misma excepción de nuevo por cambios de UI. Hallazgos nuevos se evalúan por evidencia. No activar automatizaciones.

Riesgos: unificar exportación con validación sin usar el horario anterior, no confundir descarga con éxito de importación, sugerencias sin relación semántica garantizada con texto libre, marcas sin invadir frase/zona segura. Rollback mediante revert de commits FE-02 por PR, sin reset/force push ni borrar sesiones ajenas.

## Progreso

| Iteración | Inicio | Fin | Resultado / siguiente paso |
| --- | --- | --- | --- |
| I1 | 2026-11-18 | 2026-11-18 | Base PR #28 sincronizada; contrato y autorización registrados en a28cc7d. |
| I2 | 2026-11-18 | — | Selección simple/personalizada, Otro sin autoFocus, pie y jerarquía implementados. Pruebas dirigidas de teclado/valor/restauración y tipos satisfactorios; regresión completa al final. |
| I3 | — | — | Pendiente. |
| I4 | — | — | Última regresión/análisis pendiente. |

## Historial

| Fecha | Estado | Actor | Evidencia |
| --- | --- | --- | --- |
| 2026-11-18 | Borrador → Aprobado → Autorizado → En curso | Propietario / Codex | Solicita nuevo plan, acepta la propuesta con selección simple/personalizada y logo, pide reutilizar rama y ejecutar iteraciones antes de PR conjunta. Se registra el alcance antes de implementar. |
