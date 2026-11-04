# Roadmap informativo de MiMiniApp

**Fecha:** 2026-11-04. **Responsable:** propietario de MiMiniApp. **Estado:** propuesta trasladada del [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), no autorización de ejecución.

Cada iteración tendrá su propio ExecPlan cuando corresponda prepararla. I-00 tiene un [ExecPlan aceptado y archivado](exec-plans/completed/I-00-traslado-documental.md) por indicación expresa del propietario el 2026-11-04. El propietario aprobó la definición, los siete ADR y el plan I-01 y posteriormente autorizó su ejecución. I-01 está En curso, con la base local implementada y validación del navegador bloqueada; los estados canónicos se consultan en cada plan. Esta tabla no aprueba ni autoriza otras iteraciones, instalaciones, integraciones o despliegues. Consulta los estados reales en cada plan conforme a [PLANS.md](PLANS.md).

| Iteración | Resultado previsto | Verificación para el cierre | Dependencias principales |
| --- | --- | --- | --- |
| I-00 | Transferencia documental, fuentes canónicas, puentes de instrucciones y contrato de iteraciones | Coherencia y enlaces; verificación por herramienta o limitación explícita; revisión humana | I-00 aceptada expresamente y archivada; H-002 aprobada; limitación Claude/Gemini aceptada para su alcance y diferida en PEND-002 |
| I-01 | Base del proyecto y testing reproducible | Instalación desde lockfile; check, lint, pruebas, build y un E2E local real | Definición y ADR-001/002/003/005/006/008/015 aprobados; I-01 autorizado y En curso; navegador Chromium fijado pendiente por bloqueo de red |
| I-02 | Catálogo, registro de miniapps e i18n | ES/EN, rutas, 404, teclado y móvil/escritorio; sin anunciar miniapps inexistentes | I-01 aceptada y diseño del registro/rutas aprobado |
| I-03 | Staging permanente separado | Deploy real, suite contra URL pública e identificación del código servido | I-02 aceptada, acceso Cloudflare seguro, decisiones y plan de infraestructura autorizados |
| I-04 | Producción y gate de promoción | PR protegido; árbol/artefacto validado y aceptado en staging; deploy automático y smoke/rollback | I-03 aceptada, permisos reales y plan propio autorizado |
| I-05 | Flujo documental semanal y contribución | Ficha de miniapp y guías utilizables; fixtures solo si se autorizan | Flujo base estable; licencia resuelta antes de aplicar licencia o presentar el proyecto como distribuible bajo ella |
| I-06 | Primera miniapp real | Criterios de la ficha y pruebas de su iteración | **Elección humana aplazada**; no preparar ni autorizar su implementación sin esa elección |

No es una fecha de lanzamiento ni un compromiso de publicar semanalmente a costa de calidad. El lanzamiento requiere al menos una miniapp real validada; el total inicial no está cerrado.

## Al final: skills opcionales

Por petición del usuario, evaluar las skills después de completar y estabilizar el flujo anterior, cuando haya evidencia de procedimientos repetidos. La tarea se mantiene en [PEND-001](exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final); no bloquea el trabajo sin skills ni autoriza su creación. No se fija una iteración de implementación hasta definir su utilidad y alcance.
