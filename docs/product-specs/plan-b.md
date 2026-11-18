# Plan B · Bad Day Plan — ficha funcional v08

* **Estado de esta definición:** `Aprobada` por el propietario de MiMiniApp (Alexander / Ale) el 2026-11-16 al solicitar comenzar la primera iteración de Plan B conforme al plan y ficha revisados. Enmienda v07 aprobada el 2026-11-17 mediante «Vale, si, la apruebo» al revisar dirección/contrato FE-01/I3 (ADR-MMA-023) y pasar a I4.
* **Situación:** FE-01 integrada por PR #28, staging base 7cf32ca. Enmienda v08 aprobada el 2026-11-18 al aceptar la simplificación, selección simple/personalizada y logo/identidad PNG; ADR-MMA-024 y FE-02 autorizados. FE-02 en regresión local; PB-01 mantiene pruebas físicas y aceptación global pendientes.
* **Creada:** 2026-11-15. **Actualizada:** 2026-11-18 (v07 aprobada; recorrido y resultado/PNG FE-01/I4–I5 implementados y verificados localmente, acabado I6 aprobado sobre 7f027f3; regresión local I7 satisfactoria en 2d213dd, deuda de dependencias no bloqueante aprobada; CI/staging pendientes).
* **Origen:** [v05 aportada por el propietario](../references/plan-b-v05.md), contrastada con `staging` en `e203d73156a61a61138e9ff23de964a827221fad`.
* **Categoría:** `everyday`. **ID / slug:** `plan-b`. Etiquetas opcionales omitidas; `publishedAt: 2026-11-17` en la candidata autorizada, como fecha prevista de primera incorporación (confirmar la real antes de integrar si cambia el día).
* **Plan único:** [PB-01](../exec-plans/active/PB-01-plan-b.md), aprobado el 2026-11-16 y con I1–I5 integradas e I6 autorizada y revisada técnicamente, con seis iteraciones internas desde base lógica hasta [regresión global](../exec-plans/active/PB-01-plan-b.md#iteración-6--regresión-y-análisis-global). **Decisiones de Plan B:** [ADR-MMA-020/021](../design-docs/plan-b-contracts.md).
* **Revisión agrupada:** [paquete de aprobación](../design-docs/plan-b-approval.md). Tras integrar PR #24, el propietario solicita continuar con I6: revisión global, correcciones locales, commit/push/PR en la misma rama. Registro de I5 autorizado y staging integrado/validado; quedan pruebas físicas de I4, revisión humana/compatibilidad de I5 y staging del candidato corregido. No es aceptación del producto ni autorización de merge por el agente.

## Enmienda v08 — aprobada el 2026-11-18

El propietario acepta la propuesta de simplificación y añade selección simple con opción personalizada para situación/acción, logo de Plan B e identidad MiMiniApp en el PNG. Aprueba ADR-MMA-024 y autoriza [FE-02](../exec-plans/active/FE-02-plan-b-seleccion-y-marca.md). Esta enmienda prevalece sobre la descripción v07 histórica siguiente en los puntos modificados; el resto del dominio, sesión v1 y exportaciones sigue vigente.

* Cuatro preguntas; situación/acción ofrecen opciones reales de selección simple y «Escribir la mía». Texto personalizado sigue validado y literal; elección rápida no interpreta semánticamente propósitos libres. Conectores fuera del valor; corrección de prefijos duplicados solo explícita.
* Opciones de obstáculo requieren Continuar; Otro se revela sin autoFocus. Ideas con transición breve, instantánea con reduced-motion. Pregunta/etiqueta y ejemplo, sin repetir explicaciones generales.
* Privacidad general en pie fuera del workspace; errores y consentimiento permanecen junto a su acción.
* Imagen y añadir recordatorio como botones visibles. Editor inline con hora nativa y presets de días; .ics o Google validan y confirman horario atómicamente, sin preparar primero. Mantener consentimiento Google y alternativas compatibles del guardado PNG.
* Logo vectorial Plan B y firma MiMiniApp en UI/PNG, sin URL o datos adicionales; sustituye el PNG sin logotipo de v07. Lienzo fijo, composición/legibilidad y texto íntegro conservados. No cambiar identidad global.
* Una sola imagen real de revisión, entrega conjunta tras iteraciones/regresión. Aceptación visual en staging; no se exigen informes humanos por iteración o más demos.

## 1. Propósito y alcance

**Rediseño aprobado:** [ADR-MMA-023](../design-docs/plan-b-frontend-proposal.md)
y [prototipo I3](../review/fe01/README.md) aprobados el 2026-11-17. Esta ficha v07
es el contrato objetivo. FE-01/I4–I5 implementan y verifican localmente el recorrido,
el calendario posterior y la composición de resultado/PNG. I6/I7 conservan la
revisión del acabado por el propietario y la regresión final. La revisión técnica
de I6 y sus tres correcciones locales quedan aprobadas por el propietario sobre
7f027f3 mediante «aprobado, continua con la siguiente». I7 revalida 2d213dd sin cambiar la composición aprobada; sigue En curso por la entrega/CI/staging; la [revisión de dependencias](../reports/fe01/security-review.md) queda como deuda no bloqueante aprobada.
PB-01 conserva sus pendientes físicos y de aceptación; el candidato FE sigue local.

«Dime tu propósito, dime qué te hará dejarlo y prepara un plan B para ese día».

Miniapp de una sola sesión y unos dos minutos para público general, móvil y escritorio, en ES/EN. Nombre ES: **Plan B**, subtítulo «para tu propósito». Nombre EN: **Bad Day Plan**; los nombres de archivo y textos ingleses usan ese nombre. Se inspira en planes «si… entonces» y contraste mental; no promete eficacia clínica ni se presenta como implementación completa o certificada de WOOP.

La persona escribe un propósito, elige un obstáculo y redacta situación y acción. Obtiene el plan en pantalla, un PNG para fondo de bloqueo y, si añade hora y días, un evento recurrente exportable. La app prepara el evento; la persona decide guardarlo en su calendario. Las notificaciones dependen del calendario y de sus permisos.

Se muestran cuatro preguntas guiadas, resultado, ejemplo, calendario opcional, imagen y compartir enlace. La primera pregunta sustituye la portada obligatoria; se retiran el gris y el sello en favor del progreso y la frase en construcción. No hay seguimiento de hábitos, historial, cuentas, pagos, backend, APIs de datos, IA, sincronización, notificaciones propias, analítica, service worker ni dependencias nuevas. Quedan fuera stories, retos, varios propósitos o estilos, editor de fondos, partículas y cambios de plataforma o producción.

## 2. Encaje con la base actual

1. Carpeta `src/miniapps/plan-b/`: `metadata.ts`, `entry.astro`, UI, `domain/`, `i18n/es.ts`, `i18n/en.ts` y `tests/`.
2. Único cambio común de aplicación previsto: inscripción en `src/miniapps/registry.ts`; rutas y catálogo son genéricos. Las pruebas de base que exigían catálogo vacío se adaptan en la iteración 5 de PB-01 conservando ese caso en fixture y añadiendo el catálogo poblado real; no se debilitan para conseguir verde.
3. Rutas propuestas: `/es/apps/plan-b/` y `/en/apps/plan-b/`; mismo slug, nombres visibles traducidos.
4. `SiteLayout` aporta título, descripción, cabecera, pie y selector equivalente ES/EN. El recorrido no duplica ese título principal.
5. Textos propios separados y validados con `validateTranslationParity`; metadatos completos en ambos idiomas.
6. Tokens, Space Grotesk y DM Sans locales; estilos dentro de la carpeta. Claro, oscuro y sistema, con foco visible y dianas de al menos 48 px.
7. La base no tiene analítica: no se añaden eventos ni proveedor. La privacidad se explica dentro de la herramienta.
8. Entrega inicial a staging por el flujo existente, con merge humano. Producción, dominio propio y promoción son trabajos separados.

## 3. Datos, validación y estado

| Entrada | Contrato |
| --- | --- |
| Propósito | 3–80 puntos de código Unicode, después de quitar espacios exteriores. Campo de una línea; contador desde 60. |
| Obstáculo | ID cerrado: tiempo, motivación, imprevisto, exceso, olvido u otro. Etiquetas traducidas; IDs internos estables en inglés. |
| Otro obstáculo | 3–60 puntos de código; obligatorio solo con «Otra cosa». |
| Situación / acción | Cada una 3–90 puntos de código, sin prefijos añadidos por el usuario obligatorios. Campos que crecen visualmente. |
| Hora | Opcional, valor interno `HH:MM` válido. Control nativo; su presentación puede depender del navegador/SO. |
| Días | Conjunto de lunes a domingo, inicialmente lunes–viernes. Se exige al menos uno si hay hora. Sin hora no se exporta calendario. |

Solo se retiran espacios exteriores al validar y generar salidas; no se conjuga, corrige, traduce, resume ni cambia el uso de mayúsculas o puntuación del texto. Saltos de línea pegados se rechazan con mensaje visible: las entradas son frases de una línea, aunque se ajusten visualmente. No se trunca silenciosamente una entrada inválida. La frase se forma con el mismo texto validado en pantalla, PNG y calendario.

Estado: portada / propósito / obstáculo / plan / resultado, valores de entradas, indicador de ejemplo y fecha narrativa. Sin datos del usuario en rutas, query, fragmentos, títulos de documento, logs, telemetría ni peticiones de recursos. La UI trata todo como texto y valida también lo recuperado de almacenamiento.

Persistencia aprobada (ADR-MMA-020): `sessionStorage` bajo `miminiapp.plan-b.v1`, con esquema versionado y solo los datos anteriores. Recargar conserva estado cuando el almacenamiento y la carga de página están disponibles. Si falla el acceso se continúa en memoria y se avisa; si los datos son corruptos, incompatibles o inválidos se descartan y se vuelve a portada con explicación. Cerrar una pestaña no se anuncia como garantía de borrado: el navegador puede restaurarla. «Empezar otra vez» limpia memoria, clave propia y recursos temporales; no toca `miminiapp.appearance`. Si el borrado falla, se informa y no se promete que se haya eliminado la copia guardada.

Cambiar ES/EN conserva entradas, paso, hora y días mediante esa clave; los textos personales nunca se traducen. Si solo existe memoria porque el almacenamiento está bloqueado, se avisa antes de navegar que el cambio de idioma perderá el progreso. No se modifica el selector común. Cambiar propósito u obstáculo conserva situación/acción y cambia únicamente las sugerencias disponibles. Elegir una sugerencia sustituye solo su campo.

«Atrás» de la herramienta vuelve un paso conservando entradas; desde resultado vuelve al plan. El botón Atrás del navegador conserva su comportamiento normal de navegación: no se exige convertir cada paso en una URL o entrada de historial. Nunca genera estados parciales inválidos al volver mediante el navegador.

## 4. Recorrido y demostración

Dirección aprobada «El plan toma forma»: primera pregunta directa y cuatro
preguntas visibles — propósito, obstáculo, situación y acción — antes del resultado.
Vista previa lateral en escritorio y compacta después de la tarea en móvil.
El marco acepta presentation focused solo por opción explícita; el default
standard conserva su layout. h1, descripción, cabecera/pie, navegación y SEO se conservan.

* **Propósito:** pregunta (variante de enero), propósito, ejemplo y sugerencias
  en «¿Necesitas una idea?». La acción nombra elegir el obstáculo. No se exige pulsar
  Empezar antes de escribir ni se enfoca automáticamente el campo al cargar.
* **Obstáculo:** seis botones en dos columnas y escenario del mes siguiente.
  Se avisa que una selección predefinida avanza. Otro abre campo y requiere continuar.
* **Situación:** Si / If, una entrada y ayuda concreta; sugerencias contextuales.
  Atrás al obstáculo; la acción nombra elegir una respuesta.
* **Acción:** entonces / then, entrada y sugerencias; «Ver mi plan» exige frases
  válidas. Atrás a situación conserva todas las entradas. Hora/días no se interponen.
* **Resultado:** frase, propósito, guardar PNG y editar primero. Calendario y
  compartir son opciones progresivas. Editar/Atrás vuelve a acción. Reinicio y
  enlace al catálogo del idioma actual mantienen sus garantías.

Progreso 1–4 sin duplicar anuncios; resultado no se numera. Al cambiar de vista se
enfoca el título una sola vez. Errores asociados y foco al primer campo inválido.
Sin truncado, recorte horizontal o bloqueo de zoom. Las acciones ordinarias deben
ser alcanzables en los perfiles de referencia; zoom, errores, máximo o teclado
móvil pueden requerir scroll natural.

Ejemplo rellena valores reales y abre propósito. La etiqueta permanece hasta el
primer cambio efectivo de un dato, no al navegar o elegir de nuevo el mismo valor.
Cambiar propósito/obstáculo no borra frases. Cambiar idioma conserva texto literal.
Fecha narrativa capturada al empezar realmente a escribir/elegir sugerencia o
cargar ejemplo; mes siguiente natural, enero y narrativa estable se conservan.

### Restauración y horario

Se conserva miminiapp.plan-b.v1 y version=1, sin migración o nueva clave. Los estados
home/purpose/obstacle/plan/result permanecen; plan tiene dos vistas locales.
Restaurar home/purpose muestra propósito; obstacle conserva su selección; plan
abre situación si está incompleta y acción si situación ya es válida, aunque la
acción esté completa. No salta al resultado por inferencia. result válido muestra
resultado. Sin recarga, Atrás conserva la vista elegida; al cambiar idioma se
aplica la misma restauración y nunca se traduce el texto personal.

Calendario se edita desde resultado como borrador local de hora/días. Solo un
horario válido se confirma atómicamente al preparar una exportación; nunca se
persiste result con datos que el parser v1 rechace. Cerrar/reabrir el panel conserva
el borrador en la visita. Recargar restaura el último horario confirmado. La ayuda
lo explica; confirmar «Sin hora» elimina el horario. badInput no se interpreta como
hora omitida. PNG y frase no dependen de ese borrador; consentimiento/Google intactos.

### Concepto visual

Fuentes/tokens Laboratorio creativo, cuatro preguntas con progreso y frase que se
construye. Entrada de vista 180 ms y resultado 240 ms con 8 px de desplazamiento y
opacidad .7→1, contenido visible por defecto; hover 160 ms y foco independiente.
Las acciones no esperan la animación ni duplican avances. reduced-motion conserva
estados instantáneos, sin desplazamiento/transiciones. Sin bucles, gris o sello;
el hero/global de movimiento mantiene su política aprobada.

## 5. Salidas y conexiones

### Calendario: resultado independiente del formato

La hora es local flotante. Al exportar se busca el primer día seleccionado desde mañana, excluyendo hoy aunque su hora no haya pasado. El evento dura 15 minutos; el fin puede caer al día siguiente. La recurrencia mantiene la misma hora de pared, sin promesa de zona fija al viajar o de resolución universal de horas inexistentes/ambiguas por cambio horario.

La serie contiene cuatro apariciones por cada día semanal elegido: 4 con un día, 20 con lunes–viernes y 28 con todos. Son las apariciones en `[primer inicio, primer inicio + 28 días naturales)`, sin incluir el extremo final. Propuesta: `RRULE:FREQ=WEEKLY;BYDAY=<días ordenados MO…SU>;COUNT=<4 × número de días>;WKST=MO`. Evita el `UNTIL` ambiguo e inclusivo de v05. Ejemplo independiente: exportación el 2026-11-15 con lunes–viernes a las 20:00 → inicio 2026-11-16 20:00, final de cada evento a las 20:15, última aparición 2026-12-11, total 20.

**`.ics`:** `VCALENDAR` con `VERSION:2.0`, `PRODID`, `CALSCALE:GREGORIAN`; un `VEVENT`, UID aleatorio, `DTSTAMP` UTC, `DTSTART`/`DTEND` locales con fecha y hora sin `Z`/`TZID`, regla anterior, título y descripción. `VALARM` con DISPLAY, descripción y `TRIGGER:PT0M`. CRLF, escapes TEXT de barra invertida, salto, coma y punto y coma; plegado a 75 octetos UTF-8 contando el espacio de continuación, sin partir caracteres. Descarga Blob como `plan-b.ics` / `bad-day-plan.ics`, revocando la URL cuando sea seguro. Una nueva exportación crea otro UID; se advierte que importarla otra vez puede duplicar eventos.

La alternativa iOS con `data:text/calendar` de v05 se evalúa, no se promete. Solo se conserva una alternativa si se verifica en el teléfono. Generar el archivo offline es requisito; importarlo en la app Calendario y recibir avisos depende del dispositivo. Como mínimo, una vía de incorporación debe funcionar en cada móvil objetivo. Si esa vía es Google, necesitará conexión y aviso explícito; no se oculta silenciosamente el fallo ni se afirma importación offline universal.

**Google Calendar:** exportación voluntaria tras aviso, Continuar / Cancelar, sin OAuth, SDK ni claves. URL `https://calendar.google.com/calendar/render?action=TEMPLATE`, con `text`, `details`, `dates` locales y `recur` de la misma serie, codificados correctamente. Apertura desde el gesto confirmado, nueva pestaña y `noopener noreferrer`; tratar popup bloqueado como error recuperable. Cancelar no navega ni envía nada. La URL de Google contiene el texto del plan y puede quedar en su historial/servicio; los enlaces de MiMiniApp nunca lo contienen. Se explica que los datos pasan a Google para preparar el evento, que aún debe guardar la persona. Verificar zona horaria y recurrencia con cuentas y dispositivos reales. `navigator.onLine` solo es una señal; no acredita acceso real a Google. Un fallo externo conserva el plan y permite descargar `.ics`.

### Fondo de bloqueo

PNG mediante canvas y fuentes locales ya cargadas. Contrato v07: lienzo vertical fijo **1179 × 2556 px** en móvil y escritorio; evita exportar un fondo horizontal desde escritorio y limita memoria. Sin editor de dimensiones. Fondo con tokens del tema resuelto al generar, sin logotipo ni URL. Etiqueta pequeña, frase alineada a la izquierda y línea de continuidad entre el 32 % y el 72 % de la altura, márgenes laterales del 10 %. Geometría discreta fuera de esa zona, sin reloj dibujado; una única dirección por tema.

La frase parte de fuente al 7 % del ancho, baja hasta 4 % y ajusta líneas por palabras. Palabras largas se dividen en límites de grafema, sin omitir texto ni separar un emoji compuesto. Con las longitudes máximas, debe caber íntegra a ese mínimo; si no se consigue, se corrige el layout antes de aceptar, sin elipsis ni ampliar límites. Mantener contraste en ambos temas. La zona segura es una aproximación: comprobar el fondo real bajo el reloj y con el recorte del SO en ambos teléfonos.

Guardar: compartir archivo PNG cuando `navigator.canShare({files})` lo admita; si no, descarga. La generación puede prepararse antes de pulsar para conservar activación de usuario. Si compartir falla por incompatibilidad se ofrece descarga/vista de la imagen con instrucciones; cancelar voluntariamente no muestra éxito ni error alarmante. Mostrar instrucciones según la vía que funcionó, sin asegurar que todos los sistemas ofrecen «Guardar imagen». Una exportación de PNG puede contener el plan si la persona elige un destino externo en el menú del SO; se explica junto al botón.

### Compartir la herramienta

`navigator.share` con texto promocional y URL limpia del idioma actual, sin plan, hora, días ni propósito. Sin API o si falla, ofrecer Copiar enlace; si falla Clipboard, mostrar URL seleccionable para copia manual. El éxito solo se anuncia tras la operación correspondiente. El origen sale de la página actual: staging comparte staging, sin inventar un dominio de producción.

### Modo avión

Una vez cargada y lista la página (UI, JS, CSS y fuentes), sin navegar ni recargar: funcionan los pasos, ejemplo, resultado, PNG y generación `.ics`. Se comprueba después de desconectar la red. La recarga puede recuperar estado si la página carga, pero no se promete recarga/reapertura offline, navegación offline al otro idioma ni PWA. El selector de idioma implica otra página.

Guardar archivos localmente no requiere red. El menú del SO puede abrirse offline; el destino elegido puede necesitar conexión. Google requiere red; mostrar el mensaje offline cuando el navegador lo indique. El plan sigue utilizable ante fallos de esas acciones.

## 6. Textos completos ES/EN

Los placeholders de una misma clave tienen los mismos nombres internos en ambos idiomas. El mes se muestra con `Intl.DateTimeFormat(locale, {month: 'long'})`; ES en minúscula, EN con su mayúscula normal. La hora visible se formatea según idioma, sin forzar el aspecto del control nativo.

| Clave | ES | EN |
|---|---|---|
| subtitulo | Un plan para seguir, incluso en un mal día. | A way to keep going, even on a bad day. |
| p1_pregunta | ¿Qué quieres lograr? | What do you want to achieve? |
| p1_pregunta_enero | ¿Qué quieres lograr este año? | What do you want to achieve this year? |
| p1_sugerencias | Hacer ejercicio · Leer más · Ahorrar · Aprender un idioma · Dormir mejor · Usar menos el móvil | Exercise more · Read more · Save money · Learn a language · Sleep better · Use my phone less |
| p2_otra_placeholder | Cuéntalo en pocas palabras | Say it in a few words |
| p3_pregunta | ¿Cuándo aparece ese obstáculo? | When does that obstacle show up? |
| p4_pregunta | ¿Qué harás en ese momento? | What will you do in that moment? |
| p3_ayuda_situacion | ¿Lo podrías ver en una foto? Si no, concrétalo más. | Could you see it in a photo? If not, make it more specific. |
| p3_ayuda_accion | Algo pequeño: 5 minutos o menos. | Something small: 5 minutes or less. |
| p3_hora_pregunta | ¿A qué hora suele pasar? (opcional) | What time does it usually happen? (optional) |
| p3_hora_nota | Con una hora, te preparamos un recordatorio para tu calendario. | Add a time and we'll make a reminder for your calendar. |
| rec_sin_hora | Añade una hora para crear el recordatorio. | Add a time to create the reminder. |
| rec_nota | El aviso depende de los ajustes de tu calendario. | When it alerts you depends on your calendar settings. |
| fondo_android | 1. Toca «Guardar imagen». 2. Abre la imagen en tu galería, toca el menú y «Establecer como fondo de pantalla». | 1. Tap "Save image". 2. Open the image in your gallery, tap the menu and "Set as wallpaper". |
| compartir_texto | Haz tu plan B para tu propósito en 2 minutos. | Make your bad day plan in 2 minutes. |
| copiado | Enlace copiado | Link copied |
| sin_conexion | Necesitas conexión para esto. Tu plan sigue aquí. | You need a connection for this. Your plan is still here. |
| imagen_etiqueta | Mi plan B | My bad day plan |
| ejemplo_etiqueta | Ejemplo | Example |

`{dias}` se escribe así: «De lunes a viernes» / «Monday to Friday» si son esos cinco; «Todos los días» / «Every day» si son los siete; si no, la lista de días cortos según el idioma («lun, mié, vie» / «Mon, Wed, Fri»).

### Obstáculos y sugerencias

Las sugerencias de situación se escriben **sin «si»** y las de acción **sin «entonces»**, en minúscula, porque se insertan en la frase.

| Obstáculo ES / EN | Situación ES / EN | Acción ES / EN |
|---|---|---|
| No tuve tiempo / I ran out of time | llego tarde a casa · tengo el día lleno de reuniones / I get home late · my day is full of meetings | hago una versión de 5 minutos · lo hago nada más levantarme / I do a 5-minute version · I do it right after I wake up |
| Perdí las ganas / I lost motivation | no me apetece nada · llego sin energía / I don't feel like it at all · I have no energy left | empiezo solo 2 minutos y luego decido · preparo lo que necesito y empiezo por lo más fácil / I start with just 2 minutes and then decide · I get things ready and start with the easiest part |
| Algo se cruzó / Something came up | surge un imprevisto · cambian mis planes / something unexpected happens · my plans change | lo muevo a la mañana siguiente · hago la mitad ese día / I move it to the next morning · I do half of it that day |
| Era demasiado / It was too much | me parece demasiado · llevo varios días sin hacerlo / it feels like too much · I've skipped a few days | hago la versión mínima · vuelvo con la mitad del objetivo / I do the smallest version · I come back with half the goal |
| Se me olvidó / I forgot | llega la hora y no me he acordado · salgo de mi rutina / the time comes and I haven't remembered · my routine changes | lo hago en cuanto vea el recordatorio · lo uno a algo que ya hago, como el café / I do it as soon as I see the reminder · I attach it to something I already do, like coffee |
| Otra cosa / Something else | (sin sugerencias) | hago una versión de 5 minutos · lo muevo al día siguiente / I do a 5-minute version · I move it to the next day |

### Datos del ejemplo

| Campo | ES | EN |
|---|---|---|
| Propósito | Hacer ejercicio 3 veces por semana | Exercise 3 times a week |
| Obstáculo | No tuve tiempo | I ran out of time |
| Situación | llego a casa después de las 20:00 | I get home after 8 p.m. |
| Acción | hago 5 minutos de estiramientos antes de sentarme en el sofá | I do 5 minutes of stretching before I sit on the couch |
| Hora | 20:00, de lunes a viernes | 20:00, Monday to Friday |

### Textos adicionales y sustituciones de v06

Estas filas sustituyen las claves homónimas de v05 y completan controles, errores y accesibilidad. Los valores entre llaves son parámetros, no texto de usuario sin validar.

| Clave | ES | EN |
| --- | --- | --- |
| metadata_titulo | Plan B | Bad Day Plan |
| metadata_descripcion | Un plan para seguir, incluso en un mal día. | A way to keep going, even on a bad day. |
| nombre_subtitulo | para tu propósito | for your goal |
| pie_privacidad | Gratis y sin cuenta. Tu texto se procesa en este navegador y se guarda temporalmente si el navegador lo permite. Puedes borrarlo con «Empezar otra vez». Solo sale si lo exportas a Google o compartes la imagen. | Free, no account. Your text is processed in this browser and temporarily saved when your browser allows it. Clear it with “Start again”. It only leaves if you export it to Google or share the image. |
| nota_offline | Con esta página completamente cargada y abierta, puedes completar tu plan y generar los archivos sin conexión. | Once this page is fully loaded and kept open, you can finish your plan and generate the files offline. |
| evento_descripcion | Si {situacion}, entonces {accion}.\nTu propósito: {proposito}\nHecho con MiMiniApp | If {situacion}, then {accion}.\nYour goal: {proposito}\nMade with MiMiniApp |
| evento_titulo | Plan B: {accion} | Bad Day Plan: {accion} |
| titular | Es {mesSiguiente} y ya has abandonado tu propósito. | It's {mesSiguiente} and you've already quit your goal. |
| p2_pregunta | Imagina que es 1 de {mesSiguiente} y lo has dejado. ¿Qué ha pasado? | Imagine it's {mesSiguiente} 1 and you've stopped. What happened? |
| resultado_titulo | Ya tienes una forma de seguir. | You have a way to keep going. |
| rec_resumen | {dias} a las {hora}, durante 4 semanas | {dias} at {hora}, for 4 weeks |
| gcal_aviso | Se abrirá Google Calendar con tu plan. El texto se enviará a Google y puede quedar en la URL y el historial. Revisa y guarda el evento allí. | Google Calendar will open with your plan. The text will be sent to Google and may remain in the URL and history. Review and save the event there. |
| fondo_ios | 1. Guarda el PNG desde el menú de compartir o la vista de imagen. 2. En Fotos, usa Compartir y «Usar como fondo de pantalla». Las opciones dependen de tu versión de iOS. | 1. Save the PNG from the share menu or image view. 2. In Photos, use Share and “Use as Wallpaper”. Options depend on your iOS version. |
| imagen_aviso | La imagen contiene tu plan. Si eliges otra app al compartirla, esa app recibirá la imagen. | The image contains your plan. If you choose another app when sharing it, that app will receive the image. |
| empezar / ejemplo | Empezar / Ver un ejemplo | Start / See an example |
| atras / siguiente | Atrás / Siguiente | Back / Next |
| ver_plan / reiniciar | Ver mi plan / Empezar otra vez | See my plan / Start again |
| si / entonces | Si / entonces | If / then |
| proposito_etiqueta | Tu propósito | Your goal |
| situacion_etiqueta / accion_etiqueta | Situación / Acción | Situation / Action |
| otro_etiqueta / hora_etiqueta | Otro obstáculo / Hora | Other obstacle / Time |
| dias_etiqueta / dias_todos / dias_laborables | Días / Todos los días / De lunes a viernes | Days / Every day / Monday to Friday |
| paso | Paso {actual} de {total} | Step {actual} of {total} |
| contador | {actual} de {maximo} caracteres | {actual} of {maximo} characters |
| obstaculo_avance | Al elegir un obstáculo, pasarás al siguiente paso. | Choosing an obstacle takes you to the next step. |
| recordatorio / calendario / google / anadir_hora | Recuérdamelo / Añadir a mi calendario / Añadir a Google Calendar / Añadir hora | Remind me / Add to my calendar / Add to Google Calendar / Add a time |
| continuar / cancelar / cerrar | Continuar / Cancelar / Cerrar | Continue / Cancel / Close |
| fondo / guardar_imagen / ver_imagen | Tu fondo de pantalla / Guardar mi plan / Abrir imagen | Your wallpaper / Save my plan / Open image |
| editar_plan / png_nota | Editar mi plan / PNG · 1179 × 2556 · imagen estática | Edit my plan / PNG · 1179 × 2556 · static image |
| compartelo / compartir / copiar / catalogo | Compartir Plan B / Compartir / Copiar enlace / Más miniapps | Share Bad Day Plan / Share / Copy link / More miniapps |
| error_longitud | Escribe entre {minimo} y {maximo} caracteres. | Enter between {minimo} and {maximo} characters. |
| error_linea | Escribe una sola línea, sin saltos de línea. | Enter a single line without line breaks. |
| error_hora / error_dias | Elige una hora válida. / Selecciona al menos un día o quita la hora. | Choose a valid time. / Select at least one day or remove the time. |
| estado_memoria | Tu navegador no permite guardar el progreso. Se conservará mientras esta página siga abierta. | Your browser cannot save your progress. It will last while this page stays open. |
| estado_invalido | No se pudo recuperar el progreso guardado. Empieza de nuevo. | Your saved progress could not be restored. Start again. |
| estado_borrado_fallo | No se pudo borrar la copia guardada. Puedes eliminar los datos de este sitio en los ajustes del navegador. | The saved copy could not be cleared. You can delete this site's data in your browser settings. |
| idioma_sin_guardado | Al cambiar de idioma se perderá el progreso porque el navegador no permite guardarlo. | Changing language will lose your progress because your browser cannot save it. |
| error_exportar | No se pudo preparar el archivo. Tu plan sigue aquí; inténtalo de nuevo. | The file could not be prepared. Your plan is still here; try again. |
| error_popup | No se pudo abrir Google Calendar. Permite la nueva pestaña o descarga el archivo de calendario. | Google Calendar could not be opened. Allow the new tab or download the calendar file. |
| error_compartir | No se pudo compartir. Puedes copiar el enlace. | Sharing failed. You can copy the link. |
| error_imagen | No se pudo guardar la imagen. Puedes abrirla para guardarla manualmente. | The image could not be saved. You can open it to save it manually. |
| copia_manual | No se pudo copiar automáticamente. Selecciona y copia este enlace. | The link could not be copied automatically. Select and copy it. |
| imagen_preparando / imagen_lista | Preparando imagen… / Imagen del plan lista | Preparing image… / Plan image ready |
| archivo_preparado | Archivo preparado. Comprueba la descarga o la aplicación de destino. | File prepared. Check the download or destination app. |
| aviso_duplicados | Importar el archivo otra vez puede duplicar los eventos. | Importing the file again may duplicate events. |
| importacion_limitada | En este dispositivo, usa Google Calendar para guardar el evento; necesita conexión. El archivo también se puede descargar para importarlo en otro dispositivo. | On this device, use Google Calendar to save the event; it needs a connection. You can also download the file to import on another device. |
| meses_etiqueta / plan_etiqueta | Mes / Tu plan | Month / Your plan |

Las filas con varias claves separadas por `/` son una abreviatura documental: se implementan como claves independientes con los valores respectivos. Los siete botones de días tienen nombre completo ES/EN y estado pulsado; las listas cortas se formatean con `Intl`. Completar mensajes mecánicos que aparezcan durante implementación en ambos idiomas es trabajo local; un cambio de significado o alcance requiere revisar esta ficha.

## 7. Calidad, tiempo y aceptación

Objetivo WCAG 2.2 AA: teclado completo, foco y etiquetas, errores asociados, contraste también en gris, reflujo a 320 px y zoom 200 %, pasos anunciados y dialogs de confirmación utilizables. Validar móvil/escritorio y claro/oscuro; axe no sustituye revisión manual.

Presupuesto propuesto: **≤ 50 KiB sin comprimir para JS/CSS propio adicional de Plan B**, descontando solo runtime compartido de React/DOM/Astro que se identificará por archivo. Se informa además el total real solicitado por la página, sin comprimir y gzip, incluidos esos runtimes y CSS compartido. Referencia local del renderer actual: 220749 bytes sin comprimir / 68054 gzip, no solicitado por la portada. No se presenta este presupuesto propio como si toda la página pesara 50 KiB. Sin nuevas dependencias; no cambiar de stack para alcanzar el número.

El límite de Ale sigue siendo **6–12 h en 3–4 sesiones** de revisión/prueba, no una garantía de horas de desarrollo ni de fecha. Las pruebas de compatibilidad van primero. Si el núcleo no cabe, se entrega evidencia y se revisa el alcance; no se publica un resultado incompleto para cumplir el límite.

Recortes, si hacen falta y se registran antes de aceptar: instrucciones de SO separadas → instrucciones conjuntas; Google → solo si `.ics` permite importar correctamente en ambos móviles. Analítica ya está fuera y no supone ahorro pendiente. No se recortan las cuatro preguntas, plan, una vía de calendario por móvil, PNG, ES/EN ni uso offline definido. La retirada de gris/sello ya fue aprobada en v07; no es un recorte pendiente.

| ID | Resultado aceptable | Evidencia prevista |
| --- | --- | --- |
| PB-AC-01 | Rutas, metadatos, catálogo y cambio ES/EN con mismo slug; módulos aislados. | Build, E2E y regresión de plataforma/integración. |
| PB-AC-02 | Recorrido, validación, sugerencias, Atrás, ejemplo y reset cumplen §§3–4 en ambos idiomas. | Unitarias, componentes y E2E ES/EN. |
| PB-AC-03 | Mes natural correcto y fecha narrativa estable en la sesión. | Casos enero 31 → febrero; diciembre → enero; bisiesto y cambio de mes con reloj controlado. |
| PB-AC-04 | Persistencia, fallos, restauración, idioma y borrado cumplen §3. | Componentes/E2E, almacenamiento bloqueado/corrupto y datos de versión distinta. |
| PB-AC-05 | Serie correcta en cada vía conservada, idéntica si se conservan ambas: primera fecha, 15 minutos y cuatro apariciones por día. | Expectativas independientes: 1/5/7 días, medianoche, DST; importación real en cada vía conservada. |
| PB-AC-06 | `.ics` válido UTF-8 y, si se conserva Google, URL segura con consentimiento; errores recuperables. | Pruebas escapes/plegado/emoji/inyección y, para Google, Cancelar y red interceptada; no llamadas reales automatizadas a Google. |
| PB-AC-07 | PNG completo y legible, guardable y utilizable bajo reloj en ambos teléfonos. | Casos máximos, palabras largas/emoji y revisión física de fondo guardado. |
| PB-AC-08 | Compartir enlace no incluye el plan y todas las salidas preservan el texto validado. | E2E con texto centinela, APIs simuladas y comprobación física de destinos. |
| PB-AC-09 | Tras carga completa se recorre el ejemplo y se generan `.ics`/PNG offline. | E2E desconectado y modo avión en iPhone/Android, sin promesa de recarga offline. |
| PB-AC-10 | Accesibilidad, responsive, temas y animaciones cumplen §§4 y 7. | axe, teclado/foco/zoom y revisión visual mínima; reduced-motion en animaciones propias. |
| PB-AC-11 | Presupuesto medido; ningún dato personal sale sin la exportación explícita descrita. | Bytes del build/recursos solicitados y registro de red con texto sintético. |
| PB-AC-12 | `npm run verify` y CI pasan; versión de staging identificada y matriz manual completa. | Run/commit y revisión de Safari iPhone, Chrome Android y Chrome/Safari/Firefox de escritorio, anotando versiones. |

## 8. Pendientes y cambios respecto a v05

El propietario selecciona Plan B y aprueba esta ficha al comenzar I1 el 2026-11-16. Tras fusionar PR #19 autoriza avanzar a I2 y aprueba ADR-MMA-021. I1/I2 quedan integradas. Tras confirmar la consolidación en una rama, autoriza I3 y aprueba ADR-MMA-020 el 2026-11-16. Recorrido y sesión quedan integrados por PR #22. El 2026-11-17 el propietario autoriza continuar con I4; se ejecuta su parte local conservando las pruebas físicas y acceso HTTPS como condiciones de cierre. Tras integrar PR #23 solicita comenzar la siguiente iteración: se prepara localmente I5 sin cerrar I4 ni alterar los criterios físicos. Después autoriza expresamente el registro en la candidata; se incorpora y comprueba el build real, manteniendo las revisiones físicas/manuales pendientes. Tras integrar PR #24 autoriza I6: revisión técnica global y correcciones locales, sin dar por completas esas pruebas. Las condiciones de las iteraciones y las revisiones humanas permanecen; la última revisión sigue siendo I6. No se atribuye compatibilidad física o aceptación del producto a sus generadores de calendario.

Cambios materiales propuestos: rutas reales con slug único; mes natural; calendario `COUNT` exacto; promesa offline acotada; almacenamiento con fallos y borrado explícito; consentimiento para URL Google/PNG; lienzo fijo también desde escritorio; presupuesto propio separado del total; aceptación inicial en staging. La iteración 1 inventaría la vía de acceso HTTPS; la iteración 4 la requiere comprobada para las pruebas de teléfonos. No se inventa un hosting o despliegue de pruebas.

| Fecha | Estado | Actor | Motivo |
| --- | --- | --- | --- |
| 2026-11-15 | `Borrador` | Codex, por solicitud del propietario «vamos a ello» | Preparación documental para revisión; sin aprobación ni ejecución de producto. |
| 2026-11-16 | `Borrador` | Codex, por solicitud del propietario | Planificación consolidada en un único PB-01 con seis iteraciones internas y cierre global obligatorio por preferencia del propietario; requisitos de producto y ejecución siguen pendientes. |
| 2026-11-16 | `Aprobada` | Propietario de MiMiniApp | «vamos a comenzar con la primera iteración», tras el repaso solicitado de la documentación: selección de Plan B y ejecución de I1 según ficha v06; decisiones ADR-MMA-020/021 y siguientes iteraciones no autorizadas. |
| 2026-11-16 | `Aprobada` | Propietario de MiMiniApp | Confirma merge de PR #19 y pide avanzar: I2 y ADR-MMA-021 aprobadas; ADR-MMA-020 y ejecución de I3–I6 pendientes. |
| 2026-11-16 | `Aprobada` | Propietario de MiMiniApp | Confirma integración de I1/I2 en la rama del plan y pide continuar: I3 y ADR-MMA-020 aprobadas; I4–I6 sin autorizar. |
| 2026-11-17 | `Aprobada` | Propietario de MiMiniApp | Confirma merge de I3 y pide continuar: desarrollo/pruebas locales de I4, con matriz física/HTTPS pendiente para cierre. I5/I6 sin autorizar. |
| 2026-11-17 | `Aprobada` | Propietario de MiMiniApp | Confirma merge de I4 y pide comenzar la siguiente: preparación local de I5, manteniendo matriz física de I4 y autorización de catálogo pendientes. No es aceptación de I4/I5 ni inicio de I6. |
| 2026-11-17 | `Aprobada` | Propietario de MiMiniApp | «Autorizar el registro en la rama candidata»: incorporación explícita de I5, con rutas ES/EN, loader perezoso y fecha prevista de primera incorporación. Pruebas físicas de I4 y cierre/revisiones de I5 pendientes; merge humano. |

| 2026-11-17 | `Aprobada` | Propietario / Codex | «listo la ultima iteración, continua», tras integrar PR #24: I6 autorizada y revisión técnica global realizada, con dos correcciones locales. Contrato v06 conservado; pruebas físicas, revisión humana y staging de las correcciones pendientes. PB-01 sigue En curso. |
