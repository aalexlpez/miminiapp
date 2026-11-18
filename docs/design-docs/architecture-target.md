# Arquitectura objetivo y decisiones aprobadas

**Estado:** plataforma implementada y staging publicado. Contrato de entrega entre repositorios aprobado por el propietario el 2026-11-16; circuito de producción existente contrastado en I-03 y Aceptado expresamente por el propietario con sus limitaciones el 2026-11-16.
**Responsable:** propietario de MiMiniApp.
**Actualizado:** 2026-11-16.

El [registro de decisiones](index.md) conserva las aprobaciones. La [arquitectura actual](../../ARCHITECTURE.md) y el [contraste de I-03](../reports/i03/contract-verification-2026-11-16.md) distinguen implementación y límites; el [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md) conserva la procedencia.

## Componentes y límites

La base aprobada es **Astro** estático, **React + TypeScript estricto** para interacción en navegador y **Tailwind CSS**, con las versiones y configuración del paquete I-01. El catálogo y las rutas ES/EN se implementan en I-02; la primera miniapp real sigue fuera de alcance. Cloudflare Workers Static Assets está aprobado en ADR-MMA-004 por indicación posterior del propietario el 2026-11-05: una cuenta y dos Workers, tokens account-owned Editor individuales tras creación administrativa controlada. Staging publica mediante Actions; producción mediante Workers Builds, según la enmienda vigente del registro técnico.

No se propone instalar `@astrojs/cloudflare` para una salida puramente prerenderizada. SSR, sesiones, KV/D1, autenticación y procesos dinámicos quedan fuera; una necesidad real exigiría nueva evaluación y decisión. Versiones, compatibilidad, configuración y límites actuales de Cloudflare se comprobarán al preparar la iteración autorizada; el dossier no acredita disponibilidad o capacidad ilimitada.

## Modelo de ejecución

1. **Cliente local, predeterminado:** cálculos, experimentos, juegos individuales o archivos locales, con persistencia local opcional. No implica backend de MiMiniApp.
2. **API pública directa, excepción:** revisar CORS, cuotas, licencias, costes y datos transmitidos; requiere aprobación antes de integrar. No admite secretos privados en el frontend.
3. **Backend, excepción:** autenticación, pagos, almacenamiento remoto o cómputo servidor requieren análisis de seguridad/coste, decisión aprobada y plan autorizado. No se habilitan por evolución potencial a SaaS.

WebAssembly y Web Workers siguen siendo procesamiento cliente; si se proponen, deberán presupuestar descarga, memoria y batería en móviles. La persistencia de navegador no debe presentarse como respaldo garantizado.

## Organización modular aprobada

Para I-02 se formalizan las [decisiones modulares y de rutas](i02-catalogue-routing-proposal.md), aprobadas en ADR-MMA-011/016. Cada carpeta de miniapp separa `metadata.ts`, `entry.astro`, interfaz React cuando proceda, dominio, traducciones ES/EN y pruebas. Un registro explícito asocia los metadatos de las publicadas con un loader de su adaptador Astro; los borradores no declaran loader. El catálogo consume solo metadatos. La ruta común `pages/[locale]/apps/[slug].astro` genera publicadas × locales mediante getStaticPaths y resuelve su entrada durante prerender, sin serializar componentes o loaders en props.

El alta ordinaria añade una carpeta y una inscripción; no modifica rutas, layouts, navegación o módulos existentes. I-02 demuestra este comportamiento con fixtures A+D → A+B+D en un build aislado, conservando el build entregable vacío y sin sus artefactos. La firma del adaptador y la exclusión de chunks se comprobaron con Astro fijado; el [informe de ejecución](../reports/i02/execution.md) registra resultados y límites.

Se aprueban `/es/` y `/en/`, español por defecto y slug estable; textos comunes separados de los de cada herramienta. `/` utiliza la entrada HTML estática aprobada, local de estado 200 con meta refresh/enlace a `/es/`; el propietario aprueba posteriormente para I-03 la raíz HTTP 301 a /es/, normalización de barras y 404 reales, implementadas y comprobadas en staging. Las URL desconocidas requieren 404 real mediante un 404 estático bilingüe, sin fallback SPA. Barras finales, normalización del proveedor y canónicas/hreflang sin origen público se concretan en la propuesta, sin configurar Cloudflare.

Categorías, etiquetas, demo, fechas o dependencias específicas solo se añadirán al contrato cuando exista un uso aprobado; no se impone todo el registro futuro a I-02. La dirección Laboratorio creativo moderno, segunda composición, paleta, familias tipográficas y revisión mediante capturas están aprobadas en ADR-MMA-017. La [especificación visual](i02-visual-proposal.md) preserva las referencias y distingue detalles mecánicos por comprobar, evolución vacío→poblado y encuadres de miniapps legibles en 9:16. La [arquitectura actual](../../ARCHITECTURE.md) describe los archivos presentes y el estado de implementación; la aprobación del objetivo no acredita por sí misma su verificación.

## Entrega y validación

Desarrollo y pruebas funcionales en `aalexlpez/miminiapp`, staging. Promoción manual por SHA completo validado a `soycerobytes/miminiapp`: snapshot completo con altas/modificaciones/borrados, controles preservados y secretos excluidos. Historial independiente mediante commit propio, rama y PR con única quality ligera. El propietario fusiona manualmente a main y Workers Builds reconstruye y publica. Sin identidad binaria obligatoria ni auto-merge. Detalle y límites en [fiabilidad](../standards/RELIABILITY.md).

## Límites

La aprobación documental no autoriza nuevas operaciones, cambios de credenciales/protecciones o publicaciones. La primera miniapp sigue sin implementar; su selección/ficha, decisiones específicas y autorización se tratan en el [plan de Plan B](../exec-plans/active/PB-01-plan-b.md). No se afirman ensayos de rollback o aislamiento de escritura que no se realizaron.
