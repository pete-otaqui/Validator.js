Validator.js
============

A simple validation module, for use server- or client-side.  It depends on underscore, from documentcloud.

Simple Usage
-----------
You can use Validator to quickly check a string (or in most cases an array) like so:

    var myString = 'some string here';
    console.log(Validator.matchesRegex(myString, /here/)); // true

Complex Construction
--------------------
Alternatively you can construct a more complex set of rules, like so:

    var myString = 'some string here',
        validator1 = new Validator(),
        validator2 = new Validator();
    validator1.add('matchesRegex', /here/);
    validator1.add('minLength', 5);
    validator2.add('matchesRegex', /here/);
    validator2.add('minLength', 100);
    console.log(validator1.validate(myString)); // true
    console.log(validator2.validate(myString)); // false, string matches regex, but isn't long enough

Supported Validations
---------------------
You can use any of these in either the simple or complex forms.

### Validator.unique(Array)

Checks whether an array contains only unique elements

### Validator.minLength(strOrArray, len)

Checks whether a string (or an array) is of at least a given length (inclusive)

### Validator.maxLength(strOrArray, len)

Checks whether a string (or an array) is of at most a given length (inclusive)

### Validator.lengthInRange(strOrArray, minLen, maxLen)

Checks whether a string (or an array) is within a given length (inclusive)

### Validator.matchesRegex(strOrArray, regex)

Checks whether a string (or array of strings) matches a regular expression

### Validator.isEmail(strOrArray)

Loose (i.e. overly permissive, rather than overly strict) check on whether a string (or array of strings) is a valid email address

### Validator.htmlHasContent(html)

Checks whether an HTML snippet actually has any textual content, once tags are stripped and whitespace is trimmed