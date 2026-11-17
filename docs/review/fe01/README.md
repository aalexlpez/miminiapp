# FE-01 — Revisión de Plan B

**Dirección y contrato aprobados el 2026-11-17.** Dirección «El plan toma forma», preparada
con uso explícito de Impeccable/Vercel. El [contrato propuesto](../../design-docs/plan-b-frontend-proposal.md)
identifica cambios, estados, sesión v1, movimiento y presentación focused.
La miniapp pública conserva su comportamiento actual. La cabecera/pie son
representativos en esta muestra: no se propone retirar la navegación global ni
sus controles; I4 debe integrar el recorrido con los componentes reales.

## Probar el recorrido

Abre [standalone.html](i3-prototype/standalone.html) en Chrome: un único HTML con
fuentes, marca, estilos e interacción incluidos. Funciona sin servidor/conexión.
Está identificado como prototipo; no guarda progreso y no está registrado en el
catálogo. El navegador puede descargar el HTML antes de abrirlo.

1. Escribe un propósito o usa «Ver un ejemplo».
2. Elige obstáculo, concreta situación y acción; prueba Atrás y Editar.
3. Guarda el PNG real; cambia ES/EN o tema conservando entradas literales.
4. Abre el calendario opcional y el aviso de Google: solo muestran la propuesta,
   sin generar eventos ni enviar información. «Compartir» tampoco envía datos.
5. Los controles de revisión al pie cargan textos máximos o reinician la muestra.

La versión separada [index.html](i3-prototype/index.html) usa los recursos del
repo. Para servirla localmente desde la raíz:

```sh
python3 -m http.server 4343 --bind 127.0.0.1
```

Abrir /docs/review/fe01/i3-prototype/ en ese servidor. No es una URL pública ni
un enlace de staging. Regenerar el HTML autónomo manualmente desde la raíz:

```sh
node docs/review/fe01/i3-prototype/build-standalone.mjs
```

El script solo lee recursos locales y conserva los avisos OFL de ambas fuentes.
No hay build automático, hooks, dependencias ni publicación de este prototipo.
El estilo común excluye esta carpeta de la detección de clases Tailwind.

## Secuencia visual y PNG

| Vista | Archivo |
| --- | --- |
| Primera pregunta, escritorio ES/claro | [Inicio](i3-desktop-purpose.png) |
| Primera pregunta, estrecho EN/oscuro | [Inicio estrecho](i3-mobile-purpose.png) |
| Resultado, escritorio ES/claro | [Resultado](i3-desktop-result.png) |
| Resultado, estrecho EN/oscuro | [Resultado estrecho](i3-mobile-result.png) |
| PNG real del ejemplo, ES/claro | [Fondo de ejemplo](i3-wallpaper-example.png) |
| PNG real con máximos, EN/oscuro | [Fondo máximo](i3-wallpaper-maximum.png) |

[Manifiesto de fuentes/capturas y resultados](i3-manifest.json). Datos sintéticos,
fecha 2026-11-17; 393×851 y 1440×900 son viewports de Chromium de escritorio,
no teléfonos reales. Se comprueba además reflujo a 320 px. Calendario/importación,
share-file nativo, reloj/recorte del SO, persistencia y zoom nativo 200 % no se
acreditan mediante este prototipo. El HTML autónomo se prueba offline desde file://;
la URL anterior pertenece solo al entorno de quien ejecute el servidor.

## Decisión registrada

El propietario aprueba la dirección visible y su contrato mediante «Vale, si, la apruebo»: cuatro preguntas, calendario
después del resultado, nueva composición PNG, restauración compatible de sesión
v1 y presentación focused del marco solo por opción explícita. No requiere
participantes externos. Se actualizan ficha/ADR y se cierra I3;
I4 implementará el recorrido en el código del producto y I5 el resultado/PNG.
La aprobación visual no sustituye sus pruebas o la regresión final I7.

## I4 — Recorrido en la aplicación real

Implementación local del contrato aprobado, integrada con la cabecera y el pie
reales. Cuatro preguntas, ayudas opcionales, vista previa y calendario desde el
resultado. El acabado del resultado y la nueva composición PNG quedan para I5.
Estas capturas acreditan observación técnica, no aprobación humana del acabado.

| Vista real | Captura |
| --- | --- |
| Propósito, ES/claro, 1440×900 | [Primera pregunta](i4/es-light-1440-purpose.png) |
| Obstáculo, ES/claro, 1440×900 | [Elección](i4/es-light-1440-obstacle.png) |
| Situación, EN/oscuro, 393×851 | [Señal](i4/en-dark-393-situation.png) |
| Acción, EN/oscuro, 393×851 | [Respuesta](i4/en-dark-393-action.png) |

[Manifiesto I4](i4/manifest.json) y [recursos solicitados](i4/resources.json).
Son viewports de Chromium de escritorio con datos sintéticos y fecha controlada,
no pruebas en teléfonos físicos ni de teclado virtual. Las comprobaciones,
resultados y límites están en el [informe I4](../../reports/fe01/execution.md#i4--recorrido-guiado-en-la-aplicación-real).
El candidato sigue local, sin push o publicación; el prototipo anterior permanece
como referencia de la dirección aprobada.
