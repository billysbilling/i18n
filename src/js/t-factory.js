var unescape = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#x27;": "'",
    "&#x60;": "`"
};

module.exports = function(prefix) {
    return function(key, context) {
        var s = Ember.I18n.t(prefix+key, context);
        for (var html in unescape) {
            if (!unescape.hasOwnProperty(html)) continue;
            s = s.replace(html, unescape[html]);
        }
        return s;
    }
};