var express = require("express");
var logfmt = require("logfmt");
var mongo = require('mongodb');

var app = express();

var mongoUri = 	process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost/mydb';


app.use(logfmt.requestLogger());

/******************************** URL routes ********************************/

/**
 * HTTP GET /
 * Param: :
 * Returns:
 * Error: 
 */
app.get('/', function(req, res) {
  ins({'pill_red':'sweetness', 'pill_blue':'sour'}); //testing..
  res.send('Hello Worldy!');
});

/**
 * HTTP GET /red-pills/:id
 * Param: :id is the unique identifier of the pill you want to eat
 * Returns: a string
 * Error: 404 HTTP code if the pill doesn't exists
 */
app.get('/red-pills/:id', function (request, response) {
    var taskId = request.params.id;
    try {
        response.json({'pill':'sweetness'});
    } catch (exeception) {
        response.send(404);
    }     
});


/**
 * HTTP POST /pills/
 * Body Param: the JSON task you want to create
 * Returns: 200 HTTP code
 */
app.post('/pills', function (request, response) {
    var pill = request.body;
    ins(pill);
    response.send(200);
});


/******************************** db functions ********************************/
function ins(pill) {
	mongo.Db.connect(mongoUri, function (err, db) {
	  db.collection('pills', function(er, collection) {
		collection.insert(pill, {safe: true}, function(er,rs) {
		});
	  });
	});
}

/******************************** start server ********************************/
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});