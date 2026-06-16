# Dandy Lane Project Laws

Status: active structural reference

## Purpose

This file records the stable structural rules of the repository.

It does not define the top-level project narrative.
Top-level project governance belongs to:

- `README.md`
- `docs/project-current-overview-and-doc-governance.zh-CN.md`

## Repository Shape

The repo still follows a layered build model:

- `L0`: definitions and data
- `L2`: blocks and presentation fragments
- `L3`: assembly and generation logic
- `L4`: rendered outputs and pages

## Layer Rules

### 1. Contract-first

- shared facts should be defined in data before they are rendered
- avoid hardcoding business entities directly into output pages when they belong in source data

### 2. Unidirectional flow

- data should flow downward into blocks, assembly, and outputs
- output-layer decisions should not redefine data-layer truth

### 3. Boundary clarity

- structure rules live here
- project direction lives in governance docs
- module ownership lives in the boundary map

## Current Project Reminder

This repository is not governed by an `AI-first architecture` narrative.

The current project is governed by two flywheels:

1. `AEO / GEO / AI Search Optimization`
2. `Visual Taste / Frontend / Performance`

Current urgency belongs to Flywheel 2.
