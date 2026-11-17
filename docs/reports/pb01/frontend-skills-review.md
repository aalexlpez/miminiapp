# Plan B — revisión UX e investigación de skills frontend

**Fecha:** 2026-11-17. **Autor:** Codex. **Responsable de selección e incorporación:** propietario de MiMiniApp.
**Estado:** investigación realizada. FE-01 aprobado con I1 autorizada el 2026-11-17; las propuestas de estándar/selección se preparan para revisión y las skills siguen sin instalar/activar. Este informe conserva la investigación previa, no declara aceptación visual o autorización de rediseño.

## Conclusión

La base funcional está desarrollada, pero su acabado no satisface la experiencia que el propietario busca. Una batería automatizada satisfactoria no acredita claridad para una persona nueva, atractivo visual o completar la tarea en dos minutos. La revisión previa debió distinguir esos resultados con más exigencia visual.

Recomiendo **Impeccable como ayuda principal de diseño y crítica**, complementada por **Web Design Guidelines de Vercel para revisión de implementación**. La skill frontend-design de Anthropic es una alternativa ligera a Impeccable; no instalaría las dos como directores visuales simultáneos. UI UX Pro Max queda como referencia secundaria, sin incorporar su catálogo completo en esta primera mejora.

## Contraste con nuestro producto y código

Se consultan la [ficha v06](../../product-specs/plan-b.md), [App.tsx](../../../src/miniapps/plan-b/App.tsx), [CSS del módulo](../../../src/miniapps/plan-b/app.css), [generador de fondos](../../../src/miniapps/plan-b/browser/wallpaper.ts), [ruta compartida](../../../src/pages/[locale]/apps/[slug].astro) y las [capturas I5 y su manifiesto](../../review/pb01-i5/manifest.json). Se revisan visualmente es-light-half.png y en-dark-result.png. Son capturas históricas identificadas, no una nueva prueba física ni una sesión cronometrada.

| Observación | Evidencia y consecuencia |
| --- | --- |
| Existe un wizard técnico, pero no una experiencia suficientemente guiada | El paso plan reúne situación, acción, dos grupos de sugerencias, hora, días, ayuda y navegación. El cambio de estado no reduce la carga de ese paso. La captura móvil del formulario mide 393×1817 y la del resultado 393×2630; estas dimensiones de página completa no representan el viewport ni una medición del escritorio del propietario. |
| La composición deja tarde la interacción principal | Cabecera y presentación preceden al panel; después se apilan campos y ayudas. Hay que revisar el espacio disponible, teclado y posición de la acción principal, no resolverlo ocultando el overflow. |
| El movimiento existente no guía el recorrido | Hay transición de gris y llegada del sello. Falta continuidad perceptible entre decisiones, estados y resultado; añadir animación a cada tarjeta no arreglaría esa estructura. |
| Las sugerencias y textos compiten con las decisiones | Repetir botones, ayudas y avisos con peso similar obliga a explorar antes de entender qué hacer. Hace falta jerarquía, ejemplos contextuales y mostrar información cuando sea útil. |
| La exportación actual es deliberadamente simple | El canvas pinta fondo sólido, etiqueta y frase centrada. Es un PNG estático para bloqueo; una imagen estática puede tener dirección artística, composición y tipografía mucho más cuidadas. La ficha fija dimensiones, zona legible y privacidad, pero no obliga a ese acabado genérico. |
| La ficha también necesita evolucionar | Prescribe tres pasos, agrupa hora/días con las frases, fija una columna estrecha y ordena primero calendario en el resultado. Separar esa configuración del recorrido principal o cambiar la composición requiere registrar la actualización del contrato antes de implementarla. |
| «2 minutos» es una promesa pendiente de comprobar | No hay evidencia de personas nuevas completando su propio plan en ese tiempo. La velocidad de los E2E o del ejemplo precargado no demuestra ese resultado. |

No hay medición de retención. Para una herramienta de una sesión, las primeras señales útiles son comprensión, finalización sin ayuda y valor del resultado guardado. No se propone introducir cuentas, gamificación, analítica o avisos para justificar la mejora visual.

## Candidatas examinadas en sus fuentes originales

Se leen los SKILL.md publicados, README y licencias disponibles, con revisiones fijadas. No se elige por estrellas o por la promesa comercial del catálogo.

| Candidata | Qué aporta aquí | Límite y recomendación |
| --- | --- | --- |
| [Impeccable](https://github.com/pbakaus/impeccable) | Playbooks de shape, critique, onboard, distill, clarify, layout, animate, polish y audit; distingue una herramienta orientada a completar una tarea de una página promocional. | Mejor ajuste a los problemas observados. Su versión actual incluye motor ejecutable y contexto propio: necesita integración explícita con las fuentes del repo, no instalar un SKILL.md aislado y afirmar que ya funciona. |
| [frontend-design, Anthropic](https://github.com/anthropics/skills/tree/e4bb5d960d87126ff3b3a8af1a104b7db67560ba/skills/frontend-design) | Dirección visual, tipografía, contenido, alternativas de composición y autocrítica; combate el uso automático de tarjetas y tratamientos repetidos. | Alternativa sencilla: dos archivos, instrucciones y licencia. Tiene menos estructura para revisar un recorrido completo que Impeccable. No combina ambas direcciones por defecto. |
| [web-design-guidelines, Vercel](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/web-design-guidelines) | Revisión concreta de formularios, foco, movimiento, contenido y rendimiento contra sus [reglas de interfaz](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). | Complemento técnico, no dirección artística ni prueba de usabilidad. Algunas recomendaciones generales, como truncar texto o no bloquear pegado, deben contrastarse con nuestro contrato de texto literal; no aplicarlas mecánicamente. |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Catálogo consultable de patrones, tipografía, interacción y guías por stack, con búsqueda local Python. | Útil como consulta puntual; no prioritaria para un producto con identidad ya aprobada. Generar otro sistema de diseño desde una categoría puede volver a producir una solución genérica y duplicar nuestras fuentes. |

Referencias concretas inspeccionadas:

| Fuente | SHA fijado | Licencia observada |
| --- | --- | --- |
| pbakaus/impeccable, skill 4.9.2 | d41d9860b0094dcb68030657da63461212835aaa | Apache-2.0 en LICENSE; NOTICE.md conserva atribuciones de referencias de plataforma. |
| anthropics/skills | e4bb5d960d87126ff3b3a8af1a104b7db67560ba | Apache-2.0 en skills/frontend-design/LICENSE.txt. Se comprueba la licencia de esa skill, no se presume una licencia única para todo el repositorio. |
| vercel-labs/agent-skills | 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62 | README declara MIT; el árbol consultado no contiene un LICENSE independiente. Conservar procedencia y resolver el aviso aplicable al preparar una copia distribuida. |
| nextlevelbuilder/ui-ux-pro-max-skill | e59ff376a41f7ca47b7541ad5c116495cbade3ee | MIT en LICENSE. |

Impeccable: se leen el SKILL.md, los playbooks shape/critique/operate/onboard/animate/polish/clarify/distill, el launcher, sus checksums y partes del código de contexto/configuración/telemetría. El directorio de skill tiene **69 archivos y 2307861 bytes**, incluyendo herramientas y datos; ese tamaño es material de desarrollo, no bundle de la miniapp. No se ha auditado completamente el motor, ejecutado su binario ni probado su integración. No se presenta esta lectura como certificación de seguridad o eficacia.

Su launcher puede descargar un motor de versión fijada y verificar checksums. La configuración contempla telemetría, desactivable mediante IMPECCABLE_NO_TELEMETRY=1 o telemetry=false; el código aclara que desactivar telemetría no elimina las peticiones del catálogo de propuestas visuales. No activar esos servicios por accidente ni enviar textos de usuarios. El análisis presente solo descarga fuentes públicas para lectura; no ejecuta instaladores ni scripts de las candidatas.

## Compatibilidad con el proyecto — contraste explícito

El contraste documental y de código identifica encaje y conflictos; no acredita instalación o ejecución satisfactoria. Las reglas completas de Vercel se vuelven a consultar en la revisión [434b7f91364665f2f733b310ec54809bf8f37937](https://github.com/vercel-labs/web-interface-guidelines/blob/434b7f91364665f2f733b310ec54809bf8f37937/command.md). Ese contenido es una entrada externa de revisión, no una nueva norma del proyecto.

| Área | Encaje / choque concreto | Tratamiento propuesto |
| --- | --- | --- |
| Stack y entrega | Las guías de diseño no exigen migrar Astro/React/Tailwind ni alojarse en Vercel. El motor local de Impeccable sí añade tooling de desarrollo. | Mantener stack, package/lockfile, Cloudflare y presupuestos del producto. Verificar por separado el tooling elegido antes de afirmar compatibilidad operativa. |
| Autoridad documental | Impeccable usa PRODUCT.md, DESIGN.md y documentos de superficie; el repo ya tiene ficha, decisiones, arquitectura, estándares y ExecPlan canónicos. | Adaptar las instrucciones para consultar las fuentes existentes y evitar autoridades paralelas; no ejecutar init/document sobre el proyecto por defecto. |
| Identidad y alcance | Una skill puede proponer otras fuentes, paletas, tokens, dependencias o patrones; ya tenemos Laboratorio creativo, fuentes locales, claro/oscuro y límites modulares aprobados. | Evaluar alternativas dentro de esa identidad. Ninguna recomendación externa autoriza cambios globales o nuevas librerías; una ampliación se tramita en su fuente correspondiente. |
| Texto literal y pegado | Vercel prohíbe bloquear pegado; Plan B rechaza expresamente saltos de línea pegados y muestra error. También propone truncado/line-clamp/break-words como alternativas para textos largos. | Registrar la excepción de pegado vigente. Elegir ajuste de texto compatible, no truncar el plan. No aplicar una corrección automática que incumpla la ficha. |
| Movimiento | Vercel pide detener bucles decorativos con reduced-motion y limitar animaciones a transform/opacity. La enmienda ADR-MMA-018 del 2026-11-10 mantiene activo el hero con pausa manual; Plan B aprueba transición de gris con filter. | Identificar las diferencias y su coste, sin revertir decisiones por seguir la checklist. Conservar las reglas de reduced-motion propias de Plan B; cambiar el hero o su política exigiría una decisión explícita. |
| Ejecución y red | Impeccable tiene descarga de motor, configuración, telemetría y funciones de catálogo remoto. Su propuesta de hooks y revisión con subagentes no está autorizada por investigar skills. | Uso manual y acotado, telemetría desactivada y sin hooks; controlar solicitudes del catálogo aparte del opt-out. No activar delegación ni servicios por inferencia. |
| Reproducibilidad | Fijar el paquete Vercel no fija las reglas que descarga desde main en cada uso. | Registrar el SHA/contenido de reglas realmente empleado, junto al candidato revisado y las excepciones de contrato. |
| Clientes del agente | Una ruta documentada para Codex no demuestra carga efectiva en esta sesión, Claude Code o Gemini CLI. | Prueba de descubrimiento y uso en cada cliente que se vaya a utilizar. Sigue pendiente, como la prueba funcional del motor de Impeccable. |

La recomendación es una incorporación adaptada y comprobable. Instalar las versiones originales y aplicar todas sus instrucciones literalmente no está validado y produciría conflictos con el proyecto actual.

## Propuesta concreta de incorporación

Ubicación prevista para Codex: `.agents/skills/impeccable/` y `.agents/skills/web-design-guidelines/` dentro de este repositorio. [La documentación de Codex](https://learn.chatgpt.com/docs/build-skills#where-codex-loads-local-skills) admite skills de repositorio en `.agents/skills`, con descubrimiento por su nombre y descripción. Esto no acredita que esta sesión o Claude Code/Gemini las hayan cargado: se comprobará después de incorporarlas. No instalar globalmente ni duplicar paquetes entre clientes sin comprobar sus rutas reales.

La incorporación propuesta comprende:

1. Copias fijadas de las revisiones anteriores, referencias necesarias, avisos de licencia/procedencia y un manifiesto de archivos. Actualizaciones posteriores por diff revisado; no seguir main automáticamente.
2. Adaptación mínima documentada para que las skills consulten AGENTS.md, ficha/decisiones/identidad/PB-01 y no creen PRODUCT.md o DESIGN.md como autoridades paralelas. Capturar contexto en documentos auxiliares solo si aporta algo y enlazando sus fuentes canónicas.
3. Uso manual de los playbooks pertinentes. Sin hooks, chequeos al guardar, plugins de editor, cambios de CI, servicios visuales o instalaciones npm del producto. La carga del motor de desarrollo, si se necesita para una función escogida, se verifica por versión/checksum, con telemetría desactivada y caché local controlada; no es una dependencia del frontend.
4. No activar subagentes por instalar una skill. El playbook critique incluye un permiso específico de Codex para delegar: esa decisión no se presupone por la solicitud de investigar skills. Si se usa una revisión en un único contexto, identificarla como tal y no afirmar independencia.
5. Verificar lectura efectiva y un caso acotado sobre el recorrido actual, sin editar producto como efecto de esa prueba; documentar carga, referencias, solicitudes/archivos creados y limitaciones. Mantener la ruta sin skills.

Para Vercel, la skill original solicita reglas frescas en cada revisión. Se registra la revisión o contenido realmente consultado en la evidencia de cada uso; fijar el SKILL.md no fija por sí solo esas reglas remotas. Las fuentes externas ayudan a revisar, no cambian el contrato de producto ni autorizan dependencias/infraestructura.

La autorización de esta investigación cubría preparar la propuesta. Posteriormente se aprueba FE-01 y se autoriza I1, que concreta selección/permisos antes de instalar herramientas en I2. [H-002](../../harness-decisions.md#h-002--adaptación-documental-de-la-instancia-miminiapp) reserva alcance, revisión y autorización propios para incorporar skills. La selección pendiente se presenta al propietario con esta propuesta concreta; no se declara aprobada por inferencia de «Supongo que puedes instalar skills en el proyecto».

## Unión de estándares — propuesta de adopción

Esta sección responde a la consulta posterior del propietario sobre cómo unir Vercel, Impeccable y el marco actual. La propuesta se concreta ahora en I1 de FE-01 para revisión; no instala herramientas ni cambia todavía las normas vigentes.

### Una fuente de calidad y funciones distintas para las ayudas

El estándar operativo propio se mantendría en [FRONTEND.md](../../standards/FRONTEND.md), con criterios de experiencia, diseño, interacción y accesibilidad. [QUALITY_SCORE.md](../../standards/QUALITY_SCORE.md) conservaría el procedimiento de evidencia y verificación, enlazando esos criterios. Las fichas definen el comportamiento de cada producto; identidad/tokens y decisiones técnicas conservan sus fuentes actuales. Las skills consultarían ese contexto mediante una adaptación pequeña, versionada y visible.

| Aporte | Función dentro del flujo común | Resultado revisable |
| --- | --- | --- |
| Proyecto / propietario | Objetivo del usuario, alcance, identidad, restricciones y aceptación | Brief concreto con fuentes canónicas y resultado esperado. |
| Impeccable | Investigar la experiencia, proponer composición, criticar, simplificar y afinar interacción/acabado | Flujo, alternativas visibles, justificación y revisión del resultado renderizado. |
| Vercel | Comprobar detalles de implementación, formularios, accesibilidad, movimiento y rendimiento | Hallazgos sobre archivos/candidato identificados, con reglas aplicadas y excepciones justificadas. |
| Toolchain existente | Tipos, lógica, componentes, navegador, integración y publicación con identidad | Resultados de los comandos ya aprobados y evidencia del candidato exacto. |
| Revisión humana / uso observado | Evaluar comprensión, valor del resultado, dirección visual y operaciones reales | Observaciones y aceptación explícita; no se infieren de un score o CI verde. |

La unión es de prácticas y criterios con una autoridad clara. No exige concatenar todas las instrucciones o convertir cada recomendación externa en obligación universal. Se usaría una herramienta de dirección visual y una de revisión técnica, con cargas de referencias ajustadas a la tarea.

### Resolver las diferencias antes de implementarlas

Para cada regla externa relevante, registrar fuente/revisión, ámbito, razón, comportamiento esperado y forma de comprobarlo. El resultado puede ser **adoptar**, **adaptar**, **revisar una decisión propia** o **descartar por no aplicar**. Una excepción identifica motivo, alcance y condición para revisarla; no convierte automáticamente una regla antigua en la mejor opción.

Mientras se decide, las fuentes aprobadas conservan su autoridad. Si la revisión muestra que una regla nuestra perjudica la experiencia —por ejemplo, agrupar todos los controles en el tercer paso—, se propone su sustitución en la ficha y se actualizan las pruebas para verificar el nuevo comportamiento aprobado. Mantener la marca no implica conservar una composición que ya se ha rechazado.

Ejemplos de resolución: conservar el ajuste de texto completo de Plan B frente a una sugerencia de truncado; evaluar expresamente el tratamiento del pegado multilínea antes de cambiarlo; revisar la política de movimiento del hero en su propia decisión si se quiere acercarla a Vercel; adaptar las fuentes de contexto de Impeccable para leer los documentos existentes. Son decisiones separables, no un requisito de cambiar todo el proyecto para empezar.

### Exigir un resultado observable

El estándar propuesto debería pedir, para las miniapps:

* Objetivo y siguiente acción comprensibles para una persona nueva, con ayuda breve en contexto.
* Una tarea principal por pantalla o grupo coherente de decisiones; opciones secundarias reveladas cuando se necesitan.
* Jerarquía reconocible entre pregunta, entrada, sugerencia, ayuda y acción; composición deliberada en escritorio y móvil.
* Desplazamiento necesario reducido en las pantallas de referencia. Con zoom, contenido largo o teclado abierto, los controles siguen alcanzables y el foco visible; no se esconde contenido para cumplir un encuadre.
* Movimiento breve que comunique progreso, selección o cambio de estado, interrumpible y con alternativa reducida conforme al ámbito aprobado.
* Estados vacíos, error, carga, cancelación y éxito que expliquen qué hacer, manteniendo entradas y navegación cuando corresponda.
* Resultados y exportaciones tratados como piezas del producto: composición, texto real/máximo, contraste, tamaño y destino de uso revisados.
* Evidencia separada de calidad técnica, acabado visual y uso observado. Un recorrido de dos minutos se mide con personas nuevas y condiciones registradas, no con la duración del E2E.

### Adopción por iteraciones, con Plan B como piloto

La solicitud posterior de preparar un plan se concreta en el [único ExecPlan FE-01](../../exec-plans/active/FE-01-estandar-frontend-y-piloto-plan-b.md), ahora En curso con I1 autorizada, con siete iteraciones: estándar, skills, diseño, recorrido, resultado/PNG, validación de uso y regresión global. Ese archivo contiene entradas, alcance, criterios, revisión humana, rama y progreso; este informe conserva la investigación y las razones de la propuesta, sin duplicar el plan o afirmar ejecución.

La instalación se evaluará con carga y aplicación reales, y el estándar con la calidad del piloto. FE-01 define su relación con PB-01 y la reutilización de evidencia sobre el candidato final; los pendientes físicos del producto conservan su autoridad. Después se podrá reutilizar el procedimiento probado para otras miniapps.

## Cómo aplicar el criterio a la siguiente revisión de Plan B

Antes de volver a implementar, preparar un flujo y una composición visibles con los textos ES/EN reales, respetando el laboratorio creativo, sus fuentes y temas. Revisar la densidad del formulario y del resultado en lugar de maquillar la tarjeta actual.

Propuesta de experiencia para contrastar, todavía no contrato aprobado: propósito → obstáculo → frase guiada con una decisión activa por vez → resultado inmediato. Calendario y opciones de guardado se abren desde ese resultado cuando la persona los necesita. La frase se construye de forma visible y comprensible; las sugerencias ayudan sin sustituir a la decisión principal. El resultado recibe una composición propia y una vista previa cuidada del fondo.

El objetivo es evitar el desplazamiento innecesario para completar la tarea en viewports habituales. No prometer cero scroll en cualquier pantalla, con zoom o teclado abierto, ni ocultar contenido para lograrlo. Conservar foco visible, reflujo, Atrás, recuperación, texto literal y reduced-motion. [GOV.UK recomienda empezar con una cosa por página](https://design-system.service.gov.uk/patterns/question-pages/) y decidir agrupaciones con evidencia de uso; es una referencia de claridad, no una plantilla visual para copiar.

Propuesta de evaluación: personas que no conozcan la app explican qué van a conseguir y completan un plan propio sin instrucciones externas. Registrar tiempo desde Empezar hasta resultado válido, dudas, errores y ayuda necesaria; medir aparte encontrar/guardar el fondo. El objetivo de dos minutos debe contrastarse con esas observaciones y declarar tamaño de muestra/condiciones, sin convertir una mediana aislada en garantía universal.

Para el PNG, preparar alternativas de composición fieles a la marca, revisar texto máximo, fondo real bajo reloj y contraste. Una imagen estática bien diseñada sirve al destino aprobado; vídeo, fondos animados, editor o IA dentro del producto serían otro alcance. Las skills son ayudas para producir y criticar alternativas; el resultado se evalúa por lo que ve y consigue la persona.

Si se desarrolla otra revisión visual, documentar los cambios de contrato necesarios y situar su implementación antes de repetir I6. El rechazo del acabado no cancela los resultados funcionales anteriores, pero impide aceptarlos como entrega visual final. Se conserva una última regresión sobre el nuevo candidato, según H-005/PB-01.

## Trabajo realizado y límites

Investigación online y lectura de fuentes originales, licencias e instrucciones; contraste estático con código/ficha y revisión de dos capturas reales I5. Fuentes descargadas para inspección fuera de los directorios de skills activos. No se han instalado skills, ejecutado sus motores, cambiado UI/exportaciones, añadido dependencias o medido nueva usabilidad/retención. Solo se preparan este informe y enlaces/estado de investigación. Los cambios locales I6 anteriores a la desconexión se conservan sin reset ni reescritura.
