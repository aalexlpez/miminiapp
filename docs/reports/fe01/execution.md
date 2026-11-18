# FE-01 — Informe único de ejecución

**Responsable:** propietario de MiMiniApp (Alexander / Ale). **Actualizado:** 2026-11-18. Estado/progreso canónicos en el [ExecPlan FE-01](../../exec-plans/active/FE-01-estandar-frontend-y-piloto-plan-b.md). Este informe conserva la evidencia de sus iteraciones; no aprueba estándares o herramientas.

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

Al cerrar I1, I2 quedaba pendiente de autorización. La instrucción posterior de ejecución local se registra en Control del plan y en I2 a continuación. La aprobación de normas/selección no acepta el futuro diseño del piloto ni el producto completo.

## I2 — Integración local y comprobación de skills

### Inicio y entrega local

PR #27 está integrada: se hace fetch de staging y de la rama del plan y se
actualiza esta última por fast-forward a **e4b42f121674a24aacc4a3add473111bc7e36c34**,
árbol **de2ab70cab9849b7d50325a5d7372c5a97017adb**, sin cambios locales previos.
El propietario solicita empezar las iteraciones «sin subir nada hasta que esté
todo el plan ejecutado», mencionando I1. Se le comunica que I1 ya estaba completa
y que se continúa por I2, primera pendiente. Se conserva la rama estable y la
entrega mediante commits locales por iteración: sin push, PR nueva, merge o
escrituras remotas. La entrega conjunta/CI/staging será posterior a la
implementación y regresión local final; sus evidencias siguen siendo necesarias
para la verificación global. Las decisiones de dirección I3 y acabado I6 siguen
correspondiendo al propietario, sin exigir otras personas.

### Perfil incorporado y procedencia

[Manifiesto](../../../.agents/skills/manifest.json),
[avisos y adaptaciones](../../../.agents/skills/README.md) y
[procedimiento reproducible](../../guides/frontend-skills.md).

* Impeccable **4.9.2**, revisión **d41d9860b0094dcb68030657da63461212835aaa**:
  SKILL.md con preámbulo local señalado, playbooks upstream, launcher POSIX,
  VERSION/checksums y Apache-2.0/NOTICE. Perfil manual limitado a contexto,
  detector de fuentes e instrucciones de diseño. Se omiten configuraciones de
  subagentes, catálogo de fuentes, bundles de inyección y launcher Windows;
  sus capacidades opcionales no se declaran instaladas/probadas.
* Adaptación de Web Design Guidelines basada en agent-skills
  **1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62**, con snapshot íntegro de reglas
  **434b7f91364665f2f733b310ec54809bf8f37937**. Se redacta el procedimiento
  local en lugar de redistribuir literalmente el SKILL original del paquete
  sin LICENSE separado. Las reglas sí tienen LICENSE MIT, copyright 2025
  Vercel Labs, que se conserva. No se cambia la licencia general del producto.
* El motor es **0.1.25**, versión independiente de la skill, con SHA-256 Linux
  x64 **f48aca43294a9ba1ea3eb7b1d0a0b2d595c480e8c65003e410247b9884820ddd**
  tomado de la revisión fija. Descarga pública explícita con prepare; caché
  ignorada .local/skills/impeccable y verificación antes de cada ejecución.
  El wrapper rechaza otros comandos, URLs como target y activación de telemetría.
  Una alteración sintética del binario termina en 65 sin ejecución; se restaura
  el contenido verificado y engine-probe vuelve a identificar 0.1.25.

Contexto: AGENTS, ficha Plan B §§3–5, decisiones aplicables/ADR-MMA-022,
arquitectura, FRONTEND/matriz FE-M y FE-01. Se leen SKILL.md de ambas ayudas,
Operate, onboard y reglas Vercel; craft-floor se examina para detectar conflictos,
sin editar UI. Se conserva la identidad y la autoridad del contrato frente a
recomendaciones upstream, incluidas URL con estado, autodetección de idioma,
Title Case, confirmación de reset, movimiento y truncado. context del motor
detecta correctamente que faltan PRODUCT.md/DESIGN.md; no carga por sí mismo las
fuentes con otros nombres. Las instrucciones adaptadas obligan a leerlas y
descartan la recomendación de init. No se crean autoridades paralelas.

### Motor, efectos y descubrimiento del cliente

[Evidencia resumida](i2-checks.json). engine-probe, context y detect ejecutados con
telemetría apagada desde antes del arranque; config de proyecto telemetry=false,
updateCheck=false y variables NO_TELEMETRY/NO_UPDATE_CHECK/NO_STALENESS_CHECK.
strace no observa syscalls de red IP en esas llamadas. En detect no observa
aperturas para escritura ni creación/borrado/renombrado de archivos. Solo prepare
descarga la release pública fijada; no se consulta catálogo, API de versiones,
servicios de imágenes ni se transmite contexto. telemetry status confirma off
y advierte que los rolls seguirían siendo posibles: por eso se limitan también
los comandos. No se afirma una auditoría de todo el binario o un sandbox de red.

El detector lee efectivamente App.tsx, ExportPanel.tsx, app.css y entry.astro
y devuelve **[] / exit 0**. No sustituye la revisión renderizada ni certifica UX.

**Bloqueo FE-I2-01:** skills.list del executor sigue devolviendo skills=[],
warnings=[] después de instalar los archivos. Esta sesión parte de /workspace,
con repo en /workspace/miminiapp; no se demuestra que esa ubicación sea la causa.
La comprobación adicional mediante Codex CLI **0.166.0-alpha.1** no llega a
skills/list: inicialmente no puede inicializar sqlite bajo su directorio de
estado; al ubicar logs/sqlite temporales en el workspace tampoco arranca porque
necesita abrir installation_id en /home/agent/.codex, de solo lectura. Se observa
ese fallo con strace. No hay turnos de modelo, subagentes, cambio de HOME/CODEX_HOME,
instalación global o modificación de ese directorio.

No se ejecutan los tres escenarios de selección nativa ni se afirma carga
automática por haber leído SKILL.md a mano. Siguiente comprobación concreta:
sesión abierta con raíz/cwd del repo y lista recargada, seguida de diseño,
revisión técnica y tarea ajena. Esa posibilidad está por probar. Si el cliente
carece de esa capacidad, continuar con alcance manual requiere que el propietario
decida expresamente la alternativa y se actualice FE-I2-01; no se da por resuelto
ni se instala otro cliente por inferencia. Claude/Gemini sin certificar.

### Aplicación manual acotada al producto actual

**Método: un solo contexto; no independiente.** Revisión Operate/onboard y
Vercel, más detector de fuentes y navegador. No se invoca critique completo,
sus dos evaluaciones independientes ni su overlay/live-server. Cuatro capturas
locales: plan/resultado, ES claro 1440×900 y EN oscuro 393×851. Chromium
156.0.8078.4, zona Europe/Madrid, locale nativo en-US, reduced-motion y ejemplo
sintético completo a fecha fija 2026-11-17; no es una prueba humana o móvil físico.
Se inspeccionan visualmente el plan de escritorio y el resultado estrecho oscuro.

| Hallazgo | Evidencia / impacto | Acción para I3 o implementación aprobada |
| --- | --- | --- |
| P1 — Decisiones opcionales antes del valor principal | App.tsx:414 agrupa situación, acción, sugerencias, hora y siete días antes de Ver mi plan. Pantalla del paso: 1727 px en escritorio y 1880 px estrecho; final de acción principal y=1417/1555 con scroll inicial cero. | Proponer una decisión principal cada vez y pasar calendario a después del resultado; requiere revisar/aprobar ficha, no parchear I2. |
| P1 — Resultado sin prioridad clara entre acciones | ExportPanel.tsx:221 muestra calendario, fondo y compartir con jerarquía similar. Altura de página 2380/2630 px; la vista previa llega después de calendario/avisos. | Presentar primero el plan y una acción de guardado clara; revelar otras opciones en su contexto manteniendo privacidad/consentimientos. |
| P2 — Escritorio reducido a columna móvil | app.css:2 fija 30rem para todo el recorrido; screenshot 1440 muestra gran espacio lateral sin mejorar la tarea. | Diseñar composición de escritorio dentro de Laboratorio creativo; no ampliar el marco común sin acordarlo en I3. |
| P2 — Feedback hover ausente | app.css:33; al pasar ratón sobre Ver mi plan se mantienen background/color/border/shadow/transform idénticos en ambos perfiles. Foco global sí existe. | Añadir estados de interacción coherentes; no sustituir foco por hover ni animar todo el formulario. |
| P2 — PNG cumple contrato pero aporta poca composición | browser/wallpaper.ts:28 dibuja fondo uniforme, etiqueta y frase centrada. PNG 1179×2556 observado; estructura plana fiel a la ficha actual. | Proponer composición estática con identidad y jerarquía, conservando frase literal/zona útil; no vídeo, IA o dependencias. |

Las alturas corresponden al ejemplo completo, frente a otros estados medidos
en I1: no se interpreta su diferencia como una regresión de código. Son una
lectura de fricción, no evidencia de abandono, retención o duración humana.
Se observan cero errores de página, peticiones externas y overflow horizontal en
estos dos perfiles. Se conservan puntos fuertes: entradas etiquetadas, foco al
título, tema/tokens/fuentes locales, texto íntegro, ejemplo y consentimiento.
Se descartan falsos positivos genéricos sobre paste/newlines, filter/gris,
truncado, URL con estado y handlers de teclado redundantes en botones nativos.

### Aislamiento y verificación

La primera compilación detecta una integración defectuosa: Tailwind explora las
referencias de .agents y añade **4182 B** al CSS común, de 34923 a 39105 B,
alterando su hash y los HTML que lo enlazan. Se corrige con una exclusión explícita
`@source not '../../.agents'` en global.css. Es el único ajuste de compilación:
no cambia reglas visuales o funcionales. El build posterior vuelve a producir
los **23 archivos públicos idénticos, byte por byte, a la referencia I1**; skills,
configuración y motor no se sirven. Package/lockfile, componentes, dominio,
pruebas de producto, scripts de entrega y workflows se conservan. Esta incidencia
justifica comprobar la salida real aunque los archivos nuevos sean de desarrollo.

Tipos (118 archivos, cero errores/avisos), lint, formato, hosting, build e
integración modular pasan. La comparación de hashes y estos resultados se
registran en i2-checks.json. El comprobador documental recorre 121 Markdown y
737 referencias locales: queda un falso positivo inspeccionado en la plantilla
upstream document.md, donde interpreta el ejemplo oklch(...) como URL. No es
un destino real; los enlaces reales de la integración están resueltos. No se
modifica la referencia upstream para complacer ese parser. sh -n de ambos
lanzadores y diff --check satisfactorios. Se conserva la deuda previa y PEND-001 abierto;
no se repite toda la regresión funcional por un tooling sin cambio de runtime.
Logs/capturas/binario permanecen fuera del entregable; el JSON conserva condiciones
y hashes mínimos de evidencia. No hay CI/staging nuevos por la restricción de
entrega local del propietario.

| Salida | Resultado |
| --- | --- |
| FE-I2-01 | **Pendiente:** descubrimiento/invocación nativos no observados. No se cierra I2 ni se declara alternativa manual aprobada. |
| FE-I2-02 | Comprobado para el perfil acotado: contexto/adaptación, procedencia/licencias, config, motor/checksum, caché y efectos; sin automatización ni dependencias de producto nuevas. |
| FE-I2-03 | Comprobado por aplicación manual declarada y navegador: hallazgos útiles y contrato preservado; salida pública idéntica tras excluir las referencias del escaneo Tailwind. |

I3–I7 no se han iniciado. FE-01 permanece En curso y todo el nuevo trabajo queda
local, con el bloqueo y la comprobación siguiente explícitos.

### Cierre posterior de I2 con alcance explícito aceptado

Después de explicar que las copias y el motor están instalados/probados pero el
cliente no los descubre automáticamente, se propone cerrar I2 con uso manual
explícito y registrar esa limitación. El propietario pide identificar las skills;
se concretan Impeccable 4.9.2 y Web Design Guidelines de Vercel. Responde «vale,
usalas para continuar con la iteraicón 3». Se registra su aceptación de ese
alcance alternativo y autorización de preparar I3. H-008 y el plan actualizan
FE-I2-01/FE-AC-02; el bloqueo anterior queda resuelto para el perfil aceptado,
sin declarar carga automática ni compatibilidad de otros clientes. FE-I2-01/02/03
comprobados en ese alcance; I2 completada. PEND-001 se resuelve para el uso
explícito de estas dos ayudas. Las restricciones de red, caché, permisos y
entrega local permanecen, y la futura dirección de I3 sigue pendiente de revisión.

## I3 — Dirección, recorrido y contrato para revisión

### Propuesta y alcance

El propietario solicita «vale, usalas para continuar con la iteraicón 3» tras
identificar las dos skills y resolver el alcance explícito de I2. Se aplica
Impeccable 4.9.2 de forma manual, leyendo su adaptación, Operate, shape/new-work
y craft-floor; el motor context/engine-probe verificado responde. Vercel aplica
el snapshot 434b7f91364665f2f733b310ec54809bf8f37937 y la matriz contextualizada.
Método de un solo contexto, sin subagentes o crítica independiente atribuida.
Las preguntas de propósito/alcance ya están resueltas por el usuario y FE-01;
la dirección se presenta para su aprobación al terminar esta preparación.
No se ejecutan las fases upstream de catálogo, generación, delegación o creación
de PRODUCT.md/DESIGN.md; prevalecen H-008, ADR-MMA-022 y la entrega concreta de I3.

[ADR-MMA-023 Propuesta](../../design-docs/plan-b-frontend-proposal.md) especifica
«El plan toma forma»: propósito → obstáculo → situación → acción → resultado;
primera pregunta directa, sugerencias contextuales, vista previa lateral en
escritorio y compacta en estrecho, calendario posterior al resultado, movimiento
de estado breve y nueva composición PNG estática. Se conservan identidad, ES/EN,
temas, textos literales, generadores y presupuesto de 50 KiB del futuro producto.

Se prepara la decisión material con estados, excepciones, copia ES/EN en el
prototipo, restauración determinista conservando esquema/clave v1, calendario
con borrador local y confirmación válida, y presentation focused opcional/default
standard para el marco compartido. Esta última no se añade al descriptor ni a
las rutas durante I3. La ficha v06 sigue Aprobada y vigente; solo enlaza la
propuesta pendiente. La nueva dirección requiere aprobar los cambios de copia,
gris/sello, recorrido, composición y restauración antes de implementar I4/I5.

### Entregable visible

[Índice de revisión](../../review/fe01/README.md), con prototipo de fuentes
separadas y HTML autónomo de un único archivo. Este último incorpora fuentes,
SVG de marca y avisos OFL, y funciona offline desde file://. Se genera con
build-standalone.mjs de forma manual, sin dependencias, hooks o publicación.
Se conservan seis imágenes mínimas: inicio/resultado en escritorio ES claro y
estrecho EN oscuro, PNG real normal claro y máximo oscuro. El manifiesto identifica
base, hashes de fuentes/capturas, condiciones y pruebas; los logs/matriz completa
permanecen fuera del repo. La cabecera/pie son representativos: no se propone
retirar navegación global o controles; I4 integrará el componente real.

El prototipo permite escribir, sugerencias, Otro, Atrás, editar, cambiar idioma/
tema, máximo y reset, generar/descargar PNG, abrir calendario, validar hora/días,
ver consentimiento/Cancelar/Escape y previsualizar compartir. Las acciones de
calendario/compartir se identifican como propuesta: no generan .ics, abren Google,
copian enlaces o envían datos. No hay persistencia. No se usa como prueba de
sesiones reales, share-file nativo, móvil físico, recorte/reloj o importación.

Se consulta la skill cloud-desktop solo para facilitar la revisión visible:
el entorno anuncia escritorio on-demand, pero esta sesión no ofrece herramientas
cua/js, open_in_codex u open_cloud_preview. No se anuncia un escritorio abierto
ni un enlace localhost accesible desde el equipo del usuario. El HTML autónomo
resuelve la presentación revisable sin desplegar un sitio o instalar otro cliente.

### Comprobaciones y hallazgos

Playwright/Chromium 156.0.8078.4, fecha sintética 2026-11-17 12:00 Europe/Madrid,
locale nativo en-US. ES/EN × claro/oscuro, 1440×900 y 393×851: cuatro perfiles,
16 capturas de propósito/situación/acción/resultado y ocho PNG normal/máximo.
Sin overflow horizontal, errores de página o peticiones externas. La acción de
cada pregunta ordinaria queda dentro del viewport de estos perfiles en el
prototipo; no acredita el encaje final en la cabecera real o con teclado móvil.
Enlace de condición/tamaño real en el manifiesto, no tiempo de finalización humano.

Se prueban errores de longitud y pegado con saltos sin cambiar/truncar entradas,
Otro y su foco, avance/Atrás/edición, conservación literal entre idiomas, PNG
1179×2556 con máximos íntegros en la zona propuesta, validación de calendario,
consentimiento/Cancelar/Escape sin envío y contexto aislado. Axe encuentra cero
incidencias en los cuatro resultados; no certifica accesibilidad global.
Se corrigen dos hallazgos iniciales del prototipo: nombre accesible del selector
de idioma que no contenía EN/ES y aviso de revisión fuera de un landmark.

Además: reflujo a 320 px, Enter/Tab/foco, texto con marcado mostrado literalmente,
emoji compuesto preservado, reduced-motion sin animación, variante normal con
animación de estado y HTML autónomo desde file:// con red offline. Un fallo
inyectado de canvas conserva frase y permite reintentar desde Guardar; se comprueba
la descarga posterior. Días vacíos enfocan el primer control y no simulan éxito;
resumen singular/plural revisado. No se afirma zoom nativo 200 %, lector de
pantalla real, persistencia, duración de dos minutos o evaluación por otras personas.

El detector Impeccable del prototipo devuelve 11 advertencias (incluida duplicación
de la versión autónoma): 2 tiny-text, 7 overused-font y 2 cream-palette. Se corrige
el aviso de revisión de 10 a 12 px y se regenera el autónomo; el resultado calculado
se comprueba, sin repetir el detector por trámite. Las otras 9 se corresponden
con Space Grotesk/fondo cálido de la identidad aprobada, que se conserva conforme
a FE-M11; no son permiso para cambiar marca. No se ocultan warnings o se declaran
como cero. El detector complementa la revisión visual; no otorga aprobación.

### Aislamiento y salida

El prototipo y sus artefactos viven en docs/review/fe01. Se excluye su carpeta del
descubrimiento Tailwind, siguiendo el aislamiento comprobado en I2, y se declara
el entorno browser/Node de sus dos scripts en ESLint para revisarlos sin relajar
las reglas del producto. El build final detecta que el manifiesto de revisión
añadía una regla adicional de transiciones de 477 B; se amplía la exclusión a toda la carpeta
de evidencia de FE-01 y se repite la comparación. El empaquetado normaliza CRLF y
espacios finales de los avisos OFL conservando su texto/licencia.
Componentes, dominio, almacenamiento, generadores,
registro, rutas, package/lockfile y workflows del producto siguen sin cambios.
Tipos/lint/formato/hosting/build e integración modular satisfactorios; lint/formato
dirigidos se repiten tras el ajuste final de acciones del prototipo. Los 23 archivos
públicos coinciden byte a byte con I1, sin material de revisión servido. Manifiesto
de fuentes/imágenes verificado; 123 Markdown y 762 referencias locales revisadas,
con el único falso positivo conocido de la plantilla upstream oklch(...), sin
enlaces reales rotos. Diff --check satisfactorio antes del commit local. No se reclama una nueva
regresión completa de 504 unitarias/19 componentes/146 E2E para esta propuesta.

I3 queda preparada **pendiente de aprobación de dirección/contrato**, con FE-I3-03
propuesto al propietario. FE-I3-01/02 no se marcan satisfechos antes de su revisión;
I4/I5 no iniciadas. FE-01 sigue En curso; misma rama y commits por iteración,
sin push, nueva PR, merge o acciones de publicación.

### Aprobación y cierre de I3

El propietario responde «Vale, si, la apruebo» después de presentar prototipo,
capturas y contrato y preguntarle si aprobaba la dirección y el paso a I4. Se
registra aprobación completa del paquete ADR-MMA-023, incluida restauración v1
y focused opcional, actualización de ficha a v07 y cierre FE-I3-01/02/03. La misma
respuesta autoriza I4 en el contexto de esa pregunta. No acepta implementación
por adelantado, pruebas físicas, FE-01 o PB-01. La entrega sigue solo local.

## I4 — Recorrido guiado en la aplicación real

### Implementación y alcance

Se aplica el contrato aprobado en ADR-MMA-023/ficha v07: primera pregunta directa,
cuatro decisiones visibles, ayudas/sugerencias opcionales, Atrás, ejemplo,
progreso y frase en construcción. Escritorio utiliza pregunta y vista previa en
columnas; en estrecho la pregunta/acciones van antes de la vista previa. Conserva
Laboratorio creativo, fuentes/tokens locales, cabecera/pie, temas y rutas ES/EN.
Movimiento finito de 180 ms por pregunta y 240 ms al resultado, sin bloquear
acciones; con movimiento reducido los estados aparecen de inmediato. Se retiran
gris/sello conforme al contrato nuevo, sin modificar el movimiento del hero.

Las vistas situación/acción solo viven en memoria: se mantienen clave y esquema
v1, incluidos los pasos canónicos. La restauración del `plan` antiguo distingue
situación válida/incompleta y nunca infiere resultado por tener acción. Se
conservan los campos literales y horarios antiguos incompletos. La fecha se
captura al primer cambio real/ejemplo; navegar una sesión antigua sin narrativa
captura la fecha antes de persistir otro paso. Reset solo afecta a la clave de
Plan B; siguen los avisos y el modo memoria si falla el almacenamiento.

El calendario pasa a un desplegable opcional después del resultado. Su borrador
local conserva hora/días al cerrar y reabrir; solo confirma conjuntamente un
horario válido y rechaza badInput nativo. Recargar recupera la última preparación,
sin sobrescribirla con una edición inválida. Las acciones de exportar calendario
se ocultan mientras el borrador está modificado para evitar exportar otro horario.
Una sesión v1 con calendario incompleto puede ver su frase sin borrar ese horario;
permanece canónicamente en `plan` hasta confirmar datos válidos. Imagen, compartir,
consentimiento Google y generadores conservan sus garantías anteriores.

El descriptor admite `presentation` opcional standard/focused conforme al contrato
aprobado. Solo Plan B y la fixture B optan por focused; ausente/standard mantienen
el marco habitual y no emiten el atributo focused. Su validación rechaza valores
ajenos sin cargar interfaces. Las pruebas de integración comprueban ambas opciones.

El CSS propio se incorpora como texto estático desde entry.astro mediante la
opción existente de Vite `?inline`, servido antes de hidratar y solo en la ruta de
la herramienta. Se elimina su carga innecesaria desde el catálogo. Los textos de
calendario y el interpolador puro se separan de los diccionarios de UI: las
funciones de navegador ya no arrastran ambas traducciones completas. No cambian
package/lockfile, dependencias, workflows, hosting, secretos o esquema persistido.

**I5 sigue pendiente:** I4 solo integra funcionalmente el calendario en el resultado.
El diseño final del resultado, la jerarquía de guardar y la composición nueva del
PNG no se presentan como entregados. Tampoco se anticipan I6/I7 o la aceptación PB-01.

### Observación de navegador y skills

Uso explícito/manual de Impeccable 4.9.2, motor fijado 0.1.25, y adaptación local de
Vercel con reglas 434b7f91364665f2f733b310ec54809bf8f37937. Contexto canónico,
Operate/craft-floor y reglas pertinentes leídos; detector sobre src/miniapps/plan-b:
cero hallazgos. Revisión de **un solo contexto, no independiente**; el detector
vacío no acredita calidad. Se revisan código, foco/teclado y capturas reales.
Se actualizan las adaptaciones/matriz para retirar la excepción histórica del gris
tras ADR-MMA-023, manteniendo sus hashes y la procedencia upstream sin actualizar
versiones, activar hooks o delegar trabajo.

20 estados capturados (cinco vistas × dos tamaños × ES/claro y EN/oscuro), con
Chromium 156.0.8078.4, fecha sintética 2026-11-17, zona Europe/Madrid y fuentes
listas. Cuatro capturas mínimas conservadas, cada una < 300 KB, con
[manifiesto de contenido](../../review/fe01/i4/manifest.json) y
[paquete visual](../../review/fe01/README.md#i4--recorrido-en-la-aplicación-real).
La revisión visual confirma jerarquía de pregunta, ejemplo identificado,
continuidad de frase, estado oscuro y separación de acciones/vista previa.

| Perfil | Propósito | Obstáculo | Situación | Acción | Alto del viewport |
| --- | ---: | ---: | ---: | ---: | ---: |
| ES/claro 1440 | 643,4 | 710,0 | 771,0 | 771,0 | 900 |
| ES/claro 393 | 634,2 | 713,0 | 746,0 | 746,0 | 851 |
| EN/oscuro 1440 | 688,2 | 665,2 | 745,4 | 771,0 | 900 |
| EN/oscuro 393 | 670,0 | 721,8 | 746,0 | 746,0 | 851 |

Valores en píxeles: borde inferior de la acción principal, o grupo de obstáculos,
con scroll al inicio y ejemplo normal. Las cuatro preguntas permiten avanzar sin
scroll en estos perfiles; el resto del documento puede superar el viewport.
No se exige ni se simula cero scroll con todos los máximos, ayudas abiertas,
zoom o teclado virtual. No hay overflow horizontal en los estados capturados.
La composición del resultado sigue pendiente de I5; no se mide como pregunta.

### Recursos del candidato

JS propio **31588 B** (_astro/App.CRcZ6Wje.js) + CSS propio inline **7920 B** =
**39508 B / 38,58 KiB**, bajo 50 KiB y 3395 B menos que la referencia I1 (42903 B).
Runtime React/client compartido **220745 B**, sin cambio; CSS común **34900 B**,
23 B menos por eliminación del token generado no utilizado radius-panel, sin
cambiar la definición de tokens. Estos recursos compartidos se informan aparte,
no se ocultan dentro del presupuesto propio.

| Ruta | Peticiones frías | Bytes brutos | Suma gzip estimada | Solicitudes externas |
| --- | ---: | ---: | ---: | ---: |
| /es/ | 4 | 196157 | 151492 | 0 |
| /en/ | 4 | 196081 | 151436 | 0 |
| 404 real | 4 | 193865 | 151004 | 0 |
| /es/apps/plan-b/ | 7 | 474715 | 240130 | 0 |
| /en/apps/plan-b/ | 7 | 474337 | 239825 | 0 |

[Detalle por recurso](../../review/fe01/i4/resources.json), contexto nuevo por ruta,
loopback, viewport 1440×900 y movimiento reducido. Gzip es una estimación sobre
cuerpos completos, no transferencia real. El catálogo no solicita JS/CSS propio
ni hidrata Plan B. El total de página Plan B crece ligeramente frente a I1 por
HTML/copy del recorrido y vista previa, aunque se reduce el JS/CSS propio; no se
presenta el presupuesto de 50 KiB como peso total. No se miden aquí INP, retención,
tiempo humano o rendimiento de producción; la comparación global final es I7.

### Verificación y cierre local

`npm run verify` completo satisfactorio con Node 24.22.2/npm 11.19.1,
Playwright 1.64.1/Chromium 156.0.8078.4:

* Astro check: 125 archivos, cero errores/avisos; lint, formato y hosting offline satisfactorios.
* Vitest: **518 unitarias** y **21 componentes**, sin omisiones nuevas.
* Navegador: **152 E2E** satisfactorios en Chromium escritorio y viewport móvil,
  incluyendo exportaciones reales offline, Google/consentimiento, texto máximo,
  diez ciclos de URLs/canvas, almacenamiento, idioma, teclado/foco, reflujo,
  accesibilidad y regresión de plataforma.
* Integración modular: fixture A sola y A+B, **2/4 pruebas de módulo**, build
  aislado, traducción incompleta rechazada, estándar/focused solo por opción;
  fuentes y build públicos preservados, sin fixtures/borradores publicados.

Casos nuevos relevantes: restauración v1 y payload literal, navegación con doble
clic/Enter sostenido, primera edición al cambiar el mes sin robar foco, calendario
nativo parcial sin sobrescribir el preparado y confirmación atómica del borrador.
Se conservan los controles offline/privacidad y los casos de plataforma. Se
adaptan las aserciones de gris/sello al contrato aprobado; no se silencian tests
para obtener verde. Reflujo cubre 320/393/768/1280/1440 px y tamaño CSS duplicado,
no zoom nativo móvil o compatibilidad física.

Durante la adaptación de pruebas se detectó recursión accidental en el helper de
llegada al resultado, corregida; el navegador identificó además un botón Atrás de
46 px de ancho, corregido a mínimo 48 px. La batería dirigida pasó después
(**44 E2E**); la verificación final completa anterior corresponde al código con
esas correcciones y la recuperación de sesión antigua sin narrativa. Una primera
ejecución final se detuvo en formato de un test, corregido antes de repetir verify.

FE-I4-01/02/03 comprobados localmente. I4 completada; FE-01 sigue **En curso**, con
I5–I7 pendientes. No hay aprobación anticipada del acabado, CI/staging de este
candidato, pruebas físicas, medición de dos minutos ni aceptación PB-01. La
entrega permanece en la rama estable con commit local; **sin push, PR o publicación**.

Cierre documental: 123 Markdown/771 referencias locales revisadas, sin enlaces
reales rotos; se conserva el falso positivo conocido del ejemplo oklch(...) de la
referencia upstream. Integridad de skills/capturas/manifiesto y diff --check
satisfactorios. Un build posterior a la documentación reproduce byte a byte los
23 archivos públicos identificados en el manifiesto del candidato.

## I5 — Resultado y PNG con acabado de producto

### Implementación local

El propietario solicita «Vale, vamos a continuar con la siguiente iteración» tras
la entrega I4 d33f55b. Se registra autorización/inicio de I5 en la rama estable,
con composición ADR-MMA-023 aprobada y sin escrituras remotas.

Resultado en dos columnas en escritorio: frase completa y propósito, guardar y
editar primero; el PNG real a la derecha. En estrecho las acciones preceden a la
imagen. Calendario y compartir se abren mediante desplegables; compartir explica
que envía un enlace limpio, sin frase/horario. El aviso sobre el contenido privado
del PNG permanece junto a guardar. La edición vuelve a acción, con foco y texto
conservados. El resultado reutiliza la preparación, consentimiento y liberación
de recursos existentes, sin crear otro renderer para su vista previa.

Guardar se mantiene visible/deshabilitado durante preparación o envío. Ante fallo
de generación, el plan sigue legible/editable y ofrece reintento. Ante un fallo
del menú de compartir archivos se abre la ayuda con descarga directa y vista de
imagen; la descarga alternativa no vuelve a invocar ese menú. Cancelar conserva
el tratamiento discreto, sin anunciar éxito o error alarmante. Las instrucciones
no prometen que todos los navegadores/SO permitan la misma acción.

PNG estático fijo 1179×2556, misma familia y paleta locales, alineado a la izquierda,
con etiqueta/frase/línea de continuidad dentro del 32–72 % de alto y margen lateral
del 10 %. Dos arcos en la parte inferior, fuera del texto; sin reloj, logo o URL.
El layout reserva también la línea y su trazo dentro de la zona segura. Mantiene
ajuste por palabras/grafemas, texto íntegro sin elipsis y fuente entre 4–7 % del
ancho. La ausencia de la fuente local produce error recuperable en lugar de
generar silenciosamente otra composición con una fuente de sustitución; CJK/emoji
conservan sus glifos de respaldo del navegador. Canvas se libera incluso al fallar.
No se añade editor, selector de estilos, dependencia, recurso remoto o servicio.

### Revisión visual y límites

Impeccable 4.9.2/motor 0.1.25 y reglas Vercel
434b7f91364665f2f733b310ec54809bf8f37937, uso explícito/manual de **un solo contexto,
no independiente**. Fuentes canónicas, Operate, comp/craft-floor y reglas pertinentes
leídas. La primera invocación context con --target fue rechazada por la interfaz
acotada del adaptador; se corrigió a context sin argumentos, sin modificar sus
permisos. Los avisos upstream sobre PRODUCT/DESIGN, hooks, talleres y subagentes
se resuelven con la adaptación H-008; no se crean esas autoridades o capacidades.
Detector final del módulo: cero hallazgos; revisión real de código y navegador,
no certificación por un detector vacío.

Capturas del recorrido y resultado ES/claro y EN/oscuro, 1440×900 y 393×851.
Se inspecciona además el PNG real claro del ejemplo y oscuro con máximos de
80/90/90 puntos de código, CJK, emoji familiar unido y modificadores de piel.
Se comprueba la frase literal dibujada y límites de tinta medidos con el canvas
real: ejemplo 946,5–1632,0 px; máximos 849,9–1754,4 px, dentro de 817,92–1840,32 px.
Los máximos usan once líneas frente a seis del ejemplo. El botón de guardar del
ejemplo ES/escritorio termina a 707,1 px en un viewport de 900; con máximos y
viewport estrecho se permite scroll natural, sin ocultar texto ni bloquear zoom.
No se atribuye una medición de dos minutos o retención a estos resultados.

Se conservan cuatro imágenes mínimas para la revisión del propietario (dos UI y
dos PNG, cada una <300 KB), con [manifiesto](../../review/fe01/i5/manifest.json) y
[paquete visual](../../review/fe01/README.md#i5--resultado-y-png-reales). Datos
sintéticos, Chromium 156.0.8078.4, Playwright 1.64.1, reloj 2026-11-17 y zona
Europe/Madrid, movimiento reducido. No son teléfonos físicos, menú nativo probado,
reloj real o recorte del SO. La compatibilidad física de PB-01 sigue pendiente.

### Recursos frente a I1/I4

JS propio **33552 B** + CSS inline propio **8671 B** = **42223 B / 41,23 KiB**,
bajo el presupuesto de 50 KiB: +2715 B frente a I4 y −680 B frente a I1. Runtime
React/client **220745 B** y CSS común **34900 B**, sin cambios frente a I4. Las
portadas y 404 mantienen los mismos recursos/bytes que I4; no cargan CSS/JS de
Plan B ni material de revisión o skills.

| Ruta | Peticiones frías | Bytes brutos | Suma gzip estimada | Solicitudes externas |
| --- | ---: | ---: | ---: | ---: |
| /es/ | 4 | 196157 | 151492 | 0 |
| /en/ | 4 | 196081 | 151436 | 0 |
| 404 real | 4 | 193865 | 151004 | 0 |
| /es/apps/plan-b/ | 7 | 477801 | 240861 | 0 |
| /en/apps/plan-b/ | 7 | 477418 | 240552 | 0 |

[Detalle por recurso](../../review/fe01/i5/resources.json): carga inicial, contexto
nuevo por ruta, loopback y sin throttle. Gzip estimado sobre los cuerpos completos,
no transferencia real. Los PNG generados tras responder son blobs locales y no
forman parte de esa carga inicial: 161467 B el ejemplo y 141647 B los máximos de
las capturas. Lienzo fijo de 3013524 píxeles, igual que la base; no se escala por
DPR o tamaño de pantalla. Estas cifras no sustituyen la evaluación global de
rendimiento/memoria/deuda de I7 ni acreditan rendimiento de producción.

### Verificación y cierre local

`npm run verify` completo satisfactorio sobre el candidato capturado, Node
24.22.2/npm 11.19.1: Astro check (125 archivos, cero errores/avisos), lint, formato,
hosting offline, **518 unitarias**, **21 componentes**, **154 E2E** Chromium
escritorio/viewport móvil e integración modular. Fixtures A/A+B: 2/4 pruebas;
fuentes/build públicos sin alteraciones por el harness, 23 archivos públicos,
traducción incompleta rechazada y fixtures/borradores ausentes. La batería dirigida
previa pasó con **54 E2E**; no hubo fallos funcionales que exigieran corregir el
candidato después de esa ejecución. No se sustituyen CI o staging por estos logs.

Se conservan descarga real PNG/.ics offline, cancelación/error de compartir,
enlace limpio y copia manual, Google solo después del consentimiento, fuente/canvas
indisponibles, reintento, texto máximo, contraste, foco, navegación/edición y diez
ciclos de exportación/reset con liberación de URLs/canvas. Nuevas comprobaciones:
PNG alineado a la izquierda con todos los caracteres, continuidad dentro de zona
segura, descarga alternativa sin repetir un share fallido, recuperación de fuente
local ausente y cambio de tema con PNG real regenerado y sesión intacta. Reflujo
320/393/768/1280/1440 y tamaño CSS duplicado siguen satisfactorios, sin inferir
compatibilidad física o zoom nativo por esas pruebas.

FE-I5-01/02/03 comprobados localmente; I5 completada. FE-01 permanece **En curso**;
I6 (revisión del acabado por el propietario) e I7 (última regresión/análisis global)
siguen pendientes. No se acepta anticipadamente el producto/PB-01 ni se publica el
candidato. Misma rama, commit por iteración, **sin push o PR**.

Cierre documental: 123 Markdown/782 referencias locales comprobadas; sin enlaces
reales rotos, conservando el falso positivo conocido del ejemplo upstream
oklch(...). Hashes de fuente, build, capturas y skills comprobados; diff --check
satisfactorio. El build posterior a la documentación reproduce byte a byte los
23 archivos públicos del manifiesto, sin añadir recursos por el texto del informe.

## I6 — Pulido y revisión del acabado

### Autorización y hallazgos

El propietario solicita «Vale, continua con la proxima iteración» tras la entrega
I5 32a17aa. Se inicia I6 en la misma rama, con revisión técnica/renderizada y
preparación de una entrega concreta. Esa instrucción autoriza el trabajo; la
aprobación del acabado se recogerá después de presentarlo, conforme al plan.
No se inicia I7 ni se escribe en el remoto.

Impeccable 4.9.2/motor 0.1.25 y adaptación Vercel, reglas
434b7f91364665f2f733b310ec54809bf8f37937. Lectura explícita de fuentes canónicas,
Operate/polish/craft-floor y reglas pertinentes; context ejecutado mediante el
adaptador local. **Un solo contexto, sin revisión independiente ni subagentes.**
Los avisos upstream no autorizan init/document, hooks, catálogo o nuevas fuentes.
Se respeta la identidad, texto literal/pegado, esquema v1 y política del hero.

| Hallazgo | Evidencia anterior / impacto | Corrección y comprobación |
| --- | --- | --- |
| FE-I6-F01, P2: calendario sin explicación ni resumen preparado | ExportPanel/ScheduleEditor: panel real sin cuatro semanas, días/hora confirmados o dependencia de avisos; información aprobada presente en el prototipo y textos de la ficha, ausente en la UI. | Se traslada la ayuda aprobada I3 y se recupera el resumen localizado con las claves existentes. Resumen únicamente del horario confirmado; se oculta junto a exportar al modificar el borrador. ES/EN, laborables/todos/día individual y descarga .ics comprobados. |
| FE-I6-F02, P3: vista previa con espacios mal identificada | PlanPreview: situación de tres espacios y acción vacía mostraban «Tu plan va tomando forma» sobre frases de ejemplo. | Derivar etiqueta/color/texto de las frases recortadas visualmente; no cambiar el contenido persistido. Dos pruebas de componente verifican ejemplo identificado y borrador literal conservado. |
| FE-I6-F03, P2: doble descarga por un doble clic | ExportPanel: un dblclick nativo en guardar despachaba dos descargas PNG en vez de una. El guard de promesas no cubría la vía síncrona de descarga. | Ignorar el segundo clic del mismo gesto y Enter repetido en controles de exportación; sin temporizador/debounce, esquema nuevo o bloqueo de una nueva pulsación. Se verifica PNG, calendario y exportación intencional posterior con descargas reales. |

Son defectos locales dentro del contrato aprobado, sin elección de stack,
persistencia, seguridad, calendario o interfaz compartida nueva. No se cambia la
composición PNG ni se añaden efectos o funciones. Se revisa el diff para conservar
el alcance y evitar abstracciones o limpieza ajenas a estos hallazgos.

### Revisión renderizada y paquete del propietario

Ocho recorridos adicionales en Chromium 156.0.8078.4/Playwright 1.64.1: ES/EN,
claro/oscuro, 1440×900 y 393×851. Cuatro con clics en claro y cuatro mediante
Tab/Enter en oscuro; movimiento normal en ancho y reducido en estrecho. Se
comprueban foco visible al tabular, primer error, frases cortas y un caso máximo
80/90/90 con CJK/emoji compuestos, edición y sesión idéntica al volver, hora vacía,
resumen preparado, apertura y Cancelar/Escape de Google. Sin overflow horizontal,
peticiones externas o errores de página observados. Es revisión asistida por el
agente en navegador, no una prueba humana ni todos los cruces posibles de motores,
dispositivos o métodos de entrada.

Dos capturas nuevas mínimas muestran calendario preparado ES/claro y error con
foco EN/oscuro en estrecho, cada una <300 KB. El control horario usa el formato
nativo de Chromium (en-US en este contexto), mientras el resumen usa el idioma
de la ruta. Se regeneran los PNG claro normal y oscuro máximo: coinciden byte a
byte con I5 y se reutilizan, sin duplicar imágenes. Conservan texto literal y zona
de tinta: 946,5–1632,0 y 849,9–1754,4 px respectivamente. El detector final del módulo
no produce hallazgos; no se atribuye calidad o aprobación humana a ese resultado.

[Paquete concreto de revisión I6](../../review/fe01/i6/README.md), con recorrido,
resultado, PNG real y calendario; [manifiesto del candidato](../../review/fe01/i6/manifest.json)
con contenido, condiciones y ocho recorridos. No hay participantes externos ni
medición de primeras visitas en 120 s; ambos son complementos opcionales, no un
bloqueo. Teléfonos físicos, compartir nativo y fondo bajo reloj/recorte siguen
pendientes en PB-01, sin inferirlos de un viewport de Chromium.

### Recursos del candidato

JS propio **34599 B**, CSS inline **8671 B**: **43270 B / 42,26 KiB**, bajo 50 KiB.
+1047 B frente a I5, +367 B frente a I1; CSS y runtime compartidos no cambian
(34900 B y 220745 B). Catálogo ES/EN y 404 conservan recursos/bytes de I5, sin cargar
Plan B o material de skills/revisión. Siete peticiones iniciales en Plan B y cero
externas: ES 478995 B brutos/241104 B gzip estimado; EN 478611/240777 B.
[Detalle de recursos](../../review/fe01/i6/resources.json), contextos nuevos y
loopback; gzip de los cuerpos, no transferencia real. No es una comparación de
rendimiento de producción ni la regresión global/memoria/deuda reservada para I7.

### Verificación técnica y aprobación pendiente

`npm run verify` completo satisfactorio: Astro check (125 archivos, cero
errores/avisos), lint/formato, hosting offline, **518 unitarias**, **25 componentes**,
**156 E2E** e integración modular. Las fixtures A/A+B pasan sus 2/4 pruebas;
fuentes/build públicos preservados, traducción incompleta rechazada y fixtures
fuera de los 23 archivos públicos. Batería dirigida previa: **64 E2E**. Se conservan
calendario offline, consentimiento/privacidad, fallos/recuperación, diez ciclos de
recursos, sesiones/meses, reflujo/contraste y regresión de plataforma. La primera
verificación completa se detuvo en dos opciones exact no admitidas por el tipo de
React Testing Library en pruebas nuevas; se retiraron antes de esta ejecución,
sin cambiar el runtime que ya pasó la batería dirigida.

FE-I6-01/02 siguen pendientes del propietario. FE-I6-03 tiene candidato identificado
y comprobaciones técnicas preparadas; el freeze para I7 se confirma al aprobar el
acabado, o se actualiza si el propietario solicita correcciones. No se registra
aceptación por inferirla de «continúa» antes de presentar esta revisión. FE-01 sigue
**En curso**, I6 preparada para aprobación e I7 sin iniciar. Sin push, PR, CI o
staging de este candidato; la verificación local no sustituye la última etapa.

Cierre documental: 124 Markdown/800 referencias locales comprobadas, sin enlaces
reales rotos; se conserva el falso positivo conocido del ejemplo upstream
oklch(...). Integridad de fuente, skills, capturas y PNG reutilizados verificada;
diff --check satisfactorio. El build posterior a la documentación conserva byte
a byte los 23 archivos públicos del candidato, listo para la revisión del propietario.

### Aprobación y cierre de I6

El propietario responde «aprobado, continua con la siguiente» a la pregunta de
aprobar el acabado presentado, cerrar I6 y comenzar I7. Se completan FE-I6-01/02/03
y se congela el runtime de 7f027f3 con los hashes del manifiesto I6. I7 queda
autorizada, sin aceptar anticipadamente su resultado, PB-01, CI o staging.
Fetch de origin/staging: e4b42f121674a24aacc4a3add473111bc7e36c34, ancestro del
candidato; 7 commits locales por delante y ninguno nuevo que integrar.

## I7 — Regresión y análisis global

### Candidato, alcance y estado de entrega

El propietario aprueba I6 mediante «aprobado, continua con la siguiente» y autoriza esta última iteración. La aprobación del acabado sobre 7f027f3 queda registrada en 2863fae. I7 se reanuda el 2026-11-18, corrige una espera de codificación PNG y congela el candidato funcional **2d213dd863d5efd49645b81fa80398adfa8295aa**, en la misma rama feature/fe01-frontend-quality. No añade funciones, cambia el contrato aprobado o altera la composición revisada.

**Regresión local satisfactoria; excepción de dependencias aprobada.** Tras la revisión del riesgo, el propietario acepta el 2026-11-18 la [excepción acotada](security-review.md) como deuda no bloqueante con revisión periódica. PEND-007 permanece abierto; próxima revisión mensual objetivo 2026-12-18. No se ha hecho push ni abierto una PR nueva, y no hay CI o staging del nuevo candidato. I7 y FE-01 permanecen En curso; no se atribuye al candidato el CI o despliegue de una revisión anterior.

[Análisis estructurado I7](../../review/fe01/i7/analysis.json): identidad y huella de fuentes, manifiesto de los 23 archivos públicos, condiciones, medianas/rangos, recursos, muestras PNG, memoria, invariantes y auditoría. El código fuente se identifica por el commit funcional; el posterior commit documental no cambia ese runtime. La base es 1b204633ddd0ad782096d5377a3ee1c35d05c796, árbol af9deb7d47fb9bd86dea690467f54577f3b214b7: los 23 archivos públicos archivados coinciden con los hashes de I1. La lectura remota del 18 de noviembre mantiene staging en e4b42f121674a24aacc4a3add473111bc7e36c34, ancestro de la rama; no hay trabajo remoto nuevo que integrar.

### Revisión del diff y regresión técnica

Se contrasta el diff completo con I1, las fuentes funcionales con ficha v07/ADR-MMA-023 y las normas/skills con ADR-MMA-022/H-008. No cambian package/lockfile, workflows, despliegue/promoción, componentes/layouts/i18n compartidos, apariencia/movimiento o archivos públicos. Fuera de Plan B, el runtime solo incorpora el contrato focused opcional aprobado y las exclusiones de Tailwind para material de desarrollo/revisión. Las demás miniapps conservan la presentación por defecto.

Se preservan los generadores de calendario, validación, narrativa, persistencia, enlaces Google y exportaciones del dominio. Cambian intencionalmente el flujo, composición del wallpaper y controlador de pasos. La copia ES de calendario coincide con la base aunque ahora se carga desde diccionarios pequeños. No hay tests de Plan B omitidos o restringidos con only. La modificación final de recursos amplía el caso existente de diez ciclos para comprobar la liberación de callbacks de frame; las comprobaciones de URLs/fallo/reintento se conservan.

Sobre el candidato final, **npm run verify** pasa: tipos Astro sin errores, advertencias o hints; lint, formato, configuración de hosting y build satisfactorios; **518 unitarias, 25 componentes, 156 E2E, dos builds de integración y cuatro comprobaciones de pantalla**. La batería dirigida de exportaciones pasa con 20 pruebas. Entorno: Node 24.22.2, npm 11.19.1, Playwright 1.64.1, Chromium 156.0.8078.4/r1248. Resultados exclusivamente locales.

La suite conserva portada ES/EN, catálogo vacío/poblado/draft en copias aisladas, rutas/404, cambio de idioma, identidad, cabecera/pie, temas, fuentes, hero/pausa/movimiento, contratos de miniapps y recorrido real de Plan B. Incluye errores, teclado/foco, sesión v1/restauración/corrupción/bloqueo, calendario/fecha, compartir/cancelar, descargas, texto máximo/emoji, offline tras carga, reduced-motion, reflujo y accesibilidad automática. No acredita motores o dispositivos físicos no ejecutados, WCAG completa ni tiempos humanos universales de comprensión.

### Hallazgo de codificación y corrección

La primera comparación de I7 detecta en el renderer aprobado de I6 una espera intermitente de aproximadamente un segundo al codificar el canvas; no era un segundo de trabajo de dibujo. Se separa dibujo de espera/codificación y se comprueba con píxeles idénticos: cinco pasadas alternadas de la sonda muestran el camino clásico sin callbacks solicitados en 1012–1017 ms y una ventana limitada de frames en 17–23 ms. El experimento OffscreenCanvas de af7d1bd tampoco evita consistentemente la espera; queda sustituido, sin introducir esa API en el producto final.

2d213dd mantiene HTML canvas/toBlob y el dibujo aprobado. Solicita como máximo cinco callbacks de frame durante la codificación, cancela al resolver/rechazar y libera el lienzo en finally. No anima el contenido, incorpora un worker ni mantiene un bucle. El fallo/reintento y la limpieza se vuelven a comprobar en navegador.

Se miden **40 codificaciones reales**, base/candidato × claro/oscuro × ejemplo/textos máximos × cinco pasadas alternadas, fuentes listas, reloj real y viewport 393×851. Tiempo desde crear el canvas; excluye la espera previa de fuentes y el guardado/menú del SO. Mediana y rango total en ms:

| Caso | Base I1 | Candidato final |
| --- | --- | --- |
| Claro, ejemplo | 22,0 (20,9–30,1) | 21,2 (19,7–24,3) |
| Claro, máximo | 43,5 (42,7–50,3) | 43,9 (38,7–49,4) |
| Oscuro, ejemplo | 21,7 (21,1–28,9) | 21,4 (20,4–23,9) |
| Oscuro, máximo | 42,8 (39,2–102,7) | 46,3 (39,1–49,6) |

Las medianas de dibujo del candidato son 6,4/25,4/6,6/28,9 ms; las de codificación, 14,8/18,5/14,9/17,2 ms. Ninguna de las 20 muestras finales del candidato repite la espera de un segundo. Es evidencia de este entorno Chromium, no garantía de duración en todo dispositivo.

Se regeneran desde el código final los PNG ES/claro/ejemplo y EN/oscuro/máximo mixto con CJK/emoji compuestos: **idénticos byte a byte a los archivos aprobados de I5/I6**, 1179×2556, frase íntegra, tinta dentro de la zona segura y sin errores o solicitudes externas. Se reutilizan los archivos existentes; no se añaden capturas duplicadas. El caso máximo puede alargar el resultado; no se promete eliminar todo scroll de lectura, y las cuatro preguntas siguen separadas.

### Rendimiento y recursos comparados

Los scripts auxiliares locales de servidor, performance, PNG, recursos y memoria se ejecutan fuera del repo; sus resultados relevantes y condiciones quedan en el análisis durable. No son comandos nuevos del producto. Para reducir sesgo se reconstruye la comparación de ambas salidas con el mismo servidor estático Node, sin compresión, no-cache/ETag y 404 real. No se comparan directamente estos tiempos con los de I1 servidos mediante Astro preview. Cinco pasadas por variante/ruta/viewport, orden base/candidato alternado: **160 observaciones** contando frío/caliente. Contexto nuevo para frío; mismo contexto para caliente, solo sesión propia borrada y about:blank entre visitas. Sin throttling, fuentes listas, reduced-motion, tema claro, zona Europe/Madrid, sin service worker. Cachés del SO no purgadas.

LCP en ms, mediana (mínimo–máximo); las distribuciones y CLS por grupo están en el JSON:

| Ancho / ruta | Frío base → candidato | Caliente base → candidato |
| --- | --- | --- |
| 393 / ES | 48 (40–112) → 60 (56–72) | 36 (28–52) → 32 (20–48) |
| 393 / EN | 56 (52–84) → 52 (44–60) | 32 (24–40) → 40 (24–52) |
| 393 / 404 | 44 (40–52) → 48 (36–64) | 28 (24–40) → 24 (20–40) |
| 393 / Plan B | 52 (48–64) → 64 (48–68) | 32 (28–36) → 28 (24–52) |
| 1440 / ES | 56 (52–72) → 56 (52–84) | 36 (28–52) → 40 (24–56) |
| 1440 / EN | 60 (48–64) → 64 (56–80) | 36 (28–40) → 32 (32–44) |
| 1440 / 404 | 44 (44–56) → 48 (44–52) | 28 (28–40) → 32 (24–40) |
| 1440 / Plan B | 56 (52–68) → 88 (52–100) | 36 (32–36) → 36 (32–44) |

La diferencia máxima de medianas frías es +32 ms en Plan B/escritorio, con rangos solapados; no se oculta como una mejora. En esta muestra local no aparece una degradación material, pero cinco pasadas sin red/CPU limitadas no prueban equivalencia de campo. CLS del candidato es cero en los grupos observados; la base Plan B alcanza 0,02837 estrecho y 0,00563 escritorio. El clic común «Ver un ejemplo» hasta dos frames tiene medianas frías 27,5 → 27,1 ms estrecho y 27,9 → 26,1 ms escritorio. Es un proxy, **no INP**, p75 real ni medición de retención/primer uso humano.

Bytes propios: **34798 JS + 8671 CSS inline = 43469 B (42,45 KiB)**, frente a 42903 B de I1; margen 7731 B al presupuesto de 50 KiB. El JS propio baja 4762 B mientras el CSS crece por el acabado. El runtime compartido permanece en 220745 B; CSS global 34900 frente a 34923 B, únicamente por retirar de la salida una variable no usada. Se conservan fuentes/identidad y no se carga Plan B o React desde portada/404.

| Ruta final | Solicitudes | Bytes completos | Estimación gzip |
| --- | --- | --- | --- |
| Portada ES | 4 | 196157 | 151492 |
| Portada EN | 4 | 196081 | 151436 |
| 404 real | 4 | 193865 | 151004 |
| Plan B ES | 7 | 479194 | 241180 |
| Plan B EN | 7 | 478810 | 240853 |

Portada ES de base: 199557 B; Plan B ES de base: 472242 B. El aumento total de Plan B ES es 6952 B e incluye HTML/estilos/estructura, no solo el módulo. Gzip es estimación por cuerpo completo, no transferencia real de Cloudflare. Cero solicitudes externas observadas. Las 23 salidas públicas no incluyen skills, motor, cachés o material de revisión.

### Memoria, privacidad, deuda y herramientas

Se ejecutan **diez ciclos por variante y ancho, 40 ciclos en total**: resultado, descargas reales PNG/.ics, editar, resultado y reset. Cada sesión crea/revoca 40 URLs; después de cada reset hay cero URLs vivas, observers de exportación, lienzos activos, enlaces temporales o callbacks pendientes. El listener de tema vuelve al basal de uno. Pico de lienzo fijo 3013524 píxeles, aproximadamente 12 MB RGBA, sin atribuirlo al RSS total.

Heap JS tras GC en ciclos 0/1/5/10, MB decimales: base estrecha 2,245/3,016/3,353/3,514 y candidato 2,303/3,124/3,511/3,664; base escritorio 2,265/3,016/3,351/3,514 y candidato 2,303/3,108/3,512/3,653. Nodos tras primer ciclo estables en 154 base/239 candidato; listeners estables en 173/181. Hay crecimiento de cachés en ambas variantes; estos contadores y WeakRefs instrumentados no demuestran ausencia universal de fugas de heap/GPU/RSS. No se observa retención de recursos de exportación introducida por el cambio.

Campos y estado permanecen en cliente/sesión; no se añade backend, analítica, envío previo a Google ni texto privado a la URL. Se mantienen consentimiento, enlace limpio, borrado explícito y errores recuperables. No se identifica nueva deuda funcional pendiente en el alcance revisado. La deuda existente PEND-007 permanece abierta y el propietario acepta su riesgo como no bloqueante para esta entrega: auditoría lock-only normalizada idéntica en base/candidato, **17 altas/8 moderadas/0 críticas; omit=dev: cero**. Una raíz alta picomatch se propaga por 17 paquetes de herramientas. Sin versión corregida publicada en la consulta; no se adopta audit fix o un downgrade implícito. El [informe de seguridad](security-review.md) concreta exposición, mitigaciones, riesgo residual y excepción aprobada; las pruebas verdes no resuelven ese hallazgo.

Se aplican manualmente Impeccable Operate y las reglas Vercel fijadas, con las adaptaciones locales y sin revisión independiente. Integridad de 62 archivos de skills correcta; detector final de Plan B devuelve lista vacía. No es certificación de calidad visual. Sin hooks, subagentes, dependencias nuevas, servicios o telemetría; descubrimiento nativo sigue sin acreditarse y fuera del criterio aceptado. La autoridad continúa en las fuentes canónicas del proyecto.

### Trazabilidad y handoff

| Criterio FE | Evidencia / límite actual |
| --- | --- |
| FE-AC-01 | Normas y matriz de adopción I1, autoridades existentes preservadas, diff final revisado. |
| FE-AC-02 | Uso manual aplicado I2–I7; versiones/hashes/permisos verificados. Descubrimiento nativo excluido por acuerdo. |
| FE-AC-03 | Dirección/ficha v07/ADR-MMA-023 aprobadas antes de implementar. Identidad y focused acotados. |
| FE-AC-04 | Cuatro preguntas, sesión y errores ES/EN; pruebas y revisión I4/I6, regresión final satisfactoria. |
| FE-AC-05 | Resultado/PNG fiel, salidas y recuperación probadas; PNG finales idénticos a los aprobados. Límites físicos en PB-01. |
| FE-AC-06 | Acabado aprobado expresamente por el propietario en I6; no se exige participantes externos. |
| FE-AC-07 | Presupuesto/160 observaciones/40 PNG/40 ciclos; espera PNG corregida y revalidada, límites de muestra declarados. |
| FE-AC-08 | Parte local satisfactoria y excepción de dependencias aprobada como deuda no bloqueante; **pendientes** CI y staging del candidato final. |
| FE-AC-09 | Candidato y doce PB-AC trazados; PB-01 actualizado y En curso. Aceptación global de FE-01 pendiente. |

| Criterio PB | Evidencia local reutilizable / pendiente |
| --- | --- |
| PB-AC-01 | Registro published, rutas/metadatos ES/EN y contrato focused; E2E e integración conservan aislamiento. Validación remota del nuevo candidato pendiente. |
| PB-AC-02 | Flujo v07, cuatro preguntas, errores/sugerencias, Atrás/ejemplo/reset; unitarias/componentes/E2E. |
| PB-AC-03 | Dominio de mes/fecha estable sin cambios; regresión de límites, cambio de mes y reset mantenida. |
| PB-AC-04 | Sesión v1, restauración de paso/horario, bloqueo/corrupción, cambio de idioma y reset cubiertos. |
| PB-AC-05 | Generadores y expectativas de primera fecha/DST/COUNT conservados. **Importación real de cada vía pendiente.** |
| PB-AC-06 | UTF-8, escapes/plegado/inyección, consentimiento Google, cancelar/errores cubiertos sin llamadas reales a Google. |
| PB-AC-07 | PNG real máximo/emoji/temas, igualdad byte a byte y zona segura comprobados. **Guardado/fondo bajo reloj en ambos teléfonos pendiente.** |
| PB-AC-08 | Texto literal y enlace sin plan verificados, APIs/errores simulados. **Destinos nativos físicos pendientes.** |
| PB-AC-09 | Ejemplo y PNG/.ics offline tras carga pasan en navegador. **Modo avión físico pendiente; no se promete recarga offline.** |
| PB-AC-10 | axe, teclado/foco, temas, reduced-motion, reflujo y zoom de las iteraciones conservados. **Compatibilidad física/otros motores pendiente.** |
| PB-AC-11 | 42,45 KiB propios, carga real/red revisadas; no salida de datos previa a exportación explícita observada. |
| PB-AC-12 | Verify final local pasa. **CI/staging del nuevo candidato y matriz manual completa pendientes.** |

La aprobación FE-01/I6 satisface la revisión humana del piloto en su ámbito; no convierte la emulación en pruebas físicas ni acepta PB-01. La evidencia histórica de PB-01/I6 sigue identificada por su revisión anterior. Tras la entrega habrá que comprobar CI del head exacto, merge manual, prepare/remote-test y manifest SHA/árbol/payload de staging por el circuito existente. Ningún workflow/guard se modifica para conseguir esa validación. FE-I7-02 queda documentado; FE-I7-01/03 siguen pendientes por la evidencia remota ausente; la deuda de dependencias tiene excepción humana aprobada.

Cierre documental local: 125 Markdown y 813 referencias locales comprobadas, sin enlaces reales rotos; el único aviso es el ejemplo literal de puntos suspensivos del documento upstream, ya identificado como falso positivo. Formato y diff --check satisfactorios. El build posterior a toda la documentación conserva **idénticos los 23 archivos públicos** medidos; no se repite la suite completa por cambios solo documentales sin efecto en runtime.

### Aprobación de deuda no bloqueante

El 2026-11-18, tras explicar la exposición en desarrollo, GitHub Actions y Cloudflare Builds y contrastar los avisos antiguos ya corregidos con GHSA-fc5q-39xc-vjpf sin corrección publicada, el propietario indica: «Vale, vamos a dejarlo como deuda tecnica o como pendiente no bloqueante, pero que tendremos que investigar posible solucion periodicamente». Se registra aceptación del riesgo para entregar el candidato funcional 2d213dd y su lockfile auditado. PEND-007 continúa abierto con revisión mensual y ante cambios/nueva corrección; próxima revisión objetivo 2026-12-18. No se activa automatización, rebaja el umbral general ni acepta otros candidatos o el producto. Se conserva el merge manual y se retoma la entrega conjunta autorizada. Por indicación del propietario, su revisión visual se hará en staging; no se preparan más demos o capturas salvo necesidad concreta.
