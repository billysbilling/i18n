var langFactory = require('./lang-factory'),
    tFactory = require('./t-factory'),
    tProperty = require('./t-property');

module.exports = function(moduleName, localesPath) {
    var m = {
        lang: langFactory(moduleName, localesPath),
        t: tFactory(moduleName+'.'),
        tProperty: tProperty
    };
    
    m.lang('en_US');
    
    return m;
};