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

| Route Name   | URL Path      | HTTP Method | Description                                                                 |
| ------------ | ------------- | ----------- | --------------------------------------------------------------------------- |
| Index (list) | /profiles     | GET         | Return a list of Profiles                                                   |
| Create       | /profiles     | POST        | Create a new profile, assign an id, and return at least the id              |
| Read         | /profiles/:id | GET         | Return the profile with the specified id, or return 404 if it doesn't exist |
| Update       | /profile/:id  | PUT         | Update an exosting profile with the data in the request.                    |
| Delete       | /profiles/:id | DELETE      | Delete the profile with the specified id. Don't 404 if it doesn't exist.    |

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
  if (foundNote) {
    res.json({ data: foundNote });
  } else {
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
  if (!result) {
    res.sendStatus(400);
  }
  if (!result.text) {
    return res.sendStatus(400);
  } else {
    const newNote = {
      id: ++lastNoteId,
      text: result.text,
    };
    notes.push(newNote);
    res.status(201).json({ data: newNote });
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
      text: "const stringReverse = str => str.split('').reverse().join('');",
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
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
      req.body;
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

## Major Error Types and Handling

Another key feature of a robust API is its error-handling approach. When building RESTful APIs using Express, or any other framework or library, validation checks are always necessary as a best practice. And it's always important to return an error response to the client, so that the client can stay informed on why their request isn't working.

### Validation

To ensure that each route handler has a single responsibility, you can move all validation code into middleware functions. By doing all of the validation in the middleware layer, the route handler will never have to directly make any check related to the request. All these checks will be done in the middleware.

```js
app.use((error, req, res, next) => {
  console.error(error);
  res.send(error);
});
```

This error handler will catch every error, but it doesn't respond with JSON data like the route handlers. That makes error handling more difficult for developers using the API.

#### Return Validation Error

```js
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
    const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
      req.body;
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

Now, if validation fails within the validation middleware (bodyHasTextProperty()), then next() is called with an error message. This will cause the error handler to be called. The value passed into next() will be passed to the error handler as the first argument. Here, you are only doing validation for the text property. In the next lesson, you will complete validation for all the properties.

Here, because the request is malformed, it is appropriate to return a 400 status code.

```js
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}
```

## Organizing Express Code

### What's the Problem

Defining all of the route handers as anonymous functions inside of app.js will get overwhelming, even for small applications. For example, your app.js file likely has more than 70 lines of code.

### Group by Resource

Group by Resource means that any code that handles requests to a resource (such as /pastes) is stored in a folder with the same name as the resource, regardless of the URL to that resource.

Grouping by resource allows you to clarify your architecture; any file in the folder can import functions from any other file in the same folder, but may not import functions from files in other folders. There are, of course, exceptions for folders that are understood to only contain shared code (such as a utilities folder).

### Controller

A controller file defines and exports the route-handler functions. This file's single responsibility in an API is to manage the state of a single resource

So far, your route-handler functions have been written as anonymous functions defined inline with calls to app.use(), app.get(), or app.post(). Now you will move these functions to named functions exported from the controller file.

You will reorganize your code by making many small changes and making sure the code still works after each change, rather than making all of the changes at once and then checking to make sure that your API still works. 

### Create a controller for the /pastes resource

```js
//@ src/pastes/pastes.controller.js

const pastes = require("../data/pastes-data");

function list(req, res) {
  res.json({ data: pastes });
}

module.exports = {
  list,
};
```

Now that you have the list route handler defined in the controller, you can create a router to connect the GET /pastes endpoint to the router-handler function (which is list()).

### Router

The Express router is a modular middleware and routing system that can be attached to an Express app.

You only need to specify the starting path, and the router will handle the rest for you.

The router file defines and exports an instance of Express router. The router file is only responsible for connecting a path (/) with the route handler for that path (pastesController.list()).

The modularity of the router means that it can be "attached" to the Express app using any starting point. As a result, the paths in the router are always defined independently of the starting point.

A starting point is any part of the path defined when the router is attached to the app.The full URL to any handler in a router will be the starting point followed by the path defined in the router.

Being able to "attach" the router to the app using any starting point, or move it to a different starting point without changing the router, is a key benefit of using the Express router.

### Create a Router for the /pastes Resource

```js
//@ src/pastes/pastes.router.js
const router = require("express").Router(); //creates a new instance of Express router.
const controller = require("./pastes.controller"); //imports the /pastes controller that you created earlier.

router.route("/").get(controller.list); 
/*
router.route("/") using route() allows you to write the path once, and then chain multiple route handlers to that path. Right now you have only get(), but later on, you will add post() and all() to the method chain.

get(controller.list) uses the list() route handler defined in the controller for GET requests to /.
*/ 

module.exports = router; //module.exports = router; exports the router for use in app.js.
```

Now that you have a router defined, attach it to the app.

```js
//@app.js

const pastesRouter = require("./pastes/pastes.router");

app.get("/pastes", (req, res) => {
  res.json({ data: pastes });
});
```

### Reorganize the Create-pastes handler

You will move the POST /pastes route handler and validation middleware out of app.js and put it into pastes.controller.js.

Remove the following code: 

```js
//@app.js
function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste), 0)

app.post("/pastes", bodyHasTextProperty, (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } = req.body;
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
  res.status(201).json({ data: newPaste });
});
```

Add the following

```js
//@ pastes.controller.js
let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0)

function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}

function create(req, res) {
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

module.exports = {
  create: [bodyHasTextProperty, create],
  list,
};
```

Modify your router code in pastes.router.js: 

```js
//@ pastes.router.js
router.route("/").get(controller.list).post(controller.create);
```

### Enhance creaete-paste validation

Now that you know that the create-paste handler is working in the reorganized code, you will enhance the create-paste validation to make sure that the other properties are also in the request.

Remove the following code: 

```js
//@ app.js

function bodyHasTextProperty(req, res, next) {
  const { data: { text } = {} } = req.body;
  if (text) {
    return next();
  }
  next({
    status: 400,
    message: "A 'text' property is required.",
  });
}
```

Add the following:
```js
//@ pastes.controller.js
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}
```

As an alternative to writing a function for validating each property, the bodyDataHas() function allows you to validate any given parameter. Now, update module.exports to include the new validation middleware:

```js
//@ pastes.controller.js

module.exports = {
  create: [
      bodyDataHas("name"),
      bodyDataHas("syntax"),
      bodyDataHas("exposure"),
      bodyDataHas("expiration"),
      bodyDataHas("text"),
      bodyDataHas("user_id"),
      create
  ],
  list,
};
```

You can add additional validation to test that the properties have valid values. Add the following code to pastes.controller.js:

```js
// @ pastes.controller.js

function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = ["None", "Javascript", "Python", "Ruby", "Perl", "C", "Scheme"];
  if (validSyntax.includes(syntax)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

function expirationIsValidNumber(req, res, next){
  const { data: { expiration }  = {} } = req.body;
  if (expiration <= 0 || !Number.isInteger(expiration)){
      return next({
          status: 400,
          message: `Expiration requires a valid number`
      });
  }
  next();
}
```

Then change the export to include these new middleware functions: 

```js
//@ pastes.controller.js

module.exports = {
  create: [
      bodyDataHas("name"),
      bodyDataHas("syntax"),
      bodyDataHas("exposure"),
      bodyDataHas("expiration"),
      bodyDataHas("text"),
      bodyDataHas("user_id"),
      exposurePropertyIsValid,
      syntaxPropertyIsValid,
      expirationIsValidNumber,
      create
  ],
  list,
};
```