describe("Applicative functions", function() {
  beforeEach(function() {

  });

  describe("splitWith", function() {
    it("should return an array", function() {
      expect(L.splitWith(L.isPos, []).constructor).toBe(Array);
    });

    it("should split a sequence at the point when the given function goes falsey", function() {
      var a = [1,2,3,4,5];
      var lessThanEq3p = function(n) { return n <= 3; };
      var lessThanEq3p$ = function(n) { return (n <= 3) ? true : null; };

      expect(L.splitWith(lessThanEq3p, a)).toEqual([[1,2,3], [4,5]]);
      expect(L.splitWith(lessThanEq3p$, a)).toEqual([[1,2,3], [4,5]]);
    });

    it("should not modify the originals", function() {
      var a = [1,2,3,4,5];
      var lessThanEq3p = function(n) { return n <= 3; };
      var _ = L.splitWith(lessThanEq3p, a);

      expect(a).toEqual([1,2,3,4,5]);
    });

    it("should throw an exception if the second arg is not a sequence", function() {
      expect(function() { L.splitWith(function(){}, 2); }).toThrow();
      expect(function() { L.splitWith(function(){}); }).toThrow();
      expect(function() { L.splitWith(); }).toThrow();
    });

    it("should split an empty array to [[],[]]]", function() {
      expect(L.splitWith(L.isPos, [])).toEqual([[],[]]);
    });
  });

  describe("update", function() {
    it("should allow update via some function of a value at any depth in an associative structure", function() {
      var obj = {a: {b: {c: 42, d: 108}}};
      var ary = ['a', ['b', ['c', 'd'], 'e']];
      var inc = function(n) { return n+1; };

      expect(L.update(obj, ['a', 'b', 'c'], inc)).toEqual({a: {b: {c: 43, d: 108}}});
      expect(L.update(ary, [1, 1, 0], _.isNumber)).toEqual(['a', ['b', [false, 'd'], 'e']]);

      expect(L.update(obj, 'a', L.plucker('b'))).toEqual({a: {c: 42, d: 108}});
      expect(L.update(ary, 1, _.first)).toEqual(['a', 'b']);
    });

    it("should not modify the original", function() {
      var obj = {a: {b: {c: 42, d: 108}}};
      var ary = ['a', ['b', ['c', 'd'], 'e']];

      var _   = L.update(obj, ['a', 'b', 'c'], L.k(9));
      var __  = L.update(ary, [1, 1, 0], L.k(9));

      expect(obj).toEqual({a: {b: {c: 42, d: 108}}});
      expect(ary).toEqual(['a', ['b', ['c', 'd'], 'e']]);
    });
  });

  describe("keep", function() {
    it("should return an array of existy results from the given function over a sequence", function() {
      var a = _.range(10);
      var eveny = function(e) { return (L.isEven(e)) ? e : undefined; };

      expect(L.keep(eveny, a)).toEqual([0, 2, 4, 6, 8]);
      expect(L.keep(L.isEven, a)).toEqual([true, false, true, false, true, false, true, false, true, false]);
    });

    it("should not modify the original", function() {
      var a = _.range(10);
      var eveny = function(e) { return (L.isEven(e)) ? e : undefined; };
      var $ = L.keep(eveny, a); 

      expect(a).toEqual(_.range(10));
    });

    it("should throw an exception if the second arg is not a sequence", function() {
      expect(function() { L.keep(L.isEven); }).toThrow();
    });
  });

  describe("remove", function() {
    it("should return an array of elements from the original where the predicate returned true", function() {
      var a = [0,1,2,-1,3];

      expect(L.remove(L.isPos, a)).toEqual([0, -1]);
    });

    it("should not modify the original", function() {
      var a = [0,1,2,-1,3];
      var _ = L.remove(L.isPos, a);

      expect(a).toEqual([0,1,2,-1,3]);
    });

    it("should throw an exception if the second arg is not a sequence", function() {
      expect(function() { L.remove(L.isEven); }).toThrow();
    });
  });

  describe("maxKey", function() {
    it("should return the arg for which the given function returns the largest value", function() {
      expect(L.maxKey(_.size, [1,2], [2], [4,5,6])).toEqual([4,5,6]);
    });
  });

  describe("keepIndexed", function() {
    it("should return the arg for which the given function returns the largest value", function() {
      var a = ['a', 'b', 'c', 'd', 'e'];
      var b = [-9, 0, 29, -7, 45, 3, -8];
      var oddy = function(k, v) { return L.isOdd(k) ? v : undefined; };
      var posy = function(k, v) { return L.isPos(v) ? k : undefined; };

      expect(L.keepIndexed(oddy, a)).toEqual(['b', 'd']);
      expect(L.keepIndexed(posy, b)).toEqual([2,4,5]);
      expect(L.keepIndexed(oddy, _.range(10))).toEqual([1,3,5,7,9]);
    });
  });

  describe("mapcat", function() {
    it("should return the arg for which the given function returns the largest value", function() {
      var a = [1,2,3];
      var commaize = function(e) { return L.cons(e, [","]); };

      expect(L.mapcat(commaize, a)).toEqual([1, ",", 2, ",", 3, ","]);
    });
  });

  describe("repeatedly", function() {
    it("should return an array of the size given with the function given called for each cell", function() {
      expect(L.repeatedly(3, L.k(42))).toEqual([42,42,42]);
    });
  });

  describe("plucker", function() {
    it("should return a function that will pluck a specified property from any object given", function() {
      var f = L.plucker('a');

      expect(f({a: 42})).toEqual(42);
      expect(f({z: 42})).toEqual(undefined);
    });
  });

  describe("juxt", function() {
    it("should return a function that returns an array of the originally supplied functions called", function() {
      var f = L.juxt(L.isPos, L.isEven, L.isZero);

      expect(f(1)).toEqual([true, false, false]);
      expect(f()).toEqual([false, false, false]);
    });
  });

  describe("iterateUntil", function() {
    it("should call a function recursively f(f(f(args))) until a given function goes falsey", function() {
      expect(L.iterateUntil(function(n){ return n-1; }, L.isPos, 6)).toEqual([5,4,3,2,1]);
    });
  });

  describe("reductions", function() {
    it("should perform a reduce and collect the intermediate results in an array", function() {
      expect(L.reductions(function(agg, n){ return agg+n; }, 0, [1,2,3,4,5])).toEqual([1,3,6,10,15]);
    });
  });

  describe("dropWhile", function() {
    it("should drop all elements from an array until a given function goes truthy", function() {
      expect(L.dropWhile(L.isNeg, [-2,-1,0,1,2])).toEqual([0,1,2]);
      expect(L.dropWhile(L.isNeg, [0,1,2])).toEqual([0,1,2]);
      expect(L.dropWhile(L.isNeg, [-2,-1])).toEqual([]);
      expect(L.dropWhile(L.isNeg, [1, -2,-1,0,1,2])).toEqual([1,-2,-1,0,1,2]);
    });

    it("should properly handle empty array arguments", function() {
      expect(L.dropWhile(L.isNeg, [])).toEqual([]);
    });
  });

  describe("takeWhile", function() {
    it("should take all elements from an array until a given function goes truthy", function() {
      expect(L.takeWhile(L.isNeg, [-2,-1,0,1,2])).toEqual([-2,-1]);
      expect(L.takeWhile(L.isNeg, [1,-2,-1,0,1,2])).toEqual([]);
    });

    it("should properly handle empty array arguments", function() {
      expect(L.takeWhile(L.isNeg, [])).toEqual([]);
    });
  });

  describe("partitionBy", function() {
    it("should partition an array as a given predicate changes truth sense.", function() {
      var a = [1, 2, null, false, undefined, 3, 4];

      expect(L.partitionBy(L.truthy, a)).toEqual([[1,2], [null, false, undefined], [3,4]]);
    });

    it("should not modify the original array", function() {
      var a = [1, 2, null, false, undefined, 3, 4];
      var _ = L.partitionBy(L.truthy, a);

      expect(a).toEqual([1, 2, null, false, undefined, 3, 4]);
    });
  });

});
