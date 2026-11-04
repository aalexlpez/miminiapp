# Activación de un nuevo proyecto

## Propósito

Convertir una copia de este template en un proyecto definido y en un entorno que Codex pueda preparar, ejecutar, observar y verificar de forma reproducible. Este procedimiento no autoriza decisiones técnicas, implementación ni automatizaciones.

La activación se completa de forma progresiva. No se crean herramientas, documentos o configuraciones que todavía no respondan a una necesidad real del proyecto.

## 1. Crear la instancia

* Copia el template y establece la nueva carpeta como raíz principal del proyecto.
* Conserva el historial Git del template o, si la copia no lo incluye, solicita autorización para inicializar Git y crear un commit que represente el estado inicial antes de desarrollar.
* Confirma que Codex detecta el `AGENTS.md` global y el del proyecto desde esa raíz.
* Comprueba qué skills y herramientas están realmente disponibles. No supongas capacidades que el entorno no muestre.

En la configuración prevista para este harness deben estar disponibles `fix-bug`, `implement-feature`, `review-change` y, cuando exista frontend, `frontend-design`, o procedimientos equivalentes. No copies sus instrucciones dentro del repositorio. Si falta una capacidad necesaria para el equipo, resuélvelo como parte de la preparación del entorno antes de depender de ella.

## 2. Definir el proyecto

Completa progresivamente `docs/product-specs/index.md` con el propósito, los usuarios, el resultado esperado, el alcance, las restricciones y las cuestiones pendientes. Investiga antes de preguntar, pero no adoptes decisiones técnicas durante esta etapa.

Aplica los criterios y registra la aprobación de la definición en `docs/product-specs/index.md`. Esa aprobación no aprueba decisiones técnicas, planes ni implementación.

## 3. Investigar y aprobar decisiones

Identifica, conforme a los criterios de `docs/design-docs/index.md`, solo las decisiones técnicas necesarias para planificar el primer resultado útil. Según el proyecto pueden incluir stack, versiones, estructura, persistencia, dependencias relevantes, estrategia de pruebas, seguridad o despliegue.

Registra allí las alternativas, el responsable y el estado. No anticipes decisiones que todavía no condicionen el trabajo.

## 4. Preparar el ExecPlan inicial

El ExecPlan inicial debe cubrir el menor resultado coherente que permita comenzar el proyecto y demostrar que funciona. Además del producto, debe incluir las capacidades necesarias para que Codex pueda trabajar con evidencia:

* scaffolding y configuración mínima;
* comandos de instalación, ejecución, pruebas, análisis estático y build que sean aplicables;
* variables de entorno documentadas sin versionar secretos;
* datos de prueba, fixtures, seeds, mocks o mecanismos de reset cuando sean necesarios;
* acceso a la salida funcional, errores y logs;
* inspección visual o mediante navegador cuando exista interfaz;
* verificaciones observables y criterios de aceptación.

Primero se aprueba el plan. La ejecución comienza únicamente después de una autorización expresa separada, conforme a `docs/PLANS.md`.

## 5. Construir el entorno autorizado

Durante la ejecución del plan inicial, utiliza primero las herramientas estándar del stack aprobado. No añadas una dependencia o integración solo para Codex si un comando existente ofrece la misma señal de forma clara.

Cuando los comandos reales sean estables, puede proponerse una configuración local de Codex en `.codex/` con el setup de worktrees y acciones frecuentes. Como esos scripts pueden ejecutarse automáticamente, su creación y activación requieren aprobación. Nunca incluyas secretos reales en el repositorio ni en configuraciones compartidas.

Usa worktrees cuando aporten aislamiento útil y exista un commit base válido. Si un worktree necesita archivos locales ignorados, define explícitamente qué archivos seguros deben copiarse; no utilices este mecanismo para versionar secretos.

Una skill local al repositorio puede proponerse cuando un flujo específico del proyecto sea repetido, estable y útil para el equipo, pero requiere aprobación antes de incorporarse. Los procedimientos genéricos deben permanecer en las skills globales para evitar duplicación entre proyectos.

## 6. Verificar la preparación

Antes de dar por activado el proyecto, comprueba desde un checkout o worktree limpio todo lo que resulte aplicable:

* el setup termina correctamente;
* la aplicación o servicio arranca;
* las pruebas y comprobaciones técnicas se ejecutan;
* Codex puede observar el comportamiento que debe validar;
* los errores y logs relevantes son accesibles;
* los datos de prueba pueden prepararse y restablecerse;
* los comandos y requisitos necesarios están registrados en el repositorio;
* no se depende de instrucciones esenciales conservadas únicamente en una conversación o en la memoria de una persona.

Distingue entre capacidades verificadas, inferidas y no comprobadas. Una limitación material impide declarar completada la activación hasta resolverla o aceptarla expresamente.

## 7. Trabajar y entregar

Una vez aceptado el resultado del plan inicial, gestiona cada petición conforme a su naturaleza y a las skills disponibles. Carga solo el contexto relevante, crea un ExecPlan cuando el riesgo o alcance lo justifique, solicita aprobación para nuevas decisiones técnicas y verifica mediante señales observables.

Después de implementar un cambio no trivial, revisa su delta de forma separada. La entrega termina cuando el resultado verificado es aceptado; entonces el ExecPlan puede pasar a `docs/exec-plans/completed/`.

## 8. Mejorar el harness con evidencia

Cuando Codex no pueda ejecutar, observar o verificar una tarea, identifica la capacidad concreta que falta. Registra el problema en el plan activo y propone la mejora mínima: documentación, comando, script, prueba, skill, acceso a logs u otra herramienta.

Promueve una regla documental a una comprobación mecánica solo cuando sea un invariante aprobado y exista evidencia de que la automatización aporta valor. Las tareas recurrentes, revisiones automáticas, controles de arquitectura, publicación y despliegue permanecen desactivados hasta recibir aprobación expresa.
