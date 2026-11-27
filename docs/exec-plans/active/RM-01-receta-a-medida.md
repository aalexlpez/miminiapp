# RM-01 · Receta a medida

## Control

* **Estado.** `En curso`.
* **Rama de trabajo estable.** `feature/rm01-receta-a-medida`, creada desde `staging` en `fa6a0ad7fb112865e8a4a12118656386998a3820`.
* **Iteración actual.** I1, maqueta y base de comparación.
* **Responsable de aprobación, autorización y aceptación.** Propietario de MiMiniApp.
* **Creado y actualizado.** 2026-11-27.
* **Autorización vigente.** El propietario aprueba la [ficha v03](../../product-specs/receta-a-medida.md) y RM-01 y autoriza I1 el 2026-11-27. Las decisiones de sesión e incorporación al catálogo corresponden a I4.

## Objetivo y alcance

Entregar una miniapp ES/EN que permite pegar una lista de ingredientes, ajustarla en la misma pantalla por raciones o por una cantidad disponible y copiar el resultado. La persona ve el origen de cada cantidad, las aproximaciones y las líneas que requieren revisión. El ejemplo del bizcocho permite pasar de tres huevos a dos y comprobar el factor `2/3` en la lista.

El contrato y las exclusiones de la primera versión son los de la [ficha](../../product-specs/receta-a-medida.md#investigación-y-decisiones-de-alcance). El código previsto se concentra en `src/miniapps/receta-a-medida/`, con el alta en el registro y las pruebas de plataforma pertinentes.

## Decisiones aplicables y cuestiones pendientes

* **Base aprobada.** ADR-MMA-001/002/003/005/006/008/011/015/016 fijan el stack, procesamiento local, aislamiento, herramientas, catálogo e idiomas. ADR-MMA-017/019/022/023 aportan identidad, temas, estándar frontend y la opción de marco `focused`. El circuito de entrega se rige por las enmiendas vigentes de ADR-MMA-004/009/014. [Registro técnico](../../design-docs/index.md), [guía de miniapps](../../guides/miniapps.md).
* **Dirección de la pantalla.** I1 recoge la decisión del propietario sobre la maqueta y la presentación del marco. Si cambia un requisito material, actualizar primero la ficha y el alcance que se someterá a aprobación.
* **Sesión e incorporación.** Aprobar ADR-MMA-026 antes de implementar la sesión. Confirmar el permiso para incorporar la herramienta al catálogo de la rama candidata antes de cambiar el registro real. La base efectiva incorpora el contrato opcional de icono de ADR-MMA-025 y el manifiesto de recursos de publicación selectiva.

## Cadencia por iteración

El nombre de los avisos sigue **`feat - rm01-receta-a-medida I1`**, con el número de cada iteración. El título Git usa `tipo(RM-01/Ix): descripción en inglés` según [H-007](../../harness-decisions.md#h-007--una-rama-por-execplan-y-commits-por-iteración). La misma rama reúne todas las iteraciones.

1. Completar el trabajo de la iteración, ejecutar sus verificaciones y anotar el resultado. Si falla una condición de salida, corregirla y volver a comprobar. Comunicar los bloqueos que requieran una decisión.
2. Avisar al propietario con el nombre de la iteración, lo entregado y el resultado de las comprobaciones.
3. Hacer el commit local de la iteración y registrar su SHA en la tabla de progreso. Si la verificación de CI necesita el commit, comunicar primero el resultado local y registrar la evidencia de CI cuando se obtenga.
4. Continuar con la iteración siguiente cuando se cumplan las condiciones de salida y su entrada esté cubierta por la autorización vigente. Las revisiones humanas son las previstas en este plan y en el circuito de entrega.

| Nombre en el aviso | Ejemplo de título Git |
| --- | --- |
| `feat - rm01-receta-a-medida I1` | `feat(RM-01/I1): prototype the recipe resizer flow` |
| `feat - rm01-receta-a-medida I2` | `feat(RM-01/I2): parse and scale ingredient amounts` |
| `feat - rm01-receta-a-medida I3` | `feat(RM-01/I3): build the live recipe editor` |
| `feat - rm01-receta-a-medida I4` | `feat(RM-01/I4): integrate recipe copy, session and catalogue` |
| `feat - rm01-receta-a-medida I5` | `test(RM-01/I5): verify recipe resizer and platform regressions` |

## Trabajo previsto

### I1 · Maqueta y base de comparación

* **Entrada.** Ficha y plan aprobados, ejecución autorizada. Comprobar el `staging` vigente y crear la rama estable desde esa revisión. La copia `c918c4c` sirve de referencia para redactar el plan. Registrar el SHA y el árbol de la base efectiva, las versiones, `npm run verify` y la carga inicial del catálogo y de Plan B.
* **Trabajo.** Preparar una maqueta navegable aislada con los textos y ejemplos de la ficha. Mostrar el recorrido de pegar, encontrar «Tengo…», volver a raciones y localizar la copia y los avisos. Revisar móvil y escritorio, teclado abierto y apariencia clara y oscura. Comprobar si el marco `focused` deja más espacio útil para la lista.
* **Salida.** El propietario revisa y valida la dirección de pantalla y el gesto con el ejemplo de los dos huevos. Quedan registradas la base de regresión, las capturas útiles, la decisión visual y las comprobaciones de la maqueta. Cubre la revisión de diseño de RM-05.

### I2 · Lectura y cálculo de ingredientes

* **Entrada.** I1 completada. Aplicar el contrato funcional de la ficha aprobada.
* **Trabajo.** Implementar en `domain/` la lectura de una línea por ingrediente, los rangos, las fracciones y la detección de ambigüedad. Calcular el factor por raciones o ingrediente de referencia desde las cantidades originales. Preparar el formato que conserva medidas, fracciones y valores positivos pequeños, con el valor exacto disponible.
* **Salida.** Las pruebas unitarias de tabla reproducen las demos ES/EN y verifican, entre otros, `1,500 g`, `2 latas de 400 g`, los pasos de preparación, 4 → 11, 12 → 1 y 3 → 2 huevos sin raciones originales. Los resultados se contrastan con expectativas calculadas aparte. Cubre el dominio de RM-01 a RM-03.

### I3 · Interfaz en vivo ES/EN

* **Entrada.** I2 completada y dirección de pantalla validada.
* **Trabajo.** Integrar el dominio con el punto de entrada Astro y la interfaz React. Implementar pegado y edición, raciones, previsualización con «Tengo…», confirmación, cancelación, cambio de referencia, líneas «Revisar», ejemplo, reinicio y «Deshacer» en memoria. Completar las traducciones y los estados de foco, error y movimiento reducido. Validar el recorrido sobre un build aislado.
* **Salida.** Las pruebas de componentes y navegador en ES/EN cubren pegar sin perder el foco, el ajuste con datos inválidos, la recuperación del valor confirmado y el recorrido con teclado. Comprobar la lista y los controles a 320/393/1440 px y con zoom al 200 %. Cubre RM-02/04/05 en la interfaz. La sesión y el portapapeles se comprueban en I4.

### I4 · Copia, sesión y catálogo

* **Entrada.** I3 completada. ADR-MMA-026 aprobada para implementar sesión. Permiso de incorporación al catálogo para el alta en el registro real. La copia y las pruebas aisladas pueden avanzar dentro de la autorización vigente.
* **Trabajo.** Implementar la copia con cabecera y marcas **≈**, el texto seleccionable ante fallo y el bloqueo durante un borrador. Implementar restauración y borrado con la clave de sesión y los fallos previstos en la ficha. En la rama candidata, incorporar el descriptor y comprobar rutas directas, selector de idioma, metadatos y carga del módulo. Usar fixtures aisladas mientras se prepara el alta.
* **Salida.** El resultado copiado conserva orden, unidades y avisos. El estado confirmado se restaura tras recarga o cambio ES/EN y responde a datos corruptos, fallos de almacenamiento y borrado. El catálogo y ambas rutas funcionan en el build de la candidata. `npm run verify` pasa sobre el candidato local. Cubre las salidas de RM-01/03/04 y prepara RM-06/08.

### I5 · Regresión y análisis final

* **Entrada.** I1–I4 completadas, base identificada en I1 y candidato identificado por SHA.
* **Trabajo.** Contrastar el candidato con todos los criterios de la ficha y revisar el recorrido de Plan B, catálogo, 404 y carga aislada. Revisar el diff completo para detectar problemas de mantenimiento o deuda introducida. Comprobar red, sesión, teclado, lector de pantalla, movimiento reducido, rendimiento con 60 líneas y tamaño propio y total servido. Completar la matriz física de Safari en iPhone y Chrome en Android, incluido modo avión tras cargar. Ejecutar `npm run verify` y contrastar el SHA de CI y la versión servida en staging por el circuito autorizado.
* **Salida.** Los ocho criterios de ficha quedan trazados a evidencia del candidato vigente. Registrar hallazgos, impacto, corrección y nueva comprobación sobre el candidato final. Registrar los bloqueos que impidan concluir, incluidos CI, acceso a una candidata HTTPS o una comprobación física esencial. Las correcciones posteriores al primer commit de verificación se identifican también como RM-01/I5 y se vuelven a verificar. Con la evidencia completa, pasar a `Verificado` y entregar para la aceptación del propietario.

## Entorno, verificaciones y evidencia

* Verificar la disponibilidad del Node/npm fijado y del Chromium de Playwright de la base efectiva. Usar las herramientas ya declaradas en `package.json` y datos sintéticos para las pruebas y el material visual.
* Usar `npm run test:unit`, `npm run test:components` y `npm run test:e2e` según la iteración. Cubrir aislamiento con `npm run test:integration` y ejecutar `npm run verify` en las entregas de producto. La verificación remota usa `npm run test:remote` en el flujo existente con la identidad de la candidata.
* Registrar en Progreso la revisión evaluada, comandos, resultados y límites. En I5, distinguir evidencia del build local, CI, staging y dispositivos físicos. Comparar rendimiento con la base de I1 y con los objetivos de RM-07. [Política de evidencias](../../standards/QUALITY_SCORE.md#política-de-evidencias).
* Si un fallo aparece en staging, asociarlo a la revisión servida, conservar las trazas y corregirlo en la rama del plan. El propietario decide la integración y cualquier retirada de una versión conforme al [flujo vigente](../../../CONTRIBUTING.md#flujo-de-un-cambio).

## Punto de parada

Tras I5 se entrega la revisión con los resultados de [RM-01 a RM-08 de la ficha](../../product-specs/receta-a-medida.md#aceptación-y-evidencia) y la identificación del candidato. El propietario acepta el resultado verificado y el plan se archiva conforme a [PLANS.md](../../PLANS.md#finalización).

## Progreso

| Iteración | Inicio | Fin | Evidencia y commit | Siguiente condición |
| --- | --- | --- | --- | --- |
| I1 · Maqueta | 2026-11-27 | — | `npm run verify` pasa en la base `fa6a0ad`. Maqueta y recorrido comprobados en Chromium. [Capturas y evidencia](../../review/rm01-i1/README.md). | Revisión del propietario de la pantalla y el marco compacto. Commit tras el cierre. |
| I2 · Dominio | — | — | Pendiente | Cierre de I1 |
| I3 · Interfaz | — | — | Pendiente | Cierre de I2 |
| I4 · Copia, sesión y catálogo | — | — | Pendiente | Cierre de I3, ADR y permiso de alta en lo que corresponda |
| I5 · Regresión | — | — | Pendiente | Cierre de I4 y candidato identificado |

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-27 | `Borrador` | Propietario / Codex | El propietario pide un ExecPlan propio, iteraciones secuenciales y aviso y commit en cada cierre. Codex prepara RM-01 para revisión. |
| 2026-11-27 | `Aprobado` → `Autorizado` | Propietario | «Vale, perfecto. Vamos con la primera iteración». Aprueba ficha y plan, y autoriza I1. |
| 2026-11-27 | `En curso` | Codex | Recupera el staging vigente, crea la rama estable y prepara la base reproducible de I1. |
