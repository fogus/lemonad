describe("Higher-order functions", function() {
  describe("best", function() {
    it("should return the 'best' value according to the criteria encapsulated in a function", function() {
      var a = [1,2,3,4,5];

      expect(L.best(function(x,y) { return x > y; }, a)).toEqual(5);
    });
  });

  describe("complement", function() {
    var _e = L.complement(L.isOdd);
    var _o = L.complement(L.isEven);

    it("should return a predicate that gives the opposite result of a given predicate", function() {
      expect(_e(4)).toBeTruthy();
      expect(_e(0)).toBeTruthy();
      expect(_e(-4)).toBeTruthy();
      expect(_o(5)).toBeTruthy();
      expect(_o(1)).toBeTruthy();
      expect(_o(0)).toBeFalsy();
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
      var m = L.explode("mississippi");

      expect(L.frequencies(a)).toEqual({a: 3, b: 1});
      expect(L.frequencies(m)).toEqual({p: 2, s: 4, i: 4, m: 1});
    });
  });
});
