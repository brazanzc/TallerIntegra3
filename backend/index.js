const express = require('express');
const bodyParser = require('body-parser');
const { router: authRoutes, ensureAuthenticated } = require('./auth'); // Importa las rutas de autenticación
const calendarRoutes = require('./calendar'); // Importa las rutas de Google Calendar

const app = express();
const port = process.env.PORT || 3000;

// Middleware para procesar solicitudes JSON
app.use(bodyParser.json());

// Rutas de autenticación (Google OAuth)
app.use('/auth', authRoutes);

// Rutas protegidas para el calendario, que incluyen /create-event
app.use('/api', ensureAuthenticated, calendarRoutes);

// Ruta base para verificar que el servidor está corriendo
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
