var langFactory = require('lang-factory'),
    tFactory = require('t-factory'),
    tPropertyFactory = require('./t-property-factory');

module.exports = function(moduleName, localesPath) {
    var lang = langFactory(moduleName, localesPath);
    
    lang.t = tFactory(moduleName + '.');
    
    lang.tProperty = tPropertyFactory(moduleName + '.');
    
    lang('en_US');
    
    return lang;
};