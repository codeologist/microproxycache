
    "use strict";

    var WORKERS = process.env.WEB_CONCURRENCY || 1;

    var express = require("express");
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var throng = require("throng");
    var util = require("util");
    var getSecure = require("./getSecure");
    var getUnsecure = require("./getUnsecure");

    function start(){

        console.log("======================================================");
        console.log("STARTING CODEOLOGY PROXY LRU CACHE");
        console.log("======================================================");
        try {

            process.on('SIGTERM', function() {
                console.log('Worker exiting');
                process.exit();
            });

            var app = express();
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());

            var server = app.listen( process.env.PORT, function () {
                var host = server.address().address;
                var port = server.address().port;
                console.log("======================================================");
                console.log( util.format( 'listening at http://%s:%s',host ,port ) );
                console.log("======================================================");
            });

        } catch( e ){
            console.log("Error starting express app." + e );
        }

        app.get("/", function( req, res ){
            res.write("<html><head><title>proxy | codeology</title></head><body>");
            res.write("<h1>proxy.codeology.co.nz</h1>");
            res.write("<form method='post' action='/http'>");

            res.write("<label>URI of an api to proxy and cache</label>");
            res.write("<input type='text' name='uri' width='400'>");

            res.write("<label>Password</label>");
            res.write("<input type='password' name='password' width='400'>");

            res.write("<button>Test Post</button>");
            res.write("</form>");
            res.write("</body></html>");
            res.end();
        });

        app.post( "/http", function( req, res ){
            getUnsecure( req.body  ).then(function( json ){
                res.json( json );
            }).catch( function( err ){
                res.json( {error:err.message} );
            });
        });

        app.post( "/https", function( req, res ){
            getSecure( req.body  ).then(function( json ){
                res.json( json );
            }).catch( function( err ){
                res.json( {error:err.message} );
            });
        });
    }


    throng( start, {
        workers: WORKERS,
        lifetime: Infinity
    });

