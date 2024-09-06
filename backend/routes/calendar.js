const { google } = require('googleapis');
const express = require('express');
const router = express.Router();
 // Importar el cliente de autenticación
const { oAuth2Client } = require('./auth'); // Importar el cliente de autenticación 
// Ruta para crear un evento en Google Calendar
router.post('/create-event', (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

  const event = {
    summary: req.body.summary,
    description: req.body.description,
    start: {
      dateTime: req.body.startDateTime,
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: req.body.endDateTime,
      timeZone: 'America/Los_Angeles',
    },
  };

  calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  }, (err, event) => {
    if (err) {
      console.error('Error al crear el evento:', err);
      return res.status(400).send('Error al crear el evento: ' + err);
    }
    console.log('Evento creado: %s', event.data.htmlLink);
    res.send('Evento creado: ' + event.data.htmlLink);
  });
});

module.exports = router;
