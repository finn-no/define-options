var validateFactory = require('./index.js');

describe('validate', function () {

    function expectValidate (def, opts) {
        var validate = validateFactory(def);
        return expect(function () {
            validate(opts);
        });
    }

    it('should take an options litteral and return a function', function () {
        var validate = validateFactory({});
        expect(validate).to.be.a('function');
    });

    it('should throw if a required options object is missing', function () {
        expectValidate({'test':'string'}, null).to.throw('test is required');
    });

    it('should not throw if a required options object exists', function () {
        expectValidate({'test': 'string'}, {test: 'string'}).not.to.throw();
    });

    it('should not throw if all options as optional and the object is null', function () {
        expectValidate({'test': '?|string'}, null).not.to.throw();
    })

    it('should not throw if an optional value without specified type exists', function () {
        expectValidate({'test': '*'}, {'test': 'foo'}).not.to.throw();
    });

    it('should throw when definition has an unknown type', function () {
        expect(function () {
            validateFactory({'foo': 'bar'});
        }).to.throw('Invalid type: \'bar\'');
    });

    it('should add docstring to error message when it exists', function () {
        expectValidate({'test': 'string - This is a test string'}, null).to.throw('DOC: This is a test string');
        expectValidate({'test': 'string   -   This is a test string'}, null).to.throw('DOC: This is a test string');
    });

    it('should validate number type', function () {
        var def = {'test': 'number'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, { test: 123 }).not.to.throw();
        expectValidate(def, { test: 1.23 }).not.to.throw();
        expectValidate(def, { test: 0 }).not.to.throw();
        expectValidate(def, { test: new Number(1) }).not.to.throw();
        expectValidate(def, { test: NaN }).to.throw(TypeError, 'has to be of type number');
    });

    it('should validate array type', function () {
        var def = {'test': 'array'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, {test: 'str'}).to.throw('has to be of type array');
        expectValidate(def, {test: []}).not.to.throw();

        def = {'test': 'string[]'};
        expectValidate(def, {test: [123, 456]}).to.throw('has to be of type string[]');
        expectValidate(def, {test: ['abc']}).not.to.throw();
    });

    it('should validate string type', function () {
        var def = {'test': 'string'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, { test: 'yo' }).not.to.throw();
        expectValidate(def, { test: new String('yo') }).not.to.throw();
        expectValidate(def, { test: '' }).not.to.throw();
        expectValidate(def, { test: 123 }).to.throw(TypeError, 'has to be of type string');
    });

    it('should validate function type', function () {
        var def = {'test': 'function'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, { test: 'foo' }).to.throw(TypeError, 'has to be of type function');
        expectValidate(def, { test: function () {} }).not.to.throw();
        expectValidate(def, { test: new Function('') }).not.to.throw();
    });

    it('should validate boolean type', function () {
        var def = {'test': 'boolean'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, { test: 'true' }).to.throw(TypeError, 'has to be of type boolean');
        expectValidate(def, { test: true }).not.to.throw();
        expectValidate(def, { test: new Boolean(true) }).not.to.throw();
    });

    it('should validate object type', function () {
        var def = {'obj': 'object'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, { obj: {} }).not.to.throw();
        expectValidate(def, { obj: 1 }).to.throw(TypeError, 'has to be of type object');
    });

    it('should allow multiple types', function () {
        var def = {'test': 'string|number'};
        expectValidate(def, {}).to.throw('is required');
        expectValidate(def, { test: 123 }).not.to.throw();
        expectValidate(def, { test: '123' }).not.to.throw();
        expectValidate(def, { test: true }).to.throw(TypeError, 'has to be of type string|number');
    });

    it('should allow multiple types for arrays', function () {
        var def = {'test': 'string[]|number[]'};
        expectValidate(def, { test: ['abc'] }).not.to.throw();
        expectValidate(def, { test: [123] }).not.to.throw();
        expectValidate(def, { test: ['abc', 123] }).to.throw();
    });

    it('should not throw if an optional value is missing', function () {
        var def = {'test': '?|string'};
        expectValidate(def, {}).not.to.throw();
        expectValidate(def, {test: 'foo'}).not.to.throw();
        expectValidate(def, {test: 123}).to.throw('has to be of type ?|string');
    });
});
