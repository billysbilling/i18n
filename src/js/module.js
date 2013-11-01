var langFactory = require('./lang-factory'),
    tFactory = require('./t-factory'),
    tProperty = require('./t-property');

module.exports = function(moduleName, localesPath) {
    var lang = langFactory(moduleName, localesPath);
    
    lang.t = tFactory(moduleName + '.');
    
    lang.tProperty = tProperty;
    
    lang('en_US');
    
    return lang;
};