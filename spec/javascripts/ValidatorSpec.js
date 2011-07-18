describe("Validator", function() {

  beforeEach(function() {
    // player = new Player();
  });

  it("should be able to perform simple validations", function() {
      expect(Validator.unique([1, 2, 3])).toBe(true);
      expect(Validator.unique([1, 2, 1])).toBe(false);
  });

});