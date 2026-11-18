# FE-01/I7 — Dependencias y propuesta de excepción acotada

**Estado: propuesta pendiente de aprobación del propietario.** No autoriza entregar,
publicar o dar por verificado el plan. Base visual aprobada en I6: 7f027f3. Candidato funcional corregido y revalidado en I7: 2d213dd863d5efd49645b81fa80398adfa8295aa.

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

El riesgo permanece en las herramientas que ejecutan Node en desarrollo y CI:
patrones o código no confiables pueden afectar su disponibilidad. CI ejecuta código
de PR; los controles vigentes limitan permisos, secretos y duración del job, pero
no eliminan ese riesgo. No se afirma que cero avisos de producción sea una prueba
de ausencia de vulnerabilidades o que desarrollo/CI sean inatacables.

## Por qué no se entrega todavía

[QUALITY_SCORE, dependencias](../../standards/QUALITY_SCORE.md#capas-de-verificación)
exige: **«altas/críticas sin resolver bloquean la entrega local salvo excepción
humana justificada»**. La aprobación del acabado I6 ocurrió antes de presentar este
hallazgo y no autoriza ignorarlo. Sin excepción aprobada o corrección, I7 permanece
En curso, sin push/PR, CI nuevo o staging de este candidato.

## Propuesta concreta para el propietario

Aceptar una excepción únicamente para entregar el candidato funcional 2d213dd863d5efd49645b81fa80398adfa8295aa y
el lockfile auditado en FE-01, manteniendo:

* herramientas de desarrollo para trabajo/CI del repositorio conocido; no exponer
  un servidor de desarrollo al público ni aceptar patrones glob desde la miniapp;
* despliegue estático, permisos/secretos, pruebas y merge manual vigentes;
* PEND-007 abierto y reevaluación en cuanto exista versión corregida, cambie el
  lockfile/código funcional evaluado o se amplíe la entrada de contenido no confiable.

La excepción no aprueba otros candidatos o nuevas publicaciones futuras, ni
rebaja el umbral de seguridad o cambia workflows. Permitirá continuar la entrega
conjunta y su CI; el merge y la aceptación final siguen siendo humanos. El riesgo
residual aceptado sería disponibilidad de desarrollo/CI ante patrones maliciosos.

Si no se aprueba, mantener la entrega bloqueada y preparar mantenimiento específico
cuando exista corrección compatible o se decida otro remedio. No presentar el
hallazgo como resuelto por anotarlo o por tener pruebas funcionales verdes.

Evidencia estructurada, versiones, comparaciones y hashes en
[análisis I7](../../review/fe01/i7/analysis.json). **Aprobación: pendiente.**
