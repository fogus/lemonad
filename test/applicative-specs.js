describe("Applicative functions", function() {
  describe("keepIndexed", function() {
    it("should return the arg for which the given function returns the largest value", function() {
      var a = ['a', 'b', 'c', 'd', 'e'];
      var b = [-9, 0, 29, -7, 45, 3, -8];
      var oddy = function(k, v) { return _.isOdd(k) ? v : undefined; };
      var posy = function(k, v) { return _.isPositive(v) ? k : undefined; };

      expect(L.keepIndexed(oddy, a)).toEqual(['b', 'd']);
      expect(L.keepIndexed(posy, b)).toEqual([2,4,5]);
      expect(L.keepIndexed(oddy, _.range(10))).toEqual([1,3,5,7,9]);
    });
  });
});
