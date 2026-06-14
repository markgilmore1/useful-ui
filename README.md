# useful-ui

A self-hosted [shadcn](https://ui.shadcn.com/docs/registry) **component registry** — a reusable design-system foundation extracted from Property Command. It is *not* an npm package: components are copied as source into each consuming project, so every project owns and can freely re-theme or tweak them.

- **Design tokens** — dual light/dark theme (amber primary, slate neutrals, glass-morphism), shipped as CSS variables + Tailwind theme extensions.
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
src/App.tsx              # local playground (dev only — not shipped to consumers)
public/r/                # GENERATED registry JSON (npm run registry:build)
```

## Develop

```bash
npm install
npm run dev              # playground on http://localhost:8080 (toggle light/dark)
npm run registry:build   # regenerate public/r/*.json from registry.json
```

`npm run build` runs `registry:build` then `vite build`, so a deploy always ships fresh registry JSON.

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
- **Geist font.** The tokens reference the `Geist` font family with a system-sans fallback, but the `Geist-Variable.woff2` binary is **not** shipped through the registry (binary can't be inlined in registry JSON). To get the exact look, copy `public/fonts/Geist-Variable.woff2` into the consumer's `public/fonts/` and add the `@font-face` rule (see `src/index.css`), or install the `geist` npm package. Without it, the UI falls back to the system sans stack.
- **Tailwind v3.** This registry targets Tailwind v3.4 (`cssVars`/`tailwind` blocks are v3-shaped). Migrating to v4 is future work.
- **Re-theming a project.** Edit the CSS variable values in the consumer's `index.css` (`--primary`, `--background`, glass tokens, etc.) — the components read from these, so a new palette is a token swap, not a component rewrite.
- **`formatters.ts` defaults to `en-AU`/AUD.** `CurrencyField`/`PercentField` accept `currencySymbol` / `formatDisplay` overrides for other locales.
