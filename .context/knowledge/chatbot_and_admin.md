# Chatbot & Admin Dashboard Design

## 1. Architectural Assessment (架构评估)
- **Layer 0 (Data)**: The `site.yaml` remains the static source of truth for the Chatbot's identity, system prompt, and business rules (e.g., 16 people/hr capacity, manual review > 6).
- **Layer 2 (Blocks)**: 
    - `chatbot-widget.html`: A floating UI block containing the client-side logic for API interaction.
    - `admin-bookings.html`: A block for the dashboard UI (list/calendar).
- **Layer 3 (Logic)**:
    - Client-side managers handle the "Semantic De-duplication" and state reconciliation before hitting the persistent data API (e.g., Google Sheets/Supabase).
- **Compliance**: The static site generates the *interface* for the admin and chatbot. Dynamic state is brokered through well-defined external API contracts. No dynamic logic is embedded in the build process itself beyond generating the configuration-defined UI.

## 2. Implementation Decisions

### Chatbot (Senior Concierge)
- **Knowledge Base**: Fed into the System Prompt based on `site.identity` and `pages` content in `site.yaml`.
- **Language Mirroring**: Client-side logic detects the first message's language (or uses simple prompt instruction) to maintain continuity.
- **Booking Integration**: The bot collects JSON-formatted booking data and sends it to the central management API.
- **Rules**:
    *   `group_size > 6` -> Tagged `Manual_Review`.
    *   `action='update'` -> Applied if person/contact exists for the same date.

### Admin Dashboard
- **Views**: Toggleable List and Calendar views using lightweight CSS grids.
- **Access**: A protected static route `/admin.html` (L4).
- **Functionality**: Fetch bookings from the external persistent storage (L0-contractual) and allow manual status updates (Confirm/Cancel/Edit).

## 3. Tooling / Tech Stack
- **Persistence**: External API (assumed to be the same as the booking form receiver).
- **UI**: Vanilla CSS Glassmorphism for the Chatbot; Clean, data-dense layout for the Admin.
