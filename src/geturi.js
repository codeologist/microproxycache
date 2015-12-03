"use script";

var Redis = require('ioredis');
var https = require("https");
var util = require("util");

var REDISPASSWORD="3Q9idPOoDaz5f8k5";
var REDISENDPOINT="pub-redis-11429.us-east-1-3.3.ec2.garantiadata.com";
var REDISPORT = 11429


var config = {
    port: REDISPORT,          // Redis port
    host:  REDISENDPOINT,   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: REDISPASSWORD,
    db: 0
};

var redis = new Redis(config);

module.exports = function (body) {

    var uri = body.uri;
    var expire = body.expire || 300;

    console.log("======================================================");
    console.log( uri );
    console.log( "EXPIRE TIME" , expire );
    console.log("======================================================");

    return new Promise(function (resolve, reject) {
        console.log("inside promise");

        redis.exists( uri, function (err, exists) {


            console.log( "uri is cached =", !!exists);
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