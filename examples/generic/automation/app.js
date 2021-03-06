
/**
 * Module dependencies.
 */

var express     =  require('express')
  , routes      =  require('./routes')
  , toggleTv    =  require('./routes/toggleTv')
  , getStatus	=  require('./routes/getStatus')
  , net         =  require('net')
  , _mysql      =  require('mysql')
  , dataDB      =  require('./public/javascripts/dataDAO')
  , sleep	=  require('sleep');

// Instaciation
var app = module.exports = express.createServer();

// mysql connection
var HOST       = 'localhost';
var PORT       = 3306;
var PORT_TCP   = 9000;
var MYSQL_USER = 'root';
var MYSQL_PASS = '123';
var DATABASE   = 'monitorAbelhas';

var db_config = {
    host    : HOST,
    port    : PORT,
    user    : MYSQL_USER,
    password: MYSQL_PASS,
};

var mysql;

dataDAO = null;

function connectToDatabase() {
  mysql = _mysql.createConnection(db_config); // Recreate the connection, since
						  // the old one cannot be reused.
  mysql.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(connectToDatabase, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
					  // If you're also serving http, display a 503 error.
  mysql.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      connectToDatabase();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
  mysql.query('use ' + DATABASE);
  if (dataDAO != null)
      delete dataDAO;
  dataDAO = new dataDB.dataDAO(mysql);
  }

connectToDatabase();

client = new net.Socket();

client.on('error', function(err) {
  console.log(err);
  sleep.sleep(10);
  client.connect(PORT_TCP, HOST);
});

client.connect(PORT_TCP, HOST);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/'                     , routes.index);
app.get('/getStatus/:id'	, getStatus.getStatus);
app.get('/toggleTv/:id'         , toggleTv.toggleTv);

//Extra

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
