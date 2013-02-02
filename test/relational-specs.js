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

  describe("L.$.set", function() {
    it("should return an array of uniq elements", function() {
      var s = L.$.toSet([1,2,3,4,5,3,4,5,8,2,3]);

      expect(s.constructor).toBe(Array);
      expect(s).toEqual([1,2,3,4,5,8]);
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

  describe("L.$.put", function() {
    it("should return an index with a new entry, even when the index is empty", function() {
      var testIndexEmpty = [];

      expect(L.$.put(testIndexEmpty, {a: 1}, 42)).toEqual([[{a: 1}, 42]]);
    });

    it("should return an index with a new entry", function() {
      var testIndex = [[{a: 1}, {name: 'foo', a: 1}, {name: 'bar', a: 1}], [{a: 2}, {a: 2, name: 'baz'}]];
      var exp = [[{a: 1}, 42, {name: 'foo', a: 1}, {name: 'bar', a: 1}], [{a: 2}, {a: 2, name: 'baz'}]];

      expect(L.$.put(testIndex, {a: 1}, 42)).toEqual(exp);
    });
  });

  describe("L.$.index", function() {
    it("should return an index of the objects based on the keys given", function() {
      var db = L.$({name: 'Burial', genre: 'dubstep'},
                   {name: 'Donovan', genre: 'folk'},
                   {name: 'Ikonika', genre: 'dubstep'});

      var index = L.$.index(db, ['genre']);

      var folk = L.$.lookup(index, {genre: 'folk'});

      expect(index[0].length).toBe(2);
      expect(index[1].length).toBe(3);
      expect(folk).toEqual([{name: 'Donovan', genre: 'folk'}]);
    });
  });
});
