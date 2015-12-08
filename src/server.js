
    "use strict";

    var WORKERS = process.env.WEB_CONCURRENCY || 1;

    var express = require("express");
    var bodyParser = require('body-parser');
    var throng = require("throng");
    var util = require("util");
    var post = require("./getResponse");
    var auth = require("./auth");
    var winston = require('winston');


    function start(){


        winston.info("STARTING CODEOLOGY PROXY LRU CACHE");

        var app = express();
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        var server = app.listen( process.env.PORT, function () {
            var host = server.address().address;
            var port = server.address().port;
            winston.info( util.format( 'listening at http://%s:%s',host ,port ) );
        });

        app.get("/", require( "./testpage" ) );

        app.post( "/", auth, function( req, res ){
            post( req.body  ).then(function( json ){
                res.json( json );
            }).catch( function( err ){
                res.json( {error:err.message} );
            });
        });

        process.on('SIGTERM', function() {
            winston.info('Worker exiting');
            process.exit();
        });
    }


    throng( start, {
        workers: WORKERS,
        lifetime: Infinity
    });

