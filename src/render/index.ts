import { state } from '../state';
import { renderIntro } from './intro';
import { renderPicker } from './picker';
import { renderPlay } from './play';
import { renderTopbar } from './topbar';
import { renderWon } from './won';

function renderToast(): string {
  if (!state.toast) return '';
  return `<aside class="toast" role="status" data-testid="toast"><strong>${state.toast.title}</strong><span>${state.toast.detail}</span></aside>`;
}

function renderScreen(): string {
  switch (state.phase) {
    case 'intro':
      return renderIntro();
    case 'picking':
      return renderPicker();
    case 'won':
      return renderWon();
    case 'play':
      return renderPlay();
  }
}

function renderFooter(): string {
  return `
    <footer class="app-footer" data-testid="app-footer">
      <a href="https://github.com/peterb154/cashflow/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer" data-testid="link-changelog">View changelog</a>
    </footer>`;
}

export function render(app: HTMLElement): void {
  app.innerHTML = `
    <div class="app-frame">
      ${renderTopbar()}
      ${renderScreen()}
      ${renderFooter()}
    </div>
    ${renderToast()}`;
}
