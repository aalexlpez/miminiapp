# Decisiones técnicas

## Propósito

Registrar las propuestas y decisiones técnicas duraderas que condicionan el proyecto. Las decisiones sobre el gobierno del template se registran en `docs/harness-decisions.md` y no forman parte de este índice. Los detalles locales o mecánicos cubiertos por decisiones existentes no necesitan registrarse aquí.

## Estados

* `Propuesta`: alternativa pendiente de decisión; no autoriza implementación.
* `Aprobada`: decisión aprobada expresamente por el responsable.
* `Rechazada`: propuesta descartada que se conserva cuando su contexto sigue siendo útil.
* `Sustituida`: decisión anteriormente aprobada que ha sido reemplazada por otra.

Solo el responsable puede aprobar una decisión. Codex puede investigar, redactar propuestas y registrar el cambio de estado después de recibir una indicación explícita. La existencia de un documento o de una entrada en este índice no implica aprobación.

Cada entrada debe indicar su estado, el responsable de aprobación y enlazar la documentación necesaria para comprender la decisión y su alcance. Todo cambio desde `Propuesta` debe registrar la fecha y el responsable que lo decidió. Solo se crea documentación separada cuando la decisión deba mantenerse como conocimiento del proyecto.

## Cuándo registrar una decisión

Registra una elección como decisión técnica cuando al menos una de sus alternativas razonables:

* condiciona más de una tarea o componente futuro;
* establece o cambia un contrato compartido o externo;
* incorpora, sustituye o elimina una tecnología, dependencia o servicio relevante;
* afecta a persistencia, migraciones, seguridad, permisos, despliegue o compatibilidad;
* establece un invariante que otras implementaciones deberán respetar;
* tiene un coste de reversión o migración material.

No necesita registrarse como decisión técnica una elección local cuando esté cubierta por decisiones o convenciones aprobadas, no cambie contratos ni comportamiento externo y pueda corregirse sin consecuencias duraderas.

Como regla de desempate, si dos alternativas razonables producirían consecuencias duraderas diferentes para trabajo posterior, trátala como decisión técnica. Si la diferencia es local, mecánica y no condiciona trabajo futuro, resuélvela durante la implementación.

Que una elección sea sencilla o reversible no evita registrarla cuando establece una convención o contrato duradero. Ante una duda que pueda cambiar materialmente el resultado, Codex prepara una propuesta y detiene solo el trabajo afectado hasta recibir una decisión; el trabajo independiente ya autorizado puede continuar.

## Registro

Actualmente no hay propuestas ni decisiones técnicas del proyecto registradas.
