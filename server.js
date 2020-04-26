// Setup empty JS object to act as endpoint for all routes
searchData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// Middleware
const bodyParser = require('body-parser');
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8080;
const server = app.listen(port, () => console.log('listening on port:' + port));

// Get method to fetch all the data
app.get('/allSearch', (req, res) => {
    res.send(searchData);
}); 

// Post method to update the searchData
app.post('/saveSearch', (req, res) => {
    searchData.push(req.body);
});