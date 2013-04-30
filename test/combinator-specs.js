describe("Combinators", function() {
  describe("flip2", function() {
    it("should return a function that applies a given function with its first two args flipped", function() {
      var div = function(n, d) { return n/d; };

      expect(div(10,2)).toEqual(5);
      expect(L.flip2(div)(10,2)).toEqual(0.2);
    });
  });
});
