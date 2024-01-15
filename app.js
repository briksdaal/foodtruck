var createError = require('http-errors');
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var debug = require('debug')('foodtruck:db');
var logger = require('morgan');
var compression = require('compression');
var helmet = require('helmet');
require('dotenv').config();

var indexRouter = require('./routes/index');
var categoryRouter = require('./routes/categories');
var cookwareRouter = require('./routes/cookware');
var cookwareinstanceRouter = require('./routes/cookwareinstances');
var perishableRouter = require('./routes/perishables');
var perishableinstanceRouter = require('./routes/perishableinstances');
var recipeRouter = require('./routes/recipes');

var app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const dev_db_url = 'mongodb://127.0.0.1:27017/food_truck';

const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch((err) => debug(err));

async function main() {
  const db = await mongoose.connect(mongoDB);
  debug('connected');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const RateLimit = require('express-rate-limit');
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);

app.use(compression()); // Compress all routes
app.use(helmet());
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/categories', categoryRouter);
app.use('/cookware', cookwareRouter);
app.use('/cookwareinstances', cookwareinstanceRouter);
app.use('/perishables', perishableRouter);
app.use('/perishableinstances', perishableinstanceRouter);
app.use('/recipes', recipeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: err.message });
});

module.exports = app;
