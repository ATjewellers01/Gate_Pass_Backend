I have a React/TypeScript client-side project in the `src` folder.

---

### STEP 1 — Full Analysis
Thoroughly analyze every file in current workspace and produce a complete inventory:
- List every page/component and what it does
- List every Google Sheets API call (endpoint, method, payload, purpose)
- Map each Google Sheets operation to its corresponding UI action
- Identify all data models/shapes currently being used

---

### STEP 2 — Backend Architecture Plan
Before writing any code, present a full plan:
- PostgreSQL schema (tables, columns, types, relationships, constraints)
- REST API route map (method + path + purpose) for EVERY operation 
  found in Step 1

Wait for my approval of the plan before proceeding.

---

### STEP 3 — Implementation (2 pages per batch)
After plan approval, implement page by page in batches of 2:

For each batch:
1. Show which 2 pages you're working on
2. Create/update the PostgreSQL table(s) needed
3. Write the Zod validation schema
4. Write TypeScript types
5. Write the service layer (all DB queries)
6. Write the controller (request handling, calls service only)
7. Write the routes (wired to controller)
8. Update constants.ts with any new constants
9. Show the exact API calls the frontend should make to replace 
   the Google Sheets calls
10. Confirm what frontend changes are needed to point to the new backend

Repeat until all pages are done.

---

### STRICT RULES
- Use PostgreSQL (not SQLite, not MongoDB)
- Use Zod for ALL input validation — no exceptions
- All constants (table names, route prefixes, error messages, 
  env var names, etc.) must live in constants.ts
- No business logic in controllers — controllers call services only
- Services contain all DB interaction
- Full TypeScript — no `any` types
- RESTful routing conventions
- Remove all Google Sheets code completely