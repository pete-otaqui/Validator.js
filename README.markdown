Validator.js
============

A simple validation module, for use server- or client-side.  It depends on ES5 functionality, so in old browsers you might need something like ES5 Shim

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

Error Messages
---------------------
Validator.js provides error messages as an array when using the complex construction method.

    var myString = 'some string here',
        validator = new Validator();
    validator.add('matchesRegex', /there/);
    validator.validate(myString); // returns false, because the string doesn't match
    console.log(validator.errors); // contains an array of default error messages.

### Custom Error Messages
You can specify a custom error message per validation by chainging a call to message() after add():

    var myString = 'some string here',
        validator = new Validator();
    validator.add('matchesRegex', /there/).message('You should be over there!');
    validator.validate(myString); // returns false, because the string doesn't match
    console.log(validator.errors); // returns ['You should be over there!']

### Setting default error messages, and translating

You can add and override Validator's default error messages, and add new languages and set the default language simply
by setting some properties on the Validator object.  Validator will use messages specified in "lang" if available, and
fallback to "defaultLang" (which is "en" unless overridden) if needed.

    Validator.lang = 'XY'; // set "XY" as the current language
    Validator.messages.XY = {
      unique: 'XXXYYY',
      maxLength: 'XXXXXXXX'
    }
    var validator = new Validator();
    validator.add('unique');
    validator.add('minLength', 5);
    validator.add('maxLength', 10);
    validator.validate([1, 2, 3]);
    console.log( validator.errors ); // returns ['XXXYYY', 'The list is not long enough'];

Chaining
--------
You can chain calls to add() and message().  The argument supplied to message() will only apply to the validation in the
single preceding call to add().

    var myString = 'some string here',
        validator = new Validator();
    validator
        .add('matchesRegex', /there/).message('You should be over there!')
        .add('matchesRegex', /some/).message('Some is better than none')
        .add('minLength', 100).message('Not long enough');
    validator.validate(myString); // returns false, because the string doesn't match
    console.log(validator.errors); // returns ['You should be over there!', 'Not long enough']

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

### Validator.hasProperty(object)

Proxies to Object.hasOwnProperty
