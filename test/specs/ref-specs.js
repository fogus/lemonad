describe("Reference types and functions", function() {
  describe("the Hole type", function() {
    describe("the Hole constructor", function() {
      it("should create a mutable 'cell' with a value field", function() {
        var v = new L.Hole(42);

        expect(v._value).toEqual(42);
      });

      it("should not allow creation of a mutable 'cell' with a value that fails a validator", function() {
        expect(function(){ new L.Hole(42, constantly(false)); }).toThrow();
      });

      it("should allow creation of a mutable 'cell' with a value that passes a validator", function() {
        expect(function(){ new L.Hole(42, constantly(true)); }).toThrow();
      });

      it("should be a Hole and Object type", function() {
        var v = new L.Hole(42);

        expect(L.isInstanceOf((new L.Hole(42)), L.Hole)).toBeTruthy();
        // TODO modify Hole so that it does not pass CAS check
        expect(L.isInstanceOf((new L.Hole(42)), Object)).toBeTruthy();
        expect(L.isInstanceOf((new L.Hole(42)), Array)).toBeFalsy();
      });
    });

    describe("setValue", function() {
      it("should set a Hole's value", function() {
        var v = new L.Hole(42);
        L.setValue(v, 36);

        expect(v._value).toEqual(36);
      });

      it("should return the new value", function() {
        var v = new L.Hole(42);

        expect(L.setValue(v, 36)).toEqual(36);
      });

      it("should fail if an invalid value is provided", function() {
        var v = new L.Hole("", L.isString);

        expect(function(){ L.setValue(v, 36); }).toThrow();
      });
    });

    describe("swap", function() {
      it("should set a Hole's value based on the result of a function given its current value", function() {
        var v = new L.Hole(42);

        L.swap(v, function() { return 36 });
        expect(v._value).toEqual(36);

        L.swap(v, L.inc);
        expect(v._value).toEqual(37);
      });

      it("should return the new value", function() {
        var v = new L.Hole(42);

        expect(L.swap(v, L.inc)).toEqual(43);
      });

      it("should fail if an invalid value is provided", function() {
        var v = new L.Hole("", L.isString);

        expect(function(){ L.swap(v, k(36)); }).toThrow();
      });
    });

  });

  describe("the CAS type", function() {
    describe("compareAndSwap", function() {
      it("should set a CAS value based on a presumed current value the result of a function given its current value", function() {
        var v = new L.CAS(42);

        L.compareAndSwap(v, 42, function() { return 36 });
        expect(v._value).toEqual(36);

        L.compareAndSwap(v, 36, L.inc);
        expect(v._value).toEqual(37);
      });

      it("should be an Object, Hole and CAS type", function() {
        var v = new L.CAS(42);

        expect(L.isReference(new L.CAS(42))).toBeTruthy();
        expect(L.isInstanceOf((new L.CAS(42)), L.CAS)).toBeTruthy();
        expect(L.isInstanceOf((new L.CAS(42)), Object)).toBeTruthy();
        expect(L.isInstanceOf((new L.CAS(42)), Array)).toBeFalsy();
      });

      it("should return true if successful", function() {
        var v = new L.CAS(42);

        expect(L.compareAndSwap(v, 42, L.inc)).toBeTruthy();
      });

      it("should also work with Holes (i.e. define in terms of Hole as base)", function() {
        var v = new L.Hole(42);

        expect(L.compareAndSwap(v, 0,  L.inc)).toBeFalsy();
      });

      it("should fail if an invalid value is provided", function() {
        var v = new L.CAS("", L.isString);

        expect(function(){ L.compareAndSwap(v, k(36)); }).toThrow();
      });
    });

    describe("swap", function() {
      it("should set a CAS's value based on the result of a function given its current value", function() {
        var v = new L.CAS(42);

        L.swap(v, function() { return 36 });
        expect(v._value).toEqual(36);

        L.swap(v, L.inc);
        expect(v._value).toEqual(37);
      });

      it("should return the new value", function() {
        var v = new L.CAS(42);

        expect(L.swap(v, L.inc)).toEqual(43);
      });

      it("should fail if an invalid value is provided", function() {
        var v = new L.CAS("", L.isString);

        expect(function(){ L.swap(v, k(36)); }).toThrow();
      });
    });

    describe("setValue", function() {
      it("should set a CAS's value", function() {
        var v = new L.CAS(42);
        L.setValue(v, 36);

        expect(v._value).toEqual(36);
      });

      it("should return the new value", function() {
        var v = new L.CAS(42);

        expect(L.setValue(v, 36)).toEqual(36);
      });

      it("should fail if an invalid value is provided", function() {
        var v = new L.CAS("", L.isString);

        expect(function(){ L.setValue(v, 36); }).toThrow();
      });
    });
  });
});
