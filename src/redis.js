
    "use strict";

    var Redis = require('ioredis');

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

    module.exports = new Redis(config);
