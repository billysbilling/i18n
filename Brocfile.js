var pickFiles = require('broccoli-static-compiler')
var mergeTrees = require('broccoli-merge-trees')
var billyBuilder = require('broccoli-billy-builder')

var src = pickFiles('src/js', {
    srcDir: '/',
    destDir: '/i18n'
});

var dependencies = 'bower_components';

srcAndDeps = mergeTrees([src, dependencies])

var js = billyBuilder(srcAndDeps, {
    outputFile: 'i18n.js',
    modules: {
        'i18n': {
            include: ['/'],
            main: 'i18n'
        },
        'i18n-context': true,
        'jquery-plugins': true,
        'storage': true
    },
    legacyFiles: [
        'jquery/jquery.js',
        'handlebars/handlebars.js',
        'ember/ember.js',
        'ember-i18n/lib/i18n.js',
        'ember-i18n/lib/i18n-plurals.js'
    ],
    shims: {
        jquery: '$'
    }
})

module.exports = js
