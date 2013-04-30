describe("Combinators", function() {
  describe("conjoin", function() {
    it("should compose a series of predicates and return a function that checks an arg against everyone, returning true if they *all* match", function() {
      var isPositiveEven = L.conjoin(_.isPositive, _.isEven);

      expect(isPositiveEven([2,4,6,8])).toBeTruthy();
      expect(isPositiveEven([2,4,6,7,8])).toBeFalsy();
    });
  });

  describe("conjoin", function() {
    it("should compose a series of predicates and return a function that checks the elements of an array against every one, returning true if they *all* match", function() {
      var isPositiveEven = L.conjoin(_.isPositive, _.isEven);

      expect(isPositiveEven([2,4,6,8])).toBeTruthy();
      expect(isPositiveEven([2,4,6,7,8])).toBeFalsy();
    });
  });

  describe("disjoin", function() {
    it("should compose a series of predicates and return a function that checks the elements of an an array against every one, returning true if *any* match", function() {
      var orPositiveEven = L.disjoin(_.isPositive, _.isEven);

      expect(orPositiveEven([-1,2,3,4,5,6])).toBeTruthy();
      expect(orPositiveEven([-1,-3])).toBeFalsy();
    });
  });

  describe("flip2", function() {
    it("should return a function that applies a given function with its first two args flipped", function() {
      var div = function(n, d) { return n/d; };

      expect(div(10,2)).toEqual(5);
      expect(L.flip2(div)(10,2)).toEqual(0.2);
    });
  });
});
