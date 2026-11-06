# I-03 — primera publicación de MiMiniApp en staging

**Estado, 2026-11-06:** el propietario autoriza aplicar el parche de activación condicionada en la rama del PR #3, volver a probar y actualizar el PR. El parche está aplicado; no se autoriza configurar la variable de publicación, fusionar o desplegar. I-03 continúa `En curso`; `master` sigue siendo la rama predeterminada.

## Responsabilidades y situación inicial

El propietario administra Cloudflare y sus credenciales. Ha creado `miminiapp-staging` con la plantilla básica de Cloudflare y declara configurados en GitHub Environment `staging` el secreto `CLOUDFLARE_API_TOKEN` —Editor account-owned limitado a ese Worker— y la variable `CLOUDFLARE_ACCOUNT_ID`. No se solicitan sus valores ni credenciales administrativas.

Codex prepara código, pruebas y PR; GitHub Actions realizará las llamadas Cloudflare, publicación y comprobaciones remotas después de la autorización correspondiente. La conectividad de Codex con Cloudflare no es un requisito de este procedimiento. No se configura producción ni se cambia la rama predeterminada.

La URL declarada de staging es `https://miminiapp-staging.miminiapp-lab.workers.dev`. La existencia de la plantilla y el alcance del token provienen de la confirmación del propietario; este PR no los presenta como resultados ya comprobados contra Cloudflare por Codex o Actions.

## Qué conserva el PR

Se reutilizan el build estático, la configuración de Static Assets, Wrangler 4.158.0, Node/npm y Chromium fijados, las acciones por SHA, los permisos de lectura de GitHub y la batería de CI. Se mantiene el artefacto inmutable: primero se prueba el build, después se empaqueta sin reconstruirlo, y el job privilegiado descarga su ID, verifica digest, manifiesto y hashes antes de escribir.

El gate exige un `push` al ref exacto `refs/heads/staging`, en el repositorio esperado, derivado de un PR protegido fusionado manualmente por el propietario y con checks correctos. Vuelve a comprobar la procedencia y el estado actual bajo el bloqueo compartido `miminiapp-publicacion`. Un PR abierto, una rama distinta, otro actor o un candidato obsoleto no constituyen autorización de publicación.

Tras una publicación autorizada, la suite remota comprobará la identidad servida y ES/EN, rutas, raíz 301, barras, 404, recursos, responsive y accesibilidad. El recibo solo se genera si esas pruebas pasan y queda asociado al mismo artefacto/run/intento.

## Comprobación del token sin modificar recursos

Antes del paso Wrangler, GitHub Actions ejecutará `probe-staging-access` en Environment `staging`, después de verificar autorización, merge y artefacto. El cliente usa únicamente peticiones `GET` a `api.cloudflare.com`, con rutas fijas para la cuenta configurada y `miminiapp-staging`; no acepta un destino arbitrario, no crea recursos y no cambia permisos. El secreto solo se entrega a ese paso y al paso de publicación, nunca a la instalación, build, CI de PR o variables globales del job.

El probe comprueba lectura de settings y workers.dev de staging. Intenta verificar el estado del token account-owned cuando ese endpoint sea legible y consulta solo por lectura el nombre fijo `miminiapp` como comprobación negativa. Una respuesta legible del otro Worker bloquea la publicación; una respuesta 403 acredita esa denegación de lectura. Un 404 se registra como inconcluso: producción puede no existir y un 404 no demuestra aislamiento.

El informe saneado `.local/staging-access.json`, también impreso como JSON en el log del job, distingue `scopeEvidence=owner-attested-per-worker-editor` de las respuestas realmente observadas y conserva `writeIsolation=not-tested`. No muestra token, headers de autenticación o cuerpos sin filtrar. Leer staging o recibir un 403 en un GET no prueba que no se pueda escribir en otro Worker. La política Editor restringida la configura el propietario; la prueba real de aislamiento de escritura y los ensayos de producción quedan pendientes de otro alcance autorizado. No se amplían permisos si una comprobación falla.

Esta comprobación real todavía no se ha ejecutado. Los tests locales usan respuestas simuladas; no sustituyen el resultado de Actions con el secreto real. Para respetar la separación de secretos, no se ejecuta desde un PR sin fusionar ni desde una feature branch. Tampoco se depende de un dispatch manual: `master` no contiene el workflow y su cambio está fuera de esta autorización.

## Bloqueos vigentes

En la rama del PR #3 el parche aprobado establece `phase=B`, `deploymentsEnabled=true` y `targets.staging.deploymentsEnabled=true`. Sus dos jobs exigen conjuntamente evento push, ref staging, repositorio correcto y `I03_STAGING_PUBLICATION_AUTHORIZED == 'true'`; el publicador también exige éxito de prepare. La variable no se configura en esta preparación y el PR continúa sin fusionar. Las ramas protegidas conservan la política anterior cerrada. Producción conserva `targets.production.deploymentsEnabled=false` y todos sus jobs deshabilitados, igual que rollback; `promotionEnabled=false` y `rollbackEnabled=false`.

El check obligatorio `promotion` permanece presente, pero falla explícitamente hasta una autorización separada. Se evita marcarlo como omitido/verde y permitir una promoción por accidente. Un permiso o flag de staging no autoriza producción, promoción o rollback. La variable global antigua `I03_PHASE_B_AUTHORIZED` no activa staging: se utiliza la autorización específica `I03_STAGING_PUBLICATION_AUTHORIZED`.

## Revisión y activación exactas

1. Revisar el PR [#3](https://github.com/aalexlpez/miminiapp/pull/3), sus pruebas y el [patch aprobado](staging-publication-activation.patch), conservado como evidencia histórica. **Ya aplicado** en la misma rama por autorización expresa de preparación técnica; no volver a aplicarlo ni interpretar esa autorización como permiso de publicación.
2. Revisar el diff y el nuevo CI. El parche afecta exclusivamente a `.github/deployment-policy.json`, `.github/workflows/staging.yml` y la expectativa explícita de `tests/unit/workflow-safety.test.ts`. Abre solo el destino staging de forma condicionada; producción, promoción y rollback permanecen bloqueados. Las pruebas asociadas fijan el contexto exacto, el flag exacto y el fallo obligatorio antes de Wrangler. La documentación registra el alcance autorizado, sin modificar la aplicación o los secretos.
3. **Parada obligatoria actual:** entregar el commit, diff y CI; esperar otra autorización expresa del propietario para la primera publicación. Solo después de esa aprobación y con `quality` verde el propietario configura en **Settings → Secrets and variables → Actions → Variables del repositorio** `I03_STAGING_PUBLICATION_AUTHORIZED=true`. Debe ser de repositorio porque `prepare` no usa Environment. El flag por sí solo no publica desde una feature branch o PR abierto. No se configura en esta tarea.
4. El propietario pasa el PR de borrador a listo para revisión y lo fusiona manualmente con merge commit hacia `staging`. Codex no realiza ese merge. No desactivar strict, PR, checks, restricciones del Environment o prohibiciones de bypass/force/delete. Ni aplicar el patch ni fijar el flag autoriza a Codex a fusionar.
5. El `push` del merge protegido inicia Actions: gates y pruebas → artefacto → revalidación bajo bloqueo → probe de lectura → autorización otra vez → Wrangler sobre el Worker staging existente → pruebas remotas → recibo. El probe y publish usan el comportamiento normal de éxito de Actions, sin `continue-on-error` ni condiciones que ignoren fallos; el paso de evidencia `always()` no convierte en éxito un probe fallido. Además publish repite y espera el probe antes de invocar Wrangler. Si el probe o cualquier gate falla, no se ejecuta la escritura. El resultado real del probe se conocerá aquí, antes de escribir, no durante la revisión de un PR sin secretos.
6. Revisar el run, manifiesto servido, pruebas remotas y recibo. Registrar éxito o fallo y sus límites. Ante un fallo o timeout de Wrangler, no asumir ausencia de efectos ni repetir con permisos más amplios; comprobar el estado realmente servido y decidir el siguiente paso con el propietario. No hay rollback automático autorizado.

Aplicar el parche en el PR no ejecuta los pasos posteriores de variable, merge o publicación. Para las publicaciones semanales, una vez activado y verificado el circuito, la variable puede permanecer activa: el control humano seguirá siendo revisar y fusionar cada PR a staging, sin aprobación adicional de deployment. Una futura producción necesita su propia autorización y comprobaciones.

## Evidencia y límites

El cierre del PR de preparación registrará sus verificaciones efectivamente ejecutadas; no se inventan resultados de CF o una URL validada antes del run autorizado. La configuración administrativa detallada, secreto y variables de GitHub pueden seguir sin ser legibles por la integración: se distingue esa limitación de un fallo del token.

La información histórica de Fase A y del intento anterior de bootstrap se conserva en sus informes. La nueva distribución sustituye el requisito de dar un Admin a Codex: no crear ni introducir `CLOUDFLARE_BOOTSTRAP_API_TOKEN` para este flujo. Si permanece como requisito en el borrador de entorno de Codex, el propietario puede retirarlo de esa configuración; no es necesario sustituirlo por otro secreto Cloudflare en Codex.

La cuenta de destino se fija por su SHA-256 en la política versionada. La variable de Account ID se compara antes de cualquier petición Cloudflare; una cuenta distinta se rechaza aunque tenga un Worker con el mismo nombre. El informe saneado del probe se conserva como artefacto de Actions durante siete días y no incluye el token, su identificador o cuerpos de respuesta. Un 401 cierra el flujo; no se interpreta como prueba de un scope correcto.
