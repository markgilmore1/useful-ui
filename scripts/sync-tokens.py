"""Regenerate registry.json's `foundation` cssVars from src/index.css.

src/index.css is the single source of truth for token VALUES. Before this
script existed the same ~100 values were typed out in both files, which is
exactly how two files come to disagree. Run after editing index.css:

    npm run tokens:sync

Also verifies that every `var(--token)` referenced by tailwind.config.ts is
actually defined in index.css, so a renamed token fails here rather than
silently rendering as nothing in a browser.
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = ROOT / "src/index.css"
CONFIG = ROOT / "tailwind.config.ts"
REGISTRY = ROOT / "registry.json"

# Tokens with these prefixes are theme-independent scalars -> cssVars.theme.
# Everything else is a per-theme value -> cssVars.light / cssVars.dark.
SCALAR_PREFIXES = (
    "--radius", "--space-", "--font-", "--fs-", "--lh-",
    "--tracking-", "--fw-", "--ease-", "--dur-", "--glow-hero",
)


def selector_body(css: str, selector: str) -> str:
    """Every {...} body for `selector`, brace-matched (survives @layer nesting)."""
    out, i = [], 0
    pat = re.compile(r"(?:^|[\s,{}])" + re.escape(selector) + r"\s*\{")
    while True:
        m = pat.search(css, i)
        if not m:
            break
        depth, j = 1, m.end()
        while j < len(css) and depth:
            depth += {"{": 1, "}": -1}.get(css[j], 0)
            j += 1
        out.append(css[m.end():j - 1])
        i = j
    return "\n".join(out)


def declarations(body: str) -> dict:
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
    return {
        name: " ".join(value.split())
        for name, value in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", body)
    }


def main() -> int:
    css = CSS.read_text()
    light = declarations(selector_body(css, ":root"))
    dark = declarations(selector_body(css, ".dark"))
    if not light:
        print("no :root block found in src/index.css", file=sys.stderr)
        return 1

    # A token referenced by the Tailwind config must exist in the CSS.
    # --radix-* are set at runtime by Radix primitives, not by our tokens.
    referenced = {
        name for name in re.findall(r"var\((--[\w-]+)\)", CONFIG.read_text())
        if not name.startswith("--radix-")
    }
    missing = sorted(referenced - set(light))
    if missing:
        print("tailwind.config.ts references tokens that src/index.css does not define:")
        for name in missing:
            print("  " + name)
        return 1

    theme, css_light, css_dark = {}, {}, {}
    for name, value in light.items():
        if name.startswith(SCALAR_PREFIXES) and name not in dark:
            theme[name] = value
        else:
            css_light[name.lstrip("-")] = value
    for name, value in dark.items():
        css_dark[name.lstrip("-")] = value
    # Dark inherits anything it does not override; shadcn expects both blocks
    # to be self-contained, so fill the gaps from light.
    for name, value in css_light.items():
        css_dark.setdefault(name, value)

    registry = json.loads(REGISTRY.read_text())
    for item in registry["items"]:
        if item["name"] == "foundation":
            item["cssVars"] = {"theme": theme, "light": css_light, "dark": css_dark}
            break
    else:
        print("no `foundation` item in registry.json", file=sys.stderr)
        return 1

    REGISTRY.write_text(json.dumps(registry, indent=2) + "\n")
    print(f"registry.json foundation cssVars regenerated from src/index.css")
    print(f"  theme {len(theme)}  ·  light {len(css_light)}  ·  dark {len(css_dark)}")
    print(f"  {len(referenced)} tokens referenced by tailwind.config.ts, all defined")
    return 0


if __name__ == "__main__":
    sys.exit(main())
