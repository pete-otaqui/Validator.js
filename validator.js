// RequireJS + CommonJS AMD
// define(function(require, exports, module) {
//      var _ = require('underscore'),
//          Validator;
    
    /**
     *  Simple Validator class, which can do quick one-off validations, or construct more complex multiple-rule validators.
     *  @name Validator
     *  @class
     *  @constructor
     *  @namespace
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
             *  @name Validator#validate
             *  @function
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
    
    /**
     *  Returns true if an array only contains unique members, false otherwise.
     *  @function
     *  @name Validator.unique
     *  
     *  @param {Array} arr The array to test
     *  @return {Boolean} True if all items are unique, false otherwise.
     */
    Validator.unique = function (arr) {
        return ( arr.length === _(arr).unique().length );
    };
    /**
     *  Returns true if an array is greater than or equal to a given length
     *  @function
     *  @name Validator.minLength
     *  
     *  @param {Array} arr The array to test
     *  @param {Number} min The minimum length
     *  @return {Boolean} True if the array is long enough, false otherwise.
     */
    Validator.minLength = function (arr, min) {
        return arr.length >= min;
    };
    /**
     *  Returns true if an array is less than or equal to a given length
     *  @function
     *  @name Validator.maxLength
     *  
     *  @param {Array} arr The array to test
     *  @param {Number} min The maximum length
     *  @return {Boolean} True if the array is short enough, false otherwise.
     */
    Validator.maxLength = function (arr, max) {
        return arr.length <= max;
    };
    /**
     *  Returns true if an array is within a size range, inclusive.
     *  @function
     *  @name Validator.lengthInRange
     *  
     *  @param {Array} arr The array to test
     *  @param {Number} min The minimum length
     *  @param {Number} max The maximum length
     *  @return {Boolean} True if the array is neither too long nor too short, false otherwise.
     */
    Validator.lengthInRange = function (arr, min, max) {
        return ( minLength(arr, min) && maxLength(arr, max) );
    };
    /**
     *  Returns true if the argument matches a regular expression
     *  @function
     *  @name Validator.matchesRegex
     *  
     *  @param {String|String[]} strOrArr The string or array of strings to test
     *  @param {RegExp} regex The regular expression to use for the test
     *  @return {Boolean} True if all the strings match the regex
     */
    Validator.matchesRegex = function (strOrArr, regex) {
        var arr = (typeof strOrArr === 'array') ? strOrArr : [strOrArr];
        return _(arr).all(function(str) {
            return str.match(regex);
        });
    };
    /**
     *  Very loose regex to match valid emails - generally prefers false positives to false negatives
     *  @function
     *  @name Validator.isEmail
     *  
     *  @param {String|String[]} strOrArr The string or array of strings to test
     *  @return {Boolean} True if all the strings are valid emails
     */
    Validator.isEmail = function (strOrArr) {
        return Validator.matchesRegex(strOrArr, /[^@]+@[a-z-]+\.[a-z\-\.]+[^\.]/i);
    };
    /**
     *  Very loose regex to match valid emails - generally prefers false positives to false negatives
     *  @function
     *  @name Validator.isUKPostcode
     *  
     *  @param {String|String[]} strOrArr The string or array of strings to test
     *  @return {Boolean} True if all the strings are valid postcodes
     */
    Validator.isUKPostcode = function (strOrArr) {
        throw new Error("postcode regex not implemented yet");
    };
    /**
     *  Returns true if an html fragment has any textual or image content (i.e. isn't just empty <span> tags)
     *  @function
     *  @name Validator.htmlHasContent
     *  
     *  @param {String|String[]} strOrArr The string or array of strings to test
     *  @return {Boolean} True if there is some text content or an image, false otherwise.
     */
    Validator.htmlHasContent = function (strOrArr) {
        var arr = (typeof strOrArr !== 'string') ? strOrArr : [strOrArr],
            isBrowser = (window && document && document.createElement),
            div;
        if ( !strOrArr ) return false;
        if  ( !isBrowser ) {
            throw new Error('Html support only available in a browser!');
        }
        div = document.createElement('div');
        return _(arr).all(function(str) {
            var cleaned, trimmed;
            str = Validator.trim(str);
            if ( str.length === 0 ) return false;
            div.innerHTML = str;
            cleaned = div.innerText || div.textContent;
            trimmed = Validator.trim(cleaned);
            return (trimmed.length > 0);
        });
    };
    /**
     *  Utility function to trim strings
     *  @function
     *  @name Validator.trim
     *  
     *  @param {String} str The string to trim
     *  @return {String} The trimmed string
     */
    Validator.trim = function(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };
    
// RequireJS + CommonJS AMD
//    exports.Validator = Validator;
//    return Validator;
//});
