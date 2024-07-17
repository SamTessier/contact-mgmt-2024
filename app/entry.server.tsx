import express from "express";
import bcrypt from "bcrypt";
import connection from "./config/db";
import staffStudentDataLayer from './data/initializedatalayer.server';
import { createRequestHandler } from "@remix-run/express";
import isbot from "isbot";
import { PassThrough } from "node:stream";
import { RemixServer } from "@remix-run/react";
import { renderToPipeableStream } from "react-dom/server";
import { createReadableStreamFromReadable } from "@remix-run/node";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Signup routeu
app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query(
    "INSERT INTO users (username, email, password_hash, role_name) VALUES (?, ?, ?, 'user')",
    [username, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json({ error: "User registration failed" });
      res.status(201).json({ message: "User registered" });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Database query failed" });
      if (results.length > 0 && await bcrypt.compare(password, results[0].password_hash)) {
        res.json({ message: "Login successful" });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  );
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  // Assuming you will handle session validation using the Remix session storage
  const session = req.headers["cookie"];
  if (session) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

// Protect routes using the isAuthenticated middleware
app.get("/staff", isAuthenticated, async (req, res) => {
  try {
    const staffData = await staffStudentDataLayer.getData();
    res.json(staffData);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve staff data", details: err });
  }
});

app.post("/staff", isAuthenticated, async (req, res) => {
  const { firstName, lastName, school, phone, email, availability } = req.body;
  try {
    await staffStudentDataLayer.addData({ table: "staff", values: { firstName, lastName, school, phone, email, availability } });
    res.status(201).json({ message: "Staff added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add staff", details: err });
  }
});

app.get("/students", isAuthenticated, async (req, res) => {
  try {
    const studentData = await staffStudentDataLayer.getData();
    res.json(studentData);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve student data", details: err });
  }
});

app.post("/students", isAuthenticated, async (req, res) => {
  const { school, studentName, weeklySchedule, notes, email, phoneOne, parentOne, parentTwo, phoneTwo } = req.body;
  try {
    await staffStudentDataLayer.addData({ table: "students", values: { school, studentName, weeklySchedule, notes, email, phoneOne, parentOne, parentTwo, phoneTwo } });
    res.status(201).json({ message: "Student added" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add student", details: err });
  }
});

// Test MySQL connection
app.get("/test-db", async (req, res) => {
  try {
    const [results] = await connection.query("SELECT 1 + 1 AS solution");
    res.json({ status: "ok", solution: results[0].solution });
  } catch (err) {
    res.status(500).json({ error: "Database connection failed", details: err });
  }
});

app.use(
  "*",
  createRequestHandler({
    getLoadContext() {
      return {};
    },
    getDocumentRequestHandler(options) {
      return (req, res, next) => {
        handleRequest(req, res, options)
          .then((response) => {
            res.status(response.status).set(response.headers.raw()).send(response.body);
          })
          .catch(next);
      };
    }
  })
);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


function handleRequest(
  request, responseStatusCode, responseHeaders, remixContext, loadContext
) {
  return isbot(request.headers.get("user-agent"))
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
}

function handleBotRequest(
  request, responseStatusCode, responseHeaders, remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={5000}
      />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, 5000);
  });
}

function handleBrowserRequest(
  request, responseStatusCode, responseHeaders, remixContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <RemixServer
        context={remixContext}
        url={request.url}
        abortDelay={5000}
      />,
      {
        onShellReady() {
          shellRendered = true;
          resolve(); // Now using resolve to indicate promise completion
        },
        onError(error) {
          if (!shellRendered) {
            abort(); // Using abort in case of an error before shell is ready
            reject(error); // Now using reject to pass the error out
          }
        }
      }
    );
    // Using pipe to send the output to the response object or similar
    pipe(process.stdout); // Example usage of pipe, replace `process.stdout` with your actual output target
});

}


