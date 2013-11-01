require('ember-i18n');

var mod = require('./module');

module.exports = mod('default', 'src/locales');

module.exports.module = mod;