# Robust Server Structure

## Static Data

You will now build a basic text-storage API (also known as a pastebin API) that allows users to store code snippets and plain text to share with others. For example, making a request to /pastes should return something like this:

```json
[
    {
      "id": 1,
      "user_id": 1,
      "name": "Hello",
      "syntax": "None",
      "expiration": 10,
      "exposure": "private",
      "text": "Hello World!"
    },
    {
      "id": 2,
      "user_id": 1,
      "name": "Hello World in Python",
      "syntax": "Python",
      "expiration": 24,
      "exposure": "public",
      "text": "print(Hello World!)"
    },
    ...
]
```

All of the data above can be accessed via a GET request to /pastes, as follows:

```url
GET http://localhost:5000/pastes
```

If you need data for just a single paste, you can use the paste's id to get more specific details:

```url
GET http://localhost:5000/pastes/:pasteId
```

### State

State in general programming term that describes the status of somethong as big as an entire application or small as an individual object.

The **State if an application** aka: application state is all the data that the application must keep track of in order to work.

### Array as State

```js
//The code below defines an array of paste records and exports it for use in the app.js file

module.exports = [
  {
    id: 1,
    user_id: 1,
    name: "Hello",
    syntax: "None",
    expiration: 10,
    exposure: "private",
    text: "Hello World!",
  },
  {
    id: 2,
    user_id: 1,
    name: "Hello World in Python",
    syntax: "Python",
    expiration: 24,
    exposure: "public",
    text: "print(Hello World!)",
  },
  {
    id: 3,
    user_id: 2,
    name: "String Reverse in JavaScript",
    syntax: "Javascript",
    expiration: 24,
    exposure: "public",
    text: "const stringReverse = str => str.split('').reverse().join('');",
  },
  {
    id: 4,
    user_id: 3,
    name: "Print file sizes in Perl",
    syntax: "Perl",
    expiration: 24,
    exposure: "public",
    text: "ls -lAF | perl -e ’while (<>) { next if /^[dt]/; print +(split)[4], '\n' } ’",
  },
];
```

### Why use a `data` property?

You might be wondering why you returned an object with a data property from your API rather than simply returning the array itself.

This is because you are following a simplified version of the JSON:API specification, a common pattern for APIs returning JSON.

In short, the APIs that you build will always return an object with either a data property or an errors property. Any information sent to the API will also be an object with a data property

Final Example:

```js
//@users-data.js
module.exports = [
  {
    id: 1,
    first_name: "Chelsea",
    last_name: "Kellog",
    email: "ckellog0@list-manage.com",
  },
  {
    id: 2,
    first_name: "Chloette",
    last_name: "Daice",
    email: "cdaice1@nhs.uk",
  },
  {
    id: 3,
    first_name: "Concordia",
    last_name: "Frail",
    email: "cfrail2@linkedin.com",
  },
  {
    id: 4,
    first_name: "Huberto",
    last_name: "Barford",
    email: "hbarford3@people.com.cn",
  },
  {
    id: 5,
    first_name: "Tedie",
    last_name: "Nicolson",
    email: "tnicolson4@redcross.org",
  },
];
```

```js
//@states-data.js
module.exports = {
  AZ: "Arizona",
  CA: "California",
  IA: "Iowa",
  MI: "Michigan",
  MN: "Minnesota",
  MO: "Missouri",
  NC: "North Carolina",
  NY: "New York",
  OH: "Ohio",
  TX: "Texas",
  VA: "Virginia",
};
```

```js
//@app.js
const express = require("express");
const app = express();

const users = require("./data/users-data");
const states = require("./data/states-data");

// TODO: return a single user by id from /users/:userId in form of { data: Object }

app.use("/users/:userId", (req, res, next) => {
  const { userId } = req.params;
  const foundUser = users.find((user) => user.id === Number(userId));

  if (foundUser) {
    res.json({ data: foundUser });
  } else {
    next(`User ID not found: ${userId}`);
  }
});

// TODO: return an array of users from /users in form of { data: Array }
app.use("/users", (req, res) => {
  res.json({ data: users });
});

// TODO: Return a single state from /states/:stateCode in the form of { data: { stateCode: String, name: String } }

app.use("/states/:stateCode", (req, res, next) => {
  const { stateCode } = req.params;
  const foundState = states[stateCode];

  if (foundState !== undefined) {
    res.json({ data: { name: foundState, stateCode: stateCode } });
  } else {
    next(`State code not found: ${stateCode}`);
  }
});

// TODO: return all states from /states in the form of { data: Array }

app.use("/states", (req, res) => {
  res.json({ data: states });
});

// TODO: add not-found handler

app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// TODO: Add error handler

app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
```

## RESTful APIs

REST, which stands for representational state transfer, is a software architecture style. REST is a set of constraints for building web APIs. If a web API adheres to the constraints of REST, you can call the API a RESTful API.

### Representational state transfer (REST)

With REST, if you have a URL, then you have a resource. Resource refers to the data returned by a request; that data can be a text file, HTML page, image, video, JSON, or something else. Every URL provides access to a resource on your server.

A RESTful API server provides access to resources. A client, like the browser or another server, can then access and change the resources.

The JSON response is a representation of the current state of the resource, not the actual resource itself. The server could represent the resource in other ways, like XML, HTML, or any other format.

The same representation concept applies when a client sends data to the server. The client doesn't send the actual resource; it just sends a representation of the resource. The server's job is to interpret this representation and respond accordingly.

### HTTP Request Methods

A combination of an HTTP request method and URL in the request tells the server what action it should take to fulfill the request.

An HTTP request method is a method that indicates the desired action (such as deleting a resource) to be taken on a given resource.

Examples: 

- GET
- POST
- PUT
- PATCH
- DELETE

**Note:** HTTP request methods are sometimes referred to as HTTP verbs. These terms are interchangeable.

Essentially, a RESTful API asserts that URLs have names and paths that accurately reflect what they're doing with each resource.

What does this look like? The following table outlines standard RESTful naming conventions for a user profile API:

| Route Name | URL Path | HTTP Method | Description |
|------------|----------|-------------|-------------|
| Index (list) | /profiles | GET      | Return a list of Profiles | 
| Create | /profiles | POST | Create a new profile, assign an id, and return at least the id |
| Read | /profiles/:id | GET | Return the profile with the specified id, or return 404 if it doesn't exist |
| Update | /profile/:id | PUT | Update an exosting profile with the data in the request. |
| Delete | /profiles/:id | DELETE | Delete the profile with the specified id. Don't 404 if it doesn't exist. | 

### Temporary State

Any changes to the data will be lost when the application restarts. This is fine for now, and it's exactly what you should expect when storing data in memory. You will learn how to store the data in a database in a future module.

### Express and HTTP Methods

So far, every route handler that you have written has used app.use(), which matches only on the optional path parameter. But now that you know about HTTP methods, you will create API endpoints that also match on HTTP methods. An API endpoint is a location where a client can send a request to retrieve a resource that exists on the server. It includes both the URL path and the HTTP method for the given URL path.

Final Example: 

```js
//@notes-data.js
module.exports = [
  {
    id: 1,
    text: "REST stands for Representational State Transfer",
  },
  {
    id: 2,
    text: "REST maps CRUDL operations to HTTP methods",
  },
];

```

```js
//@app.js

const express = require("express");
const app = express();

const notes = require("./data/notes-data");

app.use(express.json());

app.get("/notes/:noteId", (req, res) => {
  const noteId = Number(req.params.noteId);
  const foundNote = notes.find((note) => note.id === noteId);
  if (foundNote){
  res.json({ data: foundNote });
  }else{
    res.status(400).send(`Note id not found: ${noteId}`);
  }
});

app.get("/notes", (req, res) => {
  res.json({ data: notes });
});

// TODO: Add ability to create a new note

let lastNoteId = notes.reduce((maxId, note) => Math.max(maxId, note.id), 0);

app.post("/notes", (req, res, next) => {
  const result = req.body.data;
  if(!result){
    res.sendStatus(400);
  }
  if(!result.text){
    return res.sendStatus(400);
  } else {
    const newNote = {
      id : ++lastNoteId,
      text : result.text,
    };
    notes.push(newNote);
    res.status(201).json({data:newNote});
  }
});

// TODO: Add not-found handler

app.use((request, response, next) => {
  response.status(400).send(`Not found: ${request.path}`);
});

// TODO: Add error handler

app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;

```

## API Testing with SuperTest

APIs are a vital part of many applications, and it's important to ensure that future updates to an API don't accidentally change the behavior of the API. But how do you ensure that your API continues to work as expected as the codebase grows? To do so, you can write automated tests for your Express API.

### Jest and SuperTest

Jest is a JavaScript testing framework that includes both an assertion library and a test runner. SuperTest allows you to programmatically make HTTP requests (such as GET, PUT, POST, and DELETE) to your Express API.

#### Install Jest and SuoerTest

```powershell
npm install --save-dev jest supertest
```

### Creating a test file

Test files should have the suffix .test.js. By default, Jest will be checking filenames for that suffix when looking for test files to execute.

```js 
//@ app.test.js

/*
The first three lines load the SuperTest library, pastes data, and the Express server, respectively, into the file. 
The describe() block groups together all the tests related to the /pastes path
*/

const request = require("supertest");
const pastes = require("../src/data/pastes-data");
const app = require("../src/app");

describe("path /pastes", () => {
  // Add tests here
});
```

#### Update package.json

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Jest Refresher

- `describe()`, which groups together a set of related tests
- `test()` or `it()`, describes an individual test case and is typically nested inside of the `describe()` function
- `expect` object, provides access to matchers (like toBe() and toEqual()) that allow you to check whether some part of your code has produced an expected outcome

### Setup and Teardown

Often tests involve some setup and teardown work that needs to be performed before and after tests run, respectively. For example, setup might involve initializing variables and opening file or database connections. Teardown might involve resetting variables, closing file or database connections, or even resetting the test database.

Suppose you have several tests. A method `initializeStudentsDatabase()` that must be called **before each of these tests**, and a method `clearStudentsDatabase()` that must be called **after each of these tests**. You can do this with the `beforeEach()` and `afterEach()` helper methods.

```js
beforeEach(() => {
  initializeStudentsDatabase();
});

afterEach(() => {
  clearStudentsDatabase();
});

it("students database has John", () => {
  expect(isStudent("John")).toBeTruthy();
});

it("students database has Jane", () => {
  expect(isStudent("Jane")).toBeTruthy();
});
```

Testing for `GET /pastes`:

```js
describe("path /pastes", () => {
  beforeEach(() => {
    pastes.splice(0, pastes.length);
  });

  describe("GET method", () => {
    it("returns an array of pastes", async () => {
      const expected = [
        {
          id: 1,
          user_id: 1,
          name: "Hello",
          syntax: "None",
          expiration: 10,
          exposure: "private",
          text: "Hello World!"
        },
        {
          id: 2,
          user_id: 1,
          name: "Hello World in Python",
          syntax: "Python",
          expiration: 24,
          exposure: "public",
          text: "print(Hello World!)"
        },
        {
          id: 3,
          user_id: 2,
          name: "String Reverse in JavaScript",
          syntax: "Javascript",
          expiration: 24,
          exposure: "public",
          text: "const stringReverse = str => str.split('').reverse().join('');"
        }
      ];

      pastes.push(...expected);

      const response = await request(app).get("/pastes");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(expected);
    });
  });
});
```

#### Run Test in Watch Mode: 

Add to package.json: 

```json
"scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
```

Run: 

```powershell
npm run test:watch
```

#### Testing `POST /pastes`

```js
//@app.js
app.post("/pastes", (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text } = {} } = req.body;
  if (text) {
    const newPaste = {
      id: ++lastPasteId, // Increment last ID, then assign as the current ID
      name,
      syntax,
      exposure,
      expiration,
      text,
    };
    pastes.push(newPaste);
    res.status(201).json({ data: newPaste });
  } else {
    res.sendStatus(400);
  }
});
```

#### Test for `POST /pastes`

```js
describe("POST method", () => {
  it("creates a new paste and assigns id", async () => {
    const newPaste = {
      name: "String Reverse in JavaScript",
      syntax: "Javascript",
      expiration: 24,
      exposure: "public",
      text: "const stringReverse = str => str.split('').reverse().join('');"
    };
    const response = await request(app)
      .post("/pastes")
      .set("Accept", "application/json")
      .send({ data: newPaste });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({
      id: 5,
      ...newPaste,
    });
  });

  it("returns 400 if result is missing", async () => {
    const response = await request(app)
      .post("/pastes")
      .set("Accept", "application/json")
      .send({ data: { message: "returns 400 if result is missing" } });

    expect(response.status).toBe(400);
  });

  it("returns 400 if result is empty", async () => {
    const response = await request(app)
      .post("/pastes")
      .set("Accept", "application/json")
      .send({ data: { result: "" } });

    expect(response.status).toBe(400);
  });
});
```

## Major Error Types and Handling


You'll learn how to implement a centralized error-handling approach; this is especially important when you begin to build bigger and more complex APIs.

### Validation

Update the POST handler for /pastes to move the validation code into a middleware function that returns information about the validation failures, as follows:

```js
// New middleware function to validate the request body
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next(); // Call `next()` without an error message if the result exists
  }
    next({
    status: 400,
    message: "A 'text' property is required.",
  });
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
```