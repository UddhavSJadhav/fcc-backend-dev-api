const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

//mongodb setup
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const Exercise = mongoose.model("Exercise", new mongoose.Schema({
  username: String,
  description: String,
  duration: Number,
  date: Date,
}))
const User = mongoose.model("User", new mongoose.Schema({
  username: String
}))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//onError
const onError = (res) => res.status(500).json({ message: "Something went wrong!" })

//User verbs
app.route("/api/users").get(async (_, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (e) { onError(res) }
}).post(async (req, res) => {
  try {
    const newUser = await User.create({ username: req.body.username })
    res.json(newUser)
  } catch (e) {
    onError(res)
  }
})

//Exercise verbs
app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params._id }).lean()
    const exercise = await Exercise.create({
      username: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body?.date || new Date().toDateString()
    })
    res.json({username: user.username,
            _id: user._id,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(), })
  } catch (e) {
    console.log(e)
    onError(res)
  }
})

//log verbs
app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params._id }).lean()
    let obj = {username: user.username}
    if(req.query?.from && req.query.to)obj.date = {$gte: new Date(req.query.from),$lte:new Date(req.query.to)}
    else if(req.query?.from) obj.date = {$gte:new Date(req.query.from)}
    else if(req.query?.to) obj.date = {$lte:new Date(req.query.to)}
    const log = await Exercise.find(obj).select('description duration date').limit(parseInt(req.query?.limit || 0)).lean()
    res.json({ ...user, log:log.map(e=>({...e,date:new Date(e.date).toDateString()})), count: log.length })
  } catch (e) { onError(res) }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
