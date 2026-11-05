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

Entradas ADR-MMA-001–012 y 014 trasladadas el **2026-11-04** desde el [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), secciones 5, 6 y 10. ADR-MMA-015 es la decisión de toolchain incorporada a partir de las preferencias del propietario para I-01, no del dossier. El propietario aprueba expresamente **ADR-MMA-001/002/003/005/006/008/015**, con las tecnologías y versiones del paquete consolidado, el **2026-11-04** mediante el Bloque B. Las otras siete entradas conservan Propuesta. La aprobación actual procede de esa indicación humana, no de la recepción del dossier, y no autoriza implementación.

**Responsable de aprobación de cada entrada:** propietario de MiMiniApp (rol identificado). La tabla conserva procedencia, fecha y actor de la aprobación actual donde corresponde; el resto sigue pendiente. El [paquete aprobado](i01-approval-proposal.md) fija las versiones y convenciones vinculadas a estas decisiones.

| ID | Decisión o propuesta | Estado | Evidencia, aprobación y alcance | Desarrollo |
| --- | --- | --- | --- | --- |
| ADR-MMA-001 | Astro, static-first y prerender por defecto. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). Astro 7.4.5 estático/prerender; sin SSR. Enrutado de catálogo fuera de I-01. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-002 | React y TypeScript para interacción en navegador, con dominio separado de la UI. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). React/DOM 19.3.1, TypeScript 6.0.3 strict y auxiliares del paquete aprobado; lógica en navegador. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-003 | Tailwind CSS, diseño mobile-first y escritorio cuidado. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). Tailwind y @tailwindcss/vite 4.3.4; móvil/escritorio. Sistema visual final fuera de I-01. | [Frontend](../FRONTEND.md) |
| ADR-MMA-004 | Cloudflare Workers Static Assets como alojamiento de salida estática. | `Propuesta` | Dossier: seleccionada expresamente. No hay infraestructura provisionada ni autorización para crearla. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-005 | Sin backend ni BD por defecto; persistencia local opcional. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). Sin backend/BD por defecto; I-01 no incorpora persistencia de usuario. Las miniapps futuras justificarán sus datos. | [Seguridad](../SECURITY.md) |
| ADR-MMA-006 | Client-first con niveles local, API pública y backend excepcional. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). Client-first; API/backend requieren excepción aprobada. I-01 es local, sin servicios ni secretos. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-007 | GitHub público y contribuciones por PR con revisión humana. | `Propuesta` | Dossier: seleccionada. Visibilidad, permisos y protecciones reales no se han configurado ni verificado. | [Seguridad](../SECURITY.md) |
| ADR-MMA-008 | Pruebas reproducibles en iteraciones, PR, staging y producción. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). Requisito de pruebas y configuración local aprobados con las versiones del paquete: Vitest/RTL/Playwright/axe/ESLint/Prettier. Chromium móvil/escritorio inicial; otros motores, CI y pruebas remotas se concretan en iteraciones posteriores. | [Calidad](../QUALITY_SCORE.md) |
| ADR-MMA-009 | Flujo feature → staging → main, con despliegue automático y gate previo de promoción. | `Propuesta` | Dossier: flujo reportado como aprobado. GitHub Actions + Wrangler es implementación preferida por concretar, no una autorización de activación. | [Fiabilidad](../RELIABILITY.md) |
| ADR-MMA-010 | Licencia MIT. | `Propuesta` | Dossier: candidata pendiente de aprobación expresa y titularidad. No se añade licencia ni se declara el código ya licenciado. | [Definición y pendientes](../product-specs/index.md#cuestiones-pendientes) |
| ADR-MMA-011 | Registro ligero tipado y separación de módulos de miniapps. | `Propuesta` | Dossier: propuesta de diseño; contrato y rutas por evaluar, sin motor de plugins. | [Arquitectura objetivo](architecture-target.md) |
| ADR-MMA-012 | Posible analítica respetuosa con privacidad. | `Propuesta` | Dossier: pendiente decidir si medir y con qué; no instalar trackers ni elegir proveedor por defecto. | [Seguridad](../SECURITY.md) |
| ADR-MMA-014 | Staging permanente, público y separado de producción, con pruebas remotas previas a promoción. | `Propuesta` | Dossier: requisito reportado como aprobado. Nombres, URLs, credenciales y equivalencia de entornos deben concretarse y verificarse. | [Fiabilidad](../RELIABILITY.md) |
| ADR-MMA-015 | Toolchain reproducible: Node.js LTS y npm, versiones directas exactas y lockfile único. | `Aprobada` | Aprobada el 2026-11-04 por el propietario de MiMiniApp (Bloque B). Node 24.22.2 LTS, npm 11.19.1, versiones directas exactas y lockfile único. Runtime exacto instalado con checksum oficial, npm install/ci y grafo sin conflictos; verificación local completa con Chromium 156.0.8078.4 / revisión 1248, sin cambiar versiones o lockfile. | [Paquete I-01](i01-approval-proposal.md) |

El identificador **ADR-MMA-013** del dossier describe gobierno del trabajo por iteraciones. Se conserva como referencia de procedencia, sin crear una decisión técnica de producto: su destino es [PLANS.md](../PLANS.md) y el [registro del harness](../harness-decisions.md).

Las alternativas de implementación deben investigarse al formalizar cada decisión: por ejemplo, GitHub Actions + Wrangler frente a Workers Builds para un único mecanismo de despliegue, y herramientas de pruebas candidatas frente a alternativas justificadas. Una elección aún no resuelta no permite instalar ambas opciones ni ejecutar la propuesta.


## Paquete aprobado de I-01

El propietario aprueba expresamente los tres bloques del [paquete consolidado](i01-approval-proposal.md) el 2026-11-04. Los estados canónicos se actualizan por esa indicación: definición Aprobada, estos siete ADR Aprobada e I-01 Aprobado. La aprobación no autorizaba por sí misma ejecución. El propietario la autoriza posteriormente de forma expresa; I-01 está ahora Aceptado y archivado por indicación expresa del propietario el 2026-11-05. En la etapa anterior al traslado autorizó un commit y push exclusivos a feature/i01-base-local-testing para continuar en otro chat, registrados en el [plan archivado](../exec-plans/completed/I-01-base-local-y-testing.md). El permiso de traslado no aceptaba la iteración; la aceptación actual se registra por separado y permite preparar únicamente el borrador de I-02, sin implementarlo.

Para I-01 son necesarios **ADR-MMA-001/002/003/005/006/008 y 015**. Astro/React/TypeScript/Tailwind, client-first y la exigencia de pruebas ya proceden de elecciones del propietario; versiones, npm, integraciones, runners/configuración y política local son concreciones nuevas ahora aprobadas dentro del Bloque B. Chromium móvil/escritorio es el límite inicial indicado ahora por el propietario; la ampliación futura a otros motores queda diferida y documentada, no ejecutada.

El resto de ADR conserva sus pendientes y no se necesita aprobar o configurar infraestructura para esta base local. Las verificaciones de metadatos no equivalen a instalación, build o ejecución de tests.


### Condición de compatibilidad y ajustes aprobada por el propietario

La compatibilidad real deberá verificarse durante la implementación autorizada mediante instalación, tipos, lint, pruebas y build; las consultas de metadatos no la acreditan. Ante una incompatibilidad concreta, documentar el problema y proponer el ajuste mínimo compatible. Solo podrán aplicarse ajustes mecánicos cubiertos por los ADR aprobados y dentro de una ejecución autorizada, registrando el cambio y repitiendo las verificaciones afectadas. Todo cambio material de tecnología, arquitectura o alcance requiere nueva aprobación antes del trabajo afectado. Esta condición no amplía la autorización ya recibida para I-01 ni permite forzar peers, desactivar verificaciones o ampliar su alcance.


### Evidencia de implementación local I-01

La autorización posterior del propietario se registra en el plan, con transiciones Autorizado y En curso. Las versiones directas aprobadas se mantienen. Se han ejecutado instalación, reproducción de lockfile, tipos, lint, formato, 14 unitarias, 9 componentes y build, correctamente. El [informe](../i01-execution-report.md) registra la instalación oficial de Chromium 156.0.8078.4 / revisión 1248, verify exit 0 con 14+9+8 pruebas sin omisiones y revisión asistida de teclado/foco y aspecto responsive. I-01 fue verificado por Codex y Aceptado por el propietario el 2026-11-05; los bloqueos y diagnósticos Chromium 155 se conservan como historia.

Ajustes mecánicos sin cambio de ADR o versiones: SubmitEvent sustituye al tipo obsoleto FormEvent en React 19.3; dev/preview añaden --ignore-lock, opción documentada de Astro 7 para controlar el proceso en primer plano bajo agentes; la página evita una petición favicon.ico 404 con data:,. No se cambian aserciones para ocultar errores ni se desactivan comprobaciones.
