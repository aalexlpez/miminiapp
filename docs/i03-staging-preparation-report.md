# I-03 — preparación del primer PR de publicación en staging

**Fecha:** 2026-11-06. **Estado:** implementación preparada para revisión; I-03 sigue `En curso`. Este trabajo no autoriza merge, activación o despliegue. Producción, promoción, rollback y cambio de predeterminada continúan bloqueados.

## Situación y alcance

El propietario declara creado `miminiapp-staging` con la plantilla básica de Cloudflare y configurados el Editor restringido y Account ID en GitHub Environment `staging`. Administra Cloudflare y los valores de credenciales. Codex no los solicita, no se conecta a Cloudflare y prepara los cambios en `feature/i03-staging-first-release` para un PR a `staging`.

Se consultó GitHub, sin alterar sus configuraciones: main/staging siguen protegidas en `73b8bd2`, con quality+promotion/quality respectivamente, app15368 y enforcement everyone; master sigue en214a3c1 y predeterminada. Merge commits habilitados, squash/rebase/auto-merge deshabilitados; ambos Environments existen con políticas de ramas personalizadas. La comprobación de lectura de Cloudflare no se ha ejecutado todavía. Las limitaciones administrativas anteriores no desaparecen por esta preparación.

La preparación anterior de bootstrap administrativo de Codex se conserva fuera del PR en `.local/verification/i03/superseded-b1/`, con copia y hashes comprobados antes de retirar sus archivos no utilizados. No se publicó ese contenido. No se añade un Admin a GitHub ni se necesita un secreto Cloudflare en Codex.

## Cambios de seguridad

* Se añade `deploymentsEnabled` por destino, con valor false para staging y producción, y autorizaciones separadas de promoción/rollback también false. La política global sigue cerrada. Una futura autorización de staging no habilita otros destinos.
* El flag de staging pasa a ser `I03_STAGING_PUBLICATION_AUTHORIZED`, de repositorio. El antiguo flag global no se acepta como sustituto. La cuenta aprobada queda fijada por hash y se compara antes de cualquier petición Cloudflare; Worker y origen siguen fijados por contrato.
* Los jobs de staging conservan `if: false`. Producción y rollback no se activan. El check obligatorio promotion ejecuta un rechazo explícito, sin un skip que pueda aparecer verde.
* Antes de credenciales o artefactos, la publicación exige contexto GitHub Actions, push al ref exacto, repositorio/ID, actor/triggering actor propietario y run/SHA válidos. Después se comprueba por API el PR realmente fusionado, su merger, calidad y vigencia. PR sin merge, fork, feature, dispatch o run obsoleto no habilitan escritura.
* Se conservan CI completo, Chromium fijado, build probado, paquete inmutable, IDs/digests/hashes, revalidación bajo bloqueo compartido y E2E remotos antes del recibo. El Worker debe existir: el publicador no crea recursos de bootstrap.

## Comprobación del Editor preparada para Actions

El cliente solo emite GET a la API de la cuenta fijada: settings y workers.dev del Worker staging, verificación del token cuando está disponible y settings del nombre fijo `miminiapp` como comprobación negativa. No crea producción, cambia permisos, lista recursos arbitrarios o escribe en otro Worker. Un acceso legible al otro Worker o errores de autenticación/servicio bloquean la publicación.

El informe saneado distingue acceso a staging, respuesta de la comprobación negativa, scope declarado por el propietario y `writeIsolation=not-tested`. Un 404 no acredita aislamiento y un 403 de lectura no acredita denegación de escritura. Las limitaciones de introspección no se solucionan concediendo permisos de administración. Esta prueba no puede certificar por sí sola toda la exclusividad del token; el alcance Editor por Worker parte de la configuración atestada por el propietario.

Los secretos se entregan exclusivamente a los pasos probe y publish del Environment staging, después de los gates y la verificación del artefacto; no a PR, build, instalación o variables globales. El JSON omite token, token ID, Account ID, headers y cuerpos sin filtrar. Se conserva siete días como artefacto. Wrangler mantiene sanitización de logs y no usa OAuth.

La prueba real se ejecutará en Actions tras un merge protegido expresamente autorizado y antes de escribir. No se promete acceso al secreto desde un PR abierto: impedirlo forma parte del control. No se ha ejecutado ningún deploy ni prueba real de permisos Cloudflare durante la preparación.

## Verificación realizada

Evidencia local ignorada: `.local/verification/i03/staging-first-release/`.

| Comprobación | Resultado |
| --- | --- |
| `npm run verify` | Exit0: tipos, lint, formato, validación offline de hosting, unitarias, componentes, build, E2E/axe e integración. |
| Tipos | 61 archivos, cero errores, warnings o hints. |
| Unitarias | 226 satisfactorias: contratos de acceso de solo lectura, no filtrado de credenciales, cuenta/destino, flags separados, contexto PR/ref/actor y auditoría de workflows/artefactos. |
| Componentes y E2E | 9 componentes y 26 E2E satisfactorias con Chromium fijado; integración modular y regresión I-01 correctas. |
| Build público | 12 archivos; sin fixtures/borradores. La traducción incompleta se rechaza en la integración. |
| Parche propuesto | Aplicado solo en una copia temporal para comprobar la futura configuración: 226 unitarias satisfactorias. No aplicado a la rama de trabajo ni a GitHub. |
| Alcance del parche | Prueba automatizada verifica delta exacto: únicamente tres campos de política, los dos if de staging y una expectativa explícita de la auditoría. Producción/promoción/rollback y todos los demás pasos permanecen iguales. |
| Revisión independiente | Corregidos pin de cuenta, manejo de401, conservación de evidencia saneada y validación exacta del delta de workflow. La compilación detectó y se corrigió un argumento de hash faltante antes de la batería completa satisfactoria. |

La expectativa del test nativo del probe admite tanto el rechazo por política cerrada como el rechazo por contexto no autorizado: ambos ocurren antes de usar credenciales/red. Tras ese ajuste se ejecutó la batería unitaria con la configuración futura en la copia temporal. La aplicación, dependencias y configuración ordinaria de hosting no se cambian.

## Activación que todavía requiere aprobación

El [parche de activación](staging-publication-activation.patch) está preparado y sin aplicar. El [procedimiento](i03-staging-startup.md) especifica: autorización expresa → aplicar parche en el mismo PR → CI verde → revisión final y variable de repositorio específica → merge manual del propietario. Solo ese merge a staging puede disparar el circuito autorizado. Ni este informe ni abrir el PR constituye esa autorización.

El PR se entrega en borrador. Antes del merge el propietario deberá pasarlo a listo para revisión y conservar las protecciones. Un fallo o timeout no autoriza rollback automático ni ampliación de permisos; se registra el estado y el propietario revisa Cloudflare. Los IDs del PR y los resultados remotos efectivamente observados se presentan al entregar; no se inventan pruebas de permisos, despliegue o identidad HTTP de la plantilla/web.
