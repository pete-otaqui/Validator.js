define(['underscore', 'jquery'], function(_, $) {
    
    var Validator;
    
    Validator = {
        hasContent: function(strOrArr) {
            if ( !strOrArr ) return false;
            var arr = (typeof strOrArr !== 'string') ? strOrArr : [strOrArr];
            return _(arr).all(function(str) {
                var cleaned = $(str).text(), // clean html
                    trimmed = $.trim(cleaned); // trim whitespace
                // test
                return (trimmed.length > 0);
            });
        },
        unique: function(arr) {
            return ( arr.length === _(arr).unique().length );
        },
        minLength: function(arr, min) {
            return arr.length >= min;
        },
        maxLength: function(arr, max) {
            return arr.length <= min;
        },
        lengthInRange: function(arr, min, max) {
            return ( Validator.minLength(arr, min) && Validator.maxLength(arr, max) );
        }
    };
    
    return Validator;
    
});
