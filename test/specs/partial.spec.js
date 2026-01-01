describe("Partial application functions", function() {
  var over = function(t, m, b) { return t / m / b; };

  describe("partial1", function() {
    it("should return a function partially applied for the first arg", function() {
      var t = L.partial1(over, 10);

      expect(t(5,2)).toEqual(1);
    });
  });

  describe("partial2", function() {
    it("should return a function partially applied for the first two args", function() {
      var o2 = L.partial2(over, 10, 5);

      expect(o2(2)).toEqual(1);
    });
  });

  describe("L", function() {
    it("should return a function partially applied for some number of arbitrary args", function() {
      var o1 = L(over, 10);
      var o2 = L(over, 10, 5);
      var o3 = L(over, 10, 5, 2);

      expect(o1(5,2)).toEqual(1);
      expect(o2(2)).toEqual(1);
      expect(o3()).toEqual(1);
    });
  });
  
  describe("partial", function() {
      it("should return a function partially applied for some number of arbitrary args", function() {
        var o1 = L.partial(over, 10);
        var o2 = L.partial(over, 10, 5);
        var o3 = L.partial(over, 10, 5, 2);
  
        expect(o1(5,2)).toEqual(1);
        expect(o2(2)).toEqual(1);
        expect(o3()).toEqual(1);
      });
    });

  describe("meth", function() {
    it("should wrap a method as a function and allow the target as the first arg", function() {
      var str = L.meth(Array.prototype.toString);

      expect(str([1])).toEqual('1');
    });

    it("should partially apply and given args.", function() {
      var e = L.invoker(String.prototype.split, '');

      expect(e("asd")).toEqual(['a','s','d']);
    });
  });
});
