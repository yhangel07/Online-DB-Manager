var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

const sql = require('mssql/msnodesqlv8');

var secondaryPool = '';

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
    user: 'odbm_user',
    password: 'pass1234$$',
    //port: 2767,
    //server: 'DVMXC021.dev.sprint.com',
    server: 'ISD-PF0ZH0N5',
    database: 'SQLMonitor',
    options: {
        encrypt: false,
        instanceName: 'MS_TEST'
    }
}

const mainPool = new sql.ConnectionPool(mainConfig, err => {
    if(err){
        console.dir(err);
    }else{
        console.log('Server Listening at port ' + mainConfig.port);
    }
});

mainPool.on('error', err =>{
    console.log("Can\'t connect to server: " + err);
});

app.post('/api/login', function(req, res){
    var sqlQuery = "Select * from odbm.UserLogin where LoginName ='" + req.body.username + "' and PassWord = HASHBYTES('SHA1', '" + req.body.password + "');"

    mainPool.request().query(sqlQuery, (err, data) => {
        if(!err){
            console.dir(data);
            return res.status(200).json( data.recordset );
        }else{
          return res.status(500).json({
                  msg : 'Failed to retrieve User',
                  err : err
               });
        }
    });
});

app.get('/api/logout', function(err,res){
    //mainPool.close();
    if(!(secondaryPool === null || typeof secondaryPool === "undefined" || secondaryPool.length === 0)){
        secondaryPool.close();
    }
    res.status(200).json({
        msg: 'Server Disconnected'
    });
});

app.post('/api/getInstances', function(req,res){
        if(typeof (req.body.server) == "undefined"){
            return res.status(500).json({
                msg : 'Failed to retrieve Instance and Port',
                err : err
            });
        }
        var queryInstanceAndPort = "select instc_name, port_number from dbo.instances where srvr_name = '" + req.body.server + "';";

        mainPool.request().query(queryInstanceAndPort, (err, data) => {
            if(!err){
                return res.status(200).json(data.recordset);
            }else{
                return res.status(500).json({
                        msg : 'Failed to retrieve Instance and Port',
                        err : err
                    });
            }
        });
});

app.post('/api/server', function(req,res){
    var secondaryConfig = {
        user: req.body.user,
        password: req.body.pw,
        //password: 'projectROS2018',
        //port: req.body.portNumber,
        port: 2767,
        server: req.body.server,
        options: {
            encrypt: false
            //instanceName: req.body.instance
        }
    }
    console.dir(secondaryConfig);

    secondaryPool = new sql.ConnectionPool(secondaryConfig, err => {
        if(err){
            console.log("Connection Error at Secondary pool: " + err.state + ' ' + err);
            return res.status(500).json({
                msg: 'Failed to Connect to Secondary Server',
                err: err
            });
        }else{
            console.log('Server connected at Secondary Pool at port ' + secondaryConfig.port);
            secondaryPool.request().query("SELECT CONVERT(sysname, SERVERPROPERTY('servername'));", (err, data) => {
                if(err){
                    console.log('Query Error: ' + err);
                }
        
                return res.status(200).json(data.recordset[0]);
            });
            
        }
    });
    
    secondaryPool.on('error', err =>{
        console.log('Secondary Connection Error: ' + err);
    });

});

app.get('/api/checkServer', function(req, res){
    if(secondaryPool === null || typeof secondaryPool === "undefined" || secondaryPool.length === 0){
        return res.status(500).json({
            msg: 'Connection to server not yet established',
        });
    }else{
        secondaryPool.request().query("SELECT @@SERVERNAME", (err, data) => {
                if(err){
                    return res.status(500).json({
                        msg: 'Failed to Connect to Secondary Server',
                        err: err
                    });
                    console.log('Error: ' + err);
                }
                return res.status(200).json(data);
        });
    }
    
    secondaryPool.on('error', err =>{
        console.log('Secondary Connection Error: ' + err);
    });

});

app.get('/api/serverDisconnect', function(req,res){
    secondaryPool.close();
    res.status(200).json({
        msg: 'Server Disconnected'
    });
});


app.get('/api/user', function(req,res){
    console.log(req.query);

    // var getUserQuery ="select name from master.sys.server_principals where name like '" + req.query.searchString +"%'";

    var getUserQuery ="select * from sys.server_principals where (type='s' or type='u') and is_disabled = 0 and name <> 'sa'";
    //TODO change to secondaryPool after development
    mainPool.request().query(getUserQuery, (err, data) => {
        if(!err){
            console.dir(data);
            return res.status(200).json( data.recordset );
        }else{
            return res.status(500).json({
                msg : 'Failed to retrieve User',
                err : err
            });
        }
   });
});

app.post('/api/fullCloning', function(req,res){
    mainPool.request()
        .input('oldUser', sql.NVarChar(50), req.body.oldUser)
        .input('newUser', sql.NVarChar(50), req.body.newUser)
        .input('printOnly', sql.Bit, 0) //TODO change to 0
        .input('ISnew', sql.Int, req.body.iSnew)
        .input('ISSqlaunt', sql.Bit, req.body.IsSqlaunt)
        .execute('[odbm].[sp_ClonePermsRights]', (err, data) =>{
            if(!err){
                console.dir(data);
                return res.status(200).json( data.recordset );
            }else{
                return res.status(500).json({
                    msg : 'Failed to Clone',
                    err : err
                });
            }
        });
});
/**
function createConnectionPool(config){
   
    const pool = new sql.ConnectionPool(config, err => {
        if(err){
            console.log(err);
        }else{
            console.log('Server Listening at port ' + config.port);
        }
    });

    return pool;
   

   const pool = new sql.ConnectionPool(config)
        .connect()
        .then(pool => {
            console.log('Connected to MSSQL')
            return pool
        })
        .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
        
}
 */



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

if(!err){
        return res.status(200).json( data );
    }else{
      return res.status(500).json({
              msg : 'Failed to retrieve Incident',
              err : err
           });
    }
*/






/** Pending TODO 
var config1 = {
    user: 'dbaph_dev',
    password: 'projectROS2018',
    port: 2767,
    options: {
        encrypt: false
    }
};

app.post('/api/getInstances', function(req,res){
    config1.server = req.body.server;
    //config1.user = req.body.user;
    //config1.password = req.body.password;
    //config1.port = req.body.port;
    //console.dir(config1);

    var queryInstance = "DECLARE @GetInstances TABLE ( Value nvarchar(100), InstanceName nvarchar(100), Data nvarchar(100)); Insert into @GetInstances EXECUTE xp_regread @rootkey = 'HKEY_LOCAL_MACHINE', @key = 'SOFTWARE\\Microsoft\\Microsoft SQL Server', @value_name = 'InstalledInstances'; Select InstanceName from @GetInstances;"
    var queryInstanceAndPort = "DECLARE @portNumber NVARCHAR(10), @regPath NVARCHAR(40), @path NVARCHAR(max), @count binary(10); SET @count = 1; DECLARE @GetInstances TABLE ( Id int IDENTITY(1,1), InstanceName NVARCHAR(100), RegPath NVARCHAR(100), port_number NVARCHAR(10)); INSERT INTO @GetInstances(InstanceName, RegPath) EXEC master..xp_instance_regenumvalues @rootkey = N'HKEY_LOCAL_MACHINE', @key = N'SOFTWARE\\Microsoft\\Microsoft SQL Server\\Instance Names\\SQL' WHILE @count <= (SELECT count(*) FROM @GetInstances) BEGIN SET @regPath = (SELECT RegPath from @GetInstances where Id = @count); SET @path = 'Software\Microsoft\Microsoft SQL Server\'; SET @path += @regPath; SET @path += '\MSSQLServer\SuperSocketNetLib\Tcp\IpAll'; EXEC xp_regread @rootkey = 'HKEY_LOCAL_MACHINE', @key= @path, @value_name = 'TcpPort', @value = @portNumber OUTPUT IF @portNumber IS NULL EXEC xp_regread @rootkey = 'HKEY_LOCAL_MACHINE', @key=@path,@value_name = 'TcpDynamicPorts',@value = @portNumber OUTPUT Update @GetInstances SET port_number = @portNumber where Id = @count; SET @count += 1; END Select * from @GetInstances Go;";

    
    //var poolToUse = createConnectionPool(config1);

    const chosenServerPool = new sql.ConnectionPool(config1, err => {
        if(err){
            return  res.status(400).json({code: err.originalError.code, message: 'ERROR: ' + err.originalError.Error});
        }else{
            console.log('Server Listening at port ' + config1.port);
            chosenServerPool.request().query(queryInstance, (err, result) => {
                if(err){
                    console.log('Query Error: ' + err);
                    return  res.status(200).json({ message: 'ERROR: ' + err});
                }
        
                console.dir('RES.1: ' + result.recordset);
                return  res.status(200).json({message: 'Query Completed', data: result.recordset});
            });
        }
    });
});
**/


/**
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

//query for get users
//select * from master.sys.server_principals