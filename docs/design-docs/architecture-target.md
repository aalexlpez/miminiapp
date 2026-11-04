# Arquitectura objetivo propuesta

**Estado:** propuesta documental, no implementada ni aprobada por la recepción del dossier.
**Responsable:** propietario de MiMiniApp.
**Actualizado:** 2026-11-04.

El [registro de decisiones](index.md) conserva el estado de cada elección. La [arquitectura actual](../../ARCHITECTURE.md) describe lo que existe. Esta propuesta sintetiza las secciones 5 y 6 del [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md); no afirma que existan archivos, servicios o despliegues.

## Componentes y límites

Se propone generar catálogo y páginas con **Astro**, prerenderizadas por defecto. **React + TypeScript** aportaría la interacción de las miniapps en navegador, con funciones de dominio independientes de los textos y de la UI. **Tailwind CSS** es la opción trasladada para estilos. Cloudflare Workers Static Assets serviría el resultado estático del build.

No se propone instalar `@astrojs/cloudflare` para una salida puramente prerenderizada. SSR, sesiones, KV/D1, autenticación y procesos dinámicos quedan fuera; una necesidad real exigiría nueva evaluación y decisión. Versiones, compatibilidad, configuración y límites actuales de Cloudflare se comprobarán al preparar la iteración autorizada; el dossier no acredita disponibilidad o capacidad ilimitada.

## Modelo de ejecución

1. **Cliente local, predeterminado:** cálculos, experimentos, juegos individuales o archivos locales, con persistencia local opcional. No implica backend de MiMiniApp.
2. **API pública directa, excepción:** revisar CORS, cuotas, licencias, costes y datos transmitidos; requiere aprobación antes de integrar. No admite secretos privados en el frontend.
3. **Backend, excepción:** autenticación, pagos, almacenamiento remoto o cómputo servidor requieren análisis de seguridad/coste, decisión aprobada y plan autorizado. No se habilitan por evolución potencial a SaaS.

WebAssembly y Web Workers siguen siendo procesamiento cliente; si se proponen, deberán presupuestar descarga, memoria y batería en móviles. La persistencia de navegador no debe presentarse como respaldo garantizado.

## Organización orientativa

La separación propuesta es páginas y layouts, componentes comunes, miniapps con dominio/UI/demo/pruebas propios, i18n, estilos y registro de catálogo. La siguiente estructura es orientativa; no existe en el checkout:

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

Formalizar las decisiones, fijar versiones compatibles, concretar contratos y pruebas en una iteración pequeña, aprobar el plan y autorizar su ejecución. La [ficha de miniapp](../product-specs/miniapp-template.md) se utilizará cuando el propietario seleccione una; esta propuesta no elige la primera.
