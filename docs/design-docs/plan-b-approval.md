# Plan B v06 — paquete para revisión del propietario

**Estado:** Bloques A (selección/ficha) y C (PB-01) aprobados; Bloque D con preparación local de I5 solicitada el 2026-11-17 tras integrar I4; adelanta el acabado aislado, sin cerrar sus criterios físicos. Bloque B con ADR-MMA-020/021 aprobadas; I4 sin cerrar por matriz física/HTTPS; registro de I5 autorizado en la candidata; revisiones de cierre e I6 pendientes. **Responsable:** propietario de MiMiniApp (Alexander / Ale). **Creado:** 2026-11-15. **Actualizado:** 2026-11-17. Preparación original en `docs/plan-b-v06`; I1–I4 integradas mediante PR #19/#20/#22/#23. Rama estable de PB-01: `feature/pb01-plan-b`, sincronizada desde staging `beed90cbb418e0c0f9525353c806ca9582ee7226`, según H-007.

## Qué se entrega

* [Ficha funcional v06](../product-specs/plan-b.md): definición autocontenida, textos ES/EN, comportamiento ante errores y doce criterios de aceptación.
* [ADR-MMA-020/021](plan-b-contracts.md): contratos aprobados de sesión temporal y exportaciones; estados canónicos en el [registro técnico](index.md).
* Un [ExecPlan PB-01](../exec-plans/active/PB-01-plan-b.md) en curso, con I1–I4 integradas e I5 en preparación local, con seis iteraciones internas secuenciales, criterios de salida y regresión global al final. El Bloque C resume su estructura.
* [v05 original](../references/plan-b-v05.md): antecedente aportado, con nota de procedencia. No se da por verificado que su v04 exista en Git.

## Bloque A — definición de producto aprobada

El propietario selecciona Plan B y solicita comenzar I1 conforme a la ficha v06 el 2026-11-16. Se registra esa aprobación del contrato funcional, con estos cambios respecto a v05; las decisiones técnicas del Bloque B conservan su estado independiente:

| Tema | Propuesta concreta | Motivo |
| --- | --- | --- |
| Integración | `/es/apps/plan-b/` y `/en/apps/plan-b/`, nombre inglés Bad Day Plan, categoría `everyday`. | Usa el registro y selector actuales sin modificar rutas compartidas. |
| Fechas | Siguiente mes natural, fijado al empezar la sesión narrativa. | Hoy +31 días puede saltarse febrero. |
| Calendario | Hora local, desde mañana, 15 min, exactamente cuatro apariciones por día elegido. | Evita quinta semana y define fin verificable. |
| Offline | Recorrido y generación `.ics`/PNG con página completamente cargada y abierta. | No promete reapertura, reload o cambio de idioma offline sin mecanismo adicional. |
| Texto y estado | Trim exterior; límites Unicode; sin reescribir. Cambiar idioma u obstáculo conserva frases; fallos de storage tienen aviso. | Evita pérdida silenciosa y diferencias entre salidas. |
| PNG | Vertical fijo 1179×2556 en todos los dispositivos, con frase completa y pruebas bajo el reloj. | Evita fondos horizontales desde escritorio y simplifica memoria/layout. |
| Tamaño | 50 KiB sin comprimir para código JS/CSS propio; informar también total real, incluidos runtimes. | El renderer de React actual por sí solo supera 50 KB sin comprimir y no lo descarga la portada. |
| Entrega | Primera aceptación en staging; producción y dominio propio separados. | La producción existente se gestiona en otro repositorio; no forma parte de esta entrega. |

Se conservan núcleo, ejemplo, imagen, tres pasos, sello, ES/EN y al menos una vía funcional de calendario en cada móvil. Si Google es la única vía de importación en alguno, se explica que requiere conexión; el archivo `.ics` sigue generándose offline. No se añaden analítica, cuentas, servicios, dependencias ni PWA. Los recortes permitidos siguen el orden acotado de la ficha.

## Bloque B — decisiones técnicas de Plan B

* **ADR-MMA-020, aprobada al autorizar I3:** `sessionStorage` versionado y validado, memoria ante fallo, reset explícito. Cerrar pestaña no garantiza borrado; no se toca la preferencia de apariencia.
* **ADR-MMA-021, aprobada al autorizar I2:** `.ics` y PNG locales; Google solo tras aviso/confirmación, con texto en su URL. Compartir la herramienta lleva URL limpia; compartir PNG puede entregar el plan al destino elegido. Sin API, OAuth o backend.

Las decisiones se aprueban individualmente en el registro técnico. ADR-MMA-020/021 están Aprobadas para sus alcances respectivos. La aprobación de A no sustituye esas decisiones.

## Bloque C — plan único con seis iteraciones

PB-01 contiene el producto completo con seis iteraciones internas. Es el único archivo de planificación de Plan B en `active/`, con un solo estado, aprobación, autorización, historial y aceptación final. El avance de cada iteración se registra dentro de PB-01; esta tabla resume su orden, no crea seis planes ni seis aceptaciones.

**Revisión del 2026-11-16:** el propietario solicita aprobar los planes que superen la revisión. PB-01 satisface la preparación exigida por PLANS.md: responsable, alcance, orden, criterios, verificaciones y bloqueos definidos. Queda `Aprobado` con los bloqueos declarados que la transición permite; no `Autorizado`, `Verificado` o `Aceptado`. Los PB-AC son criterios futuros de producto y todavía no se han ejecutado.

| Orden | Iteración interna de PB-01 | Entrada y salida específicas |
| --- | --- | --- |
| I1 | [Base lógica y referencia](../exec-plans/active/PB-01-plan-b.md#iteración-1--base-lógica-y-referencia) | Entradas/mes, descriptor no publicado y build aislado; referencia de plataforma, bytes y deuda antes de desarrollar. |
| I2 | [Calendario](../exec-plans/active/PB-01-plan-b.md#iteración-2--calendario) | I1 completada y ADR-MMA-021 aprobada; fechas, .ics y URL Google con expectativas independientes y muestras sintéticas. |
| I3 | [Recorrido y estado](../exec-plans/active/PB-01-plan-b.md#iteración-3--recorrido-y-estado) | I2 completada y ADR-MMA-020 aprobada; tres pasos, ejemplo, ES/EN, recuperación y reset probados en copia aislada. |
| I4 | [Imagen y exportaciones](../exec-plans/active/PB-01-plan-b.md#iteración-4--imagen-y-exportaciones) | I3 completada y UI candidata accesible por HTTPS; PNG y botones reales de calendario/guardado verificados en iPhone y Android. |
| I5 | [Identidad e integración](../exec-plans/active/PB-01-plan-b.md#iteración-5--identidad-e-integración) | I4 completada; visuales, accesibilidad, presupuesto y candidato de catálogo/rutas reales, con permiso de incorporación. |
| I6, última | [Regresión y análisis global](../exec-plans/active/PB-01-plan-b.md#iteración-6--regresión-y-análisis-global) | I1–I5 completadas; contraste del conjunto con la base, hallazgos/deuda, privacidad, accesibilidad, rendimiento y CI/staging autorizados sobre el candidato definitivo. |

La ejecución es secuencial. Una vez autorizado el alcance, se avanza cuando estén comprobadas las condiciones de salida y disponibles las entradas de la siguiente iteración. Las revisiones humanas expresas —móviles, identidad visual, incorporación al catálogo, merge y aceptación final— se conservan; completar una iteración no exige por sí solo volver a aprobar todo el trabajo. Si la autorización es parcial, se respeta ese límite.

Cada iteración incorpora regresión local y handoff; I6 revisa el conjunto. Cualquier corrección posterior exige revalidar el candidato final. Un fallo material, una degradación reproducible sin resolver o una prueba esencial pendiente impiden declarar el plan `Verificado`. La deuda previa se distingue de la introducida y la IA no acepta por su cuenta el residuo.

Límite de Ale: 6–12 h en 3–4 sesiones, sin prometer fecha. Las seis iteraciones acotan el trabajo de IA, no añaden seis sesiones humanas. Se mantienen los recortes permitidos de la ficha; si no cabe el núcleo, se revisa el alcance. No se exige cerrar I-03/CP-02 completos para trabajo independiente.

El inventario de código identifica dos adaptaciones necesarias en I5: `tests/unit/miniapp-registry.test.ts` exige registro vacío y `tests/e2e/catalogue.spec.ts` exige cero tarjetas. I1–I4 mantienen el registro real sin cambios y prueban en copia aislada. I5 conserva el caso vacío en fixture y añade el poblado real, sin borrar garantías para conseguir verde.

### Cobertura del contrato y puntos de control

| Criterio de ficha | Primera evidencia prevista | Confirmación del conjunto |
| --- | --- | --- |
| PB-AC-01 — rutas, catálogo e idiomas | I3 en copia aislada; I5 en candidato real | I6 |
| PB-AC-02 — recorrido y validación | I1 dominio; I3 interfaz | I6 |
| PB-AC-03 — mes natural y sesión narrativa | I1; I3 conservación en UI | I6 |
| PB-AC-04 — persistencia y recuperación | I3 | I6 |
| PB-AC-05 — serie de calendario | I2 lógica; I4 importación física | I6 |
| PB-AC-06 — .ics, URL y consentimiento | I2 formatos; I4 botones/errores | I6 |
| PB-AC-07 — imagen legible y guardable | I4; I5 tras acabado visual | I6 |
| PB-AC-08 — compartir y texto intacto | I2 generadores; I3/I4 UI y destinos | I6 |
| PB-AC-09 — modo avión | I4; I5 tras estilos finales | I6 |
| PB-AC-10 — accesibilidad y temas | I3 base; I5 acabado completo | I6 |
| PB-AC-11 — recursos y privacidad | I1 referencia; I4 red; I5 presupuesto | I6 |
| PB-AC-12 — batería, CI y staging | I1–I5 verifican sus salidas; I5 entrega candidato | I6 |

Los bloqueos se localizan dentro del mismo plan: selección/ficha y autorización antes de I1; ADR-MMA-021 antes de I2; ADR-MMA-020 antes de I3; teléfonos/HTTPS para I4; permiso de incorporación en I5; permiso operativo y validación remota para cerrar I6. Aprobar el formato de un plan único o la regla H-005 no aprueba los requisitos/decisiones ni ejecuta el producto.

## Bloque D — autorización de ejecución y alcance operativo

Los Bloques A/C están aprobados e I1–I4 integradas. El propietario solicita comenzar I5: se prepara el acabado y candidato aislado con ADR-MMA-020/021 aprobadas. I4 conserva sus requisitos físicos; el propietario autoriza expresamente la incorporación al catálogo de la candidata en la respuesta a la propuesta de PR #24. Tras resolver los bloqueos de inicio, el propietario puede autorizar **PB-01 completo** o un alcance parcial identificado, incluyendo sus iteraciones internas, rama feature, pruebas y evidencia. Una autorización completa permite progresar según sus condiciones sin solicitar otra aprobación por cada iteración. Puede incluir commits, push y PR en borrador a staging; el merge sigue siendo humano. La aceptación final se registra una sola vez al completar y verificar el conjunto. Estos permisos no se deducen de aprobar la planificación.

Esta autorización no permite al agente hacer merge, desplegar por fuera de Actions, habilitar producción/promoción/rollback, crear hosting/túneles, modificar secretos/protecciones o publicar un prototipo incompleto por eludir la verificación.

**Capacidad que falta comprobar para I4:** acceso HTTPS al candidato desde iPhone y Android para validar los botones de descarga/compartir antes de pulir visuales. I1 inventaría esa capacidad y presenta una propuesta si falta. Staging sirve la versión fusionada, no la rama feature. Las muestras de I2 no certifican las APIs de Safari y aprobar el plan no crea hosting/túneles o un despliegue de prototipo.

## Cómo registrar la respuesta

La aprobación de A/C, ADR-MMA-020/021 y la preparación local solicitada de I5 constan en ficha, registro técnico y PB-01. Una indicación posterior puede ampliar D con su alcance real; las revisiones humanas, permisos operativos y aceptación final se registran expresamente. La aprobación de un bloque no completa ni autoriza los demás.

Se registra fecha, actor y alcance en ficha, registro técnico y plan, sin atribuir aceptación de producto a la autorización. Si ya hay más de un mantenedor, la indicación debe constar además en el PR de GitHub correspondiente según H-003; no se presume el número de mantenedores a partir de una lista de despliegue vacía.

## Evidencia de esta preparación

El contraste previo usó código/documentación actualizados de staging. Comprobaciones locales previas: Astro check, 343 unitarias, 9 de componentes y build correctos; sin E2E, CI ni teléfonos. Esta tarea solo añade documentación y enlaces de navegación: no instala dependencias ni implementa Plan B. La revisión documental se registra al terminar en el progreso de PB-01.

La revisión del 2026-11-15 comprobó enlaces, paridad de textos y doce criterios conservando la v05. El 2026-11-16 se preparó una descomposición local en seis archivos; el propietario prefiere un único plan. La consolidación conserva las tareas y 28 criterios de salida dentro de PB-01 y retira los cinco borradores adicionales sin ejecutarlos o archivarlos como aceptados. H-005 mantiene el cierre global y H-006 aclara el avance interno. En la revisión posterior de planes pendientes se aprueba PB-01 como planificación; producto, propuestas técnicas y autorización de ejecución siguen pendientes.

La comprobación de consolidación previa conservó seis iteraciones, 28 criterios y 30 tareas numeradas, contrato funcional/textos y propuestas técnicas, con 485 enlaces locales válidos. La revisión de estados posterior mantiene PB-01 como único plan de Plan B, ahora `Aprobado`; MT-02 se archiva como `Aceptado`, dejando tres planes en active. No se atribuye a esta revisión documental una ejecución nueva de aplicación: se consulta el CI/staging satisfactorio de la PR #17 sobre el mismo código/configuración. Los cambios de estado se mantienen locales.

## Fuente de la separación entre preparación y desarrollo

[AGENTS.md](../../AGENTS.md#estado-y-autorización) establece: «Si el proyecto está en definición, investigación o planificación, trabaja únicamente en esas actividades. No conviertas una propuesta en implementación». [PLANS.md](../PLANS.md#estados-y-autorización) distingue `Aprobado` de `Autorizado`. Por eso esta entrega prepara un paquete revisable antes de comenzar el código; no añade un ciclo de aprobación distinto al del repositorio.

## Inicio de I1 — 2026-11-16

El propietario solicita el repaso de la documentación y comenzar I1. Se registra selección/ficha y autorización de esta iteración; la entrega mediante commit, push y PR a staging sigue su instrucción previa de seguir el marco. Se conserva su merge manual. No se presupone aprobación de ADR-MMA-020/021 ni ejecución de otras iteraciones. El propietario indica que dispone por ahora de Chrome de escritorio: iPhone/Android y HTTPS de la candidata quedan pendientes para I4. Evidencia en el [informe único](../reports/pb01/execution.md).

## Avance a I2 — 2026-11-16

El propietario confirma PR #19 fusionada y pide avanzar a la siguiente iteración: ADR-MMA-021 queda Aprobada y se autoriza I2. Se mantiene la entrega por commit/push/PR, el merge humano y los límites de importación física, consentimiento y dispositivos de I4. No se autoriza I3, persistencia, llamadas reales a Google o publicación.

## Rama y commits del plan — H-007

El propietario establece una única rama por ExecPlan, iteraciones internas y commits que identifican cada iteración. PB-01 continúa en `feature/pb01-plan-b` con títulos como `feat(PB-01/I3): implement the plan flow`; I1/I2 conservan su historia integrada. Las entregas por PR usan esa misma rama. Esta decisión organizativa no autoriza I3 ni cambia la aceptación final o los puntos de revisión humana.

## Registro de avance a I3 — 2026-11-16

El propietario confirma la integración de I1/I2 y solicita continuar. Se aprueba ADR-MMA-020 en el registro técnico y se autoriza I3 en `feature/pb01-plan-b`, con commits identificados por iteración, push y PR a staging. La autorización cubre UI ES/EN, sesión temporal, recuperación/reset y pruebas en copia aislada. No autoriza I4–I6, registro público, infraestructura o merge. Evidencia y handoff en el [informe único](../reports/pb01/execution.md#i3--recorrido-y-estado).

## Registro de avance a I4 — 2026-11-17

El propietario confirma el merge de PR #22 y solicita continuar. Se autoriza desarrollar y probar localmente I4 sobre la misma rama estable, commit/push/PR y merge humano. Continúan pendientes la matriz física iPhone/Safari + Android/Chrome y HTTPS de candidata; I4 no se completa ni se inicia I5 sin esa evidencia. El alcance no crea infraestructura ni publica borradores. Informe de implementación/evidencia en la [sección I4](../reports/pb01/execution.md#i4--imagen-y-exportaciones).

## Preparación local de I5 — 2026-11-17

El propietario confirma el merge de PR #23 y solicita comenzar la siguiente iteración. Se adelanta el acabado/revisión aislados de I5 en la misma rama, con commits PB-01/I5 y entrega por PR. Esta indicación no se registra como prueba física ni aceptación de I4. La tarea 4 queda autorizada después mediante «Autorizar el registro en la rama candidata». Se aplican registro/rutas reales, fecha prevista 2026-11-17 y pruebas conservando el caso vacío; capturas y evidencia están en el [informe I5](../reports/pb01/execution.md#i5--identidad-e-integración). I6 sin iniciar.

## Incorporación autorizada de I5 — 2026-11-17

Tras revisar la propuesta concreta de PR #24, el propietario responde «Autorizar el registro en la rama candidata». Queda satisfecho el permiso de I5/tarea 4: descriptor published con fecha prevista 2026-11-17 y loader perezoso, catálogo/rutas reales ES/EN y pruebas/mediciones del build. Se mantienen el merge manual, las pruebas físicas de I4, revisión visual/manual y cierre global I6. No es autorización de despliegue por el agente o de infraestructura nueva.
