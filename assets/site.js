(() => {
  const themeButton = document.querySelector('.theme-toggle');
  function applyTheme(value) {
    document.documentElement.dataset.theme = value;
    const dark = value === 'dark';
    if (themeButton) {
      themeButton.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
      themeButton.title = dark ? '切换浅色模式' : '切换深色模式';
      themeButton.textContent = dark ? '☀' : '◐';
    }
  }
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = systemDark ? 'dark' : 'light';
  try { const saved = localStorage.getItem('ykdsir-theme'); if (saved === 'dark' || saved === 'light') theme = saved; } catch {}
  applyTheme(theme);
  themeButton?.addEventListener('click', () => {
    theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try { localStorage.setItem('ykdsir-theme', theme); } catch {}
  });

  const search = document.querySelector('#note-search');
  if (search) {
    const rows = [...document.querySelectorAll('.note-row')];
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      rows.forEach(row => { row.hidden = !row.dataset.search.toLocaleLowerCase().includes(query); if (!row.hidden) visible++; });
      document.querySelector('#search-count').textContent = `${visible} 篇笔记`;
      document.querySelector('#no-results').hidden = visible > 0;
    });
  }
  const cards = [...document.querySelectorAll('.exploration-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => {card.hidden = category !== '全部' && card.dataset.category !== category; card.classList.remove('chosen');});
    const count = cards.filter(c => !c.hidden).length;
    document.querySelector('#explore-count').textContent = `${count} 个可探索的题目`;
  }));
  document.querySelector('#random-explore')?.addEventListener('click', () => {
    const visible = cards.filter(card => !card.hidden);
    if (!visible.length) return;
    const chosen = visible[Math.floor(Math.random() * visible.length)];
    cards.forEach(card => card.classList.remove('chosen'));
    chosen.classList.add('chosen');
    chosen.querySelector('details').open = true;
    chosen.querySelector('summary').focus({preventScroll:true});
    chosen.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'center'});
    document.querySelector('#explore-count').textContent = `这次试试：${chosen.querySelector('h2').textContent}`;
  });
})();
