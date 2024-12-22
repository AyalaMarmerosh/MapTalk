// require('dotenv').config();
// // console.log('Loaded environment variables:', process.env);

// const express = require('express');
// const axios = require('axios');

// const app = express();
// const port = 3000;

// console.log('Google Maps API Key:', process.env.GOOGLE_MAPS_API_KEY);
// const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

// // Endpoint לנתיב Directions
// app.get('/directions', async (req, res) => {
//   const { origin, destination, mode, departure_time, arrival_time } = req.query;

//   if (!origin || !destination || !mode) {
//     return res
//       .status(400)
//       .send('Parameters "origin", "destination" and "mode" are required.');
//   }

//   // ודא שסוג התחבורה הוא אחד מתוך האפשרויות
//   const validModes = ['walking', 'transit', 'bicycling'];
//   if (!validModes.includes(mode)) {
//     return res.status(400).send('Invalid "mode" parameter. Use "walking", "transit", or "bicycling".');
//   }
//   let departureTimeParam = departure_time ? Math.floor(new Date(departure_time).getTime() / 1000) : 'now';

//   // אם יש זמן הגעה בעתיד, ודא שהוא תוקף (Unix timestamp)
//   let arrivalTimeParam = arrival_time ? Math.floor(new Date(arrival_time).getTime() / 1000) : null;

//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/directions/json`,
//       {
//         params: {
//           origin: origin,
//           destination: destination,
//           mode: mode, // הוספת סוג התחבורה לבקשה
//           key: googleMapsApiKey,
//           departure_time: departureTimeParam, // יציאה עכשיו או בעתיד
//           arrival_time: arrivalTimeParam, // הגעה ב... אם יש
//         },
//       }
//     );

//     if (response.data.status === 'OK') {
//       res.json(response.data.routes);
//     } else {
//       res
//         .status(500)
//         .send(
//           `Error: ${response.data.status} - ${response.data.error_message}`
//         );
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error fetching directions data from Google Maps.');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// require('dotenv').config();

// const express = require('express');
// const axios = require('axios');

// const app = express();
// const port = 3000;

// console.log('Google Maps API Key:', process.env.GOOGLE_MAPS_API_KEY);
// const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

// // Endpoint לנתיב Directions
// app.get('/directions', async (req, res) => {
//   const { origin, destination, mode, departure_time, arrival_time } = req.query;

//   if (!origin || !destination || !mode) {
//     return res
//       .status(400)
//       .send('יש לציין את הפרמטרים: "origin", "destination" ו-"mode".');
//   }

//   const validModes = ['walking', 'transit', 'bicycling', 'driving'];
//   if (!validModes.includes(mode)) {
//     return res
//       .status(400)
//       .send(
//         'סוג התחבורה לא תקין. יש להשתמש ב-"walking", "transit", "bicycling" או "driving".'
//       );
//   }

//   let departureTimeParam = departure_time
//     ? Math.floor(new Date(departure_time).getTime() / 1000)
//     : 'now';

//   let arrivalTimeParam = arrival_time
//     ? Math.floor(new Date(arrival_time).getTime() / 1000)
//     : null;

//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/directions/json`,
//       {
//         params: {
//           origin: origin,
//           destination: destination,
//           mode: mode,
//           key: googleMapsApiKey,
//           departure_time: departureTimeParam,
//           arrival_time: arrivalTimeParam,
//         },
//       }
//     );

//     if (response.data.status === 'OK') {
//       const route = response.data.routes[0]; // המסלול הראשון
//       const leg = route.legs[0]; // הרגל הראשונה במסלול

//       let instructions = `מסלול ממוצא ליעד:\n`;
//       leg.steps.forEach((step, index) => {
//         instructions += `${index + 1}. ${step.html_instructions.replace(
//           /<[^>]*>/g,
//           ''
//         )}\n`;
//         instructions += `   מרחק: ${step.distance.text}, זמן: ${step.duration.text}.\n`;
//       });

//       res.send(instructions);
//     } else {
//       res
//         .status(500)
//         .send(
//           `שגיאה: ${response.data.status} - ${response.data.error_message}`
//         );
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('שגיאה בעת הבאת נתוני כיוונים מ-Google Maps.');
//   }
// });

// app.listen(port, () => {
//   console.log(`השרת פועל בכתובת http://localhost:${port}`);
// });

// require('dotenv').config();

// const express = require('express');
// const axios = require('axios');

// const app = express();
// const port = 3000;

// console.log('Google Maps API Key:', process.env.GOOGLE_MAPS_API_KEY);
// const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

// // Endpoint לנתיב Directions
// app.get('/directions', async (req, res) => {
//   const { origin, destination, mode, departure_time, arrival_time } = req.query;

//   if (!origin || !destination || !mode) {
//     return res
//       .status(400)
//       .send('יש לציין את הפרמטרים: "origin", "destination" ו-"mode".');
//   }

//   const validModes = ['walking', 'transit', 'bicycling', 'driving'];
//   if (!validModes.includes(mode)) {
//     return res
//       .status(400)
//       .send(
//         'סוג התחבורה לא תקין. יש להשתמש ב-"walking", "transit", "bicycling" או "driving".'
//       );
//   }

//   let departureTimeParam = departure_time
//     ? Math.floor(new Date(departure_time).getTime() / 1000)
//     : 'now';

//   let arrivalTimeParam = arrival_time
//     ? Math.floor(new Date(arrival_time).getTime() / 1000)
//     : null;

//   try {
//     const response = await axios.get(
//       `https://maps.googleapis.com/maps/api/directions/json`,
//       {
//         params: {
//           origin: origin,
//           destination: destination,
//           mode: mode,
//           key: googleMapsApiKey,
//           departure_time: departureTimeParam,
//           arrival_time: arrivalTimeParam,
//         },
//       }
//     );

//     if (response.data.status === 'OK') {
//       const route = response.data.routes[0]; // המסלול הראשון
//       const leg = route.legs[0]; // הרגל הראשונה במסלול

//       let instructions = `מסלול ממוצא ליעד:\n`;
//       leg.steps.forEach((step, index) => {
//         const travelMode = step.travel_mode.toLowerCase(); // סוג התחבורה

//         // הוספת מידע על תחבורה ציבורית אם יש
//         let transitDetails = '';
//         if (travelMode === 'transit' && step.transit_details) {
//           const { line, departure_stop, arrival_stop } = step.transit_details;
//           const busNumber = line.short_name || line.name;
//           const departureStation = departure_stop.name;
//           const arrivalStation = arrival_stop.name;
//           const departureTime = step.transit_details.departure_time?.text || '';
//           transitDetails = ` קו ${busNumber} מ-${departureStation} ל-${arrivalStation}. יציאה בשעה ${departureTime}.`;
//         }

//         instructions += `${index + 1}. ${step.html_instructions.replace(
//           /<[^>]*>/g,
//           ''
//         )}${transitDetails}\n`;
//         instructions += `   מרחק: ${step.distance.text}, זמן: ${step.duration.text}.\n`;
//       });

//       res.send(instructions);
//     } else {
//       res
//         .status(500)
//         .send(
//           `שגיאה: ${response.data.status} - ${response.data.error_message}`
//         );
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('שגיאה בעת הבאת נתוני כיוונים מ-Google Maps.');
//   }
// });

// app.listen(port, () => {
//   console.log(`השרת פועל בכתובת http://localhost:${port}`);
// });

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
      console.log("routers",response.data.routes[0].legs[0].steps[0].steps);
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
            .replace(/<b>(.*?)<\/b>/g, '$1') // מסיר את ה-bold
            .replace(/<div.*?>/g, '') // מסיר div אם יש
            .replace(/<\/div>/g, ''); // מסיר div סגירה
    
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
