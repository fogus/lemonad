describe("Relational algebra functions", function() {
  beforeEach(function() {

  });

  describe("L.$", function() {
    it("should return an array of uniq elements", function() {
      var s = L.$(1,2,3,4,5,3,4,5);

      expect(s.constructor).toBe(Array);
      expect(s).toEqual([1,2,3,4,5]);
    });
  });

  describe("L.$.select", function() {
    it("should return an array of uniq elements matching a predicate", function() {
      var s = L.$(1,2,3,4,5,3,4,5);
      var result = L.$.select(L.isOdd, s);

      expect(result.constructor).toBe(Array);
      expect(result).toEqual([1,3,5]);
    });
  });
});
