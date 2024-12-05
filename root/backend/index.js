const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simulación de datos
let mockEntries = [
    { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Hello World' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Test message' },
];

// Rutas de API
app.get('/api/entries', (req, res) => {
    res.json(mockEntries);
});

app.post('/api/entries', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const newEntry = {
        id: mockEntries.length + 1,
        name,
        email,
        message,
    };

    mockEntries.push(newEntry);
    res.json(newEntry);
});

// Servir el frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Puerto del servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});