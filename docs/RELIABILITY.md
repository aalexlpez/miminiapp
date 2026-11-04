# Fiabilidad y entrega — diseño propuesto

**Estado:** requisitos de flujo trasladados del [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), secciones 5.4 y 6.4, sin infraestructura implementada.
**Responsable:** propietario de MiMiniApp.

[ADR-MMA-009 y ADR-MMA-014](design-docs/index.md) conservan `Propuesta`. El dossier los reporta como acuerdos previos, pero aquí no se activa CI/CD, se crean ramas, se publica ni se configura Cloudflare.

## Circuito objetivo

`feature/*` → pruebas locales → PR a `staging` con las mismas pruebas desde checkout limpio → revisión y merge humanos → despliegue automático de staging → pruebas en URL remota real y aceptación humana → PR de `staging` a `main` → gate de promoción → revisión y merge humanos → producción automática → smoke.

En este modelo propuesto, una vez aprobado y activado mediante la iteración de infraestructura, **el merge autorizado a main constituye la autorización humana para publicar**; no se añade una segunda aprobación manual de despliegue. Esta descripción no autoriza ningún merge ni despliegue actual.

GitHub Actions + Wrangler es la implementación preferida del dossier, pendiente de evaluación y autorización. Workers Builds es alternativa; no activar dos mecanismos que desplieguen el mismo destino. Los nombres `miminiapp-staging` y `miminiapp`, y dominios `*.workers.dev`, son orientativos; no constan provisionados. Staging será permanente, público, separado y equivalente funcionalmente a producción, sin datos privados.

## Condiciones de promoción por implementar

* Proteger staging y main, con PR, revisión humana y checks obligatorios; evitar push directo, force push, borrado y bypass ordinario. Un procedimiento de emergencia requiere aprobación y documentación propias.
* Acreditar qué versión se sirve en staging mediante un mecanismo inocuo por diseñar, como un manifiesto de build sin secretos. Un log de CI verde no demuestra que ese contenido esté desplegado.
* Asociar pruebas remotas y aceptación humana al commit, árbol o artefacto exacto que se promociona. GitHub puede crear un SHA de merge nuevo: comparar equivalencia de contenido y reconstruir/probar según corresponda, sin asumir identidad de SHA.
* Si staging cambia después de validarse, invalidar la promoción o evitar nuevas integraciones hasta concluirla. Todo el contenido promovido se publica; no improvisar cherry-picks sin volver a validar el resultado.
* Ejecutar despliegues privilegiados solo desde ramas y workflows confiables. No exponer secretos de Cloudflare en PR externos o frontend; ver [seguridad](SECURITY.md).

## Salud, fallos y recuperación

Staging requiere pruebas remotas de ES/EN, rutas, recursos, catálogo, responsive y miniapps afectadas; [calidad](QUALITY_SCORE.md) define las capas propuestas. Producción requiere smoke tras deploy de disponibilidad, identidad de versión y recorridos críticos. Cuando exista una miniapp real de control, incluirla sin elegirla ahora.

Si un smoke falla, comunicar fallo, conservar evidencia segura y aplicar un rollback controlado al artefacto/versión anterior validado según el procedimiento que se apruebe. Antes de habilitar producción deben definirse responsables, criterio de rollback, comandos efectivos y comprobaciones posteriores; no hay todavía un mecanismo de recuperación probado.

## Límites conocidos

No hay URLs ni SLAs verificados. Un alojamiento estático económico no garantiza disponibilidad o capacidad ilimitadas; revisar límites vigentes de archivos, tamaño, builds y ejecución dinámica al implementar. No activar SSR o servicios de estado por anticipación. El dominio propio sigue pendiente y los procesos de desarrollo cloud no equivalen al alojamiento de producción.
