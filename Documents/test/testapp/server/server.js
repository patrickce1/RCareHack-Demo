const express = require('express');
const app = express();
// const PORT = process.env.PORT || 4000; // Choose your desired port
const fs = require('fs');
const path = require('path');


app.get('/api/data', (req, res) => {
  // Construct the absolute file path to your JSON file
  // const dataFilePath = path.join(__dirname, 'data', 'data.json');
  // console.log("in");
  // // Read the JSON data from the file
  // fs.readFile(dataFilePath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Error reading JSON file:', err);
  //     return res.status(500).json({ error: 'Internal Server Error' });
  //   }

  //   // Parse the JSON data
  //   let jsonData;
  //   try {
  //     jsonData = JSON.parse(data);
  //   } catch (parseError) {
  //     console.error('Error parsing JSON data:', parseError);
  //     return res.status(500).json({ error: 'Internal Server Error' });
  //   }

  // Send the JSON data as the response
  res.json({ name: "Hayden" });
});


// Start the server
app.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});