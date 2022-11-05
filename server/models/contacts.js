//books.js, Oduneye Adekunle, 300564856, BookStoreApp

let mongoose = require('mongoose');

// create a model class
let Contactmodel = mongoose.Schema({
    name: String,
    number: String,
    email: String
},
{
  collection: "contacts"
});

module.exports = mongoose.model('Contact', Contactmodel);
