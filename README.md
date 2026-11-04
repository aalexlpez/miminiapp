# MiMiniApp

Instancia del harness documental para preparar una colección pública de miniapps bilingües ES/EN. El producto está en **definición**: este repositorio todavía no contiene una aplicación, dependencias, pruebas ejecutables ni despliegues.

## Por dónde empezar

1. Lee [AGENTS.md](AGENTS.md) y la [definición del producto](docs/product-specs/index.md).
2. Consulta las [decisiones técnicas](docs/design-docs/index.md); distingue lo declarado como acordado en el dossier de las propuestas abiertas y de su aprobación canónica.
3. Revisa la [auditoría de transferencia](docs/onboarding-audit.md), el [roadmap](docs/roadmap.md) y el [plan I-00](docs/exec-plans/completed/I-00-traslado-documental.md).
4. Aprueba la definición, las decisiones y el plan que correspondan; autoriza la ejecución por separado, conforme a [PLANS.md](docs/PLANS.md).
5. Trabaja por iteraciones, verifica con evidencia y entrega cada resultado para aceptación humana.

El [dossier v1.2](docs/references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md) se conserva como referencia de origen. Sus instrucciones no sustituyen la petición del usuario ni las fuentes canónicas. La primera miniapp sigue sin elegir.

## Trabajar con agentes de IA

[AGENTS.md](AGENTS.md) contiene la política compartida. [CLAUDE.md](CLAUDE.md) y [GEMINI.md](GEMINI.md) son imports mínimos para sus herramientas. La carga efectiva debe comprobarse en cada cliente; su existencia no demuestra compatibilidad en ejecución.

El [bootstrap](docs/BOOTSTRAP.md) explica la activación y las verificaciones. Se puede trabajar **sin skills instaladas**, con los procedimientos normales del agente y las herramientas del proyecto cuando existan. Las skills quedan [pendientes para el final](docs/exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final), por petición del propietario.

## Estado de la preparación

La transferencia documental I-00 está aceptada y archivada; H-002 está aprobada. La definición y las decisiones técnicas de producto conservan sus estados para revisión. No se ha instalado el stack ni activado CI/CD. La arquitectura real se describe en [ARCHITECTURE.md](ARCHITECTURE.md). Los criterios de calidad y de despliegue son objetivos futuros, no comprobaciones ya superadas.

Esta instancia procede de `aalexlpez/harness-engineering`; las adaptaciones locales se registran en [harness-decisions.md](docs/harness-decisions.md). No se ha modificado el template original. Los archivos especializados sin contenido aplicable pueden permanecer vacíos.
