describe("Basic functions", function() {
  describe("ctor", function() {
    it("should return the constructor of the object", function() {
      var O = function() { this.foo = 42; };

      expect(L.ctor([])).toBe(Array);
      expect(L.ctor({})).toBe(Object);
      expect(L.ctor(new O())).toBe(O);
      expect(L.ctor(null)).toBe(null);
    });
  });

  describe("renameKeys", function() {
    it("should rename the keys in the first object to the mapping in the second object", function() {
      expect(L.renameKeys({'a': 1, 'b': 2}, {'a': 'A'})).toEqual({'b': 2, 'A': 1});
    });

    it("should not modify the original", function() {
      var a = {'a': 1, 'b': 2};
      var _ = L.renameKeys(a, {'a': 'A'});

      expect(a).toEqual({'a': 1, 'b': 2});
    });
  });

  describe("selectKeys", function() {
    it("should return an object filled with the entries of the keys array given", function() {
      expect(L.selectKeys({'a': 1, 'b': 2}, ['a'])).toEqual({'a': 1});
    });
  });
});
