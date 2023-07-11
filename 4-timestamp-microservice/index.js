// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function(req, res) {
  res.json({ greeting: 'hello API' });
});

//Timestamp Microservice
app.get("/api/:date", (req, res) => {
  const dateToConvert = new Date(/^\d+$/.test(req.params.date) ? parseInt(req.params.date) : req.params.date)
  if (dateToConvert.toString() === "Invalid Date") return res.json({ error: "Invalid Date" })
  res.json({ unix: dateToConvert.getTime(), utc: dateToConvert.toUTCString() })
})
app.get("/api", (req, res) => {
  const dateToConvert = new Date()
  if (dateToConvert.toString() === "Invalid Date") return res.json({ error: "Invalid Date" })
  res.json({ unix: dateToConvert.getTime(), utc: dateToConvert.toUTCString() })
})

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
