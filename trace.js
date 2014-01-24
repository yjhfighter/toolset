var express = require('express');
var app = express();
var http = require('http');
var querystring = require('querystring');
var proxy_config = require('./config/proxy_config.json')

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post('/trace',function(req,res){
  console.log('page unload at ',new Date());
  console.log(req.body);
  res.end('ok');
});

process.on('uncaughtException', function (err) {
  console.error('Error caught in uncaughtException event:', err);
});

app.listen(proxy_config.proxy_port);
console.log('Listening on port %d',proxy_config.proxy_port);