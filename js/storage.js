// STORAGE API – Save and Retrieve Entries
const journalForm = document.getElementById('journalForm');
const entryText = document.getElementById('entryText');
const entryActivity = document.getElementById('entryActivity');
const formMessage = document.getElementById('formMessage');


// localStorage.clear();

function loadEntries() {
  const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  const table = document.querySelector('table tbody');
  table.innerHTML = '';

  savedEntries.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.activity}</td>
      <td>${entry.note}</td>
    `;
    table.appendChild(row);
  });
}

journalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = entryText.value.trim();

  if (text.split(' ').length < 10) {
    formMessage.textContent = 'Please write at least 10 words.';
    formMessage.style.color = 'red';
    return;
  }

  const savedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
  savedEntries.push({
    activity: entryActivity.value,
    note: text
  });

  localStorage.setItem('journalEntries', JSON.stringify(savedEntries));
  formMessage.textContent = '✅ Entry saved successfully!';
  formMessage.style.color = 'green';

  // Trigger browser notification
  showNotification('New journal entry saved!');
  
  entryText.value = '';
  entryActivity.value = '';
  loadEntries();
});

document.addEventListener('DOMContentLoaded', loadEntries);
