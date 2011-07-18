// RequireJS + CommonJS AMD
// define(function(require, exports, module) {
//      var _ = require('underscore'),
//          Validator;
    
    /**
     *  Simple Validator class.
     *  @class
     *  @constructor
     *  @name Validator
     *  @example
     *      myValidator = new Validator();
     *      myValidator.add('unique')
     *      myValidator.add('minLength', 10);
     *      myValidator.validate( someValue );
     */
    Validator = function() {
        var myVs = {};
        return {
            errors : [],
            add: function(v) {
                if ( typeof Validator[v] === 'undefined' ) {
                    throw new Error('unknown validation type: '+v);
                }
                if ( typeof myVs[v] === 'undefined' ) {
                    myVs[v] = [];
                }
                myVs[v].push(arguments.slice(1));
            },
            validate: function() {
                return _(myVs).all(function(valids, name) {
                    return _(valids).all(function(args) {
                        return Validator[name](args);
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
        return arr.length <= min;
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
