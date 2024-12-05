const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_user',
    password: 'AppUserSecure#2024',
    database: 'form_db',
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectándose a la base de datos:', err.message);
        db.connected = false;
    } else {
        console.log('Conectado a la base de datos');
        db.connected = true;
    }
});

// Servir el frontend desde la carpeta build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Endpoint para obtener datos
app.get('/api/entries', (req, res) => {
    if (!db.connected) {
        return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    db.query('SELECT * FROM form_entries', (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err.message);
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Endpoint para agregar datos
app.post('/api/entries', (req, res) => {
    if (!db.connected) {
        return res.status(500).json({ error: 'Base de datos no disponible' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    db.query(
        'INSERT INTO form_entries (name, email, message) VALUES (?, ?, ?)',
        [name, email, message],
        (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err.message);
                return res.status(500).send(err);
            }
            res.json({ id: result.insertId, name, email, message });
        }
    );
});

// Servir index.html para cualquier ruta no manejada
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});