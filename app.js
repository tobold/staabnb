var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var formidable = require('express-formidable');
var expressLayouts = require('express-ejs-layouts');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');
var listings = require('./routes/listings');
var bookings = require('./routes/bookings');
var sessions = require('./routes/sessions');
var methodOverride = require('method-override');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(methodOverride('_method'));

// initialize express-session for tracking user sessions
app.use(session({
  key: 'user_sid',
  secret: 'somerandomstuff',
  resave: false,
  cookie: {
    expires: 600000
  }
}));

app.use('/', index);
app.use('/users', users);
app.use('/listings', listings);
app.use('/bookings', bookings);
app.use('/sessions', sessions);

//checks if cookie is saved in the browser when no user is set
app.use(function(req, res, next){
  if (req.cookies.user_sid && !req.session.user) {
    res.clearCookie('user_sid');
  }
  next();
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
