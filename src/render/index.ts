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

export function render(app: HTMLElement): void {
  app.innerHTML = `
    <div class="prototype-frame">
      ${renderTopbar()}
      ${renderScreen()}
    </div>
    ${renderToast()}`;
}
