# I-03 — identidad persistente entre PR y CI

**Fecha:** 2026-11-06. **Estado:** implementación autorizada dentro del mismo PR #4, batería local completa satisfactoria; pendiente de nuevo CI y revisión. I-03 sigue `En curso`. No se permite merge o despliegue en esta tarea.

## Mecanismo elegido

Se utiliza `run-name`, con expresiones que GitHub evalúa al crear la ejecución, en lugar de añadir un artefacto o credencial. La [documentación oficial](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#run-name) permite expresiones del contexto github y describe que, sin run-name explícito, el nombre procede del mensaje de commit o título del PR. Se consultó además la fuente oficial github/docs. El título libre no se utiliza como evidencia.

Para un evento pull_request, ci.yml genera exactamente:

```text
I03 CI v1 | repo=aalexlpez/miminiapp | id=1445849027 | pr=4 | base=staging | head=<SHA completo de 40 caracteres>
```

Los cinco valores proceden exclusivamente de github.event.pull_request: base.repo.full_name, base.repo.id, number, base.ref y head.sha. No se incorpora el título del PR, código ejecutado por sus tests o un valor configurable mediante inputs. Un evento push recibe un nombre distinto y nunca es candidato para quality de un PR.

GitHub expone el nombre evaluado como display_title del run. El gate lo compara literalmente con la identidad reconstruida a partir del PR detallado que ya ha confirmado realmente fusionado. El número del PR y su base permanecen en el nombre aunque pull_requests esté vacío después del merge; la ausencia del array no es por sí misma evidencia ni una autorización.

## Comprobaciones conjuntas

1. El lector está limitado al repositorio aprobado y a GET. Entre los runs del evento pull_request, workflow ci.yml y head SHA esperado elige el de mayor ID **antes** de filtrar por identidad de repositorio, título o estado. Un título ausente/manipulado, repositorio contradictorio o run más nuevo fallido no permite volver a un verde anterior.
2. Se verifica la identidad/path/estado activo del workflow por API. Se consulta ci.yml tanto en el head SHA inmutable como en el commit de merge que se pretende publicar, y se exige en ambos su blob Git completo fijado en CI_WORKFLOW_BLOB_SHA. También se rechaza una definición distinta heredada de la base. No se interpreta un fragmento YAML mediante regex ni se acepta un run-name hardcodeado dentro de un workflow modificado. El test estructural y el hash local también fijan la plantilla exacta.
3. Listado y detalle del run deben coincidir con repositorio y head_repository por ID/nombre, workflow ID/path/nombre, evento pull_request, head SHA/rama, display_title exacto, intento entero positivo, estado completed y conclusión success.
4. Si pull_requests está ausente o vacío, todas las comprobaciones anteriores siguen siendo obligatorias. Si tiene contenido, todas sus entradas deben coincidir con el PR; cualquier contradicción de número, base, head o repositorio informado lo rechaza. Datos malformados tampoco abren el gate.
5. Se consulta jobs del intento exacto actual. Debe haber un único job quality completed/success con el mismo run_attempt. Se relee el detalle y el listado después: otro intento, run nuevo, fallo, ejecución pendiente o identidad distinta invalidan la prueba.
6. checkMerged conserva la confirmación del merge real, merger/actores propietarios, rama/SHA/primer padre, relectura del ref y los controles del artefacto. La publicación vuelve a validar bajo su bloqueo antes de escribir. Producción, promoción y rollback siguen deshabilitados.

CI solo conserva contents:read, checkout sin credenciales persistentes, acciones y runtime fijados. No se añaden secretos, pull_request_target, escrituras, jobs privilegiados o dependencias. El gate funciona con TypeScript nativo antes de npm ci.

La nueva identidad se aplica al job quality del workflow CI. El check promotion sigue bloqueado explícitamente y conserva su lector anterior; resolver su asociación persistente y cualquier activación de producción queda fuera de esta entrega y requiere el alcance correspondiente.

## Mantenimiento y límites

Un cambio futuro de ci.yml exige revisar el diff y actualizar explícitamente CI_WORKFLOW_BLOB_SHA con `git hash-object .github/workflows/ci.yml`; la auditoría falla si no coincide. El pin cubre todo el archivo, incluido run-name, triggers, permisos y quality. Los CI anteriores sin identidad versionada no se aceptan retroactivamente.

El título no es una firma criptográfica o revisión independiente. La confianza combina metadatos proporcionados por GitHub, la plantilla fijada en el head y merge revisados y el modelo aprobado de ramas protegidas/revisión y merge del propietario. Los PR se ejecutan sobre un merge sintético; el API head_sha identifica el head del PR. Verificar ambos blobs evita aceptar una definición heredada diferente, pero no se presenta como una atestación independiente del runner. Las modificaciones de workflow/base y del propio gate siguen sometidas a revisión humana y protecciones.

La API no ofrece una transacción atómica entre leer CI/refs y publicar; se mantienen relecturas y revalidación inmediata bajo el bloqueo compartido. Esta tarea puede comprobar el título real del CI del PR abierto y simular la ausencia posterior del array en tests. No se fusiona el PR para demostrar la persistencia de su nuevo título: esa confirmación real y el primer deployment quedan pendientes de autorización posterior. El aislamiento de escritura Cloudflare sigue sin probar y no se alteran los límites del probe.

## Verificación local y evidencia de revisión

`npm run verify` finaliza exit0: tipos64 archivos sin errores/warnings/hints, lint/formato/hosting,314 unitarias,9 componentes,26 E2E e integración modular/regresión I-01 satisfactorias con Chromium156.0.8078.4/r1248 fijado. Las40 pruebas de pr-ci-identity cubren identidad ausente/manipulada, repositorio/PR/base/head/workflow/evento, contradicciones, pin de head/merge, calidad, intentos y cambios concurrentes; checkMerged y auditoría estructural añaden integración con el contrato.

Durante la revisión se corrigió el tipado genérico del lector simulado y se movieron tres casos negativos a su tabla de asociaciones para que comprobaran esa validación. La ampliación del pin al merge detectó una fixture sin ese campo; se actualizó antes de la batería final. Los primeros chequeos y el resultado final quedan separados en evidencia local ignorada `.local/verification/i03/pr-ci-identity/`.

El PR recogerá commit, nuevo CI y lectura real de display_title/lector contra API cuando se observen. No se anticipa su resultado ni se usa un merge o deployment para obtenerlo. No cambian dependencias, permisos de CI, workflows publicadores, política, secretos o protecciones.
