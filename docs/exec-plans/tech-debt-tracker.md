# Pendientes y deuda accionable

Este registro conserva tareas pendientes; no equivale a un ExecPlan aprobado ni autoriza ejecución. Al existir un plan que cubra una tarea, enlázalo aquí sin duplicar su estado. Los asuntos de producto y las decisiones técnicas conservan sus fuentes canónicas.

## PEND-001 — Skills opcionales al final

* **Estado:** Resuelto para el perfil manual explícito aceptado por el propietario el 2026-11-17 al solicitar usar Impeccable/Vercel y continuar con I3, después de explicar la limitación nativa y proponer ese ajuste.
* **Responsable:** Propietario de MiMiniApp.
* **Evidencia:** [FE-01/I2](../reports/fe01/execution.md#cierre-posterior-de-i2-con-alcance-explícito-aceptado): instalación local fijada, licencias/manifiesto, motor/checksum/red, aplicación manual real y aceptación del alcance. [H-008](../harness-decisions.md#h-008--skills-frontend-locales-y-uso-manual-contextualizado) conserva permisos y enmienda.
* **Límite:** Descubrimiento nativo no acreditado; deja de ser criterio de cierre por decisión del propietario. [Guía de uso](../guides/frontend-skills.md). No se atribuye compatibilidad a otros clientes; su comprobación sigue en PEND-002 cuando proceda.
* **Planificación:** I2 completada con FE-I2-01/02/03 en el alcance explícito actualizado. I3 autorizada para preparar diseño/contrato, con revisión humana antes de implementar. Sin nueva entrega remota hasta terminar el plan local.

## Otros pendientes

| ID | Pendiente | Condición para retomarlo / fuente |
| --- | --- | --- |
| PEND-002 | Comprobar la carga y los escenarios de gobierno en Claude Code y Gemini CLI. **Claude Code, carga comprobada el 2026-11-13:** una sesión de Claude Code en la web recibió al iniciar el contenido de `CLAUDE.md` y, a través de su import, el de `AGENTS.md`. Los cinco escenarios de gobierno del bootstrap no se han ejecutado como prueba formal. **Gemini CLI:** sin comprobar | En una iteración posterior aprobada y autorizada, cuando estén disponibles los clientes; [auditoría](../reports/i00/onboarding-audit.md) y [bootstrap](../BOOTSTRAP.md#comprobar-instrucciones-por-herramienta) |
| PEND-003 | Parcialmente resuelto el 2026-11-04: definición y ADR-001/002/003/005/006/008/015 aprobados; posteriormente aprobados ADR-011/016/017 para I-02. Las decisiones restantes permanecen pendientes para sus iteraciones | Aprobaciones en [producto](../product-specs/index.md) y [registro técnico](../design-docs/index.md); I-01 Aceptado y archivado el 2026-11-05; bloqueo PEND-006 resuelto |
| PEND-004 | Contribución pública: licencia y plantillas de issues. La guía [CONTRIBUTING.md](../../CONTRIBUTING.md) y la plantilla de PR se prepararon en MT-01 | Resolver licencia/titular y autorizar el alcance correspondiente; [roadmap](../roadmap.md) |
| PEND-005 | Accesos e infraestructura de staging/producción | Preparar en las iteraciones correspondientes con permisos mínimos y valores seguros; [registro técnico](../design-docs/index.md) |

La base local está implementada y verificada. Los registros siguientes conservan el bloqueo de navegador ya resuelto y el seguimiento vigente de riesgos de desarrollo; no se declara un defecto funcional sin evidencia.


## PEND-006 — Navegador fijado de I-01 bloqueado por red

* **Estado:** Resuelto el 2026-11-04, con instalación y ejecución del navegador fijado acreditadas; I-01 fue Aceptado expresamente el 2026-11-05, sin eliminar sus otras deudas o limitaciones.
* **Evidencia histórica:** descarga de Chromium 156.0.8078.4 / revisión Playwright 1248 rechazada con HTTP 403 Domain forbidden al solicitar cdn.playwright.dev en la instancia anterior. Los diagnósticos Chromium 155 no sustituyen el navegador fijado.
* **Reanudación previa a publicación:** cdn.playwright.dev redirigía a storage.googleapis.com y ese destino recibía CONNECT 403. Instalador y verify exit 1, con ocho lanzamientos sin binario; evidencia conservada en .local/verification/resume-0cf778f/. Se guardó solo la adición exacta en el borrador, tras respuesta «si», sin publicación por el agente.
* **Cierre comprobado:** el propietario publicó el entorno y solicitó probar Playwright; permiso efectivo observed/enforced. Instalador oficial exit 0, Chromium y Headless Shell 156.0.8078.4/r1248; verify exit 0 con 14+9+8 casos sin omisiones, más revisión asistida visual/teclado correcta. Evidencia final en .local/verification/chromium-156/ y [el informe](../reports/i01/execution.md#verificación-final-con-chromium-fijado). Los diagnósticos Chromium 155 no se usan para cerrar este pendiente. Sin nuevos commits/pushes, I-02 o publicación por el agente.

## PEND-007 — Seguimiento de dependencias de desarrollo

**Situación vigente FE-01/I7 — 2026-11-18:** 17 altas/8 moderadas/0 críticas, idénticas en base I1 y candidato; omit=dev: 0. Aviso raíz alto de picomatch GHSA-fc5q-39xc-vjpf, sin versión corregida publicada; afecta herramientas de desarrollo/CI. [Evaluación y excepción aprobada](../reports/fe01/security-review.md) por el propietario el 2026-11-18: deuda abierta, no bloqueante para la entrega FE-01 del candidato 2d213dd y su lockfile auditado. La vulnerabilidad no se declara corregida. Revisar mensualmente y ante nueva versión/aviso, cambio de candidato/lockfile o ampliación de entradas no confiables. Las revisiones siguientes conservan resultados históricos.

**Revisión FE-02/I4 — 2026-11-18:** consulta lock-only actual: 21 altas/11 moderadas/0 críticas; producción omit=dev: 0. Se mantienen las mismas raíces picomatch/minimatch/Astro y package/lockfile idénticos a la base. Los recuentos reflejan la respuesta de auditoría en cada consulta, no nuevas dependencias introducidas. El cambio se limita a UI/canvas, sin globs no confiables, herramientas o controles nuevos; conserva la deuda no bloqueante solicitada por el propietario y el seguimiento mensual, sin volver a solicitar la misma excepción. El alcance y evidencia están en [FE-02](active/FE-02-plan-b-seleccion-y-marca.md).

**Revisión PB-01/I6 — 2026-11-17:** npm audit actual y base previa al producto auditada hoy: 14 moderadas, 0 altas/críticas; omit=dev: 0 vulnerabilidades. Package/lockfile idénticos. Incluye minimatch GHSA-g3hv-75wg-m249 y cadena de lint, y Astro GHSA-r3h5-4585-7x3w sobre @astrojs/node (adaptador no instalado ni desplegado en Workers estático). No se introducen dependencias ni se ejecuta audit fix; seguimiento abierto. El resultado de 11 siguiente es histórico de I-01. [Evaluación y límites](../reports/pb01/execution.md#i6--regresión-y-análisis-global).

* **Estado inicial en I-01:** Pendiente de seguimiento, entonces sin incumplir el umbral de altas/críticas. El estado vigente es deuda no bloqueante para la entrega FE-01 por excepción humana aprobada; conserva el riesgo y su seguimiento.
* **Evidencia:** npm audit informa 11 moderadas por minimatch y dependientes de lint/TypeScript, 0 altas y 0 críticas. Los patrones no proceden de usuarios de la fixture y estas herramientas no se sirven en el build estático.
* **Responsable del seguimiento:** propietario de MiMiniApp; la IA ejecutará la investigación en las revisiones de mantenimiento que se retomen.
* **Cadencia:** mensual, próxima revisión objetivo **2026-12-18**; adelantar si se publica corrección/aviso nuevo, cambia el candidato/lockfile o se amplían entradas no confiables. Sin recordatorio, job o automatización activados. Registrar fecha, avisos, versiones corregidas disponibles, opciones compatibles, pruebas y siguiente revisión en este pendiente.
* **Cierre:** actualización o mitigación validada que resuelva el aviso, o retirada comprobada de la dependencia afectada. Aceptar el riesgo no cierra PEND-007.
* **Acción:** evaluar una actualización compatible cuando el ecosistema la ofrezca y antes de ampliar a contribuciones no confiables; no aplicar audit fix --force o downgrades de majors sin aprobación material. Detalle e inventario de licencias en el informe de ejecución.

## PEND-008 — Movimiento suave y microinteracciones futuras

* **Estado:** Mejora solicitada el 2026-11-05 al aceptar I-02, retomada en la exploración Creative Playground. El 2026-11-08 el propietario aprueba la dirección visual y autoriza preparar [CP-01](completed/CP-01-creative-playground.md); el estado y progreso se consultan allí. ADR-MMA-018 y CP-01 aprobados posteriormente el mismo día; identidad estática aceptada e Iteración 2 autorizada posteriormente el 2026-11-08. Movimiento implementado, Verificado y Aceptado expresamente por el propietario el 2026-11-08 en CP-01; **PEND-008 resuelto** para el alcance acordado, sin implicar merge o despliegue. No es un defecto ni bloquea el cierre aceptado.
* **Responsable:** Propietario de MiMiniApp.
* **Alcance a revisar:** animación suave de flotación de la ilustración principal y posibles microinteracciones/transiciones adicionales, conservando la composición aceptada. Las transiciones funcionales breves ya existentes no se sustituyen ahora.
* **Accesibilidad y calidad:** respetar `prefers-reduced-motion`, suprimiendo movimiento decorativo y transiciones no esenciales cuando se solicite reducción; evitar cambios de layout, ocultación de información, interferencias con teclado/foco o pérdida de legibilidad en móvil, escritorio y vídeo.
* **Condición para implementar movimiento:** ADR-MMA-018/CP-01 aprobados; Iteración 1 aceptada e Iteración 2 autorizada; resultado/intensidad visual aceptados expresamente; la mejora queda cerrada. La evolución visual de ADR-MMA-017 ya está aprobada para M integrada y hero B, con pausa y reduced-motion, según [la decisión](../design-docs/creative-playground.md). No amplía I-02 o I-03; el cierre se limita a CP-01.
* **Criterios de cierre futuros:** comportamiento acordado, evidencia con movimiento normal/reducido, teclado, reflujo y rendimiento; revisión visual del propietario. El registro inicial no añadió movimiento; CP-01 implementa después la dirección aprobada sin dependencias nuevas, con su resultado aceptado expresamente el 2026-11-08.

## PEND-009 — Pasos y decisiones del propietario tras MT-01

Registrado el 2026-11-13. Son acciones que solo puede hacer el propietario o decisiones que le corresponden; [MT-01](completed/MT-01-mantenimiento-y-colaboracion.md) no las ejecuta.

| Asunto | Qué falta |
| --- | --- |
| Rama por defecto | GitHub sigue usando `master` como rama por defecto. Se igualó con `staging` el 2026-11-13 y el 2026-11-15, pero se queda atrás con cada merge porque CI y la publicación cuelgan de `staging`. Falta decidir: cambiar la rama por defecto a `staging` en los ajustes del repositorio, o seguir igualándola a mano. |
| Ramas fusionadas | Quedan en el remoto las ramas `feature/*`, `fix/*` y `docs/*` ya fusionadas o cerradas. Borrarlas y activar el borrado automático al fusionar. |
| Licencia | ADR-MMA-010 sigue en `Propuesta`. Sin licencia el repositorio no puede aceptar contribuciones externas. |
| Dependencias | No hay actualización automática. Activar Dependabot o Renovate es una automatización y requiere aprobación expresa; PEND-007 sigue abierto. |
| Nombres heredados de I-03 | El disparador `feature/i03*` de `ci.yml`, el prefijo `I03 CI v1` del nombre de ejecución y las variables `I03_*` siguen en uso. Renombrarlos exige cambiar a la vez el hash fijado de `ci.yml`, las variables del repositorio en GitHub y las pruebas; un error detiene la publicación de staging. No se tocan sin un plan propio. |
| Segunda persona | Pasos en [CONTRIBUTING.md](../../CONTRIBUTING.md#incorporar-a-otra-persona). |

## PEND-010 — Documentos que aún acumulan historia

Registrado el 2026-11-13. MT-01 reescribió README, ARCHITECTURE y el roadmap como descripción del presente. Siguen mezclando estado actual e historia de iteraciones: [FRONTEND.md](../standards/FRONTEND.md), [QUALITY_SCORE.md](../standards/QUALITY_SCORE.md), [SECURITY.md](../standards/SECURITY.md), [RELIABILITY.md](../standards/RELIABILITY.md), la [definición del producto](../product-specs/index.md), la [arquitectura objetivo](../design-docs/architecture-target.md) y las secciones narrativas del [registro técnico](../design-docs/index.md). Además, `docs/` contiene unos 19 MB de capturas y vídeo de iteraciones cerradas. Reescribirlos o moverlos toca fuentes canónicas y evidencia aceptada: requiere un plan propio.
