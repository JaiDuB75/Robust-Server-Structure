const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.
//Update the application to create a new paste record when the user adds the data by sending a POST request to /pastes.
//Add middleware to parse incoming requests that contain JSON payloads.
//Modify the existing handler for /pastes to handle only GET requests.
//Create a new handler for POST requests to /pastes.

const pastes = require("./data/pastes-data");

app.get("/pastes", (req, res) => {
    res.json({ data: pastes });
  });

// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const { data : { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
  const newPaste = {
    id: ++lastPasteId, // Increment last ID, then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.json({ data: newPaste });
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;