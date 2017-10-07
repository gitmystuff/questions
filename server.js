const express = require('express');

var app = express(),
	bodyParser = require('body-parser'),
	cors = require('cors'),
	fs = require('fs'),
	httpServer = require('http'),
	path = require('path');
	
app.use(function(req, res, next){
	
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  fs.appendFile('server.log', log + '\n');
  next();
  
});
	
/*MySql connection*/

/*
var connection = require('express-myconnection'),
    mysql = require('mysql'),
	dbconfig = require('./db/dbconfig.js');

app.use(connection(mysql,dbconfig.connection,'request'));
*/

app.use(bodyParser.json());
app.use(cors());

//RESTful route
var router = express.Router();

//apply the router 
app.use('/api', router);
	
var httpPort = process.env.PORT || 8000;

var sendHTML = function(filePath, contentType, response) {

    fs.exists(filePath, function(exists) {

        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            response.writeHead(404);
            response.end();
        }
    });
}

var getFilePath = function(url) {

    var filePath = './app' + url;
    if (url == '/') filePath = './app/index.htm';

    return filePath;
}

var getContentType = function(filePath) {

    var extname = path.extname(filePath);
    var contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    return contentType;
}

var onHtmlRequestHandler = function(request, response, next) {
	
	var req = request,
		res = response,
		filePath = getFilePath(request.url),
		contentType = getContentType(filePath);
		
    sendHTML(filePath, contentType, response);

}

httpServer.createServer(onHtmlRequestHandler).listen(httpPort, function() {

    console.log("Web server is listening on port %s", httpPort);

});

/************************************************************************
*************************************************************************
API
*************************************************************************
************************************************************************/

var getTemplate = router.route('/getTemplate/:template/:activity');
getTemplate.get(function(req,res,next){
	
    var template = req.params.template;
	var fs = require('fs');	
	fs.readFile(__dirname + '/app/modules/' + template + '.htm', function (err, data){
		res.send([data.toString()]);            
	});

});

var getInstructions = router.route('/getInstructions/:activity');
getInstructions.get(function(req,res,next){
	
	var content = { Instructions: "Select ALL the correct choices, then click Done button. If none of the choices are correct, click the Done button without selecting any choices." };
	res.send(content);
	
});

var getActivityInfo = router.route('/getActivityInfo/:activity');
getActivityInfo.get(function(req,res,next){
	
	var content = { ActivityName: "Question", ItemsPerSet: 5 };
	res.send(content);	
	
});

var getItems = router.route('/getItems/:activity');
getItems.get(function(req,res,next){
	
	/* Don't include answers in production */
	var content = [{ ExID: "question", ItemNo: 1, Question: "A little girl kicks a soccer ball. It goes 10 feet and comes back to her. How is this possible? (Select all that apply)", Answer: "bc", MC1: "a. She is a power puff girl", MC2: "b. She kicks the ball straight up in the air", MC3: "c. She kicks the ball up a hill", ItemType: "mmc"}, { ExID: "question", ItemNo: 2, Question: "Who took over when Lenin died? (Select all that apply.)", Answer: "c", MC1: "a. McCartney", MC2: "b. Harrison", MC3: "c. Stalin", ItemType: "mmc"}, { ExID: "question", ItemNo: 3, Question: "If you are in a dark room, which of the following would you light first? (Select all that apply.)", Answer: "c", MC1: "a. Candle", MC2: "b. Woodstove", MC3: "c. Match", ItemType: "mmc"}, { ExID: "question", ItemNo: 4, Question: "A rooster laid an egg on top of the barn. Which way did it roll?", Answer: "c", MC1: "a. Down", MC2: "b. Depends which way the wind was blowing", MC3: "c. Roosters can not lay eggs", ItemType: "mmc"}, { ExID: "question", ItemNo: 5, Question: "If there are 6 apples and you take away 4, how many apples do you have?", Answer: "b", MC1: "a. 6", MC2: "b. 4", MC3: "c. 2", ItemType: "mmc"}];
	res.send(content);	
	
});

var getContent = router.route('/getContent/:id');
getContent.get(function(req,res,next){
	
    var id = req.params.id;

    switch(parseInt(id)){
        case 1:
            var content = '<div class="header-elements"><h2>HEADER</h2></div>';
            res.send([content]);
			/*
			var fs = require('fs');
            fs.readFile(__dirname + '/app/includes/header.htm', function (err, data){
                res.send([data.toString()]);            
            });
            */
            break;
		case 2:
            var content = '<div class="menu-elements"><div>MENU</div></div>';
            res.send([content]);
            break;		
		case 3:
            var content = '<div class="footer-elements"><div>FOOTER</div></div>';
			res.send([content]);
            break;
    }
	
    /*
	
	var id = req.params.id;
	
    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");
		
		conn.query('USE database');
        var query = conn.query("SELECT Content FROM sometable WHERE ID = ? ",[id],function(err,rows){

            if(err){
                //console.log(err);
                return next("Mysql error, check your query");
            }

            //if content not found
            if(rows.length < 1)
                return res.send("Content Not found");

            res.send(rows);
        });

    });

    */

});

app.listen(3000, () => {
  console.log('API server is up on port 3000');
});
