// RequireJS + CommonJS AMD
// define(function(require, exports, module) {
//      var _ = require('underscore'),
//          Validator;
    
    /**
     *  Simple Validator class, which can do quick one-off validations, or construct more complex multiple-rule validators.
     *  @class
     *  @constructor
     *  @namespace
     *  @name Validator
     *  @example
     *      alert( Validator.unique([1, 2, 3]) ); // true
     *      alert( Validator.unique([1, 2, 1]) ); // false
     *      alert( Validator.minLength([1, 2, 1], 3) ); // true
     *      
     *      myValidatorWillPass.add('unique')
     *      myValidatorWillPass.add('minLength', 3);
     *      myValidatorWillPass.validate( [1, 2, 3] ); // true, unique and long enough
     *      
     *      myValidatorWillFail.add('unique')
     *      myValidatorWillFail.add('minLength', 5);
     *      myValidatorWillFail.validate( [1, 2, 3] ); // false, unique but not long enough
     */
    Validator = function() {
        var myVs = {};
        return {
            errors : [],
            /**
             *  Adds a validation
             *  @name Validator#add
             *  @function
             *  @public
             *  @param {String} v the name of the validation to add
             */
            add: function(v) {
                if ( typeof Validator[v] === 'undefined' ) {
                    throw new Error('unknown validation type: '+v);
                }
                if ( typeof myVs[v] === 'undefined' ) {
                    myVs[v] = [];
                }
                myVs[v].push(Array.prototype.slice.call(arguments, 1));
            },
            /**
             *  Runs the added validations agains the supplied content
             *  @public
             *  @param {String|Object|Array|Boolean|Number} value The value to be validated
             *  @returns Boolean true or false
             *  @type Boolean
             */
            validate: function(value) {
                return _(myVs).all(function(valids, name) {
                    return _(valids).all(function(args) {
                        var allArgs = [];
                        allArgs.push(value);
                        allArgs = allArgs.concat(args);
                        return Validator[name].apply(this, allArgs);
                    });
                });
            }
        };
    };
    
    Validator.unique = function (arr) {
        return ( arr.length === _(arr).unique().length );
    };
    
    Validator.minLength = function (arr, min) {
        return arr.length >= min;
    };
    Validator.maxLength = function (arr, max) {
        return arr.length <= max;
    };
    Validator.lengthInRange = function (arr, min, max) {
        return ( minLength(arr, min) && maxLength(arr, max) );
    };
    Validator.matchesRegex = function (strOrArr, regex) {
        var arr = (typeof strOrArr === 'array') ? strOrArr : [strOrArr];
        return _(arr).all(function(str) {
            return str.match(regex);
        });
    };
    Validator.isEmail = function (strOrArr) {
        throw new Error("email regex not implemented yet");
        //return Validator.matchesRegex(strOrArr, /[^@]+@[a-z-]+\.[a-z\-\.]+/i);
    };
    Validator.isUKPostcode = function (strOrArr) {
        throw new Error("postcode regex not implemented yet");
    };
    
    Validator.htmlHasContent = function (strOrArr) {
        if ( !strOrArr ) return false;
        var arr = (typeof strOrArr !== 'string') ? strOrArr : [strOrArr];
        return _(arr).all(function(str) {
            var div = document.createElement('div'), cleaned, trimmed;
            div.innerHTML = str;
            cleaned = div.innerText();
            trimmed = cleaned.replace(/^\s*/, '').replace(/\s*$/, '');
            return (trimmed.length > 0);
        });
    };
    
// RequireJS + CommonJS AMD
//    exports.Validator = Validator;
//    return Validator;
//});
