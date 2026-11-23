# PS-02 · integración selectiva verificada bajo pruebas

2026-11-23. Responsable: Alexander López. Cuatro iteraciones secuenciales en `feature/ps02-release-integration-tests`, con aceptación final pendiente. El propietario aceptó PS-01 y aprobó/autorizó PS-02, exclusivamente preparación y pruebas. Este informe no autoriza instalación, merge de producción ni publicación.

## Resultado y evidencia

El compilador selectivo real se conecta a las funciones reales de preparación y comprobación de PR. `MemorySelectiveGitHub` intercepta todas las operaciones GitHub y falla ante llamadas desconocidas; no tiene transporte de red alternativo. Solo el servidor de pruebas en localhost recibe peticiones del test integrado. Los archivos del registro real y la identidad de Plan B no cambian.

| Selección sintética | Archivos del build | Comprobado |
| --- | --- | --- |
| Vacía | 19 | Catálogo vacío; rutas ES/EN e icono de Plan B devuelven 404. |
| A | 22 | Rutas ES/EN, catálogo, módulo/icono propio; Plan B excluida. |
| A+B | 25 | Selección y fechas acumuladas; módulos/activos propios; Plan B excluida. |

Cada caso atraviesa materialización, compilación, recibo, commit/rama/PR/dispatch simulados, comprobador y retry sin duplicados. La prueba de altas solo por manifiesto se conserva en las unitarias de producción. Se verifican altas/cambios/borrados del proyecto, preservación de controles y ascendencia exclusiva de producción. Tras aceptar A en memoria, una candidata B antigua falla; volver a prepararla conserva A y añade B.

Los controles de producción se congelan como archivos exactos `.fixture` con hashes SHA-256 y revisión del productor. No hay una implementación paralela del motor en desarrollo. `sync-selective-controls.ts` actualiza ese contrato explícitamente; CI usa las fixtures sin acceder a otro checkout. El esquema compartido queda en `scripts/promotion/miniapp-manifest.ts`, preservado por el destino, con blob fijado por política y reexportado por el selector.

## Regresión local

Node 24.22.2/npm 11.19.1, lockfile existente y Chromium fijado. Sin nuevas dependencias.

* Desarrollo: `npm run verify` satisfactorio: tipos, lint, formato, hosting, **560 unitarias, 27 componentes, 166 E2E**, integración modular, selector PS-01 e integración PS-02. El nuevo `test:promotion` está incluido en `verify`.
* Producción: tipos, lint, formato y **487 unitarias** satisfactorios. Se comprueban también el checkout versionado real y los workflows reales mediante pruebas de mutación.
* Comparación con staging `b81bc517f79e43a3060f30307c724bda0f941348`: **24 archivos antes/después, 22 idénticos byte a byte**. Solo varían los UIDs opacos de Astro en los HTML ES/EN de Plan B; al normalizarlos, esos HTML son idénticos. JavaScript, CSS, fuentes, imágenes y rutas no cambian; no se añade coste al bundle servido.
* El build integrado reutiliza las dependencias ya instaladas desde el lockfile. Un proceso Node hijo verifica por separado el entorno sin credenciales. La receta futura instala dependencias en su job de lectura, nunca en el writer.

Logs, recibos, inventarios y comparación quedan en `.local/verification/ps02/`, fuera de `dist` y de Git. No se preparan demos adicionales.

## Análisis final y correcciones

| Hallazgo | Acción y resultado |
| --- | --- |
| El writer no debía importar un esquema reemplazable desde staging. | Esquema movido a controles preservados; pin idéntico en origen/destino. Los helpers de builds aislados incluyen ese módulo y pasan la regresión. |
| Selección generada podía provocar otro CI de configuración o importarse por el legacy. | Exclusión explícita del manifiesto; paridad entre filtros/frontera comprobada. `quality` se conserva único. |
| Era necesario vincular recibo e intención manual, además del contenido compilado. | Verificación y writer contrastan todos los inputs originales. Cambiar la selección del recibo falla. |
| Compilación podía añadir archivos de entrada, además de modificar existentes. | Comprobación de bytes/modos y rechazo de entradas/symlinks adicionales no previstos. |
| Verificar varias veces todos los blobs gastaba cuota innecesaria. | Descarga pública concurrente con hashes, sin token del destino; del merge solo se lee ascendencia y de cada PR abierta solo procedencia. El escritor solicita blobs solo para los archivos añadidos/modificados y también proyecta los borrados. |
| Un marcador literal de clave privada hacía que el escáner rechazara sus propios tests. | Marcador construido en memoria y prueba del checkout versionado completo; resuelto sin relajar el escáner. |
| Comentarios o etiquetas nuevos podían invalidar una candidata sin cambios materiales. | Comparar solo identidad, base/head, repositorio, estado y commit de merge; la actividad normal de revisión se admite y las mutaciones de identidad fallan. |
| Las fixtures podían introducir utilidades Tailwind ajenas. | Exclusión explícita del escaneo; el CSS generado es idéntico a la base. |

Los permisos, acciones fijadas, condiciones desactivadas, rama/base/head, identidad del origen, intento/run, recibos, secretos, blobs y fallos parciales tienen verificaciones negativas. El preparador rechaza escrituras live antes de cualquier acceso al origen; no existe un flag que habilite la publicación. La deuda previa de dependencias se conserva sin cambios y sin añadir dependencias a este trabajo.

## CI de la entrega

La implementación de desarrollo `da2ae94120d5d968bd7a429149fee47346fae200` pasa [CI 45261742307](https://github.com/aalexlpez/miminiapp/actions/runs/45261742307): 560 unitarias, 27 componentes, 166 E2E y todas las integraciones. El cierre documental y la revisión de productor fijada en las fixtures conservan los mismos hashes de los diez archivos ejecutados. Los checks de #33 validan también el head final de la entrega.

Producción `293411b8d9ecc9fd95d11cbf36ce807951943be2` pasa [CI 45263209826](https://github.com/soycerobytes/miminiapp/actions/runs/45263209826): lint, formato y **158 pruebas de configuración/controles**, sin ejecutar la suite funcional de aplicación. Los recibos y pruebas locales se contrastan con ese productor final limpio. Ambos CI usan lectura; no son ejecuciones de preparación o publicación.

## Entrega y límites

PR de desarrollo [#33](https://github.com/aalexlpez/miminiapp/pull/33) hacia staging y configuración de producción [#9](https://github.com/soycerobytes/miminiapp/pull/9) hacia main, ambas en borrador. #9 reúne PS-01 y PS-02; [#8](https://github.com/soycerobytes/miminiapp/pull/8) permanece abierta/en borrador y no debe fusionarse para ensayar.

Staging se conserva en `b81bc517f79e43a3060f30307c724bda0f941348` y main de producción en `f3474bab54c97f5d3ee50879874541b45161096e`. El ruleset de producción sigue activo: `quality`/GitHub Actions obligatorio, base actualizada, cero aprobaciones externas, PR y restricciones de borrado/force push. No se ha alterado Cloudflare ni ejecutado el preparador instalado, una release real, un merge o un despliegue.

La receta nueva mantiene todos sus jobs desactivados y la política solo admite `test-only`/sin escrituras. El CI de configuración no acredita un preparador instalado ni una publicación. La compilación de la proyección selectiva se propone como comprobación adicional, sin repetir la suite funcional de staging. Los controles usan aliases npm comunes que sobreviven a la sustitución del paquete por snapshot.

La [guía](../../guides/selective-publication.md) y el [procedimiento del destino](https://github.com/soycerobytes/miminiapp/blob/feature/ps02-release-integration-tests/docs/production-promotion.md) preparan la migración vacía futura. Instalar/activar requiere otra autorización: consumidor disponible, manifiesto vacío, cambio coordinado de Workers Builds, desactivación del legacy y verificación/recibo del despliegue. Plan B sigue sin alta autorizada. Staging vivo conserva una ventana entre check y merge; no se promete revocar automáticamente verdes antiguos, sellar candidatas históricas, versiones por miniapp ni identidad binaria entre compilaciones.
