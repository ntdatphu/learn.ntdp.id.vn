/** Prototype-only. Keep production CLI untouched until visual acceptance. */
export function initializeCopy() {
  const fine = matchMedia('(min-width: 48rem) and (hover: hover) and (pointer: fine)');
  const available = isSecureContext && typeof navigator.clipboard?.writeText === 'function';
  document.querySelectorAll<HTMLElement>('[data-command-row]').forEach(row => {
    if (row.dataset.initialized) return;
    row.dataset.initialized = 'true';
    const button = row.querySelector<HTMLButtonElement>('[data-command-copy]')!;
    const status = row.querySelector<HTMLElement>('[data-copy-announcement]')!;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => { button.hidden = !available || !fine.matches; button.disabled = button.hidden; };
    update(); fine.addEventListener('change', update);
    button.addEventListener('click', async () => {
      if (button.disabled || !fine.matches || row.dataset.busy) return;
      row.dataset.busy = 'true';
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(button.dataset.command!);
        row.classList.add('is-copied');
        status.textContent = `${button.dataset.command} copied.`;
        timer = setTimeout(() => { row.classList.remove('is-copied'); status.textContent = ''; }, 1250);
      } catch {
        // Failure stays next to the action, with manual selection still available.
        row.classList.add('copy-failed');
        status.textContent = 'Copy unavailable. Select the command text manually.';
        button.title = status.textContent;
        timer = setTimeout(() => row.classList.remove('copy-failed'), 1250);
      } finally { delete row.dataset.busy; }
    });
  });
}
