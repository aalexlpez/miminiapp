# Seguridad y privacidad — límites y estado de aprobación

**Estado actual — 2026-11-18:** límites client-first y calidad local aprobados; I-03 aceptado, con CI, staging y promoción manual implementados conforme a ADR-MMA-004/009/014. Plan B usa los contratos aprobados ADR-MMA-020/021. Correcciones PB-01/I6 integradas por PR #25. El candidato frontend FE-01/I7 tiene regresión local satisfactoria; el propietario acepta el riesgo de dependencias descrito abajo como deuda no bloqueante para esta entrega. CI/staging del nuevo candidato, pruebas físicas y aceptación global pendientes. Estados canónicos en el [registro técnico](../design-docs/index.md), [producto](../product-specs/index.md) y [PB-01](../exec-plans/active/PB-01-plan-b.md).
**Responsable:** propietario de MiMiniApp.

## Datos y ejecución

El alcance aprobado no incluye cuentas, backend, bases de datos ni pagos. Las miniapps procesan datos en el navegador por defecto. La apariencia usa localStorage conforme a ADR-MMA-019; Plan B usa sesión temporal conforme a ADR-MMA-020. Cualquier persistencia adicional requiere su justificación y aprobación. Explicar qué se guarda, cómo restablecerlo y sus límites; el almacenamiento del navegador no es copia de seguridad garantizada.

Cualquier API pública requiere aprobación individual y evaluación de CORS, condiciones, cuotas, datos transmitidos y costes. Un backend, servidor con secretos o almacenamiento remoto exige nueva decisión y plan autorizado. No se deduce permiso de una posible monetización futura. Analítica y trackers permanecen pendientes: no elegir proveedor ni activarlos por defecto.

Validar entradas no confiables, manejar errores y evitar inyección de HTML sin sanitización. Revisar licencias y riesgos de dependencias/recursos antes de incorporarlos. La regresión local final I6 pasa con 504 unitarias, 19 componentes, 146 E2E e integración, además de tipos/lint/formato/hosting. Esto no sustituye compatibilidad física o aceptación humana; evidencia y límites en el [informe I6](../reports/pb01/execution.md#i6--regresión-y-análisis-global).

**Auditoría vigente FE-01/I7 — 2026-11-18:** 17 altas, 8 moderadas y cero críticas en desarrollo; omit=dev: cero vulnerabilidades. Base I1 y candidato tienen package/lockfile idénticos y los mismos resultados. Las altas proceden del aviso raíz picomatch GHSA-fc5q-39xc-vjpf, propagado por la cadena de herramientas; no hay versión corregida publicada en la consulta actual. No se identifica exposición desde los campos de la miniapp a esos patrones, pero permanece riesgo en desarrollo/CI. El resultado anterior de 14 moderadas y cero altas/críticas es histórico, no la situación vigente. [Evaluación y excepción acotada](../reports/fe01/security-review.md) aprobada por el propietario el 2026-11-18: riesgo residual de disponibilidad en desarrollo, GitHub Actions y Cloudflare Builds aceptado como deuda no bloqueante para el candidato FE-01 auditado. Seguimiento mensual, próxima revisión objetivo 2026-12-18, y anticipado ante cambios o nueva corrección. La regla general de QUALITY_SCORE se conserva. Se mantiene [PEND-007](../exec-plans/tech-debt-tracker.md#pend-007--seguimiento-de-dependencias-de-desarrollo) abierto; sin actualización automática o cambio de umbral.

## Credenciales y contribuciones

Nunca incluir secretos privados en frontend, Git, archivos de ejemplo, documentación, reportes o capturas. Las credenciales necesarias se proporcionan por mecanismos seguros y con mínimo privilegio. Antes de pedirlas, comprobar nombres y presencia de bindings existentes y la operación concreta; no copiar valores al chat.

Los PR ejecutan verificaciones sin secretos de despliegue. El circuito privilegiado de staging/promotion conserva los guards de identidad, procedencia y cambios concurrentes aprobados en I-03. Un CI verde no autoriza al agente a aprobar su PR, fusionar o publicar. Las autorizaciones de cada entrega no activan automatizaciones nuevas.

## Entornos y permisos efectivos

Staging es público y separado de producción: https://miminiapp-staging.miminiapp-lab.workers.dev. Su manifest y run satisfactorio 44060190659 acreditan I5 en sourceSha 3d28184f3c90db44fe57a7592e23a5e71c071f23; no acreditan todavía las correcciones I6. noindex y excluirlo del sitemap no aportan autenticación. Las normas de Markdown orientan el comportamiento; permisos, aislamiento, identidad y secretos deben respaldarlas mediante controles reales.

El modelo de promoción se desarrolla en [fiabilidad](RELIABILITY.md) y el [informe I-03](../reports/i03/contract-verification-2026-11-16.md): inicio manual con SHA completo, sincronización del proyecto excluyendo secretos y preservando controles de producción, historiales independientes y PR con quality ligero. El propietario fusiona manualmente a main; Cloudflare Workers Builds es el único publicador de producción y reconstruye el código. Este documento no crea infraestructura ni cambia protecciones.

## Excepción aprobada de apariencia — ADR-MMA-019

El 2026-11-09 el propietario aprueba exclusivamente miminiapp.appearance con los valores light, dark, system. Se valida lo leído como enumeración cerrada; no se interpola contenido almacenado en HTML/CSS. No se escribe por entrar en la web, solo por elegir explícitamente. Lectura y escritura están protegidas: sin almacenamiento funciona en memoria de la página, y en la siguiente navegación completa vuelve al sistema si no pudo persistir. Sistema explícito se conserva como preferencia, nunca como color resuelto. El control permite volver a Sistema; eliminar la clave también recupera ese comportamiento. Los orígenes staging/producción son independientes. No se transmiten datos, no hay cookies/telemetría ni persistencia de pausa o actividad. El script inicial inline no requiere cambios de CSP/hosting en este alcance.

## Sesión y exportaciones aprobadas de Plan B — ADR-MMA-020/021

Plan B guarda únicamente su sesión versionada y validada en sessionStorage; conserva frases, paso, ejemplo y fecha narrativa al cambiar idioma dentro del origen. Leer/escribir/borrar se protege y avisa ante fallo; funciona en memoria si el almacenamiento no está disponible. Reset elimina solo su clave y recaptura la fecha de portada. No prometer que cerrar una pestaña borra irreversiblemente la sesión: la restauración depende del navegador. El estado no es una copia de seguridad.

Las exportaciones son acciones explícitas: .ics local, PNG local con aviso de texto incluido, Google con consentimiento previo y Cancelar, y compartir/copiar el enlace limpio de la herramienta sin el plan. No hay API/OAuth, analítica, backend ni llamadas previas a Google. Compartir nativo, clipboard, bloqueo de ventanas y fallos de canvas/descarga tienen rutas visibles de recuperación. Los E2E usan texto sintético y APIs controladas; no llaman automáticamente a Google. La matriz de importación, destinos reales, guardado de fondo y modo avión físico sigue pendiente. La revisión I6 comprueba red, texto escapado y liberación de recursos sin cambiar estos permisos.
