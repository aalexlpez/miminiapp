# Skills frontend locales

Integración de desarrollo de [H-008](../../docs/harness-decisions.md#h-008--skills-frontend-locales-y-uso-manual-contextualizado),
ejecutada en FE-01/I2. [Uso y límites comprobados](../../docs/guides/frontend-skills.md).
El [manifiesto](manifest.json) distingue origen, revisión, hash upstream,
adaptación y contenido local. Actualizar mediante diff revisado, sin instalador
global, hooks o tareas automáticas. Estos archivos no se importan desde el producto.

| Ayuda | Procedencia fijada | Adaptación |
| --- | --- | --- |
| Impeccable 4.9.2 | pbakaus/impeccable, d41d9860b0094dcb68030657da63461212835aaa | SKILL.md conserva el texto original con instrucciones locales añadidas y señaladas. Se copian todos los playbooks y el launcher POSIX/VERSION/checksums; tres playbooks normalizan espacios finales/EOF con aviso local y trazabilidad en el manifiesto. Se añade un lanzador local de comandos limitados. |
| Web Design Guidelines | vercel-labs/agent-skills, 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62 | SKILL.md es una adaptación redactada localmente del procedimiento; no se redistribuye el texto original de ese paquete. |
| Reglas Vercel | vercel-labs/web-interface-guidelines, 434b7f91364665f2f733b310ec54809bf8f37937 | Snapshot íntegro de command.md en reference/rules.md; aplicar la matriz contextualizada del proyecto. No descargar main durante una revisión. |

Impeccable conserva su [licencia Apache-2.0](impeccable/LICENSE) y
[NOTICE](impeccable/NOTICE.md), incluida la atribución de las referencias nativas
derivadas de ehmo. La instalación incluye referencias a capacidades opcionales;
su presencia no las autoriza. No se copian configuraciones de subagentes,
catálogo de fuentes, bundles de inyección, launcher Windows ni metadatos para
comandos ajenos al perfil verificado. No se promete su funcionamiento.

El motor tiene una versión independiente: **0.1.25**, fijada por el VERSION y
los checksums upstream, no 4.9.2. Solo se prepara el binario Linux x64 comprobado,
fuera de Git en .local/skills/impeccable; se verifica SHA-256 antes de cada uso.

agent-skills declara MIT en su README de la revisión fijada, sin LICENSE separado
en ese árbol. Se conserva esta procedencia sin inventar un aviso de copyright o
redistribuir sus instrucciones literalmente. El snapshot de reglas sí dispone de
[LICENSE MIT upstream](web-design-guidelines/LICENSE), copyright 2025 Vercel Labs,
que se incorpora íntegro. Estas licencias cubren el contenido externo indicado;
no resuelven ni modifican la licencia general del producto.

Descubrimiento nativo en el cliente de esta sesión **pendiente**. Los archivos,
la lectura manual y el motor verificado no bastan para afirmar carga automática
o integración comprobada de Claude/Gemini. Véase el informe I2 del plan.
