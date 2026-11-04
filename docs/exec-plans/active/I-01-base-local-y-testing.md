# I-01 — Base local Astro y batería inicial de pruebas

## Control

* **Estado:** `En curso`
* **Responsable de aprobación, autorización y aceptación:** Propietario de MiMiniApp, por rol.
* **Creado:** 2026-11-04.
* **Última actualización:** 2026-11-04.
* **Origen:** Plan independiente preparado tras aceptar I-00; aquella fase de preparación no autorizaba ejecución. Las autorizaciones posteriores de ejecución y de traslado mediante Git se registran abajo; no amplían a CI/Cloudflare/despliegues.
* **Dependencia satisfecha:** [I-00 aceptada](../completed/I-00-traslado-documental.md), archivada en completed/; commit local `38574b75c13d7056f38d8c589223041614952239`.
* **Aprobación:** 2026-11-04, propietario de MiMiniApp, mediante «Bloque C: alcance y criterios de aceptación del ExecPlan I-01», junto con los bloques A/B.
* **Autorización de ejecución:** 2026-11-04, propietario de MiMiniApp: «Autorizo expresamente la ejecución del ExecPlan I-01 — Base local y testing, conforme al alcance y las decisiones técnicas aprobadas». Se conserva la aprobación previa sin autorización como hecho histórico; la autorización vigente empieza con esta indicación.
* **Autorización de traslado:** 2026-11-04, propietario de MiMiniApp: «vale, haz lo que dices, lo autorizo», en respuesta a la propuesta de crear feature/i01-base-local-testing, realizar un commit del trabajo de I-01 y subir exclusivamente esa rama a GitHub para retomarlo en otro chat. Es un permiso específico para este punto de continuación, no aceptación de I-01 ni autorización general de futuros commits/pushes, merges o cambios en master.
* **Situación de ejecución:** Base local implementada; pasan instalación, npm ci, tipos, lint, formato, 14 unitarias, 9 componentes y build. Se mantienen las restricciones de I-02, CI remoto, Cloudflare y despliegues. Solo el commit y push del traslado anterior están autorizados.
* **Bloqueo externo:** Chromium 156.0.8078.4 / Playwright revisión 1248 no se descarga por HTTP 403 Domain forbidden en cdn.playwright.dev. El dominio figura en el borrador de configuración, pero los intentos de publicación comunicados por el propietario no han cambiado la política observada de esta instancia. Ocho diagnósticos pasan con Chromium 155, pero no sustituyen los criterios sobre el navegador fijado. Se mantiene En curso y se prepara la continuación en otro chat.

## Objetivo y resultado esperado

Inicializar una base de desarrollo **local**, estática y reproducible con Astro, React, TypeScript y Tailwind CSS, y demostrar que su batería inicial de verificación funciona sobre una página construida y una interacción real.

El alcance exige un checkout instalable desde lockfile y comandos documentados de desarrollo, tipos, lint, formato, unitarias/componentes, E2E, accesibilidad y build. La base ya está implementada y comprobada salvo la validación obligatoria del navegador bloqueado; el [informe de ejecución](../../i01-execution-report.md) distingue resultados, errores y pendientes. No se declara el resultado totalmente verificado.

## Alcance

* Proyecto Astro con salida estática y una página provisional de comprobación del entorno; sin adaptador de servidor ni SSR.
* Una isla React con TypeScript, hidratada en navegador, que permita comprobar una interacción real. La fixture técnica propuesta contiene un campo con validación, respuesta visible y restablecimiento; no es una miniapp ni una función anunciada del producto.
* Tailwind CSS integrado en el build; comprobar un estilo calculado en navegador, además de la presencia de clases.
* TypeScript estricto, lint y formato mediante scripts del repositorio; configuración compatible con las versiones elegidas.
* Pruebas deterministas sobre la lógica realmente utilizada por la fixture, componentes React y navegador real. No añadir funciones artificiales solo para generar tests que pasen.
* E2E contra el build local mediante un servidor de preview controlado por el runner, con móvil/escritorio y comprobación básica de accesibilidad, exclusivamente en Chromium móvil emulado y escritorio.
* Versiones de runtime y gestor documentadas, manifiesto, lockfile y procedimiento de instalación congelada. Salidas generadas, dependencias y artefactos de pruebas ignorados por Git.
* README y arquitectura actual actualizados únicamente con capacidades implementadas y verificadas; instrucciones de arranque, logs, pruebas y restablecimiento sin secretos.

### Archivos previstos para la futura ejecución

Manifiesto y lockfile del gestor aprobado; configuración Astro, TypeScript, estilos, lint/formato, Vitest y Playwright; página/layout/estilos mínimos en src/; fixture y pruebas en ubicaciones separadas del catálogo real; .gitignore; documentación de requisitos y comandos. Los nombres finales dependen de las versiones e integraciones aprobadas y se fijarán antes del scaffolding, preservando los documentos y el historial existentes.

No crear un proyecto anidado por accidente ni ejecutar un generador que sobrescriba README, AGENTS, docs/ o .git. Las configuraciones y la fixture de este apartado ya se han creado durante la ejecución autorizada, sin sobrescribir el harness. Los nombres y alcance finales se describen en el informe.

## Exclusiones relevantes

* Primera miniapp real, catálogo y registro de miniapps, traducciones y rutas ES/EN completas, SEO/sitemap y experiencia final: pertenecen a I-02 o iteraciones posteriores.
* Backend, bases de datos, cuentas, sesiones, persistencia de usuario, APIs externas, analítica, pagos, dominio y licencia definitiva.
* Cloudflare, Wrangler, workflows de GitHub Actions, protecciones remotas, staging, producción, credenciales, despliegues y gates de release: no se configuran en esta base local. Los scripts deberán ser reutilizables por una futura CI.
* Instalación o integración de skills y comprobación de Claude Code/Gemini CLI; continúan en [PEND-001 y PEND-002](../tech-debt-tracker.md).
* Commits de implementación, pushes, merges o publicación sin autorización específica. El permiso de commit de I-00 no se extiende a I-01; el propietario autoriza posteriormente solo el commit y push a feature/i01-base-local-testing descritos en Control. No autoriza merges, cambios en master ni despliegues.

## Decisiones aprobadas aplicables

[H-001 y H-002](../../harness-decisions.md) gobiernan fuentes, autoridad e iteraciones. La aceptación de I-00 permite pasar a planificar este resultado independiente, sin aprobar por sí misma el producto o su stack.

La [definición](../../product-specs/index.md) está Aprobada y el [registro técnico](../../design-docs/index.md) registra Aprobada para ADR-MMA-001/002/003/005/006/008/015 por los bloques A/B del propietario el 2026-11-04, con las tecnologías y versiones del paquete. El resto de ADR conserva Propuesta. Estas aprobaciones no autorizaban por sí mismas implementar; el propietario autorizó posteriormente la ejecución y esta se registra en el Control actual.

## Decisiones consolidadas aprobadas

El [paquete A/B/C aprobado](../../design-docs/i01-approval-proposal.md) conserva la definición, distingue elecciones anteriores de concreciones nuevas y fija la tabla completa de versiones aprobadas, con evidencia de compatibilidad declarada. El propietario aprueba expresamente los tres bloques el 2026-11-04; la ejecución se autoriza posteriormente de forma expresa y no se reabren cuestiones mecánicas ya cubiertas.

**ADR necesarios:** 001 (Astro estático), 002 (React/TS strict), 003 (Tailwind), 005/006 (client-first sin backend/BD) y 008 (pruebas), más **015** (Node LTS/npm/reproducción), todos aprobados. Hoja completa de versiones auxiliares en el paquete. Hosting, registro de miniapps, CI/CD remoto y otros ADR quedan fuera del alcance.

**Versiones principales aprobadas:** Node 24.22.2 LTS, npm 11.19.1, Astro 7.4.5 con @astrojs/react 7.1.2, React/DOM 19.3.1, TypeScript 6.0.3, Tailwind/@tailwindcss/vite 4.3.4, Vite 8.3.5, Vitest 5.1.0, React Testing Library 16.3.3 con jsdom 30.1.3, Playwright 1.64.1, axe-core y @axe-core/playwright 4.14.0, ESLint 10.14.0 y Prettier 3.9.10. Versiones auxiliares aprobadas y fuentes exactas en el paquete.

**Compatibilidad comprobada sin instalar:** 70 relaciones declaradas de engines, peers y dependencias compartidas. Se evita TypeScript 7 por incompatibilidad declarada con astro check/typescript-eslint; se evita el plugin opcional jsx-a11y 6.10.2 porque no declara ESLint 10. La resolución transitiva, instalación y funcionamiento real todavía deben verificarse durante la ejecución autorizada.

**Configuración aprobada:** TS strict; ESLint flat config recomendado JS/TS/Astro/React Hooks con cero warnings; Prettier + parser Astro para código/configuración; Vitest con proyectos unit (Node) y components (jsdom); Playwright únicamente chromium-desktop (Desktop Chrome) y chromium-mobile (Pixel 7 emulado); axe dentro de la suite E2E con tags WCAG 2.2 AA y teclado/foco manual. Sin React Compiler ni peers opcionales no utilizados.

**Otros motores:** Firefox y WebKit no se instalan ni se ejecutan en I-01. Evaluar al menos otro motor antes del lanzamiento en una iteración posterior con actualización de ADR-008 y evidencia propia. Una emulación móvil Chromium no acredita un dispositivo físico ni otro motor.

**Política aprobada:** dependencias directas exactas y package-lock.json, npm ci para reproducción, sin forzar peers; altas/críticas sin resolver bloquean la entrega salvo excepción humana justificada. Registrar riesgos menores, revisar licencias y no imponer cobertura global arbitraria. La licencia de distribución del proyecto sigue pendiente. Las decisiones duraderas nuevas mantienen las reglas del harness; nombres de archivos y detalles locales cubiertos por el alcance se resuelven mecánicamente.

**Compatibilidad real y ajustes:** tras autorización expresa, verificar instalación, tipos, lint, pruebas automatizadas y build. Si una versión presenta incompatibilidades, documentar el problema y proponer el ajuste mínimo compatible. Pueden aplicarse solo ajustes mecánicos cubiertos por los ADR aprobados dentro de la ejecución autorizada, registrando el cambio y repitiendo verificaciones afectadas. Un cambio material de tecnología, arquitectura o alcance requiere nueva aprobación antes del trabajo afectado. La autorización actual permite el trabajo dentro de ese alcance; esta condición no lo amplía ni permite forzar peers o desactivar verificaciones.

## Trabajo previsto después de aprobación y autorización

1. Confirmar estados canónicos, versiones aprobadas, recursos, red y herramientas disponibles. Usar el checkout existente; no crear worktrees sin petición expresa.
2. Preparar el scaffolding mínimo sin sobrescribir el harness. Añadir las integraciones y versiones aprobadas con un único gestor y lockfile.
3. Construir la página provisional y la fixture técnica accesible con una interacción React y estilos Tailwind compilados; sin miniapps ni catálogo ficticio.
4. Establecer scripts y pruebas de tipos, estándares, lógica, componentes, navegador y accesibilidad. Vincular cada criterio a una señal que pueda fallar si la integración está rota.
5. Ejecutar build y preview, probar su comportamiento y repetir la instalación congelada y los comandos desde un estado limpio de artefactos. Conservar logs, recuentos y códigos de salida; no usar git clean ni borrar cambios del usuario.
6. Actualizar requisitos/arranque/evidencia y arquitectura actual. Revisar el delta, registrar pendientes reales y entregar el resultado para aceptación cuando todos los criterios aplicables pasen. No avanzar a I-02 automáticamente.

## Entorno y herramientas

Directorio previsto: /workspace/miminiapp, con Git y runtime/gestor aprobados. Durante I-00 se observaron Node 24.22.1 y npm 11.9.0. Se ha aprobado Node 24.22.2 LTS con npm 11.19.1; las versiones se contrastaron con metadatos oficiales, pero se han instalado/activado durante la ejecución autorizada. Node se descargó del origen oficial y se comprobó el SHA-256; npm ci reproduce el lockfile sin cambios. Esta base no necesita cuentas, secretos ni servicios externos de aplicación.

Las futuras instalaciones pueden requerir el registro de paquetes y descargas del navegador, más librerías del sistema. Inspeccionar red y capacidades reales antes de solicitar cambios. La autorización de ejecución está recibida. Toda instalación sigue las versiones/alcance aprobados y conserva las verificaciones de integridad y TLS.

## Criterios de aceptación de la ejecución

| ID | Resultado observable | Evidencia prevista |
| --- | --- | --- |
| I01-AC-01 | Instalación repetible con runtime/gestor documentados y lockfile; la instalación congelada no lo modifica. | Versiones, comando/exit status de instalación y comparación del lockfile antes/después desde estado limpio de dependencias o validación equivalente segura. |
| I01-AC-02 | Astro genera salida estática y el preview local sirve HTML y recursos correctamente. | Build exitoso, inspección de salida prerenderizada y petición HTTP representativa al preview. Sin adaptador SSR ni servicio dinámico añadido. |
| I01-AC-03 | React se hidrata en el build y una interacción cambia el resultado visible; no basta con render HTML inicial. | E2E sobre la fixture: entrada válida, acción y resultado esperado, sin errores relevantes de consola. |
| I01-AC-04 | Tailwind compila y produce el estilo esperado en navegador. | Comprobación de estilo calculado y cambio responsive representativo; no solo búsqueda de nombres de clase. |
| I01-AC-05 | Tipos, lint y formato ejecutan reglas reales mediante scripts versionados y propagan fallos. | Comandos y resultados correctos; comprobación negativa aislada y temporal de una infracción conocida, restaurada antes de entregar, para demostrar el código de salida de los controles. |
| I01-AC-06 | Unitarias y componentes ejercitan código utilizado por la fixture, incluidos caso válido, inválido/error y reset. | Suites con tests ejecutados y recuentos no nulos, expectativas observables e independientes; sin aserciones tautológicas. |
| I01-AC-07 | Playwright prueba el build local únicamente en Chromium, con proyectos chromium-mobile y chromium-desktop. | Página, recursos, hidratación, interacción, error y reset correctos en Desktop Chrome y Pixel 7 emulado; servidor controlado por el runner con reuseExistingServer=false, logs y trazas/capturas de fallos. Ningún Firefox/WebKit, staging o dispositivo físico se presenta como ejecutado. |
| I01-AC-08 | La fixture tiene controles accesibles y navegación por teclado/foco verificadas. | axe sin infracciones detectadas por tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, más revisión manual registrada de teclado/foco; el test a11y se incluye en E2E y se puede ejecutar aisladamente. No certifica por sí solo WCAG de todo el producto. |
| I01-AC-09 | El procedimiento de arranque, logs, pruebas y restablecimiento es repetible y la arquitectura describe lo existente. | README y ARCHITECTURE revisados, comandos probados desde su directorio, límites explícitos y artefactos generados fuera del control de versiones. |
| I01-AC-10 | El delta respeta las exclusiones y preserva las fuentes del harness. | Revisión de archivos y dependencias: sin miniapp real, catálogo, backend, secretos, CI remoto, infraestructura o skills ni cambios de gobierno no aprobados. |

## Pruebas a crear o modificar

* **Unitarias:** lógica pura realmente usada en la validación/normalización de la fixture, con valores normales, límites e inválidos.
* **Componentes:** etiquetas y estados visibles, entrada/error/respuesta y restablecimiento con React Testing Library, sin depender del detalle interno del componente.
* **E2E:** sobre la salida construida, interacción que demuestre hidratación, estilos computados, tamaños de pantalla y errores de consola/recursos; datos seguros y deterministas sin llamadas externas.
* **Accesibilidad:** axe en la fixture y revisión manual explícita de teclado/foco.
* **Reproducción:** instalación congelada, tipos/lint/formato y build repetibles; el proceso debe conservar el código de salida del runner. Registrar fallidos, omitidos y no ejecutados por separado; cero tests no valida el flujo.

No se inventan funciones de negocio ni una primera miniapp para alimentar las pruebas. La fixture demuestra integración real del stack y los runners; los casos de producto llegarán con su alcance aprobado.

## Verificaciones y evidencia

Los siguientes son **scripts y comandos aprobados e implementados**. Directorio de trabajo: /workspace/miminiapp. Los resultados reales constan en el informe: las comprobaciones locales pasan y la parte de navegador fijado permanece bloqueada. Los flags --ignore-lock son un ajuste mecánico documentado de Astro 7 para controlar el proceso en primer plano bajo agentes.

| Comando | Implementación aprobada / comprobación |
| --- | --- |
| npm run dev | astro dev --host 127.0.0.1 --port 4321 --ignore-lock |
| npm run preview | astro preview --host 127.0.0.1 --port 4321 --ignore-lock |
| npm run check | astro check; TypeScript strict según configuración aprobada. |
| npm run lint | eslint . --max-warnings 0; flat config ignora artefactos y dependencias. |
| npm run format:check | prettier --check "src/**/*.{astro,ts,tsx,css}" "tests/**/*.{ts,tsx}" "*.{json,mjs,ts}"; sin modificar docs ni la referencia original. |
| npm run test:unit | vitest run --project unit; entorno Node, sin passWithNoTests. |
| npm run test:components | vitest run --project components; jsdom, React Testing Library/user-event y jest-dom. |
| npm run build | astro build; salida estática dist/. |
| npm run test:e2e | npm run build && playwright test; los dos proyectos Chromium, incluida accesibilidad. |
| npm run test:a11y | npm run build && playwright test tests/e2e/a11y.spec.ts; los mismos dos proyectos. |
| npm run verify | npm run check && npm run lint && npm run format:check && npm run test:unit && npm run test:components && npm run test:e2e |

Instalación realizada: package.json y lockfile con las versiones exactas aprobadas; npm install y npm ci correctos, sin modificación del lockfile al reproducir. El runtime y las variables de caché se activan como indica README. El instalador de Chromium siguiente requiere aplicar el permiso de red pendiente; no se cambia a otro navegador para declarar el criterio cumplido:

```text
node --version
npm --version
npm ci
npx --no-install playwright install chromium
npm run verify
npm audit --audit-level=high
```

Si faltan librerías del sistema, diagnosticar el requisito y usar el instalador oficial de dependencias de Chromium dentro del alcance autorizado; no instalar otros motores ni omitir E2E. La versión de Chromium corresponde al Playwright fijado, sin usar un canal externo que cambie independientemente.

Playwright arrancará npm run preview mediante webServer, URL de comprobación http://127.0.0.1:4321/, reuseExistingServer=false y timeout 60000 ms. baseURL será esa URL local para ambos proyectos, con datos deterministas, trace retain-on-failure y screenshot only-on-failure. Una prueba valida la fixture esperada para no confundir otro servicio con el build; el runner debe gestionar cierre del servidor y conservar errores. No se publican enlaces de preview ni se prueban URLs remotas.

La suite principal incluye a11y.spec.ts y los casos de interacción; test:a11y es un comando de diagnóstico selectivo. Los dos proyectos Vitest separan tests/unit y tests/components e informan recuentos no nulos. Las aserciones incluyen estado normal/inválido/reset, hidratación y estilo computado, no solo existencia de elementos o clases. Un fallo o ausencia de tests bloquea la entrega.

La entrega deberá incluir versiones resueltas, comandos/exit status, recuentos de tests, comprobaciones manuales, HTTP representativo, archivos afectados, artefactos y limitaciones. Conservar evidencia del mismo build probado y parar únicamente los procesos iniciados por esta iteración.

**Registro histórico de evidencia documental anterior a la autorización:** la primera revisión del borrador incluyó revisión independiente y 26 Markdown UTF-8 con 127 enlaces/anclas correctos. La consolidación previa comprobó 27 Markdown y 133 enlaces/anclas, y 70 relaciones de compatibilidad declarada mediante consultas de solo lectura, manteniendo las referencias al I-00 aceptado. Aquella consolidación añadió propuestas sin aprobarlas. La indicación humana de aquella etapa aprobó los tres bloques; se registraron la definición Aprobada, los siete ADR Aprobada y el plan Aprobado sin crear archivos de producto ni atribuir autorización de ejecución. Se consultaron entonces metadatos oficiales y contrastaron versiones, sin instalar ni ejecutar paquetes. En esa etapa no se ejecutaron instalación, build, tipos/lint, unitarias, componentes, E2E ni accesibilidad de aplicación. Aprobar este documento no acredita esos resultados ni autoriza por sí mismo su ejecución.

La comprobación documental de aquella etapa posterior al registro de aprobación pasó con 27 Markdown UTF-8 y 134 enlaces/anclas locales, los diez criterios presentes, siete ADR Aprobada y siete Propuesta, e historial I-01 Borrador → Aprobado sin autorización atribuida. Revisión independiente sin hallazgos materiales y git diff --check correcto. En esa etapa solo cambiaron documentos; I-00, gobierno e historial aceptados y el commit local anterior se conservaron. La verificación real de aplicación todavía no se había ejecutado; los resultados posteriores se registran en Resultado actual y en el informe.

## Riesgos y recuperación

* Incompatibilidad entre versiones de Astro, React, Tailwind, Node y herramientas: resolver antes del scaffolding; no aplicar una integración obsoleta ni forzar la instalación ignorando dependencias incompatibles.
* Navegador o librerías del sistema no disponibles: diagnosticar el requisito concreto y continuar verificaciones independientes; no sustituir un E2E requerido por un check trivial.
* Sobrescritura del harness por un generador: inspeccionar los archivos previstos y preservar el commit de I-00 y cualquier cambio posterior del usuario. No usar resets destructivos para limpiar.
* Confundir fixture con producto o ampliar a catálogo/CI/hosting: mantener exclusiones; proponer otra iteración si aparece esa necesidad.
* Recuperación local: detener solo los procesos propios y revertir únicamente el delta de implementación identificado, preservando documentos aceptados y cambios ajenos. No hay infraestructura remota que revertir dentro de este alcance.

## Punto de parada

**Ahora:** ejecución autorizada y en curso por indicación posterior del propietario. Registrar evidencias y límites; detener solo el trabajo afectado ante una decisión material nueva. Se permite únicamente el commit y push del traslado expresamente autorizado, siguiendo la [guía de continuación](../../i01-handoff.md). No iniciar I-02 o servicios remotos; futuros commits/pushes requieren autorización específica.

**Tras una futura ejecución:** registrar Verificado únicamente con criterios y evidencias suficientes, solicitar aceptación y mantener el plan activo hasta entonces. No iniciar I-02 ni publicar. Este plan no recibe autorización por herencia de I-00 ni por su propia aprobación.

## Progreso

**Historia de aprobación, anterior a la implementación:** se conserva la preparación en Borrador posterior al commit local de I-00. El propietario aprobó los bloques A/B/C con tecnologías, versiones, alcance y criterios; el estado pasó entonces a Aprobado. En esa etapa no se habían creado archivos de producto, instalado paquetes, configurado servicios, realizado nuevos commits/pushes ni ejecutado implementación. La aceptación de I-00 y su desviación histórica no se reescriben.

## Comprobación de condiciones de aprobación de PLANS.md

| Condición Borrador → Aprobado | Evidencia documental |
| --- | --- |
| Responsable identificado | Propietario de MiMiniApp, por rol, y aprobación expresa de los tres bloques. |
| Objetivo, resultado, alcance y exclusiones precisos | Base local estática y fixture técnica con pruebas; sin catálogo, miniapp real, CI remoto o despliegue. |
| Decisiones aplicables vigentes | Definición y ADR-001/002/003/005/006/008/015 aprobados el 2026-11-04 en sus fuentes canónicas, con versiones exactas. |
| Criterios y verificaciones suficientes | I01-AC-01–10, suites y comandos concretos, recuentos no nulos y evidencia futura descrita. |
| Pendientes/bloqueos identificados | Solo autorización expresa de ejecución para comenzar; compatibilidad real y disponibilidad de runtime/binarios son verificaciones del trabajo aún no ejecutado. No se presupone un fallo ni se presenta un resultado sin comprobar. |
| Aprobación humana explícita | «Apruebo los tres bloques» y «Bloque C: alcance y criterios de aceptación del ExecPlan I-01». |

Se cumplieron las condiciones de Borrador → Aprobado en la aprobación inicial. En aquel momento no se declaró Autorizado, En curso o Verificado ni se ejecutaron pruebas de aplicación. La autorización posterior y los resultados actuales se registran en Control, Progreso e historial; no se reescribe esa etapa. Licencia/dominio/analítica, otros ADR y ampliaciones futuras no bloquean esta base local, al estar expresamente fuera de alcance.

El propietario autoriza posteriormente de forma expresa la ejecución. Se registran Aprobado → Autorizado → En curso con fecha y actor actuales, sin modificar el alcance ni las restricciones de publicación. La nota anterior conserva la etapa de aprobación sin ejecución.

## Resultado actual y criterios pendientes

El [informe de ejecución](../../i01-execution-report.md) conserva comandos, recuentos, hashes, revisión visual/teclado, errores y el inventario de cambios. AC01/02/05/06/09/10 están comprobados; AC03/04/07/08 tienen evidencia complementaria en Chromium 155 pero requieren repetir la parte de navegador con Chromium 156 fijado. El runner requerido intentó ocho casos y falló antes de lanzar el navegador: no son pruebas pasadas ni fallos funcionales demostrados.

Ajustes mecánicos aplicados y verificados: FormEvent → SubmitEvent, dev/preview --ignore-lock para evitar el background inferido por Astro y favicon data:, para retirar el 404 automático, manteniendo todas las aserciones. Ninguna versión aprobada se cambió. npm audit: 0 altas/críticas y 11 moderadas de herramientas de desarrollo, evaluadas con seguimiento PEND-007 conforme a la política aprobada.

El dominio cdn.playwright.dev se añadió al borrador del entorno con guardado confirmado y requires_publish=true; la política observada continúa restricted/enforced, custom vacía y spec_revision 1 incluso tras los intentos de publicación comunicados por el propietario. El nombre temporal de diagnóstico del entorno se restauró a miminiapp. La configuración deseada no acredita acceso efectivo. Se ha autorizado trasladar el trabajo mediante una rama a otro chat; allí habrá que observar su política real e instalar el navegador antes de repetir las comprobaciones pendientes. No se eluden las restricciones de red ni se solicita un nuevo permiso de código para el mismo alcance.

Se mantiene **En curso** por ese bloqueo externo (PEND-006); no se inventa un estado adicional ni se pasa a Verificado/Aceptado. No se continúa a I-02. Los procesos propios se han detenido y los artefactos están ignorados. La aceptación de I-00 y su desviación de trazabilidad quedan intactas. Al terminar la verificación local no había commits o pushes posteriores a I-00; el propietario autoriza después el traslado específico registrado en Control y en el historial. La guía de continuación permite regenerar dependencias y evidencias que no se transportan por Git.


## Historial de estado

| Fecha | Estado | Actor | Evidencia o motivo |
| --- | --- | --- | --- |
| 2026-11-04 | `Borrador` | Codex | Preparación del plan independiente solicitada por el propietario después de aceptar y guardar I-00 en un commit local. Sin aprobación del plan ni autorización de ejecución. |
| 2026-11-04 | `Borrador` | Codex | Consolidación solicitada por el propietario: definición/ADR agrupados, versiones declaradamente compatibles comprobadas sin instalación, comandos y criterios concretos, Chromium móvil/escritorio exclusivo. Sin aprobación ni autorización de ejecución. |
| 2026-11-04 | `Aprobado` | Propietario de MiMiniApp | «Apruebo los tres bloques»: definición canónica, ADR-001/002/003/005/006/008/015 con tecnologías y versiones, alcance y criterios de I-01. Se cumplen las condiciones de PLANS.md. «Esta aprobación no autoriza todavía la ejecución». Compatibilidad real pendiente de implementación autorizada; ajustes mecánicos cubiertos permitidos entonces y cambios materiales sujetos a nueva aprobación. |
| 2026-11-04 | `Autorizado` | Propietario de MiMiniApp | Autoriza expresamente ejecutar I-01 conforme al alcance/ADR aprobados. Mantiene exclusiones: ninguna miniapp real, I-02, CI remoto, Cloudflare, despliegues, commits o pushes. |
| 2026-11-04 | `En curso` | Codex | Inicio de preparación del runtime, implementación de la fixture y configuración de pruebas con verificación de compatibilidad real y preservación de cambios existentes. |
| 2026-11-04 | `En curso` | Codex | Base local implementada con versiones aprobadas; instalación/ci, tipos/lint/formato, 14 unitarias, 9 componentes y build correctos; controles negativos válidos. Ocho E2E/axe complementarios en Chromium 155 pasan, pero el navegador fijado 156 no se descarga por 403 de política. Bloqueo PEND-006 y 11 riesgos moderados PEND-007 registrados; sin transición a Verificado. |
| 2026-11-04 | `En curso` | Propietario de MiMiniApp | «vale, haz lo que dices, lo autorizo»: autoriza la propuesta de rama feature/i01-base-local-testing, commit del trabajo de I-01 y push exclusivo de esa rama para retomar en otro chat. Sin aceptación de I-01, merge, cambios en master, CI, despliegues o inicio de I-02. Conserva el bloqueo y las evidencias; no concede permiso general para futuros commits/pushes. |
