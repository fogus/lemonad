describe("Basic functions", function() {
  beforeEach(function() {

  });

  describe("the operation of the cat function", function() {
    beforeEach(function() {

    });

    it("should concatenate two arrays", function() {
      expect(false).toBeFalsy();
    });

    it("should concatenate 3 or more arrays", function() {
      expect(true).toBeTruthy();
    });
  });

  describe("the operation of the cons function", function() {
    it("should throw an exception if the second arg is not an array", function() {
      expect(function() {
        throw "foo";
      }).toThrow("foo");
    });
  });
});
