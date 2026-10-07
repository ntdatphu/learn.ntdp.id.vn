/** Command-local progressive enhancement. Reading and selection never require JS. */
export function initializeCommandCopy() {
  const fine = matchMedia('(min-width: 48rem) and (hover: hover) and (pointer: fine)');
  const available = isSecureContext && typeof navigator.clipboard?.writeText === 'function';
  document.querySelectorAll<HTMLElement>('[data-command-row]').forEach(row => {
    if (row.dataset.copyInitialized) return;
    const button = row.querySelector<HTMLButtonElement>('[data-cli-copy]');
    const status = row.querySelector<HTMLElement>('[data-copy-announcement]');
    if (!button || !status) return;
    row.dataset.copyInitialized = 'true';
    let timer: ReturnType<typeof setTimeout>;
    const clear = () => {
      clearTimeout(timer);
      row.classList.remove('is-copied', 'copy-failed');
      button.removeAttribute('title');
      status.textContent = '';
    };
    const update = () => {
      button.hidden = !available || !fine.matches;
      button.disabled = button.hidden;
      if (button.hidden) clear();
    };
    update(); fine.addEventListener('change', update);
    button.addEventListener('click', async () => {
      if (button.disabled || !fine.matches || row.dataset.copyBusy) return;
      row.dataset.copyBusy = 'true';
      clear();
      try {
        await navigator.clipboard.writeText(button.dataset.command!);
        if (button.hidden) return;
        row.classList.add('is-copied');
        status.textContent = `${button.dataset.command} copied.`;
        timer = setTimeout(clear, 1250);
      } catch {
        if (button.hidden) return;
        row.classList.add('copy-failed');
        status.textContent = 'Copy unavailable. Select the command text manually.';
        button.title = status.textContent;
        timer = setTimeout(clear, 1250);
      } finally { delete row.dataset.copyBusy; }
    });
  });
}
