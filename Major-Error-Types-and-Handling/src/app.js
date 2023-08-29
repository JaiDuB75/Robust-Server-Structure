const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");

// TODO: Follow instructions in the checkpoint to implement ths API.

// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
    const { data: { text } = {} } = req.body;
    if (text) {
      return next(); // Call `next()` without an error message if the result exists
    }
    next("A 'text' property is required.");
  }
  
  let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);
  
  app.post(
    "/pastes",
    bodyHasTextProperty, // Add validation middleware function
    (req, res) => {
      // Route handler no longer has validation code.
      const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
      const newPaste = {
        id: ++lastPasteId, // Increment last id then assign as the current ID
        name,
        syntax,
        exposure,
        expiration,
        text,
        user_id,
      };
      pastes.push(newPaste);
      res.status(201).json({ data: newPaste });
    }
  );

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