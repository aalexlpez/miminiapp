# MiMiniApp — definición del producto

**Nombre:** MiMiniApp (provisional).
**Fase:** Definición.
**Estado de la definición:** Borrador.
**Responsable de aprobación:** Propietario de MiMiniApp (rol; identidad personal pendiente de registrar).
**Última actualización:** 2026-11-04.

## Procedencia y alcance de esta definición

Traslado documental del [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), secciones 4 y 6. El dossier reporta requisitos ya acordados y propuestas abiertas; se conserva esa distinción como evidencia aportada. Esta definición continúa en `Borrador`: incorporar el archivo no constituye aprobación del producto, de las decisiones técnicas ni autorización de implementación. La [auditoría de preparación](../onboarding-audit.md) distingue lo comprobado de lo pendiente.

## Propósito

Construir una plataforma web pública y bilingüe con una colección creciente de **miniapps**: calculadoras, utilidades de trabajo, herramientas cotidianas, experimentos científicos, juegos y experiencias interactivas, sin limitarse a un nicho.

Sostener un ciclo de producto y contenido audiovisual: aproximadamente una miniapp nueva por semana, un vídeo principal y una o dos piezas adicionales para TikTok, Instagram Reels y YouTube Shorts. La herramienta debe conservar utilidad y fiabilidad después de la grabación. El ritmo es orientativo y nunca justifica publicar defectos conocidos.

## Usuarios y contexto

Público general, con acceso móvil esperado desde redes sociales. El escritorio es una experiencia de primera clase, especialmente para productividad. La disponibilidad estimada del propietario es de 11–15 horas semanales para programación, pruebas, guion, grabación, edición y comunidad.

## Resultado esperado

Un catálogo navegable en español e inglés, con URLs propias y compartibles para cada miniapp publicada. Cada herramienta debe ofrecer un resultado correcto, explicable y demostrable, con un ejemplo reproducible y restablecimiento rápido cuando proceda.

Durante desarrollo el catálogo puede estar vacío, sin anunciar herramientas inexistentes. El objetivo de lanzamiento requiere al menos una miniapp real validada; su identidad y el número final de miniapps iniciales siguen abiertos. **No se selecciona ni se desarrolla aquí la primera miniapp.**

## Alcance inicial

Requisitos que el dossier presenta como decididos, pendientes de aprobación canónica de esta definición:

| ID | Requisito trasladado |
| --- | --- |
| PROD-01 | Catálogo público y enlace estable por miniapp. |
| PROD-02 | Libertad temática, equilibrando utilidad y atractivo audiovisual. |
| PROD-03 | Español e inglés completos desde lanzamiento, incluidos errores y metadatos. |
| PROD-04 | Sin cuentas, registro, sesiones de producto ni suscripciones iniciales. |
| PROD-05 | Sin backend, base de datos ni servicios externos por defecto. |
| PROD-06 | Persistencia local opcional en el dispositivo, sin sincronización. |
| PROD-07 | Cualquier API, almacenamiento remoto o servidor se evalúa y aprueba por separado. |
| PROD-08 | Ejemplos demostrables y reproducibles, con restablecimiento rápido. |
| PROD-09 | Diseño mobile-first y experiencia de escritorio cuidada. |
| PROD-10 | Objetivo de repositorio público y contribuciones por PR, con integración por mantenedores. La visibilidad actual no se ha verificado. |
| PROD-11 | Sugerencias iniciales por comentarios en redes y gestión manual. |
| PROD-12 | Posible evolución a monetización/SaaS, sin construir ahora esa infraestructura. |
| PROD-13 | Lanzamiento condicionado por calidad; cantidad inicial sin cerrar. |
| PROD-14 | Primera miniapp aplazada expresamente. |

El MVP propuesto comprende portada, catálogo, páginas por miniapp, contenido y metadatos ES/EN, selector de idioma, interfaz responsive, ejemplos de demostración y enlaces reales a redes/GitHub. Prefijos `/es/` y `/en/`, rutas canónicas y `hreflang` son la propuesta técnica por concretar en el [registro de decisiones](../design-docs/index.md).

Quedan fuera perfiles, login, pagos, administración, votaciones, formularios internos de ideas, backend, bases de datos, notificaciones, IA como servicio, sincronización, recomendaciones, APIs con claves privadas, seguimiento individual y comentarios propios.

## Criterios observables del producto

| ID | Resultado esperado para la implementación futura |
| --- | --- |
| CAT-01 | Portada con descripción veraz y acceso al catálogo y herramientas que existan. |
| CAT-02 | Acceso directo ES/EN y cambio de idioma conservando la miniapp equivalente. |
| CAT-03 | URLs estables, metadatos traducidos y 404 real para slugs inexistentes. |
| CAT-04 | Los borradores no aparecen en catálogo, navegación pública ni sitemap. |
| CAT-05 | Funciones esenciales sin cuenta, pago ni envío de datos al servidor. |
| CAT-06 | Móvil y escritorio utilizables, sin recortes ni scroll horizontal accidental. |
| CAT-07 | Objetivo de catálogo estático generado en build, sujeto a la decisión técnica correspondiente. |
| CAT-08 | Enlaces reales a GitHub/redes; sin simular comunidad o funciones inexistentes. |

Cada miniapp se definirá con la [ficha funcional](miniapp-template.md) antes de implementar: entradas, resultados esperados independientes, errores, límites, privacidad, idiomas, demo, pruebas y exclusiones. El diseño debe permitir grabar una interacción auténtica y legible en vertical sin convertir la web en una interfaz exclusiva para vídeo. El equipo de grabación no pertenece al runtime.

Añadir o corregir una miniapp no debe romper las existentes ni exigir alterar sus cálculos. Esa independencia funcional se demostrará con las regresiones pertinentes, además de la separación estructural de módulos.

## Restricciones conocidas

No se adoptan tecnologías, servicios o automatizaciones por trasladar estos requisitos. Las excepciones al procesamiento local y los cambios de alcance requieren la decisión y autorización correspondientes. Marca y dominio son provisionales; `miminiapp.com` no implica propiedad ni disponibilidad.

La política de pruebas y los controles de seguridad propuestos se detallan en [calidad](../QUALITY_SCORE.md), [frontend](../FRONTEND.md), [seguridad](../SECURITY.md) y [fiabilidad](../RELIABILITY.md). Son criterios de trabajo futuros, no capacidades ya implementadas ni certificaciones.

## Cuestiones pendientes

* Aprobar esta definición e identificar nominalmente al propietario cuando corresponda.
* Formalizar las decisiones técnicas y aprobar/autorizar cada iteración por separado.
* Elegir más adelante la primera miniapp y la cantidad de lanzamiento; no bloquea la preparación documental.
* Resolver licencia y titularidad antes de presentar el producto como software con licencia abierta.
* Confirmar marca, redes y dominio; compra y DNS requieren instrucción expresa.
* Decidir si habrá analítica, qué datos trataría y sus implicaciones de privacidad; no activar trackers por defecto.
* Concretar versiones, pruebas, navegadores, política de dependencias y CI/CD mediante decisiones y planes propios.
* Provisionar accesos Cloudflare/GitHub con mínimo privilegio cuando se autorice infraestructura.
* Skills aplazadas al final, como [tarea pendiente](../exec-plans/tech-debt-tracker.md); no son requisito para esta preparación documental.

## Criterios para aprobar la definición

La definición está preparada para aprobación cuando:

* identifica al responsable de aprobación;
* expresa el propósito, los usuarios y un resultado observable;
* delimita el alcance inicial y las exclusiones que puedan evitar interpretaciones materiales distintas;
* registra las restricciones conocidas;
* resuelve las cuestiones que podrían cambiar el resultado, el alcance o los criterios de aceptación, o documenta explícitamente por qué pueden aplazarse;
* permite reconocer mediante evidencia si el primer resultado útil cumple lo esperado.

No es necesario decidir durante la definición el stack, la arquitectura ni los detalles locales de implementación. Como regla de desempate, existe información suficiente cuando dos equipos razonables podrían proponer soluciones distintas en sus detalles, pero coincidirían en el resultado esperado, sus límites y la forma de aceptarlo.

## Estado de las decisiones

Consulta el [registro técnico](../design-docs/index.md). Ninguna entrada se declara aprobada por la sola recepción del dossier.

## Plan de trabajo

Consulta [PLANS.md](../PLANS.md), el [roadmap informativo](../roadmap.md) y los [planes activos](../exec-plans/active/). El roadmap no autoriza su ejecución.

La definición se completará a partir de la información proporcionada y de la investigación autorizada. No se elegirán tecnologías ni se iniciará implementación por el mero hecho de crear esta instancia.

La definición solo se considera aprobada tras una indicación expresa del responsable, que se refleja cambiando `Estado de la definición` a `Aprobada`. Su aprobación no aprueba decisiones técnicas, planes ni autoriza implementación.
