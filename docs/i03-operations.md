# Operación I-03 — preparación segura

**Actualizado:** 2026-11-06. **Responsable:** propietario de MiMiniApp. Fase A autorizada; Fase B no autorizada. Esta guía no activa publicaciones. Estado/evidencia: [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md), [informe](i03-phase-a-report.md).

## Configuración inicial y límites actuales

Repositorio `aalexlpez/miminiapp`. Conservar `master` y los commits aceptados `0288de5`/`567b394`; nunca reset, force push o rebase destructivo. No cambiar aún la rama predeterminada. La rama técnica `feature/i03-preparacion-segura` separa esta preparación de promociones.

Los cuerpos JSON de `deploy/github/` son configuración deseada, no prueba de aplicación. La API ya permite comprobar identidad, ramas y checks; los endpoints administrativos detallados siguen restringidos. Antes de cualquier cambio se consulta el estado vigente y después se vuelve a leer lo que permita la credencial. Vincular los checks a la aplicación GitHub Actions comprobada cuando lo permita la API; no confiar en un contexto homónimo de otro emisor.

* Repositorio, objetivo aprobado: auto-merge desactivado y solo merge commits. Estado leído: auto-merge false; squash/rebase aún true, pendientes de ajuste administrativo. No cambiar `default_branch`.
* `staging`, objetivo y configuración manual declarada: PR obligatorio, cero reviews, quality, strict=true, administrador incluido y sin force push/borrado. API comprobada: protected=true y quality de app 15368 obligatorio con enforcement everyone; los demás detalles siguen pendientes de corroboración.
* `main`: objetivo igual a staging más promotion obligatorio; actualmente la API solo muestra quality. Añadir promotion antes de considerar completa la preparación y mantener strict=true. Ninguna prueba local permite sustituirlo.
* Environments `staging`/`production`: sin reviewers y espera cero; políticas de rama exacta `staging`/`main` respectivamente, sin tags. `environment.json` prepara el contenedor; las políticas de rama se crean y verifican por separado antes de cualquier secreto.
* Variables por Environment, posteriormente: `CLOUDFLARE_ACCOUNT_ID`; secreto `CLOUDFLARE_API_TOKEN` distinto en cada Environment. No poner tokens en variables, archivos, PR, logs o argumentos de shell. No configurar credenciales Cloudflare de repositorio u organización como sustituto.

Las comprobaciones negativas de push directo, force y borrado se diseñarán para no perder contenido; un dry-run no demuestra enforcement. Leer la configuración no basta: verificar los rechazos reales con el propietario sujeto a las reglas. Si una capacidad falta, registrar el bloqueo, sin desproteger para terminar el ensayo. CI debe ejecutarse realmente en GitHub y sus resultados deben observarse; la batería local no lo sustituye.

## Bootstrap ejecutado y comprobaciones pendientes

El propietario aprobó crear inicialmente staging y main desde `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`, en lugar de master 214a3c1. Ambas ramas ya están creadas exactamente en ese SHA y la API las devuelve protegidas. Se conserva toda la ascendencia; f4430f0 es el padre inmediato con CI success corroborado y el delta a 73b8bd2 es documental. No cambiar ahora el origen o mover esas ramas al siguiente commit documental de la rama técnica.

El primer intento administrativo falló con 403. Después el propietario guardó manualmente las reglas y reiteró la creación; las reglas admitieron el bootstrap sin desactivarlas. GET de cada rama confirma quality de GitHub Actions app 15368 y enforcement_level=everyone. GET de protección y GraphQL detallado siguen denegados: PR, reviews=0, strict=true, ausencia de bypass y no force/delete son por ahora configuración declarada por el propietario, no evidencia detallada obtenida por esta credencial ni ensayo empírico de rechazo.

Main todavía necesita promotion obligatorio. Para emitirlo sin desplegar: preparar un PR técnico en borrador hacia main con cambios documentales reales, desde una rama distinta de staging. El workflow utiliza código de la base y debe fallar por origen no admitido, sin buscar un candidato Cloudflare. Registrar resultado y app del CheckRun; no fusionar el PR. El propietario podrá entonces añadir promotion en la regla de main, conservando quality y strict. El ensayo ya se realizó en el PR #2, cerrado sin merge: promotion de app15368 terminó failure en su paso de gate. Los logs exactos siguen bloqueados por results-receiver.actions.githubusercontent.com; no se atribuye una causa literal sin ellos ni se toma el estado blocked de un draft como prueba de enforcement del check.

Releer las protecciones cuando la capacidad lo permita. No usar dry-run, pushes sin cambio o un rechazo de permisos como prueba de enforcement. No ejecutar merges, force push o borrados que puedan alterar historial para obtener evidencia. Si una regla impide una operación necesaria, detenerse y acordar el procedimiento mínimo; no retirar controles de forma automática.

Conservar master intacto y predeterminado. Quedan también ajustes de squash/rebase, verificación administrativa detallada y Environments; la creación de ramas no cierra la Fase A ni habilita la Fase B.

## Cloudflare y punto de parada

Cuenta preparada por el propietario: Free, subdominio `miminiapp-lab.workers.dev`. Destinos futuros: Worker `miminiapp-staging` y Worker `miminiapp`, con orígenes HTTPS correspondientes. Configuración local en `deploy/cloudflare/`: Static Assets de `dist`, sin script/SSR, barras finales y `404-page`. `_redirects` reserva `/ /es/ 301`; Astro preview sigue respondiendo 200 en raíz.

`npm run validate:hosting` valida offline con Wrangler 4.158.0; no publica ni prueba permisos. No ejecutar `wrangler login` ni usar Admin en CI. La creación inicial documentada requiere `wrangler deploy`: queda detenida, al requerir publicación y autorización específica. Después del bootstrap administrativo autorizado, crear dos account-owned tokens Editor, cada uno limitado al Worker existente; comprobar operación permitida en destino y denegación real de modificación cruzada, sin alterar producción. Si no funciona, detener activación y presentar evidencia antes de proponer otra autorización. No recurrir automáticamente a Workers Scripts: Edit de cuenta.

## Preparación de publicación y operación semanal futura

Las cinco definiciones de Actions están fijadas por SHA. Solo CI y el gate de PR están preparados para correr; staging/producción/rollback tienen todos sus jobs desactivados. `.github/deployment-policy.json` conserva phase=A y deploymentsEnabled=false. El publicador exige además una activación separada y rechaza antes de leer tokens o invocar Wrangler. Cambiar solo una variable de GitHub no activa un despliegue.

La Fase B exige autorización expresa y revisión del cambio que levante los bloqueos versionados. Antes: controles GitHub efectivos, CI real satisfactorio, aislamiento Cloudflare demostrado y bootstrap resuelto. No activar Workers Builds u otro segundo publicador.

Una vez activado y verificado el circuito: feature → PR a staging → quality → revisión/merge manual del propietario → publicación automática a staging → pruebas remotas → PR staging→main → quality/promotion → revisión/merge manual → publicación automática a producción y smoke. Cero aprobaciones de otro usuario; `merged_by` acredita la cuenta actuante, no demuestra lectura independiente. Los workflows no hacen merges.

El paquete contiene `site/` y un manifiesto con hashes/ruta/procedencia. La identidad pública excluye secretos. La promoción descarga el artefacto exacto validado en staging por IDs inmutables y comprueba su digest, contenido, intento y árbol; no reconstruye. Debe coincidir también el manifiesto servido actualmente en staging. Los publicadores revalidan bajo `miminiapp-publicacion`, sin cancelar publicaciones en curso ni prometer FIFO.

## Recuperación, coste y evolución

Rollback excepcional: decisión manual del propietario, destino fijo y run previo validado, desde rama protegida. Inicialmente se ensayará solo en staging, con autorización. El workflow preparado vuelve a publicar el artefacto anterior; no admite código o URL arbitrarios. Captura efectiva de IDs de versión Cloudflare, estado real tras timeout y ensayo de restauración siguen pendientes de Fase B. Ante fallo no declarar éxito ni asumir que un timeout evitó publicar.

Retención: evidencias de fallo 7 días, candidatos/recibos hasta 30 días. Un candidato expirado no se promueve. Presupuesto objetivo 0 USD/mes: confirmar cuota Free Cloudflare, repositorio público/runner estándar gratuito y límites de artefactos antes de activar. Una alerta no es un bloqueo de gasto. Mantener la última versión recuperable; no confundir retención Actions con disponibilidad ilimitada.

Para incorporar otro colaborador bastará cambiar las protecciones a una o más aprobaciones requeridas, invalidarlas tras nuevos pushes y comprobar revisores elegibles; CODEOWNERS/último push solo tras acordarlos. No es necesario rediseñar los workflows ni añadir otra aprobación de deployment.

## Ajustes personales pendientes en GitHub

1. Settings → Branches → editar la regla de main: añadir el check `promotion` de GitHub Actions, ya emitido por el PR #2, y conservar `quality`, Require branches to be up to date, PR obligatorio y ausencia de bypass. No habilitar Require approvals en el escenario individual ni permitir force/deletions.
2. Settings → General → Pull Requests: conservar merge commits, desactivar squash y rebase; auto-merge ya está desactivado.
3. Settings → Environments: crear staging y production sin reviewers ni espera, con Selected branches and tags limitado a la rama staging y main, respectivamente. No crear secretos Cloudflare o variables de activación en este paso. La integración no pudo crear siquiera staging: PUT denegado403, administration=write requerido.
4. Revisar en GitHub el mensaje del paso fallido del [ensayo](https://github.com/aalexlpez/miminiapp/actions/runs/42211336925/job/127870423964) si se quiere corroborar la causa exacta; desde este entorno la lectura de sus logs está bloqueada. No retirar ninguna protección para ensayar un merge.

Estos ajustes completan preparación, no autorizan Fase B ni cambiar master como predeterminada. La comprobación posterior de required_status_checks podrá observar quality/promotion y su emisor mediante GET branch, aun cuando la lectura administrativa completa continúe limitada.
