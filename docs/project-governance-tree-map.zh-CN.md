# Project Governance Tree Map

Last updated: 2026-06-16

## Purpose

This file fixes the governance structure in tree form so new agents can see:

- the real project entry
- the current flywheels
- the execution modules beneath them
- the deprecated historical contexts

Main governance entry:

- [project-current-overview-and-doc-governance.zh-CN.md](./project-current-overview-and-doc-governance.zh-CN.md)

## Current Governance Tree

```text
DL new website
|- README.md
|  \- repository outer entry
|- docs/
|  |- project-current-overview-and-doc-governance.zh-CN.md
|  |  \- project governance entry
|  |- feature-registry.md
|  |  \- official feature-area registry
|  |- flywheel-2-visual-taste-frontend-performance.md
|  |  \- Flywheel 2 official document
|  |- deprecated-assumptions.md
|  |  \- deprecated project defaults
|  |- project-module-code-boundary-map.zh-CN.md
|  |  \- module -> code boundary map
|  |- project-governance-branch-and-doc-map.zh-CN.md
|  |  \- historical branch and doc relationship map
|  |- project-governance-tree-map.zh-CN.md
|  |  \- governance tree
|  |- search-optimization-entry.zh-CN.md
|  |  \- AEO / GEO / AI Search Optimization entry
|  |- content-update-quick-entry.zh-CN.md
|  |  \- narrow content entry
|  |- Knowledge.md
|  |  \- historical reference only
|  \- system_blueprint.md
|     \- historical reference only
|- Flywheel 1: AEO / GEO / AI Search Optimization
|  \- entity / answerability / schema / canonical / robots / sitemap / search-facing structure
|- Flywheel 2: Visual Taste / Frontend / Performance
|  \- Stitch -> Codex via MCP -> repo implementation -> Taste / Impeccable visual QA -> performance QA
|- Execution Modules
|  |- Website
|  |  \- shell / frontend / visual taste / performance
|  |- Booking System
|  |  \- booking rules / admin / form / CRM / table governance
|  |- Search Optimization
|  |  \- search answerability execution lane
|  |- Content
|  |  \- stories / posts / media
|  |- AI Chat
|  |  \- website chat entry
|  \- SMS
|     \- sms booking entry
\- Deprecated Default Contexts
   \- governed at the project-entry layer, not repeated in every module
```

## Global Structure Explanation

This project should be read from top to bottom in four layers:

1. `Project identity layer`
- answers what the website fundamentally is
- Dandy Lane is a Hobart CBD hidden-lane breakfast-to-brunch cafe
- no subsystem is allowed to replace this identity

2. `Project flywheel layer`
- answers what the website is being pushed toward
- Flywheel 1 = future-facing search answerability
- Flywheel 2 = current visual taste / frontend / performance refresh
- flywheels are project-level drivers, not code modules

3. `Execution module layer`
- answers where code work actually happens
- modules exist to keep ownership and edit boundaries clear
- modules implement work in service of the flywheels, but do not redefine them

4. `Historical / deprecated layer`
- answers what may still exist in history but must not become default context again
- old systems may remain as references, but they do not govern live work

## Flywheel Placement Rule

The two flywheels are intentionally placed above module boundaries.

That means:

- `AEO / GEO / AI Search Optimization` is not the same thing as the `Search Optimization` module
- `Visual Taste / Frontend / Performance` is not the same thing as the `Website` module

Correct relationship:

- flywheel = project-level direction
- module = execution boundary

This distinction must stay stable.

## Practical Interpretation

### 1. Top layer

The top layer is now:

- Dandy Lane Cafe website identity
- two-flywheel governance

It is no longer:

- booking-first default framing
- automation-first framing
- SEO-first framing

### 2. Flywheel layer

The two flywheels sit above module execution:

- search answerability flywheel
- visual taste / frontend / performance flywheel

Current urgency sits with the second flywheel.

### 3. Module layer

Modules exist to keep execution boundaries clear.
They do not override the top-layer governance narrative.

In practice:

- `Website` is the main execution surface for the visual flywheel
- `Search Optimization` is the main execution surface for the answerability flywheel
- `Content` is a supporting execution lane, not a flywheel
- `Booking System` is a major subsystem, but not the default website narrative
- `AI Chat` and `SMS` remain bounded interfaces, not top-layer project drivers

### 4. Historical layer

Old systems and examples may still exist in the repo or in history, but they are deprecated as default memory.

## Practical Tree Reading

If a new task arrives, read the tree in this order:

1. `Is this about website identity or project direction?`
- stay at `README.md` and the governance entry

2. `Is this about one of the two flywheels?`
- decide whether the task belongs to search answerability or visual taste / frontend / performance
- if it belongs to Flywheel 2, read the Flywheel 2 document before implementation

3. `Which execution module owns the actual code?`
- `Website`
- `Search Optimization`
- `Content`
- `Booking System`
- `AI Chat`
- `SMS`

4. `Is this only historical context?`
- if yes, read branch or historical docs only as reference
- do not inherit the old framing as current project logic

## One-Line Rule

Read the project as a Dandy Lane website with two active flywheels and clear execution modules, not as a booking-first or automation-first project.
