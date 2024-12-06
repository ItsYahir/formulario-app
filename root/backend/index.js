const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la base de datos
const pool = mysql.createPool({
    host: 'miapp-mysql-flex.mysql.database.azure.com', // Cambia por tu host
    user: 'adminuser', // Cambia por tu usuario
    password: 'MySQL2024!', // Cambia por tu contraseña
    database: 'miapp', // Nombre de tu base de datos
    ssl: { rejectUnauthorized: true } // Requisito de SSL para Azure
});

// Test de conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base de datos');
        connection.release();
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}

testConnection();

// Rutas de la API
app.get('/api/entries', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM entries');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener las entradas:', error);
        res.status(500).json({ error: 'Error al obtener las entradas' });
    }
});

app.post('/api/entries', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        const [result] = await pool.query('INSERT INTO entries (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
        res.json({ id: result.insertId, name, email, message });
    } catch (error) {
        console.error('Error al insertar la entrada:', error);
        res.status(500).json({ error: 'Error al insertar la entrada' });
    }
});

// Servir el frontend (opcional)
const path = require('path');
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

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