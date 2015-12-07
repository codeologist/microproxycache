

    "use script";


    var http = require("http");
    var https = require("https");
    var redis = require("./redis");

    module.exports = function (body) {
        return new Promise(function (resolve, reject) {


            var uri = body.uri;
            var expire = body.expire || 300;
            var password = body.password;
            var isSecure = uri.indexOf("http://") !== -1;
            var protocol = isSecure ? https : http;

            console.log("----> ---------- -------- ------>",body);
            if ( password !== "txftt10t"){
                reject( new Error("invalid password ("+body.password+")" + JSON.stringify(body) ) );
            } else {

                redis.exists( uri, function (err, exists) {
                    if (exists) {
                        redis.get( uri, function (err, result) {

                                resolve( result );

                        });
                    } else {
                        protocol.get( uri, function (res) {

                            var data = "";

                            if (res.statusCode < 200 || res.statusCode > 399) {
                                reject(new Error("status code: " + res.statusCode));
                            }

                            res.on('data', function (d) {
                                data += d;
                            });

                            res.on('end', function () {
                                try {
                                    data = data.toString();

                                    redis.multi();
                                    redis.set( uri, data );
                                    redis.expire( uri, expire);
                                    redis.exec( function(){
                                        resolve(  data );
                                    });

                                } catch (e) {
                                    reject(e);
                                }
                            });

                        }).on('error', function (e) {
                            reject(e);
                        });
                    }
                });
            }
        });
    };