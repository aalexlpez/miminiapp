# Operación I-03 — preparación segura

**Actualizado:** 2026-11-06. **Responsable:** propietario de MiMiniApp. Preparación de Fase A completada y comprobaciones disponibles de configuración satisfechas, con limitaciones documentadas; I-03 continúa En curso y Fase B no autorizada. Esta guía no activa publicaciones. Estado/evidencia: [ExecPlan](exec-plans/active/I-03-github-actions-y-cloudflare.md), [informe](i03-phase-a-report.md).

## Configuración actual y límites

Repositorio `aalexlpez/miminiapp`. Main y staging permanecen exactamente en `73b8bd2c1d3fc0e2f0161af9df9897d16b51ade8`, con los cierres aceptados I-01/I-02 y master como ancestros. Master conserva `214a3c16ad5e968214af540033246baa9dd32ba1` y sigue predeterminada. No mover esas ramas al siguiente commit documental, resetear, hacer force push o reinterpretar el bootstrap como promoción.

Los JSON de `deploy/github/` son plantillas, no prueba de aplicación. La evidencia actual de cierre en `.local/verification/i03/phase-a/closure/` acredita:

* Opciones de merge correctas: merge commits habilitados; squash, rebase y auto-merge deshabilitados. No hay otro ajuste pendiente de esas opciones.
* Staging protegida con quality de GitHub Actions app 15368, enforcement_level=everyone.
* Main protegida con quality y promotion obligatorios, ambos de GitHub Actions app 15368 y enforcement_level=everyone. La lectura posterior al nuevo guardado de la regla resuelve la discrepancia anterior; no volver a pedir su configuración.
* Environment staging existente y limitado a una política de tipo branch con nombre exacto staging. Environment production limitado de igual modo a main. Ambos usan custom_branch_policies=true, protected_branches=false y solo tienen regla branch_policy: sin reviewers o regla de espera. No repetir su creación ni ampliar esas ramas o admitir tags.

PR obligatorio, cero approvals, strict=true, ausencia de bypass y force/delete deshabilitados son configuración declarada por el propietario. GET de protección detallada sigue denegado con 403; no se afirma haber leído esos campos o probado empíricamente sus rechazos. La consulta de secretos y variables de repositorio y Environments también está denegada: el propietario declara que no los ha creado, pero la API no permite corroborar su ausencia total. No solicitar ni imprimir valores por chat.

## Check de promoción y alcance de su evidencia

La revisión anterior en final-github solo mostraba quality en main. El propietario volvió a guardar la regla y closure/main.json ya confirma quality y promotion de GitHub Actions. Se mantiene ese historial, sin tratar la observación anterior como un ajuste todavía pendiente. Conservar ambos checks, strict=true, PR obligatorio, cero approvals y ausencia de bypass; no cambiar silenciosamente esas opciones.

El [PR técnico #2](https://github.com/aalexlpez/miminiapp/pull/2) se abrió en borrador con delta documental y se cerró sin merge. Promotion de app 15368 terminó failure en su paso de gate. El propietario revisó el log en GitHub y confirmó personalmente: `Promotion is not the current same-repository staging to main pull request.` Esa confirmación es evidencia humana del propietario; no se presenta como lectura de los logs por el agente o por API, cuyo acceso estaba bloqueado.

No repetir esa revisión ni pedir acceso de red para volver a confirmar el mismo error. El resultado no sustituye los ensayos de obsolescencia, concurrencia, artefactos distintos, reruns, rechazos de direct/force/delete o merge válido. El estado blocked de aquel draft tampoco acredita por sí solo enforcement del check obligatorio.

Un dry-run, push sin cambio o rechazo de permisos de la integración no demuestra enforcement. No ejecutar merges, force push o borrados que puedan alterar historia para obtener evidencia. Documentar las verificaciones que no se pueden realizar con seguridad o permisos suficientes y conservar strict=true.

## Publicadores bloqueados

Las cinco definiciones de Actions están fijadas por SHA. CI y el gate de PR pueden correr sin credenciales Cloudflare; todos los jobs de staging, producción y rollback tienen condición literal falsa. `.github/deployment-policy.json` conserva phase=A y deploymentsEnabled=false. El comando de publicación exige una activación adicional y rechaza antes de leer credenciales, acceder a la red o ejecutar Wrangler. Una variable de GitHub por sí sola no activa un despliegue.

Los runs del bootstrap de Staging y Production terminaron skipped; deployments sigue vacío. No se crearon Workers, tokens o contenidos Cloudflare por esta ejecución. Conservar master predeterminada y los bloqueos versionados hasta autorización explícita; no activar Workers Builds u otro segundo publicador.

## Alcance que debe autorizarse para Fase B

La preparación de Fase A ya está completada, con los checks y configuración disponibles corroborados y los límites de acreditación registrados. No volver a pedir configuración de main, opciones de merge, Environments o lectura del error del PR #2. I-03 sigue En curso: las pruebas reales de B y de enforcement aún pendientes no se declaran satisfechas por este cierre.

La solicitud futura debe delimitar el bootstrap administrativo y las pruebas: creación de miminiapp-staging y miminiapp en la cuenta aprobada, primer contenido accesible si la creación requiere deploy, Account ID por canal seguro y creación posterior de dos account-owned tokens Editor, cada uno restringido a su Worker existente. La creación documentada requiere `wrangler deploy`, por lo que no se ejecuta en Fase A. Admin queda fuera de CI; no usar OAuth o permisos generales de cuenta como alternativa automática.

Si la fase autorizada se ejecutará desde Codex, preparar antes de sus llamadas el acceso de red a api.cloudflare.com y el suministro seguro del Account ID y token aprobado: el dominio no está permitido y las variables de proceso correspondientes no están presentes en la revisión actual. No publicar borradores de entorno ni instalar credenciales por esta comprobación. Una futura lectura automatizada de logs requeriría results-receiver.actions.githubusercontent.com, actualmente no permitido. El propietario ya confirmó el error del PR #2 desde GitHub, de modo que no hace falta ese cambio de red para repetir su comprobación. No confundir variables ausentes del proceso con una auditoría de secretos del repositorio o usar credenciales generales como sustituto.

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
