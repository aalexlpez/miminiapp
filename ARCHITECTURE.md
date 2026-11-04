# Arquitectura actual

**Actualizado:** 2026-11-04. **Estado de I-01:** En curso, con bloqueo de red para completar la validación del navegador fijado.

El checkout contiene el harness documental y una base funcional local con Astro 7.4.5, React/DOM 19.3.1, TypeScript 6.0.3 strict y Tailwind 4.3.4. Runtime Node 24.22.2 con npm 11.19.1; dependencias directas exactas y package-lock.json. La definición y siete ADR están aprobados y la ejecución de I-01 está autorizada.

## Componentes implementados

* src/pages/index.astro: página provisional ES, noindex, salida prerenderizada e isla React client:load.
* src/components/EnvironmentFixture.tsx: formulario local con validación, resultado, error anunciado y reset con foco. No persiste ni transmite el dato.
* src/lib/validation.ts: lógica pura compartida por la interfaz y las pruebas; normaliza espacios y comprueba 3–32 puntos de código.
* src/styles/global.css: Tailwind mediante @tailwindcss/vite; responsive de una/dos columnas.
* Configuración de tipos, lint, formato, Vitest (Node/jsdom) y Playwright (solo Chromium móvil emulado/escritorio).
* tests/: 14 unitarias y 9 de componentes pasadas; ocho E2E/axe definidos sobre el build. El diagnóstico con Chromium 155 pasa los ocho, pero la ejecución requerida con Chromium 156 sigue bloqueada por descarga.

El build genera una página y cuatro recursos estáticos en dist/. El preview local responde HTTP 200, la interacción está hidratada y se ha revisado el aspecto a 1280px/393px con el navegador complementario. El [informe de ejecución](docs/i01-execution-report.md) separa resultados obligatorios, diagnósticos, errores y pendientes. No se declara I-01 Verificado mientras falte su navegador obligatorio.

## Límites

No hay catálogo, registro de miniapps, miniapp real, rutas/i18n completos, backend, base de datos, APIs externas, analítica, CI remoto, Cloudflare ni despliegue. El [objetivo de arquitectura](docs/design-docs/architecture-target.md) conserva esos componentes futuros como propuestas, no realidad. Los [ADR](docs/design-docs/index.md) mantienen sus estados y el plan activo conserva la aceptación humana pendiente.

I-00 permanece aceptada y archivada, con su trazabilidad original. El propietario autoriza posteriormente un commit de I-01 y su push exclusivo a feature/i01-base-local-testing para retomarla en otro chat, manteniendo En curso. La [guía de continuación](docs/i01-handoff.md) describe los requisitos de la máquina nueva; el traslado no acredita la verificación pendiente ni autoriza merges o despliegues.
