// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');


// create the user model instance
let userModel = require('../models/user');
let User = userModel.User;



// define the book model
let contact = require('../models/contacts');


// helper function
function requireAuth(req, res, next)
{
    // check if user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}


const { readdirSync } = require('fs');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  contact.find((err, contacts) => {
    if (err) 
    {
      return console.error(err);
    }
    else 
    {
      res.render('contacts/index', {title: 'Contacts', 
      Contacts: contacts, 
      displayName: req.user ? req.user.displayName : ''});
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/details', requireAuth, (req, res, next) => {

    /*****************
     * ADDED CODE HERE *
     *****************/
     res.render('contacts/details', {title: 'Add Contact'})

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/details', requireAuth, (req, res, next) => {

    /*****************
     * ADDED CODE HERE *
     *****************/
     let newContact = contact({
      "name": req.body.name,
      "price": req.body.number,
      "author": req.body.email,
  });

  contact.create(newContact, (err, Contact) =>{
    if(err)
    {
        console.log(err);
        res.end(err);
    }
    else
    {
        // refresh the book list
        res.redirect('/contacts');
    }
  })
});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', requireAuth, (req, res, next) => {

    /*****************
     * ADDED CODE HERE *
     *****************/
     let id = req.params.id;

     contact.findById(id, (err, contactToEdit) =>{
         if(err)
         {
             console.log(err);
             res.end(err);
         }
         else
         {
             // show the edit view
             res.render('contacts/edit', {title: 'Edit Contact', 
             contacts: contactToEdit, 
             displayName: req.user ? req.user.displayName : ''});
         }
     }); 

});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', requireAuth, (req, res, next) => {
     let id = req.params.id

     let updatedContact = contact({
      "_id": id,
      "name": req.body.name,
      "number": req.body.number,
      "email": req.body.email,
     });
 
     contact.updateOne({_id: id}, updatedContact, (err) => {
         if(err)
         {
             console.log(err);
             res.end(err);
         }
         else
         {
             // refresh the book list
             res.redirect('/contacts');
         }
     })

});

// GET - process the delete by user id
router.get('/delete/:id', requireAuth, (req, res, next) => {
     let id = req.params.id;

     contact.remove({_id: id}, (err) => {
         if(err)
         {
             console.log(err);
             res.end(err);
         }
         else
         {
             // refresh the book list
             res.redirect('/contacts');
         }
 
     });

});


//  GET route for displaying login page  
router.get('/login', (req, res, next) => {

    // check if user is logged in
    if(!req.user)
    {
        res.render('auth/login', 
        {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName:req.user ? req.user.displayName : ''
        })
    }
    else
    {
        return res.redirect('/');
    }
     

});


//books.js, Oduneye Adekunle, 300564856, BookStoreApp

module.exports = router;
