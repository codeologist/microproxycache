"use script";

var Redis = require('ioredis');
var http = require("http");
var util = require("util");

var REDISPASSWORD="3Q9idPOoDaz5f8k5";
var REDISENDPOINT="pub-redis-11429.us-east-1-3.3.ec2.garantiadata.com";
var REDISPORT = 11429;


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
    var password = body.password;


    return new Promise(function (resolve, reject) {
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
                    http.get( uri, function (res) {

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