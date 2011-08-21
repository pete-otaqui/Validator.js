/*
This work is copyrighted by Pete Otaqui, http://otaqui.com, under the MIT License
*/

var Validator = function() {};

(function() {
    
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
             *  @return {Object} an object containing a "message()" method, which accepts a custom error message
             *  @example
             *      var v = new Validator();
             *      v.add('minLength', 5); // create a validator that will check for minLength of 5
             *      v.validate( myArray ); // returns true / false
             *      console.dir(v.errors); // list of error messages, either the default or custom ones
             */
            add: function(v) {
                var validator = this,
                    validation, message, messenger;
                if ( typeof Validator[v] === 'undefined' ) {
                    throw new Error('unknown validation type: '+v);
                }
                if ( typeof myVs[v] === 'undefined' ) {
                    myVs[v] = [];
                }
                validation = Array.prototype.slice.call(arguments, 1);
                myVs[v].push(validation);
                messenger = {
                    message: function(msg) {
                        validation.message = msg;
                        return messenger;
                    },
                    add: function() {
                        return validator.add.apply(validator, arguments);
                    }
                };
                return messenger;
            },
            /**
             *  Runs the added validations against the supplied content
             *  @name Validator#validate
             *  @function
             *  @public
             *  @param {String|Object|Array|Boolean|Number} value The value to be validated
             *  @returns Boolean true or false
             *  @type Boolean
             *  @example
             *      var v = new Validator();
             *      v.add('minLength', 5);
             *      v.add('maxLength', 10).message('It can only be 10 long!');
             *      v.validate( myArray ); // returns true / false
             *      console.dir(v.errors); // after v.validate() this contains an array of error messages
             */
            validate: function(value) {
                var validator = this,
                    allArgs,
                    response,
                    message,
                    passed = true;
                this.errors = [];
                _(myVs).each(function(valids, name) {
                    var passedOne = _(valids).all(function(args) {
                        allArgs = [];
                        allArgs.push(value);
                        allArgs = allArgs.concat(args);
                        response = Validator[name].apply(this, allArgs);
                        if ( response === false ) {
                            message = (args.message) ? args.message : Validator.getErrorMessage(name);
                            validator.errors.push(message);
                        }
                        return response;
                    });
                    if ( !passedOne ) passed = false;
                    return passedOne;
                });
                return passed;
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
     *  Matches UK Postcodes according to BS 7666 and 
     *  @function
     *  @name Validator.isUKPostcode
     *  
     *  @param {String|String[]} strOrArr The string or array of strings to test
     *  @return {Boolean} True if all the strings are valid postcodes
     */
    Validator.isUKPostcode = function (strOrArr) {
        // "A9 9AA", "A99 9AA", "A9A 9AA", "AA9 9AA", "AA99 9AA" or "AA9A 9AA"
        // "BFPO NNNN", "BFPO c/o NNNN"
            var nrml = /^[A-Z]{1,2}[0-9R][0-9A-Z]? *[0-9][ABD-HJLNP-UW-Z]{2}$/,
            bfpo = /^BFPO *(c\/o)? *\d{4}$/,
            arr = (typeof strOrArr === 'array') ? strOrArr : [strOrArr];
        return _(arr).all(function(str) {
            str = Validator.trim(str);
            return ( Validator.matchesRegex(str, nrml) || Validator.matchesRegex(str, bfpo) );
        });
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
     * Proxies to Object.hasOwnProperty
     * @function
     * @name Validator.hasProperty
     *
     * @param {Object} obj
     * @return {Boolean}
     */
    Validator.hasProperty = function(obj) {
        return obj.hasOwnProperty(obj);
    };

    // Validations yet to be added (some ideas from http://dojotoolkit.org/api/1.6/dojox/validate )
    /*
    isIpAddress
    isUrl
    isNumberFormat ... (###) #### ###-###
    isCreditCardNumber
    isIsbn
    isInteger
    isNumber
    isFunction
    isObject
    isString
    isRegex
    instanceOf
    isFileType ... 'some/path/or/file.jpg' isFileType(['jpg','png'])
    */

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

    Validator.messages = {
        en: {
            unique          : 'The list must be made up of unique items',
            minLength       : 'The list is not long enough',
            maxLength       : 'The list is too long',
            lengthInRange   : 'The list is not within the length range',
            matchesRegex    : 'The content is not well formed',
            isEmail         : 'Must be a valid email address',
            isUKPostcode    : 'Must be a valid postcode',
            htmlHasContent  : 'Must not be empty',
            hasProperty     : 'The object is missing a property'
        }
    }

    Validator.lang = 'en';
    Validator.defaultLang = 'en';

    Validator.getErrorMessage = function(name) {
        var message;
        if ( Validator.messages[Validator.lang] && Validator.messages[Validator.lang][name] ) {
            message = Validator.messages[Validator.lang][name];
        } else if ( Validator.messages[Validator.defaultLang] && Validator.messages[Validator.defaultLang][name]) {
            message = Validator.messages[Validator.defaultLang][name];
        }
        return message;
    }

})();
    
// RequireJS + CommonJS AMD
//    exports.Validator = Validator;
//    return Validator;
//});
