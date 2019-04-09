var express = require('express');
var mongoose = require('mongoose');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
               'mongodb://localhost/HelloMongoose';

mongoose.connect(mongoUri, function (err, res) {
  if ( err ) {
    console.log('error connecting to: ' + mongoUri + '. ' + err);
  } else {
    console.log('connected to: ' + mongoUri + '.');
  }
});


app.engine('handlebars', handlebars.engine);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'handlebars');


// routes
app.get('/', function (req, res) {
  res.render('home');
});


// middlewares
app.use(function (req, res) {
  res.status(404);
  res.render('404');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


// run the app
app.listen(app.get('port'), function () {
  console.log( 'app started on port ' + app.get('port') +
    '; press Ctrl-C to terminate.' );
});

