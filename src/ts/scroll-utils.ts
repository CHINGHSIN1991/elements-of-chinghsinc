export function setupScrollToTop(id: string = 'backToTop'): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

export function setupScrollToBottom(id: string = 'scrollToBottom'): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  });
}

export function setupExpandAll(
  id: string = 'expandAll',
  expandText: string = 'Expand All',
  collapseText: string = 'Collapse All',
  onToggle?: (expanded: boolean) => void
): void {
  const button = document.getElementById(id);
  if (!button) return;

  let isExpanded = true;

  const updateState = () => {
    button.textContent = isExpanded ? collapseText : expandText;
    button.setAttribute('aria-expanded', String(isExpanded));
    button.dataset.expanded = String(isExpanded);
    button.setAttribute(
      'aria-label',
      isExpanded ? 'Collapse all sections' : 'Expand all sections'
    );
  };

  const syncDetails = () => {
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
      (detail as HTMLDetailsElement).open = isExpanded;
    });
  };

  updateState();
  onToggle?.(isExpanded);

  button.addEventListener('click', () => {
    isExpanded = !isExpanded;
    updateState();
    syncDetails();
    onToggle?.(isExpanded);
  });
}

