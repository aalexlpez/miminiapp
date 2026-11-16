# I-03 — Contraste del contrato vigente

**Fecha:** 2026-11-16. **Autor:** agente, revisión en lectura. Los nueve criterios aprobados y el estado canónico están en el [ExecPlan](../../exec-plans/completed/I-03-github-actions-y-cloudflare.md). El [contrato anterior](legacy-plan-2026-11-16.md) se conserva como historia, sin imponer requisitos sustituidos.

## Candidato y ejecuciones observadas

| Elemento | Identidad / evidencia |
| --- | --- |
| Origen | `aalexlpez/miminiapp`, ID `1445849027`, rama staging, SHA `07b95fd6b168b9b03150a48a9541ddbd3767748e`, tree `fdd0fb647634cceb3c80ab58a4f3e99bce399dc2` |
| Validación funcional y publicación staging | [Run 43756652514](https://github.com/aalexlpez/miminiapp/actions/runs/43756652514), intento 1, success: prepare/verify y remote-test |
| Destino | `soycerobytes/miminiapp`, ID `1455524397`, rama main |
| Preparación manual | [Run 43831817035](https://github.com/soycerobytes/miminiapp/actions/runs/43831817035), workflow_dispatch, actor soycerobytes, success |
| Base del destino | `3a38704a17f707c0d8d13d8000bf98e305923402` |
| Commit propio de release | `dd751f17ef589e1f86ec536847b267abfb674a80`, único padre = base del destino |
| Rama / PR | `release/07b95fd6b168-43831817035-1`, [PR #7](https://github.com/soycerobytes/miminiapp/pull/7) |
| Validación de release | [Run 43831932305](https://github.com/soycerobytes/miminiapp/actions/runs/43831932305), workflow_dispatch, un único check `quality`, success sobre el head dd751f17… |
| Merge | `f3474bab54c97f5d3ee50879874541b45161096e`, merged_by soycerobytes, auto_merge=null |
| Publicación | [Workers Builds: miminiapp](https://github.com/soycerobytes/miminiapp/runs/133182275750), success sobre f3474bab…, build `e9cf5c1f-402c-492e-bb91-0e0088a2a4d4`, versión `e45e58fb-64a1-4b4e-bbba-df4fd9788420` |

## Código y controles revisados

Lectura fijada al [commit de producción observado](https://github.com/soycerobytes/miminiapp/tree/f3474bab54c97f5d3ee50879874541b45161096e): `.github/promotion-policy.json`, `.github/release-provenance.json`, workflows ci/prepare-release/production y `scripts/promotion/{core,github,cli}.ts`. La guía propia del destino es [production-promotion.md](https://github.com/soycerobytes/miminiapp/blob/f3474bab54c97f5d3ee50879874541b45161096e/docs/production-promotion.md).

* I03-C01/02: staging conserva la batería completa; prepare-release requiere dispatch desde main del repo/ID de destino y SHA minúsculo completo de 40 caracteres.
* I03-C03: inspectCandidate comprueba repo/ID/ref, workflow por blob fijado, último run/intento, jobs y pasos satisfactorios, manifiesto HTTPS sin redirecciones y coincidencia SHA/tree/payload. Relee run/ref; fingerprint vincula evidencia y base entre inspect/prepare. Antes de crear rama relee candidato y main. check-pr confirma procedencia, proyección, único padre, base/head/merge exactos y relee el PR.
* I03-C04/05: `selection: snapshot`, sin campos files/miniapps/registryBlob. managedPaths usa unión de base y origen para incluir borrados; reglas concretas preservan controles de destino. Rechaza paths de secretos, tipos no normales, symlinks/submódulos, traversal y contenido con determinados patrones de credenciales; verifica bytes por hash Git. `.npmrc` solo admite opciones no secretas revisadas. No copia secretos de GitHub/Cloudflare.
* I03-C06/07: crea árbol de archivos y un commit con único padre del destino. Prepara rama/PR y solicita explícitamente quality. En release, quality ejecuta control confiable de procedencia; no instala ni ejecuta aplicación. Los filtros automáticos quedan limitados a controles propios y excluyen procedencia, evitando duplicar quality en una release válida. Los PR de configuración tienen sus comprobaciones propias.
* I03-C08/09: prepare no fusiona ni publica; Actions production tiene if:false. El ruleset activo `Protect production main` exige PR y bloquea borrado/force push. Auto-merge del repositorio desactivado. La PR real fue fusionada por el propietario y después pasó el check del publicador Cloudflare.

## Regresión y análisis final

Se obtuvieron árboles recursivos completos, no truncados, del origen, base y head del PR. Con Node 24.22.2 y las funciones puras del controlador revisado se ejecutaron treeEntries/selectFiles/assertProjection contra esos árboles: **PASS**. Se verifican 283 archivos seleccionados; hash de proyección `379681fbbeb8bd8a911a97eefbd20ac739f0d4f0b867c76a42384857cff59b5c`, coincidente con la procedencia registrada.

Delta real: 26 altas, 17 modificaciones y 21 borrados (incluida la modificación de procedencia). Ningún control preservado cambia. La unión de árboles verifica también la ausencia de archivos retirados del origen; no se limita a comprobar altas. La ascendencia real de la PR contiene exactamente un commit nuevo con el padre de producción esperado.

No se reejecutaron pruebas funcionales: sus resultados proceden del run satisfactorio del SHA de staging. No se modificaron aplicación, dependencias, lockfile, workflows o configuración durante esta revisión. Se actualizaron fuentes canónicas y sus consumidores; revisión de enlaces locales sin errores.

## Hallazgos y límites

| Hallazgo | Impacto / tratamiento |
| --- | --- |
| Documentación de origen seguía describiendo producción bloqueada y reutilización binaria. | Evaluación previa de I-03 obsoleta. Se actualizan plan, ADR y guías al contrato indicado por el propietario; se conserva historia. |
| quality pasa pero el ruleset observado no lo exige como status check. | Control humano antes del merge; no se afirma exigibilidad automática. No se modifican protecciones. No se añadió ese requisito a los nueve criterios actuales. |
| Las comprobaciones de concurrencia operan durante preparación y quality. | No constituyen un bloqueo permanente hasta el merge; ante cambios posteriores revisar de nuevo el candidato. |
| Filtrado de secretos limitado a rutas/patrones conocidos. | No equivale a auditoría exhaustiva de credenciales ni inspección de secretos de plataforma. Se conserva revisión humana del diff. |
| Sin acceso administrativo a Cloudflare ni smoke directo nuevo. | Publicación acreditada por el check de Workers Builds, no por un ensayo adicional de navegador o aislamiento de escritura. |

Resultado de la revisión: evidencia conforme a I03-C01–09; **Verificado**. El propietario acepta posteriormente el resultado y las limitaciones comunicadas el 2026-11-16 mediante «quiero cerrar el I-03 también con los nuevos criterios»: el plan pasa a **Aceptado** y queda archivado en completed. Ninguna nueva operación de promoción o despliegue fue ejecutada por el agente.
