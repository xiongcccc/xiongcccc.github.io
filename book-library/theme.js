(() => {
  const apply = (value) => {
    document.documentElement.dataset.theme = value === 'dark' ? 'dark' : 'light';
  };
  try { apply(localStorage.getItem('color-theme')); } catch { apply('light'); }
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('theme');
    if (!select) return;
    select.value = document.documentElement.dataset.theme;
    select.addEventListener('change', () => {
      apply(select.value);
      try { localStorage.setItem('color-theme', select.value); } catch {}
    });
  });
  window.addEventListener('pageshow', () => {
    try { apply(localStorage.getItem('color-theme')); } catch {}
    const select = document.getElementById('theme');
    if (select) select.value = document.documentElement.dataset.theme;
  });
})();

