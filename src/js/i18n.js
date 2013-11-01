require('ember-i18n');

var mod = require('./module');

module.exports = mod(null, 'src/locales');

module.exports.module = mod;