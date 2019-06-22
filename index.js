var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });

var Item = require('./models/items.js');
var itemViewModel = require('./view-models/item');

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/test';

app.engine('handlebars', handlebars.engine);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));

// connect to database
mongoose.connect(mongoUri, { useNewUrlParser: true }, function (err, res) {
  if ( err ) {
    console.log('error connecting to: ' + mongoUri + '. ' + err);
  } else {
    console.log('connected to: ' + mongoUri + '.');
  }
});


// routes
app.get('/', function (req, res) {
  res.render('home');
});

app.get('/items', function (req, res) {
  Item.find({}, function (err, docs) {
    if ( err ) {} // TODO
    var context = {
      items: docs.map(function (doc) {
        return itemViewModel(doc)
      })
    };
    res.render('items', context);
  }).sort({ updatedAt: -1 }).limit(10);
});

app.get('/items/add', function (req, res) {
  res.render('items-edit');
});

app.post('/items/add', function (req, res) {
  var data = processRequestData(req);
  var newitem = new Item(data);
  newitem.save(function (err) { if (err) console.error(err) });
  res.redirect(303, '/items');
});

app.get('/items/:id', function (req, res) {
  Item.findById(req.params.id, function (err, doc) {
    if ( err ) {} // TODO
    if ( !doc ) {} // TODO
    res.render('items-detail', itemViewModel(doc));
  });
});

app.get('/items/:id/edit', function (req, res) {
  Item.findById(req.params.id, function (err, doc) {
    if ( err ) {} // TODO
    if ( !doc ) {} // TODO
    res.render('items-edit', itemViewModel(doc));
  });
});

app.post('/items/:id/edit', function (req, res) {
  var data = processRequestData(req);
  Item.updateOne({ _id: req.params.id }, data, function (err, result) {
    if ( err ) { console.error(err) } // TODO
    if ( !result ) {} // TODO
  });
  res.redirect(303, '/items/' + req.params.id);
});

app.post('/search', function (req, res) {
  var term = req.body.q;
  Item.find({
    $or: [
      { name: { $regex: term, $options: 'i' } },
      { brand: { $regex: term, $options: 'i' } },
      { notes: { $regex: term, $options: 'i' } }
    ]
  }, function (err, docs) {
    if ( err ) {} // TODO
    if ( !docs ) {} // TODO
    var context = {
      term: term,
      items: docs.map(function (doc) {
        return itemViewModel(doc)
      })
    };
    res.render('items', context);
  }).limit(10);
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


function processRequestData (req) {
  if ( !req ) { return }
  var data = {
    brand: req.body.brand,
    name: req.body.name,
    servingSize: req.body.serving_size,
    servingSizeUnit: req.body.serving_size_unit,
    carbs: req.body.carbs,
    notes: req.body.notes
  };
  console.log('data:', data);
  return data;
}
