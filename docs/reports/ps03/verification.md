# PS-03 · evidencia de instalación con catálogo vacío

2026-11-23. Plan aprobado y autorizado por Alexander López mediante «confirmado». [Plan canónico](../../exec-plans/active/PS-03-instalacion-selectiva-catalogo-vacio.md). I1 e I2 completadas; I3–I4 pendientes. El propietario hizo merge de la instalación; la publicación de PS-03 sigue pendiente con builds pausados según su confirmación.

## Candidata local

La base de instalación de producción es `f3474bab54c97f5d3ee50879874541b45161096e`. La candidata de configuración conserva su historia y controles y sincroniza todos los archivos de aplicación de staging `23424fcedcc4a075eac6284745100e01adcb6882`, árbol `89711fa42b769af2376e6167aca4f289bc01d7ca`. El manifiesto establece explícitamente cero miniapps; el registro original de staging no se duplica ni se modifica.

El digest del snapshot es `ea96f3f6b86f8e866b345719c926bc207c3d31425a15bb8b5a774126f7ae12bd`. `.github/miniapp-installation.json` registra origen/base/digest y exige validación viva en `quality`; no afirma que una preparación local ya sea elegible para publicar. El código de Plan B se copia como parte del proyecto público, pero sus rutas, UI, módulos e icono quedan excluidos del build servido.

## Verificaciones realizadas

- El staging de origen pasó [45272190937](https://github.com/aalexlpez/miminiapp/actions/runs/45272190937), prepare y remote-test. El acceso HTTP directo desde este entorno al manifiesto devuelve 403; esa respuesta no acredita su contenido ni determina la causa. El CI de producción [45284021865](https://github.com/soycerobytes/miminiapp/actions/runs/45284021865), job `quality` [138075517301](https://github.com/soycerobytes/miminiapp/actions/runs/45284021865/job/138075517301), sí pasó la inspección real de staging, comprobó repositorio/identidad/pruebas/procedencia y contrastó todos los archivos importados con su árbol inmutable.
- Build local explícito satisfactorio: 4 páginas, **20 archivos** incluyendo identidad. `production-identity.ts` marca el resultado `local-validation`; no es una prueba de despliegue.
- Servidor localhost real: `/es/` y `/en/` responden 200 con catálogo vacío; rutas ES/EN e icono PNG de Plan B responden 404.
- Tipos, lint y formato de la candidata pasan; **170 pruebas específicas de controles** satisfactorias. Las pruebas comprueban snapshot completo y controles preservados, altas rechazadas, política/contexto, recibos de candidata, cierre del CLI legacy, identidad/inventario, checkout sucio, auditoría de módulos, cambios de main y actividad normal de revisión. La recuperación de una plataforma conocida se ensaya mediante un nuevo origen validado y una release vacía, con API en memoria; no se presenta como rollback real.
- Desarrollo pasa tipos/lint/formato e integración del compilador/motor con las fixtures actualizadas: vacío/A/A+B en memoria, sin escrituras remotas de release.

La [PR de instalación #10](https://github.com/soycerobytes/miminiapp/pull/10), head `943ff78381a63d2b425c3a2748048caec2d8925a`, pasó `quality` en el árbol de merge de prueba `ee87dc1c4bb64820c359172f589038adbeeda27d` contra main `f3474bab54c97f5d3ee50879874541b45161096e`. Su identidad de build es `local-validation`, no Workers Builds. La [PR de desarrollo #34](https://github.com/aalexlpez/miminiapp/pull/34) pasó [45283152235](https://github.com/aalexlpez/miminiapp/actions/runs/45283152235) en `5cb2bb1d60ec47ec6e4a1844d1358c6dfd69cf76`; los commits documentales posteriores registran esta evidencia. Ese es el checkpoint de I1; #10 quedó integrada posteriormente, como se registra abajo.

La inspección viva registró el payload de staging `1eea16aaccf4ef1e7a46535093c118be0e13c5849bcee0397d704ed1758a5efc`, el árbol `89711fa42b769af2376e6167aca4f289bc01d7ca` y el run/intento `45272190937/1`. En la ejecución anterior, GitHub devolvió 403 al consultar los metadatos públicos del origen. La candidata vigente pasó sin cambiar credenciales ni enviar el token del destino al origen; no se atribuye una causa no acreditada. Se añadieron diagnósticos acotados de cuota, conservando el fallo cerrado y el reintento previsto por la guía.

Los logs y recibos locales quedan en `.local/verification/ps03/`, incluido `remote-i1.json` en el checkout de producción. No se preparan demos adicionales.

## Controles de publicación y comprobación

La política operativa admite solo `empty-catalog`; cualquier alta, incluida Plan B, falla. Un recibo `candidate-build` no se presenta como publicación. El writer valida digest, intención e índice antes del contexto, no instala paquetes ni ejecuta código importado. El workflow y el CLI de snapshot completo quedan cerrados en la candidata.

La instalación se publicará únicamente después de la pausa/configuración y el merge humano. Workers Builds usará el compilador explícito seguido del emisor protegido de identidad, y la variable `MINIAPP_BUILD_TARGET=production`. El emisor toma commit/branch/build de las [variables automáticas documentadas por Cloudflare](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/#default-variables), comprueba el contexto disponible y el grafo vacío y genera un inventario con hashes. No despliega nada.

El workflow manual **Verify served empty production** es de lectura, sin instalación o compilación. Deriva los SHAs esperados del main y su manifiesto, verifica que main no cambie durante la comprobación, contrasta identidad/archivos/404 y guarda un recibo. Los permisos siguen mínimos; ningún workflow de Actions publica producción.

## Instalación comprobada en main

El 2026-11-24 la PR #10 quedó integrada en `8ad2bd0ec0e2003db5bf824e32031f2297d3e26d`, con padres `f3474ba…` y `943ff78…`. Su árbol `7a3d9b9c24db558408dd3d7e579c968eba779c83` coincide exactamente con el head validado de la candidata; API y comparación Git no muestran diferencias. La rama estable está conservada. #8/#9 aparecen integradas en el mismo merge por la inclusión de sus commits, sin merges adicionales.

Manifiesto vacío, registro del snapshot, política `empty-catalog`, preparador selectivo manual y cierre del legacy comprobados en el SHA de main. La regla activa de producción conserva PR obligatoria, `quality` de GitHub Actions obligatorio y strict. No hay una nueva ejecución de publicación en GitHub; esto no demuestra por sí solo el estado de Cloudflare. El propietario confirmó sus comandos guardados, la variable de build `MINIAPP_BUILD_TARGET=production`, la pausa reactivada y previews apagados; no se atribuye verificación por API de Cloudflare. No se ejecuta una compilación redundante para el merge de árbol idéntico.

## Pendientes esenciales

Integrar y validar #34 en staging; preparar una release vacía real; build real de Workers Builds; verificación del sitio y regresión final I4. Mantener builds de producción pausados hasta su gate de publicación. PS-03 permanece En curso y todavía no está Verificado.
