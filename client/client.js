const fs = require('fs');
const axios = require('axios');

// Read the Python file
const pythonFile = fs.readFileSync('file.py', 'utf-8');

// Send the file to the server
axios.post('http://localhost:3000/run-python', {
  pythonFile: pythonFile
}, {
  timeout: 10000 // 10 seconds
})
.then((response) => {
  console.log(response.data);
})
.catch((error) => {
  console.log(error);
});