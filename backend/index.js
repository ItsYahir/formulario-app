const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'app_user',
    password: process.env.DB_PASSWORD || 'AppUserSecure#2024',
    database: process.env.DB_NAME || 'form_db',
    port: process.env.DB_PORT || 3306
});

let dbConnected = false;

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectándose a la base de datos:', err.message);
        dbConnected = false;
    } else {
        console.log('Conectado a la base de datos');
        dbConnected = true;
    }
});

// Simulación de datos en caso de que la base de datos no esté disponible
const mockEntries = [
    { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Hello World' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Test message' }
];

// Endpoint para obtener datos
app.get('/api/entries', (req, res) => {
    if (!dbConnected) {
        console.log('Usando datos simulados');
        return res.json(mockEntries);
    }

    db.query('SELECT * FROM form_entries', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Endpoint para agregar datos
app.post('/api/entries', (req, res) => {
    const { name, email, message } = req.body;

    if (!dbConnected) {
        console.log('Usando datos simulados');
        const newEntry = {
            id: mockEntries.length + 1,
            name,
            email,
            message
        };
        mockEntries.push(newEntry);
        return res.json(newEntry);
    }

    db.query(
        'INSERT INTO form_entries (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.json({ id: result.insertId, name, email, message });
        }
    );
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});