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
    user: 'dbaph_dev',
    password: 'projectROS2018',
    port: 2784,
    server: 'DREWC049.dev.sprint.com',
    options: {
        encrypt: false
    }
}

const mainPool = new sql.ConnectionPool(mainConfig, err => {
    if(err){
        console.log(err);
    }else{
        console.log('Server Listening at port ' + mainConfig.port);
    }
});

app.post('/api/login', function(req, res){
    var sqlQuery = "Use dba_ph_testDB; Select * from dbo.UserLogin where LoginName ='" + req.body.username + "' and PassWord = HASHBYTES('SHA1', '" + req.body.password + "');"

    mainPool.request().query(sqlQuery, (err, result) => {
        if(err){
            console.log('Query Error: ' + err);
            return  res.status(200).json({code: '1002', message: 'ERROR: ' + err});
        }

        console.dir('RES.1: ' + result.recordset);
        return  res.status(200).json({code: '1717', message: 'Query Completed', data: result.recordset});
    });
});

// app.get('/api/server', function(req,res){
    
// });

/**
var config1 = {
    user: 'dbaph_dev',
    password: 'projectROS2018',
    server: 'DVMXC021.dev.sprint.com',
    //server: 'DREWC049.dev.sprint.com',
    port: 2787,
    //port: 2784,
    //database: 'NRD',
    //database: 'dba_ph_testDB',
    options: {
        encrypt: false
    }
}

const pool1 = new sql.ConnectionPool(config1, err => {
    if(err){
        console.log(err);
    }else{
        console.log('Server Listening at port ' + config1.port);
    }
});
**/

//var sqlQuery1 = "Select * From EmailData;";
//var sqlQuery1 = "SELECT * FROM  lkStatus;";
//var sqlQuery1 = "Select * from UserLogin;";

/**
const pool1 = new sql.ConnectionPool(config1, err => {
    if(!err){
        pool1.request().query(sqlQuery1, (err, result) => {
            if(err){
                console.log('Query 1 Error: ' + err);
            }
    
            console.log('RES.1: ' + result.recordsets[0].length);
        });
    }else{
        console.log("Connection Error.1: " + err.state + ' ' + err);
    }

  
});

pool1.on('error', err =>{
    console.log('Connection 1 Error: ' + err);
});
**/
/**
var config2 = {
    user: 'dbaph_dev',
    password: 'projectROS2018',
    //server: 'DVMXC021.dev.sprint.com',
    server: 'DREWC049.dev.sprint.com',
    //port: 2787,
    port: 2784,
    database: 'dba_ph_testDB',
    options: {
        encrypt: false
    }
}

//var sqlQuery2 = "Select * From EmailData;";
//var sqlQuery2 = "SELECT * FROM  lkStatus;";
var sqlQuery2 = "Select * from UserLogin;";

const pool2 = new sql.ConnectionPool(config2, err => {
    if(!err){
        pool2.request().query(sqlQuery2, (err, result) => {
            if(err){
                console.log('Query 2 Error: ' + err);
            }
    
            console.log('RES.2: ' + result.recordsets[0].length);
        });
    }else{
        console.log("Connection Error.2: " +  err);
    }
    
});

pool2.on('error', err =>{
    console.log('Connection 2 Error: ' + err);
});
**/