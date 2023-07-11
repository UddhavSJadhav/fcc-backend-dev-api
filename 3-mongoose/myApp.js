require('dotenv').config();
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
})

let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const person = Person()
  person.name = "Uddhav"
  person.age = 12
  person.favoriteFoods = ["panipuri"]
  person.save((err, data) => done(err, data))
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => done(err, data));
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => done(err, data))
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => done(err, data))
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => done(err, data))
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
Person.findById(personId,(err,data)=>{
  if(err)return done(err)
  data.favoriteFoods.push(foodToAdd)
  data.save((err2,data2)=>done(err2,data2))
})
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
Person.findOneAndUpdate({name:personName},{age:ageToSet},{new:true},(err,data)=>done(err,data))
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId,(err,data)=>done(err,data))
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
Person.remove({name:nameToRemove},(err,data)=>done(err,data))
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch}).sort('name').limit(2).select('-age').exec((err,data)=>done(err,data))
};

/** **Well Done !!**
 * You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
