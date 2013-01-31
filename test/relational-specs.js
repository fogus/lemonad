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

  describe("L.$.project", function() {
    it("should return an array of objects with only the keys wanted", function() {
      var s = L.$({a: 1, b: 2}, {a: 2, b: 4});
      var result = L.$.project(s, ['a']);

      expect(result.constructor).toBe(Array);
      expect(result).toEqual([{a: 1}, {a: 2}]);
    });
  });

  describe("L.$.rename", function() {
    it("should rename the keys in an array of objects with according to a mapping in the given object", function() {
      var s  = [{'a': 1, 'b': 2}, {'a': 3}, {'b': 4}];
      var st = [{'AAA': 1, 'b': 2}, {'AAA': 3}, {'b': 4}];
      var result = L.$.rename(s, {'a': 'AAA'});

      expect(result.constructor).toBe(Array);
      expect(result).toEqual(st);
    });

    it("should not modify the original array of objects", function() {
      var s  = [{'a': 1, 'b': 2}, {'a': 3}, {'b': 4}];
      var target = [{'a': 1, 'b': 2}, {'a': 3}, {'b': 4}];
      var _ = L.$.rename(s, {'a': 'AAA'});

      expect(s).toEqual(target);
    });
  });

  describe("L.$.lookup", function() {
    it("should return an array of objects matching the key given in the index", function() {
      var testIndex = [[{a: 1}, {name: 'foo', a: 1}, {name: 'bar', a: 1}], [{a: 2}, {a: 2, name: 'baz'}]];
      var result1   = L.$.lookup(testIndex, {a: 1});
      var result2   = L.$.lookup(testIndex, {a: 2});
      var resultNo  = L.$.lookup(testIndex, {a: 'not there'});

      expect(result1.constructor).toBe(Array);
      expect(result1).toEqual([{a: 1, name: 'foo'}, {a: 1, name: 'bar'}]);

      expect(result2.constructor).toBe(Array);
      expect(result2).toEqual([{a: 2, name: 'baz'}]);

      expect(resultNo).toBe(undefined);
    });
  });
});
