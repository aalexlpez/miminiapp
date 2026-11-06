# I-03 — informe de preparación, Fase A

**Fecha:** 2026-11-06. **Estado del ExecPlan:** En curso, exclusivamente Fase A autorizada por el propietario. Fase B no autorizada. No se declara I-03 Verificado.

## Recuperación e integridad

`pwd` y `git status` funcionan en `/workspace/miminiapp`, dentro de Codex Cloud. Se recuperaron el borrador I-03 y sus seis documentos asociados sin commit; no se había perdido trabajo ni modificado el historial durante la recuperación.

Se verificaron los objetos y la ascendencia de I-01 `0288de567fe7e1665973c6d8e128866962f66e2e` e I-02 `567b394583140d1710034f4798d0cf8dbb29e387`. Los hashes de aplicación del manifiesto I-02 coincidían antes de implementar I-03. Se conservaron la rama anterior de I-02 y ambos commits aceptados.

La lectura HTTPS y fetch de `origin/master` confirmaron `214a3c16ad5e968214af540033246baa9dd32ba1`, merge del PR #1, con árbol idéntico al checkpoint `0cf778f`. Antes de integrar había dos commits exclusivos locales y un merge exclusivo remoto, con ancestro común `0cf778f`. `master` sigue siendo la predeterminada observada; no se ha modificado. La integración técnica conserva la ascendencia mediante merge normal, sin force push, reset, rebase ni promoción a main/staging.

## Implementación local

* Cinco workflows de GitHub Actions fijados por SHA: CI, promoción, staging, producción y rollback. CI se prepara para PR a staging/main y push a la rama técnica de I-03. Gate desde base confiable, sin secretos.
* Todos los jobs de staging/producción/rollback tienen `if: ${{ false }}` literal. La política versionada conserva Fase A y deploymentsEnabled=false. El comando también rechaza publicar en Fase A antes de leer artefactos, credenciales, acceder a la red o ejecutar Wrangler. Una variable remota no basta para activar despliegues.
* Artefacto determinista, hashes de archivos y manifiesto público de procedencia, recibo separado tras pruebas, selección por run/intento/IDs y revalidación. El empaquetado exige checkout limpio. Promoción del mismo paquete, sin reconstrucción; comprobación del manifiesto servido en staging y rechazos de candidatos obsoletos, bytes distintos, procedencia falsa, reruns y cambios de ramas.
* Configuraciones de Workers Static Assets para `miminiapp-staging` y `miminiapp`, sin script/SSR ni Account ID inventado, preview URLs desactivadas, barras finales y 404-page. Archivo `_redirects` con `/ /es/ 301`. El preview local Astro conserva raíz HTTP 200.
* Suite remota separada, con origen/destino/identidad explícitos y 30 pruebas descubiertas para móvil/escritorio. No se ha ejecutado contra Cloudflare.
* Configuración deseada de repositorio/protecciones/Environments en `deploy/github/`. Es preparación revisable, no configuración remota efectiva. No se ha rebajado strict=true ni creado secretos.

## Verificaciones satisfactorias

Evidencia local ignorada: `.local/verification/i03/phase-a/`. Los logs no se incorporan al commit.

| Comprobación | Resultado y alcance |
| --- | --- |
| Instalación | Wrangler 4.158.0 exacto, npm ci desde el único lockfile satisfactorio. Scripts esbuild@0.28.2/workerd@1.20261104.1 autorizados por versión exacta. Node 24.22.2/npm 11.19.1. |
| Acciones oficiales | Cuatro tags contrastados de nuevo con sus SHA completos por git ls-remote; action.yml recuperados al SHA usan Node 24. `actions-tags.json` y `actions-runtime.json`. |
| Batería completa local | `npm run verify` exit 0: tipos, lint, formato, validación offline Wrangler, unitarias, componentes, E2E/axe e integración. `verify.log`. |
| Cambios finales del gate | Tras la batería se añadió rechazo de checkout sucio y se amplió auditoría de protecciones. Tipos finales: 56 archivos, cero errores/avisos/hints; lint correcto. Unitarias globales: 164/164 y auditoría afectada final: 31/31, que añade 14 casos respecto a esa ejecución global; 178 casos únicos comprobados. Logs `unit-final.log`, `workflow-final.log`, `check-final.log`, `lint-final.log`. |
| Componentes | 9/9 satisfactorias. |
| Navegador local | 26/26 E2E, con axe y responsive ES/EN. Chromium real 156.0.8078.4, revisión 1248, ejecutable de la caché fijada; DEBUG registra lanzamiento de chromium_headless_shell-1248. No se utilizó Chromium del sistema. `chromium-pin.log`. |
| Integración modular | Alta aislada A→A+B genera 2→4 rutas ES/EN; pruebas propias 2→4. Fuentes comunes intactas, HTML previo estable salvo uid interno normalizado. Build sin traducción rechazado; fixtures/borradores ausentes de los 12 archivos públicos. Regresión I-01 móvil/escritorio con estados y axe satisfactoria. `modular-result.json`. |
| Hosting offline | Wrangler valida ambas configuraciones, destinos y modos de assets; sin deploy/dry-run, login o API Cloudflare. |
| Descubrimiento remoto | 30 pruebas listadas; no se visitaron sitios remotos. `remote-list.log`. |
| Auditoría npm | Producción: cero vulnerabilidades. Total desarrollo: once moderadas, cero altas/críticas; se conserva PEND-007. No se ejecutó audit fix ni se cambiaron majors. |
| Revisión independiente | Sin vía de publicación prematura detectada; corregidas conexiones de variables, proof/receipt e identidad servida. Esto no sustituye pruebas reales de proveedor/protecciones. |

No se repiten pruebas de interfaz por cambios exclusivamente documentales o de gates; las comprobaciones focales cubren los cambios finales. No se han implementado animaciones PEND-008, nuevas miniapps o I-04.

## Configuración remota y bloqueos

**GitHub API:** el token inyectado está disponible, pero `api.github.com` recibe `CONNECT 403 Forbidden`. No se exponen valores ni se intenta eludir el proxy. El propietario ya preparó permitir el dominio; indica que solo puede publicar el borrador del entorno al terminar este turno. Quedan pendientes identidad/capacidades reales, configuración y prueba de protecciones, Environments, secretos y observación del CI remoto. La autorización de Fase A sigue vigente tras ese cambio de red.

**Bootstrap:** las ramas staging/main previstas desde master no contendrían el código confiable del primer gate. No se aplica un bypass ni se modifica ese punto aprobado. La [guía](i03-operations.md) presenta una alternativa concreta para aprobación: crear inicialmente ambas ramas en el commit técnico integrado y revisado, conservando todos los historiales y los publicadores bloqueados; proteger/verificar antes de publicar. Mientras no se apruebe y se recupere la API, no se crean esas ramas remotas ni se cambia la predeterminada.

**Cloudflare:** no hay Account ID/tokens configurados en el entorno; no se ha creado, modificado ni publicado ningún Worker. La creación inicial documentada requiere deploy administrativo, fuera de esta fase. Quedan pendientes autorización específica, bootstrap y dos tokens account-owned Editor restringidos por Worker; después prueba real de denegación cruzada. No hay credencial general alternativa en CI. Si el aislamiento falla, detener activación afectada y pedir aprobación antes de cambiar el modelo.

**Límites de evidencia:** los mocks prueban lógica, no capacidades remotas ni ausencia de carreras frente a GitHub/Cloudflare reales. IDs de versión Cloudflare y estado activo tras timeout, dos ciclos válidos, separación efectiva, HTTP 301/404 real, artefacto servido, smoke y rollback siguen pendientes de Fase B. Main debe mantener strict=true; no se propone desactivarlo para sortear el bootstrap.

## Correspondencia con los 12 AC

| AC | Fase A y trabajo pendiente |
| --- | --- |
| AC1 | Autorización/inventario local documentados; capacidades e identidad autenticada pendientes API. |
| AC2 | Batería local reproducible y pins comprobados; CI real y bloqueo de PR fallido pendientes GitHub. |
| AC3 | Configuración deseada y pruebas negativas offline; enforcement/merge manual reales pendientes. |
| AC4 | Separación preparada; creación/tokens/permisos reales detenidos antes de publicación. |
| AC5–AC7 | Hosting, manifiesto y suite preparados; publicación/separación HTTP/pruebas remotas pendientes Fase B. |
| AC8 | Gates negativos locales y strict=true preservado como requisito; carreras/ensayos reales y cualquier sustitución requieren evidencia y aprobación posterior. |
| AC9–AC10 | Workflows inactivos y equivalencia preparada; promoción, publicación y smoke reales pendientes Fase B. |
| AC11 | Rollback restringido preparado, nunca ejecutado; ensayo inicial autorizado en staging pendiente. |
| AC12 | Guía distingue preparación, merge manual individual, futuro deploy automático, coste y recuperación; aceptación final pendiente. |

## Punto de parada

Fase A local preparada; configuración/verificación remota todavía incompleta. El propietario debe publicar el cambio de red de Codex Cloud y decidir el bootstrap descrito. Después se reanuda únicamente Fase A con la autorización existente. No habilitar Fase B, emitir credenciales generales, publicar, promover o modificar la predeterminada para resolver un bloqueo.

Los identificadores finales de commits y el resultado del push técnico se registran al finalizar esta preparación. Los archivos temporales, paquetes de prueba, capturas y evidencias ignoradas quedan fuera de Git.
