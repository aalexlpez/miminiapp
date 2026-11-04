# Calidad y estrategia de verificación

**Estado:** diseño de pruebas trasladado, no suite implementada.
**Responsable:** propietario de MiMiniApp.
**Actualizado:** 2026-11-04.

El [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), sección 6, reporta pruebas automatizadas recurrentes como requisito acordado. [ADR-MMA-008](design-docs/index.md) conserva `Propuesta` hasta formalización canónica; herramientas, versiones, comandos y umbrales todavía deben concretarse. No hay puntuación de calidad ni resultados de aplicación medidos en esta instancia.

## Capas de verificación propuestas

| Capa | Herramienta candidata | Resultado que debe demostrar |
| --- | --- | --- |
| Tipos y Astro | TypeScript estricto y `astro check` | Contratos y páginas coherentes. |
| Estándares | ESLint y Prettier o alternativa aprobada | Reglas acordadas verificables en local y CI. |
| Dominio | Vitest | Resultados normales, límites, inválidos y regresiones con expectativas independientes. |
| Componentes | React Testing Library | Formularios, eventos y estados observables. |
| Navegador | Playwright | ES/EN, rutas, miniapps, demo/reset, móvil/escritorio y errores. |
| Accesibilidad | axe con Playwright y revisión manual | Hallazgos automáticos y teclado, foco, contraste, etiquetas y anuncios de resultados. |
| Dependencias | Auditoría del gestor y revisión de licencias | Riesgos y excepciones documentados, con severidades por decidir. |
| Build | Build estático y comprobaciones de rutas/enlaces/metadatos | Salida reproducible, 404 correcto y borradores excluidos. |
| Staging | E2E y smoke HTTP contra URL remota explícita | Comportamiento del sitio desplegado y su identidad de versión. |
| Producción | Smoke HTTP/navegador tras deploy | Disponibilidad, versión y recorridos críticos. |

## Momentos y bloqueo propuestos

1. **Edición local:** pruebas rápidas afectadas, tipos y lint según cambios. Antes del PR, suite completa aplicable y build. No es necesario ejecutar toda la suite lenta en cada guardado.
2. **PR a staging:** repetir los mismos comandos versionados desde checkout limpio, con pruebas de lógica, tipos/lint, build, E2E básico ES/EN y accesibilidad. Un fallo deberá bloquear integración cuando se implementen los gates. Sin secretos de despliegue en PR no confiables.
3. **Tras desplegar staging:** probar su URL real con E2E, rutas, idiomas, recursos, responsive y miniapps modificadas. Comprobar la versión realmente servida y conservar reportes/trazas/capturas de fallos sin datos sensibles, con retención por definir.
4. **Antes de promover a main:** exigir evidencia vigente de staging y aceptación humana para el contenido a publicar. Un cambio posterior invalida esa validación; ver [fiabilidad](RELIABILITY.md).
5. **Tras producción:** smoke de la versión esperada. Un fallo genera incidencia y rollback controlado; no puede bloquear retroactivamente el deploy que ya ocurrió.

## Contrato de los futuros comandos

Estos nombres son **objetivos**, no scripts existentes ni comandos ya verificados:

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

En el ExecPlan correspondiente registrar ejecución real, resultado, versión/herramientas, target y artefactos vigentes. Separar aprobado, fallido, omitido y no ejecutado. Hoy no hay scripts de aplicación, tests, CI ni entornos de despliegue verificados; la revisión documental no sustituye esas comprobaciones.
