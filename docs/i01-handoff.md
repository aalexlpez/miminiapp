# I-01 — Continuación en otro chat

**Fecha y actor:** 2026-11-04, propietario de MiMiniApp. Autoriza expresamente crear la rama feature/i01-base-local-testing, realizar un commit del trabajo de I-01 y subir esa rama para continuar en otro chat. El [ExecPlan](exec-plans/active/I-01-base-local-y-testing.md) conserva la autorización y su alcance.

## Punto de partida

Repositorio: aalexlpez/miminiapp. Rama: feature/i01-base-local-testing. En el chat de destino hay que seleccionar esta rama y comprobar el SHA frente al comunicado tras el push; trabajar desde master no recupera estos cambios.

Leer [AGENTS.md](../AGENTS.md), la [definición](product-specs/index.md), los [ADR](design-docs/index.md), el [plan activo](exec-plans/active/I-01-base-local-y-testing.md) y el [informe de ejecución](i01-execution-report.md). I-00 está Aceptado y archivado; I-01 tiene definición, siete ADR, plan y ejecución aprobados/autorizados, pero sigue **En curso**. Su autorización de ejecución sigue vigente dentro del alcance acordado.

Están implementados Astro + React + TypeScript strict + Tailwind, la fixture técnica y las pruebas. Pasaron instalación congelada, tipos, lint, formato, 14 unitarias, 9 componentes y build. El Chromium 156.0.8078.4 de Playwright 1.64.1 (revisión 1248) no se pudo descargar por HTTP 403 Domain forbidden desde cdn.playwright.dev. Los ocho diagnósticos complementarios con Chromium 155 pasaron; no completan los criterios del navegador obligatorio.

## Preparación y verificaciones pendientes

1. Comprobar rama, commit y cambios locales antes de actuar; no sobrescribir trabajo existente. Verificar la política y el acceso efectivos de la máquina de destino: publicar una configuración no demuestra que este entorno la haya incorporado. Si una descarga redirige a otro dominio denegado, registrar el destino y solicitar el permiso de red necesario sin evitar el proxy ni desactivar TLS.
2. Activar **Node 24.22.2 y npm 11.19.1**, los valores exactos de .node-version y package.json. Prepararlos con un gestor compatible o la distribución oficial con sus sumas verificadas si no están disponibles. La ruta /workspace/.tools/node-v24.22.2-linux-x64 usada en el chat anterior no está en Git y puede no existir aquí. No cambiar versiones ni regenerar el lockfile para evitar una incompatibilidad del runtime.
3. Desde la raíz del checkout y con esos ejecutables activos, ejecutar:

```sh
node --version
npm --version
export ASTRO_TELEMETRY_DISABLED=1
npm ci
npx --no-install playwright install chromium
npm run verify
```

La suite verify incluye build, E2E y axe en Chromium escritorio y móvil emulado; se esperan 14 unitarias, 9 componentes y 8 casos de navegador, sin omisiones. Para repetir solo accesibilidad puede usarse npm run test:a11y. Repetir también la revisión registrada de teclado/foco y aspecto responsive con el navegador requerido, identificando si es asistida o humana. Registrar comandos, versiones, códigos de salida, recuentos y comparación del lockfile antes/después. Si faltan librerías del sistema, diagnosticar e instalar únicamente las dependencias necesarias de Chromium conforme al plan. No sustituir el navegador fijado por uno del sistema para declarar cumplidos los criterios.

Los directorios de caché pueden variar entre máquinas. Si se fija PLAYWRIGHT_BROWSERS_PATH, usar el mismo valor para instalar y ejecutar las pruebas. node_modules/, .astro/, dist/, .local/, playwright-report/ y test-results/ están ignorados; los binarios del runtime/navegador, logs y capturas del chat anterior no viajan en el commit. El informe contiene sus resultados, hashes y límites; la nueva ejecución debe generar su propia evidencia.

## Cierre y límites

Actualizar el plan y el informe con los resultados reales. Pasar a Verificado solo cuando se cumplan los criterios, incluyendo los pendientes AC03/04/07/08 con Chromium 156. Una comprobación material fallida mantiene En curso. La aceptación corresponde expresamente al propietario.

Mantener la fixture técnica: sin catálogo ni miniapp real. No iniciar I-02, configurar CI remoto, Cloudflare, servicios externos o despliegues. No cambiar materialmente tecnologías, arquitectura o alcance sin aprobación. Los ajustes mecánicos cubiertos por los ADR aprobados pueden aplicarse y verificarse con evidencia. Conservar H-001/H-002, la aceptación de I-00 y su desviación histórica de trazabilidad.

El permiso Git de este traslado autoriza únicamente ese commit y push a la rama indicada; no autoriza merges, cambios en master ni futuros commits/pushes. No marcar I-01 Aceptado por el hecho de subir el trabajo.
