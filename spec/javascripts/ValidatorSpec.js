describe("Validator", function() {

  beforeEach(function() {
    // player = new Player();
  });

  it("should be able to perform quick validations", function() {
      expect(Validator.unique([1, 2, 3])).toBe(true);
      expect(Validator.unique([1, 2, 1])).toBe(false);
  });
  
  it("should be able to construct complex validators", function() {
      var validator = new Validator();
      validator.add('unique');
      validator.add('minLength', 1);
      validator.add('maxLength', 5);
      expect(validator.validate([1, 2, 3])).toBe(true, 'Unique');
      expect(validator.validate([1, 2, 1])).toBe(false, 'Not unique');
      expect(validator.validate([1, 2, 3, 4, 5])).toBe(true, 'Max length');
      expect(validator.validate([1, 2, 3, 4, 5, 6])).toBe(false, 'Greater than max length');
  });
  
  it("should be able to validate that html has some text content", function() {
      expect(Validator.htmlHasContent('<p>Foo</p>')).toBe(true);
      expect(Validator.htmlHasContent('<p><span><br/><br/></span></p>')).toBe(false);
  });
  
  it("should be able to match a regular expression in a simple way", function() {
      expect(Validator.matchesRegex('barfoobar', /foo/)).toBe(true);
      expect(Validator.matchesRegex('barbazbar', /foo/)).toBe(false);
  });
  
  it("should be able to match a regular expression in a complex way", function() {
      var validator = new Validator();
      validator.add('matchesRegex', /foo/);
      expect(validator.validate('barfoobar')).toBe(true);
      expect(validator.validate('barbazbar')).toBe(false);
  });
  
  it("should validate normal uk postcodes", function() {
      expect(Validator.isUKPostcode('EC1V 3RP')).toBe(true);
      expect(Validator.isUKPostcode('EC1V 3RPP')).toBe(false);
  });
  
  it("should validate BFPO postcodes", function() {
      expect(Validator.isUKPostcode('BFPO 1234')).toBe(true);
      expect(Validator.isUKPostcode('BFPO c/o 1234')).toBe(true);
      expect(Validator.isUKPostcode('BFPO 12345')).toBe(false);
      expect(Validator.isUKPostcode('BFPO c/o 12345')).toBe(false);
  });
  
  it("should be relaxed about whitespace in postcodes", function() {
      expect(Validator.isUKPostcode('BFPO1234')).toBe(true);
      expect(Validator.isUKPostcode('  BFPO   c/o   1234  ')).toBe(true);
      expect(Validator.isUKPostcode('  BFPOc/o1234  ')).toBe(true);
      expect(Validator.isUKPostcode('EC1V3RP')).toBe(true);
      expect(Validator.isUKPostcode('  EC1V   3RP  ')).toBe(true);
  });

  it("should give a set of error messages", function() {
      var validator = new Validator();
      validator.add('unique');
      validator.add('minLength', 1);
      validator.add('maxLength', 5);
      validator.validate([1, 2, 1, 3, 5, 6, 9]); // not unique
      expect(validator.errors).toEqual(
          ['The list must be made up of unique items', 'The list is too long'],
          'The correct list of validation failure messages is set'
      );
  });

    it("should be able to specify individual error message per validation", function() {
        var validator = new Validator();
        validator.add('minLength', 3).message('Foo bar baz');
        validator.add('unique').message('Bee bop');
        validator.validate([1, 1]);
        expect(validator.errors).toEqual(
            ['Foo bar baz', 'Bee bop']
        );
    });

    it("Should support chained calls to add()", function() {
        var validator = new Validator();
        validator
            .add('minLength', 3)
            .add('maxLength', 10)
            .add('unique')
        validator.validate([1, 1]);
      expect(validator.errors).toEqual(
          ['The list is not long enough', 'The list must be made up of unique items'],
          'The correct list of validation failure messages is set'
      );
    });

    it("Should support chained calls to add() and message()", function() {
        var validator = new Validator();
        validator
            .add('minLength', 3).message('too titchy')
            .add('maxLength', 10)
            .add('unique').message('unoriginal');
        validator.validate([1, 1]);
      expect(validator.errors).toEqual(
          ['too titchy', 'unoriginal'],
          'The correct list of validation failure messages is set'
      );
    });
  

});