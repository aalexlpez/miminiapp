# Roadmap de MiMiniApp

**Actualizado:** 2026-11-17. **Responsable:** propietario de MiMiniApp.

Este documento orienta. No aprueba ni autoriza nada: el estado canónico de cada iteración es el de su ExecPlan, conforme a [PLANS.md](PLANS.md). No fija fechas de lanzamiento ni compromete un ritmo semanal a costa de la calidad.

## Iteraciones

Las iteraciones `I-xx` proceden del [dossier de origen](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md). Las `CP-xx` (Creative Playground) son trabajo de identidad y apariencia añadido después. `MT-xx` es mantenimiento transversal. `PB-01` contiene seis iteraciones internas para Plan B, con regresión global como última iteración. Cada ExecPlan tiene una rama estable y commits por iteración, según H-007 de PLANS.md.

| Iteración | Resultado | Estado |
| --- | --- | --- |
| [I-00](exec-plans/completed/I-00-traslado-documental.md) | Traslado documental y fuentes canónicas | Aceptado, 2026-11-04 |
| [I-01](exec-plans/completed/I-01-base-local-y-testing.md) | Base local Astro y batería de pruebas | Aceptado, 2026-11-05 |
| [I-02](exec-plans/completed/I-02-catalogo-responsive-e-i18n.md) | Catálogo modular, diseño responsive e i18n ES/EN | Aceptado, 2026-11-05 |
| [I-03](exec-plans/completed/I-03-github-actions-y-cloudflare.md) | Staging y promoción manual entre repositorios; producción en Workers Builds | Aceptado y archivado el 2026-11-16 con los nueve criterios actuales y sus limitaciones |
| [CP-01](exec-plans/completed/CP-01-creative-playground.md) | Identidad integrada y movimiento decorativo | Aceptado, 2026-11-08 |
| [CP-02](exec-plans/completed/CP-02-apariencia.md) | Apariencia clara, oscura y del sistema | Aceptado y archivado el 2026-11-16 por indicación expresa del propietario, con limitaciones registradas |
| [MT-01](exec-plans/completed/MT-01-mantenimiento-y-colaboracion.md) | Documentación al día y preparación para varios colaboradores | Aceptado, 2026-11-15 |
| [MT-02](exec-plans/completed/MT-02-organizacion-documental.md) | Organización documental, enlaces y mapa de navegación | Aceptado y archivado el 2026-11-16 tras contrastar criterios, CI y staging |
| I-05 | Flujo de contribución pública | Sin plan. Depende de decidir la licencia |
| [I-06 / PB-01](exec-plans/active/PB-01-plan-b.md) | Plan B propuesta como primera miniapp real: base, calendario, recorrido, salidas, visuales/integración y regresión global | En curso: I1 integrada mediante PR #19; I2 integrada mediante PR #20. ADR-MMA-020/021 aprobadas; I3/I4 integradas mediante PR #22/#23; I4 conserva matriz física/HTTPS pendiente. I5 implementada y registrada en la candidata con permiso expreso; revisión visual/manual y cierre físico de I4 pendientes, I6 sin iniciar |

I-04 quedó sin alcance propio: producción y el gate de promoción se incorporaron a I-03 el 2026-11-05.

## Cierres recientes

**I-03.** Aceptado expresamente por el propietario y archivado el 2026-11-16 tras verificar los nueve criterios vigentes con evidencia en origen y producción. Ya no bloquean su cierre las exigencias sustituidas de artefacto idéntico, gate antiguo y ensayo del rollback de Actions. Detalle y limitaciones en el [informe](reports/i03/contract-verification-2026-11-16.md).

**CP-02.** Aceptado por el propietario después de conocer los límites de lector de pantalla, destello del preview y revisión visual final. El plan archivado conserva esas limitaciones sin presentarlas como pruebas realizadas.

## Qué viene después

La prioridad declarada es el producto: elegir y construir la primera miniapp. El lanzamiento requiere al menos una herramienta real validada; cuántas tendrá el catálogo inicial sigue abierto.

Para las siguientes iteraciones de PB-01 quedan:

* acceso HTTPS a la candidata y dispositivos físicos para I4; selección, [ficha](product-specs/plan-b.md) y ADR-MMA-020/021 ya aprobadas;
* la licencia (ADR-MMA-010), si el repositorio va a aceptar contribuciones externas;
* la autorización de las iteraciones siguientes; la preparación local de I5 ya está solicitada, con incorporación al catálogo autorizada, conservando pendientes las pruebas físicas de I4 y revisiones manuales e I-03 aceptado.

Las skills opcionales siguen aplazadas al final, en [PEND-001](exec-plans/tech-debt-tracker.md#pend-001--skills-opcionales-al-final).
