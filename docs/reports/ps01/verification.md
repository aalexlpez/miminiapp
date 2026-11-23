# PS-01 · Preparación local y regresión

**Fecha:** 2026-11-23. **Responsable de aceptación:** Alexander López. **Estado de ejecución:** preparación y pruebas locales/remotas comprobadas; cierre documental en curso; el estado canónico está en [PS-01](../../exec-plans/active/PS-01-publicacion-selectiva-pruebas.md).

## Resultado y límites

Solo se preparan builds y candidatos locales. El propietario confirma que Plan B no está en producción y no quiere publicarla. En el cierre local no se habían hecho push ni PR remotas. No se hacen merge, dispatch de releases, cambios de reglas, credenciales o Cloudflare. La entrega de pruebas en PR se registra al final. Los publicadores existentes no se modifican ni ejecutan; la integración de un workflow selectivo real queda fuera de esta activación y requiere su propia conexión revisada. No se presenta esta entrega como validación remota del nuevo flujo.

## Bases y entorno

Desarrollo parte de `5a830a9f90f835c583e38bbf05f8a97afa6ab2f0`; producción de `f3474bab54c97f5d3ee50879874541b45161096e`. Rama local estable `feature/ps01-selective-publication` en ambos checkouts; plan canónico solo en desarrollo. Node 24.22.2, npm 11.19.1 y Chromium fijado del proyecto. El lockfile es idéntico entre repositorios, SHA-256 `09d1b50a87e898256acf5fdee4a0e6f93eebb87ef92579e57588a5aebd34c420`: no se añaden dependencias. Instalación del checkout de producción desde la caché npm existente.

## Evidencia local

| Comprobación | Resultado |
| --- | --- |
| Contrato/selector, unitarias | 31 nuevas: schema estricto, fechas, acumulación, idempotencia incluso con JSON reordenado, base obsoleta, borradores y propiedad de activos. |
| Simulador, unitarias | 7 nuevas, con repositorios Git sintéticos temporales: vacío explícito, manifiesto como único cambio, repetición sin cambios, acumulación A+B, conservación de controles, borrados, desconocidos/borradores, secretos/symlinks y ausencia de red/publicación. |
| Build selectivo sintético | Vacío, A y A+B verificados con catálogo/rutas ES/EN, 404 de rutas/iconos excluidos, inventario, grafo de módulos e hidratación Chromium. Plan B permanece en el input y se excluye en las tres variantes. La repetición final rechaza también ruta directa e icono ausente. |
| Candidato con checkouts reales | El simulador proyecta desarrollo sobre controles de producción en un directorio nuevo; selección vacía. Compilación local produce 19 archivos, ninguna ruta de app ni icono de Plan B. El reporte marca `testOnly` y validación de staging no realizada. |
| Suite de desarrollo | `npm run verify`: éxito, incluidas 27 pruebas de componente, 166 E2E y ambas integraciones. La suite unitaria final, repetida tras canonicalizar el manifiesto, acredita 560 pruebas. Tipos, lint, formato y hosting offline correctos. |
| Controles de producción | 447 unitarias; tipos, lint y formato correctos. Tras sincronizar el contrato final se repiten las 7 del simulador y los controles pertinentes. |
| Regresión de artefactos de staging | Mismas 24 rutas de artefactos que el build de la base. 22 archivos idénticos byte a byte; solo difieren los UID de hidratación de las dos páginas de Plan B, que incluyen la raíz del proyecto. Normalización exclusiva `/<astro-island uid="[^"]+"/g`: todo el resto del HTML es idéntico; JS, CSS, fuentes e imágenes idénticos sin normalización. |
| Revisión remota de preparación | Refs de partida consultadas por GitHub. No se accedió a configuración de Cloudflare ni se acredita estado servido mediante estas pruebas. |

Logs de esta sesión en `/workspace/work/ps01-*.log`; evidencia reproducible del selector en `.local/verification/ps01/` de desarrollo y candidatos bajo `.local/selective-previews/` de producción. Los archivos volátiles no se versionan ni se sirven. Los SHAs/fingerprints del preview identifican la copia local exacta, incluidos cambios sin commit si los hay; no sustituyen una procedencia de staging.

## Hallazgos y tratamiento

| Hallazgo | Impacto | Acción y resultado |
| --- | --- | --- |
| El preparador remoto actual ignora cambios exclusivos de selección. | Una futura alta con igual snapshot no produciría PR. | El simulador calcula el diff después del manifiesto; prueba de manifiesto-only y retry. La conexión del preparador remoto sigue pendiente, no se declara corregido en el flujo activo. |
| Una app con slug `shared` podía confundirse con el propietario compartido de activos. | Recursos de una excluida podrían conservarse. | Separar propiedad de plataforma de nombres de app y añadir prueba específica. |
| La selección podía eludirse con una ruta adicional bajo apps. | Una app excluida podría obtener URL directa. | Exigir la única entrada dinámica por registro y rechazar la ruta sintética adicional. |
| Un icono seleccionado podía faltar en la proyección pública. | Catálogo con recurso roto. | Contrastar iconos de los descriptores seleccionados con el inventario proyectado; rechazo automatizado. |
| Reordenar claves JSON podía aparentar cambio semántico. | Reintentos innecesarios y hashes distintos. | Serialización y comparación canónicas; prueba de equivalencia. |
| Los builds aislados existentes solo copiaban config/src/public. | La nueva importación de config no se resolvía en copias. | Copiar también `scripts/publication` en ambos helpers; la regresión incluye esos recorridos. |
| Telemetría/logs locales buscaban un home no disponible. | Fallos de herramientas ajenos al código. | Usar `ASTRO_TELEMETRY_DISABLED=1`, cachés y logs del workspace; no cambiar HOME, permisos, versiones ni dependencias. |

## Dependencias para continuar fuera de localhost

Consultar la [guía](../../guides/selective-publication.md). Primero confirmar que las ramas/PR de prueba no disparan previews de Cloudflare. Después se podrán preparar PR de pruebas, todavía sin merge. La activación posterior necesitará `quality` obligatorio, clasificación del manifiesto generado en los filtros del CI, controles propios en jobs de escritura, validación de candidato exacto y migración con selección vacía. Los cambios de `main` pueden disparar Workers Builds. Un check verde no se invalida solo al avanzar staging. El rollback debe preservar expresamente la selección que se quiera conservar. Nada de esto autoriza el alta de Plan B.

## Dependencia de previews resuelta — 2026-11-23

Capturas del propietario confirman `soycerobytes/miminiapp`, producción en `main`, builds de producción habilitados y `Builds for Preview branches` apagado. Se preparan PR de pruebas en borrador en ambos repositorios, sin merge ni despliegue. Producción añade al paso de configuración de `quality` las siete unitarias del simulador, con los permisos de lectura existentes. La limitación anterior sobre ausencia de PR/push describe el cierre local; la entrega remota se registrará por separado tras comprobar el resultado real de CI.

## PR de pruebas y evidencia de CI — 2026-11-23

* Desarrollo: [PR #32](https://github.com/aalexlpez/miminiapp/pull/32), base `staging`, en borrador. `quality` satisfactorio sobre `5ef3366c9aa8ad5accc740fff342d17e6b3c9134`, run [45209995019](https://github.com/aalexlpez/miminiapp/actions/runs/45209995019), job `137815905574`. Logs contrastados: 560 unitarias, 27 componentes, 166 E2E y ambas integraciones, incluidas las tres selecciones y los casos de rechazo.
* Producción: [PR #8](https://github.com/soycerobytes/miminiapp/pull/8), base `main`, en borrador. `quality` satisfactorio sobre `a09fd018e34c55f5fca6f0493d2997af58cf764d`, run [45210054633](https://github.com/soycerobytes/miminiapp/actions/runs/45210054633), job `137816113717`. Logs contrastados: 111 pruebas de controles más 7 del simulador; lint y formato correctos. El paso de verificar una release se omite como corresponde a una PR de configuración; no hay publicación.
* El propietario incorpora `required_status_checks` al ruleset `27191603`: `quality` obligatorio, vinculado a GitHub Actions (`integration_id: 15368`). Primera lectura posterior: `strict_required_status_checks_policy: false`; se solicita activar también la base actualizada. La conexión conserva `push: true`, `admin: false`. Esta configuración de protección no autoriza merge, migración ni alta de Plan B.

La captura del panel se usa como evidencia humana del ajuste de previews. No se han cambiado ajustes de Cloudflare ni creado releases. Las URLs de PR ficticias impresas por los tests de API son fixtures; no son PR adicionales creadas por la prueba.

Los SHAs anteriores identifican los candidatos de implementación que pasaron CI. El commit de cierre cambia únicamente documentación: cada PR expone también el check de su head documental actual, que debe quedar satisfactorio antes de entregar el resultado. La preparación real del workflow de promoción selectiva sigue pendiente; estas PR prueban selector y simulador, sin activar publicación.
