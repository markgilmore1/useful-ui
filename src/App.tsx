import { useEffect, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

import { Fields } from "./gallery/fields";
import { Foundations } from "./gallery/foundations";
import { Primitives } from "./gallery/primitives";

const NAV: Array<{ group: string; items: Array<[string, string]> }> = [
  {
    group: "Foundations",
    items: [
      ["colour", "Colour"],
      ["typography", "Typography"],
      ["space-radius", "Spacing & elevation"],
      ["motion", "Motion"],
    ],
  },
  {
    group: "Components",
    items: [
      ["button", "Button"],
      ["badge", "Badge"],
      ["input", "Input & Textarea"],
      ["select", "Select & Combobox"],
      ["toggles", "Checkbox & Switch"],
      ["dates", "Date & Calendar"],
      ["surfaces", "Card & Skeleton"],
      ["overlays", "Overlays"],
    ],
  },
  { group: "Patterns", items: [["fields", "Fields layer"]] },
];

const WIDTHS = {
  mobile: { label: "375", width: 375, icon: Smartphone },
  tablet: { label: "768", width: 768, icon: Tablet },
  full: { label: "Full", width: null, icon: Monitor },
} as const;

type WidthKey = keyof typeof WIDTHS;

export default function App() {
  const [width, setWidth] = useState<WidthKey>("full");
  const [active, setActive] = useState("colour");

  // Highlight whichever section is currently in view.
  useEffect(() => {
    const ids = NAV.flatMap((g) => g.items.map(([id]) => id));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const constrained = WIDTHS[width].width;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="topbar-blur sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">useful-ui</span>
          <Badge variant="secondary">gallery</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            {(Object.keys(WIDTHS) as WidthKey[]).map((key) => {
              const { label, icon: Icon } = WIDTHS[key];
              return (
                <Button
                  key={key}
                  size="sm"
                  variant={width === key ? "secondary" : "ghost"}
                  className="h-7 gap-1.5 px-2 text-xs"
                  onClick={() => setWidth(key)}
                  aria-pressed={width === key}
                >
                  <Icon className="!size-3.5" />
                  {label}
                </Button>
              );
            })}
          </div>
          <ModeToggle />
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-10 px-6 py-10">
        <nav className="sticky top-20 hidden h-[calc(100vh-6rem)] w-52 shrink-0 overflow-y-auto lg:block">
          <ul className="space-y-6 text-sm">
            {NAV.map((group) => (
              <li key={group.group}>
                <p className="eyebrow mb-2">{group.group}</p>
                <ul className="space-y-0.5">
                  {group.items.map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={cn(
                          "block rounded-md px-2 py-1 transition-colors duration-fast",
                          active === id
                            ? "bg-muted font-medium text-foreground"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                        )}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1">
          <div className="mb-10 space-y-2">
            <h1>Useful UI</h1>
            <p className="max-w-2xl text-muted-foreground">
              Every component, every variant, every state it can be in — in both themes. Tokens are
              generated from <span className="num">src/index.css</span>; open this in a browser and
              read it as the person who has to use the thing, because that is what unit tests cannot
              reach.
            </p>
          </div>

          {/* The width control constrains the content column rather than the window, so a
              narrow layout can be checked without resizing anything. */}
          <div
            className={cn("space-y-14", constrained && "mx-auto border-x border-dashed border-border px-4")}
            style={constrained ? { maxWidth: constrained } : undefined}
          >
            <Foundations />
            <Primitives />
            <Fields />
          </div>
        </main>
      </div>
    </div>
  );
}
