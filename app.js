const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const docsRouter = require('./src/docs/router');
// MODE CHANGER: Change this global to switch to docs mode
global.docsMode = false;

// Convert assets location based on what type of gulp task we are running
app.locals.asset = function(assetLocation, assetTheme){ return assetLocation; }
app.locals.site_analytics = process.env.ANALYTICS || "";

app.set('view engine', 'ejs'); // Set template engine to ejs
if (!global.docsMode){
	// Theme pages
	app.set('views', [path.join(__dirname, 'src/theme/')]);
	app.use(express.static(path.join(__dirname, 'src/theme/public/')));
	app.use(express.static(path.join(__dirname, 'src/theme/assets')));
	app.use(morgan('tiny'));
} else {
	// Documentation pages
	app.set('views', [path.join(__dirname, 'src/docs/')]);
	app.use(express.static(path.join(__dirname, 'src/docs/public')));
	app.use(express.static(path.join(__dirname, 'src/docs/assets')));
	app.use(morgan('tiny'));
	app.use(docsRouter);
}


// For testing function

var fs = require('fs');
// var obj;
// fs.readFile(__dirname + '/example_data.json', 'utf8', function (err, data) {
//     if (err) throw err;
//     obj = data;
// });

var request = require("request")
// URI goes here
request('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  obj = JSON.parse(body)  // print it all
});


// Theme pages
app.get('/', (req,res) => res.render('index')); // Landing page
app.get('/auth', (req,res) => res.render('auth')); // Authentication page
app.get('/page', (req,res) => res.render('page')); // Plain page
app.get('/dashboard', (req,res) => res.render('dashboard')); // Dashboard page
app.get('/energy', (req,res) => res.render('energy')); // Dashboard page
app.get('/example_data',  (req,res) => res.json(obj)); // data




app.listen(3000, () => console.log('Evie app listening on port 3000')); // Initialize the express server
