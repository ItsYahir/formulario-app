const form = document.getElementById('entryForm');
const tableBody = document.getElementById('entriesTable').querySelector('tbody');
const searchInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');

let entries = []; // Variable para almacenar las entradas obtenidas del servidor

// Función para obtener y mostrar las entradas
async function fetchEntries() {
    const response = await fetch('http://localhost:3001/api/entries');
    entries = await response.json();

    // Mostrar todas las entradas
    renderTable(entries);
}

// Función para renderizar la tabla
function renderTable(data) {
    // Limpiar la tabla
    tableBody.innerHTML = '';

    // Agregar las filas
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

// Evento para enviar el formulario
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Enviar los datos al backend
    await fetch('http://localhost:3001/api/entries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
    });

    // Limpiar el formulario
    form.reset();

    // Actualizar las entradas
    fetchEntries();
});

// Evento para manejar la búsqueda
searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();

    // Filtrar las entradas
    const filteredEntries = entries.filter(entry =>
        entry.name.toLowerCase().includes(query) ||
        entry.email.toLowerCase().includes(query) ||
        entry.message.toLowerCase().includes(query)
    );

    // Renderizar la tabla con los resultados filtrados
    renderTable(filteredEntries);
});

// Cargar las entradas al iniciar
fetchEntries();
