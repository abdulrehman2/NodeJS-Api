const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);
//const DB = process.env.DB_LOCAL;

mongoose.connect(DB, { useCreateIndex: true, useFindAndModify: true, useNewUrlParser: true }).then(() => {
  console.log('Connected to Database');
});

//Server
const port = process.env.PORT;
app.listen(port, () => {
  console.log('listening on port 9003');
});
