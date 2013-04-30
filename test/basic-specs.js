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
});
