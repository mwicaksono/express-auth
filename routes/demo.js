const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome');
});

router.get('/signup', function (req, res) {
  let sessionData = req.session.inputData;

  if (!sessionData) {
    sessionData = {
      hasError: false,
      email: '',
      confirmEmail: '',
      password: ''
    };
  }
  req.session.inputData = null;
  res.render('signup', { sessionData });
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/signup', async function (req, res) {
  const email = req.body.email;
  const confirmEmail = req.body["confirm-email"];
  const password = req.body.password;

  if (!email || !password || password.trim().length < 6 || email != confirmEmail) {
    req.session.inputData = {
      hasError: true,
      message: 'Invalid Data, please check your input first.',
      email: email,
      confirmEmail: confirmEmail,
      password: password
    }

    req.session.save(() => {
      res.redirect('/signup');
    })
    return;
  }

  // const checkEmail = await db.getDb().collection('users').findOne({ "data.email": email })


  // if (checkEmail) {
  //   return res.json({
  //     message: 'Email already exist in our systems!'
  //   });
  // }

  const hashedPassword = await bcrypt.hash(password, 12);
  const data = {
    email: req.body.email,
    password: hashedPassword
  };

  const result = await db.getDb().collection('users').insertOne({ data });
  res.redirect('/signup');

});

// router.post('/signup', async function (req, res) {
//   const email = req.body.email;
//   const password = req.body.password;

//   if (!email || !password || password.trim().length < 6) {
//     // return res.json({
//     //   message: 'Invalid Data!'
//     // });
//     console.log('invalid data');
//     return res.redirect('/signup');
//   }

//   const checkEmail = await db.getDb().collection('users').findOne({ "data.email": email })


//   if (checkEmail) {
//     return res.json({
//       message: 'Email already exist in our systems!'
//     });
//   }



//   const hashedPassword = await bcrypt.hash(password, 12);
//   const data = {
//     email: req.body.email,
//     password: hashedPassword
//   };

//   const result = await db.getDb().collection('users').insertOne({ data });
//   console.log(result);
//   res.json({
//     message: 'User Added',
//     body: result
//   });

// });

router.post('/login', async function (req, res) {
  const email = req.body.email;
  const enteredPassword = req.body.password;
  const userData = await db.getDb().collection('users').findOne({ "data.email": email });
  if (!userData) {
    return res.json({
      message: `Can't find that email`,
    });
  }
  const password = await bcrypt.compare(enteredPassword, userData.data.password)

  if (!password) {
    return res.json({
      message: 'Wrong Password',
    });
  }

  req.session.user = { id: userData._id, email: userData.data.email };
  req.session.isAuthenticated = true;
  req.session.save(() => {
    // return res.redirect('/admin');
    return res.json({
      message: `Login Success`,
    });
  });


});

router.get('/admin', async function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render('401');
  }
  res.render('admin');
});

router.post('/logout', function (req, res) {
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect('/');

});

module.exports = router;
