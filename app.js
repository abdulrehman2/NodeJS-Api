const express = require('express');

const app = express();
const morgan = require('morgan');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');

//////////////////////Middleware//////////////////////////

//-------Logging-----------//
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//--------BUILT IN Middleware----------------//
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from miidleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//////////////////////Routers//////////////////////////
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//IF NO ROUTE FOUND, THIS MIDDLEWARE WILL BE INVOKED
app.all('*', (req, res, next) => {
  //res.status(404).json({ error: 404, message: `The requested URL ${req.originalUrl} does not exist` });
  const error = new Error(`The requested URL ${req.originalUrl} does not exist`);
  error.status = 'fail';
  error.statusCode = 404;

  next(error);
});

//GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({ status: err.status, message: err.message });
});

module.exports = app;
