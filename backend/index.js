const express = require('express');
const path = require('path'); // Importar path para servir archivos estáticos

const app = express();

// Middleware para servir frontend como contenido estático
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint básico para verificar el estado del servidor
app.get('/status', (req, res) => {
    res.json({ status: 'Servidor funcionando correctamente' });
});

// Redirigir todas las rutas al frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});