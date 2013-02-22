describe("Monadic functions", function() {
  var result = function (values) {
    return function (state) {
      return { value: values, state: state };
    };
  };

  var push = L.unit(
    function(e, stack) {
      return [e].concat(stack);
    },
    L.constantly(undefined));

  var pop = L.unit(
    function(stack) {
      return stack[0];
    },
    function(stack) {
      return stack.slice(1);
    });

  var computation = L.actions(
    push(4),
    push(5),
    push(6),
    pop(),
    pop(),
    pop(),

    function (pop1, pop2, pop3) {
      return result([pop1, pop2, pop3]);
    }
  );

  var answer = computation([]);

  describe("actions", function() {
    it("should return a monadic value, based on the actions embedded within", function() {
      expect(answer.value).toEqual([6,5,4]);
      expect(answer.state).toEqual([]);
    });
  });
});
