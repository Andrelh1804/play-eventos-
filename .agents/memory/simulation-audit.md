---
name: EventOS Simulation Audit & Real Implementation
description: Documents all simulated code that was removed and replaced with real Firestore-backed functionality in the PLAY+EVENTOS platform.
---

## What was removed (simulations)

1. **DashboardCOE — setInterval simulation loop**: A `useEffect` with `setInterval` every 6s called `triggerCheckInSimulation()` and mutated random telemetry values. Removed entirely. Audit log polling from Firestore (every 4s) was KEPT.

2. **TicketingManager — "Simulador de Credenciamento"**: Removed the simulation button and panel label. Replaced with a real "Registrar Venda/Participante" form that creates actual `TicketSale` records persisted to Firestore.

3. **App.tsx — `handleTriggerCheckInSimulation`**: Function removed entirely. It was triggering auto check-ins and creating fake ServiceTickets.

4. **App.tsx — `handleApplyAIGeneratedPlan`**: Removed `sold: Math.random() * 400` seed on AI-generated ticket tiers (now `sold: 0`). Removed auto-created fake income transaction (`mockTx`).

5. **DashboardCOE — `simActive` toggle button**: Removed the UI button that toggled the simulation on/off. Replaced with a static "NOC Online 24/7" indicator.

6. **CRMComercial — misleading ICP-Brasil alert**: Removed `alert("...validade jurídica ICP-Brasil.")`. Replaced with an in-component success state (`signSuccess`) showing a green checkmark confirmation panel.

7. **StaffVolunteers — hardcoded `initialStaff` local state**: Removed 6 hardcoded staff records from local `useState`. Staff is now loaded from Firestore collection `eventos_staff` and passed via props from App.tsx.

8. **MarketplaceFornecedores — local `hiredIds` state**: Removed local state tracking contracted providers. Now uses `prov.status === 'contracted'` from the real `Provider` type, persisted to Firestore via `contractProvider` handler in App.tsx.

## What was added (real functionality)

1. **TicketingManager — `addTicketSale` form**: Real form with buyer name, email, tier selection, payment method. On save: creates TicketSale in Firestore + increments `tier.sold` + auto-creates income Transaction for correct financial tracking.

2. **App.tsx — `handleAddTicketSale`**: New handler that atomically: creates TicketSale, increments tier.sold, creates income Transaction, logs audit event.

3. **App.tsx — Staff handlers**: `handleAddStaff`, `handleRewardStaff`, `handleUpdateStaffRating` — all persist to `eventos_staff` Firestore collection.

4. **App.tsx — `handleContractProvider`**: Toggles `Provider.status` between `'available'` and `'contracted'`, persisted to `eventos_providers`.

5. **App.tsx — `handleToggleCheckIn` bug fix**: Removed reference to non-existent `s.ticketType` property in audit log message (now uses `s.buyerEmail`).

## Key architecture decisions

- `StaffMember` type was already defined in `types.ts` but never used in App.tsx. Added it as proper lifted state with Firestore sync.
- `Provider.status` field ('available' | 'contracted') already existed in types — just wasn't being persisted. Now the contractProvider handler in App.tsx persists it properly.
- When a ticket sale is created, it automatically creates a matching `Transaction` of type `income` so the Financial module reflects real revenue from ticket sales.

**Why:** The codebase had extensive simulation/mock code masking as real functionality, which would make the platform appear to work but data would be meaningless. All these patterns were replaced with real Firestore-backed state.
