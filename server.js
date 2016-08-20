var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");

app.use(express.static('public'));
app.use(cookieParser());

/*app.get("/", function(req,res){
	res.end("get hello");
})
app.post("/", function(req,res){
	res.end("post hello");
})*/
app.post("*", function(req, res) {

	console.log("cookies:" + req.cookies);
})
app.post("/file-upload", function(req, res) {
	console.log(req,files[0]);
	var des_file =  __dirname + "/" + req.file[0].originalname;
	fs.readFile(req.files[0].path,function(err,data){
		fs.writeFile(des_file,data,function(err,data){
			if(err){
				console.log(err);
			}
			else{
				response = {
					msg:"上传成功",
					filename:req.files[0].originName
				}
			}
			console.log(response);
			res.end(JSON.stringify(response));
		})
	})
})

var server = app.listen(2333, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log("server start,%s:%s", host, port);
})