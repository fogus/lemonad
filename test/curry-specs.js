describe("Currying functions", function() {
  describe("parseInt", function() {
      it("should restrict parseInt to the first parameter", function() {
        expect([1, 11, 12, 4].map(L.parseInt(10))[2]).toEqual(12);
      });
    });
    
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
  
  describe("arbitrary curry", function() {
      it("should return a function curried for 6 args", function() {
        var hexColor = function(r, g, b, h, s, l) {
        	return [r,g,b].join('') + ' - ' + [h,s,l].join(',');
        };
        var blue = L.curry(hexColor, 6)('50')('100')('240');
        var blueGreen = L.curry(hexColor, 6)('50')('100')('184')('FF');
  
        expect(blue('FF')('01')('00')).toEqual('0001FF - 240,100,50');
        expect(blueGreen('EE')('00')).toEqual('00EEFF - 184,100,50');
      });
    });
  
  describe("recognized arbitrary curry", function() {
      it("should return a function curried for function's number args", function() {
        var hexColor = function(r, g, b, h, s, l) {
        	return [r,g,b].join('') + ' - ' + [h,s,l].join(',');
        };
        var blue = L.curry(hexColor)('50')('100')('240');
        var blueGreen = L.curry(hexColor)('50')('100')('184')('FF');
  
        expect(blue('FF')('01')('00')).toEqual('0001FF - 240,100,50');
        expect(blueGreen('EE')('00')).toEqual('00EEFF - 184,100,50');
      });
    });
});
