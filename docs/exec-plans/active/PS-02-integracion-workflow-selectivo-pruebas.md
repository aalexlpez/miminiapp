# PS-02 · Integrar y probar el workflow selectivo

## Control

* **Estado:** `En curso`.
* **ID:** PS-02.
* **Rama estable:** `feature/ps02-release-integration-tests`, única por repositorio para todas las iteraciones.
* **Iteración actual:** I4 — regresión y análisis final.
* **Responsable:** Alexander López, propietario de MiMiniApp.
* **Creado / actualizado:** 2026-11-23.
* **Dependencias de inicio:** resueltas por la confirmación del propietario «si lo autorizo» el 2026-11-23: PS-01 aceptado, contrato PS-02 aprobado y ejecución autorizada. El merge de #32 se conserva como evidencia de integración, no como fuente de esa aceptación.

## Objetivo

Conectar el selector con las funciones reales de preparación y comprobación de releases. Verificar el circuito con compilaciones aisladas, APIs simuladas y CI de lectura. Entregar una implementación revisable, **sin instalarla ni activarla en producción**.

Caso principal: staging contiene Plan B; pedir una candidata sin aplicaciones produce un proyecto compilable sin rutas, UI, chunks ni icono de Plan B. Las pruebas de altas usan únicamente fixtures A y B.

## Bases y repositorios

* Desarrollo: `b81bc517f79e43a3060f30307c724bda0f941348`, merge de [PR #32](https://github.com/aalexlpez/miminiapp/pull/32) en staging, confirmado por API y fetch. No se presume que haya terminado su despliegue.
* Main de producción: `f3474bab54c97f5d3ee50879874541b45161096e`. La preparación PS-01 está en `9176dec88a6bacd0bb40d2e8b002908da4977201`, [PR #8](https://github.com/soycerobytes/miminiapp/pull/8), en borrador y sin merge.
* Releer refs/checks al iniciar. La rama de producción PS-02 incorpora la preparación revisada sin fusionar #8 a main. Identificar separadamente base real de main y controles bajo prueba; no importar historia de desarrollo.
* Mantener este único plan canónico en desarrollo. Todas las iteraciones reutilizan su rama. La entrega de producción reunirá los cambios necesarios en una PR de configuración en borrador; no instalar dependencias mediante merges a main.

## Alcance y exclusiones

Dentro: contrato acumulativo, integración en preparador y `check-pr`, materialización/build del candidato exacto, procedencia, idempotencia, estructura/permisos de jobs y pruebas de concurrencia/recuperación.

Fuera: merge a main, cambios en Cloudflare, cambio del build remoto, instalación de manifiesto en producción, dispatch del preparador activo, releases o ramas release reales desde un job, alta de Plan B, candidatas archivadas, retiradas de apps y versiones diferentes por miniapp. No pedir tokens ni infraestructura nuevos.

## Contrato aprobado

1. Mantener `staging_sha` completo y añadir `release_id` y `add_miniapps`. Conservar selección/fechas anteriores; añadir solo altas válidas. Sin manifiesto anterior, exigir inicialización vacía explícita. No incorporar retiradas en este plan.
2. `.github/miniapp-release.json` es dato generado por el destino, nunca importado de staging. Extender política/procedencia para identificar selección y formato. Manifiesto y procedencia son salidas verificadas; no excepciones que permitan modificar controles arbitrarios.
3. Comprobar SHA/tree, repositorio, workflow fijado, run/intento y staging servido. Materializar y compilar con lectura, sin secretos de publicación. La evidencia identifica base/head, selección, configuración del selector y contenido comprobado.
4. La función que prepara escrituras revalida esa evidencia y no ejecuta código importado ni instala dependencias con un token de escritura. Los tests interceptan todas sus escrituras: comprueban qué commit/rama/PR se solicitarían sin crearlos realmente.
5. Mantener un único `quality`, base actualizada y merge humano. El CI protegido usa comandos que sobreviven al reemplazo de `package.json` por el de staging. Los jobs de prueba no tienen ruta ejecutable de publicación.
6. Conservar staging elegible al preparar y al ejecutar su comprobación. Un avance posterior de staging no invalida automáticamente un verde anterior: documentar la ventana operativa y cuándo volver a preparar, sin prometer sellado de candidatas antiguas.
7. El preparador instalado en main permanece intacto. Instalar/activar la nueva implementación requiere una decisión posterior; un check verde no lo autoriza.

El propietario aprueba este contrato junto con el plan el 2026-11-23; el índice técnico registra su alcance de pruebas, sin instalación/activación.

## Iteraciones secuenciales

| Iteración | Entrada y trabajo | Pruebas y condición de salida |
| --- | --- | --- |
| **I1 — Contrato y aislamiento** | Dependencias aceptadas/autorizadas. Revisar `scripts/promotion/{core,cli,github}.ts`, política, workflows y `scripts/publication/`. Definir revisión de política/procedencia, interfaces y transporte GitHub inyectable. | Inputs inválidos, manifiesto inicial ausente, desconocidos/borradores e identificador reutilizado con contenido diferente. El harness falla ante cualquier escritura no interceptada. Lógica real invocable sin tocar GitHub/Cloudflare. |
| **I2 — Preparador y candidata exacta** | I1 verificada. Conectar selección, materialización, build y comprobador. Incorporar manifiesto antes de decidir si hay cambios; vincular hashes/evidencia al commit propio y a la PR prevista. | Circuito real con API falsa y builds vacío/A/A+B; altas/cambios/borrados, controles preservados y ningún historial importado. Manifiesto-only produce la solicitud de PR correcta; retry no duplica. Plan B ausente del resultado vacío. |
| **I3 — Workflow y fallos** | I2 verificada. Conectar inputs, pasos y comprobaciones al código preparado, sin habilitar el workflow instalado. CI de pruebas con lectura y sin secretos de Cloudflare. | Mutaciones de permisos, código importado con escritura, base/head/source/evidencia cambiados, fallos parciales y duplicados. Con repositorios sintéticos, rechazar candidata obsoleta tras aceptar otra. Ensayar recuperación preservando selección. Preparar instrucciones de migración vacía, sin ejecutarla. |
| **I4 — Regresión y análisis final** | I1–I3 completas. Comparar con bases y revisar conjunto: requisitos, seguridad, recursos, mantenibilidad, idempotencia y concurrencia. Corregir defectos dentro del alcance y repetir comprobaciones afectadas. | Suite pertinente y CI final satisfactorios; hallazgos con impacto/corrección/evidencia. Separar pruebas locales, API falsa y CI real. Informe breve y entrega para aceptación humana; ninguna fusión o publicación. |

La última iteración siempre será regresión; si aparece implementación posterior, repetir después la revisión de conjunto. Conservar los pins de workflows de origen; cualquier modificación de un workflow fijado exige revisión y actualización expresa de su pin.

## Entorno y verificación

Node 24.22.2/npm 11.19.1, dependencias y Chromium existentes. Sin servicios nuevos. Usar archivos/worktrees temporales, funciones reales y transporte falso; prohibir llamadas reales de escritura en los tests. La entrega de ramas/PR de configuración es la única escritura remota prevista, con previews apagados y sin merge.

Comandos existentes: `npm run check`, `npm run lint`, `npm run format:check`, `npm run test:unit`, `npm run test:publication` y, ante cambios funcionales de desarrollo, `npm run verify`. En producción, invocar tests específicos con `npm run test:unit -- <archivo>`, sin aliases exclusivos del destino. Los nuevos comandos se documentarán cuando existan.

Evidencia volátil: `.local/verification/ps02/`. Resumen durable al ejecutar: `docs/reports/ps02/verification.md`. Sin demos adicionales ni informes por iteración: progreso del plan, logs y una entrega final. La aprobación del propietario es suficiente como aceptación humana.

## Criterios de aceptación

* Preparador y comprobador reales comparten el contrato de selección, verificado sin servicios de escritura reales.
* Vacío/A/A+B y manifiesto-only pasan; desconocidos, borradores, datos ambiguos y reintentos conflictivos fallan.
* La evidencia corresponde al candidato exacto; el build no comparte credenciales de escritura/publicación.
* Se preservan controles y ascendencia de producción; solo se admiten los datos generados expresamente verificados.
* Las candidatas obsoletas se rechazan y el CI sigue funcionando después de importar el paquete de staging.
* Pasan suite pertinente y CI de pruebas. No se presentan como ejecutados el workflow instalado, una promoción real o un despliegue.
* No se han fusionado cambios a producción, modificado Cloudflare, creado releases reales ni publicado Plan B.

## Riesgos, recuperación y punto de parada

Recuperar pruebas descartando copias temporales o corrigiendo la rama. No reset/force push de ramas compartidas ni activar publicadores legacy. Un fallo esencial impide declarar `Verificado`.

Aceptación de PS-01 y aprobación/autorización de contrato y plan registradas el 2026-11-23. Al finalizar, entregar evidencia para aceptación y mantener producción en borrador. El build remoto sigue siendo `npm run build`: coordinar consumidor y manifiesto vacío pertenece a una fase posterior, sin ejecutar esa migración aquí.

## Progreso e historial

| Iteración | Trabajo | Evidencia |
| --- | --- | --- |
| I1 | Completada | Esquema controlado, política con escrituras desactivadas, puertos GitHub e índice/evidencia tipados. 17 pruebas iniciales del motor y 31 del contrato/selector de desarrollo. |
| I2 | Completada | Compilador real y transporte GitHub estricto en memoria: vacío/A/A+B, rutas servidas y 404 de Plan B, ascendencia propia, reintentos y fechas acumulativas. 23 pruebas del motor/build/CLI; tipos y lint de ambos repositorios pasan. |
| I3 | Completada | Receta manual desactivada y writer sin bypass; `quality` único de lectura, manifiesto generado sin segundo trigger. 149 pruebas de controles/motor/build/CLI pasan, incluidas mutaciones de permisos/recibos, conflictos, avance de origen/base y recuperación acumulativa. Guía de migración vacía preparada, sin ejecutar. |
| I4 | En ejecución | Regresión completa, comparación con base y CI de PR de pruebas. |

| Fecha | Estado | Actor | Motivo |
| --- | --- | --- | --- |
| 2026-11-23 | `Borrador` | Agente | Preparar el siguiente resultado revisable tras integrar desarrollo #32. No inferir aceptación o autorización del merge. |

## Aprobación y autorización — 2026-11-23

El propietario confirma «si lo autorizo» tras la petición conjunta de aceptación de PS-01 y aprobación/autorización de PS-02. Se registran `Aprobado` → `Autorizado` → `En curso`, sin ampliar el límite de pruebas. I1 comienza en las ramas estables; producción sigue sin instalación ni activación.
