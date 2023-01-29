const path = require('path');

const express = require('express');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session');

const db = require('./data/database');
const demoRoutes = require('./routes/demo');
const MongoDBStore = mongodbStore(session);
const app = express();
const sessionStore = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017',
  databaseName: 'authDemo',
  collection: 'sessions'
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'my-secret-code',
  resave: false,
  saveUninitialized: false,
  store: sessionStore
}));
app.use(express.json())

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.render('500');
})

db.connectToDatabase().then(function () {
  app.listen(3000);
});
