# Fiabilidad y entrega

**Actualizado:** 2026-11-16. **Responsable:** propietario de MiMiniApp. Contrato aprobado en la [enmienda de I-03](../design-docs/index.md#enmienda-del-2026-11-16--promoción-entre-repositorios); implementación y límites en el [informe](../reports/i03/contract-verification-2026-11-16.md).

## Desarrollo y staging

En `aalexlpez/miminiapp`: feature → PR a staging → quality funcional → revisión y merge manual → GitHub Actions verifica, empaqueta, publica solo staging y ejecuta pruebas remotas. Staging usa el build probado sin reconstruirlo. Los secretos del Environment staging solo llegan a sus pasos de publicación; el desarrollo y CI de PR no necesitan credenciales Cloudflare.

## Promoción y producción

En `soycerobytes/miminiapp`: el propietario inicia prepare-release manualmente desde main con el SHA completo publicado y validado. Se comprueban identidad HTTPS de staging, repo/ID/SHA/tree, pruebas y procedencia, pin del workflow y vigencia de refs/evidencia. Se sincroniza el snapshot completo con altas, cambios y bajas, preservando controles propios y excluyendo secretos; sin autorización individual de miniapps.

La release añade un commit con único padre del destino, sin importar historial del origen. Se prepara rama y PR y se solicita una única quality ligera de procedencia/integridad, sin repetir pruebas funcionales. El propietario revisa diff y evidencia vigente y fusiona manualmente a main. No hay auto-merge. **Cloudflare Workers Builds es el único publicador de producción:** reconstruye el código; no exige identidad binaria con staging. Los antiguos workflows de publicación de Actions siguen inactivos.

## Protecciones, fallos y recuperación

Conservar los controles de producción; esta documentación no cambia reglas ni permisos. La PR #7 acreditó quality satisfactorio, merge del propietario y publicación de Workers Builds. El ruleset observado exige PR y bloquea borrado/force push, pero no exige quality como status check: comprobar su resultado y vigencia antes del merge manual. Las relecturas detectan concurrencia durante verificación; si cambia el candidato/base después, volver a validarlo.

Ante fallo o timeout, inspeccionar la versión/evidencia reales antes de declarar éxito o repetir. Una preparación obsoleta se rehace; no actualizar release/* mediante merges ni sobrescribir ramas. La recuperación se propone por PR revisado y merge humano, sin reset/force push, auto-merge ni activación del rollback antiguo. No se ha ensayado ese rollback y ya no es criterio de cierre del contrato actual.

## Límites y coste

Objetivo 0 USD/mes sujeto a cuotas reales. Sin SSR, backend o estado remoto anticipados. No se afirma SLA, auditoría completa de secretos o prueba de aislamiento de escritura de staging contra producción. Un GET/403 no demuestra esa propiedad. La operación de staging está en la [guía](../guides/staging.md); los nueve criterios y la aceptación se registran en [I-03](../exec-plans/completed/I-03-github-actions-y-cloudflare.md).
