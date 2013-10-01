describe("Higher-order functions", function() {
  describe("L.rot", function() {
      it("should rotate arguments applied", function() {
        var identity = function() { return [].slice.call(arguments); };
        var rotate = L.rot(identity)(1, 2, 3);
        expect(rotate[0]).toBe(3);
        expect(rotate[1]).toBe(1);
        expect(rotate[2]).toBe(2);
      });
    });
});
