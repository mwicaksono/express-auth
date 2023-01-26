const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/database');

const router = express.Router();

router.get('/', function (req, res) {
  res.render('welcome');
});

router.get('/signup', function (req, res) {
  res.render('signup');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/signup', async function (req, res) {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const data = {
    email: req.body.email,
    password: hashedPassword
  };

  const result = await db.getDb().collection('users').insertOne({ data });
  console.log(result);
  res.json({
    message: 'User Added',
    body: result
  });

});

router.post('/login', async function (req, res) { });

router.get('/admin', function (req, res) {
  res.render('admin');
});

router.post('/logout', function (req, res) { });

module.exports = router;
