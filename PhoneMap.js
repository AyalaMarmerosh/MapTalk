require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

app.get('/directions', async (req, res) => {
  const { origin, destination, mode, departure_time, arrival_time } = req.query;

  if (!origin || !destination || !mode) {
    return res
      .status(400)
      .send('Parameters "origin", "destination", and "mode" are required.');
  }

  const validModes = ['walking', 'transit', 'bicycling', 'driving'];
  if (!validModes.includes(mode)) {
    return res
      .status(400)
      .send(
        'Invalid "mode" parameter. Use "walking", "transit", "bicycling", or "driving".'
      );
  }

  let departureTimeParam = departure_time
    ? Math.floor(new Date(departure_time).getTime() / 1000)
    : 'now';
  let arrivalTimeParam = arrival_time
    ? Math.floor(new Date(arrival_time).getTime() / 1000)
    : null;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: origin,
          destination: destination,
          mode: mode,
          key: googleMapsApiKey,
          departure_time: departureTimeParam,
          arrival_time: arrivalTimeParam,
          language: 'he', // עברית
          region: 'il', // אזור ישראל
        },
      }
    );

    if (response.data.status === 'OK') {
      console.log('routers', response.data.routes[0].legs[0].steps[0].steps);
      const route = response.data.routes[0].legs[0];
      const startAddress = route.start_address;
      const endAddress = route.end_address;
      const distance = route.distance.text;
      const duration = route.duration.text;

      function getDetailedSteps(steps) {
        let allSteps = [];
        steps.forEach((step) => {
          // ניקוי הטקסט של ההוראה
          let instruction = step.html_instructions
            ? step.html_instructions
                .replace(/<b>(.*?)<\/b>/g, '$1') // מסיר את ה-bold
                .replace(/<div.*?>/g, '') // מסיר div אם יש
                .replace(/<\/div>/g, '') // מסיר div סגירה
            : 'הוראה חסרה';

          // הוספת ההוראה המפורקת לרשימה
          let stepText = `${instruction} (מרחק: ${step.distance.text}, זמן: ${step.duration.text})`;

          // בדיקת תחבורה ציבורית
          if (step.travel_mode === 'TRANSIT') {
            const line = step.transit_details.line.short_name; // מספר קו
            const departureStop = step.transit_details.departure_stop.name; // תחנה לעלות
            const arrivalStop = step.transit_details.arrival_stop.name; // תחנה לרדת
            const departureTime = step.transit_details.departure_time.text; // שעת יציאה

            stepText += `\n- קו ${line}, תחנה: ${departureStop}, ירידה בתחנה: ${arrivalStop}, שעת יציאה: ${departureTime}`;
          }

          allSteps.push(stepText);
          // אם יש תת-צעדים, קוראים לפונקציה שוב
          if (step.steps && step.steps.length > 0) {
            allSteps = allSteps.concat(getDetailedSteps(step.steps));
          }
        });
        return allSteps;
      }
      const detailedSteps = getDetailedSteps(route.steps);

      // יצירת טקסט סופי
      let formattedText = `
יציאה מ${startAddress} אל ${endAddress}
אורך: ${distance}, זמן: ${duration}

${detailedSteps.join('\n')}
`;

      res.send(formattedText);
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
