# Uso local de las skills frontend

[H-008](../harness-decisions.md#h-008--skills-frontend-locales-y-uso-manual-contextualizado)
aprueba estas ayudas y sus permisos; [FRONTEND](../standards/FRONTEND.md) fija el
estándar propio. [Manifiesto y avisos](../../.agents/skills/README.md) identifican
las copias/adaptaciones. Esta guía describe el perfil realmente incorporado;
no sustituye fuentes de producto, decisiones o autorización del ExecPlan.

## Estado comprobado

En FE-01/I2 se incorporan Impeccable y la adaptación de Web Design Guidelines,
se ejecuta su revisión manual acotada y se verifica el motor 0.1.25 Linux x64.
La **carga nativa en el cliente sigue bloqueada**: skills.list del executor
devuelve lista vacía en esta sesión, iniciada en /workspace, con repo hijo
/workspace/miminiapp. Codex CLI 0.166.0-alpha.1 tampoco llega a skills/list:
necesita escribir installation_id bajo /home/agent/.codex, de solo lectura.
No se modifica ese directorio ni se instala nada globalmente. La mera ubicación
del repo hijo no demuestra la causa del primer resultado vacío.

El siguiente ensayo concreto es abrir una sesión cuyo proyecto/cwd sea la raíz
de este repo y comprobar su lista de skills con recarga, si existe. Verificar
invocación pertinente de diseño, revisión técnica y no activación en una tarea
ajena. Es una comprobación pendiente, no una garantía de que reiniciar lo resuelva.
El propietario acepta después el uso explícito comprobado y solicita continuar
con I3. FE-I2-01/FE-AC-02 se actualizan en el plan: I2 queda completada para ese
perfil; la detección automática se conserva como limitación, sin exigir resolverla
para avanzar. Abrir otro cliente/sesión es una comprobación opcional futura.
No se exige instalar otro cliente ni se atribuye compatibilidad a Claude/Gemini.

## Uso y contexto

Desde el repo, cuando el cliente realmente reconozca las skills, invocar
`$impeccable` con tarea/objetivo concretos o `$web-design-guidelines` con archivos.
Para el perfil manual observado, leer su SKILL.md y las referencias pertinentes
y declarar ese método; no llamarlo descubrimiento automático.

Impeccable aporta diseño/revisión del recorrido; Plan B usa Operate y onboard.
Vercel revisa implementación con el snapshot local de reglas. Leer antes
AGENTS.md, ficha de producto, decisiones aplicables, arquitectura, estándares y
plan actual. La ausencia de PRODUCT.md/DESIGN.md en el diagnóstico del motor
no invalida esas fuentes ni autoriza generar otras. Una revisión acotada manual
no equivale a la crítica completa independiente con dos subagentes.

No transformar en errores las excepciones aprobadas de texto/pegado/movimiento.
La URL de Plan B permanece limpia, sin estado ni texto personal; no seguir la
sugerencia genérica de sincronizar useState con query. No añadir nuqs u otras
dependencias, beforeunload global, confirmaciones de reset, reglas Title Case
en ES o autodetección de idioma por preferencia de una checklist: los contratos
existentes tienen prioridad. Semántica nativa, foco, recuperación, hover y reflujo
se revisan sobre el resultado real, justificando aplicabilidad.

## Motor de desarrollo

Requisitos comprobados: Linux x64, sh, curl y sha256sum. Ejecutar desde la raíz:

```sh
.agents/skills/impeccable/scripts/miminiapp-impeccable prepare
.agents/skills/impeccable/scripts/miminiapp-impeccable engine-probe
.agents/skills/impeccable/scripts/miminiapp-impeccable telemetry status
.agents/skills/impeccable/scripts/miminiapp-impeccable context
.agents/skills/impeccable/scripts/miminiapp-impeccable detect src/miniapps/plan-b
```

Solo prepare descarga la release pública fijada. Antes de ejecutar se comprueba
SHA-256 contra el digest de la revisión aprobada; si falta o cambia el binario,
las otras llamadas fallan sin descargarlo. Caché ignorada por Git en
.local/skills/impeccable. No se usa un binario global o arbitrario de PATH.

El lanzador local establece IMPECCABLE_NO_TELEMETRY=1, IMPECCABLE_HOME,
IMPECCABLE_NO_UPDATE_CHECK=1 e IMPECCABLE_NO_STALENESS_CHECK=1; el config de
proyecto fija telemetry/updateCheck false. No se confía solo en telemetry para
limitar red: el perfil rechaza catálogo, generación, hooks, live-server,
instaladores y otros comandos. El launcher upstream se conserva como procedencia;
no se usa para saltarse este perfil. No se configura ningún hook ni automatización.
El diagnóstico context upstream se lee junto con la adaptación; no carga por sí
solo los documentos canónicos con otros nombres.

En las llamadas observadas engine-probe/context/detect no hubo conexiones IP.
No es una auditoría de todo el binario ni una barrera de red del sistema operativo.
El detector devolvió cero hallazgos en el alcance leído, mientras la revisión
renderizada encontró fricción: un resultado vacío no certifica UX/accesibilidad.
El navegador, archivos locales y tests del proyecto siguen disponibles sin skills.

## Revisión y actualización

Registrar candidato, reglas/SHA, archivos y referencias consultados, método real,
hallazgos aplicables/excepciones y efectos. Mantener motores, sesiones y logs fuera
de Git/dist. No importar estas carpetas en src ni modificar package/lockfile para
instalar skills. Una actualización requiere revisar el diff y regenerar manifiesto
y verificaciones afectadas; no descargar latest durante una revisión normal.

En FE-01 se mantienen commits locales por iteración y no se hace push ni se abre
otra PR hasta completar la implementación/regresión local del plan. Las revisiones
de dirección I3 y acabado I6 siguen correspondiendo al propietario; otros
participantes son opcionales. El plan conserva el estado y las evidencias de
CI/staging pendientes de la entrega final.
