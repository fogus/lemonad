describe("Predicates", function() {
  beforeEach(function() {

  });

  describe("the operation of the existy predicate", function() {
    it("should know that null and undefined are not existy", function() {
      expect(L.existy(null)).toBeFalsy();
      expect(L.existy(undefined)).toBeFalsy();
    });

    it("should know that everything else is existy", function() {
      expect(L.existy(1)).toBeTruthy();
      expect(L.existy(0)).toBeTruthy();
      expect(L.existy(-1)).toBeTruthy();
      expect(L.existy(3.14)).toBeTruthy();
      expect(L.existy('undefined')).toBeTruthy();
      expect(L.existy('')).toBeTruthy();
      expect(L.existy(NaN)).toBeTruthy();
      expect(L.existy(Infinity)).toBeTruthy();
      expect(L.existy(true)).toBeTruthy();
      expect(L.existy(false)).toBeTruthy();
      expect(L.existy(function(){})).toBeTruthy();
    });
  });

  describe("the operation of the truthy predicate", function() {
    it("should know that null, false and undefined are not truthy", function() {
      expect(L.truthy(null)).toBeFalsy();
      expect(L.truthy(undefined)).toBeFalsy();
      expect(L.truthy(false)).toBeFalsy();
    });

    it("should know that everything else is truthy", function() {
      expect(L.truthy(1)).toBeTruthy();
      expect(L.truthy(0)).toBeTruthy();
      expect(L.truthy(-1)).toBeTruthy();
      expect(L.truthy(3.14)).toBeTruthy();
      expect(L.truthy('undefined')).toBeTruthy();
      expect(L.truthy('')).toBeTruthy();
      expect(L.truthy(NaN)).toBeTruthy();
      expect(L.truthy(Infinity)).toBeTruthy();
      expect(L.truthy(true)).toBeTruthy();
      expect(L.truthy(function(){})).toBeTruthy();
    });
  });

  describe("the operation of the isAssociative predicate", function() {
    it("should know that arrays, functions and objects are associative", function() {
      expect(L.isAssociative({})).toBeTruthy();
      expect(L.isAssociative(function(){})).toBeTruthy();
      expect(L.isAssociative([])).toBeTruthy();
      expect(L.isAssociative(new Array(10))).toBeTruthy();
    });

    it("should know that everything else is not associative", function() {
      expect(L.isAssociative(1)).toBeFalsy();
      expect(L.isAssociative(0)).toBeFalsy();
      expect(L.isAssociative(-1)).toBeFalsy();
      expect(L.isAssociative(3.14)).toBeFalsy();
      expect(L.isAssociative('undefined')).toBeFalsy();
      expect(L.isAssociative('')).toBeFalsy();
      expect(L.isAssociative(NaN)).toBeFalsy();
      expect(L.isAssociative(Infinity)).toBeFalsy();
      expect(L.isAssociative(true)).toBeFalsy();
    });
  });

  describe("the operation of the isReference predicate", function() {
    it("should know that Refs and CAS are references", function() {
      expect(L.isReference(new L.Ref())).toBeTruthy();
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

  describe("the operation of the isEven predicate", function() {
    it("should know even numbers", function() {
      expect(L.isEven(0)).toBeTruthy();
      expect(L.isEven(2)).toBeTruthy();
      expect(L.isEven(-2)).toBeTruthy();
      expect(L.isEven(1)).toBeFalsy();
    });
  });

  describe("the operation of the isOdd predicate", function() {
    it("should know odd numbers", function() {
      expect(L.isOdd(1)).toBeTruthy();
      expect(L.isOdd(-1)).toBeTruthy();
      expect(L.isOdd(2)).toBeFalsy();
    });
  });

  describe("the operation of the isPos predicate", function() {
    it("should know positive numbers", function() {
      expect(L.isPos(1)).toBeTruthy();
      expect(L.isPos(-1)).toBeFalsy();
      expect(L.isPos(0)).toBeFalsy();
      expect(L.isPos(+0)).toBeFalsy();
    });
  });

  describe("the operation of the isNeg predicate", function() {
    it("should know negative numbers", function() {
      expect(L.isNeg(-1)).toBeTruthy();
      expect(L.isNeg(1)).toBeFalsy();
      expect(L.isNeg(0)).toBeFalsy();
      expect(L.isNeg(+0)).toBeFalsy();
    });
  });

  describe("the operation of the isZero predicate", function() {
    it("should know zero", function() {
      expect(L.isZero(0)).toBeTruthy();
      expect(L.isZero(-0)).toBeTruthy();
      expect(L.isZero(+0)).toBeTruthy();
      expect(L.isZero(1)).toBeFalsy();
      expect(L.isZero(-1)).toBeFalsy();
    });
  });
});
