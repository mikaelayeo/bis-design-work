# eCommerce Product Page — open questions & decisions

Running notes for the store → group → product prototype.
**These feed the PRD for this project (to be written later).**

---

## 🔴 Open question — showing individual reviews (RAISED 2026-07-20)

**The prototype's Reviews tab lists the top 10 reviews. This is not yet validated as buildable.**

Mika's note verbatim: *"no idea if we can even show these here, we have the number but we
have never actually showed the reviews to other people."*

What this means:
- BIS today captures and stores a review **count and average rating** (e.g. "5.0 (1,240 reviews)")
  and surfaces those aggregate numbers.
- BIS has **never exposed individual review text/authors publicly**. So it is unknown whether:
  1. Review free-text is actually captured and retained in a usable form
  2. Reviewers ever consented to public display of their words/name/company
  3. There is any moderation path for what gets shown
  4. Per-course review volume is high enough for a "top 10" list to look credible

**Needs before build:**
- [ ] Confirm with dev whether individual review records (text + author) exist and are queryable
- [ ] Confirm with compliance/legal whether existing reviews can be shown publicly (consent)
- [ ] Decide moderation + reporting flow
- [ ] Decide what "top 10" means — most recent? most helpful? highest rated? (risk of cherry-picking)
- [ ] Define the empty/low-volume state (course with 0–3 reviews)

**Prototype assumption:** top 10 reviews shown, newest-ish order, sample content only.
Treat the Reviews tab as *directional*, not committed scope.

---

## Decisions already locked

| Decision | Detail |
|---|---|
| Header | Use the real BIS header (Figma 1001:12874) — 3 rows, not the minimal app header. Not changing. |
| Store page prices | Removed from the catalog/store listing. Prices stay at product level. |
| Hero card vs sticky | Hero purchase card is **fixed** (scrolls away); the 350px **mini card** is the sticky one. |
| "For team" copy | "You'll assign these seats to team members after checkout" (per Figma 1100:1205). |
| Recommended Courses | Always visible, sits **below** the tabs and is **not** part of the tab set. |
| **Marketing → software is a ONE-WAY DOOR** | Once a user crosses from the marketing pages into the software, there is **no route back to marketing**. The product page breadcrumb therefore omits the group-page crumb entirely — it is just `home > Defensive Driving 101`. Home leads to the **course list inside the software**, closing the loop. (Figma 1101:3822 / 1-4839) |
| "For team" banner | Appears in **both** the hero purchase card and the sticky mini card (Figma 1101:3865). |
| Mobile purchase UI | Purchase cards hidden < 860px; replaced by sticky buy bar with 3 states (default → Added to Cart → View Cart). |
| Mobile bulk row | Course image + bulk pricing table stay **side by side**, they do not stack. |

## Which page lives where (CONFIRMED 2026-07-20)

| Page | Property | Header |
|---|---|---|
| `store.html` | **Marketing** — bissafety.ca | `.mkt-header` (utility bar + Software/Courses/Partnerships/Spotlights/About + green Book Demo) |
| `defensive-driving.html` | **Marketing** — bissafety.ca | `.mkt-header` |
| `defensive-driving-101.html` | **Software** — bissafety.app | `.bis-header` (3-row BIS header, Figma 1001:12874) |
| `course-list.html` | **Software** — bissafety.app | `.bis-header` rows 1–2 + blue store bar (Figma 1:4839) |

The marketing→software crossing happens on the group page's "View course" cards.

**The loop:**
`store.html` → `defensive-driving.html` → **[crosses into software]** →
`defensive-driving-101.html` → Home → `course-list.html` → back into a product page.

Enforced: neither software page contains any link back to a marketing page.

## ✅ POSITION — keep the software course list as-is (2026-07-20)

**`course-list.html` is TKT-17024's delivery. Proposal: leave it alone for now.**

Mika's call: it is not too different from the current store, and it is reasonably close to
where we want to go, so it is a **good middle ground**. No rework requested as part of the
product page redesign; 17024 can release it on its own schedule.

Accepted trade-off: buyers cross from a redesigned product page into a slightly older-looking
list. Known and accepted, not an oversight. The inherited accessibility issues below are still
worth fixing whenever the area is next opened.

---

## ✅ RESOLVED — the software course list (`course-list.html`)

Confirmed 2026-07-20: **Home goes to Figma `1-4839`**, the course list inside the software.
Built as `course-list.html`, rebuilt faithfully from that frame.

⚠️ **`1-4839` is the CURRENT PRODUCTION store, not a redesigned page.** So `course-list.html`
deliberately looks different from the rest of this prototype — green `#167b00` Add to Cart
buttons, favourite hearts, blue `#0078b3` utility bar, Filter/Bundles/Sort By toolbar,
fixed 325×500 cards. That visual mismatch is **expected**, not a bug. If this page is
in scope for the redesign later, it will need its own pass.

Accessibility/consistency issues inherited from the production design (worth raising in the PRD):
- Placeholder text `#807f7f` on `#feffff` is ~3.5:1 — **fails WCAG AA** for input text.
- Search field has no border sitting on blue — ~1.4:1 boundary contrast.
- Green CTA is the only green on an otherwise all-blue page.
- Cards are a fixed 500px height with no line-clamp, so real variable-length descriptions
  will break the layout. (Prototype adds a 5-line clamp to compensate.)
- Every card repeats the same WHMIS placeholder description, regardless of course title.

## Known deviations from Figma (deliberate)

- **H1 font**: Figma uses Montserrat Bold; prototype uses the system stack (no webfont pulled in).
- **Photos**: Unsplash placeholders, not final art.
- **Trust logo**: cropped from the full BIS lockup, since the isolated shield asset wasn't exported.
