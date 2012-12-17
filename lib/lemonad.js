//    Lemonad.js
//    http://www.functionaljs.org
//    (c) 2012 Fogus, Ariadne Softworks
//    Lemonad may be freely distributed under the MIT license

// *the secret JavaScript sauce**
(function() {
  // Setup
  // -----

  var root = this;

  var L = function() {
    return undefined;
  };

  L.VERSION = '0.0.8';

  // Useful predicates
  // -----------------

  L.existy = function(x) { return x != null };
  L.truthy = function(x) { return (x !== false) && L.existy(x) };
  L.isAssociative = function(x) { return _.isArray(x) || _.isObject(x) };
  L.isReference = function(x) { return x.constructor === L.Ref };
  L.isZero = function(x) { return 0 === x };
  L.isEven = function(x) { return L.isZero(x & 1) };
  L.isOdd = function(x) { return !L.isEven(x) };
  L.isPos = function(x) { return x > 0 };

  // Basic functions
  // ---------------

  // (1.2)
  L.cat = function() {
    var args = _.toArray(arguments);
    var head = _.first(args);
    return head.concat.apply(head, _.rest(args));
  };

  // (1.2)
  L.cons = function(head, tail) {
    return L.cat([head], tail);
  };

  // (1.2)
  L.butLast = function(coll) {
    return _.toArray(coll).slice(0, -1)
  };

  // (2.1)
  L.interpose = function(inter, coll) {
    return L.butLast(L.mapcat(function(e) { return L.cons(e, [inter]); }, coll));
  };

  L.repeat = function(times, elem) {
    return _.map(_.range(times), function(_) { return elem; });
  };

  L.second = function(coll) { return _.first(_.rest(coll)) };

  L.increasing = function() {
    var count = _.size(arguments);
    if (count === 1) return true;
    if (count === 2) return _.first(arguments) < L.second(arguments);

    for (var i = 1; i < count; i++) {
      if (arguments[i-1] >= arguments[i]) {
        return false;
      }
    }

    return true;
  };

  L.decreasing = function() {
    var count = _.size(arguments);
    if (count === 1) return true;
    if (count === 2) return _.first(arguments) > L.second(arguments);

    for (var i = 1; i < count; i++) {
      if (arguments[i-1] <= arguments[i]) {
        return false;
      }
    }

    return true;
  };

  L.increasingOrEq = function() {
    var count = _.size(arguments);
    if (count === 1) return true;
    if (count === 2) return _.first(arguments) <= L.second(arguments);

    for (var i = 1; i < count; i++) {
      if (arguments[i-1] > arguments[i]) {
        return false;
      }
    }

    return true;
  };

  L.decreasingOrEq = function() {
    var count = _.size(arguments);
    if (count === 1) return true;
    if (count === 2) return _.first(arguments) >= L.second(arguments);

    for (var i = 1; i < count; i++) {
      if (arguments[i-1] < arguments[i]) {
        return false;
      }
    }

    return true;
  };

  L.meth = function(method) {
    return function(target /* args ... */) {
      return method.apply(target, _.rest(arguments));
    };
  };

  L.assoc = function(obj, keys, value) {
    if (!L.isAssociative(obj)) throw "Attempting to assoc a non-associative object."

    var target = obj;
    var lastKey = _.last(keys);

    _.each(L.butLast(keys), function(key) {
      target = target[key];
    });

    target[lastKey] = value;
    return obj;
  };

  // Combinators
  // -----------

  L.constantly = L.k = function(value) {
    return function() { return value; };
  };

  L.pipeline = L.thrush = L.t = function(){
    return _.reduce(arguments, function(l,r) { return r(l); });
  };

  L.compose = function(/* funs */) {
    var restFuns = L.butLast(arguments).reverse();
    var fun = _.last(arguments);

    return function(/* args */) {
      var callChain = L.cons(fun.apply(null, arguments), restFuns);
      return L.pipeline.apply(null, callChain);
    };
  };

  // var isPositiveEven = L.conjoin(L.isPos, L.isEven);
  // isPositiveEven([2,4,6,7,8])
  // isPositiveEven([2,4,6,8])

  L.conjoin = L.everyPred = function(/* preds */) {
    var preds = _.toArray(arguments);

    return function(coll) {
      return _.every(coll, function(e) {
        return _.every(preds, function(p) {
          return p(e);
        });
      });
    };
  };

  // var orPositiveEven = L.disjoin(L.isPos, L.isEven);
  // orPositiveEven([-1, -3])
  // orPositiveEven([-1,2,3,4,5,6])

  L.disjoin = L.someFun = function(/* preds */) {
    var preds = _.toArray(arguments);

    return function(coll) {
      return _.some(coll, function(e) {
        return _.some(preds, function(p) {
          return p(e);
        });
      });
    };
  };

  // Applicative functions
  // ---------------------

  // (1.2)
  L.mapcat = function(fun, coll) {
    return L.cat.apply(null, _.map(coll, fun));
  };

  // closure (2.2)
  L.complement = function(pred) {
    return function() {
      return !pred.apply(null, _.toArray(arguments));
    };
  };

  // closure (2.2)
  L.plucker = L.accessor = function(field) {
    return function(obj) {
      return (obj && obj[field]);
    };
  };

  L.repeatedly = function(times, fun) {
    return _.map(_.range(times), fun);
  };

  L.iterateUntil = function(doit, checkit, seed) {
    var ret = [];
    var result = doit(seed);

    while (checkit(result)) {
      ret.push(result);
      result = doit(result);
    }

    return ret;
  };

  L.reductions = function(fun, init, coll) {
    var ret = [];
    var acc = init;

    _.each(coll, function(v,k) {
      acc = fun(acc, coll[k]);
      ret.push(acc);
    });

    return ret;
  };

  L.dropWhile = function(pred, coll) {
    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!pred(coll[index]))
        break;
    }

    return _.drop(coll, index);
  };

  L.takeWhile = function(pred, coll) {
    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!pred(coll[index]))
        break;
    }

    return _.take(coll, index);
  };

  // Delicious curry
  // ---------------

  L.curry2 = function(fun) {
    return function(a) {
      return function(b) {
	      return fun(b, a);
	    };
    };
  };

  L.curry3 = function(fun) {
    return function(a) {
      return function(b) {
        return function(c) {
          return fun(c, b, a);
        };
      };
    };
  };

  // Partial application
  // -------------------

  L.$ = undefined;

  L.partial$ = function(fun) {
    var args = _.rest(arguments);
    var f = function() {
      var arg = 0;

      for ( var i = 0; i < args.length && arg < arguments.length; i++ )
        if ( args[i] === L.$ )
          args[i] = arguments[arg++];

      return fun.apply(null, args);
    };

    f.__original__ = fun;

    return f;
  };

  L.partial = function(fun, arg1) {
    return function() {
      return fun.apply(null, L.cons(arg1, _.toArray(arguments)));
    };
  }

  L.partial2 = function(fun, arg1, arg2) {
    return function() {
      return fun.apply(null, L.cat([arg1, arg2], _.toArray(arguments)));
    };
  }


  // Monadology
  // ----------

  L.def = function(stateFun, valueFun) {
    return function(a) {
      return function(b) {
        return {value: valueFun(b,a), state: stateFun(b,a)};
      };
    };
  };

  L.actions = function () {
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
  };

  // Ref-type protocol
  // -----------------

  L.WatchableProtocol = (function () {
    var watchers = {};

    return {
      notify: function(oldVal, newVal) {
        _.each(watchers, function(watcher, key) {
          watcher.call(this, key, oldVal, newVal);
        });

        return _.size(watchers);
      },
      watch: function(key, fun) {
        watchers[key] = fun;
        return key;
      },
      unwatch: function(key) {
        var old = watchers[key];
        watchers = _.omit(watchers, key);
        return old;
      }
    };
  })();

  L.addWatch    = L.meth(L.WatchableProtocol.watch);
  L.removeWatch = L.meth(L.WatchableProtocol.unwatch);

  L.Ref = function(init, validator) {
    this.__value__ = init;
    this.__validator__ = validator;
  };

  L.RefProtocol = {
    setValue: function(newVal) {
      var validate = this.__validator__;
      var oldVal   = this.__value__;

      if (L.existy(validate))
        if (!validate(newVal))
          throw "Attempted to set invalid value " + newVal;

      this.__value__ = newVal;
      this.notify(oldVal, newVal);
      return this.__value__;
    },
    swap: function(fun /* , args... */) {
      return this.setValue(fun.apply(this, L.cons(this.__value__, _.rest(arguments))));
    },
    snapshot: function() {
      return _.clone(this.__value__);
    }
  };

  _.extend(L.Ref.prototype,
           L.RefProtocol,
           L.WatchableProtocol);

  L.setValue = L.meth(L.Ref.prototype.setValue);
  L.swap     = L.meth(L.Ref.prototype.swap);
  L.snapshot = L.meth(L.Ref.prototype.snapshot);

  // CAS reference type
  // ------------------

  L.CAS = L.Ref;

  L.CASProtocol = {
    compareAndSet: function(oldVal, newVal) {
      if (this.__value__ === oldVal) {
        this.setValue(newVal);
        return true;
      }
      else {
        return undefined;
      }
    }
  };

  _.extend(L.CAS.prototype, L.CASProtocol);

  L.compareAndSet = L.meth(L.CAS.prototype.compareAndSet);


  // Exports and sundries
  // --------------------

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

var push = L.def(
  function(e, stack) {
    return [e].concat(stack);
  },
  L.constantly(undefined));

var pop = L.def(
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
