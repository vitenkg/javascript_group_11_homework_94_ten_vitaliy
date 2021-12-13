require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const exitHook = require('async-exit-hook');
const config = require('./config');
const Users = require('./app/users');
const Events = require("./app/events");


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
require('express-ws')(app);

const port = 8000;

app.use('/users', Users);
app.ws('/events', Events);


const run = async () => {
  await mongoose.connect(config.db.url);

  app.listen(port, () => {
    console.log(`Server started on ${port} port`);
  });

  exitHook(() => {
    console.log('Mongo Exiting...');
    mongoose.disconnect();
  });
};

run().catch(e => console.error(e));