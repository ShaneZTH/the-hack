const fs = require('fs');
const axios = require('axios');

// Read the Python file
const pythonFile = fs.readFileSync('file.py', 'utf-8');

// Get the parameters from the user
const a = 2;
const b = 3;

// Send the file to the server
axios.post('http://localhost:8080/run-python', {
  pythonFile: pythonFile,
  parameters: [a, b]
}, {
  timeout: 10000 // 10 seconds
})
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  });