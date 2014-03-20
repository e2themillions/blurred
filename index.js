var express = require("express");
var logfmt = require("logfmt");
var mongo = require('mongodb');
var app = express();
var mongoUri = 	process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';

app.use(logfmt.requestLogger());

/******************************** URL routes ********************************/
app.get('/', function(req, res) {
  //ins({'pill_red':'sweetness', 'pill_blue':'sour'}); //uncomment to insert (confusing) test pill..
  mongo.Db.connect(mongoUri, function (err, db) {
	  db.collection('pills', function(er, collection) {
		 collection.count(function(err, count) {
			
			collection.findOne({"pill_blue":"sour"}, function(err, pill) {
				res.send("We have " + count + " pill"+ (count!=1?"s":"") +". Here's one: " + pill._id);
			});
		});
		 
	  });
  });
  //res.send('Hello Worldy!');
});

/******************************** REST API ********************************/

/**
 * HTTP GET /:color/:id
 * Param: :id is the unique identifier of the pill you want to eat
 * Param: :color is the color of the pill you want to eat (red = truth, blue = something else)
 * Returns: a string
 * Error: 404 HTTP code if the pill doesn't exists
 */
app.get('/pills/:color/:id', function (request, response) {
    try {
		var pillId = request.params.id;
		var pillColor = request.params.color;
		var isRed = ('red'===pillColor.toString().toLowerCase());	
		if (isRed||('blue'===pillColor.toString().toLowerCase())){ 
			//response.send(pillColor.toLower());
			get(pillId, response, isRed);		
		}else{
			response.send(404);
		}		
    } catch (exeception) {
        response.send(404);
    }     
});



/**
 * HTTP POST /pills/
 * Body Param: the JSON pill you want to create
 * {'pill_red':string, 'pill_blue':string}
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

function get(oid, response, red) {
	mongo.Db.connect(mongoUri, function (err, db) {
		db.collection('pills', function(er, collection) {
			collection.findOne({"_id":mongo.BSONPure.ObjectID.createFromHexString(oid)}, function(err, pill) {
			//collection.findOne({"pill_blue":"sour"}, function(err, pill) {
				if (err || !pill) {
					response.send(404);
				} else {				
					collection.remove({"_id":mongo.BSONPure.ObjectID.createFromHexString(oid)}, function(dele_err, res) {
						response.send((red)? pill.pill_red : pill.pill_blue);									
						//response.json(pill);					
					});
					db.close();					
				}
			});		
		});
	});    
}

/******************************** start server ********************************/
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});