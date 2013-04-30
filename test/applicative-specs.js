describe("Applicative functions", function() {
  describe("maxKey", function() {
    it("should return the arg for which the given function returns the largest value", function() {
      expect(L.maxKey(_.size, [1,2], [2], [4,5,6])).toEqual([4,5,6]);
    });
  });

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

  describe("juxt", function() {
    it("should return a function that returns an array of the originally supplied functions called", function() {
      var f = L.juxt(_.isPositive, _.isEven, _.isZero);

      expect(f(1)).toEqual([true, false, false]);
      expect(f()).toEqual([false, false, false]);
    });
  });

  describe("iterateUntil", function() {
    it("should call a function recursively f(f(f(args))) until a given function goes falsey", function() {
      expect(L.iterateUntil(function(n){ return n-1; }, _.isPositive, 6)).toEqual([5,4,3,2,1]);
    });
  });

  describe("reductions", function() {
    it("should perform a reduce and collect the intermediate results in an array", function() {
      expect(L.reductions(function(agg, n){ return agg+n; }, 0, [1,2,3,4,5])).toEqual([1,3,6,10,15]);
    });
  });

  describe("dropWhile", function() {
    it("should drop all elements from an array until a given function goes truthy", function() {
      expect(L.dropWhile(_.isNegative, [-2,-1,0,1,2])).toEqual([0,1,2]);
      expect(L.dropWhile(_.isNegative, [0,1,2])).toEqual([0,1,2]);
      expect(L.dropWhile(_.isNegative, [-2,-1])).toEqual([]);
      expect(L.dropWhile(_.isNegative, [1, -2,-1,0,1,2])).toEqual([1,-2,-1,0,1,2]);
    });

    it("should properly handle empty array arguments", function() {
      expect(L.dropWhile(_.isNegative, [])).toEqual([]);
    });
  });

  describe("takeWhile", function() {
    it("should take all elements from an array until a given function goes truthy", function() {
      expect(L.takeWhile(_.isNegative, [-2,-1,0,1,2])).toEqual([-2,-1]);
      expect(L.takeWhile(_.isNegative, [1,-2,-1,0,1,2])).toEqual([]);
    });

    it("should properly handle empty array arguments", function() {
      expect(L.takeWhile(_.isNegative, [])).toEqual([]);
    });
  });

  describe("partitionBy", function() {
    it("should partition an array as a given predicate changes truth sense.", function() {
      var a = [1, 2, null, false, undefined, 3, 4];

      expect(L.partitionBy(_.truthy, a)).toEqual([[1,2], [null, false, undefined], [3,4]]);
    });

    it("should not modify the original array", function() {
      var a = [1, 2, null, false, undefined, 3, 4];
      var $ = L.partitionBy(_.truthy, a);

      expect(a).toEqual([1, 2, null, false, undefined, 3, 4]);
    });
  });

});
