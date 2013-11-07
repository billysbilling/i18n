var i18n = require('../src/js/i18n');

var mod;
    
QUnit.module('t', {
    setup: function() {
        mod = i18n.module('test', require.resolve('./test-locales'));
    },
    teardown: function() {
        
    }
});

test('Replaced multiple html entities', function() {
    equal(mod.t('heey', {name: 'Billy\'s Billing\'s'}), 'Heey Billy\'s Billing\'s');
});