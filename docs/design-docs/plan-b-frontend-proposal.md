# ADR-MMA-023 — Recorrido y composición de Plan B

**Estado:** `Propuesta`, preparada en FE-01/I3 el 2026-11-17. **Responsable de
aprobación:** propietario de MiMiniApp (Alexander / Ale). Preparar y probar el
prototipo está autorizado; esta dirección, los cambios de ficha y la presentación
compartida todavía no están aprobados. No se implementan en la miniapp pública.

Fuentes: [ficha v06 vigente](../product-specs/plan-b.md),
[estándar aprobado](../standards/FRONTEND.md), [contratos ADR-020/021](plan-b-contracts.md),
[FE-01](../exec-plans/active/FE-01-estandar-frontend-y-piloto-plan-b.md).
[Prototipo y capturas de revisión](../review/fe01/README.md).

## Objetivo y dirección recomendada

**El plan toma forma.** Una pregunta principal en cada pantalla y una frase que
se construye a medida que se responde. Público general que llega por primera
vez, con poco tiempo o energía; modo Operate. El resultado útil es una respuesta
concreta para una situación difícil, con imagen digna de guardar. Dos minutos
sigue siendo objetivo de experiencia, sin presentarlo como tiempo medido.

La identidad sigue siendo Laboratorio creativo: Space Grotesk/DM Sans locales,
papel cálido o fondo tinta, morado funcional, geometría sencilla y vocabulario
actual de controles. La firma es una línea que continúa después de un pequeño
desvío, ligada a la idea de seguir; no es una animación decorativa permanente.
No se busca otra marca o un catálogo de estilos.

Se evalúa también reunir todos los campos en una sola frase editable. Se descarta
como recomendación porque vuelve a presentar varias decisiones simultáneas y
complica foco/teclado/textos máximos en móvil. Se entrega una dirección navegable,
no dos implementaciones de producto ni una selección pública de skins.

## Cambios exactos frente a v06

| Elemento | Vigente | Propuesta a aprobar |
| --- | --- | --- |
| Primera visita | Portada y después propósito | Mostrar directamente la pregunta del propósito, utilidad breve y ejemplo de una frase. Sin pantalla introductoria obligatoria. |
| Secuencia visible | Tres pasos; situación/acción/horario juntos en el tercero | Cuatro decisiones: propósito → obstáculo → situación → acción → resultado. Progreso 1–4, sin contarlo en el resultado. |
| Propósito y sugerencias | Seis sugerencias visibles | Pregunta/campo primero; sugerencias disponibles en «¿Necesitas una idea?». Mismos valores reales, sin generación. |
| Obstáculo | Seis opciones, avance automático salvo Otro | Se conserva ese comportamiento y su aviso previo. Otro abre campo y acción explícita para continuar. |
| Situación / acción | Dos campos y ayudas simultáneos | Una pregunta cada vez, ayudas concretas, sugerencias contextuales, Atrás y una acción principal que nombra el siguiente resultado. |
| Escritorio | Columna de 30rem centrada | Área de tarea y vista previa lateral; se aprovecha el ancho sin introducir más decisiones. |
| Móvil | Columna larga dentro de un panel | Pregunta activa y acción principal primero. Vista previa textual compacta después; scroll natural cuando lo requieran errores, zoom o contenido. |
| Resultado | Calendario, imagen y compartir en bloques similares | Frase, propósito, guardar PNG y editar primero. Calendario y compartir mediante revelado progresivo. |
| Narrativa visual | Gris según progreso y sello inclinado | Progreso explícito, frase en construcción y aparición breve del resultado. Se retiran gris y sello de la nueva UI; la nueva dirección ya comunica avance y cierre. |
| Texto de entrada | «Es… y ya has abandonado… / Tardas 2 minutos» | Utilidad directa y tono de acompañamiento. Conservar el escenario anticipado del mes siguiente en el obstáculo, sin prometer un tiempo no medido. |
| PNG | Fondo uniforme, etiqueta y texto centrados | Composición alineada a la izquierda, misma tipografía/paleta local, línea de continuidad y geometría fuera de la zona de texto. Una única dirección estática. |

Los textos completos propuestos ES/EN están en el prototipo, identificados como
copy de propuesta. No sustituyen los diccionarios ni la ficha hasta la aprobación.

## Estados y navegación

| Estado visible | Entrada / acción principal | Atrás, error y continuidad |
| --- | --- | --- |
| Propósito inicial o recuperado | Texto 3–80 puntos de código; «Elegir mi obstáculo». Ejemplo rellena y permanece en esta pregunta. | Error inline asociado y foco al campo. Sin autoFocus al cargar en móvil/escritorio. |
| Obstáculo | Seis opciones. Predeterminado abre situación; Otro requiere texto 3–60 y continuar. | Atrás conserva todas las entradas. Cambiar opción cambia sugerencias, no borra frases. |
| Situación | Texto 3–90, «Elegir mi respuesta» | Atrás al obstáculo. Campo completo y sugerencias con sustitución solo de su valor. |
| Acción | Texto 3–90, «Ver mi plan» | Atrás a situación. Resultado exige propósito, obstáculo y ambas frases válidos. |
| Resultado | Frase literal, propósito, guardar PNG, editar | Editar/Atrás vuelve a acción y permite volver a situación. Reiniciar limpia la sesión propia y recursos temporales; apariencia se conserva. |
| Calendario opcional | Abrir inline desde resultado; hora nativa y días; descargar .ics o confirmar Google | No es requisito para obtener PNG. Validación junto a los controles y foco al primer error. Cancelar Google no navega ni envía información. |
| Imagen pendiente / fallo | Mensaje de preparación o error recuperable; guardar temporalmente inactivo durante preparación/envío | El plan permanece legible/editable. Reintento sin perder datos. Cancelar compartir no anuncia éxito ni fallo alarmante. |
| Solo memoria / sesión inválida | Avisos existentes, con recuperación conocida | Conservar avisos y confirmación antes de cambiar idioma si se perderá el progreso. No exigir más permisos para usar la herramienta. |

Entrada rápida: sin timers que permitan dobles avances. Un cambio de vista mueve
foco a su título una vez; el paso anterior se retira del árbol accesible. El progreso
no repite mediante live-region todo lo que ya lee el foco. Los errores se anuncian
solo cuando aparecen/cambian. Enter envía la pregunta; textarea mantiene escritura
nativa y ajuste de línea. Pegado con saltos se rechaza con el mensaje vigente;
no se bloquea el pegado normal. Sin límite artificial de alto ni bloqueo de zoom.

## Sesión y compatibilidad: conservar v1

**No se cambia el modelo de datos, la clave ni el esquema:**
sessionStorage miminiapp.plan-b.v1, version=1, entradas y fecha narrativa actuales.
Los estados canónicos home/purpose/obstacle/plan/result permanecen compatibles;
plan tiene dos vistas locales de UI, situación y acción. No se añaden una segunda
clave ni persistencia del estado visual. Los generadores de calendario permanecen.

| Sesión v1 recuperada | Vista de la nueva UI |
| --- | --- |
| home | Primera pregunta vacía; conserva avisos de recuperación. |
| purpose | Propósito con su texto exacto. |
| obstacle | Obstáculo con selección y Otro existentes. |
| plan, situación incompleta | Situación. Acción anterior se conserva. |
| plan, situación válida | Acción, aunque esté completa. Atrás permite editar situación; no saltar directamente al resultado. |
| result válida | Resultado con las frases/horario y fecha narrativa conservados. |
| Inválida/corrupta | Política vigente: primera pregunta con explicación, sin tratar contenido inválido como plan válido. |

Esta restauración determinista de las dos vistas de plan debe aprobarse: recargar
puede abrir acción si situación ya era válida, aunque se estuviera revisando esta
última. No hay pérdida de texto. En navegación sin recarga se conserva la vista
elegida; en ES/EN se aplica la misma tabla y nunca se traducen entradas personales.

La fecha narrativa se captura al comenzar realmente a escribir/elegir una sugerencia
o cargar ejemplo en la primera pregunta, no al renderizar la página. Enero y cambio
de mes siguen probándose; una sesión iniciada conserva su historia.

Calendario en resultado usa un borrador local para edición parcial de hora/días.
Solo se confirma atómicamente un horario válido al preparar una exportación; el
resultado persistido nunca pasa por un estado result que el parser v1 rechace.
Cerrar/reabrir el panel durante la misma visita conserva el borrador; recargar
restaura el último horario confirmado, no una edición inválida pendiente. La ayuda
indicará que el horario se conserva al preparar el recordatorio. PNG y texto no
dependen de esa edición. «Sin hora» elimina horario al confirmar esa elección;
no se interpreta la hora nativa badInput como una omisión válida. I4 deberá cubrir
esa edición, su confirmación y recuperación antes de declararla implementada.

El prototipo no implementa persistencia: la tabla y la futura prueba de sesiones
reales, no la memoria del prototipo, definen este contrato propuesto.

## Presentación del marco compartido

Proponer **presentation?: 'standard' | 'focused'** en el descriptor de miniapps.
Ausente equivale exactamente al layout vigente. focused solo compacta el espacio
vertical del encabezado de la ruta (h1 y descripción visibles, menor margen/padding)
y su medida tipográfica; la entrada sigue recibiendo locale y su ancho disponible.
Solo Plan B lo solicitaría. No cambia metadata SEO, cabecera/pie globales, hero,
catálogo, rutas o carga perezosa; no elimina el h1 ni lo reemplaza por título React.

Los espacios/medidas exactos de esa presentación están ilustrados en el prototipo;
su cabecera de marca es representativa, sin certificar el comportamiento del
componente compartido. I4 probará fixtures con opción ausente y focused. Esta es
la única extensión compartida propuesta y requiere aprobar ADR-MMA-023; no se
introduce en src/lib o rutas durante I3.

## Contrato visual, movimiento y PNG

Escritorio de referencia 1440×900: encabezado compacto, pregunta izquierda y
frase/PNG derecha, lectura primaria desde el primer viewport. 393×851: una columna,
acciones de tarea antes de vista previa. 320 px y zoom 200 %: reflujo natural,
texto íntegro, sin recortar, ocultar overflow o fijar un footer encima del foco.
Objetivo de no necesitar scroll para preguntas ordinarias en los dos perfiles
de referencia; no se exige cero scroll en zoom/errores/contenido máximo/teclado móvil.

Movimiento: entrada de vista 180 ms y resultado 240 ms, desplazamiento de 8 px y
opacidad de .7 a 1. Contenido visible por defecto; clics no esperan a la animación.
Hover responde en 160 ms; estado activo claro, foco independiente. reduced-motion
elimina desplazamientos/transiciones y conserva feedback instantáneo. No bucles,
confeti, animaciones al escribir, scroll automático animado ni cambios del hero.

PNG real del prototipo: **1179×2556**, tipografía local, una composición por tema,
sin logo/URL ni reloj dibujado. Etiqueta/frase/continuidad dentro del 32–72 % de
alto y margen lateral del 10 %. Dos arcos discretos fuera de esa zona son geometría
de composición, sin textura raster ni servicios externos. La frase completa usa
los conectores localizados y entradas literales. Ajuste por palabras y grafemas,
tamaño entre 7 % y 4 % del ancho; error recuperable si no cabe, nunca elipsis.
PNG es estático; el pulido procede de composición/tipografía, no de vídeo.
La guía de reloj es aproximada y sigue requiriendo pruebas físicas en PB-01.

El prototipo permite descargar el PNG real. Calendario y compartir muestran el
contrato/consentimiento, sin abrir servicios ni generar eventos reales; la vía
share-file nativa y sus fallos se implementan/validan en I5, no se infieren de esta
descarga. Sin persistencia, cuentas, analítica, dependencias o datos remotos.

## Revisión, presupuestos y salida

Impeccable se aplica explícitamente a composición/Operate y reglas Vercel a
semántica, validación, foco, reflujo y estados. Método de un solo contexto;
sin subagentes ni una crítica independiente atribuida. Fuentes/revisiones fijas
según H-008 y manifiesto; las reglas externas no cambian el contrato por sí solas.
La adaptación local y FE-01 limitan las fases upstream de talleres/catálogo,
generación, delegación y documentos paralelos; no se ejecutan por leer new-work.

El prototipo es evidencia de diseño separada, no código para copiar íntegro a la
miniapp. I4/I5 reutilizarán dominio/exportaciones y componentes existentes. El
presupuesto propio **≤50 KiB** sigue vigente; se medirá cada entrega de runtime.
El peso del prototipo no acredita el presupuesto del futuro producto.

La aprobación del propietario basta: recorrer inicio→resultado, revisar Atrás y
edición, ES/EN/temas, calendario opcional/consentimiento y un PNG real normal/máximo.
Decidir sobre **(1)** dirección y cuatro preguntas, **(2)** cambios concretos de
ficha/restauración/horario, **(3)** extensión focused del marco. Puede aprobar el
paquete o pedir correcciones; no necesita probar con otras personas. Solo entonces
actualizar v06 a v07 Aprobada, marcar esta ADR Aprobada y cerrar FE-I3-01/02/03.
I4/I5 permanecen pendientes de esa aprobación. La aceptación del prototipo no
acepta por anticipado la implementación, rendimiento, pruebas físicas o FE-01.
