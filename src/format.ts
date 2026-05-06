export function money(value: number, options: { cents?: boolean } = {}): string {
  const fractionDigits = options.cents ? 2 : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}
