//index.js, Oduneye Adekunle, 300564856, BookStoreApp

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');



// define the reference model
let book = require('../models/contacts');
let userModel = require('../models/user');
let User = userModel.User;

/* GET home page. wildcard */
router.get('/', (req, res, next) => {
  res.render('content/index', {
    title: 'Home',
    books: ''
   });
});


// router.get('/contact', (req, res, next) => {
//   res.render('content/index', { title: 'Contact', displayName: req.user ? req.user.displayName : ''});
// });

// Display login page
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

//  GET route for processing login page  
router.post('/login', (req, res, next) => {

  passport.authenticate('local',
  (err, user, info) => {
      //server err
      if(err)
      {
          return next(err);            
      }
      // is there a user log in error?
      if(!user)
      {
          req.flash('loginMessage', 'Authentication Error');
          return res.redirect('/login');
      }
      req.login(user, (err) => {
          // server error?
          if(err)
          {
              return next(err);
          }
          return res.redirect('/contacts');
      });
  })(req, res, next);
});


//  GET route for displaying registerr page  
router.get('/register', (req, res, next) => {
  // check if the user is not already logged in
  if(!req.user)
  {
      res.render('auth/register',
      {
          title: 'Register',
          messages: req.flash('registerMessage'),
          displayName: req.user ? req.user.displayName : ''
      });
  }
  else
  {
      return res.redirect('/');
  }

});

//  GET route for processing register page  
router.post('/register', (req, res, next) => {

  // instantiate a uer object

  let newUser = new User({
      username: req.body.username,
      //password: req.body.password
      email: req.body.email,
      displayName: req.body.displayName
  });
     
  User.register(newUser, req.body.password, (err) => {
      if(err)
      {
          console.log("Error: Inserting New User");
          if(err.name == "UserExistsError")
          {
              req.flash(
                  'registerMessage',
                  'Registration Error: User Already Exists!'
              );
              console.log('Error: User Already Exists!')
          }
          return  res.render('auth/register',
          {
              title: 'Register',
              messages: req.flash('registerMessage'),
              displayName: req.user ? req.user.displayName : ''
          });
      }
      else
      {
          // if no error exist, the registration is successful
          // redirect and auth user
          return passport.authenticate('local')(req, res, () => {
              res.redirect('/books')
          });
      }
  })

});


// GET - process tuser logout 
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');    
});





module.exports = router;

