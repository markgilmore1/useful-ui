import { Grid, Row, Section, Specimen } from "./frame";

const SURFACE_TOKENS = [
  "background",
  "foreground",
  "card",
  "popover",
  "muted",
  "muted-foreground",
  "border",
  "input",
  "ring",
];

const STATUS_TOKENS = [
  ["primary", "primary-foreground"],
  ["secondary", "secondary-foreground"],
  ["accent", "accent-foreground"],
  ["destructive", "destructive-foreground"],
  ["success", "success-foreground"],
  ["warning", "warning-foreground"],
];

const PRIMARY_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const GRAY_SCALE = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

function Swatch({ token, label }: { token: string; label?: string }) {
  return (
    <div className="space-y-1">
      <div
        className="h-12 rounded-md border border-border"
        style={{ background: `hsl(var(--${token}))` }}
      />
      <div className="font-mono-tabular text-[11px] leading-tight text-muted-foreground">
        {label ?? `--${token}`}
      </div>
    </div>
  );
}

/**
 * A fill token paired with the foreground token meant to sit on it. Shown
 * together because the pair is the thing that has to be readable, not either
 * colour alone — the same pairing scripts/check-contrast.py asserts.
 */
function Pair({ bg, fg }: { bg: string; fg: string }) {
  return (
    <div className="space-y-1">
      <div
        className="flex h-12 items-center justify-center rounded-md border border-border text-sm font-medium"
        style={{ background: `hsl(var(--${bg}))`, color: `hsl(var(--${fg}))` }}
      >
        Aa
      </div>
      <div className="font-mono-tabular text-[11px] leading-tight text-muted-foreground">--{bg}</div>
    </div>
  );
}

const TYPE_STEPS: Array<[string, string]> = [
  ["--fs-6xl", "60px"],
  ["--fs-5xl", "48px"],
  ["--fs-4xl", "36px"],
  ["--fs-3xl", "30px"],
  ["--fs-2xl", "24px"],
  ["--fs-xl", "20px"],
  ["--fs-lg", "18px"],
  ["--fs-base", "16px"],
  ["--fs-sm", "14px"],
  ["--fs-xs", "12px"],
];

const SPACE_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
const RADII: Array<[string, string]> = [
  ["--radius-sm", "4px"],
  ["--radius-md", "6px"],
  ["--radius-lg", "8px"],
  ["--radius-xl", "12px"],
  ["--radius-2xl", "16px"],
  ["--radius-full", "pill"],
];

export function Foundations() {
  return (
    <>
      <Section
        id="colour"
        title="Colour"
        summary="Every value is a CSS variable. Light and dark carry the same token names, so a re-theme is a token swap. Each fill below is shown with the foreground token meant to sit on it — that pair is what has to stay readable."
      >
        <Specimen label="Surfaces and lines">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
            {SURFACE_TOKENS.map((t) => (
              <Swatch key={t} token={t} />
            ))}
          </div>
        </Specimen>

        <Specimen label="Status" note="fill + its foreground">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {STATUS_TOKENS.map(([bg, fg]) => (
              <Pair key={bg} bg={bg} fg={fg} />
            ))}
          </div>
        </Specimen>

        <Specimen label="Primary scale" note="--fg-accent picks a step per theme so brand-coloured text stays legible">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {PRIMARY_SCALE.map((s) => (
              <Swatch key={s} token={`primary-${s}`} label={String(s)} />
            ))}
          </div>
        </Specimen>

        <Specimen label="Neutral gray scale" note="true neutral, no hue tint">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-11">
            {GRAY_SCALE.map((s) => (
              <Swatch key={s} token={`gray-${s}`} label={String(s)} />
            ))}
          </div>
        </Specimen>

        <Specimen label="Numbers" note="--num-pos / --num-neg are tuned per theme for TEXT; --destructive is a fill">
          <Row className="gap-6">
            <span className="num text-lg" style={{ color: "var(--num-pos)" }}>
              +12,480.00
            </span>
            <span className="num text-lg" style={{ color: "var(--num-neg)" }}>
              −3,209.55
            </span>
            <span className="num text-lg" style={{ color: "var(--num-neutral)" }}>
              0.00
            </span>
          </Row>
        </Specimen>
      </Section>

      <Section
        id="typography"
        title="Typography"
        summary="Inter for text, Geist Mono for every number. Both ship as npm dependencies, so a consumer cannot silently fall back to the system stack."
      >
        <Specimen label="Scale">
          <div className="space-y-3">
            {TYPE_STEPS.map(([token, px]) => (
              <div key={token} className="flex items-baseline gap-4">
                <span className="font-mono-tabular w-28 shrink-0 text-[11px] text-muted-foreground">
                  {token}
                </span>
                <span className="font-mono-tabular w-12 shrink-0 text-[11px] text-muted-foreground">{px}</span>
                <span className="truncate" style={{ fontSize: `var(${token})`, lineHeight: 1.15 }}>
                  Grow the portfolio
                </span>
              </div>
            ))}
          </div>
        </Specimen>

        <Grid>
          <Specimen label="Semantic elements" note="h1–h5 are all defined, not just h1">
            <div className="space-y-2">
              <h1>Heading one</h1>
              <h2>Heading two</h2>
              <h3>Heading three</h3>
              <h4>Heading four</h4>
              <h5>Heading five</h5>
              <p>
                Body copy sits at 16px with a relaxed line height. It reads as secondary text so a
                page of prose does not compete with its own headings.
              </p>
              <p className="eyebrow">Eyebrow label</p>
            </div>
          </Specimen>

          <Specimen label="Numerals" note="tabular, so columns align">
            <div className="num space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Rent received</span>
                <span>4,120.00</span>
              </div>
              <div className="flex justify-between">
                <span>Management fee</span>
                <span>−288.40</span>
              </div>
              <div className="flex justify-between">
                <span>Repairs</span>
                <span>−1,911.05</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1 font-semibold">
                <span>Net</span>
                <span>1,920.55</span>
              </div>
            </div>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="space-radius"
        title="Spacing, radii and elevation"
        summary="A 4px base grid, a radius scale, and shadows that are tokens rather than hardcoded rgb — so they change with the theme instead of staying tuned for dark."
      >
        <Grid cols={3}>
          <Specimen label="Spacing" note="4px grid">
            <div className="space-y-1.5">
              {SPACE_STEPS.map((s) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="font-mono-tabular w-20 shrink-0 text-[11px] text-muted-foreground">
                    --space-{s}
                  </span>
                  <div className="h-3 rounded-sm bg-primary" style={{ width: `var(--space-${s})` }} />
                  <span className="font-mono-tabular text-[11px] text-muted-foreground">{s * 4}px</span>
                </div>
              ))}
            </div>
          </Specimen>

          <Specimen label="Radii">
            <div className="space-y-2">
              {RADII.map(([token, px]) => (
                <div key={token} className="flex items-center gap-3">
                  <div
                    className="h-10 w-16 border border-border bg-muted"
                    style={{ borderRadius: `var(${token})` }}
                  />
                  <span className="font-mono-tabular text-[11px] text-muted-foreground">
                    {token} · {px}
                  </span>
                </div>
              ))}
            </div>
          </Specimen>

          <Specimen label="Elevation" note="values differ between light and dark — toggle the theme">
            <div className="space-y-3">
              {["--shadow-sm", "--shadow-card", "--shadow-pop"].map((token) => (
                <div key={token} className="flex items-center gap-3">
                  <div
                    className="h-10 w-16 rounded-md border border-border bg-card"
                    style={{ boxShadow: `var(${token})` }}
                  />
                  <span className="font-mono-tabular text-[11px] text-muted-foreground">{token}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-16 rounded-md border border-border bg-card"
                  style={{ boxShadow: "var(--glow-primary)" }}
                />
                <span className="font-mono-tabular text-[11px] text-muted-foreground">--glow-primary</span>
              </div>
            </div>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="motion"
        title="Motion"
        summary="Three durations and two easings. Hover a swatch to run it."
      >
        <Specimen label="Durations and easing" note="hover to play">
          <Row className="gap-4">
            {[
              ["--dur-fast", "120ms"],
              ["--dur-base", "180ms"],
              ["--dur-slow", "260ms"],
            ].map(([token, ms]) => (
              <div key={token} className="group w-40 space-y-1">
                <div className="h-10 overflow-hidden rounded-md border border-border bg-muted">
                  <div
                    className="h-full w-8 bg-primary transition-transform group-hover:translate-x-32"
                    style={{
                      transitionDuration: `var(${token})`,
                      transitionTimingFunction: "var(--ease-out)",
                    }}
                  />
                </div>
                <span className="font-mono-tabular text-[11px] text-muted-foreground">
                  {token} · {ms}
                </span>
              </div>
            ))}
          </Row>
        </Specimen>
      </Section>
    </>
  );
}
