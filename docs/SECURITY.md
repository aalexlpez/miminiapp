# Seguridad y privacidad — límites propuestos

**Estado:** propuesta documental derivada del [dossier v1.2](references/MiMiniApp_Inicio_Proyecto_Harness_IA_v1.2.md), pendiente de formalización de las [decisiones](design-docs/index.md). No afirma controles ya desplegados.
**Responsable:** propietario de MiMiniApp.

## Datos y ejecución

El alcance propuesto no incluye cuentas, sesiones de producto, backend, bases de datos ni pagos. Las miniapps procesarán datos en el navegador por defecto, con `localStorage`/IndexedDB opcionales y justificados. Se debe explicar qué se guarda, cómo restablecerlo y, para datos de valor, evaluar exportación/importación; el almacenamiento del navegador no es copia de seguridad garantizada.

Cualquier API pública requiere aprobación individual y evaluación de CORS, condiciones, cuotas, datos transmitidos y costes. Un backend, servidor con secretos o almacenamiento remoto exige nueva decisión y plan autorizado. No se deduce permiso de una posible monetización futura. Analítica y trackers permanecen pendientes: no elegir proveedor ni activarlos por defecto.

Validar entradas no confiables, manejar errores y evitar inyección de HTML sin sanitización. Revisar licencias y riesgos de dependencias/recursos antes de incorporarlos. Las comprobaciones se concretarán al implementar, sin describirlas ahora como ejecutadas.

## Credenciales y contribuciones

Nunca incluir secretos privados en frontend, Git, archivos de ejemplo, documentación, reportes o capturas. Las credenciales necesarias se proporcionan por mecanismos seguros y con mínimo privilegio. Antes de pedirlas, comprobar nombres y presencia de bindings existentes y la operación concreta; no copiar valores al chat.

Los PR de colaboradores externos ejecutarán verificaciones sin secretos de Cloudflare o producción y sin código no confiable en jobs privilegiados. Se propone separar validación de PR y despliegues desde ramas protegidas; permisos concretos, eventos de CI y aislamiento deben aprobarse y verificarse antes de activar los workflows. Un CI verde no autoriza al agente a aprobar su PR, fusionar o publicar.

## Entornos y permisos efectivos

Staging propuesto es público, separado de producción y sin datos privados. `noindex` y excluirlo del sitemap no aportan autenticación. Las normas de Markdown orientan el comportamiento; protección de ramas, permisos, aislamiento y secretos deben respaldarlas mediante controles reales.

El modelo propuesto de promoción y rollback se desarrolla en [fiabilidad](RELIABILITY.md). Actualmente no se han configurado ni verificado protecciones, Workers, tokens o dominios de aplicación. No se crea infraestructura por este documento.
