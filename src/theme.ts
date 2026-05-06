type Theme = 'dark' | 'light';

let theme: Theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);

let onChange: () => void = () => {};

export function setThemeChangeListener(fn: () => void): void {
  onChange = fn;
}

export function getTheme(): Theme {
  return theme;
}

export function toggleTheme(): void {
  theme = theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  onChange();
}
