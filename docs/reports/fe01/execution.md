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
