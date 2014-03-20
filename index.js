var express = require("express");
var logfmt = require("logfmt");
var mongo = require('mongodb');

var app = express();

var mongoUri = 	process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost/mydb';


app.use(logfmt.requestLogger());

app.get('/', function(req, res) {
	mongo.Db.connect(mongoUri, function (err, db) {
	  db.collection('pills', function(er, collection) {
		collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
		});
	  });
	});

  res.send('Hello Worldy!');
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});