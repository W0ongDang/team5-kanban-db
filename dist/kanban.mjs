const SUPABASE_URL = 'https://tsqwuegawyhkectabiyf.supabase.co';
// This is the browser-safe Supabase anon key. Never put a service_role key here.
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzcXd1ZWdhd3loa2VjdGFiaXlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMTYxNzIsImV4cCI6MjEwNTU5MjE3Mn0.HaaOmK_upUyASX8qvk-fkaGgmn92WUTcR1w7HHwCsRk';
const BOARD_SOURCE_URL = 'https://github.com/users/beyejin/projects/1';

const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
};

async function fetchRows(path) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers });
  if (!response.ok) throw new Error(`Supabase request failed (${response.status})`);
  return response.json();
}

function createCard(card) {
  const element = document.createElement('article');
  element.className = 'kanban-card';
  const issue = card.github_issue_number ? `ISSUE ${String(card.github_issue_number).padStart(2, '0')}` : 'TASK';
  element.innerHTML = `<span class="kanban-meta">${issue}</span><strong></strong><p></p>`;
  element.querySelector('strong').textContent = card.title;
  element.querySelector('p').textContent = card.description || '설명 없음';
  return element;
}

export async function loadKanbanBoard() {
  const container = document.querySelector('#kanban-board');
  const fallback = document.querySelector('#kanban-fallback');
  if (!container) return;

  try {
    const boards = await fetchRows(`kanban_boards?select=id,name&source_url=eq.${encodeURIComponent(BOARD_SOURCE_URL)}&limit=1`);
    const board = boards[0];
    if (!board) throw new Error('Board not found');
    const [columns, cards] = await Promise.all([
      fetchRows(`kanban_columns?select=id,name,position,color&board_id=eq.${board.id}&order=position.asc`),
      fetchRows(`kanban_cards?select=column_id,title,description,github_issue_number,position&board_id=eq.${board.id}&order=position.asc`),
    ]);
    container.replaceChildren();
    columns.forEach((column) => {
      const section = document.createElement('section');
      section.className = 'kanban-column';
      section.style.setProperty('--column-color', column.color);
      const items = cards.filter((card) => card.column_id === column.id);
      const heading = document.createElement('h3');
      heading.textContent = column.name;
      const count = document.createElement('span');
      count.textContent = String(items.length).padStart(2, '0');
      heading.append(count);
      section.append(heading, ...items.map(createCard));
      container.append(section);
    });
    container.setAttribute('aria-busy', 'false');
    fallback?.classList.add('kanban-fallback-hidden');
  } catch {
    container.classList.add('is-error');
    container.setAttribute('aria-busy', 'false');
    container.textContent = 'DB 보드를 불러오지 못해 GitHub 보드 스냅샷을 표시합니다.';
  }
}
