# Operación I-03 — preparación segura

**Actualizado:** 2026-11-06. **Responsable:** propietario de MiMiniApp. Fase A autorizada y preparación técnica realizada, con verificación incompleta; Fase B no autorizada. Esta guía no activa publicaciones. Estado/evidencia: [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md), [informe](i03-phase-a-report.md).

## Configuración actual y límites

Repositorio `aalexlpez/miminiapp`. Main y staging permanecen exactamente en `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`, con los cierres aceptados I-01/I-02 y master como ancestros. Master conserva `214a3c16ad5e968214af540033246baa9dd32ba1` y sigue predeterminada. No mover esas ramas al siguiente commit documental, resetear, hacer force push o reinterpretar el bootstrap como promoción.

Los JSON de `deploy/github/` son plantillas, no prueba de aplicación. La revisión actual en `.local/verification/i03/phase-a/final-github/` acredita:

* Opciones de merge correctas: merge commits habilitados; squash, rebase y auto-merge deshabilitados. No hay otro ajuste pendiente de esas opciones.
* Staging protegida con quality de GitHub Actions app 15368, enforcement_level=everyone.
* Main protegida, pero la lectura repetida sin caché solo muestra quality de la misma app. Promotion todavía no aparece como obligatorio; rulesets y reglas activas de main devuelven listas vacías, sin una capa adicional observada que lo imponga.
* Environment staging existente y limitado a una política de tipo branch con nombre exacto staging. Environment production limitado de igual modo a main. Ambos usan custom_branch_policies=true, protected_branches=false y solo tienen regla branch_policy: sin reviewers o regla de espera. No repetir su creación ni ampliar esas ramas o admitir tags.

PR obligatorio, cero approvals, strict=true, ausencia de bypass y force/delete deshabilitados son configuración declarada por el propietario. GET de protección detallada sigue denegado con 403; no se afirma haber leído esos campos o probado empíricamente sus rechazos. La consulta de secretos y variables de repositorio y Environments también está denegada: el propietario declara que no los ha creado, pero la API no permite corroborar su ausencia total. No solicitar ni imprimir valores por chat.

## Discrepancia de main que falta resolver

El propietario informa de quality y promotion obligatorios; la evidencia disponible aún refleja solo quality. No se conoce la causa de la diferencia ni se modifica silenciosamente una regla para corregirla.

En Settings → Branches, revisar la regla que se aplica a main, conservar quality, Require branches to be up to date, PR obligatorio y ausencia de bypass, y guardar también promotion de GitHub Actions como obligatorio. Mantener Require approvals desactivado para el escenario individual y no permitir force/deletions. Volver a comprobar required_status_checks mediante GET branch y, cuando la capacidad lo permita, el detalle administrativo. Usar el emisor app 15368 comprobado, no un contexto homónimo de otro origen.

El check ya existe: el [PR técnico #2](https://github.com/aalexlpez/miminiapp/pull/2) se abrió en borrador con delta documental y se cerró sin merge. Promotion de app 15368 terminó failure en su paso de gate. El log literal está bloqueado desde Codex en results-receiver.actions.githubusercontent.com; no se atribuye una causa exacta sin leerlo ni se interpreta el estado blocked de un draft como prueba de enforcement del check. El propietario puede revisar el [paso del ensayo](https://github.com/aalexlpez/miminiapp/actions/runs/42211336925/job/127870423964) en GitHub sin retirar ninguna protección.

Un dry-run, push sin cambio o rechazo de permisos de la integración no demuestra enforcement. No ejecutar merges, force push o borrados que puedan alterar historia para obtener evidencia. Documentar las verificaciones que no se pueden realizar con seguridad o permisos suficientes y conservar strict=true.

## Publicadores bloqueados

Las cinco definiciones de Actions están fijadas por SHA. CI y el gate de PR pueden correr sin credenciales Cloudflare; todos los jobs de staging, producción y rollback tienen condición literal falsa. `.github/deployment-policy.json` conserva phase=A y deploymentsEnabled=false. El comando de publicación exige una activación adicional y rechaza antes de leer credenciales, acceder a la red o ejecutar Wrangler. Una variable de GitHub por sí sola no activa un despliegue.

Los runs del bootstrap de Staging y Production terminaron skipped; deployments sigue vacío. No se crearon Workers, tokens o contenidos Cloudflare por esta ejecución. Conservar master predeterminada y los bloqueos versionados hasta autorización explícita; no activar Workers Builds u otro segundo publicador.

## Alcance que debe autorizarse para Fase B

Antes de pedir la autorización, resolver promotion obligatorio en main y registrar con precisión los controles comprobados y las limitaciones restantes. Las opciones de merge y los Environments ya están acreditados; no pedir al propietario que vuelva a configurarlos.

La solicitud futura debe delimitar el bootstrap administrativo y las pruebas: creación de miminiapp-staging y miminiapp en la cuenta aprobada, primer contenido accesible si la creación requiere deploy, Account ID por canal seguro y creación posterior de dos account-owned tokens Editor, cada uno restringido a su Worker existente. La creación documentada requiere `wrangler deploy`, por lo que no se ejecuta en Fase A. Admin queda fuera de CI; no usar OAuth o permisos generales de cuenta como alternativa automática.

Si la fase autorizada se ejecutará desde Codex, preparar antes de sus llamadas el acceso de red a api.cloudflare.com y el suministro seguro del Account ID y token aprobado: el dominio no está permitido y las variables de proceso correspondientes no están presentes en la revisión actual. No publicar borradores de entorno ni instalar credenciales por esta comprobación. La lectura del log también requiere results-receiver.actions.githubusercontent.com, actualmente no permitido; revisar el error desde GitHub es una alternativa para esa evidencia. No confundir variables ausentes del proceso con una auditoría de secretos del repositorio o usar credenciales generales como sustituto.

El aislamiento real no puede estar ya probado antes de autorizar el bootstrap de recursos que aún no existen. Se comprobará dentro de la Fase B autorizada y limitada, **antes de activar los publicadores ordinarios**: Wrangler funciona en el destino permitido y una modificación con el token staging contra producción se deniega sin cambiar versión o assets. Si falla, detener activación afectada y presentar evidencia antes de una alternativa. No ampliar permisos automáticamente.

También deben completarse y comprobarse antes de operación ordinaria la captura de versión/deployment ID Cloudflare y la determinación del estado activo tras un timeout. Los mocks y la validación offline de Wrangler no prueban deploy, compatibilidad de Editor, recuperación o ausencia de carreras reales. Las pruebas remotas, equivalencia del artefacto servido y ensayo inicial de rollback en staging se ejecutarán solo con autorización que los cubra.

Secretos futuros: dos valores distintos llamados CLOUDFLARE_API_TOKEN, uno por Environment, y variable CLOUDFLARE_ACCOUNT_ID explícita. No usar secretos de repositorio como sustituto de la separación ni colocar Admin en CI. La provisión y uso pertenecen a la fase autorizada correspondiente; no crear secretos o variables de activación ahora.

La autorización del bootstrap y las pruebas no activa automáticamente el circuito semanal, no autoriza una promoción y no cambia la predeterminada. La activación ordinaria exige un cambio revisable de los bloqueos versionados, CI y permisos reales satisfactorios, y autorización expresa del propietario.

## Operación semanal futura

Una vez activado y verificado el circuito: feature → PR a staging → quality → revisión/merge manual del propietario → publicación automática a staging → pruebas remotas → PR staging→main → quality/promotion → revisión/merge manual → producción automática y smoke. No hay segunda cuenta ni aprobación independiente: merged_by acredita la cuenta actuante. Los workflows no fusionan PR y no se añaden reviewers de deployment.

El paquete contiene site y un manifiesto con hashes/procedencia, sin secretos. Producción descarga el mismo artefacto validado por IDs de run/intento/artefacto y comprueba digest, contenido, recibo y manifiesto servido actualmente en staging; no reconstruye. Los publicadores revalidan bajo miminiapp-publicacion, sin cancelar una publicación en curso ni prometer FIFO. Main mantiene strict=true hasta cualquier sustitución demostrada y aprobada expresamente; no reducirlo para resolver una divergencia.

## Recuperación, coste y evolución

Rollback excepcional: decisión manual del propietario, destino fijo y run previo validado desde rama protegida; no código o URL arbitrarios. Inicialmente se ensaya en staging bajo autorización. El workflow usa workflow_dispatch y master no contiene su archivo: no prometer dispatch operativo mientras siga ese estado. Acordar y autorizar posteriormente el cambio de predeterminada o la secuencia necesaria para la recuperación, después de los controles correspondientes; no cambiar master ahora ni considerar ese cambio implícito en el bootstrap Cloudflare.

El workflow preparado vuelve a publicar el artefacto anterior. Captura de IDs del proveedor, estado real tras timeout y restauración con smoke aún deben verificarse; un fallo o timeout no demuestra ausencia de publicación y no puede declararse verde. No hay rollback automático.

Retención: fallos 7 días, candidatos/recibos hasta 30. Un candidato expirado no se promueve; mantener la última versión recuperable. Objetivo 0 USD/mes: comprobar cuotas Free Cloudflare, runner estándar del repositorio público y límites de artefactos antes de activar. Una alerta no bloquea gastos; no asumir disponibilidad ilimitada.

Cuando haya otro colaborador, activar reviews obligatorias mediante protecciones con revisores elegibles; invalidarlas tras cambios y acordar CODEOWNERS/último push cuando corresponda. No rediseñar workflows ni añadir una segunda aprobación de deployment por ese cambio.
