const express = require("express");
const app = express();

// TODO: Follow instructions in the checkpoint to implement ths API.

const pastes = require("./data/pastes-data"); //Reads, executes, and returns the exports object from the ./data/pastes-data file, assigning it to a variable

app.use("/pastes/:pasteId", (req, res, next) => { //Defines a handler for the /pastes/:pasteId path


    const { pasteId } = req.params; //Defines the pasteId variable by destructuring it from req.params
    const foundPaste = pastes.find((paste) => paste.id === Number(pasteId)); //Uses the find() array method to search for the paste by id. If no id matches, find() returns undefined.
  
    if (foundPaste) {
      res.json({ data: foundPaste }); //Sends data with the foundPaste object to the client as JSON
    } else {
      next(`Paste id not found: ${pasteId}`); //Calls next() with an error message to move the request to the error handler
    }
  });

app.use("/pastes", (req, res) => { // Defines a handler for the /pastes path
  res.json({ data: pastes }); //The json() method of the response object, which tells Express to respond to the client with data in JSON format
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