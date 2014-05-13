define-options
==============

Micro lib to define valid properties for an options litteral, and return a function that can validate the options.

The main benefit is self-documenting code. Users of your library doesn't have to scan through the code to see what
properties from the options object that is used throughout the code. As a bonus you can easily throw an error early
if a consumer is using an option with the wrong type, or a required option is missing. They will get a hint from the
error message what they did wrong instead of searching for docs.

# API

    var defineOpts   = require('define-options');
    var validateOpts = defineOpts({
            optionalParam   : '*             - This parameter can be null, undefined or any value',
            optionalString  : '?|string      - This is an optional string',
            aString         : 'string        - Required string. Can be blank.',
            aNumber         : 'number        - Required number. Can be 0.',
            aNumberOrString : 'number|string - Required number or string',
            aStringArray    : 'array         - Required array of any types',
            aStringArray    : 'string[]      - Required array with strings',
            aNumberArray    : 'number[]      - Required array with numbers',
            anObject        : 'object        - Required object',
            aFunction       : 'function      - Required function',
            aBboolean       : 'boolean       - Required boolean'
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

# Releasing

    npm run build
    git add dist/
    git commit -m "Updated dist files"
    npm version [<newversion> | major | minor | patch]
    git push --follow-tags origin master
    npm publish
