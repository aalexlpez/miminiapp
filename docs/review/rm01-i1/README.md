# Receta a medida · Revisión de I1

La [maqueta navegable](prototype.html) usa los ingredientes de los dos ejemplos de la ficha. «Copiar ingredientes» abre la salida seleccionable para revisar su contenido. La cabecera ofrece ES/EN y apariencia, y el pie permite comparar el marco compacto y el estándar.

Para abrir la misma maqueta en una copia del repositorio, ejecutar desde la raíz:

```sh
python3 -m http.server 4343 --bind 127.0.0.1
```

La ruta local es `/docs/review/rm01-i1/prototype.html`. Fuentes y marca proceden de los recursos locales de MiMiniApp.

## Recorridos para revisar

1. Cargar el ejemplo ES. Tocar **3** en la fila de huevos, escribir **2** y confirmar. La lista muestra **×⅔**, «Según 2 huevos» y «Rinde ≈ 5,3 raciones». El aceite queda en **⅔** y el sobre incluye una indicación para medir su fracción. «Volver a 8 raciones» recupera **×1**.
2. En EN, cargar el ejemplo de 4 raciones y subir a 11. La leche queda en **3 7/16 cups**. Añadir la línea `1,500 g flour` y abrir la vista de copia para comprobar que el texto se conserva y el separador queda señalado.

Se propone el marco **compacto**. En la maqueta, el área de trabajo empieza 65 px antes a 393×851 y 83 px antes a 1440×900, frente al marco estándar. Los controles de revisión permiten ver ambos con el mismo contenido.

| Captura | Qué muestra |
| --- | --- |
| [Móvil ES, claro](mobile-es.png) | Ajuste confirmado por dos huevos, factor y barra de copia. |
| [Escritorio EN, oscuro](desktop-en.png) | Ejemplo de 4 a 11 raciones, con editor y resultado lado a lado. |

## Base de comparación

La rama `feature/rm01-receta-a-medida` parte de `origin/staging` en `fa6a0ad7fb112865e8a4a12118656386998a3820`, árbol `754a6015170b8c84cc8c92496c43392d18bff667`. Instalación reproducida con el lockfile, Node 24.22.2, npm 11.19.1 y Chromium 156.0.8078.4 de Playwright, revisión 1248.

`npm run verify` termina con código 0 sobre una copia limpia de esa base. Pasa tipos, lint, formato, validación local de hosting, 560 pruebas unitarias, 27 de componentes, 166 de navegador y las integraciones de módulos, publicación selectiva y promoción. Se repite el chequeo de hosting con `WRANGLER_LOG_PATH` en la carpeta de trabajo para confirmar el resultado tras un aviso de escritura del log en el primer comando.

Carga inicial del build de base servida en localhost, Chromium a 1440×900 y contexto nuevo por ruta. Los bytes son la suma de `decodedBodySize` de la navegación y los recursos, y el número cuenta rutas solicitadas distintas.

| Ruta | Solicitudes | Bytes decodificados |
| --- | ---: | ---: |
| `/es/` | 5 | 225 498 |
| `/en/` | 5 | 225 427 |
| `/es/apps/plan-b/` | 8 | 515 759 |
| `/en/apps/plan-b/` | 8 | 515 311 |

El build de la rama de I1 contiene los mismos 24 archivos que el de la base. El único dato con variación al comparar ambos árboles es el `uid` de las islas de Astro en los dos HTML de Plan B. La maqueta se sirve desde su carpeta de revisión y queda fuera de la salida pública.

## Comprobaciones de la maqueta

* Playwright en Chromium comprueba pegado con teclado y foco conservado, previsualización, confirmación con Enter, cantidad inválida, cancelación con Escape, regreso a raciones, cambio de idioma y texto de copia. La consola queda libre de errores de página y las solicitudes de la maqueta se limitan al origen local.
* Se comprueba reflujo a 320/393/1440 px, modo oscuro y claro, y una altura de 480 px con el campo enfocado. La barra de copia vuelve al flujo mientras se escribe. El teclado virtual y los dispositivos físicos forman parte de las comprobaciones previstas del producto.
* Cuatro comprobaciones automatizadas con axe obtienen cero infracciones en los estados examinados. Se corrigieron el desbordamiento de la cabecera a 320 px y la correspondencia entre el texto visible y el nombre accesible de los botones.
* Revisión manual en un solo contexto con Impeccable 4.9.2 y detector 0.1.25. Sus avisos de paleta y tipografía corresponden a los recursos aprobados de MiMiniApp. Los dos avisos de margen se contrastaron con el render, cuyos paneles tienen 16–24 px de relleno.

La dirección visual y el marco propuesto se someten a revisión del propietario para cerrar I1. [ExecPlan RM-01](../../exec-plans/active/RM-01-receta-a-medida.md).
