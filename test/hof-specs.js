describe("Higher-order functions", function() {
  describe("best", function() {
    it("should return the 'best' value according to the criteria encapsulated in a function", function() {
      var a = [1,2,3,4,5];

      expect(L.best(function(x,y) { return x > y; }, a)).toEqual(5);
    });
  });

  describe("comparator", function() {
    it("should return a function to convert a predicate to a comparator", function() {
      var lessOrEqual = function(x, y) { return x <= y; };

      var a = [0, 1, -2];
      var b = [100, 1, 0, 10, -1, -2, -1];

      expect( a.sort(L.comparator(lessOrEqual)) ).toEqual([-2, 0, 1]);
      expect( b.sort(L.comparator(lessOrEqual)) ).toEqual([-2, -1, -1, 0, 1, 10, 100]);
    });
  });

  describe("complement", function() {
    var _e = L.complement(_.isOdd);
    var _o = L.complement(_.isEven);
    var _n = L.complement(L.eq(5), L.eq(0));

    it("should return a predicate that gives the opposite result of a given predicate", function() {
      expect(_e(4)).toBeTruthy();
      expect(_e(0)).toBeTruthy();
      expect(_e(-4)).toBeTruthy();
      expect(_o(5)).toBeTruthy();
      expect(_o(1)).toBeTruthy();
      expect(_o(0)).toBeFalsy();
    });

    it("should return a predicate that gives the opposite result of the composition of multiple predicates", function() {
      expect(_n(5)).toBeTruthy();
      expect(_n(0)).toBeTruthy();
    });
  });

  describe("fnull", function() {
    it("should return a null-safe function with default args filled in", function() {
      var a = [1,2,3,null,5];
      var b = [1,2,3,undefined,5];
      var safeMult = L.fnull(function(total, n) { return total * n; }, 1, 1);

      expect(_.reduce(a, safeMult)).toEqual(30);
      expect(_.reduce(b, safeMult)).toEqual(30);
    });
  });

  describe("frequencies", function() {
    it("should return an object of the elements in an array keyed to their counts.", function() {
      var a = ['a','a','b','a'];
      var m = _.explode("mississippi");

      expect(L.frequencies(a)).toEqual({a: 3, b: 1});
      expect(L.frequencies(m)).toEqual({p: 2, s: 4, i: 4, m: 1});
    });
  });
});
