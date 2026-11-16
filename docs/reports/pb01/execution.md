# PB-01 — Ejecución de Plan B

**Actualizado:** 2026-11-16. **Responsable:** propietario de MiMiniApp. **Plan canónico:** [PB-01](../../exec-plans/active/PB-01-plan-b.md). Un solo informe para I1–I6; las secciones futuras se completarán con evidencia real.

## I1 — Base lógica y referencia

### Alcance y base

El propietario solicita repasar la documentación y comenzar la primera iteración. Se registra selección de Plan B, ficha v06 aprobada y ejecución parcial de I1. La entrega sigue la instrucción previa de usar el marco: rama, verificaciones, commit/push y PR a staging, con merge humano. No se ejecutan I2–I6 ni se aprueban ADR-MMA-020/021 por esta instrucción.

Rama `feature/pb01-i1-base` desde staging `d3d8386e6077911d84ee85bcc16981177f3d3b1d`, árbol `5136a7fa29ebbcaab95f8a53df08b8038483965e`. Frente a la base de planificación `07b95fd6b168b9b03150a48a9541ddbd3767748e`, los cambios son documentales: plan único, cierres aceptados y contrato de entrega actualizado; no cambia aplicación, pruebas, dependencias, configuración o activos de la plataforma.

Repaso previo: AGENTS, reglas de PLANS (un estado y autorización parcial, cierre global I6), definición y ficha v06, decisiones técnicas aplicables, arquitectura real, guía de miniapps, convenciones frontend, seguridad, evidencias y deuda. Se conserva la identidad común, ES/EN, el registro vacío hasta I5, ausencia de nuevas dependencias y dominio sin navegador, traducciones o almacenamiento.

### Referencia reproducible anterior al código

Node **24.22.2**, npm **11.19.1**, Chromium **156.0.8078.4**, Playwright **1.64.1**, revisión **1248**. `ASTRO_TELEMETRY_DISABLED=1` y navegador fijado mediante `PLAYWRIGHT_BROWSERS_PATH`. Antes de implementar, `npm run verify` terminó con código 0: tipos sin diagnósticos, lint, formato, hosting, **343 unitarias**, **9 componentes**, **78 E2E** e integración modular satisfactorios.

Inventario de las páginas construidas con contexto frío, viewport 393×851, temas claro/oscuro, recursos locales y fuentes listas. Cada fila coincide en los dos temas:

| Ruta | HTTP | Solicitudes | Bytes solicitados sin comprimir | Suma gzip estimada |
| --- | --- | --- | --- | --- |
| `/es/` | 200 | 4 | 196432 | 151480 |
| `/en/` | 200 | 4 | 196345 | 151419 |
| Ruta inexistente `/pb-i1-missing/` | 404 | 4 | 193761 | 150986 |

Recursos: documento, CSS común y las dos fuentes WOFF2. **Cero solicitudes externas**. La cifra gzip es la suma de comprimir cada cuerpo con gzip de Node, no una medición de Content-Encoding o Core Web Vitals. Se guardaron capturas mínimas ES/claro y EN/oscuro con animaciones desactivadas para comparación local; no son una revisión visual humana ni evidencia pública enlazada.

Se registraron hashes de los **19 archivos** del build. El inventario de deuda previo tiene blob Git `1e97e316c4336a53c888f5caf901084ecff13bbe`: PEND-007 (dependencias de desarrollo), PEND-009 (operación/mantenimiento) y PEND-010 (documentos históricos), entre otros; no se modifica ni declara resuelta esa deuda. Se conservan los límites aceptados de CP-02 e I-03. No se ejecutó una auditoría nueva de paquetes ni se confundieron sus cifras históricas con un resultado actual.

### Implementación

* `domain/validation.ts`: tipos de entradas, códigos de error independientes del idioma, trim exterior y límites por puntos de código; saltos pegados se rechazan antes del trim. Mantiene texto, puntuación, mayúsculas y Unicode, sin truncar ni interpretar HTML. Obstáculos cerrados, validación condicional de Otro, hora opcional y conjunto de días sin duplicados o huecos. Los valores normalizados del resultado no sustituyen al estado editable de futuros pasos.
* `domain/narrative-date.ts`: reloj inyectado consultado una vez; fecha local actual y primer día del siguiente mes natural, con año correcto y variante de enero. Copia inmutable de valores numéricos, independiente de posteriores cambios de reloj o del objeto Date entregado.
* `metadata.ts`: descriptor draft puro, título/descripción ES/EN y categoría everyday. Sin fecha de publicación, loader, entrada de producto o inscripción en el registro real.
* Helpers y fixture propios: copias temporales del proyecto con dependencias ya instaladas, registro sustituido solo en la copia y entrada sintética. Construyen variante draft con catálogo vacío y variante publicada de prueba; puertos asignados por el SO, baseURL propio, reutilización segura ante arranques simultáneos y limpieza de servidores/directorios.
* Las pruebas heredan el control de consola/red de `tests/e2e/fixtures.ts`. Comparan hashes del código copiado y comprueban que ni src ni dist reales cambian durante su ejecución; rechazan rutas y marcas de Plan B en el build público.

Ajustes comunes mecánicos necesarios: `tests/integration/modular-build.ts` limita su subejecución de unitarias a los módulos sintéticos I-02. Conserva sus expectativas de 2/4 pruebas y todos sus controles negativos; la batería general ejecuta además las nuevas pruebas reales de Plan B. `playwright.config.ts` excluye únicamente `.local/` del descubrimiento, porque contiene copias generadas con specs que no son suites independientes. No se desactivan pruebas del producto ni se cambia el catálogo para conseguir verde.

### Hallazgos y correcciones

| Hallazgo | Origen / impacto | Corrección y comprobación |
| --- | --- | --- |
| Conteo de fixtures I-02 incorporaría pruebas reales copiadas. | Supuesto previo del arnés, descubierto al añadir el primer módulo; produciría un falso fallo. | Filtro por path de las fixtures; pruebas de Plan B siguen en test:unit y E2E general. |
| Descubrimiento de specs duplicadas dentro de `.local/` al repetir verify. | Supuesto previo de Playwright con testDir raíz, expuesto por las copias del primer módulo con E2E; la primera ejecución pasaba y la siguiente fallaba al cargar una fixture desde esas copias. | testIgnore específico de artefactos; repetir verify manteniendo las copias existentes, con los 88 E2E reales descubiertos. |
| Regla CSS adicional de 29 bytes generada desde el nombre de una prueba. | Interacción con detección automática de Tailwind; alteraba el build público aunque no se registró la miniapp. | Nombre de prueba ajustado sin modificar sus aserciones o estilos globales; comparación final del build con la referencia. |
| Preview programático rechazaba un root en forma de URL. | Helper nuevo; el API público de Astro fijado usa la ruta como string al explorar rutas. | Se pasa la ruta absoluta; pruebas reales de ambas variantes y navegación ES/EN satisfactorias. |
| Lint interpretaba el callback de fixture como hook React. | Helper nuevo dentro del módulo. | Callback renombrado y estructura de cierre corregida; sin cambiar reglas globales ni desactivar lint. |
| Una ejecución dirigida de check no llevaba la variable de telemetría. | Entorno: intento de crear configuración Astro fuera del workspace. | Repetida con `ASTRO_TELEMETRY_DISABLED=1`, sin ampliar permisos ni cambiar HOME; tipos sin diagnósticos. Para el log de Wrangler se usa `WRANGLER_LOG_PATH` en un directorio temporal escribible, sin cambiar hosting o credenciales. |

### Dispositivos y acceso de I4

El propietario confirma que por ahora dispone de **Chrome de escritorio**; no se han aportado modelo/versión o acceso a iPhone/Safari y Android/Chrome. Chromium de escritorio y Pixel 7 emulado prueban el código automatizado, no equivalen a esos teléfonos físicos.

Existe staging HTTPS, que sirve el código fusionado. No hay una preview HTTPS autorizada del candidato de una rama feature. Esto no bloquea I1, pero sí las comprobaciones esenciales de I4; no se rebaja la matriz de la ficha por falta de dispositivos.

**Propuesta concreta, sin activar:** si se mantienen los teléfonos como objetivo, habilitar un Worker estático temporal separado, `miminiapp-plan-b-preview`, para el build de la candidata identificada por SHA, solo con datos sintéticos. URL pública a confirmar bajo el subdominio existente, sin secretos o persistencia remota; ciclo de vida limitado hasta terminar la validación. Objetivo de coste 0 USD sujeto a comprobar cuotas. Requiere decisión/autorización del propietario para crear el recurso, acceso de publicación limitado a ese Worker, publicación de la candidata y retirada posterior. No modifica staging/producción ni sus publicadores, no se crea por este informe y no se promete que resuelva la disponibilidad física de teléfonos. Otra matriz de dispositivos requiere revisar expresamente la ficha antes de I4.

### Verificación y entrega

Esta sección registra las comprobaciones locales. La evidencia remota se adjunta a la PR de entrega para su SHA; no se atribuyen resultados remotos al workspace. No se ha fusionado ni publicado la miniapp.

**Resultado local final: satisfactorio**, `npm run verify` con código 0: tipos sin errores/warnings/hints, lint, formato, hosting offline, **412 unitarias** (69 nuevas de dominio/metadatos de Plan B), **9 componentes**, **88 E2E** (10 nuevos de aislamiento, en dos perfiles Chromium) e integración modular. Se repitió con las copias `.local/` de una ejecución anterior presentes: no se redescubren como suites. Las unitarias del módulo también pasan en `TZ=America/New_York` y `TZ=Pacific/Kiritimati` (69 en cada zona).

La comparación posterior da los **19 archivos públicos idénticos byte a byte** a la referencia, con iguales solicitudes, cuerpos, hashes y estimaciones gzip para ES/EN/404 en claro y oscuro. Cero recursos adicionales de Plan B solicitados; no equivale a medir el presupuesto del producto futuro o Core Web Vitals de campo. Se conserva el catálogo vacío y sus aserciones originales. Los helpers cierran sus previews y retiran sus directorios propios; las copias históricas de integración I-02 permanecen como artefactos ignorados.

| Criterio de I1 | Evidencia / resultado |
| --- | --- |
| PB-I1-01 | Base/árbol, entorno, batería previa, inventario de seis vistas y deuda registrados. Cumple. |
| PB-I1-02 | Unicode, límites, saltos, Otro, hora/días, meses y sesión a medianoche; dos zonas adicionales. Cumple. |
| PB-I1-03 | Variantes draft/publicada sintética en builds/previews independientes, hashes antes/después, exclusión pública y limpieza; 10 E2E nuevos satisfactorios. Cumple. |
| PB-I1-04 | Diff acotado, batería completa y alcance del dispositivo/HTTPS explícito. Chrome de escritorio disponible; móviles físicos/preview HTTPS pendientes para I4. Cumple el inventario, sin atribuir pruebas móviles realizadas. |

**Handoff para I2:** dominio y descriptor draft listos, sin UI real ni registro público. IDs implementados: time/tiempo, motivation/motivación, unexpected/imprevisto, overload/exceso, forgetting/olvido y other/otro; días MO–SU. `captureNarrativeDate` se llama al empezar o cargar ejemplo y se conserva, no se recalcula al navegar. `validatePlanInputs` exige los campos activos completos; el futuro estado editable puede conservar entradas parciales sin intentar exportarlas. Reutilizar los helpers y su baseURL, no publicar fixtures. Antes de comenzar calendario se requieren la aprobación de ADR-MMA-021 y la autorización de I2. La selección de I1 como completada no acepta PB-01 completo: I2–I6 siguen sin iniciar.

No quedan fallos materiales abiertos de I1; las limitaciones físicas y de HTTPS son entradas futuras identificadas, sin pruebas sustitutivas. No hay nuevas dependencias, persistencia, exportaciones, cambios de plataforma o publicación.

## I2–I6

Sin comenzar. La autorización actual se limita a I1. I2 necesita ADR-MMA-021 aprobada, I3 ADR-MMA-020 y las restantes iteraciones sus recursos/revisiones expresas. I6 permanece como cierre global de todo el producto.
