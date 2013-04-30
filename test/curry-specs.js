describe("Currying functions", function() {
  describe("curry2", function() {
    it("should return a function curried for two args", function() {
      var div10 = L.curry2(function(n, d) { return n / d; })(10);

      expect(div10(50)).toEqual(5);
    });
  });

  describe("curry3", function() {
    it("should return a function curried for three args", function() {
      var hexColor = function(r, g, b) { return [r,g,b].join(''); };
      var blue = L.curry3(hexColor)('FF');
      var blueGreen = L.curry3(hexColor)('FF')('EE');

      expect(blue('01')('00')).toEqual('0001FF');
      expect(blueGreen('00')).toEqual('00EEFF');
    });
  });
});
