

    "use script";


    var comms = require("./fetch");
    var redis = require("./redis");

    module.exports = function (body) {
        return new Promise(function (resolve, reject) {

            var uri = body.uri;
            var expire = body.expire || 300;

            redis.exists( uri, function (err, exists) {
                if (exists) {
                    redis.get( uri, function (err, result) {
                        resolve( result );
                    });
                } else {
                    comms( uri ).then( function( data ){
                        redis.multi().set( uri, data ).expire( uri, expire ).exec( function(){
                            resolve(  data );
                        });
                    }).catch( function( err ){
                        reject( err );
                    });
                }
            });
        });
    };