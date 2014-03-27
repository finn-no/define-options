var is = {
    'array'    : function (a) { return Array.isArray(a); },
    'boolean'  : function (b) { return typeof b == 'boolean' || b instanceof Boolean; },
    'function' : function (f) { return typeof f == 'function'; },
    'number'   : function (n) { return !isNaN(n) && (typeof n == 'number' || n instanceof Number); },
    'object'   : function (o) { return typeof o == 'object'; },
    'string'   : function (s) { return typeof s == 'string' || s instanceof String; },
    '?'        : function (v) { return v == null; }
};
var rArrayWithType = /[a-z]+\[\]$/;

module.exports = function (def, required) {
    Object.keys(def).forEach(function (key) {
        var type = def[key];
        type.split('|').forEach(function (type) {
            if (!(type.replace('[]','') in is)) {
                throw new Error('Invalid type: \'' + type + '\'');
            }
        });
    });

    return function validateOpts (opts) {
        var keys = Object.keys(def);
        opts = opts || {};
        keys.forEach(validateKey);


        function validateKey (key) {
            validateType(key, opts[key], def[key]);
        }

        function validateType (key, value, shouldBe) {
            var correctType = shouldBe.split('|').some(function (type) {
                if (rArrayWithType.test(type)) {
                    type = type.replace('[]','');
                    return is.array(value) && value.every(function (v) { return is[type](v); });
                }
                return is[type](value);
            });
            if (correctType) { return; }
            if (value == null) {
                throw new TypeError(key + ' is required. Valid types: ' + shouldBe);
            }
            throw new TypeError(key + ' has to be of type ' + shouldBe + ' but was ' + typeof value);
        }
    };
};
