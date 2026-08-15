# MediBook AI — Project Report

## Identification

Project ID: Mtech-DS26004  
Student: Ahmed Masood  
Title: Custom AI Chatbot with Tool-Use (Function Calling) for Clinic Appointments  
Category: LLM / Tool Use / Function Calling

## Executive summary

MediBook AI demonstrates how a language model can operate as a controlled interface to a clinic scheduling domain. The model does not own clinic state. It proposes typed tool calls; the server validates authorization and arguments, executes deterministic services, records results, and gives those results back to the model for a grounded response.

## Design and implementation

The original interface uses a deep navy navigation system, cool-gray operational canvas, white bordered surfaces, medical blue actions, emerald confirmations, amber pending states, and restrained red destructive states. The split login screen uses a CSS calendar illustration instead of stock photography.

The domain is normalized into users, roles, sessions, patients, doctors, departments, schedules, breaks, blocked periods, appointments, events, conversations, messages, tool executions, audit logs, and settings. SQLite is the development fallback; the Prisma model is compatible with migration to PostgreSQL.

Appointment creation checks future time, active doctor and department, local working hours, breaks, existing overlap, duration, and idempotency. The check is repeated inside the serialized transaction immediately before insertion. Cancellation requires explicit confirmation.

## Function-calling workflow

1. Authenticate the user and load only their authorized conversation.
2. Send the current request, safety policy, and ten strict tool definitions to OpenAI.
3. Parse each returned tool call and validate its arguments with Zod.
4. Enforce role permissions and execute the real clinic service.
5. Persist safe audit outcomes and return structured JSON to the model.
6. Continue for a bounded number of steps, then persist the grounded answer.
7. On timeout, validation, permission, provider, or database errors, return a safe failure without claiming success.

## Security assessment

Passwords use bcrypt. Sessions use signed, expiring, HTTP-only cookies. Failed authentication is throttled. Protected layouts redirect unauthenticated traffic; privileged operations recheck roles on the server. ORM-compatible parameterization, minimized patient data, safe audits, environment-only secrets, and generic client errors reduce exposure. A production rollout should use PostgreSQL serializable transactions, a distributed rate limiter, origin/CSRF enforcement based on deployment topology, managed key rotation, TLS termination, and a formal privacy review.

## Testing strategy

The included Node tests inspect core security and scheduling invariants, while the Playwright specification covers login → assistant → doctor availability → appointments. TypeScript, ESLint, production build, and mobile/desktop browser checks form the release gate.

## Ethical considerations and limitations

The assistant is prohibited from diagnosis, prescriptions, medical report interpretation, and emergency advice. It collects only the information needed to administer appointments. Seed records are fictional. Consultation revenue is an estimate rather than verified payment data. Demonstration session and storage mechanisms should be replaced with centralized infrastructure for multi-instance production deployment.

## Conclusion

MediBook AI shows that useful conversational interfaces can remain accountable: all consequential actions pass through strict, authorized, auditable backend tools, and language-model text is never treated as evidence that a transaction succeeded.
