const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const fs = require("fs");

const mongoUtil = require("../db/mongoUtil.js");
const db = mongoUtil.getDb();

router.post("/", (req, res) => {
  // Save the Python file
  const pythonFile = req.body.pythonFile;
  fs.writeFileSync("temp.py", pythonFile);

  // Execute the Python file
  const pythonProcess = spawn("python3", ["temp.py"]);

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

  // TODO: save data to DB and return
});

module.exports = router;


