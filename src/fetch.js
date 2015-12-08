
    "use script";


    var http = require("http");
    var https = require("https");

    function Comms( uri ){
        return new Promise( function( resolve, reject ){
            var protocol = uri.indexOf("https://") !== -1 ? https : http;

            protocol.get( uri, function ( res ) {

                var data = "";

                if ( res.statusCode < 200 || res.statusCode > 399 ) {
                    reject( new Error("status code: " + res.statusCode) );
                }

                res.on('data', function (d) {
                    data += d;
                });

                res.on('end', function () {
                    resolve( data.toString() );
                });
            }).on('error', function (e) {
                reject(e);
            });

        });
    }

    module.exports = Comms;