(function (root, factory) {

  if (typeof define === 'function' && define.amd) {

    // AMD. Register as an anonymous module.
    define( factory );

  } else if (typeof exports === 'object') {

    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();

  } else {

    // Browser globals
    root.define_options = factory();

  }

}( this, function () {


  var is = {
    'array'    : function (a) { return Array.isArray(a); },
    'boolean'  : function (b) { return typeof b == 'boolean' || b instanceof Boolean; },
    'function' : function (f) { return typeof f == 'function'; },
    'number'   : function (n) { return !isNaN(n) && (typeof n == 'number' || n instanceof Number); },
    'object'   : function (o) { return typeof o == 'object'; },
    'string'   : function (s) { return typeof s == 'string' || s instanceof String; },
    '?'        : function (v) { return v == null; },
    '*'        : function () { return true; }
  };
  var rArrayWithType = /[a-z]+\[\]$/;
  var rDocString = /\s*-\s*/;

  var define_options = function (def, required) {

      Object.keys(def).forEach(function (key) {
          var type = def[key].split(rDocString)[0];
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
              var typeDef = def[key].split(rDocString);
              validateType(key, opts[key], typeDef[0], typeDef[1]);
          }

          function validateType (key, value, shouldBe, docString) {
              docString = (docString ? '. DOC: ' + docString : '');
              var correctType = shouldBe.split('|').some(function (type) {
                  if (rArrayWithType.test(type)) {
                      type = type.replace('[]','');
                      return is.array(value) && value.every(function (v) { return is[type](v); });
                  }
                  return is[type](value);
              });
              if (correctType) { return; }
              if (value == null) {
                  throw new TypeError(key + ' is required. Valid types: ' + shouldBe + docString);
              }
              throw new TypeError(key + ' has to be of type ' + shouldBe + ' but was ' + typeof value + docString);
          }
      };
  };

  return define_options;

}));

