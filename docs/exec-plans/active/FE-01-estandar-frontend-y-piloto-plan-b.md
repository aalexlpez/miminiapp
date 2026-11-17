# FE-01 — Estándar frontend, skills y piloto de Plan B

## Control

* **Estado:** `En curso`.
* **Responsable de aprobación, autorización, aceptación y cancelación:** propietario de MiMiniApp (Alexander / Ale).
* **Creado / actualizado:** 2026-11-17.
* **Rama de trabajo estable:** `feature/fe01-frontend-quality`, creada desde staging 1b204633ddd0ad782096d5377a3ee1c35d05c796 el 2026-11-17. Única para todo FE-01; no comparte la rama de ejecución de PB-01.
* **Commits:** `tipo(FE-01/Ix): descripción en inglés`; PR con plan/iteraciones identificados, destino staging y merge manual del propietario.
* **Organización:** un archivo, siete iteraciones secuenciales I1 → I2 → I3 → I4 → I5 → I6 → I7. I7 es siempre la última regresión y análisis del conjunto.
* **Iteración actual:** I1–I3 completadas. Dirección/contrato ADR-MMA-023 y ficha v07 aprobados por el propietario; I4 autorizada y en ejecución local. I5–I7 sin iniciar.
* **Autorización inicial (I1):** el propietario indica «vale, crea una nueva rama y empecemos con la iteración 1» el 2026-11-17, tras revisar el plan y aclarar su alcance transversal/piloto y la ubicación de las skills. Se registra aprobación del plan y autorización de I1: reconciliación, rama, referencia reproducible y propuesta concreta del estándar/selección/permisos, con entrega por commits/push/PR según el marco. Posteriormente el propietario acepta ADR-MMA-022 con el ajuste de que su aprobación basta como aceptación humana y las pruebas con otras personas son opcionales, y acepta H-008. Se registra ese ajuste del criterio de aceptación y se cierra I1; en ese momento la autorización de ejecución quedó limitada a I1, sin iniciar I2 o el rediseño I3–I7. La instrucción posterior se recoge a continuación.
* **Autorización y entrega actuales:** el propietario solicita «Vamos a empezar con las iteraciones pero sin subir nada hasta que esté todo el plan ejecutado. Vamos con la iteración 1». Se comprueba que I1 ya está completada e integrada y se comunica que se continúa por I2, primera pendiente, sin repetir I1. Se autoriza el avance local dentro del alcance aprobado; se conservan las revisiones humanas de dirección/contrato I3 y acabado I6. Misma rama y commits locales identificados por iteración. **Sin push, PR nueva ni otras escrituras remotas hasta terminar la implementación y regresión local de todo FE-01.** Después se entrega el candidato conjunto para CI, merge manual y comprobación en staging; I7 no se declara Verificada globalmente ni el plan Aceptado sin esas evidencias y aceptación humana. Esta instrucción sustituye la entrega remota por iteración para FE-01; no cambia workflows ni reglas generales del harness.
* **Resolución de I2 e inicio de I3:** tras explicar la diferencia entre instalación/uso manual y descubrimiento nativo, se propone cerrar I2 con el uso explícito probado. El propietario pide concretar las dos skills y, después de identificarlas, indica «vale, usalas para continuar con la iteraicón 3». Se registra aceptación de ese alcance alternativo, cierre de I2 y autorización de preparar I3. FE-I2-01 y FE-AC-02 se ajustan al perfil manual: instrucciones cargadas expresamente y aplicadas a trabajo real; descubrimiento automático fuera del criterio, limitación conservada sin afirmarlo probado. No implica aprobación del futuro diseño ni de ADR-MMA-023.
* **Aprobación I3 e inicio I4:** el propietario responde «Vale, si, la apruebo» al paquete visual/contrato y la pregunta de pasar a I4. Se registra aprobación de ADR-MMA-023 y ficha v07, cierre FE-I3-01/02/03 y autorización de implementar I4, con la misma rama y entrega local. No acepta por anticipado implementación/PNG/pruebas físicas ni autoriza push o merge.
* **Base observada de planificación:** origin/staging `1b204633ddd0ad782096d5377a3ee1c35d05c796`, árbol `af9deb7d47fb9bd86dea690467f54577f3b214b7`, PR #25 integrada. Comprobar nuevamente SHA/árbol al ejecutar.
* **Fuentes:** [investigación y propuesta de unión](../../reports/pb01/frontend-skills-review.md), [ficha Plan B](../../product-specs/plan-b.md), [registro técnico](../../design-docs/index.md), [frontend](../../standards/FRONTEND.md), [calidad](../../standards/QUALITY_SCORE.md), [seguridad](../../standards/SECURITY.md), [arquitectura](../../../ARCHITECTURE.md) y [gobierno del harness](../../harness-decisions.md).

## Objetivo y resultado esperado

Adoptar un estándar frontend propio y verificable, apoyado en Impeccable y Vercel, y demostrar su utilidad con una revisión del recorrido, resultado y fondo exportado de Plan B. La experiencia debe explicar su utilidad a una persona nueva, guiar decisiones con poca fricción, expresar la identidad existente y producir un resultado que merezca guardarse. La instalación de herramientas y los tests verdes no constituyen por sí solos ese resultado.

El entregable incluye normas coherentes, skills realmente utilizables en el cliente elegido, un piloto implementado y revisado, observaciones de uso y una regresión comparada sobre el candidato final. La plataforma sigue en Astro/React/Tailwind, con la identidad Laboratorio creativo, ES/EN, temas y el circuito de entrega existentes.

## Alcance, límites y relación con PB-01

FE-01 propone y ejecutaría la adopción transversal de calidad/skills y **solo la mejora frontend nueva del piloto**. PB-01 conserva el contrato funcional, historial I1–I6, pruebas de calendario/persistencia/exportaciones y aceptación del producto. FE-01 parte del código integrado de PB-01; **no depende de que PB-01 esté Aceptado**, evitando una dependencia circular.

| Responsabilidad | Fuente / ejecución |
| --- | --- |
| Estándar compartido, integración de skills y nueva revisión UX/UI | FE-01, únicamente en su rama y dentro del alcance que se apruebe. |
| Comportamiento de Plan B y cambios materiales del recorrido | Ficha funcional y decisiones técnicas; su modificación se propone y aprueba antes de implementar el cambio. El plan no sustituye ese contrato. |
| Cierre funcional y matriz física pendientes | PB-01 continúa En curso. FE-01 no acepta, cancela ni marca completas sus iteraciones. |
| Trabajo concurrente sobre la UI de Plan B | Se ordena: durante I3–I7 de FE-01 no ejecutar cambios de UI en PB-01 en paralelo. Otra corrección necesaria se coordina, integra y revalida antes de congelar el candidato. Esta coordinación queda propuesta con el plan. |
| Evidencia final | FE-01 I7 traza los PB-AC afectados; PB-01 I6 se actualiza sobre el nuevo candidato y reutiliza evidencia válida del mismo contenido. Se repite cuando cambien runtime, contrato o condiciones, no por trámite. |

El alcance humano inicialmente disponible es Chrome de escritorio. El piloto se revisa allí y mediante emulación/tamaños de referencia; esas pruebas no acreditan Safari/Firefox reales, importación móvil, destinos nativos o fondo colocado bajo reloj. Sus requisitos esenciales de PB-01 siguen bloqueando la aceptación global del producto. La eventual aceptación de FE-01 deberá identificar expresamente ese alcance y sus límites, sin presentarla como aceptación de PB-01 o autorización de lanzamiento.

Incluye ajustes de formulario, jerarquía, progresión, ayudas, microinteracciones, resultado, vista previa y composición PNG, con sus traducciones/pruebas. Un ajuste mínimo del marco compartido de miniapps se permite **solo si se identifica y aprueba su contrato en I3**, con comportamiento por defecto conservado para otras herramientas/fixtures. No usar esta salvedad para un refactor transversal.

Quedan fuera cuentas, backend, analítica, gamificación, recordatorios propios, IA dentro del producto, editor de fondos, vídeo/fondos animados, varias direcciones de marca entregadas como selector, migración de stack, nuevas dependencias frontend, nueva infraestructura, CI/hooks automáticos, producción/promoción/rollback remoto y cambios del hero/plataforma por preferencia. Una necesidad real fuera de estos límites se propone en su fuente antes de implementarla.

## Decisiones y bloqueos

Aplican ADR-MMA-001/002/003/005/006/008/011/015/016/017/019/020/021, la enmienda de movimiento de ADR-MMA-018 y los límites de entrega de ADR-MMA-004/009/014. H-005/006/007 fijan regresión final, un plan con iteraciones y una rama por plan. Sus estados se consultan en las fuentes, sin deducir autorizaciones de su presencia aquí.

| Punto | Resolución necesaria y momento |
| --- | --- |
| Inicio | Resuelto el 2026-11-17: el propietario solicita crear la rama y comenzar I1. Plan aprobado y ejecución limitada a I1 autorizada; siguientes iteraciones y decisiones concretas conservan sus condiciones. |
| Estándar y herramientas | Resuelto el 2026-11-17: ADR-MMA-022 y H-008 aprobadas en sus fuentes. I1 completada; la instalación, carga y comprobación de skills pertenecen a I2, autorizada para ejecución local por la instrucción posterior registrada en Control. |
| Diseño y contrato | I3 presenta recorrido/composición/PNG y cambios concretos de ficha o contrato compartido. Revisión humana de la dirección y aprobación de cambios antes de I4/I5. |
| Revisión humana | La aprobación del propietario es suficiente para la aceptación humana, con los controles técnicos aplicables. I3 define la dirección y el ámbito a revisar; I6 recoge su aprobación del acabado. Las pruebas con otras personas son opcionales y su ausencia no bloquea el cierre. |
| Compatibilidad física | Permanece pendiente en PB-01. Registrar dispositivos/motores realmente probados y separar la validación del piloto de la aceptación global del producto. |

Una autorización completa permite avanzar entre iteraciones al satisfacer sus salidas, sin volver a pedir permiso operativo ya concedido. Los puntos de revisión anteriores son decisiones concretas del propietario. No solicitar confirmación por cada ajuste local cubierto ni sustituir una comprobación esencial por una excepción implícita.

## Orden, unidades de trabajo y evidencia

Cada iteración produce una unidad revisable y conserva regresión local. Si un hallazgo no cabe en esa unidad, detener el trabajo afectado, acotar la corrección y revisar el plan antes de ampliarlo; la regresión global permanece al final. No crear un archivo de plan por iteración.

El informe de ejecución previsto es `docs/reports/fe01/execution.md`, con secciones I1–I7; se crea al existir ejecución real. El [informe de investigación](../../reports/pb01/frontend-skills-review.md) conserva la procedencia y enlaza este plan, sin mantener otro progreso paralelo. Capturas mínimas para aprobación en `docs/review/fe01/`, con manifiesto de candidato/tema/locale/viewport y datos sintéticos. Logs, motores y mediciones auxiliares quedan fuera del entregable y de las capturas compartidas.

### I1 — Base reproducible, estándar y acuerdos

**Entrada:** FE-01 aprobado y ejecución I1 autorizada. **Resultado:** referencia fiable y propuesta exacta del estándar/adopción, con sus aprobaciones registradas para la parte que se vaya a ejecutar.

1. Reconciliar el workspace antes de crear la rama de ejecución: el checkout observado seguía en 3d28184 con cambios I6 previos a la desconexión, mientras staging integró PR #25. Guardar copia de seguridad y comparar archivos con staging, preservando investigación y cambios no integrados. No usar reset/clean, mezclar trabajo de planes o asumir que los cambios locales pendientes son nuevos. Registrar SHA/árbol real, estado y diferencia intencional antes de avanzar.
2. Capturar referencia del recorrido/resultados ES/EN claro/oscuro, formularios y PNG con entradas cortas/máximas; geometría, foco y recursos de portada/404/Plan B, bytes propios/compartidos y deuda actual. Usar el runtime integrado real; las capturas I5 son antecedente, no sustituyen una referencia de la nueva base.
3. Preparar los cambios acotados de FRONTEND, QUALITY_SCORE y enlaces de guía/BOOTSTRAP/PEND-001: roles de diseño/revisión, criterio visual y de uso, procedencia de reglas y excepciones. Para cada conflicto decidir adoptar/adaptar/revisar regla propia/descartar, con ámbito y comprobación. Presentar al propietario la selección y permisos de herramientas con la propuesta revisable. Conservar una ruta sin skills.

**Archivos previstos:** estándares existentes, harness-decisions, registro técnico solo cuando haya una decisión duradera, guía de miniapps/BOOTSTRAP y seguimiento de deuda; informe/referencias de FE-01. No se crea otra fuente de producto o identidad.

**Salida:** FE-I1-01 base/estado recuperables y referencia identificados; FE-I1-02 matriz de adopción con los conflictos conocidos de contexto, texto, movimiento, ejecución/red y reglas remotas; FE-I1-03 selección y alcance aprobados antes de activar herramientas o normas. Si falta una aprobación, conservar las propuestas claramente separadas del estado vigente.

### I2 — Skills integradas y comprobadas

**Entrada:** base y permisos de I1 resueltos. **Resultado:** uso reproducible de las ayudas en el cliente elegido, sin cambiar el producto.

1. Incorporar copias locales y adaptaciones mínimas con procedencia/licencia/manifiesto. Revisiones candidatas: Impeccable 4.9.2 en d41d9860b0094dcb68030657da63461212835aaa; Vercel agent-skills en 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62. Las reglas Vercel examinadas corresponden a 434b7f91364665f2f733b310ec54809bf8f37937; fijar el paquete no fija sus descargas desde main. Registrar qué reglas usa cada revisión. Resolver los avisos de licencia antes de distribuir las copias; no actualizar todo automáticamente por haber otra versión.
2. Ubicación prevista `.agents/skills/impeccable/` y `.agents/skills/web-design-guidelines/`. Adaptar referencias a las fuentes existentes; no crear PRODUCT.md/DESIGN.md como autoridades nuevas ni ejecutar init/document por defecto. Uso manual, sin hooks/subagentes activados por inferencia. Telemetría desactivada; controlar aparte catálogo/red del motor y caché/versiones/checksums si se usa. No añadir dependencias al package/lockfile de la miniapp.
3. Alcance original, sustituido por el acuerdo de uso explícito registrado en Control: verificar descubrimiento real con el cliente iniciado en el repo: solicitud frontend pertinente, una revisión técnica y una tarea ajena que no debería activar diseño. Registrar instrucciones/referencias leídas, conflictos resueltos y efectos de red/archivos. Leer un SKILL.md a mano no demuestra descubrimiento automático. Comprobar el motor y las funciones realmente escogidas antes de afirmar que funcionan; no certificar Claude/Gemini sin sus pruebas.

**Archivos previstos:** skills/manifiesto/avisos, configuración mínima de desarrollo y documentación de uso existente. Motores/cachés y archivos de sesiones no se versionan ni llegan a dist.

**Salida actualizada por el propietario:** FE-I2-01 carga explícita de las instrucciones y aplicación manual observadas en el cliente usado; detección automática documentada como limitación, sin exigirse para el cierre; FE-I2-02 contexto/reglas/configuración y efectos documentados sin automatización o dependencia frontend nueva; FE-I2-03 aplicación acotada produce hallazgos útiles sobre la UI actual, sin editarla como efecto de la prueba. Un fallo de motor/uso explícito queda como bloqueo real de adopción; el alcance manual actual fue decidido expresamente, sin afirmar equivalencia con detección automática.

### I3 — Recorrido, composición y contrato aprobados

**Entrada:** estándar acordado, herramientas comprobadas o limitación explícita que permita continuar el trabajo de diseño autorizado. **Resultado:** propuesta visual y funcional suficiente para implementar sin inventar decisiones materiales.

1. Diseñar el recorrido con una decisión principal cada vez, ayudas/sugerencias contextuales y resultado accesible pronto. Contrastar separar calendario/opciones del camino principal, número de pasos, posición de Atrás y guardado/restauración. Resolver qué cambia de la ficha; no fijar aquí otra estructura rígida antes de evaluar la propuesta.
2. Presentar como máximo dos direcciones fieles a la identidad, con textos reales y ejemplos ES/EN, escritorio/móvil, claro/oscuro, formulario, resultado y composición PNG. Mostrar el flujo mediante prototipo navegable local o secuencia explícita de estados que permita revisar navegación/acciones, no solo un hero. Prototipo separado del producto/catálogo y sin publicación nueva. La ejecución elegida se concentra en una dirección revisada.
3. Especificar estados, movimiento/interruptibilidad/reduced-motion, jerarquía, límites de tamaño y comportamiento con errores/texto máximo/zoom. Identificar cualquier ajuste compartido necesario y su contrato por defecto. Presentar migración/restauración de sesiones previas si cambia el modelo. Precisar los criterios de revisión/aprobación del propietario y preparar las modificaciones de ficha/decisiones; registrar aprobación de dirección y comportamiento antes de implementar.

**Archivos previstos:** propuesta visual en design-docs y evidencia de revisión, ficha Plan B, decisión técnica si procede y referencias del plan; sin convertir el prototipo en una miniapp pública.

**Salida:** FE-I3-01 flujo y dirección visibles revisados por el propietario; FE-I3-02 contrato actualizado/aprobado con estados y compatibilidad de sesión definidos; FE-I3-03 criterios y ámbito de revisión del propietario definidos; las pruebas con otras personas son opcionales. No avanzar a I4/I5 con una decisión material sin resolver o con la propuesta visual rechazada.

### I4 — Recorrido guiado implementado

**Entrada:** dirección y contrato I3 aprobados, I2 utilizable o excepción de alcance decidida expresamente. **Resultado:** completar/editar el plan en el nuevo recorrido, con continuidad y sin pérdida de entradas.

1. Implementar preguntas/progresión, ayudas, sugerencias y acción principal según el diseño; reducir scroll innecesario y dar espacio deliberado al escritorio. Validación, foco, teclado, Atrás, ejemplo, reset, cambio de idioma y recuperación conservan el comportamiento actualizado aprobado. No ocultar overflow ni bloquear zoom para que parezca caber.
2. Incorporar microinteracciones y transiciones al servicio de los cambios de estado; acciones rápidas/interrumpidas no duplican avance, eventos o guardado. Preservar texto literal, avisos de almacenamiento y narrativa/fechas. Verificar restauración de sesiones previas y estados incompletos conforme a I3, sin borrar datos silenciosamente.
3. Añadir/modificar pruebas de los comportamientos cambiados y límites reales: hora nativa parcial, cambio de mes/reset, almacenamiento bloqueado/corrupto, locale, pulsaciones rápidas y movimiento reducido. Conservar casos vacío/draft, aislamiento y garantías de plataforma. Si se aprobó un ajuste del marco común, probar su default con fixtures.

**Archivos previstos:** App, controlador/estado/copy/CSS del módulo y pruebas relacionadas; contratos compartidos solo los aprobados en I3. Generadores de calendario y política de hosting conservados.

**Salida:** FE-I4-01 recorrido ES/EN fiel y utilizable con teclado; FE-I4-02 errores/entradas/sesión/fechas mantienen los contratos; FE-I4-03 verificaciones dirigidas y verify aplicables satisfactorios, con observación real del navegador y límites visibles. La revisión local no sustituye I6/I7.

### I5 — Resultado y PNG con acabado de producto

**Entrada:** recorrido funcional y composición de I3 aprobada. **Resultado:** resultado y exportaciones integrados con jerarquía clara y fondo estático deliberadamente diseñado.

1. Implementar resultado, edición y acceso progresivo a calendario/guardado/compartir según el contrato nuevo. Dar prioridad a entender y usar el plan, con estados de preparación/error/cancelación/éxito claros. Evitar duplicar controles, avisos o peticiones al navegar entre opciones.
2. Implementar la dirección PNG elegida: 1179×2556, fuentes/tokens locales, zona útil bajo reloj, frase completa y literal, temas y casos de texto máximo. Mantener los límites de privacidad, activación de usuario y alternativa de descarga/vista. No añadir editor, selector de estilos, fuentes remotas o generación IA en el producto.
3. Comprobar que el diseño no altera calendario, consentimiento Google/Cancelar, enlace compartido limpio, funcionamiento offline con página cargada ni liberación de canvas/URLs/listeners. Cubrir casos largos, grafemas/emoji, fallo de fuentes/canvas/compartir y navegación de ida/vuelta. Medir el coste incremental frente a I1.

**Archivos previstos:** ExportPanel, render/layout de PNG, copy/CSS y pruebas del módulo; recursos locales únicamente con licencia/procedencia comprobadas y coste registrado.

**Salida:** FE-I5-01 resultado/preview/PNG fieles a la dirección aprobada y con texto íntegro; FE-I5-02 exportaciones/consentimiento/offline/errores conservados; FE-I5-03 recursos liberados, presupuesto propio ≤50 KiB comprobado y runtime/totales informados. Compatibilidad móvil física sigue sin inferirse de descargas automatizadas.

### I6 — Pulido y aprobación del propietario

**Entrada:** piloto completo de I4/I5 y dirección/contrato acordados. **Resultado:** corregir fricción observable y obtener la aprobación del propietario del recorrido, acabado y resultado en el ámbito revisado.

1. Revisar el recorrido renderizado ES/EN, claro/oscuro, mouse/teclado, reduced-motion, errores, textos cortos/máximos y pantallas de referencia. Afinar ritmo, alineaciones, foco, labels y continuidad; no añadir funciones nuevas ni efectos que compitan con completar la tarea.
2. Presentar al propietario el recorrido implementado, el resultado y el PNG real, con sus límites y comprobaciones técnicas. Su aprobación es suficiente como aceptación humana de esta etapa; registrar la indicación y cualquier observación/corrección. No exigir participantes externos, un mínimo de tres primeras visitas o una medición temporal para dar por correcto el desarrollo.
3. Las pruebas con otras personas y la medición del objetivo de dos minutos son complementos opcionales. Si se realizan, registrar tarea/condiciones/resultados sin conservar frases personales innecesarias y corregir hallazgos materiales. Si no se realizan, declararlo sin bloquear por esa ausencia ni atribuirle una medición a la aprobación del propietario. Los defectos técnicos y los incumplimientos del contrato aplicable conservan su tratamiento y revalidación.

**Archivos previstos:** ajustes locales de UI/copy/PNG y sus pruebas si cambian comportamiento; informe de revisión/aprobación, hallazgos y capturas mínimas. Si se decide una evaluación adicional, sus observaciones son evidencia complementaria.

**Salida:** FE-I6-01 aprobación del propietario de la dirección implementada en el ámbito revisado; FE-I6-02 aprobación/observaciones y correcciones registradas, con pruebas con otras personas opcionales; FE-I6-03 candidato identificado, pruebas técnicas afectadas repetidas y freeze funcional para I7. No marcar una comprobación técnica esencial como pasada por la aprobación visual.

### I7 — Regresión y análisis global, última iteración

**Entrada:** estándar/skills/piloto completos, revisión humana registrada y candidato congelado. **Resultado:** contrastar el conjunto con la base anterior y entregar evidencia para aceptación del plan, sin introducir funciones posteriores a la revisión.

1. Revisar todo el diff de FE-01: normas coherentes sin fuentes paralelas, procedencia/adaptaciones de skills, alcance real de carga y red, producto contra ficha/decisiones, aislamiento modular y deuda previa/nueva. Trazar los doce PB-AC, distinguiendo evidencia local, CI, staging y operaciones manuales pendientes de PB-01. Registrar hallazgo, origen, impacto, acción y revalidación; un incumplimiento esencial de FE-01 no se acepta trasladándolo a deuda.
2. Ejecutar verify final aplicable y revisar portada ES/EN, catálogo vacío/poblado/draft, rutas, idioma, 404, cabecera/pie, apariencia, fuentes/hero/movimiento y Plan B. Preservar las regresiones I6 previas y las nuevas. Contrastar DOM/capturas mínimas; axe/zoom/reflow no certifican por sí solos toda la accesibilidad.
3. Comparar base/candidato con mismo runtime/navegador, perfiles y condiciones, cinco pasadas fría/caliente por ruta relevante, medianas/rangos. Informar bytes propios y totales, solicitudes externas, LCP/CLS e interacción observada con límites; no llamar INP a un proxy ni reclamar p75 de campo. Revisar generación de PNG, diez ciclos exportación/Atrás/reset, recursos/memoria y sesgo de medición; auditoría de dependencias actual y base con criterio de exposición, sin actualizaciones automáticas.
4. Comprobar enlaces, contratos y materiales entregados; confirmar que skills/motores/cachés no se sirven. Con permisos operativos vigentes, commit/push/PR en la rama estable y CI del head final. El propietario hace merge; después comprobar run prepare/remote-test de staging y manifest SHA/árbol/payload del candidato servido por el circuito existente, sin debilitar guards. Sin ejecución remota, conservar pendiente ese criterio y el estado global.

**Salida:** FE-I7-01 todos los FE-AC contrastados con evidencia suficiente y hallazgos materiales resueltos; FE-I7-02 comparación funcional/visual/privacidad/recursos/deuda documentada con sus límites; FE-I7-03 verify/CI/staging del candidato final comprobados, documentación coherente y aceptación humana pendiente de decisión. Una corrección durante I7 se prueba y revalida sobre el nuevo candidato; una nueva función requiere revisar alcance y repetir la etapa final.

## Criterios de aceptación del plan

| ID | Resultado requerido | Evidencia principal |
| --- | --- | --- |
| FE-AC-01 | Estándar propio claro, aplicado y sin autoridades documentales duplicadas; conflictos resueltos por ámbito y decisión. | I1/I7, diff y matriz de adopción. |
| FE-AC-02 | Skills seleccionadas se cargan explícitamente y sirven al trabajo real en el cliente elegido, con versiones, referencias y permisos comprobados. Descubrimiento automático excluido del criterio por acuerdo del propietario. | I2/I7; aplicación manual observada, no basta copiar archivos. Limitación nativa conservada. |
| FE-AC-03 | Dirección y cambios del contrato aprobados antes de implementarlos, con identidad coherente y alcance modular. | I3, ficha/decisiones y revisión visual. |
| FE-AC-04 | Recorrido claro y guiado, sin pérdida de texto/estado, utilizable en ES/EN, temas y escenarios de referencia. | I4/I6/I7, navegador, pruebas y observaciones. |
| FE-AC-05 | Resultado y PNG cuidados, fieles y completos; exportaciones, privacidad y recuperación conservadas. | I5/I6/I7 y trazabilidad PB-AC. |
| FE-AC-06 | Recorrido, acabado y resultado aprobados por el propietario en el ámbito revisado, con los controles técnicos aplicables. Pruebas con otras personas y mediciones de uso opcionales; su ausencia no bloquea aceptación. | I6, indicación del propietario, correcciones/límites y observaciones adicionales solo si se realizan. |
| FE-AC-07 | Presupuestos y costes reales medidos; sin degradación material reproducible o retenciones introducidas sin resolver. | I1/I5/I7 y comparaciones frías/calientes/recursos. |
| FE-AC-08 | Regresión técnica, coherencia documental, CI e identidad/pruebas de staging del candidato final satisfactorias. | I7, run/head y manifest; evidencia local/remota diferenciada. |
| FE-AC-09 | Handoff claro a PB-01 con el candidato/evidencia y pendientes físicos; aceptación del proceso/piloto separada del producto completo. | I7, actualización de referencias/progreso y decisión del propietario. |

## Entorno, pruebas y evidencia

Usar Node 24.22.2, npm 11.19.1, Chromium 156.0.8078.4/r1248 y las herramientas existentes. Comprobar disponibilidad real y conservar package/lockfile. Referencias de observación: 393×851 y 1440×900, más reflujo a 320 px y zoom nativo 200 % cuando la capacidad esté disponible; los viewports de emulación no prueban teclado virtual o dispositivos físicos.

Comandos existentes: `npm run check`, `npm run lint`, `npm run format:check`, `npm run validate:hosting`, `npm run test:unit`, `npm run test:components`, `npm run test:e2e`, `npm run test:integration`, `npm run verify` y `npm run build`. Pruebas dirigidas durante cambios; verify en entregas de runtime y candidato final. Repetir tras cambios materiales o fallos, sin rondas adicionales por trámite. `npm run test:remote` pertenece al circuito de target/identidad aprobado; no ejecutarlo contra una URL arbitraria con expectativas construidas desde lo observado.

En I1/I2, cuando solo cambien documentación/tooling de desarrollo, revisar enlaces/estados/rutas/alcance de archivos y carga real; comprobar que el build/runtime no incorpora ese material. No crear tests de contenido editorial o que solo repliquen la implementación. En I4/I5 conservar tests del dominio y actualizar aserciones únicamente cuando verifiquen un contrato nuevo aprobado; nunca retirar pruebas o hacer skips para conseguir verde.

Los scripts auxiliares de auditoría documental, benchmark, prototipo o captura se identifican al ejecutarse; no se presentan comandos futuros como si ya existieran. Las mediciones y logs se resumen en el informe durable, con versión/base/candidato/resultados/límites; no enlazar scratch local como evidencia compartida.

## Recuperación, límites operativos y cierre

Conservar copia/diff antes de reconciliar el workspace y commits/entregas anteriores. Una instalación defectuosa se puede revertir retirando únicamente lo incorporado por FE-01 y restaurando su configuración previa, sin borrar skills ajenas o documentos de producto. La reversión del piloto se prepara desde los commits identificados, por PR y sin reset destructivo/force push. No revertir contratos/sesiones sin comprobar compatibilidad y estado servido.

Si una dependencia/servicio, contrato compartido, permiso o capacidad ausente desborda lo aprobado, registrar el bloqueo, preparar la opción concreta y continuar solo con trabajo independiente autorizado. Ninguna skill, detector, puntuación o CI concede aprobación, autoriza el merge o sustituye la observación humana. No instalar herramientas alternativas ni activar automatizaciones como remedio implícito.

FE-01 pasa a Verificado solo con sus criterios comprobados sobre el candidato final; la aceptación es humana. Los requisitos físicos pendientes del producto continúan en PB-01, identificados y sin marcarse ejecutados. Aceptar FE-01 no archiva PB-01. Al aceptar/cancelar este plan se mueve su único archivo a completed y se actualizan enlaces. El siguiente cambio funcional requiere revalidar la evidencia afectada y preservar una última regresión global.

## Progreso y reanudación

| Iteración interna | Inicio | Fin | Salida / evidencia | Siguiente paso o bloqueo |
| --- | --- | --- | --- | --- |
| I1 — base y estándar | 2026-11-17 | 2026-11-17 | [x] FE-I1-01/02: base/matriz y referencia entregadas en PR #26, integrada en 64546ad. FE-I1-03: ADR-MMA-022 y H-008 aprobadas, con revisión humana suficiente del propietario y pruebas con otras personas opcionales. [Informe](../../reports/fe01/execution.md#i1--base-y-propuesta-del-estándar). | I2 autorizada para ejecución local por la instrucción posterior de Control. |
| I2 — skills | 2026-11-17 | 2026-11-17 | [x] FE-I2-01/02/03 con alcance manual explícito aceptado por el propietario. [Informe I2](../../reports/fe01/execution.md#i2--integración-local-y-comprobación-de-skills). | I3 autorizada. Detección nativa no acreditada; sin bloqueo para el perfil aceptado. |
| I3 — diseño y contrato | 2026-11-17 | 2026-11-17 | Propuesta preparada: [ADR-MMA-023](../../design-docs/plan-b-frontend-proposal.md), [prototipo/capturas](../../review/fe01/README.md). Recorrido, resultado y PNG revisables, ES/EN y temas, pruebas de prototipo; sin sustituir v06. | [x] FE-I3-01/02/03: propietario aprueba dirección, contrato/restauración y focused. I4 autorizada; implementación no aceptada anticipadamente. |
| I4 — recorrido | 2026-11-17 | — | [ ] En ejecución local sobre dirección/contrato aprobados. | Implementar/verificar recorrido, sesión y marco focused; acabado de resultado/PNG en I5. |
| I5 — resultado y PNG | — | — | [ ] | I4 comprobada y composición aprobada. |
| I6 — pulido y revisión del propietario | — | — | [ ] | Piloto completo y aprobación del propietario; pruebas con otras personas opcionales. |
| I7 — regresión final | — | — | [ ] | I1–I6 comprobadas, candidato congelado y permisos de entrega/remoto vigentes. |

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-17 | `Borrador` | Codex, por solicitud del propietario | «Vamos a crear un plan de ejecución por iteraciones si hace falta»: preparación de un único FE-01 con siete iteraciones, rama estable prevista, dependencias/revisión humana y regresión global final. Sin instalación, ejecución, aprobación técnica o aceptación de producto. |
| 2026-11-17 | `Aprobado` | Propietario | «vale, crea una nueva rama y empecemos con la iteración 1»: aprobación del plan presentado, tras las aclaraciones de alcance y skills locales. Las decisiones nuevas se concretan y revisan en sus puntos de control. |
| 2026-11-17 | `Autorizado` → `En curso` | Propietario / Codex | Ejecución de I1 autorizada por la misma indicación; preservación/reconciliación del trabajo local y rama feature/fe01-frontend-quality desde staging 1b204633ddd0ad782096d5377a3ee1c35d05c796. I2–I7 sin iniciar. |
| 2026-11-17 | `En curso` | Codex | I1: rama/reconciliación sin pérdida, runtime idéntico al staging integrado, referencia de UI/PNG/recursos y run/manifest remoto identificados. Propuestas ADR-MMA-022 y H-008 preparadas; FE-I1-01/02 comprobados y FE-I1-03 pendiente de decisión. No hay skills instaladas ni cambios de UI. |
| 2026-11-17 | `Borrador` | Propietario / Codex | Ajuste material del criterio de aceptación indicado por el propietario al aceptar ADR-MMA-022: no se exige que otras personas prueben el desarrollo; basta su aprobación como aceptación humana. Se retira el mínimo de participantes y se actualizan FE-I3-03, FE-I6 y FE-AC-06, conservando alcance y regresión técnica. |
| 2026-11-17 | `Aprobado` | Propietario | Acepta ADR-MMA-022 con ese ajuste y H-008. La misma indicación aprueba el cambio del criterio de aceptación incorporado al plan, sin pedir una segunda ratificación por trámite. |
| 2026-11-17 | `Autorizado` → `En curso` | Propietario / Codex | Se conserva la autorización previa de I1 para registrar los acuerdos y completar su entrega, con el criterio actualizado por el propietario. No se amplía a I2–I7. |
| 2026-11-17 | `En curso` | Codex | FE-I1-03 comprobado al registrar ambas aprobaciones; I1 completada. Rama estable sincronizada por fast-forward desde staging 64546adc0027b5988983e425278beb5585cf4a64 tras integrar PR #26. Instalación de skills y nueva UI aún sin ejecutar. |
| 2026-11-17 | `En curso` | Propietario / Codex | PR #27 integrada; rama estable actualizada por fast-forward a staging e4b42f121674a24aacc4a3add473111bc7e36c34. Se registra la instrucción de ejecutar localmente sin subir hasta terminar todo el plan y se comunica continuación por I2 porque I1 ya estaba completa. I2 instala el perfil aprobado y comprueba motor/revisión manual; FE-I2-01 sigue pendiente por capacidad del cliente. Sin push, PR nueva ni cambios de producto. |
| 2026-11-17 | `En curso` | Propietario / Codex | «vale, usalas para continuar con la iteraicón 3», después de concretar Impeccable/Vercel y el ajuste propuesto de FE-I2-01: aceptación del uso explícito probado, cierre de I2 y autorización de preparar I3. Se conservan entrega local y revisión humana del diseño/contrato. |
| 2026-11-17 | `En curso` | Codex | I3: preparada dirección «El plan toma forma», prototipo navegable y HTML autónomo offline, secuencia de capturas y PNG reales. ADR-MMA-023 Propuesta, ficha v06 conservada; cuatro preguntas visibles, calendario posterior, sesión v1 compatible y focused opcional por revisar. Comprobaciones del prototipo y aislamiento del build en el informe. Sin push/PR, cambios funcionales o implementación de I4/I5. |
| 2026-11-17 | `En curso` | Propietario / Codex | «Vale, si, la apruebo» tras presentar I3 y preguntar por dirección/contrato y paso a I4. ADR-MMA-023 y ficha v07 aprobadas; FE-I3-01/02/03 completados. I4 autorizada/iniciada; sin ampliar entrega remota o aceptación del producto. |
