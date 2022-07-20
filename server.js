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
const server = app.listen(port, () => {
  console.log('listening on port 9003');
});

//subscribing to event of unhandledRejection to catch all rejected promises
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION... Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledException', (err) => {
  console.log('UNHANDLED EXCEPTION... Shutting Down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
