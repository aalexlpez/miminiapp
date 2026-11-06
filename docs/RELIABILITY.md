# Fiabilidad y entrega

**Estado actual, 2026-11-06:** I-03 En curso exclusivamente Fase A autorizada. Preparación técnica local; configuración/validación remota incompletas. Publicaciones bloqueadas y Fase B sin autorizar. **Responsable:** propietario de MiMiniApp.

## Circuito aprobado

`feature/*` → pruebas → PR a staging → quality → revisión y merge manual del propietario → deploy automático a staging → pruebas remotas → PR staging→main → quality/promotion → revisión y merge manual → deploy automático a producción y smoke.

ADR-MMA-004/009/014/015 aprueban Workers Static Assets, flujo individual y toolchain fijada. El control humano es la revisión y merge manual del propietario; cero reviews de otra cuenta y cero reviewers de deployment. No existe aprobación independiente. Los workflows no fusionan PR. En el circuito futuro activado, el merge válido a main autoriza su publicación sin otra intervención semanal.

## Controles de promoción

PR/checks obligatorios, auto-merge desactivado, sin pushes directos/force/borrados, administrador sujeto a reglas cuando sea posible. Quality en staging; quality y promotion en main. Strict=true nativo en ambas; su sustitución en main exige pruebas reales y aprobación expresa adicional. No se rebaja para resolver el bootstrap.

Se construye y prueba el candidato una vez en staging, con manifiesto inocuo e identidad verificable. Producción descarga el mismo artefacto por IDs de run/intento/artefacto y verifica hashes, procedencia, recibo y manifiesto realmente servido. Cambios de candidato/base, reruns antiguos o bytes distintos deben rechazar promoción. Los publicadores vuelven a comprobar bajo el bloqueo compartido, sin prometer FIFO. Los mocks locales no acreditan carreras reales del proveedor.

## Estado implementado de Fase A

CI, gate, empaquetado, pruebas negativas, suite remota y configuraciones están en el repositorio. Los jobs de staging/producción/rollback tienen condición literal falsa; política versionada Fase A con publicaciones deshabilitadas y guardia previa al uso de credenciales/red/Wrangler. El [informe](i03-phase-a-report.md) registra comandos, evidencia y AC pendientes. La API de GitHub bloqueada y la introducción inicial del gate impiden completar la preparación remota; no se presentan protecciones deseadas como efectivas.

Una cuenta Cloudflare Free y dos Workers aprobados: `miminiapp-staging`/`miminiapp`, subdominio `miminiapp-lab.workers.dev`. Sin Workers o tokens creados por esta ejecución. La creación administrativa documentada requiere deploy y queda detenida. Después de autorización específica: dos account-owned tokens Editor limitados individualmente y prueba real de denegación cruzada. Admin fuera de CI; sin OAuth ni fallback de Workers Scripts: Edit general. Si el aislamiento falla, detener activación y solicitar aprobación antes de una alternativa.

## Fallos y recuperación

Tras activar el circuito, staging requiere pruebas reales ES/EN/rutas/recursos/responsive/teclado/axe/identidad y exclusión de fixtures; producción requiere smoke. No activar Workers Builds u otro segundo publicador. Si una publicación falla o tiene timeout, consultar el estado realmente servido y la versión del proveedor; no asumir ausencia de efecto ni declarar release verde.

Rollback excepcional manual del propietario, desde ref protegida, destino fijo y artefacto anterior validado, sin código arbitrario. Ensayo inicial autorizado en staging pendiente; captura de versión Cloudflare, restauración y smoke deben acreditarse realmente. No hay rollback automático preparado. Retención 7 días para fallos y hasta 30 para candidatos/recibos; un artefacto expirado no se promueve y se conserva una versión recuperable.

## Coste y evolución

Objetivo 0 USD/mes, con GitHub público/runner estándar y Cloudflare Free sujetos a cuotas comprobadas antes de activar; alertas no equivalen a un bloqueo de gasto. Sin SSR ni estado anticipados. No hay URL pública o SLA verificados. En el futuro las reviews de otro colaborador se incorporan mediante protecciones con revisor elegible, sin rediseñar workflows.

La [guía operativa](i03-operations.md) separa configuración inicial, trabajo semanal y recuperación. El [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md) conserva los 12 AC y la autoridad para activar y aceptar; preparar archivos no autoriza despliegues, I-04 ni miniapps reales.
