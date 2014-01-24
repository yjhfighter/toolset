var express = require('express');
var app = express();
var http = require('http');
var querystring = require('querystring');
var proxy_config = require('./config/proxy_config.json')

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.get('/', function(req, res){
   
  var body = '秦时明月社交版新浪微博代理服务器';
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', Buffer.byteLength(body));
  res.end(body);
});

app.post('/',function(req,res){

	console.log('questy string : %s',querystring.stringify(req.query));
  var post_data = querystring.stringify(req.body);
	console.log('form data : %s',post_data);

	var isSandboxUid = false;
	var sandbox_uids = proxy_config.sandbox_uids;
	for(var i = 0; i < sandbox_uids.length; i++){
		if(req.body.order_uid == sandbox_uids[i]){
			isSandboxUid = true;
      break;
		}
	}

  var backend_host = isSandboxUid ? proxy_config.sandbox.host : proxy_config.production.host;
  var backend_port = isSandboxUid ? proxy_config.sandbox.port : proxy_config.production.port;
  var backend_path = isSandboxUid ? proxy_config.sandbox.path : proxy_config.production.path;
	// An object of options to indicate where to post to
  	var post_options = {
      host: backend_host,
      port: backend_port,
      path: backend_path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length
      }
  	};

    console.log(post_options);
  	// Set up the request
  	var post_req = http.request(post_options, function(post_res) {
      post_res.setEncoding('utf8');
      post_res.on('data', function (chunk) {
          console.log(chunk);
          res.write(chunk);
      });
      post_res.on('end',function(){
      	res.end();
      })
  	});

  	// post the data
  	post_req.write(post_data);
  	post_req.end();
});

process.on('uncaughtException', function (err) {
  console.error('Error caught in uncaughtException event:', err);
});

app.listen(proxy_config.proxy_port);
console.log('Listening on port %d',proxy_config.proxy_port);