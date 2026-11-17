# Decisiones del harness

## Propósito

Registrar las decisiones duraderas sobre el gobierno y la evolución de este template. Estas decisiones se heredan al crear una instancia, pero no cuentan como decisiones técnicas del producto. El comportamiento vigente se expresa en los documentos canónicos enlazados por cada decisión; este registro conserva su justificación y aprobación.

## Registro

### H-001 — Gobierno ligero y fuentes canónicas separadas

* **Estado:** `Aprobada`
* **Fecha:** 2026-09-08
* **Responsable:** Responsable del template, mediante aprobación expresa en conversación.
* **Decisión:** Mantener el juicio humano para las decisiones semánticas, reducir diferencias de interpretación mediante criterios de desempate e invariantes documentales y separar las decisiones del harness de las decisiones técnicas del producto. Cada dominio tiene una fuente canónica y los documentos de orientación no la sustituyen. No se incorpora todavía un validador automático; su necesidad se evaluará con evidencia del primer proyecto.
* **Aplicación:** [fuentes canónicas](../AGENTS.md#fuentes-canónicas), [responsables](../AGENTS.md#responsables), [criterios para aprobar la definición](product-specs/index.md#criterios-para-aprobar-la-definición), [clasificación de decisiones técnicas](design-docs/index.md#cuándo-registrar-una-decisión) y [creación y transiciones de ExecPlans](PLANS.md#cuándo-crear-un-plan).

### H-002 — Adaptación documental de la instancia MiMiniApp

* **Estado:** `Aprobada`, para la instancia MiMiniApp, sin modificaciones al contenido propuesto.
* **Aprobación:** 2026-11-04, propietario de MiMiniApp, mediante «apruebo expresamente su adopción para la instancia MiMiniApp» y «Apruebo H-002 sin modificaciones, conservando H-001 y las reglas originales de autoridad del harness». Efectiva desde esta indicación, sin efectos retroactivos.
* **Fecha:** 2026-11-04.
* **Responsable:** Propietario de MiMiniApp, por rol; no se atribuye aprobación al responsable del template original.
* **Origen:** Petición del usuario de completar el harness a partir del dossier v1.2 y dejar las skills pendientes para el final. Esa petición autoriza preparar esta documentación, no aprobar decisiones técnicas del producto ni ejecutar su roadmap.
* **Adaptación adoptada:** Política compartida en `AGENTS.md`, imports mínimos para Claude Code y Gemini CLI, terminología genérica de agente, ruta explícita sin skills e iteraciones acotadas con aceptación propia. No se cambian los estados ni las atribuciones humanas. No se han instalado herramientas, hooks ni automatizaciones.
* **Compatibilidad:** Codex ha consultado las fuentes del proyecto en esta sesión. Los imports se revisan documentalmente; Claude Code y Gemini CLI no están disponibles para verificar su carga efectiva. El propietario acepta expresamente esta limitación conocida para I-00 el 2026-11-04 y difiere su comprobación a una iteración posterior, registrada en PEND-002. No se declara compatibilidad efectiva verificada.
* **Skills:** Aplazadas expresamente por el usuario en [PEND-001](exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final). Su integración futura requerirá alcance, revisión y autorización propios.
* **Aplicación:** [AGENTS.md](../AGENTS.md), [bootstrap](BOOTSTRAP.md), [iteraciones](PLANS.md#iteraciones-de-miminiapp), [plantilla](exec-plans/_template.md) y [auditoría](reports/i00/onboarding-audit.md).
* **Límite:** Solo se modifica `aalexlpez/miminiapp`. No se ha modificado ni aprobado una nueva versión de `aalexlpez/harness-engineering`. El requisito de iteraciones (identificado como ADR-MMA-013 en el dossier) se recoge aquí y en `PLANS.md`, por ser gobierno del trabajo y no arquitectura del producto.

### H-003 — Colaboración entre varias personas y documentos vivos

* **Estado:** `Aprobada`, para la instancia MiMiniApp, sin modificaciones.
* **Aprobación:** 2026-11-15, propietario de MiMiniApp, mediante «si, está bien», tras leer el resumen de sus tres reglas. Efectiva desde esa indicación, sin efectos retroactivos.
* **Origen:** 2026-11-13. Tras la auditoría de ese día, el propietario indica «haz todas las mejoras que encontraste». Esa instrucción autorizó a preparar el texto; la aprobación es la del 2026-11-15.
* **Responsable de aprobación:** Propietario de MiMiniApp, por rol.
* **Motivo:** H-001 y H-002 se escribieron para una sola persona y un solo agente. Las aprobaciones se registraban como citas de conversación, las iteraciones eran estrictamente secuenciales y los documentos de orientación acumulaban historia hasta contradecirse.
* **Decisión:**
  1. **Registro de aprobaciones.** Con un solo mantenedor, una indicación expresa suya en cualquier canal sigue siendo válida y se registra con fecha y actor. Desde que haya más de un mantenedor, la aprobación, autorización o aceptación debe constar en GitHub, como revisión o comentario del responsable en el PR que cambia el estado del artefacto, y el artefacto enlaza ese PR.
  2. **Iteraciones en paralelo.** Pueden coexistir varias iteraciones autorizadas si son independientes y cada una tiene su plan y su responsable. Una iteración no empieza mientras dependa de otra sin aceptar.
  3. **Documentos vivos.** README, ARCHITECTURE, roadmap y las guías describen el presente y se reescriben cuando cambia. La historia permanece en los ExecPlans y en sus informes, que no se reescriben.
  4. **Agente genérico.** Los documentos vivos hablan de «el agente», no de una herramienta concreta. Los registros históricos conservan el actor real.
* **Sin cambios:** estados, transiciones y atribuciones humanas de H-001 y H-002. Ningún agente aprueba, fusiona o publica por iniciativa propia.
* **Aplicación:** [PLANS.md](PLANS.md#iteraciones-de-miminiapp), [CONTRIBUTING.md](../CONTRIBUTING.md#aprobaciones) y la [plantilla de planes](exec-plans/_template.md). `AGENTS.md` no cambia sus reglas de autoridad.

### H-004 — Organización documental por función

* **Estado:** `Aprobada`, para la instancia MiMiniApp.
* **Fecha / aprobación:** 2026-11-15, propietario de MiMiniApp, mediante «vamos a aplicar esta mejora», tras revisar la propuesta de estructura, actualización de enlaces y migración MT-02.
* **Responsable:** propietario de MiMiniApp.
* **Decisión:** raíz de `docs/` con mapa documental, bootstrap, planificación, decisiones del harness y roadmap. Conservar `product-specs/`, `design-docs/`, `exec-plans/`, `review/` y `references/`; agrupar procedimientos en `guides/`, normas en `standards/` e informes en `reports/<iteración>/`. Actualizar enlaces y consumidores al mover archivos; retirar los dos placeholders vacíos sin uso operativo.
* **Límite:** no cambia autoridad, estados, criterios de aceptación ni significado de las decisiones previas. Las referencias originales y el parche histórico se conservan íntegros; en informes y planes cerrados solo se reparan enlaces navegables, sin reescribir los hechos ni las rutas literales de su época. La migración no instala herramientas ni activa automatizaciones.
* **Aplicación:** [mapa documental](README.md), [fuentes canónicas](../AGENTS.md#fuentes-canónicas) y [MT-02](exec-plans/completed/MT-02-organizacion-documental.md). Los borradores de Plan B mantienen su estado pendiente.

### H-005 — Cierre obligatorio de regresión y análisis

* **Estado:** `Aprobada`, para la instancia MiMiniApp.
* **Fecha / responsable:** 2026-11-16, propietario de MiMiniApp.
* **Instrucción:** «La ultima iteración deberá se siempre una iteración de regresión y análsis, evaluar todo lo hecho y contrastarlo con lo que ya hay para saber que no se introdujo errores, deuda, problemas, malos rendimientos, etc etc».
* **Decisión:** todo trabajo nuevo planificado termina con regresión y análisis adecuados a su alcance; si se divide en varios ExecPlans, la última iteración revisa el conjunto sobre una base reproducible. Se comprueban errores, integración, deuda y mantenibilidad y, cuando corresponda, seguridad, privacidad, accesibilidad y rendimiento. Las correcciones se revalidan sobre el candidato final. Añadir implementación desplaza la revisión global al nuevo final.
* **Límite:** la instrucción autoriza incorporar esta regla y preparar la descomposición de Plan B. No aprueba por sí misma sus requisitos, propuestas técnicas o ejecución. No cambia la autoridad humana, los estados, la política de publicación ni las aceptaciones anteriores; no instala herramientas, activa automatizaciones o exige subagentes. La verificación reduce riesgo, sin prometer ausencia absoluta de defectos.
* **Aplicación:** [PLANS.md](PLANS.md#cierre-obligatorio-de-regresión-y-análisis), [plantilla](exec-plans/_template.md) y [última iteración de PB-01](exec-plans/active/PB-01-plan-b.md#iteración-6--regresión-y-análisis-global). El borrador inicial se consolidó en un único plan por H-006.

### H-006 — Un plan con iteraciones internas

* **Estado:** `Aprobada`, para la forma de organización de Plan B y su aclaración en la planificación de esta instancia.
* **Fecha / responsable:** 2026-11-16, propietario de MiMiniApp.
* **Instrucción:** «Si, prefiero un unico plan con 6 iteraciones y que esté bien definido».
* **Decisión:** consolidar Plan B en PB-01 con seis iteraciones internas secuenciales. Un solo estado, aprobación, autorización e historial pertenecen al plan; las condiciones de entrada/salida, tareas y evidencia permiten seguir cada iteración sin multiplicar archivos ni ciclos de aprobación. Avanzar dentro del alcance autorizado cuando se cumplan esas condiciones, respetando los puntos de revisión humana explícitos. Mantener planes separados para resultados independientes o límites de responsabilidad, autorización o riesgo que lo justifiquen.
* **Límite:** esa indicación autorizó consolidar la preparación documental, no desarrollar el producto; en ese momento la ficha, ADR-MMA-020/021 y PB-01 seguían pendientes de aprobación/autorización. Sus estados posteriores se consultan en las fuentes correspondientes. La aceptación del plan completo es humana; los demás planes dependientes siguen esperando su aceptación. No cambia aceptaciones históricas, permisos externos, decisiones técnicas, infraestructura ni la última iteración obligatoria de regresión de H-005.
* **Aplicación:** [PLANS.md](PLANS.md#iteraciones-de-miminiapp), [plantilla](exec-plans/_template.md), [CONTRIBUTING.md](../CONTRIBUTING.md#aprobaciones) y [PB-01](exec-plans/active/PB-01-plan-b.md). Los cinco borradores adicionales, locales y sin ejecutar, se retiran de `active/` tras trasladar su contenido útil; no se archivan como trabajo aceptado o cancelado.

### H-007 — Una rama por ExecPlan y commits por iteración

* **Estado:** `Aprobada`, para la instancia MiMiniApp.
* **Fecha / responsable:** 2026-11-16, propietario de MiMiniApp.
* **Instrucción:** «si, quiero una rama por cada exec plan y exec plan divididos en iteraciones y cada commit identificando la iteración respectiva».
* **Decisión:** cada ExecPlan se divide en iteraciones internas numeradas y registra una única rama estable para ejecutarlas. Los commits de trabajo identifican plan e iteración en su título mediante `tipo(ID-PLAN/Ix): descripción en inglés`. Se conserva un único estado y aceptación del plan. La última iteración sigue siendo regresión/análisis, según H-005.
* **Entregas:** una PR puede acumular iteraciones o integrar una parte comprobada; todas usan la rama del plan. Tras un merge parcial se sincroniza esa misma rama desde staging, sin reescribir commits publicados. El título de la PR conserva la identificación para el mensaje de merge del proveedor. La rama permanece mientras el plan esté activo y se restaura con el mismo nombre si se elimina al integrar una entrega parcial.
* **Aplicación inmediata:** PB-01 adopta `feature/pb01-plan-b` desde staging `e4c956e46a57fadcb7cecaf187df2aba592bad19`, después de PR #20. Las ramas de I1/I2 se retiran tras comprobar que sus commits están integrados y no tienen PR abiertas; los commits y la evidencia se conservan. Los nuevos commits de esta entrega documental se adscriben a I2, cuya trazabilidad se está consolidando; I3 no se inicia por esta instrucción.
* **Límite:** regla prospectiva: no reescribe commits históricos, aceptaciones o informes de etapas anteriores. No cambia decisiones técnicas, protecciones, automatizaciones, infraestructura, publicación ni el merge humano; tampoco amplía la autorización de las iteraciones de producto. Las tareas pequeñas que no requieren ExecPlan mantienen su tratamiento existente. No modifica el template original ni el repositorio de producción.
* **Aplicación:** [planificación](PLANS.md#rama-e-identificación-de-commits-por-plan), [plantilla](exec-plans/_template.md), [guía de contribución](../CONTRIBUTING.md#commits-por-iteración) y [control de PB-01](exec-plans/active/PB-01-plan-b.md#control).

### H-008 — Skills frontend locales y uso manual contextualizado

* **Estado:** `Aprobada` el 2026-11-17. **Responsable:** propietario de MiMiniApp.
* **Aprobación:** el propietario indica «y la H-008, si la acepto», después de revisar su selección/configuración y la explicación de sus efectos. Se aprueba el contenido preparado en FE-01/I1; la instalación/comprobación pertenece a I2, no iniciada en el momento de esta aprobación.
* **Origen:** investigación solicitada tras revisar la UX de Plan B y autorización posterior de I1. La autorización inicial permitía preparar la selección/configuración. La aprobación posterior consta arriba y no inicia I2 por sí sola.
* **Selección aprobada:** Impeccable como ayuda de diseño/crítica y web-design-guidelines de Vercel como revisión de implementación. Alternativas examinadas y razones en la [investigación](reports/pb01/frontend-skills-review.md); no instalar también otro director visual por defecto.
* **Ubicación:** `.agents/skills/impeccable/` y `.agents/skills/web-design-guidelines/` de este repositorio. Versionar instrucciones/referencias/adaptaciones, manifiesto, procedencia y avisos de licencia. No instalar globalmente ni prometer carga en otro cliente por existir una carpeta.
* **Revisiones aprobadas:** Impeccable 4.9.2, d41d9860b0094dcb68030657da63461212835aaa; Vercel agent-skills 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62. Las reglas de revisión leídas inicialmente son 434b7f91364665f2f733b310ec54809bf8f37937. Actualizaciones por diff revisado; registrar el contenido de reglas realmente usado en cada revisión. Conservar Apache-2.0/NOTICE de Impeccable y resolver/documentar el aviso MIT de Vercel antes de distribuir su copia; no cambiar por ello la licencia general pendiente del producto.
* **Contexto y autoridad:** las skills leen las fuentes canónicas del repo. Adaptar instrucciones para no generar PRODUCT.md/DESIGN.md como autoridades paralelas; init/document y reparaciones de contexto no se ejecutan por defecto. La matriz técnica adoptada se conserva en [FRONTEND](standards/FRONTEND.md#matriz-de-adopción-y-conflictos-de-i1), y sus criterios de calidad en ADR-MMA-022 están aprobados separadamente, con aceptación humana suficiente del propietario y pruebas con otras personas opcionales.
* **Ejecución permitida en la iteración autorizada:** uso manual de las instrucciones y, cuando una función escogida lo necesite, motor local de desarrollo de versión/checksum verificados. Caché prevista en `.local/skills/impeccable/` mediante la opción oficial IMPECCABLE_HOME; no se versiona ni llega a dist. No se modifica package/lockfile del producto. Probar carga/invocación y efectos reales de archivos/red en I2, con un caso acotado sin editar producto.
* **Red y privacidad:** telemetría desactivada desde antes de ejecutar el motor mediante IMPECCABLE_NO_TELEMETRY=1 y configuración local telemetry=false. Autorizar solo lecturas públicas necesarias de fuentes/reglas fijadas y descarga verificada del motor elegido; catálogo de direcciones, servicios de generación o envío de información del proyecto quedan fuera del permiso inicial. Desactivar telemetría no bloquea por sí solo el catálogo: limitar también comandos/adaptación y observar red. Nunca enviar planes personales o secretos.
* **Sin activaciones implícitas:** no hooks, tareas al guardar, plugins de editor, cambios de CI, automatizaciones, subagentes, publicación o merge. Una revisión de un solo contexto se identifica como tal; instalar una skill no otorga permiso de delegación. Se conserva la ruta sin skills y el uso de las herramientas existentes.
* **Condición de uso:** probar el cliente realmente elegido; una lectura manual no acredita descubrimiento automático. Si el runtime no permite la integración necesaria, registrar el bloqueo y presentar la opción concreta, sin afirmar funcionalidad o compatibilidad de Claude/Gemini no comprobadas. Los campos y comportamientos opcionales aún no usados no se presentan como validados.
* **Aplicación:** [FE-01 I2](exec-plans/active/FE-01-estandar-frontend-y-piloto-plan-b.md#i2--skills-integradas-y-comprobadas), [procedimiento de revisión](standards/QUALITY_SCORE.md#fe-01--revisión-técnica-visual-y-de-uso), BOOTSTRAP y guía de miniapps se ajustarán a lo comprobado. PEND-001 no se cierra antes de verificar incorporación/uso y aceptación correspondiente.

**Seguimiento de H-008 (FE-01/I2):** perfil de desarrollo incorporado y revisión manual/motor comprobados conforme a la autorización local posterior del plan. [Guía de uso](guides/frontend-skills.md) y [evidencia](reports/fe01/execution.md#i2--integración-local-y-comprobación-de-skills). La carga nativa permanece pendiente; no se amplían permisos, no se activan automatizaciones ni se afirma compatibilidad de otros clientes.
