var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

const sql = require('mssql/msnodesqlv8');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");

    next();
});

app.use(express.static(__dirname + '/client/'));

app.get('/', function(req,res){
    console.log('Server is running ..');
});

app.listen(port);
console.log("App Listening on port 8080");

var mainConfig = {
    user: 'coycoad',
    password: 'asdf1234',
    //port: 2784,
    server: 'localhost',
    options: {
        encrypt: false,
        instanceName: 'SQLEXPRESS'
    }
}

const mainPool = new sql.ConnectionPool(mainConfig, err => {
    if(err){
        console.log(err);
    }else{
        console.log('Server Listening at port ' + mainConfig.port);
    }
});
/**
app.post('/api/login', function(req, res){
    var sqlQuery = "Use dba_ph_testDB; Select * from dbo.UserLogin where LoginName ='" + req.body.username + "' and PassWord = HASHBYTES('SHA1', '" + req.body.password + "');"

    mainPool.request().query(sqlQuery, (err, result) => {
        if(err){
            console.log('Query Error: ' + err);
            return  res.status(200).json({code: '1002', message: 'ERROR: ' + err});
        }

        console.log('RES.1: ' + result);
        return  res.status(200).json({code: '1717', message: 'Query Completed', data: result.recordsets[0]});
    });
});
**/

app.get('/api/users', function(req, res){
    var queryMe = "Select * from UserLogin;"
    mainPool.request().query(queryMe, (err, result) =>{
            if(err){
                console.log('Query Error: ' + err);
                return  res.status(200).json({code: '1002', message: 'ERROR: ' + err});
            }
            console.dir(result.recordset);
            //console.log('RES.1: ' + result);
            return  res.status(200).json({code: '1717', message: 'Query Completed', data: result.recordset});
    });
});