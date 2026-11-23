# PS-03 · evidencia de instalación con catálogo vacío

2026-11-23. Plan aprobado y autorizado por Alexander López mediante «confirmado». [Plan canónico](../../exec-plans/active/PS-03-instalacion-selectiva-catalogo-vacio.md). I1 prepara la candidata; I2–I4 pendientes. No hay instalación, merge de producción o publicación realizados por este trabajo.

## Candidata local

Main de producción sigue en `f3474bab54c97f5d3ee50879874541b45161096e`. La candidata de configuración conserva su historia y controles y sincroniza todos los archivos de aplicación de staging `23424fcedcc4a075eac6284745100e01adcb6882`, árbol `89711fa42b769af2376e6167aca4f289bc01d7ca`. El manifiesto establece explícitamente cero miniapps; el registro original de staging no se duplica ni se modifica.

El digest del snapshot es `ea96f3f6b86f8e866b345719c926bc207c3d31425a15bb8b5a774126f7ae12bd`. `.github/miniapp-installation.json` registra origen/base/digest y exige validación viva en `quality`; no afirma que una preparación local ya sea elegible para publicar. El código de Plan B se copia como parte del proyecto público, pero sus rutas, UI, módulos e icono quedan excluidos del build servido.

## Verificaciones realizadas

* El staging de origen pasó [45272190937](https://github.com/aalexlpez/miminiapp/actions/runs/45272190937), prepare y remote-test. El acceso HTTP directo desde este entorno al manifiesto devuelve 403; esa respuesta no acredita su contenido ni determina la causa. El CI de la candidata deberá ejecutar la inspección real desde el contexto de preparación.
* Build local explícito satisfactorio: 4 páginas, **20 archivos** incluyendo identidad. `production-identity.ts` marca el resultado `local-validation`; no es una prueba de despliegue.
* Servidor localhost real: `/es/` y `/en/` responden 200 con catálogo vacío; rutas ES/EN e icono PNG de Plan B responden 404.
* Tipos, lint y formato de la candidata pasan; **170 pruebas específicas de controles** satisfactorias. Las pruebas comprueban snapshot completo y controles preservados, altas rechazadas, política/contexto, recibos de candidata, cierre del CLI legacy, identidad/inventario, checkout sucio, auditoría de módulos, cambios de main y actividad normal de revisión. La recuperación de una plataforma conocida se ensaya mediante un nuevo origen validado y una release vacía, con API en memoria; no se presenta como rollback real.
* Desarrollo pasa tipos/lint/formato e integración del compilador/motor con las fixtures actualizadas: vacío/A/A+B en memoria, sin escrituras remotas de release.

Los resultados completos y los heads exactos de CI se consolidarán tras abrir las PR de I1. Los logs y recibos locales quedan en `.local/verification/ps03/`; no se preparan demos adicionales.

## Controles de publicación y comprobación

La política operativa admite solo `empty-catalog`; cualquier alta, incluida Plan B, falla. Un recibo `candidate-build` no se presenta como publicación. El writer valida digest, intención e índice antes del contexto, no instala paquetes ni ejecuta código importado. El workflow y el CLI de snapshot completo quedan cerrados en la candidata.

La instalación se publicará únicamente después de la pausa/configuración y el merge humano. Workers Builds usará el compilador explícito seguido del emisor protegido de identidad, y la variable `MINIAPP_BUILD_TARGET=production`. El emisor toma commit/branch/build de las [variables automáticas documentadas por Cloudflare](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#default-variables), comprueba el contexto disponible y el grafo vacío y genera un inventario con hashes. No despliega nada.

El workflow manual **Verify served empty production** es de lectura, sin instalación o compilación. Deriva los SHAs esperados del main y su manifiesto, verifica que main no cambie durante la comprobación, contrasta identidad/archivos/404 y guarda un recibo. Los permisos siguen mínimos; ningún workflow de Actions publica producción.

## Pendientes esenciales

Validación remota del bootstrap en CI; confirmación del propietario de pausa/configuración; instalación en main; preparación real de una release vacía; build real de Workers Builds; verificación del sitio y regresión final I4. PS-03 permanece En curso. La aceptación de PS-02 y estas pruebas de I1 no sustituyen esos pasos.
