require('ember-i18n');

var storage = require('storage'),
    i18nContext = require('i18n-context');

var currentLocale = null,
    mainContext = null,
    changeListeners = [];

var langToLocale = {
    'en': 'en_US',
    'da': 'da_DK'
};

module.exports = {
    init: init,
    normalize: normalize,
    destroy: destroy,
    locale: locale,
    localeIsAssumed: localeIsAssumed,
    addChangeListener: addChangeListener,
    removeChangeListener: removeChangeListener,
    t: t,
    tProperty: i18nContext.tProperty
};

function init(localesPath) {
    mainContext = i18nContext(null, localesPath);
    var userLocale = storage('locale') || storage('assumedLocale') || window.navigator.language || window.navigator.userLanguage || 'en_US';
    userLocale = normalize(userLocale);
    //Resolve lang -> locale
    if (langToLocale[userLocale]) {
        userLocale = langToLocale[userLocale];
    }
    locale(userLocale, !storage('locale'));
}

function normalize(locale) {
    if (locale.match(/-|_/)) {
        // Turn stuff like da-dk/da-DK/da_dk into da_DK
        var parts = locale.split(/-|_/);
        locale = parts[0].toLowerCase() + '_' + parts[1].toUpperCase();
    } else {
        // Just lowercase for two-character codes
        locale = locale.toLowerCase();
    }
    return locale;
}

function destroy() {
    if (mainContext) {
        mainContext.destroy();
    }
    mainContext = currentLocale = null;
    changeListeners = [];
    i18nContext.setAllLocales('en_US');
}

function locale(newLocale, isAssumed) {
    if (arguments.length >= 1) {
        if (newLocale !== currentLocale) {
            try {
                loadLocale(newLocale);
            } catch (e) {
                if (newLocale !== 'en_US') {
                    console.error('Could not load locale `'+newLocale+'`. Falling back to `en_US`. Error stack:');
                    console.log(e.stack);
                    currentLocale = null;
                    return locale('en_US', true);
                } else {
                    throw e;
                }
            }

            currentLocale = newLocale;
            if (isAssumed) {
                storage('assumedLocale', newLocale);
            } else {
                storage('locale', newLocale);
            }

            changeListeners.forEach(function(listener) {
                listener.call(null, newLocale, toShort(newLocale));
            });
        }
    }

    return currentLocale;
}

function localeIsAssumed() {
    return storage('assumedLocale') && !storage('locale');
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