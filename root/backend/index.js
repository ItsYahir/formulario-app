const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MySQL en Azure
const db = mysql.createPool({
    host: 'miapp-mysql-flex.mysql.database.azure.com',
    user: 'adminuser@miapp-mysql-flex',
    password: 'MySQL2024!',
    database: 'miapp', 
    port: 3306,
    ssl: {
        rejectUnauthorized: true, 
    },
});

// Rutas de API
// Obtener todas las entradas
app.get('/api/entries', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM entries');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las entradas:', error);
        res.status(500).json({ error: 'Error al obtener los datos.' });
    }
});

// Crear una nueva entrada
app.post('/api/entries', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO entries (name, email, message) VALUES (?, ?, ?)',
            [name, email, message]
        );
        res.json({ id: result.insertId, name, email, message });
    } catch (error) {
        console.error('Error al insertar una entrada:', error);
        res.status(500).json({ error: 'Error al guardar los datos.' });
    }
});

// Servir el frontend
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

// Capturar cualquier ruta que no sea API y servir `index.html`
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'), (err) => {
        if (err) {
            res.status(500).send('Error al cargar la página');
        }
    });
});

// Puerto del servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});