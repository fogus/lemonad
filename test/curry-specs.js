describe("Currying functions", function() {
  describe("parseInt", function() {
      it("should restrict parseInt to the first parameter", function() {
        expect([1, 11, 12, 4].map(L.parseInt(10))[2]).toEqual(12);
      });
    });
    
  describe("curry2", function() {
    it("should return a function curried for two args", function() {
      var over10 = L.curry2(function(n, d) { return n / d; })(10);

      expect(over10(50)).toEqual(0.2);
    });
  });

  describe("rcurry2", function() {
    it("should return a function curried for two args", function() {
      var div10 = L.rcurry2(function(n, d) { return n / d; })(10);

      expect(div10(50)).toEqual(5);
    });
  });

  describe("curry3", function() {
    it("should return a function curried for three args", function() {
      var hexColor = function(r, g, b) { return [r,g,b].join(''); };
      var red = L.curry3(hexColor)('FF');
      var redGreen = L.curry3(hexColor)('FF')('EE');

      expect(red('01')('00')).toEqual('FF0100');
      expect(redGreen('00')).toEqual('FFEE00');
    });
  });
  
  describe("arbitrary curry", function() {
      it("should return a function curried for 6 args", function() {
        var hexColor = function(r, g, b, h, s, l) {
        	return [r,g,b].join('') + ' - ' + [h,s,l].join(',');
        };
        var red = L.curry(hexColor, 6)('FF')('01')('00');
        var redGreen = L.curry(hexColor, 6)('FF')('EE')('00')('184');
  
        expect(red('240')('100')('50')).toEqual('FF0100 - 240,100,50');
        expect(redGreen('100')('50')).toEqual('FFEE00 - 184,100,50');
      });
    });
  
  describe("recognized arbitrary curry", function() {
      it("should return a function curried for function's number args", function() {
        var hexColor = function(r, g, b, h, s, l) {
        	return [r,g,b].join('') + ' - ' + [h,s,l].join(',');
        };
        var red = L.curry(hexColor)('FF')('01')('00');
        var redGreen = L.curry(hexColor)('FF')('EE')('00')('184');
  
        expect(red('240')('100')('50')).toEqual('FF0100 - 240,100,50');
        expect(redGreen('100')('50')).toEqual('FFEE00 - 184,100,50');
      });
    });
});
