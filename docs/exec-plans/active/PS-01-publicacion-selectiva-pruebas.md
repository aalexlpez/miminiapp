# PS-01 · Publicación selectiva: preparación y pruebas

## Control

* **Estado:** `En curso`.
* **ID:** PS-01.
* **Rama estable:** `feature/ps01-selective-publication`, en cada repositorio afectado.
* **Iteración actual:** I2 — selector por build y activos.
* **Responsable:** Alexander López, propietario de MiMiniApp.
* **Creado / actualizado:** 2026-11-23.
* **Autorización:** el propietario indica «Vamos a ello. Haz lo que esté a tu alcance» y limita expresamente el trabajo a pruebas: Plan B no está en producción y no debe publicarse. Se registra aprobación y autorización del alcance de preparación descrito en la revisión anterior; no se autoriza activar publicaciones.

## Objetivo y alcance

Preparar y verificar localmente una selección acumulativa por release, conservando staging y los controles de producción. Un catálogo de producción vacío es válido cuando se solicita expresamente. Usar dos miniapps sintéticas para demostrar altas; Plan B solo continúa en staging y en la regresión local existente.

La implementación del selector vive en `aalexlpez/miminiapp`. En `soycerobytes/miminiapp` se prepara un simulador local que proyecta un snapshot sobre una base de producción y produce un candidato revisable, sin API de escritura, PR remoto, merge o deploy. Los controles existentes de publicación permanecen intactos. Este plan **no entrega un workflow activo de promoción selectiva**: su conexión a Actions/Workers Builds requiere una fase de activación posterior, con las dependencias administrativas verificadas.

## Decisiones aplicables

Enmienda de pruebas del 2026-11-23 en el índice técnico; ADR-MMA-001/004/008/009/011/014/015/016 y enmienda de promoción del 2026-11-16. Sin dependencias nuevas. Registro único; descriptor existente conservado. La selección se aplica antes de compilar y al directorio público. Una release comparte snapshot de plataforma y de apps ya públicas.

## Iteraciones secuenciales

| Iteración | Entrada y trabajo | Pruebas y salida |
| --- | --- | --- |
| I1 — contrato | Registrar autorización, fijar bases y contrato del manifiesto: schema, SHA origen/base, identificador, selección acumulativa y fechas. | Esquema estricto; repetición idempotente; selección vacía explícita; rechazo de altas inválidas y bases concurrentes. |
| I2 — selector | Generar imports exclusivos a partir del registro existente y proyectar activos por propiedad. Añadir entrada explícita de build de producción sin cambiar el build actual de staging. | Con fixtures: vacío, A, A+B; ausencia de UI/chunks/recursos excluidos, ES/EN, errores de manifiesto, activos ambiguos y borradores. |
| I3 — preparación local | En checkout de producción, generar una candidata local con código del origen, controles del destino y manifiesto calculado; mostrar altas, cambios y borrados. | Manifiesto como único cambio; idempotencia; rechazo de rutas/secretos/enlaces/base obsoleta; ningún acceso de escritura ni publicación. |
| I4 — regresión y análisis | Contrastar conjunto con bases, ejecutar verificación de staging y controles de producción, revisar alcance y dependencias. | Evidencia local y hallazgos corregidos. Ninguna prueba remota se declara realizada. Entrega para aceptación humana y lista ordenada de activación futura. |

## Bases, entorno y evidencia

* Desarrollo: `5a830a9f90f835c583e38bbf05f8a97afa6ab2f0` (staging remoto confirmado y descargado).
* Producción: `f3474bab54c97f5d3ee50879874541b45161096e` (main remoto confirmado; checkout separado).
* Node 24.22.2, npm 11.19.1 y dependencias/Chromium existentes. Evidencia volátil en `.local/verification/ps01`; resumen durable en `docs/reports/ps01/verification.md`.
* Comandos nuevos se documentan como objetivos hasta comprobarlos. La suite completa conserva las pruebas actuales de Plan B y plataforma.

## Criterios de aceptación del alcance de pruebas

1. Producción puede compilar una selección explícitamente vacía con todo el código de Plan B presente en origen, sin servir Plan B ni sus recursos.
2. Dos fixtures demuestran altas acumulativas y selección por imports, rutas, catálogo y activos; no se añaden herramientas reales.
3. Manifiesto ausente, inválido, duplicado, con desconocidos o borradores y recursos ambiguos fallan antes de generar un artefacto utilizable.
4. Cambiar solo el manifiesto produce una candidata local; repetir la misma solicitud resulta en ausencia de cambio semántico.
5. El simulador conserva controles y rechaza una base distinta, sin ejecutar código del origen en funciones de escritura.
6. Staging mantiene registro, comportamiento funcional y artefactos esperados. Los workflows y configuración remota no cambian.
7. Se distinguen pruebas locales, integración remota pendiente y activación no autorizada. El propietario acepta el resultado por separado.

## Riesgos, recuperación y dependencias

Solo se escriben ramas locales y candidatos en directorios temporales nuevos. La recuperación consiste en descartar estos cambios/candidatos, sin tocar ramas compartidas. No crear PR de release, disparar workflows, fusionar, cambiar rulesets o Cloudflare. Las futuras pruebas alojadas necesitan confirmar destino aislado y permisos; exigir `quality` en producción es una dependencia administrativa de activación, no un motivo para publicar Plan B. Las candidatas archivadas, embargo y versiones independientes por app quedan fuera.

## Progreso

| Iteración | Inicio | Fin | Evidencia | Siguiente paso |
| --- | --- | --- | --- | --- |
| I1 | 2026-11-23 | 2026-11-23 | Contrato estricto y pruebas unitarias de selección, acumulación, idempotencia y concurrencia. | I2. |
| I2 | — | — | — | Espera salida de I1. |
| I3 | — | — | — | Espera salida de I2. |
| I4 | — | — | — | Regresión sobre candidato definitivo. |

## Historial

| Fecha | Estado | Actor | Motivo |
| --- | --- | --- | --- |
| 2026-11-23 | `Aprobado` / `Autorizado` | Propietario | Continuar con la propuesta revisada; únicamente preparación y pruebas, sin publicar Plan B. |
| 2026-11-23 | `En curso` | Agente | Registro del alcance autorizado y comienzo de I1. |
