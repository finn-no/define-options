define-options
==============

Micro lib to define valid properties for an options litteral, and return a function that can validate the options.

The main benefit is self-documenting code. Users of your library doesn't have to scan through the code to see what
properties from the options object that is used throughout the code. As a bonus you can easily throw an error early
if a consumer is using an option with the wrong type, or a required option is missing.

# API

    var defineOpts   = require('define-opts');
    var validateOpts = defineOpts({
            optionalParam   : '?',
            optionalString  : '?|string',
            aString         : 'string',
            aNumber         : 'number',
            aNumberOrString : 'number|string',
            aStringArray    : 'string[]',
            aNumberArray    : 'number[]',
            anObject        : 'object',
            aFunction       : 'function',
            aBboolean       : 'boolean'
        });

    function yourAPI(options) {
      validateOpts(options); // throws an error if options doesn't validate

      // do your stuff
    }

# Optional options object
If all options are optional, the null will not throw an error.

    var validateOpts = defineOpts({ foo: '?|string' });
    validateOpts();               //all OK
    validateOpts({foo: 'bar'});   // all OK
    validateOpts({foo: 123});     // Exception: foo has to be of type ?|string but was number

# Valid types

    'array', 'boolean', 'function', 'number', 'object', 'string'

# Arrays with type
Just add [] after the type

    'array[]', 'boolean[]', 'function[]', 'number[]', 'object[]', 'string[]'
