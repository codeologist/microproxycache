
    "use strict";

    module.exports = function(grunt) {

        require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

        grunt.initConfig({
            eslint: {
                options: {
                    configFile: 'conf/eslint.json'
                },
                target: ['Gruntfile.js','src/**/*.js']
            },
            mochaTest: {
                all: {
                    options: {
                        reporter: 'spec',
                        captureFile: 'test/test-results.txt', // Optionally capture the reporter output to a file
                        quiet: false,               // Optionally suppress output to standard out (defaults to false)
                        clearRequireCache: true    // Optionally clear the require cache before running tests (defaults to false)
                    },
                    src: ['test/**/*.js']
                }
            }
        });


        grunt.registerTask('lint', ['eslint']);
        grunt.registerTask('test', ['mochaTest']);

    };



