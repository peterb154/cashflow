import { state } from '../state';
import { renderIntro } from './intro';
import { renderPlay } from './play';
import { renderTopbar } from './topbar';
import { renderWon } from './won';

function renderToast(): string {
  if (!state.toast) return '';
  return `<aside class="toast" role="status" data-testid="toast"><strong>${state.toast.title}</strong><span>${state.toast.detail}</span></aside>`;
}

export function render(app: HTMLElement): void {
  app.innerHTML = `
    <div class="prototype-frame">
      ${renderTopbar()}
      ${state.phase === 'intro' ? renderIntro() : state.phase === 'won' ? renderWon() : renderPlay()}
    </div>
    ${renderToast()}`;
}
