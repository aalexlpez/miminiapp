# Título del ExecPlan

> Completa solo los apartados que aporten información útil. Las reglas y estados canónicos se definen en `docs/PLANS.md`.

> Los campos adicionales de iteración forman parte de H-002, aprobada para esta instancia el 2026-11-04; no crean aprobaciones de planes ni alteran los estados existentes.

## Control

* **Estado:** `Borrador`
* **ID del plan:** ID-XX.
* **Rama de trabajo estable:** pendiente de definir; única para todas las iteraciones del plan.
* **Iteración actual:** I1 — pendiente de iniciar.
* **Responsable de aprobación:** Pendiente de definir.
* **Creado:** AAAA-MM-DD.
* **Última actualización:** AAAA-MM-DD.
* **Dependencias / bloqueos de inicio:** Otros planes aceptados y decisiones aprobadas necesarias, si aplica.

## Objetivo y resultado esperado

Pendiente de definir.

## Alcance

Pendiente de definir.

## Exclusiones relevantes

Pendiente de definir si resulta aplicable.

## Decisiones aprobadas aplicables

Pendiente de identificar.

## Cuestiones pendientes

Pendiente de identificar.

## Trabajo previsto

Dividir el resultado en iteraciones internas acotadas I1, I2, etc., con entrada, entregable observable, archivos o subsistemas previstos, pruebas y condición de salida. Declarar su orden y los puntos que requieren revisión humana. Comparten el estado, autorización y rama estable de este plan; registrar su avance en la tabla de progreso. Los commits usan `tipo(ID-PLAN/Ix): descripción en inglés`, según H-007. Solo crear planes separados si existen resultados, responsables o límites de alcance/riesgo que lo justifiquen.

La última etapa es siempre regresión y análisis. Si hay varios ExecPlans para el resultado, la última iteración revisa el conjunto frente al sistema previo; cada iteración anterior mantiene su propia verificación local.

## Entorno y herramientas

Pendiente de definir según lo necesario para preparar, ejecutar, observar, verificar y restablecer el sistema.

## Criterios de aceptación

Pendiente de definir.

## Pruebas a crear o modificar

Indica las pruebas de los criterios automatizables, o justifica que no aplica en una tarea documental.

## Verificaciones y evidencia

Comandos, directorios, resultados esperados y evidencia que se conservará. Distingue comprobaciones locales, CI, staging y producción cuando existan; no presentes comandos futuros como disponibles.

## Regresión y análisis final

* Base reproducible, identificada por commit/árbol y entorno cuando corresponda.
* Comportamientos conservados, diferencias previstas y criterios que permitirían detectar una regresión.
* Requisitos, integración y deuda/mantenibilidad; privacidad, seguridad, accesibilidad, rendimiento y recursos según relevancia.
* Hallazgos con evidencia, impacto, corrección y repetición de verificaciones sobre el candidato definitivo.
* Bloqueos y deuda residual, con responsable y aceptación explícita cuando proceda. Una comprobación esencial omitida no cuenta como aprobada.

## Riesgos y recuperación

Incluye rollback y bloqueos de release si resulta aplicable.

## Punto de parada

Entregar evidencia para aceptación humana del resultado del plan. Los otros planes dependientes esperan esa aceptación y su propia autorización. Entre iteraciones internas, avanzar cuando se cumplan las condiciones del alcance autorizado, respetando los puntos de revisión humana expresos. Si se cancela una dependencia, revisar antes el alcance con el responsable.

## Progreso

Identificar iteración actual, tareas completadas, fechas, commits/PR, evidencia y siguiente paso. Reutilizar la rama del plan tras cada entrega parcial y actualizarla desde staging antes de continuar. El avance interno no equivale a aceptación del plan completo.

| Iteración interna | Inicio | Fin | Condiciones de salida comprobadas / commits, PR y evidencia | Siguiente paso o bloqueo |
| --- | --- | --- | --- | --- |
| I1 — pendiente de iniciar | — | — | — | — |

## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| AAAA-MM-DD | `Borrador` | Agente | Creación del plan. |
