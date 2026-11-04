# Pendientes y deuda accionable

Este registro conserva tareas pendientes; no equivale a un ExecPlan aprobado ni autoriza ejecución. Al existir un plan que cubra una tarea, enlázalo aquí sin duplicar su estado. Los asuntos de producto y las decisiones técnicas conservan sus fuentes canónicas.

## PEND-001 — Skills opcionales al final

* **Estado:** Pendiente, aplazada expresamente por el usuario el 2026-11-04.
* **Responsable:** Propietario de MiMiniApp.
* **Momento:** Al final de la preparación del flujo y después de estabilizar los procedimientos reales; no es un requisito para continuar sin skills.
* **Trabajo pendiente:** Evaluar si conviene reutilizar skills globales o incorporar skills del proyecto para implementar miniapps, revisar cambios o verificar releases. Decidir nombres, contenido y rutas solo entonces, a partir de evidencia de repetición.
* **Criterios de cierre:** Utilidad justificada; alcance y permisos mínimos aprobados; integración autorizada; ausencia de duplicación de normas; carga y funcionamiento comprobados en los clientes que se vayan a utilizar; ruta sin skills conservada. Ninguna skill fusiona ni publica por iniciativa propia.
* **Situación actual:** No se ha creado, instalado ni activado ninguna skill. Las skills genéricas mencionadas en el bootstrap no se presuponen disponibles.

## Otros pendientes

| ID | Pendiente | Condición para retomarlo / fuente |
| --- | --- | --- |
| PEND-002 | Comprobar la carga y los escenarios de gobierno en Claude Code y Gemini CLI; limitación conocida aceptada expresamente por el propietario para I-00 el 2026-11-04, comprobación todavía no realizada | En una iteración posterior aprobada y autorizada, cuando estén disponibles los clientes; [auditoría](../onboarding-audit.md) y [bootstrap](../BOOTSTRAP.md#comprobar-instrucciones-por-herramienta) |
| PEND-003 | Parcialmente resuelto el 2026-11-04: definición y ADR-001/002/003/005/006/008/015 aprobados; las demás decisiones permanecen pendientes para sus iteraciones | Aprobaciones en [producto](../product-specs/index.md) y [registro técnico](../design-docs/index.md); I-01 está autorizado y En curso; conserva el bloqueo de navegador en PEND-006 |
| PEND-004 | Contribución pública: licencia, guía y plantillas de PR/issues | Resolver licencia/titular y autorizar el alcance correspondiente; [roadmap](../roadmap.md) |
| PEND-005 | Accesos e infraestructura de staging/producción | Preparar en las iteraciones correspondientes con permisos mínimos y valores seguros; [registro técnico](../design-docs/index.md) |

La base local ya está implementada. Los pendientes siguientes distinguen preparación futura, bloqueo externo de navegador y seguimiento de riesgos de desarrollo; no se declara un defecto funcional sin evidencia.


## PEND-006 — Navegador fijado de I-01 bloqueado por red

* **Estado:** Bloqueo externo de I-01 en curso; no es un nuevo estado del ExecPlan.
* **Evidencia:** descarga de Chromium 156.0.8078.4 / revisión Playwright 1248 rechazada con HTTP 403 Domain forbidden en cdn.playwright.dev. Ocho casos requeridos no llegan a ejecutar el navegador.
* **Acción:** dominio exacto añadido al borrador de configuración del entorno, guardado confirmado y requires_publish=true; el propietario debe aplicar/guardar y publicar la configuración para activar la red. Después, reintentar el instalador oficial y los E2E dentro de la autorización de I-01 ya vigente.
* **Cierre:** Chromium fijado instalado y verificación requerida pasada. Los 8 diagnósticos con Chromium 155 no cierran este pendiente.

## PEND-007 — Seguimiento de incidencias moderadas de lint

* **Estado:** Pendiente de seguimiento, sin incumplir el umbral de altas/críticas aprobado.
* **Evidencia:** npm audit informa 11 moderadas por minimatch y dependientes de lint/TypeScript, 0 altas y 0 críticas. Los patrones no proceden de usuarios de la fixture y estas herramientas no se sirven en el build estático.
* **Acción:** evaluar una actualización compatible cuando el ecosistema la ofrezca y antes de ampliar a contribuciones no confiables; no aplicar audit fix --force o downgrades de majors sin aprobación material. Detalle e inventario de licencias en el informe de ejecución.
