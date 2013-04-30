describe("Predicate functions", function() {
  describe("isIndexed", function() {
    it("should recognize an element allowing numerical index access", function() {
      expect(L.isIndexed([])).toBeTruthy();
      expect(L.isIndexed([1,2,3])).toBeTruthy();
      expect(L.isIndexed(new Array(10))).toBeTruthy();
      expect(L.isIndexed("")).toBeTruthy();
      expect(L.isIndexed("abc")).toBeTruthy();
    });

    it("should recognize non-indexed objects", function() {
      expect(L.isIndexed(1)).toBeFalsy();
      expect(L.isIndexed(0)).toBeFalsy();
      expect(L.isIndexed(-1)).toBeFalsy();
      expect(L.isIndexed(3.14)).toBeFalsy();
      expect(L.isIndexed(undefined)).toBeFalsy();
      expect(L.isIndexed(NaN)).toBeFalsy();
      expect(L.isIndexed(Infinity)).toBeFalsy();
      expect(L.isIndexed(true)).toBeFalsy();
      expect(L.isIndexed(false)).toBeFalsy();
      expect(L.isIndexed(function(){})).toBeFalsy();
    });
  });

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

  describe("isSeq", function() {
    it("should know that arrays and arguments are sequences", function() {
      expect(L.isSeq(new Array(10))).toBeTruthy();
      expect(L.isSeq([1,2])).toBeTruthy();
      expect(L.isSeq(arguments)).toBeTruthy();
    });

    it("should know that everything else is not a reference", function() {
      expect(L.isSeq({})).toBeFalsy();
      expect(L.isSeq(function(){})).toBeFalsy();
      expect(L.isSeq(1)).toBeFalsy();
      expect(L.isSeq(0)).toBeFalsy();
      expect(L.isSeq(-1)).toBeFalsy();
      expect(L.isSeq(3.14)).toBeFalsy();
      expect(L.isSeq('undefined')).toBeFalsy();
      expect(L.isSeq('')).toBeFalsy();
      expect(L.isSeq(NaN)).toBeFalsy();
      expect(L.isSeq(Infinity)).toBeFalsy();
      expect(L.isSeq(true)).toBeFalsy();
    });
  });

  describe("isEven", function() {
    it("should know even numbers", function() {
      expect(L.isEven(0)).toBeTruthy();
      expect(L.isEven(2)).toBeTruthy();
      expect(L.isEven(-2)).toBeTruthy();
      expect(L.isEven(1)).toBeFalsy();
    });
  });

  describe("isOdd", function() {
    it("should know odd numbers", function() {
      expect(L.isOdd(1)).toBeTruthy();
      expect(L.isOdd(-1)).toBeTruthy();
      expect(L.isOdd(2)).toBeFalsy();
    });
  });

  describe("isPos", function() {
    it("should know positive numbers", function() {
      expect(L.isPos(1)).toBeTruthy();
      expect(L.isPos(-1)).toBeFalsy();
      expect(L.isPos(0)).toBeFalsy();
      expect(L.isPos(+0)).toBeFalsy();
    });
  });

  describe("isNeg", function() {
    it("should know negative numbers", function() {
      expect(L.isNeg(-1)).toBeTruthy();
      expect(L.isNeg(1)).toBeFalsy();
      expect(L.isNeg(0)).toBeFalsy();
      expect(L.isNeg(+0)).toBeFalsy();
    });
  });

  describe("isZero", function() {
    it("should know zero", function() {
      expect(L.isZero(0)).toBeTruthy();
      expect(L.isZero(-0)).toBeTruthy();
      expect(L.isZero(+0)).toBeTruthy();
      expect(L.isZero(1)).toBeFalsy();
      expect(L.isZero(-1)).toBeFalsy();
    });
  });
});
