/**
 * Renders the gallery's sections to static HTML cards for the "Useful UI"
 * Claude Design project.
 *
 * The cards Design showed before this came from its own simplified .jsx copies
 * of Button/Badge/Card/Input — different markup, no focus states. These are the
 * real components, so what Design shows is what the code produces.
 *
 * Each card renders the section twice, light beside dark, because the pair is
 * what has to be judged. Ids in the dark copy are suffixed so label/for stays
 * correctly paired rather than pointing at the light copy's control.
 *
 *   npm run cards:export   ->  design-cards/
 */
import { renderToStaticMarkup } from "react-dom/server";
import { mkdirSync, writeFileSync } from "node:fs";

import { Fields } from "../src/gallery/fields";
import { Foundations } from "../src/gallery/foundations";
import { Primitives } from "../src/gallery/primitives";

type Card = { id: string; group: string; name: string; subtitle: string; height: number };

const CARDS: Card[] = [
  { id: "colour", group: "Foundations", name: "Colour", subtitle: "Surfaces, status pairs, primary and gray scales, number colours", height: 900 },
  { id: "typography", group: "Foundations", name: "Typography", subtitle: "10-step scale, semantic h1–h5, tabular numerals", height: 900 },
  { id: "space-radius", group: "Foundations", name: "Spacing & elevation", subtitle: "4px grid, radius scale, theme-aware shadows", height: 620 },
  { id: "motion", group: "Foundations", name: "Motion", subtitle: "Three durations, two easings", height: 320 },
  { id: "button", group: "Components", name: "Button", subtitle: "6 variants, 4 sizes, disabled, loading, focus ring", height: 700 },
  { id: "badge", group: "Components", name: "Badge", subtitle: "5 variants, in context", height: 320 },
  { id: "input", group: "Components", name: "Input & Textarea", subtitle: "Empty, filled, disabled, error, read-only display", height: 640 },
  { id: "select", group: "Components", name: "Select & Combobox", subtitle: "Closed, chosen, empty, loading, disabled", height: 560 },
  { id: "toggles", group: "Components", name: "Checkbox & Switch", subtitle: "On, off, disabled in both positions", height: 400 },
  { id: "dates", group: "Components", name: "Date & Calendar", subtitle: "Filled, empty, error, disabled", height: 620 },
  { id: "surfaces", group: "Components", name: "Card, Separator & Skeleton", subtitle: "Container and its loading state", height: 480 },
  { id: "overlays", group: "Components", name: "Overlays", subtitle: "Dialog, Sheet, Popover, Tooltip, Dropdown, Command — triggers only", height: 560 },
  { id: "fields", group: "Patterns", name: "Fields layer", subtitle: "Empty, filled, display mode, disabled, validation", height: 1400 },
];

/** Ids must stay unique across the two themes, and label/for must stay paired. */
function suffixIds(html: string, suffix: string): string {
  return html.replace(
    /\b(id|for|aria-labelledby|aria-describedby|aria-controls|aria-owns)="([^"]+)"/g,
    (_m, attr, value) => `${attr}="${value.split(/\s+/).map((v: string) => v + suffix).join(" ")}"`,
  );
}

function card(c: Card, sectionHtml: string): string {
  const dark = suffixIds(sectionHtml, "--dark");
  return `<!-- @dsCard group="${c.group}" name="${c.name}" subtitle="${c.subtitle}" viewport="1180x${c.height}" -->
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="../colors_and_type.css">
<link rel="stylesheet" href="../gallery.css">
<style>
  body { margin: 0; font-family: var(--font-sans); }
  .themes { display: grid; grid-template-columns: 1fr 1fr; align-items: start; }
  .pane { padding: 20px 22px; min-width: 0; }
  .pane.light { background: hsl(0 0% 100%); color: hsl(0 0% 9%); }
  .pane.dark { background: hsl(0 0% 7%); color: hsl(0 0% 98%); }

  .theme-tag {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: 0.45; margin-bottom: 14px;
  }
  @media (max-width: 760px) { .themes { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="themes">
  <div class="pane light"><div class="theme-tag">Light</div>${sectionHtml}</div>
  <div class="pane dark"><div class="theme-tag">Dark</div>${dark}</div>
</div>
</body>
</html>
`;
}

const all = renderToStaticMarkup(
  <>
    <Foundations />
    <Primitives />
    <Fields />
  </>,
);

mkdirSync("design-cards", { recursive: true });
let written = 0;
for (const c of CARDS) {
  // Each Section renders as <section id="...">…</section>; pull it back out by
  // matching braces on the tag rather than a lazy regex, which would stop at
  // the first nested </section>.
  const open = all.indexOf(`<section id="${c.id}"`);
  if (open === -1) {
    console.error(`  MISSING  ${c.id} — the gallery did not render a section with this id`);
    continue;
  }
  let depth = 0, i = open, end = -1;
  const re = /<\/?section\b/g;
  re.lastIndex = open;
  for (let m = re.exec(all); m; m = re.exec(all)) {
    depth += m[0] === "</section" ? -1 : 1;
    if (depth === 0) { end = all.indexOf(">", m.index) + 1; break; }
  }
  if (end === -1) { console.error(`  UNCLOSED ${c.id}`); continue; }
  writeFileSync(`design-cards/${c.id}.html`, card(c, all.slice(open, end)));
  written++;
}
console.log(`${written}/${CARDS.length} cards written to design-cards/`);
