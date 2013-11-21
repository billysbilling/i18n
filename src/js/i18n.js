require('ember-i18n');

var storage = require('storage'),
    i18nContext = require('i18n-context');

var currentLocale,
    mainContext;

module.exports = {
    init: init,
    destroy: destroy,
    locale: locale,
    t: t,
    tProperty: i18nContext.tProperty
};

function init(localesPath) {
    mainContext = i18nContext(null, localesPath);
    locale(storage('locale') || 'en_US');
}

function destroy() {
    mainContext.destroy();
}

function locale(newLocale) {
    if (arguments.length === 1) {
        try {
            loadLocale(newLocale);
            currentLocale = newLocale;
            storage('locale', newLocale);
        } catch (e) {
            if (newLocale !== 'en_US') {
                console.error('Could not load locale `'+newLocale+'`. Falling back to `en_US`. Error stack:');
                console.log(e.stack);
                return locale('en_US');
            } else {
                throw e;
            }
        }
    }
    return currentLocale;
}

function loadLocale(newLocale) {
    var shortLocale = newLocale.substring(0, 2);

    CLDR.defaultLanguage = shortLocale;

    i18nContext.setAllLocales(newLocale);
}

function t(key, context) {
    return mainContext.t(key, context);
}