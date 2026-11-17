# FE-01 — Informe único de ejecución

**Responsable:** propietario de MiMiniApp (Alexander / Ale). **Actualizado:** 2026-11-17. Estado/progreso canónicos en el [ExecPlan FE-01](../../exec-plans/active/FE-01-estandar-frontend-y-piloto-plan-b.md). Este informe conserva la evidencia de sus iteraciones; no aprueba estándares o herramientas.

## I1 — Base y propuesta del estándar

### Autorización y reconciliación

El propietario indica «vale, crea una nueva rama y empecemos con la iteración 1», tras revisar el plan y aclarar que el estándar/skills son transversales y el piloto de implementación es Plan B. Se registra aprobación del plan y autorización de I1; las propuestas concretas del estándar y selección/permisos se presentan para revisión al terminar esta preparación. No se instalan skills ni se inicia el rediseño.

La rama estable **feature/fe01-frontend-quality** se crea desde origin/staging **1b204633ddd0ad782096d5377a3ee1c35d05c796**, árbol **af9deb7d47fb9bd86dea690467f54577f3b214b7**, después de fetch explícito. Ese staging integra PR #25 de PB-01/I6.

El checkout conservaba HEAD 3d28184 y 18 archivos modificados/nuevos desde la desconexión anterior y posterior investigación/planificación. Antes de cambiar de rama se guardan copia completa, manifiesto SHA-256, patch y stash local **df598df6e8af8b9460549f17a42006bf1484b42c**. Las tres fuentes de runtime modificadas de I6 coinciden byte a byte con staging; regression.spec.ts solo difiere por dos líneas vacías. Las variantes documentales I6 se conservan en el respaldo y se usa la versión ya entregada/integrada, trasladando únicamente las adiciones de investigación/planificación FE-01 y sus enlaces. No se aplica un stash completo encima de staging ni se usa reset/clean/force. El stash/respaldo son recuperación local, no evidencia remota compartida.

El código, pruebas de aplicación, package/lockfile, workflows y scripts versionados se mantienen idénticos a la base. Los cambios de esta entrega son documentación y datos de referencia; la nueva rama no hereda modificaciones funcionales sin integrar.

### Referencia reproducible

[Manifiesto y observaciones de base](i1-baseline.json): 23 archivos públicos con tamaño/hash; **todos coinciden con el runtime auditado PB-01/I6**. Build local satisfactorio desde el código integrado; Node **24.22.2**, npm **11.19.1**, Chromium **156.0.8078.4/r1248**, Playwright **1.64.1**. Se archiva la salida local para comparaciones posteriores; el SHA/árbol y manifiesto permiten reconstruirla si el workspace desaparece.

Se capturan **40 estados de página** (portada, propósito, obstáculo, plan y resultado × ES/EN × claro/oscuro × 393×851/1440×900) y **24 PNG realmente descargados** (ejemplo, mínimos válidos y máximos × los ocho perfiles). Datos sintéticos: ejemplo de los diccionarios del producto; mínimos PPP/SSS/AAA; máximos propósito P×80, situación/acción W×90. Hora/días del ejemplo, navegador con zona Europe/Madrid (comprobada en el contexto Chromium) y controles nativos en en-US, con fecha fija 2026-11-17 12:00 para capturas. El perfil estrecho es viewport de escritorio, sin teclado virtual ni afirmación de teléfono físico. Se usa reduced-motion en las referencias estáticas; no se usa esa captura como prueba de toda la política del hero.

Las capturas/descargas auxiliares permanecen fuera del repo para no añadir una matriz de imágenes sin decisión visual nueva; sus tamaños/hashes y geometría están en el JSON, y sus resultados relevantes se resumen aquí. Se inspeccionan visualmente el plan ES claro de escritorio y el PNG máximo EN oscuro. Las frases máximas permanecen completas; las 24 imágenes son **1179×2556** y pesan **83304–146001 B**. No es una prueba de fondo colocado bajo reloj ni de destinos nativos.

### Geometría y fricción que debe resolver el piloto

Mediciones con scroll de página al inicio, ES/claro, ejemplo, acción vacía en el paso de plan para observar la composición y el gris parcial. La posición de la acción principal se mide en el documento; no equivale a un fallo de foco. En esa captura el foco está en el campo que se acaba de editar; en los cambios de paso capturados se observa el título enfocado.

| Perfil | Paso | Alto total de página, px | Parte inferior de Ver mi plan, px desde arriba | Observación |
| --- | --- | --- | --- | --- |
| 393×851 | Propósito | 1214 | — | Siguiente termina en y=888, fuera del viewport inicial. |
| 393×851 | Plan | 1817 | 1492 | Las frases, sugerencias, hora y días compiten antes de llegar a la acción. |
| 393×851 | Resultado | 2662 | — | Exportaciones/instrucciones se acumulan en una página muy larga. |
| 1440×900 | Propósito | 1110 | — | Siguiente termina en y=799; el contenido restante aún alarga la página. |
| 1440×900 | Plan | 1690 | 1379 | La limitación también aparece en escritorio; no se resuelve solo con un breakpoint móvil. |
| 1440×900 | Resultado | 2330 | — | La columna estrecha y la jerarquía de opciones merecen revisión. |

No se observa overflow horizontal en los 40 estados capturados. La lectura es de composición/densidad, no una nueva certificación de accesibilidad o una medición de tiempo humano. La propuesta permite revisar los límites de layout/agrupación en I3; no fuerza ocultar contenido para conseguir cero scroll.

### Recursos y rendimiento de base

Código propio **42903 B / 41,90 KiB**: JS App **39560 B**, CSS inline **3343 B**. Runtime compartido React/client **220745 B**, CSS común **34923 B**, todos identificados por hash en el manifiesto. Las portadas no hidratan React/Plan B, aunque llevan el CSS inline de 3343 B del módulo desde su registro. La carga inicial de Plan B incluye HTML, runtime, CSS y fuentes: el presupuesto propio no representa el peso total.

| Ruta | Peticiones frías | Bytes brutos | Suma gzip estimada | Solicitudes externas |
| --- | --- | --- | --- | --- |
| /es/ | 4 | 199557 | 152594 | 0 |
| /en/ | 4 | 199472 | 152525 | 0 |
| 404 real /fe01-missing/ | 4 | 193888 | 151012 | 0 |
| /es/apps/plan-b/ | 7 | 472242 | 239920 | 0 |

**80 observaciones**: cuatro rutas × dos viewports × cinco parejas fría/caliente, loopback local, fuentes listas, sin throttle CPU/red y con service workers bloqueados. Fría significa nuevo contexto/caché HTTP, no máquina o caché de fuentes del SO recién arrancada. Caliente reutiliza contexto, limpia solo la sesión propia y conserva HTTP cache; transferSize incluye revalidaciones. El reloj controlado de las capturas no se aplica a estas mediciones. Se evita contar cuerpos 304 como payload fresco y se incluye el HTML de error 404. Un cálculo auxiliar inicial omitió ese cuerpo 404; se corrige y se sustituyen únicamente las observaciones afectadas antes de fijar el manifiesto final.

| Perfil / ruta | LCP frío, mediana (rango) ms | LCP caliente, mediana (rango) ms | CLS máximo observado |
| --- | --- | --- | --- |
| 393 / ES | 56,0 (44,0–60,0) | 44,0 (40,0–48,0) | 0 |
| 393 / EN | 56,0 (44,0–76,0) | 40,0 (28,0–44,0) | 0 |
| 393 / 404 | 68,0 (52,0–92,0) | 32,0 (24,0–48,0) | 0 |
| 393 / Plan B | 80,0 (64,0–104,0) | 32,0 (28,0–44,0) | 0,028 |
| 1440 / ES | 68,0 (60,0–92,0) | 40,0 (32,0–44,0) | 0 |
| 1440 / EN | 68,0 (52,0–72,0) | 48,0 (40,0–52,0) | 0 |
| 1440 / 404 | 56,0 (56,0–76,0) | 44,0 (28,0–44,0) | 0 |
| 1440 / Plan B | 72,0 (60,0–84,0) | 36,0 (28,0–48,0) | 0,006 |

El JSON conserva transferencias y clic→dos frames como observación sintética, **no INP**. No se infiere rendimiento de producción, percentil 75 o rapidez de completar el formulario de estos valores. I7 volverá a comparar base/candidato en condiciones equiparables y revisará canvas, diez ciclos, listeners/URLs y memoria; estas capturas no acreditan una nueva evaluación de heap/fugas o una prueba de uso humana.

### Staging observado de la base

El manifiesto de https://miminiapp-staging.miminiapp-lab.workers.dev identifica sourceSha **1b204633ddd0ad782096d5377a3ee1c35d05c796**, sourceTree **af9deb7d47fb9bd86dea690467f54577f3b214b7**, repositoryId **1445849027** y payloadSha256 **c446f41674e84be0f49a7c3d176c01414f0e19ab172cb35678e799357f452507**. Se compara con la revisión esperada obtenida del remoto, sin construir expectativas confiables a partir de lo servido.

[Run staging 44076948033](https://github.com/aalexlpez/miminiapp/actions/runs/44076948033) satisfactorio sobre ese SHA: [prepare 134017295805](https://github.com/aalexlpez/miminiapp/actions/runs/44076948033/job/134017295805) y [remote-test 134019493740](https://github.com/aalexlpez/miminiapp/actions/runs/44076948033/job/134019493740), ambos satisfactorios. Esa evidencia ya cubre la integración de las dos correcciones I6 de PR #25; no acredita la futura implementación FE-01, pruebas físicas o aceptación visual. No se inicia despliegue ni se ejecutan pruebas remotas contra un target arbitrario en esta tarea.

### Incidencia de prepare tras integrar PR #26

El primer intento del [run staging 44110142484](https://github.com/aalexlpez/miminiapp/actions/runs/44110142484), sobre 64546adc0027b5988983e425278beb5585cf4a64, falla en el [job prepare 134133199389](https://github.com/aalexlpez/miminiapp/actions/runs/44110142484/job/134133199389), paso Check authorization and the protected merge, con `Exactly one merged pull request is required for a deployment.` Ocurre antes de npm ci, verify, empaquetado o publicación; remote-test se omite por esa dependencia fallida. No es un fallo de las pruebas de la app y no se publica desde ese intento.

La lectura posterior de commits/64546ad…/pulls y del detalle de PR #26 confirma una sola PR cerrada/fusionada a staging, con merge SHA exacto y merged_by aalexlpez. Staging sigue en ese mismo SHA. El primer log no conserva el cuerpo de la respuesta, por lo que no se afirma si hubo cero candidatos o una respuesta temporalmente inconsistente; la hipótesis compatible con el momento del fallo es disponibilidad/propagación temporal de metadatos tras el merge.

Se reintentan únicamente los jobs fallidos y sus dependencias mediante el flujo existente, intento 2 del mismo run/SHA, con actor y triggering_actor aalexlpez. El [prepare del reintento 134147177130](https://github.com/aalexlpez/miminiapp/actions/runs/44110142484/job/134147177130) supera el control que falló y termina satisfactorio, sin cambiar código, permisos, workflows o condiciones del gate. La publicación/prueba remota posterior y la identidad servida se contrastan en el run y en su entrega de seguimiento; el éxito de prepare solo no acredita todavía remote-test.

### Paquetes preparados y aprobación del propietario

| Paquete | Contenido concreto | Estado |
| --- | --- | --- |
| ADR-MMA-022 | [FE-Q01–09 y matriz FE-M01–12](../../standards/FRONTEND.md#fe-01--estándar-de-calidad-frontend): comprensión/progresión, jerarquía, composición, scroll alcanzable, movimiento útil, estados, resultado/exportación y evidencia. [Procedimiento técnico/visual/de uso](../../standards/QUALITY_SCORE.md#fe-01--revisión-técnica-visual-y-de-uso), con contexto y reglas identificadas. | Aprobada el 2026-11-17 con el ajuste de que la aprobación del propietario basta como aceptación humana y las pruebas con otras personas son opcionales. No cambia la ficha de Plan B ni el hero ni acepta todavía una nueva UI. |
| H-008 | [Selección/permisos de skills locales](../../harness-decisions.md#h-008--skills-frontend-locales-y-uso-manual-contextualizado): Impeccable + Vercel fijados, adaptaciones a fuentes canónicas, uso manual, telemetría desactivada, catálogo/hooks/delegación fuera del permiso inicial, caché/motor solo de desarrollo y carga real por verificar en I2. | Aprobada el 2026-11-17. Instalación, descubrimiento y comprobación corresponden a I2, aún sin iniciar; no se ejecuta el motor en esta entrega. |

La matriz distingue adoptar/adaptar/revisar y conserva las excepciones vigentes de texto literal/pegado, movimiento del hero/gris, identidad y contratos modulares. También permite revisar una decisión propia que perjudique la UX, mediante su fuente. Se mantienen los límites de alcance: estándar transversal y piloto Plan B; no rediseño integral de portada/catálogo/plataforma.

El propietario acepta ADR-MMA-022 con la indicación «no hace falta que para dar por correcto un desarrollo, algunas personas deban probarla» y señala que basta su aprobación; también acepta H-008. Se registran ambas decisiones y se ajustan el estándar, procedimiento y criterios de I3/I6 del plan para que las pruebas con otras personas sean opcionales. Se elimina el mínimo obligatorio de tres participantes y la medición de 120 s como requisito de cierre. Los dos minutos conservan su papel de objetivo de experiencia y ninguna medición no realizada se presenta como comprobada. Las verificaciones técnicas/regresión siguen vigentes. Con ello se cierra FE-I1-03 e I1; I2 requiere su autorización de ejecución correspondiente.

### Verificación, deuda y límites

* Build local satisfactorio y 23 hashes públicos idénticos al runtime integrado/auditado. Diff de src, pruebas, scripts, workflows y package/lockfile frente a staging sin cambios; captura real de 40 estados, 24 PNG y 80 observaciones con los límites anteriores.
* Auditoría actual: 14 moderadas de desarrollo, 0 altas/críticas; omit=dev: 0 vulnerabilidades. npm audit completo termina exit 1 por las moderadas; el de producción termina exit 0. Package/lockfile idénticos a la base. Se conserva PEND-007 y su evaluación previa de minimatch/endpoint de @astrojs/node no desplegado; no se actualizan dependencias. Los demás pendientes de base no se cierran por esta iteración.
* El runtime base ya pasó CI y staging en el run enlazado; el [CI de la entrega I1, run 44108452027](https://github.com/aalexlpez/miminiapp/actions/runs/44108452027), pasó sobre head 21d8cc0ebea7792008cfd85a2f31cdebd97da977 con 504 unitarias, 19 componentes, 146 E2E e integración modular, además de tipos/lint/formato/hosting. PR #26 está integrada en staging 64546adc0027b5988983e425278beb5585cf4a64. El cierre documental posterior se comprueba en su PR de seguimiento. No se presenta esta referencia como una nueva ejecución local de las 504 unitarias/19 componentes/146 E2E. Para I1 documental se usan coherencia/enlaces, diff y build/captura; el workflow existente ejecuta verify sobre el head exacto de cada entrega.
* Auditoría documental local de la entrega inicial: 65 Markdown y 582 enlaces locales sin incidencias; diff --check satisfactorio. No se añaden pruebas de contenido editorial.
* Ni Impeccable/Vercel, su descubrimiento en el cliente, sus binarios o Claude/Gemini se declaran probados. La lectura de fuentes previa no sustituye I2. No hay pruebas físicas nuevas, evaluación de primera visita/retención, dirección nueva aceptada o cambios de producto.

### Salida de I1 y reanudación

| Criterio | Resultado |
| --- | --- |
| FE-I1-01 | Comprobado: recuperación sin pérdida, rama desde staging, base/árbol/runtime y manifiesto reproducibles, referencia de composición/PNG/recursos/deuda identificada. |
| FE-I1-02 | Comprobado: estándar/procedimiento, matriz contextualizada y selección/permisos preparados en sus fuentes, con reglas aplicables y conflictos explícitos. Su aprobación posterior está registrada arriba. |
| FE-I1-03 | Comprobado: ADR-MMA-022 aprobada con aceptación humana suficiente del propietario y pruebas con otras personas opcionales; H-008 aprobada. I1 completada el 2026-11-17; FE-01 permanece En curso. |

Siguiente paso: I2, pendiente de autorización para instalar/comprobar las skills aprobadas. I2–I7 no se inician por aprobar las decisiones o entregar este cierre documental. La rama estable se conserva para el resto de FE-01; merge manual y sincronización sin reescribir historia. La aprobación actual de normas/selección no acepta el futuro diseño del piloto ni el producto completo.
