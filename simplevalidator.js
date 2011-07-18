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
             *  Adds a validation, supply the name as the first argument and all subsequent arguments will be passed on
             *  @name Validator#add
             *  @function
             *  @public
             *  @param {String} v the name of the validation to add
             *  @example
             *      var v = new Validator();
             *      v.add('minLength', 5); // create a validator that will check for minLength of 5
             *      v.validate( myArray ); // returns true / false
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
             *  @example
             *      var v = new Validator();
             *      v.add('minLength', 5); 
             *      v.validate( myArray ); // returns true / false
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
        return Validator.matchesRegex(strOrArr, /[^@]+@[a-z-]+\.[a-z\-\.]+[^\.]/i);
    };
    Validator.isUKPostcode = function (strOrArr) {
        throw new Error("postcode regex not implemented yet");
    };
    
    Validator.htmlHasContent = function (strOrArr) {
        if ( !strOrArr ) return false;
        var arr = (typeof strOrArr !== 'string') ? strOrArr : [strOrArr],
            isBrowser = (window && document && document.createElement);
        return _(arr).all(function(str) {
            var div, cleaned, trimmed, firstLessThan;
            str = Validator.trim(str);
            if ( str.length === 0 ) return false;
            if ( isBrowser ) {
                div = document.createElement('div');
                div.innerHTML = str;
                // should actually be doing the "is this a valid browser" check here ...
                cleaned = div.innerText || div.textContent;
                trimmed = Validator.trim(cleaned);
                return (trimmed.length > 0);
            } else {
                throw new Error('Html support only available in a browser!');
                // not a browser ... do some crappy nonsense until I have a better idea
                firstLessThan = str.indexOf('<');
                if ( firstLessThan === -1 || firstLessThan > 0 ) {
                    return true;
                } else {
                    return str.match('>\s*[^<\s]');
                }
            }
        });
    };
    
    Validator.trim = function(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };
    
// RequireJS + CommonJS AMD
//    exports.Validator = Validator;
//    return Validator;
//});
