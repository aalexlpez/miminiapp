# Operación I-03 — preparación segura

**Actualizado:** 2026-11-06. **Responsable:** propietario de MiMiniApp. Fase A autorizada; Fase B no autorizada. Esta guía no activa publicaciones. Estado/evidencia: [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md), [informe](i03-phase-a-report.md).

## Configuración inicial y límites actuales

Repositorio `aalexlpez/miminiapp`. Conservar `master` y los commits aceptados `0288de5`/`567b394`; nunca reset, force push o rebase destructivo. No cambiar aún la rama predeterminada. La rama técnica `feature/i03-preparacion-segura` separa esta preparación de promociones.

Los cuerpos JSON de `deploy/github/` son configuración deseada, no prueba de aplicación. Al recuperar la API se deberá consultar primero identidad/ID/visibilidad/capacidades, ramas, checks existentes, integraciones y protecciones. Aplicar después únicamente la configuración autorizada y leerla de nuevo. Vincular los checks a la aplicación GitHub Actions comprobada cuando lo permita la API; no confiar en un contexto homónimo de otro emisor.

* Repositorio: auto-merge desactivado; merge commits habilitados, squash y rebase deshabilitados. No hay cambio de `default_branch` en el cuerpo preparado.
* `staging`: PR obligatorio, cero reviews, `quality`, strict=true, administrador incluido, sin force push/borrado ni bypass preparado.
* `main`: lo anterior más `promotion`; strict=true se mantiene. Ninguna prueba local permite sustituirlo.
* Environments `staging`/`production`: sin reviewers y espera cero; políticas de rama exacta `staging`/`main` respectivamente, sin tags. `environment.json` prepara el contenedor; las políticas de rama se crean y verifican por separado antes de cualquier secreto.
* Variables por Environment, posteriormente: `CLOUDFLARE_ACCOUNT_ID`; secreto `CLOUDFLARE_API_TOKEN` distinto en cada Environment. No poner tokens en variables, archivos, PR, logs o argumentos de shell. No configurar credenciales Cloudflare de repositorio u organización como sustituto.

Las comprobaciones negativas de push directo, force y borrado se diseñarán para no perder contenido; un dry-run no demuestra enforcement. Leer la configuración no basta: verificar los rechazos reales con el propietario sujeto a las reglas. Si una capacidad falta, registrar el bloqueo, sin desproteger para terminar el ensayo. CI debe ejecutarse realmente en GitHub y sus resultados deben observarse; la batería local no lo sustituye.

## Bloqueo de arranque inicial

El `master` remoto `214a3c1` no contiene los workflows ni `scripts/release/`. El plan aprobado parte de crear staging/main desde ese commit; sin embargo el primer gate de promoción carga código desde `base.sha`. No puede ejecutarse desde una base que todavía no lo contiene. No se añade una excepción verde, un bypass o un checkout arbitrario del PR.

**Propuesta pendiente de aprobación expresa:** después de revisar el commit técnico y comprobar que conserva los tres historiales, crear inicialmente `staging` y `main` en ese commit integrado, con todos los publicadores aún bloqueados. Aplicar y verificar las protecciones y ejecutar CI antes de habilitar cualquier despliegue. Esto cambia el origen inicial de las ramas previsto en el plan; no se ejecuta por autorización implícita. No se han creado esas ramas para evitar fijar una solución sin aprobar. Si ya existieran al reanudar, volver a inventariarlas y acordar un procedimiento que preserve su historia.

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
