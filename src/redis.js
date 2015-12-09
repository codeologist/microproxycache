
    "use strict";

    var Redis = require('ioredis');

    var config = {
        port: process.env['REDISPORT'],          // Redis port
        host:  process.env['REDISENDPOINT'],   // Redis host
        family: 4,           // 4 (IPv4) or 6 (IPv6)
        password: process.env['REDISPASSWORD'],
        db: 0
    };

    module.exports = new Redis(config);
