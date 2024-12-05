const express = require('express');
const mysql = require('mysql2'); // Cambiado a mysql2 para mejor compatibilidad
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost', // Cambiar si estás usando un host remoto
    user: 'app_user', // Cambia a 'root' si estás usando el usuario root
    password: 'AppUserSecure#2024', // Cambia a la contraseña que configuraste
    database: 'form_db' // Cambia al nombre de tu base de datos
});

// Conexión a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectándose a la base de datos:', err.message);
        db.connected = false; // Bandera para indicar que la conexión falló
    } else {
        console.log('Conectado a la base de datos');
        db.connected = true; // Bandera para indicar que la conexión fue exitosa
    }
});

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

// Endpoint básico para verificar el estado del servidor
app.get('/', (req, res) => {
    res.send('Servidor y backend funcionando correctamente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001; // Usa el puerto de entorno o el 3001 por defecto
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});