const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//Database

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI ,{
  useNewUrlParser: true,
  useUnifiedTopology: true ,
})
  .then( () => {
      console.log('Connected to the MongoDB')
  })
  .catch( (err) => {
      console.error(`Error connecting to the database. n${err}`);
  })

//Middleware

const request_limiter = require ("./middlewares/request-limit")
app.use(request_limiter);

// const auth = require ('./middlewares/auth');
// app.use(auth);

const pickIp = require ('./middlewares/pickIp')
app.use(pickIp);

  //Routes

const signupRoutes = require('./routes/auth/signup');
app.use('/auth/signup', signupRoutes);

const loginRoutes = require('./routes/auth/login');
app.use('/auth/login', loginRoutes);

const forgotpassword = require('./routes/auth/forgotpassword');
app.use('/auth/', forgotpassword);

// const logout = require('./routes/auth/logout');
// app.use('/auth/logout/', logout);

const check_token = require('./routes/auth/check-token');
app.use('/auth/', check_token);


const port = 3001;
  app.listen(port, () => {});