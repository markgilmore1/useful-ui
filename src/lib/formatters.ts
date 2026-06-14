const THOUSAND = 1_000;
const MILLION = 1_000_000;
const BILLION = 1_000_000_000;
const TWENTY_THOUSAND = 20_000;
const TWENTY_MILLION = 20_000_000;
const TWENTY_BILLION = 20_000_000_000;

function formatWholeDollars(amount: number): string {
  return `$${amount.toLocaleString('en-AU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function formatWithSuffix(amount: number, divisor: number, fractionDigits: number, suffix: 'k' | 'M' | 'B'): string {
  return `$${(amount / divisor).toLocaleString('en-AU', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}${suffix}`;
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) return '$0';

  const sign = amount < 0 ? '-' : '';
  const absoluteAmount = Math.abs(amount);
  let formatted: string;

  if (absoluteAmount < 10_000) {
    formatted = formatWholeDollars(absoluteAmount);
  } else if (absoluteAmount < TWENTY_THOUSAND) {
    formatted = formatWithSuffix(absoluteAmount, THOUSAND, 1, 'k');
  } else if (absoluteAmount < MILLION) {
    formatted = formatWithSuffix(absoluteAmount, THOUSAND, 0, 'k');
  } else if (absoluteAmount < TWENTY_MILLION) {
    formatted = formatWithSuffix(absoluteAmount, MILLION, 1, 'M');
  } else if (absoluteAmount < BILLION) {
    formatted = formatWithSuffix(absoluteAmount, MILLION, 0, 'M');
  } else if (absoluteAmount < TWENTY_BILLION) {
    formatted = formatWithSuffix(absoluteAmount, BILLION, 1, 'B');
  } else {
    formatted = formatWithSuffix(absoluteAmount, BILLION, 0, 'B');
  }

  return `${sign}${formatted}`;
}

export function formatCurrencyPrecise(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return '$0.00';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function formatPercentage(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatPercentageSimple(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
}

type SelectOption = {
  value?: string | number | null;
  id?: string | number | null;
  label?: string | null;
  name?: string | null;
};

export function formatSelectValue(
  value: SelectOption['value'] | SelectOption['id'],
  options?: SelectOption[]
): string | number | null | undefined {
  if (!options || value === null || value === undefined) return value;

  const matchedOption = options.find(
    (option) => option.value === value || option.id === value
  );

  if (!matchedOption) return value;

  return matchedOption.label ?? matchedOption.name ?? value;
}
