import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TextField,
  CurrencyField,
  PercentField,
  SelectField,
  ComboboxField,
  DateField,
  SwitchField,
  TextareaField,
} from "@/components/fields";
import { ModeToggle } from "@/components/mode-toggle";

const schema = z.object({
  name: z.string().min(1, "Required"),
  price: z.number().nullable(),
  rate: z.number().nullable(),
  state: z.string().min(1, "Pick a state"),
  manager: z.string().nullable(),
  settlement: z.string().nullable(),
  notes: z.string().optional(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const STATES = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
  { value: "wa", label: "Western Australia" },
  { value: "sa", label: "South Australia" },
];

const MANAGERS = [
  { value: "ray-white", label: "Ray White", secondaryLabel: "Sydney CBD" },
  { value: "lj-hooker", label: "LJ Hooker", secondaryLabel: "Bondi" },
  { value: "mcgrath", label: "McGrath", secondaryLabel: "Paddington" },
];

export default function App() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      price: null,
      rate: null,
      state: "",
      manager: null,
      settlement: null,
      notes: "",
      active: true,
    },
  });

  const onSubmit = (values: FormValues) => {
    // eslint-disable-next-line no-console
    console.log("submitted", values);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="topbar-blur sticky top-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">useful-ui</span>
          <Badge variant="secondary">design system</Badge>
        </div>
        <ModeToggle />
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div className="space-y-2">
          <h1>Component playground</h1>
          <p className="text-muted-foreground">
            Reusable fields layer, combobox, and date input — driven by the shared token system.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add property</CardTitle>
            <CardDescription>Every input below is from the portable fields layer.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <TextField
                  control={form.control}
                  name="name"
                  label="Property name"
                  required
                  placeholder="e.g. 12 Smith St"
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <CurrencyField
                    control={form.control}
                    name="price"
                    label="Purchase price"
                    valueAs="number"
                  />
                  <PercentField
                    control={form.control}
                    name="rate"
                    label="Interest rate"
                    valueAs="number"
                  />
                </div>
                <SelectField
                  control={form.control}
                  name="state"
                  label="State"
                  placeholder="Select a state"
                  options={STATES}
                  required
                />
                <ComboboxField
                  control={form.control}
                  name="manager"
                  label="Property manager"
                  ariaLabel="Property manager"
                  placeholder="Search managers…"
                  searchPlaceholder="Type to search…"
                  emptyText="No managers found"
                  options={MANAGERS}
                />
                <DateField
                  control={form.control}
                  name="settlement"
                  label="Settlement date"
                  placeholder="DD/MM/YYYY"
                />
                <TextareaField
                  control={form.control}
                  name="notes"
                  label="Notes"
                  placeholder="Anything to remember…"
                />
                <SwitchField
                  control={form.control}
                  name="active"
                  label="Actively tracked"
                />
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit">Save property</Button>
                  <Button type="button" variant="outline" onClick={() => form.reset()}>
                    Reset
                  </Button>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
