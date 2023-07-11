let express = require('express');
let bodyParser = require('body-parser')
let app = express();
app.use(bodyParser.urlencoded({extented:false}))
console.log("Hello World")
app.use((req, _, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`)
  next()
})
app.get("/", (_, res) => res.sendFile(__dirname + "/views/index.html"))
app.use("/public", express.static(__dirname + "/public"))
app.get("/json", (_, res) => res.json({ "message": process.env.MESSAGE_STYLE === "uppercase" ? "HELLO JSON" : "Hello json" }))
app.get("/now",(req,_,next)=>{
  req.time = new Date().toString()
  next()
},(req,res)=>res.json({time:req.time}))
app.get("/:word/echo",(req,res)=>res.json({echo:req.params.word}))
app.route("/name").get((req,res)=>res.json({name:`${req.query.first} ${req.query.last}`})).post((req,res)=>res.json({name:`${req.body.first} ${req.body.last}`}))



























module.exports = app;
