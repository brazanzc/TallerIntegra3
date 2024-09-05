const fs = require('fs');
const { google } = require('googleapis');
const express = require('express');
const router = express.Router();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

// Cargar las credenciales desde el archivo credentials.json
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync('credentials.json'));
} catch (error) {
  console.error('Error al leer el archivo credentials.json:', error);
  process.exit(1); // Detiene el servidor si no se puede cargar el archivo
}

const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Ruta para redirigir al usuario a la página de autenticación de Google
router.get('/google', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // Permite usar tokens de actualización
    scope: SCOPES,
  });
  console.log('Redirigiendo a URL de autenticación:', authUrl);
  res.redirect(authUrl);
});

// Ruta para manejar el callback de Google OAuth y obtener el token de acceso
router.get('/google/callback', (req, res) => {
  const code = req.query.code;
  
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return res.status(400).send('Error al obtener el token de acceso: ' + err);
    
    // Guardar el token en token.json
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    oAuth2Client.setCredentials(token);
    
    res.send('Autenticación completada. Token guardado.');
  });
});

// Middleware para asegurarse de que el usuario esté autenticado
function ensureAuthenticated(req, res, next) {
  if (!fs.existsSync(TOKEN_PATH)) {
    return res.status(403).send('Usuario no autenticado.');
  }
  
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oAuth2Client.setCredentials(token);
  next(); // Continuar con la siguiente acción
}

module.exports = { router, oAuth2Client, ensureAuthenticated };
