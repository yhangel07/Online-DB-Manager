var express = require('express');
var app = express();

app.get('/', function (req, res) {
   
    const sql = require('mssql/msnodesqlv8');

    // config for your database
    var config = {
        user: 'dbaph_dev',
        password: 'projectROS2018',
        //server: 'ISD-PF0ZH0N5', 
        server: 'DVMXC021.dev.sprint.com',
        port: '2787',
        database: 'NRD',
        //domain: 'AD',
        options: {
            //instanceName: 'MS2008_DEV',
            //port: '2787',
            //trustedConnection: true,
            encrypt: false
        } 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) {
            console.log('Connection Error: ');
            console.log(err);
        }else{
            console.log("Connected to " + config.server);

            // create Request object
            var request = new sql.Request();
            
            // query to the database and get the records
            request.query('Select * from dbo.EmailData', function (err, recordset) {
                
                if (err){
                    console.log(err);
                }else{
                    // send records as a response
                    res.send(recordset);
                    sql.close();
                }
            });
        }
        
        
    });
});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});