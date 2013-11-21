var i18nContext = require('i18n-context'),
    storage = require('storage'),
    i18n = require('../src/js/i18n');

var componentContext;

QUnit.module('i18n', {
    setup: function() {
        componentContext = i18nContext('component', require.resolve('./component-locales'));
    },
    teardown: function() {
        i18n.destroy();
        componentContext.destroy();
        storage.testTeardown();
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
}

function assertDaDk() {
    equal(i18n.locale(), 'da_DK');
    equal(i18n.t('hi', {name: 'John'}), 'Hej John');

    equal(componentContext.locale(), 'da_DK');
    equal(componentContext.t('save'), 'Gem');
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

test('tProperty comes from i18n-context', function() {
    strictEqual(i18n.tProperty, i18nContext.tProperty);
});