describe("Higher-order functions", function() {
  beforeEach(function() {

  });

  describe("best", function() {
    it("should return the 'best' value according to the criteria encapsulated in a function", function() {
      var a = [1,2,3,4,5];

      expect(L.best(function(x,y) { return x > y; }, a)).toEqual(5);
    });
  });
});
