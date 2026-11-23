# Publicación selectiva · preparación local PS-01

El propietario autoriza **solo preparación y pruebas**. Plan B continúa en staging, no está autorizada en producción. No ejecutar el preparador legacy de releases para probar este cambio: seguiría importando el snapshot completo con la visibilidad de staging. No hay workflow selectivo activo ni cambio en Workers Builds.

## Builds

`npm run build` conserva el build de staging existente. `npm run build:production -- /ruta/al/manifiesto.json` compila explícitamente producción; sin argumento exige `.github/miniapp-release.json`. Si ese archivo no existe o es inválido, falla. `NODE_ENV` no selecciona aplicaciones. El manifiesto contiene `schemaVersion: 1`, `releaseId`, `sourceSha`, `destinationBaseSha` y `miniapps`, cada una con `slug` y `plannedReleaseDate`. La lista vacía es intencional y válida; la ausencia del archivo nunca equivale a vacío.

El registro `src/miniapps/registry.ts` sigue siendo único. Para producción se interpreta su forma estática documentada (imports de metadata, array de objetos `descriptor` y cargador directo de su propio `entry.astro`); no se evalúa ese archivo para elegir imports. El plugin genera únicamente los imports seleccionados y contrasta slug/estado con el descriptor real. Si cambia la forma del registro, el selector falla en lugar de interpretar código arbitrario. No introducir registros calculados, spreads o cargadores externos sin actualizar este contrato y sus pruebas. Los metadatos de aplicaciones excluidas tampoco se importan.

`scripts/publication/public-assets.json` asigna los archivos de `public/` a plataforma o miniapp; cada archivo debe tener exactamente un propietario. No se presume que un archivo nuevo es compartido. Los recursos seleccionados se copian a un `publicDir` temporal y el origen no se modifica. Imports ajenos que alcancen un bundle de producción hacen fallar la compilación. La evidencia del grafo de módulos queda en `.local/publication/`, fuera del sitio. Esa carpeta es temporal y puede eliminarse con los demás resultados locales tras revisar la evidencia.

`publishedAt` en la proyección de producción usa la fecha prevista conservada en el manifiesto; no acredita que se haya desplegado. El recibo posterior de despliegue y la fecha efectiva quedan pendientes de la activación. Ninguna fecha programa o dispara una publicación.

## Pruebas disponibles

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run test:publication
```

Con Chromium instalado como en CI, el comando construye vacío, A y A+B sobre una copia que contiene todo Plan B. Comprueba catálogo, rutas ES/EN, 404 reales de rutas e iconos excluidos, grafo de módulos e hidratación de las apps sintéticas. Rechaza desconocidos, borradores y archivos sin propietario. Genera logs e inventarios con hashes bajo `.local/verification/ps01`. No añade fixtures al registro real ni publica archivos fuera de localhost. `npm run verify` incorpora esta prueba al final.

## Preparación local en el checkout de producción

`scripts/promotion/selective-preview.ts` en la rama PS-01 de producción genera un proyecto candidato local, conservando los controles de ese repositorio. Requiere una base exacta e inicialización vacía explícita. Sus pruebas cubren altas solo por manifiesto, acumulación, repetición, borrados, secretos y enlaces. No tiene modo de publicación ni acceso a GitHub/Cloudflare; no ejecuta builds automáticamente. Las copias de `manifest.ts` y `registry-source.ts` usadas allí son idénticas a las de desarrollo y se reemplazarán normalmente por snapshot; el simulador no es el futuro job con escritura.

Una candidata local con cambios sin commit se identifica como tal, con SHA de base y fingerprints del contenido exacto; no se presenta como SHA validado en staging. El JSON de preview incluye `testOnly: true` y `stagingValidation: not-performed` y no es evidencia elegible para publicar.

## Dependencias futuras, por orden

1. Revisar y aceptar el resultado local. Decidir una prueba remota aislada; no utilizar `main` para ensayar porque su merge puede disparar Workers Builds.
2. Incorporar pruebas a ramas/PR de configuración y verificar su check real, sin merge de producción. Antes de subir allí, confirmar que los previews de Cloudflare están desactivados o aislados.
3. El administrador configura `quality` obligatorio en `main`, sin exigir un segundo revisor al único desarrollador. Volver a leer la regla y acreditar su asociación al candidato exacto.
4. Preparar la conexión del selector al workflow manual, con una PR de release activa, hashes/evidencia y build sin permisos de escritura. El job con escritura no puede ejecutar los módulos importados de staging; debe usar sus controles propios revisados. Revalidar base/head, y explicitar el límite de staging vivo: un verde antiguo no se invalida solo porque avance staging.
5. Migrar con manifiesto vacío, entrada de build de producción explícita en Workers Builds y comprobación posterior. Cualquier activación o merge necesita instrucción propia. **Plan B sigue fuera** hasta que el propietario autorice expresamente su alta.

La selección no aísla versiones: la plataforma, dependencias y apps ya públicas se actualizan desde el mismo snapshot. Ambos repositorios son públicos; excluir el artefacto servido no crea embargo del código. Candidatas archivadas y lanzamientos por versiones independientes quedan fuera de PS-01.
