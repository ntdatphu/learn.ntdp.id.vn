/** Native jump links work first; scrolling never writes URL/history. */
export function initializeChapterOutline() {
  document.querySelectorAll<HTMLElement>('[data-chapter-id]').forEach(chapter => {
    if (chapter.dataset.outlineInitialized) return;
    chapter.dataset.outlineInitialized = 'true';
    const links = [...chapter.querySelectorAll<HTMLAnchorElement>('[data-outline-link]')];
    const headings = [...new Set(links.map(link => link.dataset.outlineLink!))]
      .map(id => document.getElementById(id)).filter((heading): heading is HTMLElement => !!heading);
    if (!headings.length) return;
    let pending = false;
    let current = '';
    const update = () => {
      pending = false;
      let active = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= 130) active = heading;
        else break;
      }
      // At the document end, the final short review need not reach the top edge.
      if (scrollY > 0 && innerHeight + scrollY >= document.documentElement.scrollHeight - 2) active = headings.at(-1)!;
      if (active.id === current) return;
      current = active.id;
      links.forEach(link => {
        if (link.dataset.outlineLink === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    };
    const schedule = () => {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    // Native disclosures and injected assessment results can change heading positions.
    new ResizeObserver(schedule).observe(chapter);
    schedule();
  });
}
