# Harness de proyectos

Template reutilizable para iniciar y mantener proyectos de software con asistencia de Codex. No contiene un stack, una arquitectura ni funcionalidades de producto predeterminadas.

Este README es una guía de entrada. Las fuentes canónicas y su precedencia se identifican en `AGENTS.md`.

## Cómo utilizarlo

1. Copia el template a un nuevo repositorio.
2. Abre el proyecto con Codex y describe la idea o proporciona la documentación disponible.
3. Completa progresivamente la definición del proyecto.
4. Investiga y aprueba las decisiones técnicas necesarias.
5. Prepara y aprueba el plan inicial sin asumir que su aprobación autoriza ejecutarlo.
6. Autoriza expresamente el inicio de la implementación.
7. Desarrolla, verifica y revisa el resultado.
8. Acepta el resultado y mantén actualizado el conocimiento duradero.

No es necesario completar toda la documentación antes de comenzar la investigación. Los documentos técnicos se desarrollan cuando existen decisiones o información real que registrar.

Los archivos especializados que todavía no sean aplicables pueden permanecer vacíos. No deben rellenarse solo para completar el esqueleto documental.

El procedimiento completo para activar una instancia, comprobar las capacidades disponibles y preparar un entorno verificable se encuentra en `docs/BOOTSTRAP.md`.

## Punto de entrada

Lee `AGENTS.md`. La definición y el estado del proyecto se encuentran en `docs/product-specs/index.md`.

Las decisiones técnicas del proyecto se registran en `docs/design-docs/index.md`; las decisiones heredadas sobre el funcionamiento del harness se conservan por separado en `docs/harness-decisions.md`. Los estados y autorizaciones de cada trabajo planificado se registran en su ExecPlan siguiendo `docs/PLANS.md`; `docs/exec-plans/_template.md` ofrece el punto de partida mínimo.

## Configuración global y skills

El harness complementa las instrucciones globales de Codex y las skills disponibles. No modifica ni instala automáticamente configuración global.

Cada desarrollador debe disponer de los procedimientos necesarios para su trabajo. Si una skill mencionada no está disponible, no debe suponerse que existe.

## Automatizaciones

El template contempla el ciclo completo del proyecto, pero no activa automatizaciones por defecto. Su incorporación requiere aprobación expresa.

## Estado inicial

El proyecto comienza en definición, sin stack, arquitectura, decisiones técnicas propias del producto ni planes de implementación autorizados. Hereda únicamente las reglas y decisiones de gobierno del harness. Las decisiones del producto se incorporan progresivamente a su propia documentación.
