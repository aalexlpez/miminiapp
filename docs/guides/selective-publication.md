# Publicación selectiva · preparación y pruebas PS-01/PS-02

El propietario autoriza **solo preparación y pruebas**. Plan B continúa en staging, no está autorizada en producción. No ejecutar el preparador legacy de releases para probar este cambio: seguiría importando el snapshot completo con la visibilidad de staging. No hay workflow selectivo activo ni cambio en Workers Builds.

El [informe PS-02](../reports/ps02/verification.md) reúne los resultados del circuito, la regresión y los límites de la entrega.

## Builds

`npm run build` conserva el build de staging existente. `npm run build:production -- /ruta/al/manifiesto.json` compila explícitamente producción; sin argumento exige `.github/miniapp-release.json`. Si ese archivo no existe o es inválido, falla. `NODE_ENV` no selecciona aplicaciones. El manifiesto contiene `schemaVersion: 1`, `releaseId`, `sourceSha`, `destinationBaseSha` y `miniapps`, cada una con `slug` y `plannedReleaseDate`. La lista vacía es intencional y válida; la ausencia del archivo nunca equivale a vacío.

El registro `src/miniapps/registry.ts` sigue siendo único. Para producción se interpreta su forma estática documentada (imports de metadata, array de objetos `descriptor` y cargador directo de su propio `entry.astro`); no se evalúa ese archivo para elegir imports. El plugin genera únicamente los imports seleccionados y contrasta slug/estado con el descriptor real. Si cambia la forma del registro, el selector falla en lugar de interpretar código arbitrario. No introducir registros calculados, spreads o cargadores externos sin actualizar este contrato y sus pruebas. Los metadatos de aplicaciones excluidas tampoco se importan.

`scripts/publication/public-assets.json` asigna los archivos de `public/` a plataforma o miniapp; cada archivo debe tener exactamente un propietario. No se presume que un archivo nuevo es compartido. Los recursos seleccionados se copian a un `publicDir` temporal y el origen no se modifica. Imports ajenos que alcancen un bundle de producción hacen fallar la compilación. La evidencia del grafo de módulos queda en `.local/publication/`, fuera del sitio. Esa carpeta es temporal y puede eliminarse con los demás resultados locales tras revisar la evidencia.

`publishedAt` en la proyección de producción usa la fecha prevista conservada en el manifiesto; no acredita que se haya desplegado. El recibo posterior de despliegue y la fecha efectiva quedan pendientes de la activación. Ninguna fecha programa o dispara una publicación.

## Pruebas disponibles

```sh
ASTRO_TELEMETRY_DISABLED=1 npm run test:publication
```

Con Chromium instalado como en CI, el comando construye vacío, A y A+B sobre una copia que contiene todo Plan B. Comprueba catálogo, rutas ES/EN, 404 reales de rutas e iconos excluidos, grafo de módulos e hidratación de las apps sintéticas. Rechaza desconocidos, borradores y archivos sin propietario. Genera logs e inventarios con hashes bajo `.local/verification/ps01`. No añade fixtures al registro real ni publica archivos fuera de localhost. `npm run verify` incorpora esta prueba.

`npm run test:promotion` añade el circuito PS-02: compilador real, preparador real y comprobador de PR reales, con todas las escrituras GitHub interceptadas en memoria. Construye vacío/A/A+B, sirve las rutas en localhost y comprueba que Plan B responde 404. `npm run verify` también lo ejecuta. Los controles del otro repositorio se conservan como fixtures exactas con hashes y revisión de origen, no como una segunda implementación. Se actualizan expresamente con `node scripts/publication/sync-selective-controls.ts /ruta/al/checkout-de-produccion`; CI no depende de ese checkout ni necesita acceso de escritura. Evidencia temporal en `.local/verification/ps02/`.

## Preparación local en el checkout de producción

`scripts/promotion/selective-preview.ts` en la rama PS-01 de producción genera un proyecto candidato local, conservando los controles de ese repositorio. Requiere una base exacta e inicialización vacía explícita. Sus pruebas cubren altas solo por manifiesto, acumulación, repetición, borrados, secretos y enlaces. No tiene modo de publicación ni acceso a GitHub/Cloudflare; no ejecuta builds automáticamente. `registry-source.ts` se importa por snapshot. En PS-02, el esquema canónico reside en `scripts/promotion/miniapp-manifest.ts`, preservado por los controles de producción; `scripts/publication/manifest.ts` lo reexporta. La política de pruebas fija el blob idéntico en ambos repositorios: modificarlo exige revisión explícita del destino.

La rama PS-02 de producción prepara `selective-cli.ts` y una receta manual con todos sus jobs en `if: false`. La política solo admite `mode: test-only`, `writesEnabled: false` y el CLI rechaza escrituras reales antes de acceder al origen. Los casos con permisos de escritura se ejecutan mediante puertos en memoria. El CI de la propuesta mantiene un único `quality`: para candidatas selectivas prevé comprobar la proyección con un build aislado sin tokens, sin repetir las pruebas funcionales de staging. Nada de esto instala el código en `main` ni cambia Workers Builds.

Una candidata local con cambios sin commit se identifica como tal, con SHA de base y fingerprints del contenido exacto; no se presenta como SHA validado en staging. El JSON de preview incluye `testOnly: true` y `stagingValidation: not-performed` y no es evidencia elegible para publicar.

## Dependencias futuras, por orden

1. PS-01 aceptado el 2026-11-23; desarrollo #32 integrado. El propietario confirma mediante capturas que los previews están desactivados; las PR de producción permanecen en borrador. No fusionar `main` para ensayar porque su merge puede disparar Workers Builds.
2. Incorporar pruebas a ramas/PR de configuración y verificar su check real, sin merge de producción. El CI de configuración de producción añade las siete pruebas del simulador al check existente, manteniendo lectura y sin secretos. La captura acredita previews apagados en el momento de preparar la entrega.
3. Dependencia administrativa resuelta el 2026-11-23: el propietario exige `quality` de GitHub Actions y base actualizada en `main`; la API confirma ambos ajustes y cero aprobaciones externas. Los checks de las PR identifican sus heads exactos.
4. Verificar y aceptar PS-02, autorizado solo para pruebas: conexión propuesta al workflow manual, una PR de release activa, hashes/evidencia y build sin permisos de escritura. El job con escritura usa exclusivamente controles propios revisados. Revalidar base/head. El contrato conserva staging vivo: un verde antiguo no se invalida solo porque avance staging; antes de la futura publicación, revisar elegibilidad actual y volver a preparar/comprobar si ha cambiado. No hay una garantía de sellado al instante del merge.
5. Migrar con manifiesto vacío, entrada de build de producción explícita en Workers Builds y comprobación posterior. Cualquier activación o merge necesita instrucción propia. **Plan B sigue fuera** hasta que el propietario autorice expresamente su alta.

La selección no aísla versiones: la plataforma, dependencias y apps ya públicas se actualizan desde el mismo snapshot. Ambos repositorios son públicos; excluir el artefacto servido no crea embargo del código. Candidatas archivadas y lanzamientos por versiones independientes quedan fuera de PS-01.
