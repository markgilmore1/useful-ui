import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  CheckboxField,
  ComboboxField,
  CurrencyField,
  DateField,
  DisplayField,
  NumberField,
  PercentField,
  SelectField,
  SwitchField,
  TextField,
  TextareaField,
} from "@/components/fields";

import { Grid, Row, Section, Specimen } from "./frame";

const schema = z.object({
  name: z.string().min(1, "Required"),
  price: z.number().nullable(),
  units: z.number().nullable(),
  rate: z.number().nullable(),
  state: z.string().min(1, "Pick a state"),
  manager: z.string().nullable(),
  settlement: z.string().nullable(),
  notes: z.string().optional(),
  active: z.boolean(),
  agreed: z.boolean(),
});

type Values = z.infer<typeof schema>;

const STATES = [
  { value: "nsw", label: "New South Wales" },
  { value: "vic", label: "Victoria" },
  { value: "qld", label: "Queensland" },
];

const MANAGERS = [
  { value: "ray-white", label: "Ray White", secondaryLabel: "Sydney CBD" },
  { value: "lj-hooker", label: "LJ Hooker", secondaryLabel: "Bondi" },
];

const FILLED: Values = {
  name: "12 Smith St",
  price: 1250000,
  units: 3,
  rate: 6.14,
  state: "nsw",
  manager: "ray-white",
  settlement: "2026-10-14",
  notes: "Tenant renewed for 12 months from 1 Nov.",
  active: true,
  agreed: true,
};

const BLANK: Values = {
  name: "",
  price: null,
  units: null,
  rate: null,
  state: "",
  manager: null,
  settlement: null,
  notes: "",
  active: false,
  agreed: false,
};

/** Every field type, once, at whatever values the caller passes. */
function AllFields({
  values,
  mode = "edit",
  disabled = false,
}: {
  values: Values;
  mode?: "edit" | "display";
  disabled?: boolean;
}) {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: values });
  const common = { control: form.control, mode, disabled } as const;

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <TextField {...common} name="name" label="Property name" required placeholder="e.g. 12 Smith St" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CurrencyField {...common} name="price" label="Purchase price" valueAs="number" />
          <PercentField {...common} name="rate" label="Interest rate" valueAs="number" />
        </div>
        <NumberField {...common} name="units" label="Bedrooms" valueAs="number" />
        <SelectField {...common} name="state" label="State" placeholder="Select a state" options={STATES} required />
        <ComboboxField
          {...common}
          name="manager"
          label="Property manager"
          ariaLabel="Property manager"
          placeholder="Search managers…"
          emptyText="No managers found"
          options={MANAGERS}
        />
        <DateField {...common} name="settlement" label="Settlement date" placeholder="DD/MM/YYYY" />
        <TextareaField {...common} name="notes" label="Notes" placeholder="Anything to remember…" />
        <SwitchField {...common} name="active" label="Actively tracked" />
        <CheckboxField {...common} name="agreed" label="I have read the contract" />
        <DisplayField label="Always read-only (DisplayField)" value={values.name} placeholder="Not set" />
      </form>
    </Form>
  );
}

/** The validation state, forced by submitting an empty required form. */
function ErrorState() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: BLANK });
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(() => {})}>
        <TextField control={form.control} name="name" label="Property name" required placeholder="e.g. 12 Smith St" />
        <SelectField
          control={form.control}
          name="state"
          label="State"
          placeholder="Select a state"
          options={STATES}
          required
        />
        <Row>
          <Button type="submit" size="sm">
            Submit to show errors
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => form.reset(BLANK)}>
            Clear
          </Button>
        </Row>
      </form>
    </Form>
  );
}

export function Fields() {
  return (
    <Section
      id="fields"
      title="Fields layer"
      summary="Typed React-Hook-Form wrappers. Every field takes the same base props, so `mode='display'` turns an entire form read-only without a second set of components — which is the reason this layer exists."
    >
      <Grid>
        <Specimen label="Empty" note="placeholders, nothing entered">
          <AllFields values={BLANK} />
        </Specimen>
        <Specimen label="Filled">
          <AllFields values={FILLED} />
        </Specimen>
        <Specimen label="Display mode" note="mode='display' — the same components, read-only">
          <AllFields values={FILLED} mode="display" />
        </Specimen>
        <Specimen label="Disabled" note="disabled — editable in principle, not right now">
          <AllFields values={FILLED} disabled />
        </Specimen>
      </Grid>

      <Specimen label="Validation" note="submit the empty form to see how errors read">
        <div className="max-w-md">
          <ErrorState />
        </div>
      </Specimen>
    </Section>
  );
}
