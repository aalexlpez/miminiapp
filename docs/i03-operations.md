# Operación I-03 — staging mediante GitHub Actions

**Actualizado:** 2026-11-06. **Responsable:** propietario de MiMiniApp. I-03 está `En curso`. Se autoriza preparar e implementar los cambios en una rama y abrir el PR a staging; no fusionarlo, activar publicadores o desplegar. `master` permanece predeterminada.

## Responsabilidades actuales

El propietario administra Cloudflare y sus credenciales. Ha creado `miminiapp-staging` con la plantilla básica y declara configurados el secreto Editor restringido al Worker y el Account ID en GitHub Environment `staging`. Codex desarrolla, prueba y prepara los PR; GitHub Actions ejecutará las comprobaciones y publicaciones autorizadas. No se necesitan red o credenciales Cloudflare en Codex ni un token Admin de bootstrap.

El procedimiento completo de la primera publicación está en [Puesta en marcha de staging](i03-staging-startup.md). La URL declarada es `https://miminiapp-staging.miminiapp-lab.workers.dev`; su estado y el contenido MiMiniApp deberán comprobarse desde Actions, sin presentar una comprobación aún no ejecutada como un resultado.

## Historial y configuración conservados

El bootstrap de ramas dejó main y staging en `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`, con I-01, I-02 y master como ancestros. Master conserva `214a3c16ad5e968214af540033246baa9dd32ba1` y sigue predeterminada. No hacer reset, force push o movimientos directos de ramas protegidas.

La revisión de cierre de Fase A corroboró `quality` en staging y `quality`+`promotion` en main, todos de GitHub Actions app 15368 para todos los usuarios; solo merge commits, sin squash/rebase/auto-merge. Environments `staging` y `production` con una rama exacta respectivamente `staging` y `main`, sin reviewers o espera. Los JSON de `deploy/github/` son plantillas, no prueba por sí solos de aplicación.

PR obligatorio, reviews=0, strict=true y prohibiciones de bypass/force/delete son configuración confirmada por el propietario; el detalle administrativo permanecía denegado 403. La lectura de secretos y variables tampoco acredita sus valores o ausencia cuando esté denegada. No solicitar esos valores por chat, imprimirlos o ampliar permisos para terminar una verificación.

El PR técnico #2, cerrado sin merge, emitió promotion. El propietario revisó su log y confirmó `Promotion is not the current same-repository staging to main pull request.` Es evidencia humana de rechazo de origen, no una lectura automática del log ni prueba de todas las garantías. No repetir esa revisión ni convertir un draft bloqueado, dry-run o push sin cambio en evidencia de enforcement.

## Primer despliegue de la web

El PR actual conserva todos los publicadores bloqueados. El [patch propuesto](staging-publication-activation.patch) cambia solo la política y condiciones de staging y su expectativa de auditoría, pero no está aplicado. Después de una autorización expresa de primera publicación, se aplicará en la rama de trabajo, se verificará CI y el propietario revisará el diff final, configurará la variable de repositorio `I03_STAGING_PUBLICATION_AUTHORIZED=true` y decidirá el merge manual a staging. No cambia la predeterminada ni habilita producción.

Las condiciones exigen push al ref exacto staging y repositorio correcto. El CLI vuelve a comprobar la autorización y el contexto antes de usar credenciales; verifica PR fusionado por el propietario, checks y procedencia. El artefacto probado se empaqueta una vez y se descarga por ID/digest. Bajo el bloqueo compartido se repiten la comprobación de candidato y la integridad antes de cualquier escritura.

El probe Cloudflare se ejecutará únicamente desde Actions, en Environment staging, con peticiones GET fijas. Los secretos se limitan a ese paso y al de Wrangler, después de los gates, nunca a PR, build, instalación o env global. Leer staging no prueba aislamiento de escritura. Un 403 al leer otro Worker se registra como denegación de lectura; un 404 es inconcluso y no demuestra que el token esté restringido. La política per-Worker es declaración del propietario; las demás pruebas de seguridad quedan pendientes del alcance que se autorice.

Tras publicar, las pruebas remotas comprobarán la identidad del artefacto servido y ES/EN, rutas, responsive, teclado, axe, recursos y ausencia de fixtures/borradores. El recibo solo se genera con esas pruebas satisfactorias. La verificación local del PR no se presenta como prueba del secreto real o del despliegue: esos pasos todavía no se han ejecutado.

## Producción, promoción y recuperación

Producción y rollback mantienen todos sus jobs con condición falsa y autorización de destino desactivada. Promotion mantiene un check que falla explícitamente hasta autorización separada, en vez de omitirse como verde. Ningún flag de staging concede acceso a otro destino. No hay credenciales de producción declaradas por el propietario ni se crean recursos allí.

El flujo futuro, una vez aprobado y verificado, será feature → PR a staging → quality → revisión/merge manual → staging automático → pruebas remotas. La promoción a main y producción necesitan otra autorización y comprobaciones antes de activarse. No hay segunda cuenta o revisión independiente: el propietario revisa y decide el merge; los workflows no fusionan.

No ejecutar merges, force push o borrados para obtener evidencia de controles. Ante un fallo de escritura o timeout, consultar la identidad realmente servida y la versión activa: el error no demuestra que no haya publicación. No ampliar permisos, reconstruir silenciosamente otro artefacto o activar rollback como alternativa automática. Captura de IDs Cloudflare y resolución de timeout deberán acreditarse cuando se autorice la ejecución real.

Rollback es una operación excepcional posterior desde una ref protegida y con artefacto previo validado. Usa workflow_dispatch; master todavía no contiene el workflow. No prometer un botón de dispatch operativo ni cambiar la predeterminada para resolverlo en esta preparación. Acordar y autorizar esa secuencia cuando corresponda.

## Credenciales, retención y evolución

El token `CLOUDFLARE_API_TOKEN` y la variable `CLOUDFLARE_ACCOUNT_ID` pertenecen solo a Environment staging. No copiar el secreto a Codex, secretos de repositorio o producción; no usar OAuth, Admin o Workers Scripts: Edit general como sustituto. Si una comprobación encuentra acceso inesperado o no puede demostrar un alcance, registrar la limitación y detener el paso afectado antes de ampliar permisos.

El requisito anterior `CLOUDFLARE_BOOTSTRAP_API_TOKEN` del borrador de entorno de Codex ha quedado obsoleto para este flujo. Si sigue visible, el propietario puede retirarlo en la configuración; no tiene que suministrar su valor ni habilitar conectividad Cloudflare en Codex. El bootstrap manual comunicado sustituye el intento anterior del agente, cuyos resultados históricos se conservan.

Retención: evidencia de fallos 7 días y artefactos/recibos 30 días; no promover candidatos expirados. Objetivo 0 USD/mes sujeto a cuotas reales y límites de almacenamiento. No activar Workers Builds u otro segundo publicador. Si se incorpora otro colaborador, las reviews obligatorias se habilitarán mediante protecciones con un revisor elegible, sin rediseñar los workflows o añadir aprobación extra de deployment.
