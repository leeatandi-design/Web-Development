const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

function updateCounts() {
  const text = noteText.value;
  const chars = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${chars} / 200 characters`;
  wordCount.textContent = `${words} words`;

  charCount.classList.remove('warning', 'over');
  if (chars > 200) {
    charCount.classList.add('over');
  } else if (chars > 180) {
    charCount.classList.add('warning');
  }
}

function clearAll() {
  noteText.value = '';
  localStorage.removeItem('draft');
  updateCounts();
}

// input event -> update + save draft
noteText.addEventListener('input', () => {
  updateCounts();
  localStorage.setItem('draft', noteText.value);
});

// restore on load
window.addEventListener('DOMContentLoaded', () => {
  const draft = localStorage.getItem('draft');
  if (draft) noteText.value = draft;

  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = 'Light mode';
  }
  updateCounts();
});

// clear button + Escape key
clearBtn.addEventListener('click', clearAll);
noteText.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') clearAll();
});

// theme toggle
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  if (isDark) {
    themeToggle.textContent = 'Light mode';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = 'Dark mode';
    localStorage.setItem('theme', 'light');
  }
});