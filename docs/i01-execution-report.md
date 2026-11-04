# I-01 — Informe de ejecución local

**Fecha:** 2026-11-04. **Estado:** En curso, con bloqueo de red para el navegador obligatorio. **Responsable de aceptación:** propietario de MiMiniApp.

## Resultado implementado

Astro 7.4.5 estático, React/DOM 19.3.1, TypeScript 6.0.3 strict, Tailwind 4.3.4 y las herramientas exactas aprobadas. Runtime Node 24.22.2 con npm 11.19.1 instalado fuera del checkout; 31 dependencias directas y package-lock.json generado y comprobado. No hay catálogo, miniapp real, backend, CI remoto, Cloudflare ni despliegue.

La página provisional es una fixture técnica con etiqueta de 3–32 puntos de código, normalización de espacios, validación, error anunciado, confirmación, reset y foco. El dato solo vive en estado React: no hay persistencia ni llamadas a APIs. CSS responsive de una/dos columnas y controles accesibles. El build genera index.html y cuatro recursos estáticos en dist/.

## Evidencias y resultados

Todos los comandos se ejecutan desde /workspace/miminiapp con el runtime aprobado. Logs y artefactos de la instancia están en .local/verification/, ignorados por Git; el informe conserva el resumen durable. Los procesos de preview iniciados por esta verificación se detienen al terminar.

| Comprobación | Resultado real | Evidencia local |
| --- | --- | --- |
| Node / npm | v24.22.2 / 11.19.1. SHA-256 del tarball de Node verificado con el SHASUMS256.txt oficial por HTTPS. | /workspace/.cache/miminiapp-runtime/verification.json |
| npm install | Correcto, 491 paquetes instalados, sin forzar peers ni desactivar integridad/TLS. | .local/verification/npm-install.log |
| npm ci --offline --no-audit --no-fund --cache /workspace/.cache/npm | Correcto desde node_modules regenerado y caché de artefactos; lockfile sin cambios. | .local/verification/npm-ci.log y lockfile-before-ci.sha256 |
| npm ls --all | Correcto, sin problemas declarados del grafo instalado. | .local/verification/npm-ls.json |
| npm run check | Correcto: 0 errores, 0 warnings y 0 hints tras ajustar el tipo de evento. | .local/verification/local-checks-final.log |
| npm run lint | Correcto, cero warnings permitidos. | .local/verification/local-checks-final.log |
| npm run format:check | Correcto para código y configuración; no reformatea el dossier original. | .local/verification/local-checks-final.log |
| npm run test:unit | 14/14 pruebas pasadas, 1 archivo, ninguna omitida. | .local/verification/test-unit.log y local-checks-final.log |
| npm run test:components | 9/9 pruebas pasadas, 1 archivo, ninguna omitida. | .local/verification/test-components.log y local-checks-final.log |
| npm run build | Correcto, salida static, una página; no SSR ni worker de aplicación. | .local/verification/build-initial.log y local-checks-final.log |
| Controles negativos de tipos, lint y formato | Tres fallos esperados detectados, exit 1 en cada control. Archivo temporal retirado y comprobaciones positivas repetidas después. | .local/verification/negative-controls.json y negative-*.log |
| npm audit --audit-level=high | Exit 0: 0 altas, 0 críticas, 11 moderadas. No equivale a ausencia total de riesgos. | .local/verification/npm-audit.json |
| npm run verify | La primera ejecución pasó tipos/lint/formato/unitarias/componentes/build, pero falló al gestionar el preview en segundo plano. Se corrigió el CLI y se repitió el E2E requerido. | .local/verification/verify-required.log |
| npm run test:e2e con Chromium fijado | Exit 1: 8 intentos fallidos antes de ejecutar el navegador por ausencia de su binario. No se consideran fallos funcionales de la fixture ni tests pasados. | .local/verification/e2e-required-final.log, test-results/ y playwright-report/ |
| Diagnóstico complementario con Chromium del sistema 155.0.8059.79 | 8/8 casos pasados, 0 omitidos y 0 flaky: interacción/hidratación, teclado/reset, CSS responsive y axe en ambos perfiles. No sustituye el Chromium 156.0.8078.4 asociado a Playwright 1.64.1. | .local/verification/system-chromium-diagnostic-final.log y system-chromium-diagnostic.json |
| axe complementario | Sin infracciones detectadas con tags WCAG 2.2 AA en estados inicial/error/éxito, en escritorio y móvil emulado; no certificación completa. El comando requerido test:a11y no puede acreditarse hasta instalar el navegador fijado. | Caso a11y incluido en los 8 diagnósticos; misma suite del repositorio, sin cambiar aserciones. |
| Revisión asistida independiente de teclado y visual | GET / y CSS 200; Tab/Enter, error, confirmación, foco visible, reset y retorno al input comprobados. Capturas a 1280px/393px inspeccionadas: texto/controles legibles, sin recortes ni overflow horizontal. Navegador del sistema, sin afirmar dispositivo físico o revisión humana. | .local/verification/manual-keyboard-review.json, desktop.png y mobile.png |
| Revisión separada del código | Sin defectos materiales detectados; valida alcance, render seguro, pruebas observables y preservación del harness. | Revisión del delta y de src/configuración/tests en esta sesión. |

**SHA-256 de package-lock.json:** 185343c461af4ffe6ec65bc27aa2d74790d6476a232888f7a9d341f40d2c3193.

**SHA-256 del runtime oficial:** 48cc0e21e048790e54c0cf5749c2725005313d652651c40b7a21feb9697aaf75.

## Problemas encontrados y ajustes mecánicos

1. React types 19.3 depreca FormEvent: se usa SubmitEvent para onSubmit, conforme a su declaración oficial instalada. Sin cambio de biblioteca o versión; la comprobación final queda sin hints.
2. Astro 7 detecta al agente y arranca preview en background. Playwright interpretó que webServer había terminado; se inspeccionó astro preview --help y el código instalado, y se añadió el flag documentado --ignore-lock a dev/preview para mantener procesos en primer plano y controlados por el runner. Se detuvo exclusivamente el preview iniciado por la prueba. Este ajuste no ignora fallos del navegador ni permite reutilizar un servidor ajeno.
3. El diagnóstico inicial detectó una petición automática 404 a favicon.ico. Se añadió un favicon vacío data:, en la página. Se conservaron todas las aserciones de errores/red y los 8 diagnósticos pasaron al repetirlos.
4. Descarga del navegador obligatorio: 403 Domain forbidden para cdn.playwright.dev. Es una denegación de política del entorno, no un error de versión ni un rechazo del revisor automático. No se evita el proxy, no se desactiva TLS y no se sustituye silenciosamente el navegador aprobado por el del sistema.

No se cambian las versiones aprobadas ni se añaden tecnologías. La configuración diagnóstica que usa /usr/bin/chromium solo existe en .local/, ignorada; playwright.config.ts mantiene el navegador de Playwright, Chromium-only y el build local.

## Seguridad, dependencias y licencias

Las 11 incidencias moderadas derivan de minimatch (DoS por amplificación de patrones, GHSA-g3hv-75wg-m249) y sus dependientes de lint/TypeScript. Son herramientas de desarrollo; el JS estático servido no recibe patrones de usuarios para minimatch. Se mantienen las versiones aprobadas y se registra seguimiento en PEND-007; no se ejecuta audit fix --force ni se aplican downgrades de majors sugeridos por npm. No hay altas/críticas que incumplan el umbral aprobado. Revisar antes de ampliar a contribuciones no confiables o modificar la cadena de herramientas.

El inventario de licencias del lockfile conserva MIT/ISC/BSD/Apache y otras expresiones, incluidas MPL-2.0 y libvips de sharp con LGPL-3.0-or-later (también variantes opcionales para otras plataformas). No se borran avisos de terceros; no se distribuyen aquí binarios ni se adopta licencia de publicación para MiMiniApp. Antes de distribuir imágenes/binarios o publicar, revisar las obligaciones de esos recursos. Inventario: .local/verification/license-inventory.json. La licencia propia continúa pendiente, package.json marca UNLICENSED/private.

## Criterios de aceptación

| Criterio | Estado al terminar esta ejecución |
| --- | --- |
| I01-AC-01 instalación repetible | Cumplido. Runtime exacto, lockfile estable y npm ci correcto. |
| I01-AC-02 salida estática y HTTP | Cumplido. Una página, recursos estáticos y respuestas representativas 200. |
| I01-AC-03 hidratación real | Implementado y pasado en diagnóstico Chromium 155; pendiente evidencia con el Chromium fijado 156. |
| I01-AC-04 CSS compilado | Implementado y pasado en diagnóstico; pendiente evidencia con navegador fijado. |
| I01-AC-05 tipos/lint/formato | Cumplido, controles positivos y negativos registrados. |
| I01-AC-06 unitarias/componentes | Cumplido: 14 + 9 pruebas reales pasadas. |
| I01-AC-07 E2E en ambos perfiles | Bloqueado por descarga del navegador aprobado; 8/8 complementarios en 155 no lo cierran. |
| I01-AC-08 accesibilidad/teclado | Código, axe y revisión asistida complementarios correctos; pendiente axe/teclado sobre el navegador fijado. |
| I01-AC-09 documentación | Actualizada con capacidades reales, comandos y límites; no declara preparación completa. |
| I01-AC-10 alcance | Cumplido. Sin catálogo/miniapp real, I-02, CI remoto, Cloudflare, despliegues o nuevas skills. La ejecución local no hizo commits/pushes; posteriormente el propietario autoriza un commit y push exclusivos para el traslado descrito al final. |

## Bloqueo externo y continuación

Se guardó en el borrador de configuración del entorno la adición exacta cdn.playwright.dev, preservando el preset de gestores de paquetes y sin ampliar a comodines. El guardado está confirmado; no aplica ni publica la política. La observación posterior seguía en spec_revision 1, red restricted/enforced y lista custom vacía, incluso después de los intentos de publicación comunicados por el propietario. El nombre temporal usado para identificar la configuración se restauró a miminiapp. No hay evidencia de que la política activa de esta máquina haya incorporado el dominio.

Una vez aplicada la red, comprobar el estado observado y reintentar npx --no-install playwright install chromium con el runtime y PLAYWRIGHT_BROWSERS_PATH documentados. Si aparece un nuevo destino denegado por una redirección, registrarlo y pedir únicamente la adición necesaria, sin eludir la política. Ejecutar npm run verify y, si procede, el comando selectivo test:a11y; repetir solo comprobaciones afectadas. Registrar sus resultados actuales y pasar a Verificado únicamente si satisfacen los criterios. No hace falta nueva autorización de código dentro del alcance ya autorizado de I-01; cualquier cambio material conserva su requisito de aprobación.

Hasta entonces I-01 queda En curso. No se pasa a Verificado o Aceptado ni se comienza I-02.

## Archivos de implementación y verificación

* Runtime/gestor: .node-version, .npmrc, package.json y package-lock.json; runtime instalado fuera del checkout.
* Configuración: astro.config.mjs, tsconfig.json, eslint.config.mjs, prettier.config.mjs, vitest.config.ts y playwright.config.ts; .gitignore para artefactos.
* Fixture: src/pages/index.astro, src/components/EnvironmentFixture.tsx, src/lib/validation.ts, src/styles/global.css y src/env.d.ts.
* Pruebas: tests/unit/validation.test.ts, tests/components/EnvironmentFixture.test.tsx, tests/components/setup.ts, tests/e2e/environment.spec.ts, tests/e2e/a11y.spec.ts y tests/e2e/fixtures.ts.
* Documentación: README, ARCHITECTURE, guías técnicas, registro/paquete de decisiones, pendientes, roadmap, plan activo e informe. Se conservan las modificaciones documentales previas; no se reescribe I-00 aceptada ni su desviación histórica.

Las dependencias y las evidencias generadas quedan ignoradas. Los archivos temporales de controles negativos se retiraron. Al finalizar las comprobaciones locales, HEAD era 38574b75c13d7056f38d8c589223041614952239 y no había commits o pushes posteriores a I-00.

## Traslado autorizado a otro chat

El 2026-11-04 el propietario responde «vale, haz lo que dices, lo autorizo» a la propuesta de crear feature/i01-base-local-testing, realizar un commit de los archivos de I-01 y subir exclusivamente esa rama. El permiso queda registrado en el [ExecPlan](exec-plans/active/I-01-base-local-y-testing.md); no acepta la iteración ni autoriza merge, cambios en master, despliegues, I-02 o futuros commits/pushes.

El commit conserva código, lockfile, pruebas, aprobaciones y resultados documentales; excluye dependencias, binarios, logs, capturas y artefactos ignorados. La [guía de continuación](i01-handoff.md) indica cómo retomar el trabajo y regenerar evidencia en la máquina nueva. El resultado de la operación Git y su SHA se comprueban después de crear el commit; este informe no presupone que el push haya tenido éxito. I-01 sigue En curso hasta completar las verificaciones obligatorias.
