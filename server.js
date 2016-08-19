var express = require("express");
var app = express();

/*app.get("/", function(req,res){
	res.end("get hello");
})
app.post("/", function(req,res){
	res.end("post hello");
})*/

app.use(express.static('public'));

var server = app.listen(2333, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("server start,%s:%s", host, port);
})
