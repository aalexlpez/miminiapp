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
* Plantillas de configuración en `deploy/github/`. El propietario guardó manualmente las reglas de main y staging; las ramas ya existen y la API confirma protección y quality obligatorio para todos. La lectura detallada de otras opciones continúa restringida, como se distingue más abajo. No se ha rebajado strict ni creado secretos.

## Verificaciones satisfactorias

Evidencia local ignorada: `.local/verification/i03/phase-a/`. Los logs no se incorporan al commit.

| Comprobación | Resultado y alcance |
| --- | --- |
| Instalación | Wrangler 4.158.0 exacto, npm ci desde el único lockfile satisfactorio. Scripts esbuild@0.28.2/workerd@1.20261104.1 autorizados por versión exacta. Node 24.22.2/npm 11.19.1. |
| Acciones oficiales | Cuatro tags contrastados de nuevo con sus SHA completos por git ls-remote; action.yml recuperados al SHA usan Node 24. `actions-tags.json` y `actions-runtime.json`. |
| Batería completa local | `npm run verify` exit 0: tipos, lint, formato, validación offline Wrangler, unitarias, componentes, E2E/axe e integración. `verify.log`. |
| CI real en GitHub | [Run 42170329302](https://github.com/aalexlpez/miminiapp/actions/runs/42170329302), commit `f4430f0a997f2ba47c3b6c6d0b78e8c12a2102f6`, estado **Success** observado en HTML público el 2026-11-06 06:49 CET (05:49 UTC). Corrió quality desde push de la rama técnica, sin publicaciones. No es prueba de protecciones ni de bloqueo de un PR fallido. `ci-observation.json`. |
| Cambios finales del gate | Tras la batería se añadió rechazo de checkout sucio, se amplió auditoría de protecciones y se corrigió el CLI nativo. Tipos finales: 59 archivos, cero errores/avisos/hints; lint y formato correctos. Unitarias finales: 185/185 (incluye 68 de release, 31 de workflows/políticas y 27 de destino/identidad remotos). Logs `unit-final.log`, `workflow-final.log`, `check-final.log`, `lint-final.log`. |
| Componentes | 9/9 satisfactorias. |
| Navegador local | 26/26 E2E, con axe y responsive ES/EN. Chromium real 156.0.8078.4, revisión 1248, ejecutable de la caché fijada; DEBUG registra lanzamiento de chromium_headless_shell-1248. No se utilizó Chromium del sistema. `chromium-pin.log`. |
| Integración modular | Alta aislada A→A+B genera 2→4 rutas ES/EN; pruebas propias 2→4. Fuentes comunes intactas, HTML previo estable salvo uid interno normalizado. Build sin traducción rechazado; fixtures/borradores ausentes de los 12 archivos públicos. Regresión I-01 móvil/escritorio con estados y axe satisfactoria. `modular-result.json`. |
| Paquete real local | `npm run release:pack` y `release:verify` exit 0 sobre checkout limpio `a49c705`; 12 assets y un manifiesto público. Payload SHA-256 `4fc237a77c041683e99a92b8ee502e80da3a58056b854207e1f0ffe8e18647ab`. Run local 0, no candidato confiable de Actions ni publicación. `local-release-manifest.json`. |
| Hosting offline | Wrangler valida ambas configuraciones, destinos y modos de assets; sin deploy/dry-run, login o API Cloudflare. |
| Descubrimiento remoto | 30 pruebas listadas; no se visitaron sitios remotos. `remote-list.log`. |
| Auditoría npm | Producción: cero vulnerabilidades. Total desarrollo: once moderadas, cero altas/críticas; se conserva PEND-007. No se ejecutó audit fix ni se cambiaron majors. |
| Revisión independiente | Sin vía de publicación prematura detectada; corregidas conexiones de variables, proof/receipt e identidad servida. Esto no sustituye pruebas reales de proveedor/protecciones. |

No se repiten pruebas de interfaz por cambios exclusivamente documentales o de gates; las comprobaciones focales cubren los cambios finales. No se han implementado animaciones PEND-008, nuevas miniapps o I-04.

## Configuración remota y bloqueos

**Acceso e identidad:** el acceso de red a la API funciona. La API autenticada confirma el repositorio público `aalexlpez/miminiapp`, ID 1445849027, usuario `aalexlpez` y permissions.admin=true. También confirma success del CI de f4430f0, run 42170329302, con quality emitido por GitHub Actions, app 15368. La cuenta administradora y los permisos de su credencial son comprobaciones distintas.

**Intento anterior de escritura administrativa:** PATCH de opciones del repositorio y PUT de protección devolvieron HTTP 403 `Resource not accessible by integration`, con administration=write requerido. Ese intento se detuvo sin crear refs. La intervención posterior del propietario consistió en guardar manualmente reglas para main y staging antes de que existieran las ramas; no se repitió la escritura administrativa denegada para sortear esa limitación.

**Bootstrap ejecutado después de la configuración manual:** el propietario reiteró la autorización para crear ambas ramas desde `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`. Se crearon staging y main exactamente en ese commit; la lectura posterior de ambas devuelve el mismo SHA y protected=true. El commit conserva los ancestros master 214a3c1, I-01 0288de5 e I-02 567b394. Su padre inmediato es f4430f0 y el delta sigue limitado al ExecPlan y al informe. La excepción es solo para ese origen inicial: un commit documental posterior de la rama técnica no sustituye la base aprobada.

**Workflows tras crear las ramas:** GitHub registró los runs [Staging 42191340205](https://github.com/aalexlpez/miminiapp/actions/runs/42191340205) y [Production 42210622899](https://github.com/aalexlpez/miminiapp/actions/runs/42210622899), ambos completed/skipped en el SHA aprobado. La consulta de deployments devuelve una lista vacía y la de Environments devuelve total_count=0. La creación de las referencias no levantó los bloqueos ni generó una publicación. Evidencias: deployment-runs.json, deployments-after.json y environments.json del directorio manual-rules.

**Protección comprobada por API:** GET de cada rama confirma required_status_checks con quality, app_id 15368 y enforcement_level=everyone. Esto acredita la presencia de esa protección y su aplicación declarada a todos. No demuestra por sí solo el rechazo de un push directo o forzado. La creación inicial de referencias sí fue admitida por las reglas, sin desactivarlas.

**Opciones declaradas por el propietario, sin corroboración detallada de API:** PR obligatorio, Require approvals desactivado, rama actualizada antes de merge, ausencia de bypass y force pushes/borrado deshabilitados. El endpoint de protección y la consulta GraphQL de branchProtectionRules siguen devolviendo HTTP 403 por falta de acceso administrativo de lectura. Por ello no se presenta strict=true, el número cero de reviews ni los bloqueos de force/delete como resultados leídos de la API o ensayos realizados. No se ha reducido ninguna regla ni se ha ejecutado merge, force push, borrado o bypass para comprobarlas.

**Estado remoto y pendientes:** master conserva `214a3c16ad5e968214af540033246baa9dd32ba1` y continúa predeterminada. Auto-merge sigue false. Squash y rebase siguen true y requieren intervención administrativa para ajustarlos al flujo aprobado de merge commits. No se han configurado Environments ni secretos. En main todavía falta exigir promotion además de quality; no se declara la protección final completa ni Fase A terminada.

**Ensayo de promotion preparado, todavía pendiente de resultado:** un PR técnico en borrador desde feature/i03-preparacion-segura hacia main, con cambios exclusivamente documentales, permitirá observar que se emite promotion desde el código de base y que falla por origen distinto de staging. No es una promoción ni se fusionará. Después de observar el check y su emisor, el propietario podrá añadirlo como obligatorio a main sin retirar quality o strict. No se inventan aquí un número de PR ni un resultado aún no registrado.

**Intervención administrativa pendiente:** añadir promotion a main, comprobar las opciones detalladas que la credencial no puede leer, desactivar squash/rebase y preparar Environments con ramas exactas, sin reviewers de deployment. Esto puede realizarlo el propietario desde GitHub o mediante una conexión con la capacidad administrativa necesaria. No compartir tokens por chat ni ampliar permisos automáticamente. Evidencias de creación y lectura en `.local/verification/i03/phase-a/manual-rules/{staging,main}-{create,readback}.json`; denegaciones de lectura en rules-before.json y protection-before.json. La evidencia anterior se conserva en el directorio bootstrap.

**Cloudflare:** no hay Account ID/tokens configurados en el entorno; no se ha creado, modificado ni publicado ningún Worker. La creación inicial documentada requiere deploy administrativo, fuera de esta fase. Quedan pendientes autorización específica, bootstrap y dos tokens account-owned Editor restringidos por Worker; después prueba real de denegación cruzada. No hay credencial general alternativa en CI. Si el aislamiento falla, detener activación afectada y pedir aprobación antes de cambiar el modelo.

**Límites de evidencia:** los mocks prueban lógica, no capacidades remotas ni ausencia de carreras frente a GitHub/Cloudflare reales. IDs de versión Cloudflare y estado activo tras timeout, dos ciclos válidos, separación efectiva, HTTP 301/404 real, artefacto servido, smoke y rollback siguen pendientes de Fase B. Main debe mantener strict=true; no se propone desactivarlo para sortear el bootstrap.

## Correspondencia con los 12 AC

| AC | Fase A y trabajo pendiente |
| --- | --- |
| AC1 | Autorización, identidad y CI padre corroborados; main y staging creadas desde el SHA aprobado y verificadas. Lectura/escritura administrativa detallada limitada. |
| AC2 | Batería local y pins comprobados; CI técnico success corroborado, app 15368. Quality obligatorio para todos comprobado en ambas ramas; ensayo de PR y bloqueo por checks pendiente. |
| AC3 | Ramas existentes, protected=true y quality obligatorio con enforcement everyone comprobados. PR/reviews/strict/force/delete declarados por el propietario; detalle API denegado y ensayos de rechazo/merge manual pendientes. Main aún requiere promotion. |
| AC4 | Separación preparada; creación/tokens/permisos reales detenidos antes de publicación. |
| AC5–AC7 | Hosting, manifiesto y suite preparados; publicación/separación HTTP/pruebas remotas pendientes Fase B. |
| AC8 | Gates negativos locales y strict=true preservado como requisito y configuración declarada por el propietario. Falta promotion obligatorio en main; carreras/ensayos reales y cualquier sustitución requieren evidencia y aprobación posterior. |
| AC9–AC10 | Workflows inactivos y equivalencia preparada; promoción, publicación y smoke reales pendientes Fase B. |
| AC11 | Rollback restringido preparado, nunca ejecutado; ensayo inicial autorizado en staging pendiente. |
| AC12 | Guía distingue preparación, merge manual individual, futuro deploy automático, coste y recuperación; aceptación final pendiente. |

## Punto de parada

El bootstrap inicial está completado: main y staging existen en 73b8bd2 y las reglas no impidieron su creación. Fase A permanece En curso y parcial: falta promotion obligatorio en main, corroborar detalles de las protecciones y completar opciones administrativas y Environments. El ensayo del PR técnico sigue pendiente de su evidencia. No habilitar Fase B, publicar, promover, cambiar la predeterminada ni reducir controles para resolver estas limitaciones.

Commits técnicos locales hasta la integración: `79f31a3` prepara infraestructura con publicaciones bloqueadas; `4690c27` incorpora únicamente ascendencia de master (árbol sin cambios respecto a su primer padre); `b9ecd19` conserva las pruebas del checkout limpio. Los hashes de I-01/I-02 y origin/master siguen siendo ancestros, sin reescritura. Las actualizaciones documentales posteriores de la rama técnica no mueven las ramas creadas desde el commit aprobado.

`a49c705` corrige la sintaxis nativa y conserva la evidencia actualizada. `f4430f0` incorpora el proceso asíncrono y cierra la evidencia local; está subido a origin/feature/i03-preparacion-segura, con identidad de tip confirmada por ls-remote y CI satisfactorio. La ejecución del proceso futuro Wrangler se ajustó después a spawn asíncrono sin shell para propagar correctamente salida/fallos, con pruebas inocuas del proceso; no se ejecutó deploy.

El primer ensayo del CLI real detectó `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`: una parameter property no admitida por Node 24 en modo strip-only, que Vitest transformaba. Se sustituyó por campos/asignaciones ordinarios y se añadieron pruebas con subprocess del Node real, sin nuevas dependencias ni cambios de arquitectura. Los archivos temporales, paquetes de prueba, capturas y evidencias ignoradas quedan fuera de Git.

## Reproducción del estado Git al cierre

`git log --graph --oneline --all` conserva los hashes anteriores; `git merge-base --is-ancestor` comprueba I-01, I-02 y origin/master contra HEAD. La integración `4690c27` tiene el mismo árbol que `79f31a3`; los cambios posteriores son correcciones/pruebas/documentación de Fase A. El dry-run del push técnico a `feature/i03-preparacion-segura` pasó. La comprobación final remota se conserva en `.local/verification/i03/phase-a/ls-remote-after-push.txt`; en la actualización posterior el CI padre ya se corroboró por API y las opciones administrativas detalladas siguen limitadas por permisos, aunque el propietario pudo configurar las reglas manualmente y se completó la creación inicial de ramas. La lectura pública inicial también acredita Success del run indicado. La única escritura posterior en staging/main es su creación inicial aprobada en 73b8bd2; no se cambió master ni la predeterminada.

La actualización documental previa de 73b8bd2 solo documenta el CI ya observado; no cambia código, workflows, contratos o configuración. Un nuevo push documental puede generar otro run normal de quality, sin activar publicaciones. El commit probado `f4430f0` continúa siendo el punto de evidencia del código.

El intento autorizado de crear GitHub Environment staging con reviewers vacíos y política de ramas explícita devolvió403 Resource not accessible by integration, cabecera administration=write. No se creó ni se intentó production tras esa denegación. Evidencia: manual-rules/environment-staging-attempt.json.
