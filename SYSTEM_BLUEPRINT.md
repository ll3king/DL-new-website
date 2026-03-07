# Sanctuary System Manual: The AI-Driven Business Blueprint
*Harnessing Intelligence for Dandy Lane Cafe*

This manual serves as a high-level engineering blueprint for replicating the "Sanctuary" website system. It outlines the systematic approach used to build a robust, AI-first business portal that bridges the gap between premium aesthetics and deterministic operational logic.

---

## 🏗️ Phase 1: Harness Engineering (The Scaffolding)
The "Harness" is the infrastructure that connects your AI brain to the real world. For this project, it centers on **Standardization of Input**.

### A. The Inbound Adapter Pattern
To handle multiple channels (WhatsApp, Web, Messenger), we use a unified `InboundMessage` dataclass.
- **Pattern**: `Web/Hook -> Adapter -> standard_process(InboundMessage) -> Unified Brain`.
- **Why**: You only write the AI logic **once**. If you add a new channel (e.g., Telegram), you only need to write a small adapter to convert their JSON to your `InboundMessage` format.

### B. Service Injection
The "Brain" (AI) is kept decoupled from the "Backbone" (Data).
- **Wiring**: `GeminiBrain` is initialized with a `SheetsTool` instance.
- **Why**: This allows the AI to perform CRUD operations on the database without being hard-coded to a specific API.

---

## 🧠 Phase 2: The Deterministic Brain (Logic Design)
An LLM is a reasoning engine, not a database. To build a reliable booking system, we follow the **"Hard Guardrail"** principle.

### A. Tool-Calling vs. Prompting
- **Soft Instruction (Prompt)**: "Please guide groups > 6 to walk-in."
- **Hard Guardrail (Tool code)**: Inside `gemini_brain.py`, the `manage_booking` function contains:
  ```python
  if 6 < group_size <= 10:
      return "FAILED_WALK_IN_RECOMMENDED"
  if group_size > 10:
      # Triggers Manual Review + Yellow Highlight
      data['status'] = 'Manual_Review'
      data['notes'] = "SYSTEM ALERT: Large Group"
      return "FAILED_MANUAL_REVIEW_TRIGGERED"
  ```
- **Systematic Knowledge**: Tiered redirection reduces operational friction while capturing high-value leads for manual review.

### B. Language Mirroring
The system automatically detects the user's input language and shifts the entire persona to match (Mirroring). This is handled via the System Prompt context, ensuring the "Sanctuary" feel is accessible globally.

---

## 📊 Phase 3: The Data Backbone (Google Sheets as CMS)
We use Google Sheets as a "Human-Friendly Database".

### A. The "Janitor" Pattern (Housekeeping)
To prevent the main reservation list from becoming slow or messy:
- **Automation**: `APScheduler` runs at 04:30 daily.
- **Logic**: Moves `Historical` or `Archived` entries to a separate sheet.
- **Knowledge**: A clean database is a fast database. Automated archival is mandatory for high-traffic environments.

### B. Capacity Control Logic
- **Pre-check Loop**: Before confirming a time, the AI calls `get_current_bookings` to sum the guest count for that specific hour.
- **Constraint**: Strict limit of **16 guests per hour**.

---

## 🎨 Phase 4: UI/UX & AEO (The Interface)
The website is designed for both **Humans** and **AI Search Engines**.

### A. AEO (AI Engine Optimization)
- **JSON-LD**: Every page injects structured data for LLMs (Perplexity, ChatGPT, etc.) to read.
- **Knowledge**: In the 2026+ web, the "User" is often an AI agent. Make your data machine-readable first.

### B. Mobile "Sanctuary" Stacking
- **Visuals**: Dark mode, Glassmorphism (blur/transparency), and high-contrast typography.
- **UX**: Chat widgets are restricted to 1/3 screen height on mobile to prevent "Information Clutter".

---

## ⚙️ Phase 5: Quick-Start Checklist for New Sites
To replicate this functionality for a new client:

1.  **Environment Harness**:
    - Setup `.env` with `GEMINI_API_KEY`, `WHATSAPP_TOKEN`, etc.
    - Create a Google Service Account and share the target Sheet with it.
2.  **Configuration Wiring**:
    - Build `data/site.yaml`. This acts as the "Source of Truth" for the entire site's copy and AI persona.
3.  **Deploy Hooks**:
    - Point WhatsApp/Messenger Webhooks to `/api/whatsapp` and `/facebook/webhook`.
4.  **Verification**:
    - Run `diagnose_system.py` to ensure the "Wiring" (Harness) is healthy.

---
*Created by Antigravity (Google DeepMind) for the Dandy Lane Sanctuary Project. 2026.*
