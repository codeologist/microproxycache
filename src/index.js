
    "use script";

    var Redis = require('ioredis');
    var https = require("https");
    var util = require("util");

    var config = {
        port: process.env.REDISPORT,          // Redis port
        host: process.env.REDISENDPOINT,   // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        password: process.env.REDISPASSWORD,
        db: 0
    };

    var redis = new Redis( config );


        function Api( app ){
            process.stdout.write( "xxx" );
        }
        module.exports = Api;
//
//function cacheCseQuery( query ){
//    return new Promise( function( resolve, reject ){
//
    //        redis.exists( query, function( err, exists ){
    //
    //            if ( exists ){
    //                redis.get( query, function( err, result ){
    //                    try {
    //                        resolve( JSON.parse( result ) );
    //                    } catch ( e ){
    //                        reject( e );
    //                    }
    //                });
    //            } else {
    //                https.get( util.format("%s&q=%s", cseurl, query ), function(res) {
    //
    //                    var data = "";
    //
    //                    if (  res.statusCode < 200 || res.statusCode > 299 ){
    //                        reject( new Error("status code: "+res.statusCode ) );
    //                    }
    //
    //                    res.on('data', function( d ) {
    //                        data += d;
    //                    });
    //
    //                    res.on('end', function() {
    //                        try {
    //                            redis.multi();
    //                            redis.set( query, data.toString() );
    //                            redis.expire( query, 3600 );
    //                            redis.exec( function(){
    //                                resolve( JSON.parse( data.toString() ) );
    //
    //                            });
    //                        } catch( e ){
    //                            reject( e );
    //                        }
    //                    });
    //
    //                }).on('error', function(e) {
    //                    reject( e );
    //                });
    //            }
    //        });
//    });
//}
//
//module.exports = cacheCseQuery;