var i18nContext = require('i18n-context'),
    storage = require('storage'),
    i18n = require('../src/js/i18n');

var componentContext,
    callsA = [],
    callsB = [],
    listenerA = function(locale, shortLocale) { callsA.push([locale, shortLocale]); },
    listenerB = function(locale, shortLocale) { callsB.push([locale, shortLocale]); };

QUnit.module('i18n', {
    setup: function() {
        componentContext = i18nContext('component', require.resolve('./component-locales'));
    },
    teardown: function() {
        i18n.destroy();

        callsA = [];
        callsB = [];

        componentContext.destroy();

        storage.remove('locale');
    }
});

function init() {
    i18n.init(require.resolve('./main-locales'));
}

function assertEnUs() {
    equal(i18n.locale(), 'en_US');
    equal(i18n.t('hi', {name: 'John'}), 'Hi John');

    equal(componentContext.locale(), 'en_US');
    equal(componentContext.t('save'), 'Save');

    equal(storage('locale'), 'en_US');
}

function assertDaDk() {
    equal(i18n.locale(), 'da_DK');
    equal(i18n.t('hi', {name: 'John'}), 'Hej John');

    equal(componentContext.locale(), 'da_DK');
    equal(componentContext.t('save'), 'Gem');

    equal(storage('locale'), 'da_DK');
}

test('init() defaults to en_US', function() {
    init();

    assertEnUs();
});

test('init() uses storage locale', function() {
    storage('locale', 'da_DK');

    init();

    assertDaDk();
});

test('init() falls back to en_US', function() {
    init();

    assertEnUs();
});

test('normalize() converts to da_DK', function() {
    equal(i18n.normalize('da-dk'), 'da_DK');
    equal(i18n.normalize('da-Dk'), 'da_DK');
    equal(i18n.normalize('Da-Dk'), 'da_DK');
    equal(i18n.normalize('da-DK'), 'da_DK');
    equal(i18n.normalize('DA-DK'), 'da_DK');
    equal(i18n.normalize('da_dk'), 'da_DK');
    equal(i18n.normalize('da_Dk'), 'da_DK');
    equal(i18n.normalize('Da_Dk'), 'da_DK');
    equal(i18n.normalize('da_DK'), 'da_DK');
    equal(i18n.normalize('DA_DK'), 'da_DK');
});

test('Set locale', function() {
    init();

    i18n.locale('da_DK');

    assertDaDk();
});

test('Set locale to invalid locale falls back to en_US', function() {
    init();

    i18n.locale('te_ST');

    assertEnUs();
});

test('Listener is only called when locale actually changes', function() {
    i18n.addChangeListener(listenerA);

    init();

    deepEqual(callsA, [['en_US', 'en']]);

    i18n.locale('en_US');
    i18n.locale('en_US');

    deepEqual(callsA, [['en_US', 'en']]);
});

test('Listener is not called with invalid locale', function() {
    init();

    i18n.addChangeListener(listenerA);

    i18n.locale('te_ST');

    deepEqual(callsA, [['en_US', 'en']]);
});

test('Multiple listeners are called', function() {
    i18n.addChangeListener(listenerA);
    i18n.addChangeListener(listenerB);

    init();

    deepEqual(callsA, [['en_US', 'en']]);
    deepEqual(callsB, [['en_US', 'en']]);

    i18n.locale('da_DK');

    deepEqual(callsA, [['en_US', 'en'], ['da_DK', 'da']]);
    deepEqual(callsB, [['en_US', 'en'], ['da_DK', 'da']]);
});

test('Listeners are removed', function() {
    i18n.addChangeListener(listenerA);
    i18n.addChangeListener(listenerB);
    i18n.removeChangeListener(listenerB);

    init();

    deepEqual(callsA, [['en_US', 'en']]);
    deepEqual(callsB, []);

    i18n.removeChangeListener(listenerA);

    i18n.locale('da_DK');

    deepEqual(callsA, [['en_US', 'en']]);
    deepEqual(callsB, []);
});

test('listeners are not fired for invalid locales', function() {
    init();

    i18n.addChangeListener(listenerA);

    i18n.locale('te_ST');

    deepEqual(callsA, [['en_US', 'en']]);
});

test('tProperty comes from i18n-context', function() {
    strictEqual(i18n.tProperty, i18nContext.tProperty);
});