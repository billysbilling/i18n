require('ember-i18n');

var storage = require('storage'),
    i18nContext = require('i18n-context');

var currentLocale = null,
    mainContext = null,
    changeListeners = [];

module.exports = {
    init: init,
    destroy: destroy,
    locale: locale,
    addChangeListener: addChangeListener,
    removeChangeListener: removeChangeListener,
    t: t,
    tProperty: i18nContext.tProperty
};

function init(localesPath) {
    mainContext = i18nContext(null, localesPath);
    locale(storage('locale') || 'en_US');
}

function destroy() {
    if (mainContext) {
        mainContext.destroy();
    }
    mainContext = currentLocale = null;
    changeListeners = [];
    i18nContext.setAllLocales('en_US');
}

function locale(newLocale) {
    if (arguments.length === 1) {
        if (newLocale !== currentLocale) {
            try {
                loadLocale(newLocale);
            } catch (e) {
                if (newLocale !== 'en_US') {
                    console.error('Could not load locale `'+newLocale+'`. Falling back to `en_US`. Error stack:');
                    console.log(e.stack);
                    currentLocale = null;
                    return locale('en_US');
                } else {
                    throw e;
                }
            }
            
            currentLocale = newLocale;
            storage('locale', newLocale);
    
            changeListeners.forEach(function(listener) {
                listener.call(null, newLocale, toShort(newLocale));
            });
        }
    }
    
    return currentLocale;
}

function loadLocale(newLocale) {
    CLDR.defaultLanguage = toShort(newLocale);

    i18nContext.setAllLocales(newLocale);
}

function addChangeListener(listener) {
    changeListeners.push(listener);
}

function removeChangeListener(listener) {
    for (var i = 0; i < changeListeners.length; i++) {
        if (changeListeners[i] === listener) {
            changeListeners.splice(i, 1);
            break;
        }
    }
}

function t(key, context) {
    return mainContext.t(key, context);
}

function toShort(newLocale) {
    return newLocale.substring(0, 2);
}