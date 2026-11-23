# PS-03 · Instalar el flujo selectivo con catálogo vacío

## Control

* **Estado:** `Borrador`. No autoriza implementar, instalar o activar.
* **ID:** PS-03.
* **Rama estable:** `feature/ps03-selective-release-installation`, una por repositorio y todas las iteraciones. La rama de producción se creará solo al autorizar I1, sin importar historia de desarrollo.
* **Iteración actual:** preparación del plan; I1 no iniciada.
* **Responsable:** Alexander López, propietario de MiMiniApp.
* **Creado / actualizado:** 2026-11-23.
* **Dependencias:** PS-01 y PS-02 aceptados. Desarrollo #33 integrado y despliegue/pruebas remotas satisfactorios; revalidar identidad al fijar una candidata elegible. Aprobar el contrato propuesto en el índice técnico, este plan y su ejecución antes de implementar.

## Objetivo

Instalar consumidor, manifiesto y preparador selectivos; comprobar una promoción real **sin añadir ninguna miniapp**. Producción termina con catálogo vacío y Plan B permanece disponible únicamente en staging. El propietario conserva los merges y los cambios de Cloudflare.

## Bases verificadas

* Staging: `23424fcedcc4a075eac6284745100e01adcb6882`, merge de [#33](https://github.com/aalexlpez/miminiapp/pull/33). Despliegue [45272190937](https://github.com/aalexlpez/miminiapp/actions/runs/45272190937): jobs `prepare` y `remote-test` satisfactorios. La lectura directa del manifiesto desde este entorno respondió 403; no acredita su contenido ni identifica la causa. La evidencia remota procede de esos jobs. Revalidar identidad y comprobar accesibilidad desde el preparador real al ejecutar I1.
* Producción: main `f3474bab54c97f5d3ee50879874541b45161096e`, registro vacío y build ordinario `npm run build`. No dispone aún del consumidor completo ni de su alias de producción.
* [#9](https://github.com/soycerobytes/miminiapp/pull/9), head `2e61d91e57fb1f84b89e818cad6962e1d6bb7eee`, conserva los controles probados en borrador; #8 también sigue sin merge. Ninguna de ellas equivale a una instalación preparada para publicar. I1 reutilizará su código revisado en una candidata coherente; no fusionarlas por separado para ensayar.
* Cloudflare Workers Builds publica main, con previews apagados según las capturas previas. Reconfirmar esa configuración antes del cambio operativo; no pedir credenciales nuevas por anticipado.

## Contrato propuesto — requiere aprobación

1. Conservar repositorios/historiales independientes, fuente elegible por SHA completo, selección acumulativa, controles preservados, `quality` obligatorio/strict y merge humano. Workers Builds sigue siendo el único publicador.
2. La primera instalación sincroniza el proyecto de un staging validado y los controles revisados en un commit propio de producción. Incluir consumidor, configuración Astro, scripts comunes y manifiesto vacío coherentes entre sí; no etiquetar una copia parcial como snapshot completo de staging.
3. La selección seguirá siendo explícita y fallará si falta el manifiesto. Workers Builds usará `npm run build:production` y `MINIAPP_BUILD_TARGET=production`, sin modificar el build de staging ni recurrir a un fallback que publique todo.
4. Sustituir el contrato exclusivamente de pruebas por una política operativa revisada y un modo inicial limitado a selección vacía: rechazar toda alta, incluida Plan B. Mantener simulación separada, validación del recibo/inputs/índice antes del contexto y escritor sin instalaciones ni ejecución de código importado. No basta cambiar un `if: false` o añadir una variable de activación.
5. Deshabilitar el preparador legacy de snapshot completo antes de habilitar el selectivo. Conservar bloqueo compartido, una propuesta activa y recuperación sin force push. No habilitar publicadores o rollback de Actions.
6. Registrar identidad de build y evidencia posterior del despliegue: SHA de main servido, SHA de staging, selección, build de Workers Builds y comprobaciones del sitio. Verificar el mecanismo real de identidad antes de implementarlo; una fecha prevista no acredita publicación ni se exige identidad binaria con staging.
7. El permiso de este plan, si se concede, alcanza una instalación y comprobación de catálogo vacío. Publicar Plan B, altas sintéticas en producción, retiradas, embargo del código y versiones independientes por app quedan fuera. La copia del código al repositorio público no equivale a servir sus rutas, módulos o iconos.

## Iteraciones secuenciales

| Iteración | Trabajo y entrada | Verificación y salida |
| --- | --- | --- |
| **I1 — Candidata de instalación** | Plan/contrato autorizados. Releer refs y staging servido. Preparar una PR de configuración completa desde main de producción: controles revisados, consumidor, alias, manifiesto vacío e identidad de build. Preparar política y comprobaciones operativas; sin cambios remotos de publicación. | Build aislado sin permisos de escritura, vacío/404 de Plan B y auditoría de módulos/activos. Inputs/recibos incompletos, secretos, rutas inseguras, políticas/identidad cambiadas, altas y concurrencia rechazados. CI de configuración pertinente. Entregar diff y recuperación revisables antes de pedir ninguna acción de Cloudflare o merge. |
| **I2 — Instalar bajo control** | I1 pasa. Presentar al propietario la configuración y el diff definitivos. Pausar temporalmente Workers Builds, fijar comando/variable explícitos y previews apagados; comprobar guardado. El propietario hace el merge de instalación con builds pausados. | Comprobar main exacto, manifiesto vacío, consumidor disponible, legacy desactivado y política limitada a vacío. No ejecutar un build convencional con el registro completo. Si hay discrepancia, mantener la pausa y corregir. Reutilizar la misma rama tras el merge parcial conforme a H-007. |
| **I3 — Promoción vacía y publicación** | I2 verificada y acciones operativas autorizadas. Integrar en staging la documentación/controles de PS-03 ya preparados y validados; su cambio versionado permite comprobar una promoción con diferencias reales sin inventar una miniapp. Esperar a staging publicado y probado. El propietario inicia el workflow selectivo con SHA completo y sin altas. | PR real con commit exclusivo del destino, procedencia, recibo y `quality` único. El build selectivo verifica la nueva proyección; no repetir la suite funcional de staging. Presentar al propietario la evidencia, reactivar Workers Builds y hacer únicamente su merge manual de esa release. Workers Builds reconstruye y publica vacío. Si no hay diferencias, comprobar el no-op sin afirmar que se verificaron escrituras/PR reales; usar un cambio documental necesario del propio plan para completar esa comprobación. |
| **I4 — Regresión y análisis final** | I1–I3 completas. Contrastar lo servido con main/staging y la base previa. Revisar seguridad, recursos, deuda, controles, operación, concurrencia y recuperación. Corregir defectos del alcance y repetir lo afectado. | Catálogo vacío ES/EN, 404 de rutas/icono de Plan B, ninguna UI/chunk/activo excluido y recepción de identidad válida. Un solo publicador, legacy cerrado, strict/quality y permisos conservados. Regresión local/CI pertinente, evidencia de Workers Builds y comprobaciones remotas satisfactorias. Informe único; entregar para aceptación humana. |

No publicar nada antes de I3 ni presentar una simulación como ensayo remoto. Si al reactivar builds Cloudflare inicia una reconstrucción del main de instalación, deberá estar ya probado, con selección vacía y comando/variable correctos; identificar por separado los builds de instalación y de la release. No iniciar otra instalación hasta resolver una ejecución pendiente.

## Dependencias del propietario, una por vez

* Primero: aprobación del contrato/plan y autorización para preparar el código de I1; hoy no están concedidas.
* Después de I1 verificada: revisión de la candidata y coordinación de pausa/configuración/merge. Cada instrucción indicará repositorio/Worker, ajuste concreto, resultado esperado y evidencia; no pedir todo de una vez ni pedir tokens sin necesidad acreditada.
* Después de I2: dispatch vacío con SHA publicado, revisión de la PR generada, reactivación de builds y merge humano. Los pasos dependientes esperan confirmación; no interpretar tiempo transcurrido como aprobación.
* Al concluir I4: aceptación del resultado. Aprobar este borrador no significa que ya se hayan realizado estas acciones.

## Entorno, verificaciones y evidencia

Node 24.22.2/npm 11.19.1, dependencias del lockfile y Chromium fijado. Sin servicios nuevos. Preferir herramientas ya conectadas; nada de demos adicionales. Usar `.local/verification/ps03/` para logs, inventarios, recibos y comparación; el resumen durable será `docs/reports/ps03/verification.md` cuando se ejecute.

Existen `check`, `lint`, `format:check`, `test:unit`, `test:publication`, `test:promotion`, `verify` y `build:production` en desarrollo. El alias de producción aún debe instalarse en el destino. Sus controles seguirán usando los scripts npm comunes; no depender de aliases que desaparezcan al sincronizar el paquete. Las pruebas y comandos de identidad/activación de PS-03 se crearán tras autorizar el plan, no se dan por disponibles hoy.

Actualizar las fixtures exactas de controles y las auditorías de política/workflows cuando cambien. Conservar el pin del workflow de staging; modificarlo requiere revisión explícita de su nuevo hash. Los resultados anteriores se conservan como base, no como evidencia de una instalación futura.

## Riesgos y recuperación

El build remoto actual no aplica la selección; fusionar un registro completo antes de coordinar el consumidor podría servir Plan B. La pausa y la validación previa son condiciones del cambio, con el sitio previamente publicado disponible. Pausar builds no revierte lo ya servido.

Ante discrepancias de identidad, selección, permisos o contenido: detener promociones y mantener el estado conocido. Antes de I2 preparar una recuperación comprobada: PR propio hacia la última versión segura con consumidor/manifiesto/configuración compatibles y reconstrucción mediante Workers Builds; no revertir ciegamente a un commit que carezca del nuevo alias ni usar wrangler/Actions como publicador alternativo. Un resultado remoto incorrecto impide declarar I4 verificada.

Releer base/head/staging antes de preparar y comprobar una release. El avance posterior de staging no revoca automáticamente un verde anterior; documentar cuándo volver a preparar. Las fechas efectivas y la ausencia de regresiones se acreditan con evidencia real, no se infieren del plan.

## Estado y punto de parada

I1–I4 no iniciadas. Esta rama contiene solo propuesta documental. La aceptación de PS-02 y el merge de desarrollo #33 no autorizan instalación, reactivación de builds, dispatch de promoción, merge de producción o alta de Plan B. No ejecutar el contrato propuesto sin su aprobación y la autorización del plan.

| Fecha | Estado | Actor | Motivo |
| --- | --- | --- | --- |
| 2026-11-23 | `Borrador` | Agente | Preparar el siguiente resultado revisable tras confirmar el merge de #33; conservar el límite actual de pruebas hasta una decisión expresa del propietario. |
