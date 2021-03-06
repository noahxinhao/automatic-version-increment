/*
 * automatic-version-increment
 * https://github.com/noahxinhao/automatic-version-increment
 *
 * Copyright (c) 2014 lxh
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },

        // Configuration to be run (and then tested).
        automatic: {
            js: {
                options: {basicSrc: ["demo/js/"]},
                assetUrl: ['hello.js'],
                files: {
                    'tmp': ['demo/index.html'],
                },
            },
            css: {
                options: {basicSrc: ["demo/css/"]},
                assetUrl: ['hello.css'],
                files: {
                    'tmp': ['demo/index.html'],
                },
            },
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    //grunt.registerTask('test', ['clean', 'cache', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['automatic']);

};
