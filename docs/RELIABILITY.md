# Fiabilidad y entrega

**Estado actual, 2026-11-06:** Fase A de I-03 autorizada y en curso. Configuración y controles locales preparados; despliegues desactivados. Las secciones de planificación conservan el origen de los requisitos, no una autorización de Fase B.
**Responsable:** propietario de MiMiniApp.

[ADR-MMA-009](design-docs/index.md) está Aprobada por decisiones expresas del propietario el 2026-11-05 para un desarrollador con una cuenta GitHub; ADR-MMA-004/014 y la concreción de ADR-MMA-009/015 se aprueban después con las condiciones de tokens Editor por Worker y prueba previa del gate de main. PR/checks obligatorios, revisión y merge manual del propietario, cero reviews requeridas, auto-merge desactivado y deploy automático sin reviewers de Environments. El plan I-03 está Aprobado formalmente; ejecución y activación siguen pendientes de autorización expresa, y las comprobaciones reales se realizarán solo entonces. No hay CI/CD o infraestructura remota configurados.

## Circuito objetivo

`feature/*` → pruebas locales → PR a `staging` con las mismas pruebas desde checkout limpio → revisión y merge manual del propietario → despliegue automático de staging → pruebas en URL remota real y validación del propietario → PR de `staging` a `main` → gate de promoción → revisión y merge manual del propietario → producción automática → smoke.

En el flujo individual aprobado, una vez aprobado y activado el plan de infraestructura, **el merge autorizado a main constituye la autorización humana para publicar**; no se añade una segunda aprobación manual de despliegue. Esta descripción no autoriza ningún merge ni despliegue actual.

El propietario solicita preparar GitHub Actions y Cloudflare en el [ExecPlan I-03](exec-plans/active/I-03-github-actions-y-cloudflare.md). Workers Static Assets y Wrangler 4.158.0 están aprobados para la arquitectura, con acciones por SHA y autorización granular Editor. El ExecPlan ajustado está Aprobado, pendiente únicamente de autorización expresa de ejecución. No activar Workers Builds u otra integración como segundo publicador del mismo destino. El propietario confirma cuenta Workers Free y subdominio `miminiapp-lab.workers.dev`, con nombres decididos `miminiapp-staging` y `miminiapp`; no hay proyectos, Workers, tokens o integraciones creados. URLs previstas todavía no desplegadas: `miminiapp-staging.miminiapp-lab.workers.dev` y `miminiapp.miminiapp-lab.workers.dev`. Staging será permanente, público, separado y equivalente funcionalmente a producción, sin datos privados.

## Condiciones de promoción por implementar

* Proteger staging y main con PR/checks obligatorios y cero reviews requeridas. La revisión y decisión de merge manual corresponden al propietario; no hay aprobación independiente ni auto-merge. Bloquear push directo, force push y borrado; aplicar al administrador cuando GitHub lo permita y demostrar su funcionamiento real. Environments sin reviewers obligatorios; no añadir una aprobación manual de deployment.
* Acreditar qué versión se sirve en staging mediante un mecanismo inocuo por diseñar, como un manifiesto de build sin secretos. Un log de CI verde no demuestra que ese contenido esté desplegado.
* Asociar pruebas remotas y decisión de merge manual del propietario al candidato exacto, verificando PR, cuenta del merger, árbol y artefacto. No contar un evento Approve ni exigir otra cuenta. GitHub puede crear un SHA de merge nuevo: comprobar equivalencia con el artefacto probado y promover el mismo archivo, sin reconstrucción silenciosa.
* Si staging cambia después de validarse, invalidar la promoción o evitar nuevas integraciones hasta concluirla. Todo el contenido promovido se publica; no improvisar cherry-picks sin volver a validar el resultado.
* Ejecutar despliegues privilegiados solo desde ramas y workflows confiables. No exponer secretos de Cloudflare en PR externos o frontend; ver [seguridad](SECURITY.md).

## Salud, fallos y recuperación

Staging requiere pruebas remotas de ES/EN, rutas, recursos, catálogo, responsive y miniapps afectadas; [calidad](QUALITY_SCORE.md) define las capas propuestas. Producción requiere smoke tras deploy de disponibilidad, identidad de versión y recorridos críticos. Cuando exista una miniapp real de control, incluirla sin elegirla ahora.

Si un smoke falla, comunicar fallo, bloquear promociones y conservar evidencia. El propietario decide y ejecuta un rollback manual restringido al artefacto/versión anterior validado; no hay rollback automático. Su procedimiento se ensayará inicialmente tras autorización, con comprobación de identidad y assets recuperados; todavía no se ha probado.

## Límites conocidos

No hay URLs ni SLAs verificados. Un alojamiento estático económico no garantiza disponibilidad o capacidad ilimitadas; revisar límites vigentes de archivos, tamaño, builds y ejecución dinámica al implementar. No activar SSR o servicios de estado por anticipación. El dominio propio sigue pendiente y los procesos de desarrollo cloud no equivalen al alojamiento de producción.

## Preparación actual de I-03

I-02 está Aceptado y archivado. I-03 está Aprobado formalmente el 2026-11-05, incluidos sus 12 AC, pero sin ejecución autorizada: incluye configuración de staging y producción y conserva el flujo solicitado; registra las decisiones técnicas ya aprobadas, queda pendiente únicamente de autorización expresa de ejecución/activación; las comprobaciones reales se realizarán durante la ejecución futura. No se crean workflows, protecciones, proyectos o secretos al redactarlo. La aprobación humana se vinculará al contenido exacto que se publique, sin sustituirla por CI verde.

## Separación de credenciales y evolución del control humano

Una cuenta Cloudflare y dos Workers aprobados: crear primero ambos recursos con administración controlada, sin exposición pública prematura, y después dos account-owned API tokens Editor, cada uno limitado a un Worker. Wrangler usa API token + Account ID explícitos, no OAuth `wrangler login`. Credencial Admin fuera de CI y de Environments ordinarios. Probar que el token staging no puede modificar producción y que su versión/assets permanecen intactos; pruebas futuras, no acreditadas ahora. No sustituir por Workers Scripts: Edit de cuenta sin evidencia previa de incompatibilidad, propuesta y aprobación.

Cuando haya otro colaborador, exigir una o más reviews, invalidarlas con nuevos cambios y acordar CODEOWNERS/último push mediante protecciones; probar revisor elegible distinto del autor. Los workflows siguen verificando PR, checks, candidato y merge autorizado, sin rediseñarlos ni añadir aprobaciones de Environments. `merged_by` registra la cuenta que actuó, no acredita por sí solo una lectura del código.

## Paquete operativo aprobado y condiciones de ejecución

Wrangler 4.158.0, Ubuntu 24.04, Node/npm y Playwright/Chromium fijados y cuatro acciones oficiales por SHA completo aprobados; verificar versiones y SHA durante ejecución. GitHub Token de lectura y tokens Editor individuales para los Workers existentes. No hay permisos legacy generales como opción por defecto. Aprobados retención 7/30 días, objetivo 0 USD/mes y rollback manual excepcional ensayado primero en staging.

Quality obligatorio en staging, quality+promotion en main; PR/cero reviews, administrador sujeto a reglas cuando sea posible, auto-merge/force/borrado desactivados y merge commits. Strict=true nativo se mantiene en ambas ramas inicialmente. Antes de sustituirlo en main por gate de equivalencia exacta, demostrar rechazos de candidato obsoleto, cambios concurrentes y artefactos/hash/run distintos, más dos ciclos válidos y revalidación del publicador. Si no se acredita, no rebajar protección; conservar strict y resolver sincronizaciones mediante PR revisado cuando sea necesario. No desactivarlo para poder ensayar el gate.

Estas decisiones aprobadas no ejecutan el [plan I-03](exec-plans/active/I-03-github-actions-y-cloudflare.md): está Aprobado formalmente y pendiente de autorización expresa de ejecución; no hay creación de recursos/tokens, sincronización, commits, pushes, merges o despliegues autorizados.

Aprobación formal de I-03 registrada el 2026-11-05, incluidos 12 AC y ratificación de ADR, sin ejecución autorizada. Si los tokens no aíslan efectivamente cada Worker, detener la activación afectada y pedir aprobación antes de una alternativa. La sustitución de strict=true en main exige evidencia y aprobación expresa del propietario, no solo pasar pruebas. No hay bloqueo previo acreditado para autorizar implementación; las comprobaciones reales siguen pendientes para esa ejecución.

## Evidencia actual de Fase A — 2026-11-06

La autorización posterior del propietario limita la ejecución a preparación técnica segura. `.github/deployment-policy.json` deshabilita publicaciones y todos los jobs publicadores tienen condición literal falsa; el comando de publicación rechaza Fase A antes de usar credenciales o invocar Wrangler. Los controles de integridad y las pruebas negativas del gate son locales. No acreditan protecciones de GitHub, aislamiento de tokens o HTTP Cloudflare reales.

La API de GitHub queda pendiente por bloqueo de red CONNECT 403; el propietario preparó permitir api.github.com pero debe publicar ese borrador de entorno después de terminar el turno activo. No se rebaja strict ni se suplanta la API. No hay credenciales Cloudflare configuradas; la creación administrativa de Workers mediante deploy queda fuera de esta autorización. Véanse [informe](i03-phase-a-report.md) y [operación](i03-operations.md).
