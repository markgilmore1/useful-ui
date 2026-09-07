import { useState } from "react";
import { Loader2, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Combobox } from "@/components/ui/combobox";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { InputDisplay } from "@/components/ui/input-display";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { CannotShow, Grid, Row, Section, Specimen } from "./frame";

const STATES = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia", disabled: true },
];

const MANAGERS = [
  { value: "ray-white", label: "Ray White", secondaryLabel: "Sydney CBD" },
  { value: "lj-hooker", label: "LJ Hooker", secondaryLabel: "Bondi" },
  { value: "mcgrath", label: "McGrath", secondaryLabel: "Paddington" },
];

export function Primitives() {
  const [manager, setManager] = useState<string | null>("ray-white");
  const [emptyCombo, setEmptyCombo] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(new Date(2026, 8, 7));
  const [checked, setChecked] = useState(true);
  const [calendarDay, setCalendarDay] = useState<Date | undefined>(new Date(2026, 8, 7));

  return (
    <>
      <Section
        id="button"
        title="Button"
        summary="Six variants, four sizes. Hover and focus are live — tab through this section rather than trusting the picture."
      >
        <Grid>
          <Specimen label="Variants">
            <Row>
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Row>
          </Specimen>

          <Specimen label="Sizes">
            <Row>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon" aria-label="Add">
                <Plus />
              </Button>
            </Row>
          </Specimen>

          <Specimen label="Disabled" note="every variant, so none of them disappears">
            <Row>
              <Button disabled>Default</Button>
              <Button variant="secondary" disabled>
                Secondary
              </Button>
              <Button variant="outline" disabled>
                Outline
              </Button>
              <Button variant="destructive" disabled>
                Destructive
              </Button>
            </Row>
          </Specimen>

          <Specimen label="Loading and with icon">
            <Row>
              <Button disabled>
                <Loader2 className="animate-spin" />
                Saving…
              </Button>
              <Button variant="outline">
                <Trash2 />
                Delete
              </Button>
              <Button variant="secondary">
                <Search />
                Search
              </Button>
            </Row>
          </Specimen>

          <Specimen label="Focus ring" note="the ring as it renders when focus-visible fires">
            <Row>
              <Button className="ring-2 ring-ring ring-offset-2 ring-offset-background">Focused</Button>
              <Button variant="outline" className="ring-2 ring-ring ring-offset-2 ring-offset-background">
                Focused outline
              </Button>
            </Row>
          </Specimen>

          <Specimen label="In context">
            <Row className="justify-end">
              <Button variant="ghost">Cancel</Button>
              <Button variant="outline">Save draft</Button>
              <Button>Publish</Button>
            </Row>
          </Specimen>
        </Grid>
      </Section>

      <Section id="badge" title="Badge" summary="Status and metadata. Not a button — badges are never clickable.">
        <Grid>
          <Specimen label="Variants">
            <Row>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="structure">STRUCTURE</Badge>
            </Row>
          </Specimen>
          <Specimen label="In a row of data">
            <Row>
              <span className="text-sm">12 Smith St</span>
              <Badge variant="secondary">Leased</Badge>
              <Badge variant="outline">Settlement 14 Oct</Badge>
            </Row>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="input"
        title="Input, Textarea and Label"
        summary="Text entry in every state a form can put it in."
      >
        <Grid>
          <Specimen label="Input — states">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="g-empty">Empty</Label>
                <Input id="g-empty" placeholder="e.g. 12 Smith St" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="g-filled">Filled</Label>
                <Input id="g-filled" defaultValue="12 Smith St" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="g-disabled">Disabled</Label>
                <Input id="g-disabled" defaultValue="12 Smith St" disabled />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="g-error" className="text-destructive">
                  Error
                </Label>
                {/* No error class — aria-invalid alone drives the styling, so this
                    specimen shows the real mechanism rather than a hand-painted one. */}
                <Input id="g-error" defaultValue="" aria-invalid />
                <p className="text-xs text-destructive">Required</p>
              </div>
            </div>
          </Specimen>

          <Specimen label="Textarea and read-only display">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="g-ta">Notes</Label>
                <Textarea id="g-ta" placeholder="Anything to remember…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="g-ta2">Disabled</Label>
                <Textarea id="g-ta2" defaultValue="Tenant renewed for 12 months." disabled />
              </div>
              <div className="space-y-1.5">
                <span className="eyebrow">InputDisplay — with and without a value</span>
                <div className="rounded-md border border-border">
                  <InputDisplay value="Ray White · Sydney CBD" />
                </div>
                <div className="rounded-md border border-border">
                  <InputDisplay value={null} placeholder="Not set" />
                </div>
              </div>
            </div>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="select"
        title="Select and Combobox"
        summary="Select for a short fixed list; Combobox when the list is long enough to need searching. Both share a trigger style."
      >
        <Grid>
          <Specimen label="Select — closed, chosen, disabled">
            <div className="space-y-3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value} disabled={s.disabled}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select defaultValue="nsw">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent />
              </Select>
            </div>
            <CannotShow>
              The open menu, its keyboard navigation and the disabled option are only visible once
              you open it. Click the first one.
            </CannotShow>
          </Specimen>

          <Specimen label="Combobox — selected, empty, loading, disabled">
            <div className="space-y-3">
              <Combobox
                ariaLabel="Property manager"
                options={MANAGERS}
                value={manager}
                onValueChange={setManager}
                placeholder="Search managers…"
                searchPlaceholder="Type to search…"
                emptyText="No managers found"
              />
              <Combobox
                ariaLabel="Empty combobox"
                options={[]}
                value={emptyCombo}
                onValueChange={setEmptyCombo}
                placeholder="No options available"
                emptyText="Nothing to choose from yet"
              />
              <Combobox ariaLabel="Loading combobox" options={[]} value={null} onValueChange={() => {}} loading />
              <Combobox
                ariaLabel="Disabled combobox"
                options={MANAGERS}
                value={null}
                onValueChange={() => {}}
                placeholder="Disabled"
                disabled
              />
            </div>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="toggles"
        title="Checkbox and Switch"
        summary="Checkbox for a value in a set; Switch for something that takes effect immediately."
      >
        <Grid>
          <Specimen label="Checkbox">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox id="g-cb1" />
                <Label htmlFor="g-cb1">Unchecked</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="g-cb2" checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
                <Label htmlFor="g-cb2">Checked (interactive)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="g-cb3" disabled />
                <Label htmlFor="g-cb3" className="text-muted-foreground">
                  Disabled
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="g-cb4" checked disabled />
                <Label htmlFor="g-cb4" className="text-muted-foreground">
                  Disabled + checked
                </Label>
              </div>
            </div>
          </Specimen>

          <Specimen label="Switch">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="g-sw1">Off</Label>
                <Switch id="g-sw1" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="g-sw2">On</Label>
                <Switch id="g-sw2" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="g-sw3" className="text-muted-foreground">
                  Disabled, off
                </Label>
                <Switch id="g-sw3" disabled />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="g-sw4" className="text-muted-foreground">
                  Disabled, on
                </Label>
                <Switch id="g-sw4" defaultChecked disabled />
              </div>
            </div>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="dates"
        title="Date input and Calendar"
        summary="A typed date field that accepts DD/MM/YYYY, with the calendar as the fallback rather than the only route."
      >
        <Grid>
          <Specimen label="DateInput — filled, empty, error, disabled">
            <div className="space-y-3">
              <DateInput value={date} onChange={setDate} placeholder="DD/MM/YYYY" />
              <DateInput value={null} onChange={() => {}} placeholder="DD/MM/YYYY" />
              <DateInput value={null} onChange={() => {}} placeholder="DD/MM/YYYY" error />
              <DateInput value={date} onChange={() => {}} placeholder="DD/MM/YYYY" disabled />
            </div>
          </Specimen>
          <Specimen label="Calendar">
            <Calendar mode="single" selected={calendarDay} onSelect={setCalendarDay} />
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="surfaces"
        title="Card, Separator and Skeleton"
        summary="Containers and the placeholder shown while their content is still loading."
      >
        <Grid cols={3}>
          <Specimen label="Card">
            <Card>
              <CardHeader>
                <CardTitle>12 Smith St</CardTitle>
                <CardDescription>Bondi Junction, NSW 2022</CardDescription>
              </CardHeader>
              <CardContent className="num text-sm">
                <div className="flex justify-between">
                  <span>Weekly rent</span>
                  <span>$960.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Yield</span>
                  <span>4.10%</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </CardFooter>
            </Card>
          </Specimen>

          <Specimen label="Separator">
            <div className="space-y-3 text-sm">
              <p>Horizontal</p>
              <Separator />
              <p>divides stacked content</p>
              <div className="flex h-10 items-center gap-3">
                <span>Vertical</span>
                <Separator orientation="vertical" />
                <span>divides inline content</span>
              </div>
            </div>
          </Specimen>

          <Specimen label="Skeleton" note="the loading state of the Card beside it">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Specimen>
        </Grid>
      </Section>

      <Section
        id="overlays"
        title="Dialog, Sheet, Popover, Tooltip and Dropdown"
        summary="Everything that appears above the page. These have to be opened to be judged — the triggers below are live."
      >
        <Grid cols={3}>
          <Specimen label="Dialog">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete property?</DialogTitle>
                  <DialogDescription>
                    This removes 12 Smith St and its 14 transactions. It cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Specimen>

          <Specimen label="Sheet">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Open sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow the list without leaving the page.</SheetDescription>
                </SheetHeader>
                <div className="space-y-3 py-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="g-f1" defaultChecked />
                    <Label htmlFor="g-f1">Leased</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="g-f2" />
                    <Label htmlFor="g-f2">Vacant</Label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </Specimen>

          <Specimen label="Popover">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <p className="text-sm font-medium">Yield</p>
                <p className="text-sm text-muted-foreground">
                  Annual rent divided by purchase price, before costs.
                </p>
              </PopoverContent>
            </Popover>
          </Specimen>

          <Specimen label="Tooltip" note="hover or focus the button">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More">
                    <MoreHorizontal />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Last synced 4 minutes ago</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Specimen>

          <Specimen label="Dropdown menu">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Actions</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>12 Smith St</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Edit
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Specimen>

          <Specimen label="Command" note="the search primitive the Combobox is built on">
            <Command className="rounded-md border border-border">
              <CommandInput placeholder="Search…" />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup heading="Properties">
                  <CommandItem>12 Smith St</CommandItem>
                  <CommandItem>4/88 Ocean Rd</CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                  <CommandItem>
                    Add property
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </Specimen>
        </Grid>
      </Section>
    </>
  );
}
