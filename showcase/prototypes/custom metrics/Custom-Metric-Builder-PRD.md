# Custom Metric Builder — PRD

Reporting Dashboard · custom metric formula editor

| | |
|---|---|
| **Ticket** | 20098 — Reporting Dashboard - Custom Metric Field Enhancement |
| **Status** | Ready for Design / spec in progress |
| **Type** | Feature Improvement (non-billable) |
| **Doc owner** | Mikaela Yeo (Product Design) |
| **Audience** | Developers · PM · QA · Technical Writer |
| **Last updated** | 16 Jun 2026 |
| **Prototype** | [Custom Metric Editor v5](https://mikaelayeo.github.io/bis-design-work/showcase/prototypes/custom%20metrics/custom-metric-editor-v5-bis.html) |

> **How to read this:** §5 Behaviour is a QA test reference, §6 Technical details target developers, and §7 Copy lists every editable string for the technical writer.

---

## 1. Overview & scope

The Custom Metric Builder redesigns how analysts create custom metrics on the Reporting Dashboard. Today the metric formula editor uses an unclear syntax (space-separated tokens with `IN` / `NOT IN`), gives no inline guidance, and reports a single generic error. The redesign turns it into a guided, token-based formula editor with a searchable reference panel, real-time validation, and AI-assisted formula generation.

**In scope**

- A modal formula editor that renders the formula as colour-coded tokens (chips).
- Two equally supported ways to build a formula: **typing** (autocomplete + inline recommendation dropdowns) and the **option-selector** (clicking items in the reference panel).
- A reference panel with Fields / Operators / Formulas tabs, hover-to-preview, click-to-insert, and search.
- Preset formulas (TRIF Rate, Injury Rate %, Incident Count) that insert with empty field slots the user fills in.
- Real-time validation with a clear, human-readable error message; Save is blocked while invalid.
- AI Assist: a single editable prompt that generates an editable formula, with feedback (thumbs) and revert.
- Paste support: a JavaScript-style formula pasted from elsewhere is parsed into tokens.

**Out of scope / explicitly dropped**

- **Live numeric preview** of the metric value — dropped. The widget updates on Save, so a preview is unnecessary. (This is the one place the spec intentionally diverges from ticket §4.7.)
- **Metric Name, Colour, and Type inputs** — these live in the dashboard widget-settings rail, not inside this modal.
- Time-tracking behaviour in forms (separate ticket 18256).

---

## 2. Goals & success metrics

**Goals**

- Faster, more accurate metric creation via tokenized formulas.
- Better discoverability of fields, operators, and formulas.
- Fewer invalid saves through real-time validation and clear errors.
- Lower support load related to formula syntax.
- Higher adoption of custom metrics, including via AI Assist.

**Success metrics**

- Increase in custom metrics created per analyst.
- Reduction in time to create a metric.
- Fewer validation errors / failed saves.
- AI Assist usage.
- Reduction in custom-metric support tickets.

---

## 3. Key product decisions

Settled decisions from the lead review (Luke), the reporting-dashboard trio, and design iterations.

| Decision | Resolution | Why |
|---|---|---|
| **Operator syntax** | JavaScript-style operators (`==`, `!=`, `>`, `>=`, `<`, `<=`, `&&`, `||`, `+ - * /`). Replaces the old `IN` / `NOT IN`. | Reads forward, familiar, and lets users copy/paste from tools like ChatGPT. |
| **Editor placement** | Lighter centered modal; formula-only (no name/colour inside). | The builder is too large to anchor to the narrow widget-settings rail. |
| **Two build modes** | Typing → inline dropdowns; clicking the panel → cycles the reference tabs. **Last action wins.** | Two clear, non-conflicting mental models. |
| **Chips vs badges** | **Chips** (outline, no fill) only for interactable tokens in the formula field. **Badges** (filled) are display-only (examples, options, lists). | Follows the Storybook BisChip / BisBadge conventions. |
| **Live preview** | Dropped. | Widget updates on Save; preview adds complexity for little value. |
| **Reset vs Discard** | One field button: **Reset** (clear) for new metrics; **Discard** (revert to saved) once an existing metric is edited. | Replaces a separate footer Discard button, which was redundant with Reset. |
| **Validation message** | One plain-language sentence, shown tight under the field. | The old editor only said the syntax was incorrect. |
| **Icons** | Font Awesome 7 (regular where a free variant exists; solid otherwise). AI badge uses the BIS AI logo with a brand gradient. | Matches the BIS design system. |

---

## 4. Editor anatomy

Top to bottom, the modal contains:

| Zone | Contents |
|---|---|
| **Header** | Edit icon, "Custom Metric" title, and a close (✕). |
| **AI Assist bar** | BIS AI badge, a single editable prompt, and a send button. Gradient border (1px; 2px when focused). |
| **Formula field** | The colour-coded token editor with a trailing text input. Below it: a validation hint (left) + a **Reset/Discard** button (right), shown only when there is content. |
| **Sub-locations toggle** | "Include hours from sub-locations" — appears only when `{Hours}` is in the formula. |
| **Reference panel** | Tabs (Fields / Operators / Formulas) + search; a grouped list on the left, a detail pane on the right. |
| **Footer** | Cancel and Save. |

---

## 5. Behaviour (QA reference)

Each row is a testable scenario. IDs are stable so QA and dev can reference them in tickets and test plans.

### 5.1 Building a formula

| ID | Scenario | Expected result |
|---|---|---|
| B-1 | Type a field ID or name (e.g. `CB_9`) | Autocomplete opens with matching fields/operators; first match highlighted. |
| B-2 | With autocomplete open, press ↓ / ↑ | Highlight moves through matches. |
| B-3 | Press Enter (or Tab) with a match highlighted | Highlighted item inserts as a token; autocomplete closes. |
| B-4 | Press Enter with text that matches nothing | Text inserts as an unrecognized token (plain red, underlined); field is invalid. |
| B-5 | Insert a field by **typing**, then look below the cursor | Operator dropdown opens beneath the empty spot after the last token, first item highlighted, keyboard-navigable. |
| B-6 | Choose a comparison operator (`==`, `!=`, `>`…) in the typed flow | A value dropdown opens listing that field's options (e.g. Yes / No). |
| B-7 | Choose an arithmetic/logical operator in the typed flow | A field dropdown opens listing fields to add next. |
| B-8 | **Click** a field in the reference panel | No inline dropdown; the panel switches to the **Operators** tab. |
| B-9 | Click an operator in the reference panel | The panel switches back to the **Fields** tab (a `)` switches to Operators). |
| B-10 | Mix typing and clicking | Most recent action wins: typing arms the inline dropdowns, clicking arms the tab-cycling. |
| B-11 | Press Backspace with the text cursor empty | The last token is removed. |
| B-12 | Hover a token chip | A ✕ (delete) appears; clicking it removes that token. |
| B-13 | Paste `( CB_9 == Yes ) * 200000 / {Hours}` | The string parses into coloured tokens; `==`, `IN`, `AND`/`OR` and `{Hours}` are normalized. |

### 5.2 Reference panel & search

| ID | Scenario | Expected result |
|---|---|---|
| B-20 | Hover an item in the list | The detail pane updates to that item (no click needed). |
| B-21 | Click an item | It inserts into the formula (Fields → token, Operators → operator, Formulas → preset). |
| B-22 | Click the search icon | The pill animates open from the icon; focus moves to the input. |
| B-23 | Type in search (`cb` / `dd` / `tf` / `ls`) | List filters by field type; any keyword also matches by name/ID. |
| B-24 | Click the ✕ in the search pill | Search clears and the pill animates back to the icon. |
| B-25 | Click an example's **Insert** | The example tokens insert into the formula field. |

### 5.3 Preset formulas

| ID | Scenario | Expected result |
|---|---|---|
| B-30 | Choose a preset (e.g. TRIF Rate) | Formula drops in with empty "Select field" / "Select value" slots; the first slot's picker auto-opens. |
| B-31 | Pick a field for a slot | The slot fills; if a value slot follows, its picker opens with that field's options. |
| B-32 | Leave any slot unfilled | Formula stays invalid; Save disabled. |

### 5.4 Validation, Reset & Discard

| ID | Scenario | Expected result |
|---|---|---|
| B-40 | Formula is empty | No hint shown; Save disabled. |
| B-41 | Formula is complete and well-formed | Field border green; hint "Valid Input" with check icon; Save enabled. |
| B-42 | Formula ends on an operator, has unbalanced `( )`, an unfilled slot, or an unrecognized token | Field border red; hint shows the invalid message; Save disabled. |
| B-43 | Hint / button row visibility | The hint + Reset/Discard row only appears once the field has content. |
| B-44 | **New metric:** click Reset | The formula field clears (button stays "Reset"). |
| B-45 | **Editing a saved metric,** then change it | The field button changes from "Reset" to "Discard". |
| B-46 | Hover the Discard button | Tooltip "Reverts to the original formula when first opened." appears (Discard mode only). |
| B-47 | Click Discard | The formula reverts to the saved version; the button returns to "Reset". |

### 5.5 AI Assist states

State machine: `empty → filled → generating → generated` (plus a `same formula` warning branch).

| ID | Scenario | Expected result |
|---|---|---|
| B-50 | AI field empty | Placeholder "Generate or update formula…"; send button inactive. |
| B-51 | Type a prompt | Send button becomes active (filled gradient). |
| B-52 | Click send / press Enter | State → **Generating**: "Generating…" (animated dots) and a stop button. |
| B-53 | Click stop while generating | Returns to filled/empty depending on prompt text. |
| B-54 | Generation completes | Formula inserts as editable tokens; trailing row shows revert, 👍, 👎, and regenerate (send). |
| B-55 | Hover the revert icon | Tooltip "Revert Changes"; clicking reverts the formula to its pre-generation state. |
| B-56 | Click 👍 or 👎 | Icon toggles selected; the Additional feedback modal opens. |
| B-57 | Submit feedback | Modal switches to the success state. |
| B-58 | AI finds the formula already exists | State → **Same formula**: warning copy, 👍 / 👎, and a Back button. |
| B-59 | Focus the AI field | Its gradient border thickens from 1px to 2px. |

### 5.6 Save gating

- Save is enabled only when the formula is valid AND (in the live product) the metric has a name that is unique within the report.
- Save persists: name, colour, formula tokens, and the sub-location setting.
- Cancel / Close discards unsaved changes.

---

## 6. Technical details (developers)

### 6.1 Tokens

- Every element is a token with a **kind**: `field`, `operator`, `value`, `hours`, or `slot` (an unfilled preset placeholder), plus an `unknown` flag for unrecognized input.
- Fields are referenced by ID (`CB_9`, `DD_9`, `TF_5`, `LS_3`…). The chip shows "ID + field name".
- Save stores the ordered token list, not a raw string — but a raw string can be parsed in (paste) and serialized out.
- Custom metrics always return a single **numeric** value (a count or a number derived from counts). There is no boolean / if-else return.

### 6.2 Operators & evaluation

| Display | Name | Maps to | Group |
|---|---|---|---|
| `+` | Add | `+` | Arithmetic |
| `−` | Subtract | `-` | Arithmetic |
| `×` | Multiply | `*` | Arithmetic |
| `÷` | Divide | `/` | Arithmetic |
| `==` | Equal to | `==` | Comparison |
| `!=` | Not equal to | `!=` | Comparison |
| `>` | Greater than | `>` | Comparison |
| `>=` | Greater or equal | `>=` | Comparison |
| `<` | Less than | `<` | Comparison |
| `<=` | Less or equal | `<=` | Comparison |
| `&&` | And | `&&` | Logical |
| `\|\|` | Or | `\|\|` | Logical |
| `( )` | Group | `( )` | Grouping |

- Comparison operators on **multi-select** fields mean "contains" (a field may hold several selected options); evaluate accordingly.
- **Divide-by-zero** returns "no result" (not an error, not zero); the widget reflects no result.
- `{Hours}` pulls total hours from the Location Hours table for the selected location and — when the sub-location toggle is on — its sub-locations. Must stay consistent with current system logic.
- Suggestions and preview must respect the user's **data-access permissions**.
- **Performance:** validation runs in real time on every change and must stay responsive on large forms (800+ fields).

### 6.3 Autocomplete & paste parsing

- Autocomplete matches fields (by name or ID) and operators; keyboard-navigable (↓ ↑ Enter Tab Esc).
- **Paste:** a pasted string is tokenized — parentheses and operators are space-normalized, `==` / `!=` / `>=` / `<=` and `+ − * /` are recognized, `IN`→`==`, `AND`→`&&`, `OR`→`||`, `{Hours}` and numeric literals are typed, known field IDs become field tokens, everything else becomes a value (flagged `unknown` if it isn't a known option and doesn't follow a comparison).

### 6.4 AI Assist requirements

- A single editable prompt (not a chat thread). Re-editing the prompt regenerates.
- AI must only use valid, available fields/operators and must **fail gracefully** — never fabricate fields.
- Results insert as editable tokens so the user can adjust them.
- Thumbs up/down opens a feedback modal; the revert action restores the pre-generation formula.

### 6.5 Migration & backward compatibility (ticket §4.9)

- Existing metrics migrate to the token format; calculations must **not** change post-migration.
- Users can edit migrated metrics without rework.
- A rollback mechanism must exist.
- Treat migration as backend; surface UI only if a metric actually changes on migration.

---

## 7. Copy (technical writer)

Every user-visible string lives here. Edit values in this section; nothing else in the doc needs to change. **The UI has no em-dashes by design — please keep it that way.**

### 7.1 Interface & buttons

| Element | Copy | Notes |
|---|---|---|
| Modal title | Custom Metric | Header |
| Formula field placeholder | Start typing or click below | Shown when the formula is empty |
| Validation — valid | Valid Input | Green, with check icon |
| Validation — invalid | Sorry! There's a syntax or reference issue. Please update the formula. | Red, with x icon |
| Field button — new metric | Reset | Bottom-right of the field; clears the formula |
| Field button — editing a saved metric | Discard | Replaces "Reset" once a saved metric is changed; reverts to the saved formula |
| Discard tooltip | Reverts to the original formula when first opened. | Shown on hover, in Discard mode only |
| Sub-locations toggle | Include hours from sub-locations | Only visible when `{Hours}` is used |
| Footer — cancel | Cancel | |
| Footer — save | Save | Disabled until the formula is valid |
| Reference tabs | Fields / Operators / Formulas | Three tabs |
| Search placeholder | Search | Inside the expanding search pill |
| Example action | Insert | Inserts the example into the formula |
| Detail labels | OPTIONS / EXAMPLES | Section labels in the detail pane |
| Empty field slot | Select field / Select value | Placeholder chips in a preset |

### 7.2 AI Assist

| Element | Copy |
|---|---|
| Prompt placeholder (empty) | Generate or update formula… |
| Generating | Generating (with animated …) |
| Same-formula warning | Your existing formula already does exactly that! |
| Same-formula action | Back |
| Revert tooltip (generated) | Revert Changes |

### 7.3 Feedback modal

| Element | Copy |
|---|---|
| Modal title | Additional feedback |
| Label | How can we do better? |
| Textarea placeholder | Feel free to add specific details. |
| Buttons | Cancel / Submit |
| Success message | Thanks! Your feedback helps us improve. |
| Success action | Done |

### 7.4 Group / section labels

| Where | Labels |
|---|---|
| Field types | CHECKBOX · DROPDOWN · TEXT · LIKERT · SYSTEM |
| Operator groups | ARITHMETIC · COMPARISON · LOGICAL · GROUPING |
| Formula groups | SAFETY · GENERAL |

### 7.5 Field descriptions (by type)

Descriptions are written per field **type**, so every checkbox shares one description, every dropdown another, and so on.

| Field type | Description |
|---|---|
| Checkbox | Counts completed forms where the options you pick were selected. |
| Dropdown | Counts completed forms where the option you pick was selected. |
| Text | Counts completed forms whose text contains the value(s) you pick. If it holds numbers, it adds them all up instead. |
| Likert scale | Counts completed forms where the statement you pick got one of the responses you choose. |
| System — `{Hours}` | Pulls in the hours for the location (and sub-locations, if turned on) selected on the dashboard. |

### 7.6 Operators

| Op | Name | Description | Example → result |
|---|---|---|---|
| `+` | Add | Adds two numbers together. Handy for combining counts into one total. | `Injuries + Illnesses` → total incidents |
| `−` | Subtract | Takes the second number away from the first. | `All forms − Passed` → failed forms |
| `×` | Multiply | Multiplies two numbers. Often used to scale a count, like × 200,000 for safety rates. | `Injuries × 200000` → scaled for TRIF |
| `÷` | Divide | Divides the first number by the second. Dividing by zero shows no result. | `200000 / {Hours}` → rate per hour |
| `==` | Equal to | Counts forms where the field matches the answer you pick. | `Injuries? == Yes` → forms with an injury |
| `!=` | Not equal to | Counts forms where the field is anything other than the answer you pick. | `Severity != Low` → non-low severity |
| `>` | Greater than | Keeps forms where the number is above the value you set. | `Work Hours > 8` → forms over 8 hrs |
| `>=` | Greater or equal | Keeps forms where the number is at or above the value you set. | `Work Hours >= 8` → forms with 8+ hrs |
| `<` | Less than | Keeps forms where the number is below the value you set. | `Work Hours < 8` → forms under 8 hrs |
| `<=` | Less or equal | Keeps forms where the number is at or below the value you set. | `Work Hours <= 8` → forms 8 hrs or under |
| `&&` | And | Both conditions must be true for a form to be counted. | `Injury && High severity` → serious injuries |
| `\|\|` | Or | Either condition can be true for a form to be counted. | `Recordable \|\| First Aid` → either type |
| `( )` | Group | Groups part of a formula so it runs first. | `( Injuries == Yes ) × 200000` → grouped first |

### 7.7 Preset formulas

| Name | Group | Description |
|---|---|---|
| TRIF Rate | Safety | Your recordable injury rate per 200,000 hours worked. The standard safety KPI. |
| Injury Rate % | Safety | The share of submitted forms that reported an injury. |
| Incident Count | General | A simple count of forms matching one incident type. |

---

## 8. Open questions

- **Multi-select semantics:** confirm the exact "contains" behaviour and wording for `==` / `!=` on multi-select checkbox & dropdown fields.
- **Likert:** a scale has multiple statements, each rated. The prototype simplifies this to a single response set — confirm whether a statement picker is needed.
- **Preset slots:** presets currently make BOTH the field and the value empty slots. Confirm whether some presets should keep a fixed value (e.g. TRIF always "== Yes").
- **Generating state:** the original Figma processing state had a light-blue tint; it was removed to fix a padding/contrast issue. Confirm the tint is not required.
- **After-operator dropdown (typed flow):** currently context-aware (values after a comparison, fields otherwise). Confirm vs. always showing fields.

---

## 9. References

- **Ticket:** BIS PM 20098 — Reporting Dashboard - Custom Metric Field Enhancement
- **Prototype (live):** https://mikaelayeo.github.io/bis-design-work/showcase/prototypes/custom%20metrics/custom-metric-editor-v5-bis.html
- **Figma:** https://www.figma.com/design/ZfdeetM0mrxi97MevwBnvK/Reporting-Dashboard
- **Component library:** Storybook — BisChip
