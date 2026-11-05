# Arquitectura actual

**Actualizado:** 2026-11-05. **Estado de I-01:** Aceptado expresamente por el propietario el 2026-11-05; plan archivado en completed/.

El checkout contiene el harness documental y una base funcional local con Astro 7.4.5, React/DOM 19.3.1, TypeScript 6.0.3 strict y Tailwind 4.3.4. Runtime Node 24.22.2 con npm 11.19.1; dependencias directas exactas y package-lock.json. La definición y siete ADR están aprobados y la ejecución de I-01 está autorizada.

## Componentes implementados

* src/pages/index.astro: página provisional ES, noindex, salida prerenderizada e isla React client:load.
* src/components/EnvironmentFixture.tsx: formulario local con validación, resultado, error anunciado y reset con foco. No persiste ni transmite el dato.
* src/lib/validation.ts: lógica pura compartida por la interfaz y las pruebas; normaliza espacios y comprueba 3–32 puntos de código.
* src/styles/global.css: Tailwind mediante @tailwindcss/vite; responsive de una/dos columnas.
* Configuración de tipos, lint, formato, Vitest (Node/jsdom) y Playwright (solo Chromium móvil emulado/escritorio).
* tests/: 14 unitarias y 9 de componentes pasadas; ocho E2E/axe pasados sobre el build con Chromium 156.0.8078.4 / revisión 1248, en escritorio y móvil emulado. El diagnóstico anterior con Chromium 155 se conserva como historia.

El build genera una página y cuatro recursos estáticos en dist/. El preview local responde HTTP 200, la interacción está hidratada y se ha revisado el aspecto a 1280×900/393×851 con Chromium 156 fijado, mediante revisión asistida de teclado/foco y seis capturas inspeccionadas. El [informe de ejecución](docs/i01-execution-report.md) separa resultados obligatorios, diagnósticos, errores y pendientes. I-01 está Aceptado expresamente por el propietario desde el 2026-11-05.

## Límites

No hay catálogo, registro de miniapps, miniapp real, rutas/i18n completos, backend, base de datos, APIs externas, analítica, CI remoto, Cloudflare ni despliegue. El [objetivo de arquitectura](docs/design-docs/architecture-target.md) conserva esos componentes futuros como propuestas, no realidad. Los [ADR](docs/design-docs/index.md) mantienen sus estados y el [plan archivado](docs/exec-plans/completed/I-01-base-local-y-testing.md) conserva la aceptación humana y las limitaciones de I-01.

I-00 permanece aceptada y archivada, con su trazabilidad original. El propietario autoriza posteriormente un commit de I-01 y su push exclusivo a feature/i01-base-local-testing para retomarla en otro chat, manteniendo entonces En curso. La [guía de continuación](docs/i01-handoff.md) describe los requisitos de la máquina nueva; el traslado produjo el checkpoint 0cf778f; la verificación y aceptación se completaron después. El propietario autoriza el 2026-11-05 un commit local de cierre de I-01 y preparar solo el borrador de I-02. No se implementa I-02 ni se realizan pushes, merges o despliegues.
