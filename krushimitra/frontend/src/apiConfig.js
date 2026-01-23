

// src/apiUrl.js
const mainApiUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_MAIN_API_URL // used on Render
    : "http://localhost:3002";           // used locally

export { mainApiUrl };