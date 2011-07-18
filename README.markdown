Validator.js
============

A simple validation module, for use server- or client-side.

Quick Usage
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
    