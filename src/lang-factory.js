var langs = {};

module.exports = function(moduleName, localesPath) {
    if (langs[moduleName]) {
        return langs[moduleName];
    }
    
    var lang = (function() {
        var currentLocale;
        
        var customLocaleData = {};
        
        return function(newLocale, data) {
            if (arguments.length === 0) {
                //Getter
                return currentLocale;
            } else if (arguments.length === 1) {
                //Setter
                currentLocale = newLocale;
                Ember.I18n.translations[moduleName] = customLocaleData[newLocale] || require(localesPath + '/' + currentLocale);
            } else if (arguments.length === 2) {
                //Register custom locale
                customLocaleData[newLocale] = data;
            }
        };
    })();
    
    langs[moduleName] = lang;
    
    return lang;
};