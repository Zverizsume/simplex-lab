var express = require('express');
var httpClient = require('http');
var app = new express();

var parser = require('rss-parser');
var http = require('http');
var server = http.createServer(app);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

server.listen(3000);    
console.log("Express server listening at 3000");

var io = require('socket.io').listen(server);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get("/",function(req,res){

	res.sendFile(__dirname + '/public/tabla.html');

});

io.on('connection', function(socket)
{
	console.log('IMI user connected');
	
    var url = 'https://imi.pmf.kg.ac.rs/rss.php';

    parser.parseURL('https://imi.pmf.kg.ac.rs/rss.php', function(err, parsed)
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        //console.log(parsed);
        parsed.feed.entries.forEach(function(entry) 
        {
          entry.content = entry.content.replace('\"pub','"https://imi.pmf.kg.ac.rs/pub');
          io.emit("results", {"results": entry});
          //console.log(entry.title + "     " + JSON.stringify(entry));
        });
      }
    });
});
