var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const userCreateRouter = require('./routes/userCreate');
const userDeleteRouter = require('./routes/userDelete');

const timelineRouter = require('./routes/timeline');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');

const postCreateRouter = require('./routes/postCreate');
const replyCreateRouter = require('./routes/replyCreate');
const postReactionRouter = require('./routes/postReaction');
const followRouter = require('./routes/follow');
const userConfChgRouter = require('./routes/userConfChg');
const chatSendRouter = require('./routes/chatSend')



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usercreate', userCreateRouter);
app.use('/userdelete', userDeleteRouter);

app.use('/timeline', timelineRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/chat', chatRouter);

app.use('/postcreate', postCreateRouter);
app.use('/replycreate', replyCreateRouter);
app.use('/postreaction', postReactionRouter);
app.use('/follow', followRouter);
app.use('/userconfchg', userConfChgRouter);
app.use('/chatsend', chatSendRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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