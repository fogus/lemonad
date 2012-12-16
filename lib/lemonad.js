(function() {
  var root = this;

  var L = {
    VERSION: '0.0.2',
    existy: function(x) { return x != null },

    truthy: function(x) { return (x !== false) && L.existy(x) },

    // basic function (1.2)
    cat: function() {
      var head = _.first(arguments);
      return head.concat.apply(head, _.rest(arguments));
    },

    // basic function (1.2)
    cons: function(head, tail) {
      return L.cat([head], tail);
    },

    // basic function (1.2)
    butLast: function(coll) {
      return _.toArray(coll).slice(0, -1)
    },

    // basic function (2.1)
    interpose: function(inter, coll) {
      return L.butLast(L.mapcat(function(e) { return L.cons(e, [inter]); }, coll));
    },

    // appl (1.2)
    mapcat: function(fun, coll) {
      return L.cat.apply(null, _.map(coll, fun));
    },

    // closure (2.2)
    complement: function(pred) {
      return function() {
        return !pred.apply(null, _.toArray(arguments));
      };
    },

    // closure (2.2)
    plucker: function(field) {
      return function(obj) {
        return (obj && obj[field]);
      };
    },

    // basic fun
    repeat: function(times, elem) {
      return _.map(_.range(times), function(_) { return elem; });
    },

    // hof
    constantly: function(value) {
      return function() { return value; };
    },

    // appl
    repeatedly: function(times, fun) {
      return _.map(_.range(times), fun);
    },

    iterateUntil: function(doit, checkit, seed) {
      var ret = [];
      var result = doit(seed);

      while (checkit(result)) {
        ret.push(result);
        result = doit(result);
      }

      return ret;
    },

    reductions: function(fun, init, coll) {
      var ret = [];
      var acc = init;

      _.each(coll, function(v,k) {
        acc = fun(acc, coll[k]);
        ret.push(acc);
      });

      return ret;
    },

    pipeline: function(){
      return _.reduce(arguments, function(l,r) { return r(l); });
    },

    curry2: function(fun) {
      return function(a) {
        return function(b) {
	        return fun(b, a);
	      };
      };
    },

    partial: function(fun) {
      var args = _.rest(arguments);
      var f = function() {
        var arg = 0;

        for ( var i = 0; i < args.length && arg < arguments.length; i++ )
          if ( args[i] === undefined )
            args[i] = arguments[arg++];

        return fun.apply(null, args);
      };

      f.__original__ = fun;

      return f;
    },

    second: function(coll) { return _.first(_.rest(coll)) },

    increasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return _.first(arguments) < L.second(arguments);

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] >= arguments[i]) {
          return false;
        }
      }

      return true;
    },

    decreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return _.first(arguments) > L.second(arguments);

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] <= arguments[i]) {
          return false;
        }
      }

      return true;
    },

    increasingOrEq: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return _.first(arguments) <= L.second(arguments);

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] > arguments[i]) {
          return false;
        }
      }

      return true;
    },

    decreasingOrEq: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return _.first(arguments) >= L.second(arguments);

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] < arguments[i]) {
          return false;
        }
      }

      return true;
    },

    // monads
    $: function(stateFun, valueFun) {
      return function(a) {
        return function(b) {
          return {value: valueFun(b,a), state: stateFun(b,a)};
        };
      };
    },

    actions: function () {
      var args           = _.toArray(arguments);
      var continuation   = _.last(args);
      var acts = L.butLast(args);

      return function (state) {
        var init = { values: [], state: state };

        var state = _.reduce(acts,
          function (state, action) {
            var result = action(state.state);
            var values = L.cat(state.values, result.value);
            var state  = result.state;

            return { values: values, state: state };
          },
          init);

        var values = _.filter(state.values, L.existy);

        return continuation.apply(null, values)(state.state);
      };
    }
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = L;
    }
    exports.L = L;
  } else {
    root.L = L;
  }
}).call(this);

/* monads

var result = function (values) {
  return function (state) {
    return { value: values, state: state };
  };
};

var push = L.$(
  function(e, stack) {
    return [e].concat(stack);
  },
  L.constantly(undefined));

var pop = L.$(
  function(stack) {
    return stack[0]
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
    return result(pop1 + " : " + pop2 + " : " + pop3);
  }
);

var result = computation([]);

*/
