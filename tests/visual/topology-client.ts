export function initializeTopologies() {
  document.querySelectorAll<HTMLElement>('[data-topology]').forEach(root => {
    if (root.dataset.initialized) return;
    root.dataset.initialized = 'true';
    const complex = root.dataset.topology === 'complex';
    const status = root.querySelector<HTMLElement>('[data-path-status]')!;
    const cross = root.querySelector<HTMLButtonElement>('[data-cross-reference]')!;
    const clear = root.querySelector<HTMLButtonElement>('[data-clear-focus]')!;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let pinned = false, crossActive = false, step = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const play = root.querySelector<HTMLButtonElement>('[data-sequence-play]');
    const next = root.querySelector<HTMLButtonElement>('[data-sequence-step]');
    const initial = status.textContent!;
    const steps = ['Start at R-EDGE.', 'Follow the switch-owned Gi1/0/1 endpoint on SW-EDGE-01.', 'Follow Gi1/0/8 to CLIENT-A eth0.'];
    const render = () => {
      const nodes = new Set<string>(), links = new Set<string>();
      if (crossActive) { nodes.add('sw1'); nodes.add('a'); links.add('access-a'); }
      else if (step) {
        nodes.add('r'); if (step >= 2) { nodes.add('sw1'); links.add('uplink-left'); }
        if (step >= 3) { nodes.add('a'); links.add('access-a'); }
      }
      root.classList.toggle('has-diagram-focus', nodes.size > 0);
      root.querySelectorAll<HTMLElement>('[data-node-id]').forEach(el => el.classList.toggle('is-focused', nodes.has(el.dataset.nodeId!)));
      root.querySelectorAll<HTMLElement>('[data-link-id]').forEach(el => el.classList.toggle('is-focused', links.has(el.dataset.linkId!)));
      root.querySelectorAll<HTMLElement>('[data-endpoint-link]').forEach(el => el.classList.toggle('is-focused', links.has(el.dataset.endpointLink!)));
      status.textContent = crossActive ? `Focus · SW-EDGE-01 ${complex ? 'Gi1/0/8' : 'Gi1/0/7'} → CLIENT-A eth0.` : step ? `Step ${step} of 3 · ${steps[step - 1]}` : initial;
      clear.hidden = !pinned;
      cross.classList.toggle('is-focused', crossActive);
      if (next) next.disabled = step === 3;
    };
    const stop = () => { clearTimeout(timer); timer = undefined; if (play) { play.textContent = 'Play'; play.setAttribute('aria-pressed','false'); } };
    cross.disabled = false;
    cross.addEventListener('pointerenter', () => { if (fine.matches) { crossActive = true; render(); } });
    cross.addEventListener('pointerleave', () => { if (fine.matches && document.activeElement !== cross) { crossActive = false; render(); } });
    cross.addEventListener('focus', () => { crossActive = true; render(); });
    cross.addEventListener('blur', () => { if (!pinned) { crossActive = false; render(); } });
    cross.addEventListener('click', () => { if (!fine.matches) { pinned = !pinned; crossActive = pinned; render(); } });
    clear.addEventListener('click', () => { pinned = crossActive = false; render(); });
    if (complex) {
      root.querySelectorAll<HTMLButtonElement>('[data-sequence-play],[data-sequence-step],[data-sequence-reset],[data-expand]').forEach(button => button.disabled = false);
      play!.setAttribute('aria-pressed','false');
      next!.addEventListener('click', () => { stop(); pinned = crossActive = false; step = Math.min(3, step + 1); render(); });
      root.querySelector('[data-sequence-reset]')!.addEventListener('click', () => { stop(); pinned = crossActive = false; step = 0; render(); });
      play!.addEventListener('click', () => {
        if (timer) { stop(); return; }
        pinned = crossActive = false;
        step = step >= 3 ? 1 : step + 1; render();
        play!.textContent = 'Pause'; play!.setAttribute('aria-pressed','true');
        const advance = () => { if (step < 3) { step++; render(); timer = setTimeout(advance, 1800); } else stop(); };
        timer = setTimeout(advance, 1800);
      });
      const dialog = root.querySelector<HTMLDialogElement>('[data-diagram-dialog]')!;
      const expand = root.querySelector<HTMLButtonElement>('[data-expand]')!;
      const close = root.querySelector<HTMLButtonElement>('[data-close-dialog]')!;
      const viewport = root.querySelector<HTMLElement>('.ux-pan-viewport')!;
      const layer = root.querySelector<HTMLElement>('.ux-zoom-layer')!;
      let zoom = 1, previousOverflow = '';
      const setZoom = (value: number) => {
        zoom = Math.max(1, Math.min(2, value)); layer.style.width = `${zoom * 100}%`;
        root.querySelector('[data-zoom-value]')!.textContent = `${Math.round(zoom * 100)}%`;
        root.querySelector<HTMLButtonElement>('[data-zoom-out]')!.disabled = zoom === 1;
        root.querySelector<HTMLButtonElement>('[data-zoom-in]')!.disabled = zoom === 2;
      };
      expand.addEventListener('click', () => { stop(); previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog.showModal(); setZoom(1); viewport.scrollTo(0,0); close.focus(); });
      close.addEventListener('click', () => dialog.close());
      // Keep keyboard traversal inside the review canvas instead of browser chrome.
      dialog.addEventListener('keydown', event => {
        if (event.key !== 'Tab') return;
        const controls = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [tabindex="0"]')];
        const first = controls[0], last = controls.at(-1)!;
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      dialog.addEventListener('close', () => { document.body.style.overflow = previousOverflow; expand.focus(); });
      root.querySelector('[data-zoom-out]')!.addEventListener('click', () => setZoom(zoom - .25));
      root.querySelector('[data-zoom-in]')!.addEventListener('click', () => setZoom(zoom + .25));
      root.querySelector('[data-zoom-reset]')!.addEventListener('click', () => { setZoom(1); viewport.scrollTo(0,0); });
      let drag: {x:number;y:number;left:number;top:number} | undefined;
      viewport.addEventListener('pointerdown', event => { if (!fine.matches || event.button !== 0) return; drag = {x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(event.pointerId); });
      viewport.addEventListener('pointermove', event => { if (drag) { viewport.scrollLeft = drag.left + drag.x - event.clientX; viewport.scrollTop = drag.top + drag.y - event.clientY; } });
      viewport.addEventListener('pointerup', () => { drag = undefined; });
      viewport.addEventListener('pointercancel', () => { drag = undefined; });
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    }
    render();
  });
}
