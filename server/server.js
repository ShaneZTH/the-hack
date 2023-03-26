const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");
const session = require("express-session");

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {},
    saveUninitialized: false,
    proxy: true,
    resave: false,
  })
);

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

let scriptRouter = require("./routes/scriptHandler.js");
let userRouter = require("./routes/userHandler.js");

app.use("/script", scriptRouter);
app.use("/user", userRouter);

app.post("/run-python", (req, res) => {
  // Save the Python file
  const pythonFile = req.body.pythonFile;
  const parameters = req.body.parameters;
  fs.writeFileSync("temp.py", pythonFile);

  // Execute the Python file
  const pythonProcess = spawn("python3", ["temp.py", ...parameters]);

  // Get the result of the Python file
  pythonProcess.stdout.on("data", (data) => {
    const result = data.toString();
    res.send(result);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
