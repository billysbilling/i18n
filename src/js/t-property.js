var t = require('./t-factory')('');

module.exports = function(dependentKey, defaultValue) {
    return Ember.computed(dependentKey+'T', function() {
        var key = this.get(dependentKey+'T');
        if (key) {
            return t(key);
        } else if (defaultValue) {
            if (typeof defaultValue === 'function') {
                return defaultValue.call(this);
            } else {
                return defaultValue;
            }
        }
        return null;
    });
};