# MiMiniApp

Instancia del harness documental para preparar una colección pública de miniapps bilingües ES/EN. La base local de I-01 está implementada y en verificación: Astro estático, una fixture React/TypeScript, estilos Tailwind y pruebas automatizadas. La descarga del Chromium fijado está bloqueada por la red del entorno; I-01 sigue En curso. No hay catálogo, miniapp real o despliegue.

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

La transferencia documental I-00 está aceptada y archivada; H-002 está aprobada. La definición y los siete ADR aplicables a I-01 están aprobados; el resto conserva sus propuestas. I-01 está autorizado y En curso. El stack está instalado y pasan tipos, lint, formato, 14 unitarias, 9 componentes y build; la verificación con Chromium obligatorio sigue bloqueada. No se ha activado CI/CD. La arquitectura real se describe en [ARCHITECTURE.md](ARCHITECTURE.md). Los criterios del producto completo y de despliegue siguen siendo objetivos futuros; las comprobaciones locales ya ejecutadas se detallan en el informe.

Esta instancia procede de `aalexlpez/harness-engineering`; las adaptaciones locales se registran en [harness-decisions.md](docs/harness-decisions.md). No se ha modificado el template original. Los archivos especializados sin contenido aplicable pueden permanecer vacíos.


## Base local y comandos

Requisitos: Node 24.22.2 y npm 11.19.1, fijados en .node-version y package.json. Usa tu gestor de runtime compatible. En esta instancia cloud ya están instalados y se activan así:

```sh
export PATH=/workspace/.tools/node-v24.22.2-linux-x64/bin:$PATH
export ASTRO_TELEMETRY_DISABLED=1
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright
npm ci --cache /workspace/.cache/npm
npx --no-install playwright install chromium
npm run verify
```

La instalación del navegador necesita acceso permitido a cdn.playwright.dev; actualmente el entorno lo rechaza. La adición del dominio está guardada como borrador y necesita aplicación por el propietario en la configuración del entorno. No se omiten tests ni se cambia el navegador requerido para dar el resultado por válido. Consulta el [informe de ejecución](docs/i01-execution-report.md).

Para trabajar: npm run dev. Para servir el build: npm run build y npm run preview. Ambos servidores usan 127.0.0.1:4321 y --ignore-lock para mantenerse en primer plano también bajo un agente; Ctrl+C detiene el proceso propio. Playwright gestiona su preview, rechaza reutilizar otro servidor y lo cierra al terminar.

| Comando | Función |
| --- | --- |
| npm run check | Astro y TypeScript strict. |
| npm run lint | ESLint JS/TS/Astro/React Hooks, cero warnings permitidos. |
| npm run format:check | Prettier de código/configuración, sin reformatear el harness. |
| npm run test:unit | 14 casos de validación/normalización en Node. |
| npm run test:components | 9 casos React en jsdom. |
| npm run build | Una página provisional estática en dist/. |
| npm run test:e2e | Build y 8 casos en Chromium escritorio/móvil emulado, incluida accesibilidad. |
| npm run test:a11y | Build y selección de axe en los mismos dos perfiles. |
| npm run verify | Tipos, lint, formato, unitarias, componentes, build y E2E; propaga fallos. |

La fixture solo comprueba el entorno: etiqueta local de 3–32 puntos de código, normalización, error, confirmación y reset. No guarda ni envía datos. No constituye la primera miniapp ni una implementación del catálogo. La interfaz provisional está en español; el producto bilingüe pertenece a su alcance posterior.

Logs de comandos: .local/verification/; fallos E2E: test-results/ y playwright-report/. Son salidas ignoradas por Git. Para restablecer la fixture usa Restablecer; para el entorno, detén solo tus procesos y vuelve a npm ci desde el lockfile. No borres cambios ajenos ni uses un reset de Git para limpiar.

La ejecución complementaria con Chromium del sistema está registrada por separado en el informe y no forma parte del procedimiento requerido. Quedan pendientes el navegador fijado, E2E/axe en él y la aceptación del resultado; tampoco se han probado Firefox/WebKit o dispositivos físicos.

Para retomar desde otro chat o máquina, selecciona la rama feature/i01-base-local-testing y sigue la [guía de continuación de I-01](docs/i01-handoff.md). El runtime instalado en /workspace/.tools, las dependencias y los logs locales no se transportan por Git; deben prepararse o regenerarse en el entorno de destino. El propietario ha autorizado este commit y push específico; I-01 permanece En curso.
