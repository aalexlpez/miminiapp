---
name: web-design-guidelines
description: Review frontend code, accessibility, forms, interaction, and performance against Vercel Web Interface Guidelines adapted to MiMiniApp. Use for UI implementation reviews; not for unrelated backend or documentation tasks.
metadata:
  author: MiMiniApp (local adapter of the Vercel workflow)
  version: "1.0.0-mma.1"
---

# Web Design Guidelines — MiMiniApp

This is a locally authored adapter of the workflow in vercel-labs/agent-skills
at 1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62. It is not a verbatim copy or
an assertion of upstream certification. See [provenance](../README.md).

1. Read [AGENTS.md](../../../AGENTS.md), the target miniapp's product spec,
   applicable decisions, and the current ExecPlan. Scope the supplied target;
   for FE-01 the pilot is src/miniapps/plan-b, not a platform redesign.
2. Read [the fixed rules](reference/rules.md), from web-interface-guidelines
   434b7f91364665f2f733b310ec54809bf8f37937. Use this snapshot offline.
   Do not silently fetch main. Updating rules requires a reviewed source diff
   and a new manifest entry, not an automatic standards change.
3. Apply [FRONTEND's adoption matrix](../../../docs/standards/FRONTEND.md#matriz-de-adopción-y-conflictos-de-i1)
   before reporting violations. Preserve literal text/wrapping, the approved
   newline-paste exception, hero motion policy, and grayscale transition.
   Keep personal state out of URLs, the existing ES/EN routing, approved copy
   conventions and reset behavior; generic rules do not override those contracts.
   Native buttons already provide keyboard activation: do not add redundant
   key handlers merely to match a literal checklist. Do not invent irrelevant
   autocomplete values for free-form purpose/obstacle/action fields.
4. Inspect the actual source and, when relevant, the rendered target. Report
   actionable findings as `file:line — severity — evidence — recommendation`.
   Identify exceptions, false positives and untested states. A source review
   does not establish visual quality, retention, physical mobile compatibility,
   or actual human completion time.
5. Review only unless implementation is separately within authorized scope.
   Do not add dependencies, hooks, remote calls, subagents, or product changes
   as a side effect. The owner's approval suffices for human acceptance;
   testing with other people is optional. Technical checks remain required.
