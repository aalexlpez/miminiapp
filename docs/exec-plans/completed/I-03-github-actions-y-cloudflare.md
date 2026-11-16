# I-03 — Staging y promoción manual entre repositorios

## Control

* **Estado:** `Aceptado`.
* **Responsable de aprobación, autorización y aceptación:** propietario de MiMiniApp.
* **Creado / última actualización:** 2026-11-05 / 2026-11-16.
* **Dependencia satisfecha:** [I-02 aceptado](../completed/I-02-catalogo-responsive-e-i18n.md).
* **Contrato vigente:** nueve criterios indicados expresamente por el propietario el 2026-11-16; enmienda aprobada de ADR-MMA-004/008/009/014 en el [registro técnico](../../design-docs/index.md#enmienda-del-2026-11-16--promoción-entre-repositorios).
* **Autorización de esta revisión:** registrar el contrato y contrastar en lectura la implementación existente. No ejecutar promociones, merge, publicaciones, cambios de secretos o protecciones.
* **Aceptación:** el propietario acepta expresamente el resultado el 2026-11-16 mediante «quiero cerrar el I-03 también con los nuevos criterios», tras recibir la verificación de I03-C01–09 y sus limitaciones. Se registra Verificado → Aceptado y se archiva el plan en completed.

## Objetivo, alcance y exclusiones

Desarrollar y probar en `aalexlpez/miminiapp`, rama `staging`. Seleccionar manualmente el SHA completo publicado y validado. Preparar en `soycerobytes/miminiapp` una rama y PR con el snapshot completo de proyecto, conservando controles propios, excluyendo secretos y manteniendo historiales independientes. El propietario decide el merge a `main`; Cloudflare Workers Builds reconstruye y publica producción como único publicador.

No se exige reutilizar el artefacto binario de staging, autorizar cada miniapp, repetir pruebas funcionales en producción ni importar commits/merges del origen. El ensayo del rollback antiguo, dos promociones del mismo artefacto y el antiguo gate de promoción del repositorio de desarrollo dejan de ser criterios de cierre. No se declara demostrado el aislamiento de escritura por un 403 de lectura.

## Criterios actuales y resultado

Los identificadores I03-C01–09 sustituyen los antiguos I03-AC1–12, conservados en el [archivo histórico](../../reports/i03/legacy-plan-2026-11-16.md). La [verificación fechada](../../reports/i03/contract-verification-2026-11-16.md) contiene SHAs, enlaces, comprobaciones y límites.

| ID | Criterio aprobado | Contraste |
| --- | --- | --- |
| I03-C01 | Desarrollar y ejecutar las pruebas funcionales en staging, dentro de `aalexlpez/miminiapp`. | Run `43756652514`: `prepare` con verify y `remote-test` satisfactorios sobre `07b95fd6b168b9b03150a48a9541ddbd3767748e`. |
| I03-C02 | Iniciar la promoción manualmente, indicando el SHA completo publicado y validado. | `prepare-release.yml` exige dispatch en main y SHA de 40 caracteres; run `43831817035`, iniciado por soycerobytes, success. |
| I03-C03 | Comprobar identidad de staging, pruebas satisfactorias, procedencia y ausencia de cambios concurrentes. | Código de confianza fijado, manifiesto HTTPS, repo/ID/SHA/tree/run/intento, fingerprint y relecturas de refs/evidencia; quality comprueba base/head exactos. |
| I03-C04 | Sincronizar todo el proyecto: altas, modificaciones y borrados, sin autorización por miniapp. | Política `selection: snapshot`; verificación de 283 archivos seleccionados y delta real de PR #7: 26 altas, 17 modificaciones y 21 bajas, incluida procedencia. |
| I03-C05 | Preservar los controles propios de producción y excluir secretos. | Proyección real satisfactoria sin cambios de controles. Exclusiones por ruta, tipos de archivo, hashes y patrones de credenciales; secretos de plataforma no se copian. |
| I03-C06 | Commit propio en soycerobytes sin importar commits ni merges de aalexlpez. | PR #7 contiene un commit `dd751f17ef589e1f86ec536847b267abfb674a80`, cuyo único padre es la base de producción `3a38704a17f707c0d8d13d8000bf98e305923402`. |
| I03-C07 | Preparar rama y PR con una única validación ligera `quality`, sin repetir pruebas funcionales. | Release `release/07b95fd6b168-43831817035-1`, PR #7 y único check quality success en run `43831932305`. |
| I03-C08 | Publicar únicamente mediante merge manual del propietario a main, sin auto-merge. | PR #7 fusionada por `soycerobytes`, auto_merge=null; repositorio sin auto-merge y ruleset activo exige PR. |
| I03-C09 | Cloudflare Workers Builds como único publicador de producción, reconstruyendo el código. | Publicador antiguo de Actions desactivado; check `Workers Builds: miminiapp` success sobre merge `f3474bab54c97f5d3ee50879874541b45161096e`. |

## Etapas y verificaciones

1. **Contrato y base:** registrar los nueve criterios y contrastar origen staging y destino main por SHA inmutable. Completado.
2. **Circuito existente:** revisar política, workflows, código de promoción, procedencia, PR y ejecuciones reales, sin operar el sistema. Completado.
3. **Regresión y análisis final:** comparar árboles completos de origen/base/head con las reglas reales de producción; verificar conservación de controles, ascendencia, única quality, merge humano y publicación. Revisar coherencia documental y enlaces. Completado; evidencia y límites en el informe.

Entorno de comprobación: GitHub API en lectura, árboles no truncados, Node 24.22.2 y funciones puras del controlador de producción fijado al SHA observado. No se ejecutó código de aplicación, pruebas funcionales, dispatch o publicación para obtener esta evidencia.

## Límites y recuperación

`quality` pasó y quedó asociado al head correcto, pero el ruleset observado no lo exige como status check obligatorio. El propietario debe comprobar su vigencia antes del merge manual; esta revisión no añade ni modifica reglas. Las relecturas detectan concurrencia durante preparación/validación, sin prometer bloquear cambios posteriores al check hasta la decisión humana.

La revisión no inspeccionó secretos ni permisos efectivos de Cloudflare, no demuestra una auditoría exhaustiva de credenciales y no ejecutó smoke directo de producción. La publicación se acredita mediante el check de Workers Builds. Estas pruebas adicionales no figuran entre los nueve criterios actuales.

Ante un fallo, detener la promoción, inspeccionar estado/evidencia y preparar una propuesta actualizada o reversión por PR. Sin force push, auto-merge ni activación de workflows antiguos. Cambios de controles o recuperación que impliquen despliegue se revisan y autorizan en su contexto.

## Historial y cierre

| Fecha | Actor | Resultado |
| --- | --- | --- |
| 2026-11-05–07 | Propietario / agente | Plan original aprobado, ejecución parcial y staging verificado; detalle en el archivo histórico. |
| 2026-11-16 | Agente | Revisión inicial usó los criterios anteriores; queda sustituida por esta evaluación. |
| 2026-11-16 | Propietario | Cambia materialmente el contrato a los nueve criterios actuales. Se registra retorno a Borrador y aprobación del contenido indicado; la solicitud de contraste autoriza su revisión en lectura, sin nuevas operaciones sobre el sistema. |
| 2026-11-16 | Agente | Revisión documental y técnica en lectura del circuito ya implementado: Autorizado → En curso → Verificado con evidencia real de los nueve criterios y limitaciones explícitas. |

| 2026-11-16 | Propietario / agente | El propietario solicita cerrar I-03 con los nueve criterios actuales. Se registra Verificado → Aceptado, con la evidencia y las limitaciones comunicadas, y se archiva en completed. |

Resultado aceptado conforme a I03-C01–09. Se conservan las limitaciones de quality no obligatorio en el ruleset, alcance temporal de las comprobaciones de concurrencia, filtrado de secretos por rutas/patrones y ausencia de nueva inspección administrativa o smoke directo de producción. El cierre no atribuye ensayos no realizados ni autoriza nuevas promociones, merges o despliegues.
