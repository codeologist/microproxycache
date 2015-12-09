
    "use strict";

    var winston = require('winston');

    function Auth( req, res, next ){
        if ( req.body.password === process.env['AUTHKEY']){
            winston.log( 'info', 'AUTHORIZED' );
            next();
        } else {
            winston.log( 'warn', 'AUTH FAIL' );
            res.sendStatus(404);
        }

    }

    module.exports = Auth;