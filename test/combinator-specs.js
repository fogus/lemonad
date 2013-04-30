describe("Combinators", function() {
  beforeEach(function() {

  });

  describe("pipeline", function() {
    it("should apply a series of functions to an initial value", function() {
      var result = L.pipeline(42, function(n) { return -n; }, function(n) { return "" + n; });

      expect(result).toEqual("-42");
    });
  });

  describe("compose", function() {
    it("should compose a series of functions and return a function applying each from right to left", function() {
      var f = L.compose(function(n) { return "" + n; }, function(n) { return -n; });

      expect(f(42)).toEqual("-42");
    });
  });

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
