# PB-01 — Plan B / Bad Day Plan: seis iteraciones

## Control

* **Estado:** `En curso`.
* **Responsable de aprobación, autorización, aceptación y cancelación:** propietario de MiMiniApp (Alexander / Ale).
* **Creado:** 2026-11-15. **Última actualización:** 2026-11-18.
* **Base de planificación:** staging `07b95fd6b168b9b03150a48a9541ddbd3767748e`. Registrar la base real al ejecutar y explicar sus diferencias.
* **Rama de trabajo estable:** `feature/pb01-plan-b`, única para las iteraciones restantes y ajustes de PB-01, según [H-007](../../harness-decisions.md#h-007--una-rama-por-execplan-y-commits-por-iteración). Se sincroniza desde staging tras cada entrega parcial.
* **Commits:** `tipo(PB-01/Ix): descripción en inglés`; la entrega actual pertenece a I6. Ramas anteriores de planificación/I1/I2 conservadas como procedencia en el historial y el informe, sin reescribir commits.
* **Organización:** un único ExecPlan con seis iteraciones internas secuenciales I1 → I2 → I3 → I4 → I5 → I6. La última es siempre regresión y análisis global.
* **Iteración actual:** I6 — regresión y análisis global. I5 integrada mediante PR #24; base histórica de inicio I6 staging `3d28184f3c90db44fe57a7592e23a5e71c071f23`, árbol `b87a726f794591a0a28ac606bf0d8bd453cd5332`. Misma rama estable sincronizada desde staging. I4/I5 conservan sus criterios físicos/manuales abiertos.
* **Aprobación del plan:** 2026-11-16, propietario de MiMiniApp, mediante «los planes que están por confirmarse, quiero que analices si ya pasan los criterios de aceptación y pasalos a aprobados», condicionada a la revisión documentada abajo.
* **Autorización actual:** el 2026-11-17 el propietario indica «listo la ultima iteración, continua», tras integrar PR #24. Se inicia I6 en la misma rama: revisión del conjunto, regresión, mediciones, evidencia remota de staging, correcciones locales del contrato aprobado y entrega por commits PB-01/I6, push y PR. La indicación permite realizar la revisión técnica aunque la matriz física y revisiones humanas anteriores sigan pendientes; no las da por ejecutadas ni acepta el producto. Sin nuevas funciones, infraestructura, merge/publicación por el agente o cambios de controles. El plan permanece En curso mientras falte evidencia esencial.

## Planificación de mejora frontend posterior

El propietario considera funcional la base y solicita mejorar su experiencia UX/UI. [FE-01](FE-01-estandar-frontend-y-piloto-plan-b.md) ejecuta esa mejora en feature/fe01-frontend-quality, conforme a ADR-MMA-022/023 y ficha v07 aprobadas. I1–I6 completadas; acabado I6 aprobado por el propietario sobre 7f027f3. I7 corrige una espera de codificación PNG y revalida localmente el candidato 2d213dd863d5efd49645b81fa80398adfa8295aa: 518 unitarias, 25 componentes, 156 E2E e integración satisfactorias. No hay cambios de dependencias o del dominio de calendario.

El [handoff de I7](../../reports/fe01/execution.md#i7--regresión-y-análisis-global) identifica evidencia reutilizable y cada PB-AC afectado. PB-01 mantiene su historia y estado En curso: la aprobación visual FE-01/I6 cubre el piloto revisado, pero no acredita importación de calendarios, destinos nativos, fondo bajo reloj o compatibilidad física. No ejecutar cambios paralelos de UI en PB-01 durante FE-01. La revisión I6 de PB-01 debe referirse al candidato que finalmente se integre y revalidar la evidencia afectada por cambios posteriores.

Las correcciones históricas de PB-01/I6 quedaron integradas por PR #25 (staging 1b2046), y staging actual e4b42f1 incluye además FE-01/I1. El candidato funcional FE-01 todavía es local: CI/staging propios pendientes; [riesgo de dependencias](../../reports/fe01/security-review.md) aceptado como deuda no bloqueante para esta entrega. Ninguna de estas comprobaciones cierra I4/I5/I6 de PB-01 ni acepta el producto.

**Refinamiento FE-02 — 2026-11-18:** ficha v08/ADR-MMA-024 aprobadas y [nuevo plan](FE-02-plan-b-seleccion-y-marca.md) autorizado por el propietario, reutilizando la rama FE de forma secuencial. Parte de FE-01 integrada por PR #28 (7cf32ca); añade selección simple/personalizada y marca PNG, preservando dominio/sesión/formatos. Su última regresión reemplazará la evidencia local afectada; no acredita pruebas físicas ni acepta PB-01.

## Objetivo, alcance y decisiones

Entregar Plan B integrada en MiMiniApp: propósito, obstáculo y frase si/entonces, ES/EN, ejemplo/reset, sesión temporal, calendario de cuatro semanas, PNG para fondo de bloqueo y enlace compartible, con privacidad, accesibilidad y resultados verificables. La [ficha v07](../../product-specs/plan-b.md) conserva el contrato funcional y los doce PB-AC; este plan describe cómo ejecutarlo y demostrarlo.

Ya aprobadas: ADR-MMA-001/002/003/005/006/008/011/015/016/017/019 para stack, modularidad, client-first, pruebas, idiomas e identidad, y ADR-MMA-004/009/014 para el circuito de entrega existente. Selección/ficha y plan aprobados al comenzar I1; requiere ADR-MMA-021 antes de implementar exportaciones en I2 y ADR-MMA-020 antes de persistencia en I3. Sus estados se consultan en el [registro técnico](../../design-docs/index.md), sin inferirlos de este archivo.

El código previsto vive en `src/miniapps/plan-b/`. El único cambio común de aplicación es su inscripción en el registro durante I5. En I1 se acota mecánicamente el filtro de unitarias sintéticas de `tests/integration/modular-build.ts` a sus fixtures I-02: las pruebas reales nuevas de Plan B se ejecutan en test:unit, sin alterar los recuentos ni las aserciones de aquellas fixtures. Playwright excluye `.local/`, evitando redescubrir specs de esas copias; los tests reales del módulo siguen incluidos. Se permiten los ajustes de pruebas identificados en I5 para conservar cobertura del catálogo vacío y añadir el caso poblado. No se cambian rutas genéricas, layouts, estilos globales, dependencias/lockfile, workflows, credenciales o infraestructura. Producción, promoción, rollback remoto, APIs/OAuth, analítica, backend y PWA quedan fuera.

El presupuesto del propietario se conserva: **6–12 h en 3–4 sesiones** de revisión/prueba. Las seis iteraciones acotan el trabajo de IA, no añaden seis sesiones humanas ni garantizan fecha. Si un problema desborda una unidad corta, documentar y revisar alcance antes de ampliarlo; la revisión global sigue siendo la última actividad.

## Orden, avance y puntos de revisión

PB-01 tiene un solo estado canónico, historial y aceptación final. Las iteraciones internas usan tareas y evidencia, no otros ExecPlans ni estados de aprobación propios. Una vez autorizado el alcance, la IA puede avanzar secuencialmente cuando: (1) termina las tareas y criterios de salida de la iteración actual, (2) registra pruebas y diferencias, (3) la siguiente está dentro del alcance autorizado y (4) dispone de sus recursos/decisiones. No necesita pedir otra aprobación entre iteraciones por trámite.

Si el propietario autoriza solo una parte, parar en ese límite. Un cambio de alcance/decisión técnica o un criterio esencial fallido detiene el trabajo afectado. No dar por completada una iteración usando mocks en lugar de la función examinada, quitando aserciones o haciendo skip. Cada avance conserva regresión local y handoff: revisión examinada, cambios, pruebas, pendientes y siguiente paso.

| Iteración | Entrada adicional | Entrega y condición para avanzar |
| --- | --- | --- |
| I1 — base | Ficha/selección y PB-01 aprobados y ejecución autorizada | Dominio inicial, referencia reproducible y build aislado; criterios PB-I1 comprobados. |
| I2 — calendario | I1 completada y ADR-MMA-021 aprobada | Generadores con expectativas independientes y muestras; criterios PB-I2 comprobados. |
| I3 — recorrido | I2 completada y ADR-MMA-020 aprobada | UI real ES/EN, sesión/reset y E2E aislados; criterios PB-I3 comprobados. |
| I4 — salidas | I3 completada; móviles y UI candidata accesible por HTTPS | Descargas, calendario y PNG verificados en ambos móviles; criterios PB-I4 comprobados. |
| I5 — visual e integración | I4 completada; permiso de incorporación del candidato al catálogo | Candidato completo, identidad alineada y pruebas reales; criterios PB-I5 comprobados. |
| I6 — regresión global | I1–I5 completadas; candidato y referencia identificados | Todo el contrato contrastado, sin hallazgos materiales pendientes y validación final CI/staging autorizada; criterios PB-I6 comprobados. |

**Participación humana prevista:** Ale valida las operaciones físicas de I4 y revisa la identidad/compatibilidad visual de I5; el propietario aprueba la incorporación al catálogo y decide los merges/publicaciones y la aceptación final. Si una aprobación o permiso concreto ya consta expresamente dentro de la autorización vigente, registrarlo y continuar sin volver a pedirlo. La IA no sustituye pruebas físicas con emulación ni realiza el merge por iniciativa propia.

**Capacidad a comprobar desde I1:** una vista previa HTTPS ya disponible y autorizada para ambos teléfonos. Staging sirve la versión fusionada, no una rama feature. Si falta la capacidad, preparar una propuesta concreta de acceso, coste y permisos; no crear hosting/túneles o publicar un prototipo para eludirlo. La lógica local autorizada puede continuar, pero I4 no se completa sin evidencia real. I-03/CP-02/MT-02 mantienen sus propios estados: solo bloquean este plan si aparece una dependencia concreta de sus contratos.

## Entorno, pruebas y evidencia comunes

Usar Node 24.22.2 / npm 11.19.1 y Chromium r1248 como referencia fijada, comprobando su disponibilidad real. En este workspace puede establecerse `PATH=/workspace/.tools/node-v24.22.2-linux-x64/bin:$PATH`, `PLAYWRIGHT_BROWSERS_PATH=/workspace/.cache/ms-playwright` y `ASTRO_TELEMETRY_DISABLED=1` para los comandos. No cambiar engines/lockfile o usar otro navegador para eludir un fallo.

Comandos existentes: `npm run check`, `npm run lint`, `npm run format:check`, `npm run build`, `npm run test:unit`, `npm run test:components`, `npm run test:e2e`, `npm run test:integration` y `npm run verify`. Usar pruebas dirigidas durante implementación y `verify` sobre cada entregable comprobado; repetir si cambian código/tests o quedan fallos, sin repeticiones por trámite. Los helpers de build/preview aislados de I1 están disponibles dentro del módulo; las mediciones locales se registran en el informe sin introducir comandos ficticios. `test:remote` exige identidad/target aprobados y lo ejecuta Actions por el circuito existente.

Todos los resultados se registran en **un informe de ejecución**, `docs/reports/pb01/execution.md`, con secciones I1–I6, creado cuando exista evidencia real. No se requieren seis informes. Incluir comando, entorno, commit/árbol, resultado y límites; enlazar CI por run/revisión. Aplicar la [política de evidencias](../../standards/QUALITY_SCORE.md#política-de-evidencias): capturas mínimas solo si hacen falta para aprobación, datos sintéticos, sin secretos/planes personales y logs temporales sin presentarlos como enlaces compartidos.

## Iteración 1 — Base lógica y referencia

**Entrada:** Ficha/selección y plan aprobados, con ejecución de este alcance autorizada. No hay resultado previo de Plan B requerido.

**Resultado:** Una base pequeña y comprobable de Plan B: entradas y fechas narrativas correctas, descriptor todavía sin publicar y un build aislado que permita desarrollar sin filtrar borradores al catálogo real.

**Archivos previstos:** `src/miniapps/plan-b/metadata.ts`, `domain/validation.ts`, `domain/narrative-date.ts`, `tests/domain.test.ts` y `tests/helpers/` para un build/preview aislado. No inscribir todavía Plan B en el registro real ni cambiar rutas, layouts o configuración de aplicación/publicación. Ajuste mecánico de pruebas necesario: excluir las copias generadas de `.local/` del descubrimiento de Playwright, manteniendo todas las suites reales.

### Trabajo

1. Antes de codificar, guardar SHA/árbol del staging vigente, versiones, resultado completo de `npm run verify`, inventario de solicitudes/bytes de las portadas ES/EN y 404, capturas mínimas claro/oscuro y estado de deuda. Comparar con `07b95fd6b168b9b03150a48a9541ddbd3767748e`, última base conocida, y explicar cualquier delta. No fijar un recuento de tests como prueba de corrección.
2. Definir tipos de entradas y validación conforme a la ficha: trim exterior, puntos de código, límites y rechazo de saltos; mes natural siguiente, año y fecha narrativa estable por sesión. Inyectar el reloj en las pruebas y mantener el dominio sin DOM, idiomas ni almacenamiento.
3. Crear metadatos draft puros ES/EN sin loader; mantener el registro público intacto. Así las pruebas actuales que esperan catálogo vacío siguen siendo válidas hasta la integración final.
4. Preparar un helper de pruebas que copie el proyecto a una ubicación temporal, sustituya solo el registro de esa copia y construya variantes vacía y publicada de prueba. El entry mínimo inicial es una fixture aislada; iteración 3 lo sustituirá por la interfaz real. No usar flags de build públicos para exponer borradores.
5. Comprobar que futuras pruebas de módulo pueden arrancar su preview aislado y fijar su propio `baseURL` sin interferir con el preview de plataforma. Conservar el control de consola/red de `tests/e2e/fixtures.ts`, cerrar servidores y borrar temporales propios. Las pruebas de herramientas en draft no pueden pasar por omisión o `skip`.
6. Inventariar disponibilidad de iPhone/Safari, Android/Chrome y acceso HTTPS al candidato para iteración 4. Si falta la vista previa, proponer una capacidad concreta con alcance, coste y permisos; no crear hosting/túneles. Este pendiente bloquea iteración 4, no la lógica independiente de iteración 1.

### Criterios de salida y pruebas

| ID | Salida comprobable | Evidencia |
| --- | --- | --- |
| PB-I1-01 | Referencia inicial identificada y reproducible: fuentes, entorno, batería, solicitudes y deuda. | Resumen y métricas en `docs/reports/pb01/execution.md`, a crear al ejecutar; conservar datos comparables para iteración 6. |
| PB-I1-02 | Validación sin reescritura y meses correctos en enero 31, bisiesto, diciembre/enero y sesión que cruza medianoche. | Expectativas independientes, entradas mínimas/máximas, espacios, saltos y emoji. |
| PB-I1-03 | La copia aislada construye variantes vacía/publicada y no altera src, registro o dist del proyecto real. | Hashes anteriores/posteriores, rutas esperadas y exclusión de marcas de fixtures/borradores del build público. |
| PB-I1-04 | El cambio está acotado y deja identificada la disponibilidad móvil/HTTPS. | Pruebas dirigidas y `npm run verify` sin desactivar las aserciones de catálogo vacío. |

**Cobertura de ficha:** PB-AC-03; validación de PB-AC-02; referencia para PB-AC-01/11/12. No acredita exportaciones, persistencia o compatibilidad móvil.

### Regresión local y entrega

Comparar el catálogo y las páginas existentes con la referencia: sus rutas, idioma, identidad, foco y solicitudes siguen funcionando. Buscar duplicación del contrato de validación, importaciones con efectos laterales y residuos de fixtures. Corregir cualquier modificación accidental del entregable público y repetir integración y batería afectada.

Dominio mínimo probado, metadatos fuera del registro real, helper de build/preview aislado y referencia reproducible para I6. Marcar las tareas de esta iteración solo con los criterios anteriores comprobados y registrar el handoff en el informe único antes de avanzar.

## Iteración 2 — Calendario

**Entrada:** I1 completada y evidencia disponible; ADR-MMA-021 aprobada. Mantener el registro real sin publicar.

**Resultado:** Generar correctamente el evento, el archivo .ics y el enlace Google con datos sintéticos, separando la corrección del formato de la posterior compatibilidad del botón de descarga en móviles.

**Archivos previstos:** `src/miniapps/plan-b/domain/calendar.ts`, `domain/icalendar.ts`, `domain/google-calendar.ts`, sus `tests/*.test.ts` y muestras sintéticas de prueba generadas localmente. Registro real sin cambios.

### Trabajo

1. Leer el handoff y el contrato comprobados en la iteración 1. Fijar entradas/fecha/UID en pruebas; compartir un único modelo de evento para .ics y Google, sin duplicar cálculos por formato.
2. Implementar primer día seleccionado desde mañana, fin de 15 minutos con cruce de fecha y regla semanal de cuatro apariciones por día. Probar conjuntos de 1/5/7 días y el caso de exportación domingo 2026-11-15 → lunes 16, 20 eventos, última aparición viernes 2026-12-11.
3. Serializar VCALENDAR/VEVENT/VALARM, UID y DTSTAMP, fechas locales flotantes, CRLF, escapes TEXT y plegado UTF-8 de 75 octetos con continuación. Rechazar entradas inválidas antes de serializar; no insertar propiedades nuevas a partir de saltos o texto con apariencia de iCalendar.
4. Construir el enlace Google con APIs URL, parámetros codificados y la misma serie. No abrir Google ni hacer peticiones desde el generador o la suite automática.
5. Producir muestras .ics y enlaces sintéticos para importación posterior. Una primera importación manual puede adelantar hallazgos, pero no acredita las APIs de descarga; la verificación física obligatoria corresponde a iteración 4.
6. Documentar límites de hora flotante, DST, zona del dispositivo/calendario, UID nuevo e importaciones repetidas. No resolver un problema de compatibilidad introduciendo zonas o librerías fuera de la decisión aprobada.

### Criterios de salida y pruebas

| ID | Salida comprobable | Evidencia |
| --- | --- | --- |
| PB-I2-01 | Fechas, duración y número de apariciones cumplen la ficha. | Tablas de expectativas independientes y enumeración del intervalo de 28 días; casos de medianoche, cambio de año y DST sin convertirlo en hora UTC fija. |
| PB-I2-02 | .ics válido y texto preservado, sin inyección o UTF-8 partido. | Fixtures de comas, punto y coma, barras, CRLF y emoji justo en el límite de plegado; reconstrucción de valores independiente del serializador. |
| PB-I2-03 | Google y .ics representan el mismo evento y recurrencia. | Decodificar parámetros con valores esperados, incluidas tildes, &, #, ?, emoji y texto parecido a HTML; cero llamadas externas. |
| PB-I2-04 | iteración 1 sigue pasando y no cambia la plataforma. | Pruebas de dominio y `npm run verify`; revisión del diff y del modelo compartido. |

**Cobertura de ficha:** PB-AC-05/06 en lógica y formato; PB-AC-08 en preservación textual. Consentimiento, importación física y descarga aún no se acreditan.

### Regresión local y entrega

Repetir validación y fechas de iteración 1. Revisar que el reloj se consulta en el límite correcto y que UI, Google y .ics no divergen por duplicación, zona o formateo. Las muestras generadas no pueden acabar en el catálogo, bundle o documentación con datos personales.

Generadores puros con pruebas independientes y muestras reproducibles. Registrar resultado en `docs/reports/pb01/execution.md`; cualquier prueba física adelantada se identifica con app/versiones y no sustituye iteración 4. Marcar las tareas de esta iteración solo con los criterios anteriores comprobados y registrar el handoff en el informe único antes de avanzar.

## Iteración 3 — Recorrido y estado

**Entrada:** I2 completada y ADR-MMA-020 aprobada. La interfaz usa el dominio comprobado y el build aislado.

**Resultado:** Completar el recorrido desde portada hasta plan en pantalla, con ejemplo, sugerencias, validaciones, navegación, recuperación y reset en ambos idiomas, dentro del build aislado.

**Archivos previstos:** `src/miniapps/plan-b/entry.astro`, `App.tsx`, componentes internos, `i18n/es.ts`, `i18n/en.ts`, adaptación de `browser/session.ts` y `tests/` del módulo. La lógica pura conserva su separación del DOM; registro real sin cambios.

### Trabajo

1. Conectar la interfaz real al helper de iteración 1 y al dominio de iteraciones 1 y 2. Mantener una sola fuente para entradas validadas y frases; los generadores no se invocan con estados parciales inválidos.
2. Implementar portada, tres pasos y resultado con plan; sugerencias que sustituyen solo su campo, Otro, hora/días opcionales, Atrás y foco al título. Los botones de exportación se incorporan en iteración 4; no simular éxito de funciones pendientes.
3. Cargar textos y metadatos ES/EN con paridad y placeholders iguales. Usar los tokens y fuentes existentes desde el primer componente, sin duplicar título principal, cabecera o pie. El acabado de gris/sello corresponde a iteración 5.
4. Implementar almacenamiento versionado y validado, memoria ante fallo, restauración, reset y avisos. Probar lecturas, escrituras y borrados rechazados; no tocar claves ajenas ni ocultar un fallo de borrado.
5. Implementar ejemplo con etiqueta hasta la primera edición y fecha narrativa estable. Cambiar idioma conserva literalmente entradas/ejemplo si hay sessionStorage; con memoria sola se avisa antes de la navegación, sin modificar la cabecera compartida.
6. Crear E2E del módulo contra su preview aislado con servidor/baseURL propios. La suite normal debe ejecutarlos, nunca saltarlos porque la herramienta sea draft; la portada pública mantiene su catálogo vigente.

### Criterios de salida y pruebas

| ID | Salida comprobable | Evidencia |
| --- | --- | --- |
| PB-I3-01 | Recorrido y validaciones completos en ES/EN, incluido volver y editar. | Componentes y E2E: límites, Otro, hora inválida, todos los días desmarcados y sugerencias; foco y errores asociados. |
| PB-I3-02 | Ejemplo, reset y cambio de idioma preservan el contrato. | Ejemplo sin editar/tras editar, cambio de mes y lengua, reset y retorno al catálogo; texto de aspecto HTML sigue siendo texto. |
| PB-I3-03 | Persistencia correcta y degradación en memoria explícita. | Reload online; esquema corrupto/incompatible; acceso denegado en lectura, escritura y borrado; ausencia de cambios en apariencia. |
| PB-I3-04 | Módulo draft probado sin interferir con el sitio. | Batería del módulo y `npm run verify`; aislamiento de servidores, recursos y archivos temporales. |

**Cobertura de ficha:** PB-AC-02/04; PB-AC-01 en build aislado y PB-AC-03/08 en UI. No acredita aún salidas móviles, acabado visual o publicación.

### Regresión local y entrega

Repetir dominio y calendario, y comparar cabecera, pie, selector y apariencia con la referencia. Revisar listeners duplicados al montar/restaurar, validación repetida en varias capas, importaciones de UI desde metadata y fugas de texto a URL, consola o recursos.

Recorrido real probado y recuperable, accesible con teclado, con UI todavía fuera del catálogo público. Registrar `docs/reports/pb01/execution.md` y entradas/estados que iteración 4 debe consumir sin reescribir. Marcar las tareas de esta iteración solo con los criterios anteriores comprobados y registrar el handoff en el informe único antes de avanzar.

## Iteración 4 — Imagen y exportaciones

**Entrada:** I3 completada y acceso HTTPS/dispositivos disponibles. No completar esta iteración sin la matriz física requerida.

**Resultado:** Conectar las salidas al recorrido y demostrar en iPhone y Android una vía real de calendario y guardado del PNG, antes de invertir en el acabado visual.

**Archivos previstos:** `src/miniapps/plan-b/browser/` para canvas, archivos, share/clipboard y apertura Google; componentes del resultado/consentimiento y `tests/` del módulo. Registro real y plataforma sin cambios.

### Trabajo

1. Confirmar antes de las pruebas físicas que ambos móviles abren la UI candidata por HTTPS y registrar su commit/árbol. Usar una vista previa existente y autorizada; si no existe, preparar la propuesta concreta de acceso. No publicar un prototipo incompleto en staging para eludir este requisito. Sin acceso o dispositivos, conservar pendientes las pruebas afectadas y no declarar la iteración Verificada.
2. Generar PNG 1179×2556 con fuentes locales listas, tokens del tema, zona segura, frase íntegra y ajuste de palabras/grafemas. Probar longitudes máximas, palabras sin espacios, tildes y emojis compuestos; no truncar ni reducir por debajo del mínimo para conseguir que pase.
3. Conectar descarga .ics, vista/descarga PNG y compartir archivos manteniendo activación de usuario. Detectar capacidades, gestionar cancelación, fallos de Blob/toBlob y liberar URLs/recursos. Una variante iOS se conserva solo si está comprobada.
4. Conectar confirmación Google, apertura desde el gesto, Cancelar sin envío y error de popup; compartir herramienta solo con enlace limpio, Clipboard y copia manual como alternativa. Las APIs se simulan en pruebas automáticas y no envían texto real a servicios.
5. Validar offline tras cargar UI/estilos/fuentes: pasos, ejemplo, resultado y generación .ics/PNG. No prometer recarga o cambio de idioma offline; abrir el menú nativo no equivale a que cualquier destino externo funcione sin conexión.
6. Ale comprueba en iPhone/Safari y Android/Chrome el botón real de descarga, importación, serie/hora/descripcion, guardado del PNG y colocación bajo el reloj; cancela y repite acciones. Registrar SO, navegador, app, zona y resultado. Si solo Google importa el evento en un móvil, mostrar su conexión obligatoria; si no hay ninguna vía válida, corregir o detener el alcance afectado.

### Criterios de salida y pruebas

| ID | Salida comprobable | Evidencia |
| --- | --- | --- |
| PB-I4-01 | PNG íntegro, legible y guardable en los dos teléfonos. | Casos máximos automáticos y fondo colocado físicamente bajo el reloj; cancelación y alternativa local sin éxito falso. |
| PB-I4-02 | Al menos una vía de incorporación al calendario en cada móvil, con texto y cuatro semanas correctos. | Resultado físico del botón real, no solo un .ics copiado desde otro equipo; identificar vías descartadas y su motivo. |
| PB-I4-03 | Consentimiento, enlace compartido y fallos respetan privacidad y estado. | Texto centinela en E2E con red/APIs interceptadas; Cancelar y clipboard/share no compatibles; ninguna petición de usuario sin gesto/aviso definidos. |
| PB-I4-04 | Ejemplo y generación de archivos funcionan offline tras carga completa. | Prueba automática desconectada y modo avión en ambos dispositivos; declarar límites de destinos externos. |
| PB-I4-05 | Los recorridos previos siguen funcionando sin acumulación de recursos. | Repetición de exportar/reset y volver, listeners/URLs revisados; `npm run verify` y casos de iteraciones 1–3 afectados. |

**Cobertura de ficha:** PB-AC-05/06/07/08/09 con integración física. Contraste y reflujo definitivos se vuelven a verificar en iteración 5/06.

### Regresión local y entrega

Volver a ejecutar ejemplo, recuperación, idioma y calendario desde la UI. Revisar permisos, URLs temporales, canvas reutilizado, handlers async que pierden el gesto y peticiones inesperadas. Una exportación fallida/cancelada conserva el plan; la repetición no puede crear listeners o URLs sin liberar.

Matriz real de compatibilidad y salidas funcionales; informe `docs/reports/pb01/execution.md` con datos sintéticos y sin planes personales. La iteración 5 no empieza sin esta evidencia física y los criterios de salida comprobados; una muestra importada fuera de la UI no cierra PB-I4-02. Marcar las tareas de esta iteración solo con los criterios anteriores comprobados y registrar el handoff en el informe único antes de avanzar.

## Iteración 5 — Identidad e integración

**Entrada:** I4 completada y compatibilidad acreditada. La incorporación pública del candidato requiere permiso expreso, que puede estar incluido en la autorización del plan.

**Resultado:** Terminar el acabado de Plan B alineado con MiMiniApp y preparar un candidato completo con rutas, catálogo y pruebas reales, listo para la revisión global final.

**Archivos previstos:** Estilos/componentes/i18n/tests de `src/miniapps/plan-b/`; `src/miniapps/registry.ts` para la incorporación acordada. Ajustes acotados de `tests/unit/miniapp-registry.test.ts`, `tests/e2e/catalogue.spec.ts` y pruebas de integración para cubrir el primer catálogo poblado. Revisar `tests/remote/platform.spec.ts` (ya deriva tarjetas del registro) y añadir escenarios en `tests/remote/plan-b.spec.ts` si hacen falta para el recorrido crítico remoto, reutilizando su identidad/target existentes. No editar layouts, rutas genéricas, estilos globales, dependencias, workflows o políticas de publicación.

### Trabajo

1. Implementar gris, recuperación de color y sello con la paleta/fuentes/tokens existentes. Revisar claro/oscuro/sistema, fondo exportado, reduced-motion, teclado, foco, dialogs, reflujo 320/393/768/1280/1440 y zoom 200 %. No tapar el plan ni usar color como única señal.
2. Completar textos visibles, accesibles, metadatos y errores ES/EN. Revisar capturas frente a la web existente y vídeo breve solo si es necesario para aprobar movimiento. Repetir en móviles las operaciones afectadas por los visuales y comprobar el recorrido en Chrome/Safari/Firefox de escritorio, con versiones identificadas, antes de la repetición global de iteración 6.
3. Actualizar las pruebas que hoy imponen catálogo vacío: `miniapp-registry.test.ts` exige registro [], y `catalogue.spec.ts` exige cero tarjetas/enlaces. Conservar sus aserciones de vacío en la copia aislada vacía y añadir el caso poblado real con navegación a Plan B. No borrar esas garantías, omitir tests o quitar controles de red para obtener verde.
4. Con aprobación expresa de incorporación pública del candidato por el propietario, registrar Plan B con loader, status published y fecha de primera publicación prevista. Ese cambio ocurre en la rama candidata; no significa que ya se haya desplegado ni que el plan completo esté aceptado. Si esa aprobación falta, conservar draft y el trabajo de integración como pendiente.
5. Construir el candidato real y probar rutas directas ES/EN, catálogo, metadatos, idioma equivalente, 404 y exclusión de fixtures. La suite remota ya deriva tarjetas del registro; extenderla solo si falta un escenario real. La comprobación de identidad remota y sus variables de confianza se mantienen.
6. Medir bytes propios y totales, solicitudes de portada/miniapp, tiempos locales comparables y recursos de exportación; corregir duplicaciones y cargas accidentales antes de congelar el candidato. Preparar el diff completo respecto a la base iteración 1 y un listado de diferencias intencionales para iteración 6.

### Criterios de salida y pruebas

| ID | Salida comprobable | Evidencia |
| --- | --- | --- |
| PB-I5-01 | Identidad alineada y criterios de accesibilidad/visual satisfechos. | axe y revisión manual de foco/contraste/zoom/temas y reduced-motion; capturas mínimas referenciadas y revisión del propietario. |
| PB-I5-02 | Catálogo vacío sigue cubierto en fixture y el catálogo real poblado funciona. | Pruebas de registro, navegador e integración; títulos/enlaces ES/EN y 404 real, sin exclusiones por estado. |
| PB-I5-03 | Candidato publicado en su rama con incorporación expresamente autorizada y sin despliegue implícito. | Descriptor/registro real validados; commit/árbol y fecha identificados; `npm run verify` completo. |
| PB-I5-04 | Presupuesto propio ≤50 KiB y total real informado; portada no carga JS de Plan B/React por mostrar la tarjeta. | Inventario del build y recursos solicitados; cualquier crecimiento de CSS generado por Tailwind se cuantifica y explica, no se oculta. |
| PB-I5-05 | No quedan placeholders, fallos funcionales conocidos ni pruebas previas obligatorias pendientes en el candidato. | Informe y lista de cambios intencionales; requisitos de iteraciones 1–5 con evidencia. Solo la revisión global, CI final y validación del staging definitivo quedan explícitamente para iteración 6 y no bloquean esta salida por circularidad. |

**Cobertura de ficha:** PB-AC-01/07/09/10/11 y preparación de PB-AC-12; el cumplimiento global y las pruebas de staging corresponden a iteración 6.

### Regresión local y entrega

Repetir los recorridos y exportaciones afectados por CSS/foco. Comparar la portada, 404, identidad, preferencias y movimiento con la base. Revisar scopes de CSS, importaciones, duplicación de utilidades y tests dependientes de catálogo vacío. Corregir fallos y repetir `verify` antes de entregar.

Candidato funcional identificado por commit/árbol, sin nuevas funciones pendientes, evidencia visual/manual y métricas para iteración 6 en `docs/reports/pb01/execution.md`. No fusionar ni publicar por iniciativa del agente. Marcar las tareas de esta iteración solo con los criterios anteriores comprobados y registrar el handoff en el informe único antes de avanzar.

## Iteración 6 — Regresión y análisis global

**Entrada:** I1–I5 completadas, sus criterios documentados y un candidato definitivo identificado. Es la última iteración interna de PB-01; ninguna implementación posterior conserva una revisión final anterior como suficiente.

**Resultado:** revisar el conjunto frente al sistema previo, corregir defectos del contrato aprobado y producir evidencia para aceptación humana. Se aplica la [regla de cierre obligatorio](../../PLANS.md#cierre-obligatorio-de-regresión-y-análisis). No se añaden funciones nuevas ni se concluye solo a partir del número de pruebas verdes.

### Bases de comparación y entradas obligatorias

1. **Base anterior al producto:** SHA/árbol, runtime/navegador, solicitudes, bytes, capturas mínimas, batería y deuda registrados en [iteración 1](#iteración-1--base-lógica-y-referencia). `07b95fd6b168b9b03150a48a9541ddbd3767748e` es la base conocida de planificación, no una sustitución de ese registro de ejecución.
2. **Candidato completo:** commit/árbol de iteración 5, descriptor y registro que realmente generan las rutas de Plan B; lista de cambios intencionales y evidencia de iteraciones 1–5.
3. **Staging vigente:** SHA remoto y diferencias respecto a la base/candidato. Si hubo trabajo paralelo, integrar de forma autorizada y volver a comprobar el candidato real, sin force push ni asumir que un CI de otra revisión lo cubre.
4. **Fuentes canónicas:** [ficha v07](../../product-specs/plan-b.md), [registro técnico](../../design-docs/index.md), [arquitectura actual](../../../ARCHITECTURE.md), [calidad](../../standards/QUALITY_SCORE.md), [frontend](../../standards/FRONTEND.md), [seguridad](../../standards/SECURITY.md) y [fiabilidad](../../standards/RELIABILITY.md).

Sin referencia reproducible, no declarar «sin regresiones». Recuperar datos anteriores desde el commit/base disponible cuando sea posible y distinguir mediciones reconstruidas de evidencia tomada antes del desarrollo.

### Alcance, archivos y decisiones

ADR-MMA-001/002/003/005/006/008/011/015/016/017/019 y las aprobaciones específicas de Plan B. Conserva publicación, credenciales y aislamiento de ADR-MMA-004/009/014, sin cambiar sus mecanismos.

Revisar todo el diff del programa, no solo el último commit: `src/miniapps/plan-b/`, registro, pruebas de plataforma/integración/remote y documentación afectada. Se permiten correcciones locales de defectos respecto al contrato aprobado y pruebas que cubran hallazgos reales. No se autorizan refactors transversales por preferencia, nuevas dependencias, APIs, estilos globales, cambios de arquitectura o workflows. Una solución que requiera alterar esos límites se propone antes de ejecutarse.

Informe final previsto: `docs/reports/pb01/execution.md`. No crearlo como evidencia satisfactoria hasta ejecutar las comprobaciones. Conservar solo capturas necesarias, con datos sintéticos y manifiesto cuando sean material de aprobación.

### Trabajo previsto

#### 1. Congelar e inspeccionar el candidato

Registrar SHA/árbol y estado de archivos; identificar cada diferencia intencional. Revisar arquitectura y contratos: metadata pura, UI perezosa, dominio sin DOM/textos, estilos propios, traducciones y rutas genéricas, tests sin omisiones. Buscar código muerto, duplicación, listeners/recursos sin liberar, mensajes provisionales y documentación que afirme una capacidad inexistente.

Reconciliar las secciones I1–I5 del informe único con código y criterios: una comprobación previa no excusa un fallo detectado ahora. Leer el registro de deuda de base, clasificar asuntos previos, introducidos y recién descubiertos; no borrar o cerrar pendientes ajenos sin evidencia y autorización.

#### 2. Regresión funcional y de plataforma

Ejecutar `npm run verify` completo sobre el candidato, con Node/npm compatibles y Chromium fijado; mantener tipos, lint, formato, hosting, unitarias, componentes, E2E e integración. Repetir los casos de límite y error de Plan B con datos sintéticos.

Comparar portada ES/EN, catálogo vacío en fixture y poblado real, tarjetas/rutas estables, selector de idioma equivalente, 404, cabecera/pie, fuentes, claro/oscuro/sistema, apariencia persistida, logo/hero y control de movimiento. Revisar también el entorno aislado y la exclusión de fixtures/borradores del build entregable. La portada no debe hidratar la UI de Plan B por mostrar su tarjeta.

#### 3. Privacidad, accesibilidad y compatibilidad

Repetir consentimiento Google, Cancelar, URL limpia al compartir herramienta, archivo PNG con su aviso y red interceptada con texto centinela. Inspeccionar recursos, consola, storage, query y fragmentos: ningún texto personal sale por un camino no autorizado. Verificar inyección/escapes .ics, renderizado de texto, fallos y borrado de sesión; no transmitir planes reales a servicios para demostrarlo.

Comprobar teclado/foco, etiquetas/errores/dialogs, contraste también en gris, temas, reduced-motion propio, reflujo a 320 px y zoom 200 %. axe es una ayuda y no una certificación. Volver a probar en Safari iPhone y Chrome Android las descargas, importación de calendario, guardado/colocación del fondo y modo avión tras carga completa, con versiones/zona y candidato identificados. Chrome/Safari/Firefox de escritorio completan la matriz. Los mocks o Chromium emulado no sustituyen esas operaciones físicas.

#### 4. Rendimiento, recursos y deuda

Medir base y candidato con el mismo entorno, navegador, viewport, condiciones y rutas. Separar caché fría/caliente; realizar cinco pasadas por perfil, informar mediana/rango y distinguir ruido de una degradación reproducible. Si falta una herramienta, usar capacidades existentes del navegador/Playwright o proponerla; no instalar un servicio o dependencia sin decisión.

* Inventariar JS/CSS propio de Plan B sin comprimir: límite de la ficha ≤50 KiB. Informar también JS/CSS total solicitado, incluyendo React/DOM/Astro y CSS compartido, sin esconder el runtime bajo el presupuesto propio.
* Comparar solicitudes y bytes de portada/404 con la referencia; cuantificar y justificar el cambio de catálogo y cualquier CSS adicional generado por Tailwind. Comprobar que la portada no carga los chunks de interacción de Plan B ni recursos de terceros.
* Medir carga, respuesta a interacciones y cambios de layout. Mantener como referencias LCP ≤2,5 s, INP ≤200 ms y CLS ≤0,1, distinguiendo mediciones locales de objetivos de campo. Cinco pasadas de laboratorio no demuestran percentil 75 real ni una medición aislada demuestra ausencia de regresión.
* Revisar coste del canvas, generación de archivos y liberación de recursos durante diez ciclos de exportación/reset/navegación interna. Registrar URLs Blob/listeners/canvas retenidos y, si está disponible, memoria, sin presentar fluctuaciones del recolector como fugas demostradas. Corregir retenciones reproducibles o bloqueos de interacción materiales.
* Comparar dependencias/lockfile, avisos de seguridad y deuda de base con los finales. Un aviso recién publicado con lockfile idéntico se distingue de una dependencia vulnerable nueva; ambos se evalúan por impacto, sin `audit fix --force` o cambios de versión automáticos.

Toda degradación material reproducible requiere corrección o una decisión explícita de alcance antes de cerrar; describirla en una tabla no la resuelve.

#### 5. Hallazgos y correcciones acotadas

| Campo de cada hallazgo | Contenido requerido |
| --- | --- |
| Identificación | ID, área, criterio de ficha y revisión examinada. |
| Evidencia | Caso reproducible, resultado esperado/real y referencia a prueba o medición. |
| Impacto y origen | Material/no esencial con justificación; previo, introducido o recién descubierto. |
| Acción | Corrección concreta o propuesta necesaria; responsable, prioridad y condición de cierre. |
| Verificación | Revisión corregida, comandos/casos repetidos y resultado. |
| Residuo | Limitación o deuda restante y aceptación humana si es admisible. |

Pérdida/corrupción de datos, envío no consentido, resultado de calendario incorrecto, fallo de una función esencial, regresión de plataforma, accesibilidad material o degradación relevante sin resolver bloquean el cierre. No se ocultan como deuda ni se cambian aserciones para obtener verde.

Corregir defectos locales cubiertos por requisitos/decisiones y volver a ejecutar las pruebas afectadas. Si falta una función del alcance ya aprobado, implementarla como corrección solo si sigue siendo una unidad corta; si requiere una iteración adicional, situarla antes del cierre global, revisar autorización y repetir iteración 6. Conservar la evidencia de las iteraciones anteriores y registrar los nuevos hallazgos/correcciones con sus fechas y revisiones.

#### 6. Última etapa — revalidación del conjunto y conclusión

Después de toda corrección, identificar el nuevo candidato y ejecutar de nuevo la batería completa pertinente. Si no cambió código/tests desde la pasada completa y no quedan dudas abiertas, citar esa pasada sin repetirla por trámite. Un cambio de runtime, prueba o descriptor después de la revisión requiere revalidar lo afectado; si es material, repetir el conjunto. No construir una conclusión mezclando evidencia de candidatos distintos.

Con permiso operativo para commits/push/PR, comprobar CI del head final contra staging. El propietario decide el merge; Actions publica el mismo artefacto probado y verifica identidad y aplicación. Confirmar source SHA/árbol y payload desde el run/manifiesto, con `prepare` y `remote-test` satisfactorios. Sin autorización de publicación o sin ejecución remota, registrar explícitamente lo local verificado, manteniendo pendiente PB-AC-12 y el cierre global.

Comprobar las rutas/operaciones afectadas en la versión efectivamente servida; no atribuir a staging la evidencia de un preview distinto. Las pruebas remotas usan las variables de identidad y target del flujo existente, sin desactivar sus guards ni escoger una URL arbitraria. Los registros documentales posteriores de evidencia no cambian el runtime auditado; una corrección funcional posterior vuelve a abrir las verificaciones correspondientes de iteración 6.

Entregar matriz PB-AC-01–12 con pasado/fallido/omitido/no ejecutado, mapa de cambios frente a la base, mediciones comparadas, hallazgos y sus cierres, y riesgos/deuda residual. Concluir si el resultado puede aceptarse y por qué, sin atribuir al agente la aceptación del propietario.

### Criterios de salida de I6

| ID | Condición de cierre |
| --- | --- |
| PB-I6-01 | Se han contrastado los doce PB-AC con el candidato definitivo; cada uno tiene evidencia real y ninguna comprobación esencial falta. |
| PB-I6-02 | Base y candidato son reproducibles; portada, catálogo, rutas, idiomas, temas, identidad y restantes contratos de plataforma conservan su comportamiento esperado. |
| PB-I6-03 | No quedan defectos materiales, transmisiones no consentidas, fallos de accesibilidad esenciales o degradaciones reproducibles sin resolver. Las correcciones tienen pruebas repetidas. |
| PB-I6-04 | Presupuesto propio y costes totales medidos; recursos y dependencias revisados; deuda previa/nueva diferenciada y residuo no esencial justificado para aceptación humana. |
| PB-I6-05 | `npm run verify`, CI del candidato y publicación/pruebas remotas autorizadas satisfactorios; mismo contenido funcional y versión servida identificados. Una comprobación local no sustituye CI o dispositivos. |
| PB-I6-06 | Informe final coherente con código, decisiones y pruebas; fuentes vivas actualizadas solo por realidad implementada. No hay nuevas funciones después de la revisión sin revalidación. |

## Criterios de cierre del plan

El resultado completo cumple los doce PB-AC de la ficha, los 28 criterios PB-I1–PB-I6 y las condiciones de revisión humana identificadas. La matriz de trazabilidad del paquete de revisión enlaza cada requisito con las iteraciones que aportan evidencia; I6 confirma todo sobre el candidato definitivo. Una tarea interna completada no equivale a aceptación del plan.

## Tratamiento de bloqueos, cierre y recuperación

Las seis iteraciones reutilizan la rama de Control y sus commits identifican PB-01/Ix. Las entregas parciales no crean otra rama ni otro ExecPlan; los commits publicados de I1/I2 se conservan.

Un fallo de salida mantiene la iteración actual abierta y el plan `En curso`; continuar solo con trabajo independiente ya autorizado. Registrar hallazgo, origen previo/nuevo, impacto, corrección y comprobación repetida. No usar el registro de deuda para aceptar un incumplimiento. Un cambio de alcance/decisión se resuelve en su fuente antes de seguir; una deuda residual no esencial necesita justificación y aceptación expresa del propietario.

Pasar PB-01 a `Verificado` únicamente cuando I1–I6 y PB-AC-01–12 estén comprobados sobre el candidato definitivo, incluida la evidencia remota autorizada. Si solo existe validación local, describirla como tal y conservar el cierre global pendiente. La aceptación final del plan/producto es humana, no se deduce de un merge. Al aceptarlo o cancelarlo, archivar este único plan y actualizar sus enlaces entrantes.

La IA puede corregir defectos locales cubiertos y repetir las pruebas pertinentes. No force push, reset/clean que pierda trabajo ni cambios de permisos/publicador para conseguir evidencia. Los commits/push/PR necesitan el permiso operativo correspondiente; el merge es humano y un eventual revert se prepara por PR. Producción, promoción y rollback bloqueados conservan sus límites.

## Progreso y reanudación

**Situación actual:** I1–I5 integradas en staging; I6 autorizada y revisión técnica global realizada. PB-01 sigue `En curso`: pruebas físicas, revisión humana y validación remota de las correcciones pendientes. Staging I5 `3d28184f3c90db44fe57a7592e23a5e71c071f23` acreditado por identidad y Actions 44060190659 satisfactorio. I6 corrige dos defectos del recorrido: hora nativa incompleta y mes de portada tras reset. Verificación local final: 504 unitarias, 19 componentes, 146 E2E e integración; 160 pruebas en cada zona adicional. Presupuesto propio 42903 B; comparación fría/caliente con base I1, diez ciclos de recursos y auditoría sin nuevas dependencias. [Informe I6](../../reports/pb01/execution.md#i6--regresión-y-análisis-global). No se declara Verificado/Aceptado.

| Iteración interna | Tareas y salida comprobadas | Inicio | Fin | Evidencia / siguiente paso |
| --- | --- | --- | --- | --- |
| I1 — base | [x] | 2026-11-16 | 2026-11-16 | PB-I1-01–04 comprobados localmente; informe y entrega por PR. I2 pendiente de autorización y ADR-MMA-021. |
| I2 — calendario | [x] | 2026-11-16 | 2026-11-16 | PB-I2-01–04 comprobados; commit 62add4d y PR #20 integrada en e4c956e. Muestras e informe. I3 pendiente de autorización y ADR-MMA-020. |
| I3 — recorrido y estado | [x] | 2026-11-16 | 2026-11-16 | PB-I3-01–04 comprobados localmente; ADR-MMA-020 aprobada, informe y entrega integrada por PR #22 en la rama estable. |
| I4 — imagen y exportaciones | [ ] | 2026-11-17 | — | Desarrollo local comprobado e integrado; HTTPS staging de I5 disponible e identificado en I6. Matriz física iPhone/Safari + Android/Chrome pendiente para cierre. |
| I5 — identidad e integración | [ ] | 2026-11-17 | — | Registro autorizado e integrado por PR #24; candidato/capturas/presupuesto y recorrido remoto de I5 comprobados. Revisión humana, navegadores/dispositivos y cierre físico de I4 pendientes. |
| I6 — regresión y análisis global | [ ] | 2026-11-17 | — | Evidencia histórica PB-01/I6 y correcciones integradas por PR #25. Handoff FE-01/I7 sobre 2d213dd: 518/25/156 e integración locales satisfactorias, métricas/recursos y doce PB-AC trazados. Acabado del piloto aprobado en FE-01/I6; matriz física/importaciones, CI/staging del nuevo candidato y aceptación del producto pendientes. |

La tabla refleja tareas/evidencia, no seis estados canónicos ni seis aceptaciones independientes. Durante la ejecución, anotar fechas reales, revisión, comprobaciones fallidas/no ejecutadas y condición concreta para avanzar. Solo el control de PB-01 declara el estado global.

## Revisión para aprobación — 2026-11-16 (previa al inicio de I1)

Se aplica la condición `Borrador` → `Aprobado` de PLANS.md. Es aprobación del plan y sus condiciones, no aceptación de un producto todavía inexistente. La instrucción del propietario autoriza registrar esta transición una vez contrastada la preparación.

| Aspecto revisado | Resultado |
| --- | --- |
| Responsable, objetivo y alcance | Identificados; resultado de producto único, límites de código/plataforma y exclusiones expresos. |
| Trabajo y orden | Seis iteraciones internas secuenciales, 30 tareas de I1–I5 y análisis detallado I6; entradas, salidas, archivos y puntos de revisión definidos. |
| Criterios y verificación | 28 criterios internos trazados a los doce PB-AC de la ficha; comandos existentes separados de helpers futuros; CI, dispositivos y staging distinguidos de prueba local. |
| Regresión, recursos y deuda | Referencia reproducible en I1, cierre global I6, comparaciones de rendimiento/privacidad/accesibilidad, hallazgos y revalidación tras correcciones. |
| Bloqueos | Selección/ficha, ADR-MMA-020/021 y ejecución aún pendientes; HTTPS/dispositivos, incorporación al catálogo y permisos de entrega identificados por iteración. No se presumen resueltos. |
| Coherencia documental | Un solo plan de Plan B en active, enlaces/anchors válidos y contrato funcional/textos conservados. Código y configuración iguales al staging `07b95fd`. |

La regla canónica permite aprobar un plan con bloqueos declarados, manteniendo impedido el inicio afectado. Por tanto PB-01 pasa a `Aprobado`, sin avanzar a `Autorizado`, `Verificado` o `Aceptado`. Ninguna casilla de implementación se marca completada.

## Procedencia e historial de estado

El plan global se creó el 2026-11-15. El 2026-11-16 se prepararon localmente seis borradores separados, todavía sin ejecutar ni subir; por preferencia expresa del propietario se consolidan aquí, conservando tareas, criterios y análisis útiles. Los cinco borradores adicionales se retiran de `active/`, sin fingir aceptaciones o cancelaciones. La forma de un único plan con iteraciones internas se registra en H-006 y no aprueba su contenido ni autoriza desarrollo.

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-15 | `Borrador` | Codex | Preparación del plan global de Plan B; sin autorización de implementación. |
| 2026-11-16 | `Borrador` | Codex | Preparación local de una descomposición en seis archivos, sin ejecución. |
| 2026-11-16 | `Borrador` | Codex, por instrucción del propietario | «Si, prefiero un unico plan con 6 iteraciones y que esté bien definido»: consolidación en PB-01, seis iteraciones secuenciales y una única aceptación final. |
| 2026-11-16 | `Aprobado` | Propietario de MiMiniApp, tras revisión de Codex | Instrucción de aprobar los planes que superen la revisión. Responsable, alcance, seis iteraciones, criterios y verificaciones definidos; bloqueos explícitos. Solo aprobación de planificación, sin autorización de ejecución o aceptación funcional. |
| 2026-11-16 | `Autorizado` → `En curso` | Propietario / Codex | Solicitud de comenzar I1 tras repaso documental; se registra selección/ficha aprobadas y se prepara base reproducible desde staging d3d8386. Alcance local de I1, sin ejecución de siguientes iteraciones. |
| 2026-11-16 | `En curso` | Codex | I1 completada: 412 unitarias, 9 componentes, 88 E2E e integración satisfactorios; 19 archivos públicos idénticos a la referencia. Informe y límites registrados. El estado global no avanza a Verificado: I2–I6 pendientes y fuera de la autorización actual. |
| 2026-11-16 | `En curso` | Propietario / Codex | PR #19 fusionada y autorización expresa de avanzar a I2; ADR-MMA-021 aprobada en el registro. Modelo y formatos de calendario, sin I3 ni operaciones de navegador. |
| 2026-11-16 | `En curso` | Codex | I2 completada: 464 unitarias, 9 componentes, 88 E2E e integración; 121 unitarias en dos zonas adicionales y build público idéntico. No avanza a Verificado global ni se inicia I3. |
| 2026-11-16 | `En curso` | Propietario / Codex | H-007 aprobada: una rama estable por ExecPlan y commits identificados por iteración. PB-01 adopta feature/pb01-plan-b desde staging e4c956e; PR #20 ya integrada y ramas I1/I2 retiradas tras verificar ascendencia y PR cerradas. Historial conservado; I3 no autorizada por este ajuste. |
| 2026-11-16 | `En curso` | Propietario / Codex | Autoriza I3 tras integrar I1/I2; ADR-MMA-020 aprobada. Rama estable sincronizada desde 4203db5; sin I4 ni registro público. |
| 2026-11-16 | `En curso` | Codex | I3 completada localmente: recorrido ES/EN, sesión/reset y fallos explícitos. 493 unitarias, 14 componentes, 104 E2E e integración; refuerzo final a 15 componentes con estáticos repetidos. Build sin UI pública y +127 bytes de tokens CSS explicados. Entrega en la rama estable, merge humano; I4–I6 y aceptación global pendientes. |
| 2026-11-17 | `En curso` | Propietario / Codex | Confirma merge de PR #22 y autoriza continuar con I4. Rama estable actualizada desde 8a22fb3; se desarrolla la parte local, sin rebajar los requisitos físicos/HTTPS ni activar infraestructura. |
| 2026-11-17 | `En curso` | Codex | Parte local de I4 implementada y comprobada: 502 unitarias, 19 componentes, 120 E2E e integración final; build público idéntico a I3 y diez ciclos sin URLs pendientes. Matriz física/HTTPS no ejecutada: I4 sin completar, I5/I6 sin iniciar. Entrega parcial por la misma rama y PR en borrador. |
| 2026-11-17 | `En curso` | Propietario / Codex | Tras merge de PR #23 solicita comenzar la siguiente iteración. Se adelanta la preparación visual/local de I5 conforme a esa indicación, sin declarar I4 completa ni rebajar sus criterios físicos; registro público pendiente de autorización expresa. |
| 2026-11-17 | `En curso` | Codex | Preparación local de I5 comprobada: gris/color/sello, contraste/reflujo, catálogo poblado aislado y 502 unitarias, 19 componentes, 136 E2E e integración. Capturas y presupuesto 42790 B propios de copia. Sin completar I4/I5, registrar públicamente o iniciar I6; entrega parcial y autorización de incorporación pendientes. |
| 2026-11-17 | `En curso` | Propietario / Codex | Responde «Autorizar el registro en la rama candidata» a la propuesta de PR #24: permiso expreso de I5/tarea 4 para registrar Plan B y validar catálogo/rutas reales. Mantiene merge manual y pruebas físicas de I4 pendientes; no acepta I4/I5 ni autoriza I6. |
| 2026-11-17 | `En curso` | Codex | Registro real autorizado aplicado y verificado: 503 unitarias, 19 componentes, 140 E2E e integración, zoom nativo 200 %, presupuesto propio 42790 B y total real medido. Casos vacío/draft e identidad preservados en copias; recorrido remoto con guard de identidad preparado, no ejecutado antes de despliegue. I4/I5 conservan pendientes físicos/manuales e I6 sin iniciar. |

| 2026-11-17 | `En curso` | Propietario / Codex | Tras integrar PR #24 indica «listo la ultima iteración, continua»: autoriza revisión I6 y correcciones locales del contrato en la misma rama, commit/push/PR. No acredita pruebas físicas ni aceptación humana. |
| 2026-11-17 | `En curso` | Codex | Revisión global I6 y correcciones de hora incompleta/mes tras reset; verify final 504 unitarias, 19 componentes, 146 E2E e integración. Comparación con base I1, cachés, recursos, calendario en dos zonas y auditoría documentados. Staging I5 identificado/validado; correcciones todavía necesitan integración y nueva validación remota. I4/I5/I6 permanecen abiertas por evidencia esencial ausente. |
| 2026-11-18 | `En curso` | Codex | Handoff FE-01/I7 registrado sobre ficha v07/ADR-MMA-023 aprobadas: piloto I6 aprobado, candidato 2d213dd con regresión local y comparación final satisfactorias. Correcciones PB-01/I6 históricas integradas por PR #25. Evidencia remota del nuevo frontend bloqueada por revisión de dependencias; operaciones físicas y aceptación de PB-01 conservadas como pendientes. |
