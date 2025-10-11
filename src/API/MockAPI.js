// MockAPI.js
export const fetchAPI = (dateString) => {
  // Get today's date and format it as 'YYYY-MM-DD'
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];

  // Get tomorrow's date and format it as 'YYYY-MM-DD'
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + 1);
  const nextDayFormatted = nextDay.toISOString().split('T')[0];

  // Compare the input dateString to the dynamically generated dates
  if (dateString === todayFormatted) {
    return ['17:30', '19:30', '21:00'];
  } else if (dateString === nextDayFormatted) {
    return ['18:00', '20:00'];
  } else {
    return ['17:00', '18:00', '19:00', '20:00', '21:00'];
  }
};

// export const fetchAPI = (dateString) => {
//   // Normalize the input date to start of the day in UTC
//   const inputDate = new Date(dateString);
//   const inputDateNormalized = new Date(
//     Date.UTC(
//       inputDate.getUTCFullYear(),
//       inputDate.getUTCMonth(),
//       inputDate.getUTCDate()
//     )
//   );

//   // Get today's date and normalize it to start of the day in UTC
//   const today = new Date();
//   const todayNormalized = new Date(
//     Date.UTC(
//       today.getUTCFullYear(),
//       today.getUTCMonth(),
//       today.getUTCDate()
//     )
//   );

//   // Get tomorrow's date and normalize it to start of the day in UTC
//   const tomorrowNormalized = new Date(todayNormalized);
//   tomorrowNormalized.setUTCDate(todayNormalized.getUTCDate() + 1);

//   const inputTime = inputDateNormalized.getTime();

//   if (inputTime === todayNormalized.getTime()) {
//     return ['17:30', '19:30', '21:00'];
//   } else if (inputTime === tomorrowNormalized.getTime()) {
//     return ['18:00', '20:00'];
//   } else {
//     return ['17:00', '18:00', '19:00', '20:00', '21:00'];
//   }
// };

