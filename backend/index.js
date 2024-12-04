const express = require('express');
const mysql = require('mysql2'); // Cambiado a mysql2
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'app_user', // Cambia a 'root' si usas el usuario root
    password: 'AppUserSecure#2024', // La contraseña que configuraste
    database: 'form_db'
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectándose a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Endpoint para obtener datos
app.get('/api/entries', (req, res) => {
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
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});