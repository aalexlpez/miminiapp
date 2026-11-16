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
