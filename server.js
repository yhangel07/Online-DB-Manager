var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = process.env.PORT || 8080;

const sql = require('mssql/msnodesqlv8');

app.use(bodyParser.json());

app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");

    next();
})

var config = {
    user: 'dbaph_dev',
    password: 'projectROS2018',
    //server: 'DVMXC021.dev.sprint.com',
    //server: 'DREWC049.dev.sprint.com',
    port: 2787,
    options: {
        encrypt: false
    }
}

var executeQuery = function(res, query){
    sql.connect(config, function(err){
        if(err){
            console.log("Error Connecting database: " + err);
            sql.close();

            return res.status(200).json({code: '1001', message: 'Server details not yet configured'});
        }else{
            var request = new sql.Request();

            request.query( query, function (err, data){
                if(err){
                    console.log("Error in query return: " + err);
                    sql.close();

                    return  res.status(200).json({code: '1002', message: 'ERROR: ' + err});
                }else{
                    sql.close();

                    return  res.status(200).json({code: '1717', message: 'Query Completed', data: data.recordsets[0]});
                    console.log("Response: " + JSON.stringify(data));

                }
            });
        }


    });
}


app.get('/api/server', function(req,res){
    var query = "SELECT @@SERVERNAME as 'server_name'";
    executeQuery (res, query);
});

app.post('/api/getInstances', function(req,res){
    config.server = req.body.serverName;
    var query = "DECLARE @GetInstances TABLE ( Value nvarchar(100), InstanceName nvarchar(100), Data nvarchar(100)); Insert into @GetInstances EXECUTE xp_regread @rootkey = 'HKEY_LOCAL_MACHINE', @key = 'SOFTWARE\\Microsoft\\Microsoft SQL Server', @value_name = 'InstalledInstances'; Select InstanceName from @GetInstances;"
    executeQuery (res, query);
});

app.use(express.static(__dirname + '/client/'));

app.get('/', function(req,res){
    console.log('Server is running ..');
});


// app.get('/api/server', function(req,res){
//     queryToServer( "SELECT @@SERVERNAME as 'server_name'", function(ret){
//         console.log("this:" + ret);
//     });

// });

// app.get('*', function(req,res){
//    // res.sendFile('/client/index.html');
// });

app.listen(port);
console.log("App Listening on port 8080");