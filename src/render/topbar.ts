import { state } from '../state';
import { getTheme } from '../theme';

function logoSvg(): string {
  return `
    <svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-label="FIRE Fastlane logo">
      <path d="M10 32C10 19 20 11 24 6C28 14 38 19 38 31C38 39 32 44 24 44C16 44 10 39 10 32Z" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M19 33C19 27 23 23 25 19C27 24 31 27 31 33C31 37 28 40 24.8 40C21.5 40 19 37 19 33Z" fill="currentColor"/>
      <path d="M14 15H22M26 15H34" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`;
}

function sunIcon(): string {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function moonIcon(): string {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 13.1A8.5 8.5 0 1 1 10.9 3a6.5 6.5 0 0 0 10.1 10.1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;
}

export function renderTopbar(): string {
  return `
    <header class="topbar">
      <div class="brand">
        ${logoSvg()}
        <div class="brand-copy">
          <h1>FIRE Fastlane</h1>
        </div>
      </div>
      <div class="button-row" style="gap: var(--space-2); align-items: center;">
        ${
          state.phase !== 'intro'
            ? `<span class="month-pill"><span>Month</span><strong data-testid="text-month">${state.month}</strong></span>`
            : ''
        }
        <button class="icon-button" type="button" data-testid="button-theme" aria-label="Toggle theme" data-action="toggleTheme">
          ${getTheme() === 'dark' ? sunIcon() : moonIcon()}
        </button>
      </div>
    </header>`;
}
