var express = require('express');
var app = express();
var querystring = require('querystring');
var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  port     : 3306,
  user     : 'root',
  password : '123456',
  database : 'test'
});

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.post('/trace',function(req,res){

  pool.getConnection(function(err, connection) {
  	if(err != null){
  		res.end();
  	}else{
      var role_id = req.body.roleid;
      var open_id = req.body.openid;
      var server = req.body.serverid;
      var trace_data = querystring.stringify(req.body);
      var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

  		connection.query('insert into trace_data ( role_id,open_id,server,trace_data,user_ip) values ( ? ,? ,? ,?, ?)',
        [role_id,open_id,server,trace_data,user_ip],function(err,rows){

      connection.release();
      })
  		res.end('ok');		
  	}
  	
  });    
});

process.on('uncaughtException', function (err) {
  console.error('Error caught in uncaughtException event:', err);
});

app.listen(3000);
console.log('Listening on port %d',3000);