var _ = require('lodash');

var defaultLang,
    langs = {};

module.exports = function(moduleName, localesPath) {
    if (moduleName === null && defaultLang) {
        return defaultLang;
    } else if (langs[moduleName]) {
        return langs[moduleName];
    }
    
    var lang = (function() {
        var currentLocale;
        
        var customTranslations = {};
        
        return function(newLocale, data) {
            if (arguments.length === 0) {
                //Getter
                return currentLocale;
            } else if (arguments.length === 1) {
                //Setter
                currentLocale = newLocale;
                var translations = customTranslations[newLocale] || requireTranslations(localesPath, currentLocale, moduleName === null);
                if (moduleName === null) {
                    _.extend(Ember.I18n.translations, translations);
                } else {
                    Ember.I18n.translations[moduleName] = translations;
                }
            } else if (arguments.length === 2) {
                //Register custom locale
                customTranslations[newLocale] = data;
            }
        };
    })();
    
    if (moduleName === null) {
        defaultLang = lang;
    } else {
        langs[moduleName] = lang;
    }
    
    return lang;
};

function requireTranslations(localesPath, locale, ignoreNonExisting) {
    try {
        return require(localesPath + '/' + locale)
    } catch (e) {
        if (ignoreNonExisting) {
            return {};
        } else {
            throw e;
        }
    }
}