describe("Predicate functions", function() {
  describe("isReference", function() {
    it("should know that Holes and CAS are references", function() {
      expect(L.isReference(new L.Hole())).toBeTruthy();
      expect(L.isReference(new L.CAS())).toBeTruthy();
    });

    it("should know that everything else is not a reference", function() {
      expect(L.isReference({})).toBeFalsy();
      expect(L.isReference(new Array(10))).toBeFalsy();
      expect(L.isReference(function(){})).toBeFalsy();
      expect(L.isReference(1)).toBeFalsy();
      expect(L.isReference(0)).toBeFalsy();
      expect(L.isReference(-1)).toBeFalsy();
      expect(L.isReference(3.14)).toBeFalsy();
      expect(L.isReference('undefined')).toBeFalsy();
      expect(L.isReference('')).toBeFalsy();
      expect(L.isReference(NaN)).toBeFalsy();
      expect(L.isReference(Infinity)).toBeFalsy();
      expect(L.isReference(true)).toBeFalsy();
    });
  });
});
