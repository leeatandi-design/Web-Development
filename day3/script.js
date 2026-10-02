let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 2. searchNotes using filter, toLowerCase and includes
function searchNotes(word) {
  const lowerWord = word.toLowerCase();
  return notes.filter(note => note.text.toLowerCase().includes(lowerWord));
}

// 3. longestNote - handle empty first, then compare lengths
function longestNote() {
  if (notes.length === 0) return null;
  let longest = notes[0];
  for (let note of notes) {
    if (note.text.length > longest.text.length) {
      longest = note;
    }
  }
  return longest;
}

// 4. countByCategory by looping
function countByCategory() {
  const counts = {};
  for (let note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

// 5. getSummary using countByCategory and template literal
function getSummary() {
  const total = notes.length;
  const counts = countByCategory();
  const label = total === 1? "note" : "notes";
  // Build like "2 personal, 1 work, 2 study"
  const parts = [];
  for (let cat in counts) {
    parts.push(`${counts[cat]} ${cat}`);
  }
  const breakdown = parts.join(", ");
  return `${total} ${label}: ${breakdown}.`;
}

// helper to normalize text for duplicate check
function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

// 6. isDuplicate using some, comparing trimmed lower-case text
function isDuplicate(text) {
  const norm = normalize(text);
  return notes.some(note => normalize(note.text) === norm);
}

// 7. addNote, calling isDuplicate and checking length and category before adding
function addNote(text, category) {
  const trimmed = text.trim();
  const validCategories = ["personal", "work", "study"];

  if (trimmed.length < 1 || trimmed.length > 200) {
    console.log(`Not added: text must be 1-200 characters (got ${trimmed.length}).`);
    return false;
  }
  if (!validCategories.includes(category)) {
    console.log(`Not added: category must be one of personal, work or study (got ${category}).`);
    return false;
  }
  if (isDuplicate(text)) {
    console.log(`Not added: duplicate note "${trimmed}".`);
    return false;
  }

  const newId = notes.length > 0? Math.max(...notes.map(n => n.id)) + 1 : 1;
  notes.push({ id: newId, text: trimmed, category });
  console.log(`Added: "${trimmed}" as ${category}.`);
  return true;
}

// 8. Test every function with at least two console.log calls
console.log(searchNotes("project")); // Expected: [{ id:3, text: "Email the project report to Grace", category: "work" }]
console.log(searchNotes("xyz")); // Expected: [] (no results - edge case)
console.log(searchNotes("REVISE")); // Expected: [{ id:4, text: "Revise JavaScript arrays", category: "study" }] (case-insensitive)

console.log(longestNote()); // Expected: { id:3, text: "Email the project report to Grace",... } (longest text)
console.log((() => { const backup = notes; notes = []; const r = longestNote(); notes = backup; return r; })()); // Expected: null (empty array edge case)

console.log(countByCategory()); // Expected: { personal: 2, work: 1, study: 2 }
console.log(countByCategory().personal); // Expected: 2

console.log(getSummary()); // Expected: "5 notes: 2 personal, 2 study, 1 work." (order may vary)
console.log(addNote("Test note", "personal"), getSummary()); // Expected after adding: "6 notes:..."

console.log(isDuplicate("buy MILK and bread")); // Expected: true (ignores case)
console.log(isDuplicate(" Buy milk and bread ")); // Expected: true (ignores extra spaces)
console.log(isDuplicate("New unique text")); // Expected: false

console.log(addNote(" Buy milk and bread ", "personal")); // Expected: false (duplicate) with log reason
console.log(addNote("", "work")); // Expected: false (too short) with log reason
console.log(addNote("A valid new work note", "work")); // Expected: true
console.log(addNote("Invalid category test", "holiday")); // Expected: false (invalid category)