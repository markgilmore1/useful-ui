"""Reads a design-token CSS file and checks every foreground/background pair
against WCAG AA (4.5:1) in BOTH themes. Exits non-zero on any failure."""
import re, sys

def hsl2rgb(h, s, l):
    h = h % 360; s /= 100; l /= 100
    c = (1 - abs(2*l - 1)) * s; x = c * (1 - abs((h/60) % 2 - 1)); m = l - c/2
    r, g, b = [(c,x,0),(x,c,0),(0,c,x),(0,x,c),(x,0,c),(c,0,x)][int(h//60)]
    return (r+m, g+m, b+m)

def luminance(rgb):
    f = lambda v: v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
    r, g, b = map(f, rgb)
    return 0.2126*r + 0.7152*g + 0.0722*b

def contrast(a, b):
    la, lb = luminance(hsl2rgb(*a)), luminance(hsl2rgb(*b))
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

TRIPLET = re.compile(r'^\s*(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*$')
WRAPPED = re.compile(r'^\s*hsl\(\s*(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*\)\s*$')
ALIAS   = re.compile(r'^\s*hsl\(\s*var\(\s*(--[\w-]+)\s*\)\s*\)\s*$')

def parse(css):
    """Return {'light': {...}, 'dark': {...}} of token -> (h, s, l).

    Selector bodies are found by matching braces, not by regex, so this works
    whether or not the tokens sit inside an @layer / media wrapper.
    """
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)   # strip comments first

    def bodies(selector):
        """Every {...} body belonging to `selector`, concatenated."""
        out, i = [], 0
        pat = re.compile(r'(?:^|[\s,{}])' + re.escape(selector) + r'\s*\{')
        while True:
            m = pat.search(css, i)
            if not m: break
            depth, j = 1, m.end()
            while j < len(css) and depth:
                if css[j] == '{': depth += 1
                elif css[j] == '}': depth -= 1
                j += 1
            out.append(css[m.end():j-1]); i = j
        return "\n".join(out)

    raw = {'light': bodies(':root'), 'dark': bodies('.dark')}
    if not raw['light']:
        raise SystemExit("could not find a :root block - nothing to check")

    out = {}
    for theme in ('light', 'dark'):
        vals, aliases = {}, {}
        for name, value in re.findall(r'(--[\w-]+)\s*:\s*([^;]+);', raw[theme]):
            value = value.strip()
            for rx in (TRIPLET, WRAPPED):
                m = rx.match(value)
                if m:
                    vals[name] = tuple(float(g) for g in m.groups()); break
            else:
                m = ALIAS.match(value)
                if m: aliases[name] = m.group(1)
        base = dict(out.get('light', {}))       # dark inherits unoverridden :root values
        base.update(vals)
        for name, target in aliases.items():
            if target in base: base[name] = base[target]
        out[theme] = base
    return out


# (foreground, background, label) — the pairs that must be readable.
PAIRS = [
    ('foreground', 'background', 'body text'),
    ('foreground', 'card', 'text on card'),
    ('muted-foreground', 'background', 'secondary text'),
    ('muted-foreground', 'card', 'secondary text on card'),
    ('muted-foreground', 'muted', 'secondary text on muted'),
    ('primary-foreground', 'primary', 'primary button label'),
    ('secondary-foreground', 'secondary', 'secondary button label'),
    ('accent-foreground', 'accent', 'accent label'),
    ('destructive-foreground', 'destructive', 'destructive button label'),
    ('success-foreground', 'success', 'success badge label'),
    ('warning-foreground', 'warning', 'warning badge label'),
    ('fg-accent', 'background', 'brand-accent text'),
    ('fg-accent', 'card', 'brand-accent text on card'),
    ('num-pos', 'card', 'positive number in table'),
    ('num-neg', 'card', 'negative number in table'),
    ('num-pos', 'background', 'positive number'),
    ('num-neg', 'background', 'negative number'),
]
MIN = 4.5

def main(path):
    themes = parse(open(path).read())
    failures, unmeasured, checked = [], [], 0
    for theme in ('light', 'dark'):
        t = themes[theme]
        print(f"--- {theme.upper()} ---")
        for fg, bg, label in PAIRS:
            f, b = t.get('--' + fg), t.get('--' + bg)
            if f is None or b is None:
                missing = ', '.join('--' + n for n, v in ((fg, f), (bg, b)) if v is None)
                print(f"  ????  {label:30s}   NOT MEASURED (no {missing})")
                unmeasured.append(f"{theme}: {label} (no {missing})")
                continue
            r = contrast(f, b)
            ok = r >= MIN
            checked += 1
            print(f"  {'ok  ' if ok else 'FAIL'}  {label:30s} {r:5.2f}  (--{fg} on --{bg})")
            if not ok: failures.append(f"{theme}: {label} {r:.2f} (--{fg} on --{bg})")

    total = len(PAIRS) * 2
    print()
    print(f"measured {checked}/{total} pairs")
    if unmeasured:
        print(f"{len(unmeasured)} pair(s) COULD NOT BE MEASURED - the token is missing, "
              f"so this file has NOT been shown to be accessible:")
        for u in unmeasured: print("  " + u)
    if failures:
        print(f"{len(failures)} pair(s) below {MIN}:1")
        for f in failures: print("  " + f)
    if failures or unmeasured:
        return 1
    print(f"All {checked} pairs pass WCAG AA ({MIN}:1).")
    return 0

if __name__ == '__main__':
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else 'colors_and_type.css'))
