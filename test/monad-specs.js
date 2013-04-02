describe("Monadic functions", function() {
  var push = L.lift(function(stack, e) {
    return L.cons(e, stack);
  });

  var pop = L.lift(_.first, _.rest);

  var computation = L.actions([
    push(4),
    push(5),
    push(6),
    pop(),
    pop()],

    function (values, state) {
      return state;
    }
  );

  var answer = computation([]);

  describe("actions", function() {
    it("should return a monadic value, based on the actions embedded within", function() {
      expect(answer).toEqual([4]);
    });
  });
});
