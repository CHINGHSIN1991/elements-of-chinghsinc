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
  collapseText: string = 'Collapse All'
): void {
  const button = document.getElementById(id);
  if (!button) return;
  let isExpanded = false;
  button.addEventListener('click', () => {
    isExpanded = !isExpanded;
    button.textContent = isExpanded ? collapseText : expandText;
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
      (detail as HTMLDetailsElement).open = isExpanded;
    });
  });
}

