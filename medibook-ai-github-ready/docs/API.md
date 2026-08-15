# MediBook AI API

All routes require the signed HTTP-only session cookie. Mutation routes enforce role authorization and validate JSON on the server.

## `POST /api/appointments`

Creates an appointment after rechecking doctor status, department status, working hours, breaks, past-date rules, overlap, and idempotency. Administrator or Receptionist only.

## `PATCH /api/appointments/:reference`

Actions: `status`, `reschedule`, and `cancel`. Cancellation requires `{ "confirmed": true, "reason": "..." }`.

## `POST /api/chat`

Accepts `{ "message": string, "conversationId"?: string }`. Runs a bounded multi-step OpenAI tool loop and persists only grounded final messages. Safe failures never report mutations as successful.

Tools: `search_doctors`, `check_doctor_availability`, `register_patient`, `create_appointment`, `get_appointment`, `list_patient_appointments`, `reschedule_appointment`, `cancel_appointment`, `calculate_consultation_fee`, `list_departments`.
