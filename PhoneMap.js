require('dotenv').config();
// console.log('Loaded environment variables:', process.env);

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

console.log('Google Maps API Key:', process.env.GOOGLE_MAPS_API_KEY);
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

// Endpoint לנתיב Directions
app.get('/directions', async (req, res) => {
  const { origin, destination, mode, departure_time, arrival_time } = req.query;

  if (!origin || !destination || !mode) {
    return res
      .status(400)
      .send('Parameters "origin", "destination" and "mode" are required.');
  }

  // ודא שסוג התחבורה הוא אחד מתוך האפשרויות
  const validModes = ['walking', 'transit', 'bicycling'];
  if (!validModes.includes(mode)) {
    return res.status(400).send('Invalid "mode" parameter. Use "walking", "transit", or "bicycling".');
  }
  let departureTimeParam = departure_time ? Math.floor(new Date(departure_time).getTime() / 1000) : 'now';

  // אם יש זמן הגעה בעתיד, ודא שהוא תוקף (Unix timestamp)
  let arrivalTimeParam = arrival_time ? Math.floor(new Date(arrival_time).getTime() / 1000) : null;


  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: origin,
          destination: destination,
          mode: mode, // הוספת סוג התחבורה לבקשה
          key: googleMapsApiKey,
          departure_time: departureTimeParam, // יציאה עכשיו או בעתיד
          arrival_time: arrivalTimeParam, // הגעה ב... אם יש
        },
      }
    );

    if (response.data.status === 'OK') {
      res.json(response.data.routes);
    } else {
      res
        .status(500)
        .send(
          `Error: ${response.data.status} - ${response.data.error_message}`
        );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching directions data from Google Maps.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
