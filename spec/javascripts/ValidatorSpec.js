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
  });

});