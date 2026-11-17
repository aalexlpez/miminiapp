# Calidad y estrategia de verificación

**Estado actual — 2026-11-17:** I-03 aceptado, con CI/staging y promoción manual implementados. PB-01 conserva su aceptación global y comprobaciones físicas pendientes. FE-01/I1 está completada: ADR-MMA-022 y H-008 aprobadas; la aprobación del propietario basta como aceptación humana y las pruebas con otras personas son opcionales. Las verificaciones técnicas siguen vigentes; skills incorporadas y uso manual comprobado en FE-01/I2, dirección/contrato aprobados en I3. La aprobación del acabado y la regresión final siguen pendientes. Versiones, runs, condiciones y límites en el [informe FE-01/I1](../reports/fe01/execution.md#i1--base-y-propuesta-del-estándar); el [informe PB-01/I6](../reports/pb01/execution.md#i6--regresión-y-análisis-global) conserva su evidencia histórica.

**Antecedente I-01:** la suite inicial pasó con 14 unitarias, 9 componentes y 8 E2E/axe con Chromium fijado; I-01 Aceptado el 2026-11-05. Los párrafos de implantación inicial siguientes conservan ese contexto histórico; no describen la ausencia actual de CI o staging.
**Responsable:** propietario de MiMiniApp.
**Actualizado:** 2026-11-17 (estado vigente y contexto histórico; política de evidencias sin cambios).

El [dossier v1.2](../references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), sección 6, reporta pruebas automatizadas recurrentes como requisito acordado. [ADR-MMA-008](../design-docs/index.md) está Aprobada por el propietario el 2026-11-04, con herramientas, versiones, comandos y política local del [paquete I-01](../design-docs/i01-approval-proposal.md). Los gates remotos y otros motores se concretarán en sus iteraciones posteriores. Instalación real, npm ci, tipos/lint/pruebas de lógica/componentes y build ya se han comprobado. La parte de navegador requerida pasa también con Chromium 156 fijado, incluidos axe y revisión asistida de teclado/foco y capturas responsive. Resultados, controles negativos y límites en el [informe de ejecución](../reports/i01/execution.md). No hay puntuación global ni certificación de calidad; los resultados locales medidos, incluidos los de navegador, se distinguen de los objetivos de producto y entornos remotos.

## Capas de verificación

| Capa | Herramienta / estado | Resultado que debe demostrar |
| --- | --- | --- |
| Tipos y Astro | TypeScript estricto y `astro check` | Contratos y páginas coherentes. |
| Estándares | ESLint y Prettier del paquete I-01 aprobado | Reglas acordadas verificables en local y CI. |
| Dominio | Vitest | Resultados normales, límites, inválidos y regresiones con expectativas independientes. |
| Componentes | React Testing Library | Formularios, eventos y estados observables. |
| Navegador | Playwright | ES/EN, rutas, miniapps, demo/reset, móvil/escritorio y errores. |
| Accesibilidad | axe con Playwright y revisión manual | Hallazgos automáticos y teclado, foco, contraste, etiquetas y anuncios de resultados. |
| Dependencias | Auditoría del gestor y revisión de licencias | Riesgos y excepciones documentados; altas/críticas sin resolver bloquean la entrega local salvo excepción humana justificada, conforme al paquete aprobado. |
| Build | Build estático y comprobaciones de rutas/enlaces/metadatos | Salida reproducible, 404 correcto y borradores excluidos. |
| Staging | E2E y smoke HTTP contra URL remota explícita | Comportamiento del sitio desplegado y su identidad de versión. |
| Producción | Smoke HTTP/navegador tras deploy | Disponibilidad, versión y recorridos críticos. |

## Momentos y bloqueo — diseño original y circuito vigente

1. **Edición local:** pruebas rápidas afectadas, tipos y lint según cambios. Antes del PR, suite completa aplicable y build. No es necesario ejecutar toda la suite lenta en cada guardado.
2. **PR a staging:** repetir los mismos comandos versionados desde checkout limpio, con pruebas de lógica, tipos/lint, build, E2E básico ES/EN y accesibilidad. Un fallo deberá bloquear integración cuando se implementen los gates. Sin secretos de despliegue en PR no confiables.
3. **Tras desplegar staging:** probar su URL real con E2E, rutas, idiomas, recursos, responsive y miniapps modificadas. Comprobar la versión realmente servida y conservar reportes/trazas/capturas de fallos sin datos sensibles, con retención por definir.
4. **Antes de promover a main:** exigir evidencia vigente de staging y aceptación humana para el contenido a publicar. Un cambio posterior invalida esa validación; ver [fiabilidad](RELIABILITY.md).
5. **Tras producción:** smoke de la versión esperada. Un fallo genera incidencia y rollback controlado; no puede bloquear retroactivamente el deploy que ya ocurrió.

## Contrato inicial de comandos — antecedente I-01

Los scripts locales de I-01 ya están implementados y documentados en README. Los siguientes nombres conservan también los objetivos remotos futuros: test:smoke:staging y test:smoke:production no se han creado ni verificado, en aquel alcance inicial. Los comandos vigentes se consultan en package.json y CONTRIBUTING.md; el flujo actual usa test:remote y no se inventan los siguientes scripts históricos:

```text
npm run check
npm run lint
npm run format:check
npm run test:unit
npm run test:e2e
npm run build
npm run test:smoke:staging
npm run test:smoke:production
```

La iteración correspondiente debe implementarlos, documentar directorio y requisitos, y probarlos desde checkout limpio. E2E local/CI arrancará la versión construida; staging usará una URL remota explícita, por ejemplo `STAGING_BASE_URL`, sin iniciar accidentalmente un servidor local. El runner debe conservar códigos de salida y fallar ante aserciones fallidas. Cero tests no acredita el flujo.

El diseño de pruebas y CI del MVP no debe exigir servicios de pago ni un servicio externo de testing: pruebas y configuraciones viven en el repositorio y los mismos comandos deben poder ejecutarse localmente y en CI. Al implementar se verificarán las cuotas, condiciones y disponibilidad reales de la cuenta; este requisito no acredita gratuidad ilimitada ni autoriza contratar servicios.

## Criterios y evidencia

Cubrir los criterios de aceptación automatizables de cada iteración y límites de dominio críticos con fixtures seguros y deterministas. Evitar llamadas externas inestables y snapshots visuales masivos sin valor demostrado. No fijar porcentajes arbitrarios de cobertura; registrar qué revisión manual sigue siendo necesaria y por qué.

Una miniapp debe demostrar corrección de lógica, recorrido crítico por idioma cuando difieran textos/rutas, demo reproducible y reset, teclado y tamaños representativos, ausencia de solicitudes privadas inesperadas y revisión manual móvil. Aplicar las metas de [frontend](FRONTEND.md) distinguiendo objetivos de mediciones; las pruebas automáticas no certifican WCAG ni datos de campo.

En el ExecPlan correspondiente registrar ejecución real, resultado, versión/herramientas, target y artefactos vigentes. Separar aprobado, fallido, omitido y no ejecutado. Hay scripts locales y pruebas reales ejecutadas, con su evidencia en el informe. El navegador fijado ya está instalado y verify pasa completo; I-01 está Aceptado por el propietario el 2026-11-05; en ese informe inicial no había CI remota ni despliegues verificados. Esa limitación histórica no describe I-03/PB-01; consultar el estado vigente arriba. El diagnóstico de otro navegador no sustituye la referencia fijada.

## FE-01 — revisión técnica, visual y de uso

**Estado:** `Aprobado` el 2026-11-17 por el propietario al aceptar ADR-MMA-022, con el ajuste de que su aprobación es suficiente como aceptación humana. Las pruebas con otras personas son opcionales y no bloquean el cierre. Los criterios visuales se definen únicamente en [FRONTEND](FRONTEND.md#fe-01--estándar-de-calidad-frontend); este apartado organiza su evidencia, sin duplicarlos ni crear nuevos estados del plan. Los controles técnicos y contratos aplicables siguen vigentes.

| Comprobación | Qué se registra | Quién/cómo la observa |
| --- | --- | --- |
| Técnica | Contrato/base/candidato, comandos y resultados, límites de navegador/red/recursos, hallazgos y correcciones repetidas. | Toolchain existente y revisión de código; Vercel como checklist contextualizada con revisión de reglas identificada. |
| Visual e interacción | Dirección elegida, contenido real, jerarquía, estados, transiciones y archivos exportados; ámbito de los temas/tamaños revisados. | Navegador renderizado y revisión del propietario; Impeccable como apoyo para alternativas/crítica, sin delegar la aceptación a la skill. |
| Evaluación de uso | Recorrido y observaciones del propietario, si las hay. Si se realizan pruebas o mediciones adicionales, registrar tarea/condiciones, tiempo, dudas/ayuda, participantes y límites. | La aprobación del propietario es suficiente para la aceptación humana. Las pruebas con otras personas son un complemento opcional; no almacenar frases personales por defecto ni afirmar mediciones no realizadas. |

Secuencia: identificar brief/contexto → revisar dirección y cambios del contrato → implementar y observar → contrastar técnica/diseño → corregir → realizar la regresión final → entregar evidencia para la aprobación del propietario. La observación con otras personas puede complementar ese trabajo cuando se decida realizarla. Una autorización completa conserva sus puntos concretos de revisión, sin permisos adicionales por cada ajuste local.

Para FE-01/I6 basta la revisión y aprobación del propietario del recorrido, acabado y resultado, junto con las verificaciones técnicas aplicables. Se retira el mínimo de tres participantes y la obligatoriedad de medir primeras visitas en 120 s. Los dos minutos se conservan como objetivo de experiencia de la ficha; si se realizan mediciones, distinguir recorrido, guardado, condiciones y límites, sin presentar un E2E, una aprobación o una muestra pequeña como medición universal de comprensión/retención. La falta de participantes externos no bloquea el desarrollo; los defectos técnicos o incumplimientos esenciales siguen requiriendo corrección o decisión de alcance.

Las revisiones citan la versión/contenido de las reglas externas y las excepciones de ámbito aprobadas. No se instalan servicios de testing o hooks como efecto de esta decisión. Se conserva el circuito de verify/CI/staging vigente y el merge manual. La política de evidencias aprobada siguiente permanece intacta: el material visual versionado debe ser el mínimo necesario para una decisión real.

## Política de evidencias

Aprobada por el propietario el 2026-11-15 ([MT-01](../exec-plans/completed/MT-01-mantenimiento-y-colaboracion.md)). Se aplica al trabajo nuevo; la evidencia ya versionada de iteraciones anteriores se conserva como está.

**Resultados de pruebas.** La evidencia de que una batería pasó es su ejecución en GitHub Actions: se cita el enlace al run y el commit. Un resultado obtenido solo en local se describe como tal, con comando, versión del runtime y del navegador, y recuentos.

**Archivos locales.** `.local/` está ignorado por Git. Lo que hay ahí sirve a quien lo generó y a nadie más: no se enlaza desde la documentación ni se cita como evidencia consultable. Si un dato importa, se copia su resumen al informe.

**Capturas y vídeo.** Se versionan solo cuando alguien las necesita para aprobar un cambio visual, bajo estas reglas:

* en `docs/review/<iteración>/`, con un `manifest.json` o un README que diga qué muestra cada archivo;
* las mínimas que permiten decidir: normalmente una por idioma, tamaño y apariencia que cambie de verdad, no la matriz completa;
* PNG por debajo de 300 KB cada una; el vídeo solo cuando el movimiento es lo que se aprueba, y entonces un único clip corto;
* nunca con datos personales, secretos o cabeceras de sesión.

El resto de capturas se regenera con `npm run capture:review` o se adjunta al PR, donde GitHub las aloja sin engordar el repositorio.

**Informes.** Un informe de ejecución recoge qué se ejecutó, con qué resultado y qué quedó sin comprobar. Separa lo aprobado, lo fallido, lo omitido y lo no ejecutado.
