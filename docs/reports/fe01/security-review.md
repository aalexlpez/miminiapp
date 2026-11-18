# FE-01/I7 — Dependencias y excepción acotada aprobada

**Estado: excepción aprobada por el propietario el 2026-11-18; deuda abierta no bloqueante para esta entrega FE-01.** Permite continuar la entrega por PR conforme a la autorización vigente; no autoriza merge/publicación por el agente ni da por verificado el plan. Base visual aprobada en I6: 7f027f3. Candidato funcional corregido y revalidado en I7: 2d213dd863d5efd49645b81fa80398adfa8295aa.

## Hallazgo comprobado

La reconsulta del 2026-11-18 mediante `npm audit --package-lock-only` informa **17 paquetes con severidad alta, 8 moderada y cero
críticos**, tanto en el candidato como en la base I1. Con `--omit=dev`, ambas
versiones tienen **cero vulnerabilidades**. Package/lockfile son idénticos: FE-01
no introduce las dependencias afectadas. Es un hallazgo real de la auditoría
actual, no una regresión añadida por el diseño ni una aceptación implícita del riesgo.

Los 17 paquetes altos comparten un aviso raíz de picomatch:
[GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), actualizado
el 2026-11-17 a las 15:56:44 UTC según GitHub. Puede bloquear el bucle de eventos
de Node al recibir patrones glob especialmente preparados. El lockfile contiene
picomatch 4.0.7 y 2.3.2, ambos marcados como desarrollo; el efecto se propaga por
Vite, Astro, Vitest y otras herramientas. Son 17 paquetes afectados por esa cadena,
no 17 avisos raíz independientes de severidad alta.

GitHub no identifica una primera versión corregida y la consulta al registro npm
confirma **4.0.7 como última versión publicada**. Las propuestas automáticas de npm afectan versiones de herramientas e incluyen
cambios de mayores o downgrades; no constituyen una versión corregida de picomatch
ni una remediación del conjunto ya validada. No se aplica audit fix, override, parche propio o cambio
de stack como remedio implícito. Las consultas iniciales del día anterior informaban 21 altas/11 moderadas. Se
normaliza la comparación al lockfile en ambas carpetas para no mezclar inventario
instalado y resolución del lockfile; los avisos raíz siguen siendo los mismos.
Los avisos moderados conocidos de minimatch y
Astro siguen registrados; el adaptador @astrojs/node no está instalado/desplegado.

## Alcance y exposición

La miniapp publicada contiene assets estáticos y React; no sirve Node, Vite,
picomatch o el servidor de desarrollo. Propósito/frases/horario se procesan en el
navegador y no se usan como patrones glob de esas herramientas. La revisión del
código y del build no identifica una vía desde esos campos al paquete afectado.

El riesgo permanece en las herramientas que ejecutan Node en desarrollo, GitHub Actions y Cloudflare Workers Builds durante la compilación:
patrones o código no confiables pueden afectar su disponibilidad. CI ejecuta código
de PR; los controles vigentes limitan permisos, secretos y duración del job, pero
no eliminan ese riesgo. No se afirma que cero avisos de producción sea una prueba
de ausencia de vulnerabilidades o que desarrollo/CI sean inatacables.

## Regla aplicable y aprobación

[QUALITY_SCORE, dependencias](../../standards/QUALITY_SCORE.md#capas-de-verificación)
exige: **«altas/críticas sin resolver bloquean la entrega local salvo excepción
humana justificada»**. El propietario aprueba esa excepción el 2026-11-18, tras
revisar el alcance del riesgo, mediante:

> Vale, vamos a dejarlo como deuda tecnica o como pendiente no bloqueante, pero que tendremos que investigar posible solucion periodicamente.

Esta indicación retira el bloqueo de dependencias para entregar el candidato
funcional 2d213dd863d5efd49645b81fa80398adfa8295aa y el lockfile auditado de FE-01.
No declara corregida la vulnerabilidad ni modifica la regla general.

## Condiciones y seguimiento

Se mantiene:

* herramientas de desarrollo para trabajo/CI del repositorio conocido; no exponer
  un servidor de desarrollo al público ni aceptar patrones glob desde la miniapp;
* despliegue estático, permisos/secretos, pruebas y merge manual vigentes;
* [PEND-007](../../exec-plans/tech-debt-tracker.md#pend-007--seguimiento-de-dependencias-de-desarrollo)
  abierto como deuda no bloqueante para esta entrega;
* investigación **mensual**, próxima revisión objetivo **2026-12-18**, y anticipada
  si aparece una versión corregida/aviso nuevo, cambia el candidato/lockfile o se
  amplía la entrada de contenido no confiable.

Responsable del seguimiento: propietario de MiMiniApp. La IA puede investigar al
retomar el mantenimiento; esta fecha no crea un recordatorio o ejecución en segundo
plano. No se activan jobs, Dependabot, Renovate u otras automatizaciones.
En cada revisión se registrarán fecha, avisos, versiones disponibles, opciones de
corrección compatibles, validaciones y siguiente revisión en PEND-007. El pendiente
se cierra al resolver el aviso mediante actualización/mitigación validada o retirar
la dependencia afectada, no por aceptar el riesgo.

La excepción no aprueba otros candidatos o nuevas publicaciones futuras, ni
rebaja el umbral de seguridad o cambia workflows. Permite continuar la entrega
conjunta y su CI; el merge y la aceptación final siguen siendo humanos. El riesgo
residual aceptado es la disponibilidad de desarrollo/CI/compilación en Cloudflare
ante patrones maliciosos; la miniapp estática publicada no ejecuta picomatch.

La reconsulta del 2026-11-18 confirma que CVE-2026-33671 y CVE-2026-33672 tienen
correcciones en 2.3.2/3.0.2/4.0.4 y ya están cubiertas por el lockfile. Son avisos
diferentes de CVE-2026-112366 / GHSA-fc5q-39xc-vjpf, todavía sin versión corregida
según GitHub; actualizar a esas versiones antiguas no resuelve este último aviso.

Evidencia estructurada, versiones, comparaciones y hashes en
[análisis I7](../../review/fe01/i7/analysis.json). **Aprobación: propietario de
MiMiniApp, 2026-11-18.**
