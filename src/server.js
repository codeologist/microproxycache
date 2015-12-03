
    "use strict";

    var WORKERS = process.env.WEB_CONCURRENCY || 1;

    var express = require("express");
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var throng = require("throng");
    var util = require("util");
    var geturi = require("./geturi");

    function start(){

        console.log("STARTING CODEOLOGY PROXY LRU CACHE");

        try {

            process.stdout.write('Started worker');

            process.on('SIGTERM', function() {
                process.stdout.write('Worker exiting');
                process.exit();
            });

            var app = express();

            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());

            //parse application/x-www-form-urlencoded
            //app.use(bodyParser.urlencoded({ extended: false, limit: 2048 }));

            // parse application/json

            // var upload = multer({ dest: 'tmp/' });

        //
            var server = app.listen( process.env.PORT, function () {
                var host = server.address().address;
                var port = server.address().port;

                process.stdout.write( util.format( 'listening at http://%s:%s',host ,port ) );
            });

        } catch( e ){
            process.stderr.write("Error starting express app." + e );
        }

        app.get("/", function( req, res ){
            res.write("<html><head><title>proxy | codeology</title></head><body>");
            res.write("<h1>proxy.codeology.co.nz</h1>");
            res.write("<form method='post' action='/'>");
            res.write("<input type='text' name='uri' width='400'><button>Test Post</button>");
            res.write("</form>");
            res.write("</body></html>");
            res.end();
        });

        app.post( "/", function( req, res ){
            geturi( req.body  ).then(function( json ){
                res.json( json );
            });
        });
    }

start();
        //throng( start, {
        //    workers: WORKERS,
        //    lifetime: Infinity
        //});

