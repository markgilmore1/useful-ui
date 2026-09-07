# useful-ui

A self-hosted [shadcn](https://ui.shadcn.com/docs/registry) **component registry** — a reusable design-system foundation extracted from Property Command. It is *not* an npm package: components are copied as source into each consuming project, so every project owns and can freely re-theme or tweak them.

- **Design tokens** — dual light/dark theme (blue primary, true-neutral gray), shipped as CSS variables + Tailwind theme extensions. Colour, type scale, spacing, radii, elevation and motion are all tokens; nothing is hardcoded in the Tailwind config.
- **Primitives** — shadcn/ui components (button, card, select, popover, dialog, calendar, command, …) plus custom ones: a searchable `Combobox`, a hand-rolled `DateInput`, an extended `Select`, and a `Sidebar` system.
- **Fields layer** — a fully-typed React-Hook-Form field set: `TextField`, `NumberField`, `CurrencyField`, `PercentField`, `SelectField`, `ComboboxField`, `DateField`, `SwitchField`, `CheckboxField`, `TextareaField`, `DisplayField`.

## Repo layout

```
registry.json            # the registry manifest (source of truth)
components.json          # shadcn config for this repo
tailwind.config.ts       # design-system Tailwind theme
src/index.css            # design tokens (light + dark)
src/lib/                 # utils (cn), formatters
src/hooks/               # use-mobile
src/components/ui/        # primitives + custom components
src/components/fields/    # RHF field layer
src/components/*          # theme-provider, mode-toggle
src/App.tsx              # gallery shell (dev only — not shipped to consumers)
src/gallery/             # the component gallery: every variant, every state, both themes
scripts/                 # tokens:sync + check:contrast
public/r/                # GENERATED registry JSON (npm run registry:build)
```

## Develop

```bash
npm install
npm run dev              # gallery on http://localhost:8080
                         # every component x every variant x every state, in both themes,
                         # with a width control for 375 / 768 / full
npm run registry:build   # regenerate public/r/*.json from registry.json
```

`npm run build` runs, in order: `tokens:sync` (regenerates registry.json's cssVars from
`src/index.css`), `check:contrast` (fails the build if any foreground/background pair drops below
WCAG AA in either theme), `registry:build`, then `vite build`. A deploy therefore always ships
fresh registry JSON that has been checked.

```bash
npm run tokens:sync      # src/index.css -> registry.json cssVars
npm run check:contrast   # WCAG AA over both themes, exits non-zero on failure
```

## Deploy (Vercel / Netlify)

Deploy this repo as a static site. `public/r/` is served at the site root, so items are available at `https://<your-domain>/r/<name>.json`. Build command: `npm run build`; output dir: `dist`.

## Consume in a new project

1. Set up the project with Tailwind **v3** + shadcn (`npx shadcn@latest init`, choosing CSS variables).
2. Register the `@useful-ui` namespace in the new project's `components.json`:
   ```json
   {
     "registries": {
       "@useful-ui": "https://<your-domain>/r/{name}.json"
     }
   }
   ```
3. Add the foundation first, then whatever you need:
   ```bash
   npx shadcn@latest add @useful-ui/foundation   # tokens, Tailwind theme, utils
   npx shadcn@latest add @useful-ui/fields        # the whole field layer + its deps
   npx shadcn@latest add @useful-ui/combobox      # or individual components
   npx shadcn@latest add @useful-ui/theme         # next-themes provider + ModeToggle
   ```
   `registryDependencies` resolve through the `@useful-ui` namespace, so adding `fields` pulls the entire transitive tree (form, select, combobox, date-input, …) from this registry — not stock shadcn.

## Notes / caveats

- **Internal deps are namespaced.** In `registry.json`, items reference each other as `@useful-ui/<name>` (not bare `<name>`). Bare names would resolve against the *default* shadcn registry and pull stock components instead of these customized ones.
- **Version-pinned deps.** `react-day-picker` is pinned to `^8.10.1` (the calendar/date-input use the v8 API; v9 removed `useNavigation`/`DayContent`). `date-fns` is pinned to `^3`.
- **Fonts ship as npm dependencies.** `@fontsource-variable/inter` (sans) and `@fontsource-variable/geist-mono` (numbers/code) are declared on the `foundation` item and `@import`ed at the top of `src/index.css`, so a consumer cannot end up silently on the system stack. The family names are read from `--font-sans` / `--font-mono`, so swapping typeface is a token change, not a config edit.
- **Tailwind v3.** This registry targets Tailwind v3.4 (`cssVars`/`tailwind` blocks are v3-shaped). Migrating to v4 is future work.
- **Re-theming a project.** Edit the CSS variable values in the consumer's `index.css` — the
  components read only from these, so a new palette is a token swap, not a component rewrite. Run
  `scripts/check-contrast.py` against the new theme file before shipping it: it reports what it
  measured as well as what passed, so a token you forgot to define is reported rather than skipped.
- **Token values have one home.** `src/index.css` is the source of truth; `registry.json`'s
  `cssVars` are generated from it by `npm run tokens:sync`. Never hand-edit them there.
- **Upstream source of truth.** The palette and scales mirror the "Useful UI" project in Claude
  Design, which is where visual decisions are made. Code owns behaviour; Design owns the tokens.
- **`formatters.ts` defaults to `en-AU`/AUD.** `CurrencyField`/`PercentField` accept `currencySymbol` / `formatDisplay` overrides for other locales.
