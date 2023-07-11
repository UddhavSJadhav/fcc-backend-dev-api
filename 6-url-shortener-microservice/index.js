require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require("dns")
const url = require("url")
const bodyParser = require("body-parser")
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const arrayOfUrls = []

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url
  let chng = /^https:|^http:/.test(originalUrl) ? originalUrl : "https://"+originalUrl
const parsedLookupUrl = url.parse(chng);
console.log(parsedLookupUrl)
dns.lookup(parsedLookupUrl.protocol ? parsedLookupUrl.host 
           : parsedLookupUrl.path, (err,address,family)=>{
  if(err)return res.json({error:"invalid url"})
  console.log(parsedLookupUrl.href)
  arrayOfUrls.push(parsedLookupUrl.href)
  res.json({original_url:originalUrl,short_url:arrayOfUrls.length})
   });
  })

app.get("/api/shorturl/:surl",(req,res)=>{
  const surl = Number(req.params.surl)
  if(surl===NaN)return res.sendStatus(400)
  res.redirect(301, arrayOfUrls[surl-1])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
