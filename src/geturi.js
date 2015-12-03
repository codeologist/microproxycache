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

var redis = new Redis(config);

module.exports = function (body) {

    var uri = body.uri;
    var expire = body.expire || 300;

    console.log("======================================================");
    console.log( uri );
    console.log("======================================================");

    return new Promise(function (resolve, reject) {
        redis.exists( uri, function (err, exists) {


            console.log( "Is uri Cached", uri);
            console.log("======================================================");

            if (exists) {
                redis.get( uri, function (err, result) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                });
            } else {
                https.get( uri, function (res) {

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
                                try {
                                    resolve( JSON.parse( data ) );
                                } catch (e) {
                                    reject(e);
                                }
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
    });
};