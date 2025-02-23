require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

app.get('/directions', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Accept-Charset', 'utf-8');

  // console.log('Received request with query:', req.query);
  const { origin, destination, mode, departure_time, arrival_time } = req.query;

  if (!origin || !destination || !mode) {
    return res
      .status(400)
      .send('Parameters "origin", "destination", and "mode" are required.');
  }
  const modeMap = {
    1: 'walking',
    2: 'transit',
    3: 'driving',
    4: 'bicycling',
  };
  const modeName = modeMap[mode];
  if (!modeName) {
    return res
      .status(400)
      .send(
        'Invalid "mode" parameter. Use 1 (walking), 2 (transit), 3 (driving), or 4 (bicycling).'
      );
  }

  let departureTimeParam = departure_time
    ? Math.floor(new Date(departure_time).getTime() / 1000)
    : 'now';
  let arrivalTimeParam = arrival_time
    ? Math.floor(new Date(arrival_time).getTime() / 1000)
    : null;

  try {
    // console.log('Request to Google Maps API:', {
    //   origin: origin,
    //   destination: destination,
    //   mode: modeName,
    //   departure_time: departureTimeParam,
    //   arrival_time: arrivalTimeParam,
    // });
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin: origin,
          destination: destination,
          mode: modeName,
          key: googleMapsApiKey,
          departure_time: departureTimeParam,
          arrival_time: arrivalTimeParam,
          language: 'he', // עברית
          region: 'il', // אזור ישראל
        },
      }
    );

    // console.log('Google Maps response:', response.data);

    if (response.data.status !== 'OK') {
      console.log('Error from Google Maps API:', response.data.error_message);
    }

    // console.log('Routes:', response.data.routes);

    if (response.data.status === 'OK') {
      // console.log('routers', response.data.routes[0].legs[0].steps[0].steps);
      const route = response.data.routes[0].legs[0];
      const startAddress = route.start_address;
      const endAddress = route.end_address;
      const distance = route.distance.text;
      const duration = route.duration.text;

      function getDetailedSteps(steps) {
        let allSteps = [];
        steps.forEach((step) => {
          let instruction = step.html_instructions
            ? step.html_instructions
                .replace(/<b>(.*?)<\/b>/g, '$1')                 
                .replace(/<div.*?>/g, '')                 
                .replace(/<\/div>/g, '')                 
                .replace(/<[^>]+>/g, '') 
                .replace(/[.()"]/g, '')
                .replace(/\u200F/g, '')              
                .replace(/'/g, '') 
                .replace(/''/g, '')
                .replace(/-/g, '')
                .replace(/[/,]/g, ' ')
                // .replace(/“|”/g, '') 
                .replace(/,,/g, '') 
            : // .replace(/,/g, '')
              '';

          instruction = instruction.trim();

          // let stepText = `${instruction} זמן: ${step.duration.text}`;
          let stepText = instruction;
          // let stepText = `${instruction} (מרחק: ${step.distance.text}, זמן: ${step.duration.text})`;

          // בדיקת תחבורה ציבורית
          if (step.travel_mode === 'TRANSIT') {
            const line = step.transit_details.line.short_name; // מספר קו
            const departureStop = step.transit_details.departure_stop.name; // תחנה לעלות
            const arrivalStop = step.transit_details.arrival_stop.name; // תחנה לרדת
            const departureTime = step.transit_details.departure_time.text; // שעת יציאה

            stepText += `\n- קו ${line} תחנה ${departureStop} ירידה בתחנה ${arrivalStop}`;
            // stepText += `\n- קו ${line}, תחנה ${departureStop}, ירידה בתחנה ${arrivalStop}, שעת יציאה ${departureTime}`;

            stepText = stepText
              .replace(/'/g, '')
              .replace(/[/,]/g, ' ')
              .replace(/-/g, '')
              .replace(/,,/g, '');
          }
          console.log("צעדים:", stepText);
          allSteps.push(stepText);
          // אם יש תת-צעדים, קוראים לפונקציה שוב
          if (step.steps && step.steps.length > 0) {
            allSteps = allSteps.concat(getDetailedSteps(step.steps));
          }
        });
        return allSteps;
      }
      const detailedSteps = getDetailedSteps(route.steps);

      const test = "מה נשמע אילה";
      const filteredSteps = detailedSteps.filter(step => step.trim() !== '').join(' ');

      // יצירת טקסט סופי
      let id_list_message = `id_list_message=f-from.t-${startAddress}.f-to.t-${endAddress}.f-time.t-${duration}.f-steps.t-${test}`;

      res.send(id_list_message);
    } else {
      res.status(500).send('id_list_message=f-not_found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('d_list_message=t-לא נמצא שרת');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
