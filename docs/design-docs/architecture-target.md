# Arquitectura objetivo y decisiones aprobadas

**Estado:** base local aprobada por ADR-001/002/003/005/006/008/015 el 2026-11-04; hosting, catálogo y rutas completas conservan su estado de propuesta. La base local está implementada y Verificada con Chromium fijado; la aceptación expresa del propietario y el archivo de I-01 se registran el 2026-11-05. Hosting, catálogo y rutas completas no están implementados.
**Responsable:** propietario de MiMiniApp.
**Actualizado:** 2026-11-04.

El [registro de decisiones](index.md) conserva el estado de cada elección. La [arquitectura actual](../../ARCHITECTURE.md) describe lo que existe. Este documento sintetiza las secciones 5 y 6 del [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md); distingue el objetivo futuro de los archivos locales ya implementados en I-01. La arquitectura actual y el informe registran la evidencia; no se afirman servicios remotos o despliegues.

## Componentes y límites

La base aprobada es **Astro** estático, **React + TypeScript estricto** para interacción en navegador y **Tailwind CSS**, con las versiones y configuración del paquete I-01. Catálogo y miniapps son objetivos posteriores, no archivos actuales ni entregables de I-01. Cloudflare Workers Static Assets sigue como propuesta de alojamiento pendiente del ADR-004; no está aprobado ni provisionado por este paquete.

No se propone instalar `@astrojs/cloudflare` para una salida puramente prerenderizada. SSR, sesiones, KV/D1, autenticación y procesos dinámicos quedan fuera; una necesidad real exigiría nueva evaluación y decisión. Versiones, compatibilidad, configuración y límites actuales de Cloudflare se comprobarán al preparar la iteración autorizada; el dossier no acredita disponibilidad o capacidad ilimitada.

## Modelo de ejecución

1. **Cliente local, predeterminado:** cálculos, experimentos, juegos individuales o archivos locales, con persistencia local opcional. No implica backend de MiMiniApp.
2. **API pública directa, excepción:** revisar CORS, cuotas, licencias, costes y datos transmitidos; requiere aprobación antes de integrar. No admite secretos privados en el frontend.
3. **Backend, excepción:** autenticación, pagos, almacenamiento remoto o cómputo servidor requieren análisis de seguridad/coste, decisión aprobada y plan autorizado. No se habilitan por evolución potencial a SaaS.

WebAssembly y Web Workers siguen siendo procesamiento cliente; si se proponen, deberán presupuestar descarga, memoria y batería en móviles. La persistencia de navegador no debe presentarse como respaldo garantizado.

## Organización orientativa

La separación propuesta es páginas y layouts, componentes comunes, miniapps con dominio/UI/demo/pruebas propios, i18n, estilos y registro de catálogo. La siguiente estructura completa sigue siendo orientativa y no existe como tal: I-01 solo crea pages/index.astro, components/EnvironmentFixture.tsx, lib/validation.ts y estilos/pruebas locales, sin miniapps, registro o rutas bilingües:

```text
src/
  pages/[locale]/index.astro
  pages/[locale]/apps/[slug].astro
  pages/404.astro
  layouts/
  components/
  miniapps/<slug>/
    App.tsx
    domain/
    tests/
    demo.ts
  i18n/
  lib/miniapp-registry.ts
  styles/
```

Antes de fijar rutas se comprobará la versión de Astro y la generación de rutas dinámicas estáticas mediante `getStaticPaths`. Se propone `/es/` y `/en/`, con enlace a la herramienta equivalente entre idiomas, rutas canónicas y `hreflang` por concretar. Fechas, números e importes usarían formatos de locale sin alterar su valor computacional.

El registro tipado propuesto contiene identificador, slug estable, categoría, etiquetas, estado `draft`/`published`, título y descripción ES/EN, interfaz, dependencias, ejecución `client-local` por defecto, demo, pruebas y fecha de publicación cuando exista. El build validaría consistencia y excluiría borradores del catálogo, sitemap y navegación. No se crea un motor de plugins, microfrontend o sistema remoto.

## Entrega y validación

La propuesta de dos destinos estáticos separados, `feature/* → staging → main`, pruebas y promoción se desarrolla en [fiabilidad](../RELIABILITY.md) y [calidad](../QUALITY_SCORE.md). Los nombres de Workers y subdominios del dossier son orientativos; no hay URLs ni cuenta de Cloudflare comprobadas. `miminiapp.com` continúa como candidato.

## Pendientes antes de implementar

La definición, los siete ADR aplicables y el plan I-01 ya están aprobados. La ejecución de I-01 fue autorizada posteriormente y ya se comprobaron instalación, tipos, lint, unitarias/componentes y build. La parte de navegador fijado está completada con Chromium 156.0.8078.4 / revisión 1248, verify exit 0 y revisión asistida visual/teclado; I-01 Aceptado por el propietario el 2026-11-05. Hosting, registro y rutas completas requieren sus decisiones y planes correspondientes. Ante una incompatibilidad se documenta y propone el ajuste mínimo; ajustes mecánicos cubiertos por ADR aprobados se aplican solo en ejecución autorizada, y cambios materiales requieren aprobación nueva. La [ficha de miniapp](../product-specs/miniapp-template.md) se utilizará cuando el propietario seleccione una; esta propuesta no elige la primera.
