# Decisiones técnicas

## Propósito

Registrar las propuestas y decisiones técnicas duraderas que condicionan el proyecto. Las decisiones sobre el gobierno del template se registran en `docs/harness-decisions.md` y no forman parte de este índice. Los detalles locales o mecánicos cubiertos por decisiones existentes no necesitan registrarse aquí.

## Estados

* `Propuesta`: alternativa pendiente de decisión; no autoriza implementación.
* `Aprobada`: decisión aprobada expresamente por el responsable.
* `Rechazada`: propuesta descartada que se conserva cuando su contexto sigue siendo útil.
* `Sustituida`: decisión anteriormente aprobada que ha sido reemplazada por otra.

Solo el responsable puede aprobar una decisión. El agente puede investigar, redactar propuestas y registrar el cambio de estado después de recibir una indicación explícita. La existencia de un documento o de una entrada en este índice no implica aprobación.

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

Que una elección sea sencilla o reversible no evita registrarla cuando establece una convención o contrato duradero. Ante una duda que pueda cambiar materialmente el resultado, el agente prepara una propuesta y detiene solo el trabajo afectado hasta recibir una decisión; el trabajo independiente ya autorizado puede continuar.

## Registro

### Procedencia y estado de las entradas

Entradas trasladadas el **2026-11-04** desde el [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), secciones 5, 6 y 10. **Todas conservan el estado `Propuesta`**. El dossier reporta algunas decisiones como seleccionadas o acordadas, pero no se atribuye aquí una aprobación humana nueva ni se convierte la recepción del archivo en autorización para implementar.

**Responsable de aprobación de cada entrada:** propietario de MiMiniApp (rol; identidad personal pendiente de registrar). La evidencia de procedencia de la tabla permite formalizar lo ya reportado sin confundirlo con candidatos todavía abiertos. La futura aprobación debe registrar fecha y responsable en la entrada afectada.

| ID | Propuesta | Estado | Evidencia aportada y alcance pendiente | Desarrollo |
| --- | --- | --- | --- | --- |
| ADR-MMA-001 | Astro, static-first y prerender por defecto. | `Propuesta` | Dossier: seleccionada por el usuario. Faltan formalización, versión y verificación del enrutado estático. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-002 | React y TypeScript para interacción en navegador, con dominio separado de la UI. | `Propuesta` | Dossier: seleccionada. Faltan versiones y configuración; `strict` es recomendación por concretar. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-003 | Tailwind CSS, diseño mobile-first y escritorio cuidado. | `Propuesta` | Dossier: seleccionada expresamente. Faltan versión, sistema visual y alcance de componentes. | [Frontend](../FRONTEND.md) |
| ADR-MMA-004 | Cloudflare Workers Static Assets como alojamiento de salida estática. | `Propuesta` | Dossier: seleccionada expresamente. No hay infraestructura provisionada ni autorización para crearla. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-005 | Sin backend ni BD por defecto; persistencia local opcional. | `Propuesta` | Dossier: seleccionada. Cada miniapp debe justificar datos, borrado y persistencia. | [Seguridad](../SECURITY.md) |
| ADR-MMA-006 | Client-first con niveles local, API pública y backend excepcional. | `Propuesta` | Dossier: seleccionada. Niveles externos requieren evaluación y aprobación individual. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-007 | GitHub público y contribuciones por PR con revisión humana. | `Propuesta` | Dossier: seleccionada. Visibilidad, permisos y protecciones reales no se han configurado ni verificado. | [Seguridad](../SECURITY.md) |
| ADR-MMA-008 | Pruebas reproducibles en iteraciones, PR, staging y producción. | `Propuesta` | Dossier: requisito reportado como aprobado. Vitest, RTL, Playwright, axe, ESLint y Prettier son candidatos; versiones, comandos y umbrales siguen abiertos. | [Calidad](../QUALITY_SCORE.md) |
| ADR-MMA-009 | Flujo feature → staging → main, con despliegue automático y gate previo de promoción. | `Propuesta` | Dossier: flujo reportado como aprobado. GitHub Actions + Wrangler es implementación preferida por concretar, no una autorización de activación. | [Fiabilidad](../RELIABILITY.md) |
| ADR-MMA-010 | Licencia MIT. | `Propuesta` | Dossier: candidata pendiente de aprobación expresa y titularidad. No se añade licencia ni se declara el código ya licenciado. | [Definición y pendientes](../product-specs/index.md#cuestiones-pendientes) |
| ADR-MMA-011 | Registro ligero tipado y separación de módulos de miniapps. | `Propuesta` | Dossier: propuesta de diseño; contrato y rutas por evaluar, sin motor de plugins. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-012 | Posible analítica respetuosa con privacidad. | `Propuesta` | Dossier: pendiente decidir si medir y con qué; no instalar trackers ni elegir proveedor por defecto. | [Seguridad](../SECURITY.md) |
| ADR-MMA-014 | Staging permanente, público y separado de producción, con pruebas remotas previas a promoción. | `Propuesta` | Dossier: requisito reportado como aprobado. Nombres, URLs, credenciales y equivalencia de entornos deben concretarse y verificarse. | [Fiabilidad](../RELIABILITY.md) |

El identificador **ADR-MMA-013** del dossier describe gobierno del trabajo por iteraciones. Se conserva como referencia de procedencia, sin crear una decisión técnica de producto: su destino es [PLANS.md](../PLANS.md) y el [registro del harness](../harness-decisions.md).

Las alternativas de implementación deben investigarse al formalizar cada decisión: por ejemplo, GitHub Actions + Wrangler frente a Workers Builds para un único mecanismo de despliegue, y herramientas de pruebas candidatas frente a alternativas justificadas. Una elección aún no resuelta no permite instalar ambas opciones ni ejecutar la propuesta.
