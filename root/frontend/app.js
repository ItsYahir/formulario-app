const form = document.getElementById('entryForm');
const tableBody = document.getElementById('entriesTable').querySelector('tbody');
const searchInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');

let entries = [];

// Obtener y mostrar entradas
async function fetchEntries() {
    const response = await fetch('/api/entries'); // URL relativa
    entries = await response.json();
    renderTable(entries);
}

// Renderizar tabla
function renderTable(data) {
    tableBody.innerHTML = '';
    data.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.id}</td>
            <td>${entry.name}</td>
            <td>${entry.email}</td>
            <td>${entry.message}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Enviar formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
    });

    form.reset();
    fetchEntries();
});

// Buscar entradas
searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const filteredEntries = entries.filter(entry =>
        entry.name.toLowerCase().includes(query) ||
        entry.email.toLowerCase().includes(query) ||
        entry.message.toLowerCase().includes(query)
    );
    renderTable(filteredEntries);
});

fetchEntries();