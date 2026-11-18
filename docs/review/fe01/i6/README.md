# FE-01/I6 — Revisión del acabado

**Acabado aprobado por el propietario el 2026-11-17.**
«aprobado, continua con la siguiente», en respuesta al paquete y la pregunta de
cerrar I6 y comenzar I7. Candidato funcional 7f027f3 y contenido del manifiesto I6
congelados. I7 en curso; no es aceptación anticipada de su regresión o del producto.
Continúa la dirección aprobada en I3; incorpora el recorrido I4, resultado/PNG I5
y tres correcciones de I6. No está subido o publicado.

## Qué revisar

1. **Entender y completar:** [primera pregunta ES/escritorio](../i4/es-light-1440-purpose.png)
   y [acción EN/estrecho](../i4/en-dark-393-action.png). Se conservan las cuatro
   preguntas, ayudas y vista previa; los espacios solos ya no se presentan como
   una frase propia. Estas capturas previas siguen representando esos estados.
2. **Resultado y guardar:** [resultado ES/claro](../i5/es-light-1440-example-result.png)
   y [máximos EN/oscuro](../i5/en-dark-393-maximum-result.png). Guardar/editar primero;
   calendario y compartir después. Un doble clic o Enter mantenido exportan una
   sola vez; una nueva pulsación permite exportar otra vez.
3. **PNG real:** [ejemplo claro](../i5/es-light-1440-example-wallpaper.png) y
   [máximos oscuros con CJK/emoji](../i5/en-dark-393-maximum-wallpaper.png).
   Ambos archivos se han regenerado con el candidato actual y coinciden byte a
   byte. Se reutilizan para evitar copias innecesarias.
4. **Calendario y recuperación:** [horario preparado](es-light-1440-calendar-prepared.png)
   y [error enfocado en estrecho](en-dark-393-calendar-error.png). Ahora explica
   las cuatro semanas y quién controla los avisos. El resumen solo muestra el
   horario confirmado; una edición pendiente no se presenta como preparada.

Si tienes el repo abierto en tu equipo, puedes ejecutar `npm run dev` y abrir
`/es/apps/plan-b/` o `/en/apps/plan-b/` en el servidor local indicado por Astro.
Un localhost de este entorno no es una URL pública accesible desde otro equipo.
El prototipo I3 conserva la dirección, pero no sustituye esta implementación.

## Ámbito de la aprobación

El [plan, I6](../../../exec-plans/active/FE-01-estandar-frontend-y-piloto-plan-b.md#i6--pulido-y-aprobación-del-propietario)
pide «aprobación del propietario de la dirección implementada en el ámbito revisado».
Basta tu revisión del recorrido, acabado, resultado y PNG; no se exigen otras
personas o una prueba cronometrada. Puedes aprobarlo o indicar qué ajustar.
La instrucción de continuar con I6 autoriza esta revisión, sin aprobar por
anticipado las correcciones aún por presentar.

Las capturas muestran Chromium de escritorio a 1440×900/393×851, claro/oscuro y
ES/EN, con datos sintéticos. No acreditan teléfonos físicos, destinos nativos de
compartir, fondo colocado bajo reloj o recorte del SO. Esos pendientes siguen en
PB-01. No se ha medido retención ni tiempo de primeras visitas.

La aprobación de este acabado permite cerrar I6 y congelar el candidato para
**I7, la última regresión y análisis global**. No acepta anticipadamente I7,
PB-01, producción o un merge. Se mantiene la entrega local acordada.

[Manifiesto del candidato y revisión](manifest.json), [recursos](resources.json) e
[informe I6](../../../reports/fe01/execution.md#i6--pulido-y-revisión-del-acabado).
