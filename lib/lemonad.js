//    Lemonad.js
//    http://www.functionaljs.org
//    (c) 2012 Fogus, Ariadne Softworks
//    Lemonad may be freely distributed under the MIT license

// *the secret JavaScript sauce**
(function() {
  // Setup
  // -----

  var root = this;

  var L = function(fun /*, args */) {
    var args = _.rest(arguments);

    return function(/* arguments */) {
      return fun.apply(null, args.concat(_.toArray(arguments)));
    };
  };

  L.VERSION = '0.2.1';
  
  // Utilities

  //
  // from http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
  //
  function theClonusHorror(obj) {
    if(obj == null || typeof(obj) != 'object')
      return obj;

    var temp = new obj.constructor();
    for(var key in obj)
      temp[key] = theClonusHorror(obj[key]);

    return temp;
  }

  function fail(str) {
    throw new Error(str);
  }

  L.snapshot = function(thing) {
    if (L.existy(thing.snapshot))
      return thing.snapshot();
    else
      return theClonusHorror(thing);
  };

  // Useful predicates
  // -----------------

  L.existy = function(x) { return x != null; };
  L.truthy = function(x) { return (x !== false) && L.existy(x); };
  L.isAssociative = function(x) { return _.isArray(x) || _.isObject(x); };
  L.isReference = function(x) { return x.constructor === L.Ref; };
  L.isSeq = function(x) { return (_.isArray(x)) || (_.isArguments(x)); };
  L.isEven = function(x) {
    if (!L.existy(x)) return false;
    return L.isZero(x & 1); 
  };
  L.isOdd = function(x) { return !L.isEven(x); };
  L.isPos = function(x) { return x > 0; };
  L.isNeg = function(x) { return x < 0; };
  L.isZero = function(x) { return 0 === x; };

  // Basic functions
  // ---------------

  // (1.2)
  L.cat = function() {
    var args = _.toArray(arguments);
    var head = _.first(args);
    return head.concat.apply(head, _.rest(args));
  };

  L.pour = function() {
    if (!_.isArray(_.first(arguments))) fail("Cannot pour into a non-array.");

    return L.cat.apply(null, arguments);
  };

  L.into = function(l, r) {
    if (!_.isArray(l) || !_.isArray(r)) fail("Cannot into a non-array into a non-array.");

    return L.cat.call(null, l, r);
  };

  // (1.2)
  L.cons = function(head, tail) {
    return L.cat([head], tail);
  };

  // (1.2)
  L.butLast = function(coll) {
    if (!L.isSeq(coll)) fail("Cannot butLast a non-sequence");

    return _.toArray(coll).slice(0, -1);
  };

  // (2.1)
  L.interpose = function(inter, coll) {
    if (!_.isArray(coll)) fail("expected an array as the second arg.");
    var sz = _.size(coll);
    if (sz === 0) return coll;
    if (sz === 1) return coll;

    return L.butLast(L.mapcat(function(e) { return L.cons(e, [inter]); }, coll));
  };

  L.interleave = function(/* args */) {
    return _.filter(_.flatten(_.zip.apply(null, arguments)), L.existy);
  };

  L.repeat = function(times, elem) {
    if (!L.existy(times) || L.isNeg(times)) fail("expected a positive number as the first arg");

    return _.map(_.range(times), function(_) { return elem; });
  };

  L.second = function(coll) { 
    if (!_.isArray(coll)) fail("cannot take the second element of a non-array");

    return _.first(_.rest(coll)); 
  };

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

  L.meth = L.walterWhite = function(method) {
    return function(target /* args ... */) {
      return method.apply(target, _.rest(arguments));
    };
  };

  L.splitAt = function(index, coll) {
    if (!_.isNumber(index)) fail("expected a number for the first arg");
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    return [_.take(coll, index), _.drop(coll, index)];
  };

  // L.takeSkipping(2, _.range(10))
  // [0, 2, 4, 6, 8]

  L.takeSkipping = function(n, coll) {
    if (!_.isNumber(n)) fail("expected a number for the first arg");
    if (!_.isArray(coll)) fail("expected an array for the second arg");

    var ret = [];
    var sz = _.size(coll);

    for(var index = 0; index < sz; index += n) {
      ret.push(coll[index]);
    }

    return ret;
  };

  // Combinators
  // -----------

  L.constantly = L.always = L.k = function(value) {
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

  // L.splitWith(function(n) { return n <= 3 }, [1,2,3,4,5])

  L.splitWith = function(pred, coll) {
    // defer seq check to the *While functions
    return [L.takeWhile(pred, coll), L.dropWhile(pred, coll)];
  };

  L.update = function(obj, ks, fun) {
    if (!L.isAssociative(obj)) fail("Attempting to assoc a non-associative object.");

    var deepness = _.isArray(ks);
    var keys     = deepness ? ks : [ks];
    var ret      = deepness ? L.snapshot(obj) : _.clone(obj);
    var lastKey  = _.last(keys);
    var target   = ret;

    _.each(L.butLast(keys), function(key) {
      target = target[key];
    });

    target[lastKey] = fun(target[lastKey]);
    return ret;
  };

  L.assoc = function(obj, keys, value) {
    return L.update(obj, keys, L.k(value));
  };

  // L.keep(L.isEven, _.range(1, 10))
  // [false, true, false, true, false, true, false, true, false]
  // L.keep(function(e) { return (L.isEven(e)) ? e : undefined }, _.range(10))
  // [0, 2, 4, 6, 8]

  L.keep = function(pred, coll) {
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    return _.filter(_.map(coll, function(e) {
      return pred(e);
    }),
    L.existy);
  };

  // L.remove(L.isPos, [0,1,2,-1,3])
  // [0, -1]

  L.remove = function(pred, coll) {
    var notPred = L.complement(pred);

    return L.keep(function(e) {
      return (notPred(e)) ? e : undefined;
    }, coll);
  };

  // L.maxKey(_.size, [1,2], [2], [4,5,6])
  // [4,5,6]

  L.maxKey = function(fun /*, args */) {
    var args = _.rest(arguments);
    var sz = _.size(args);
    var h = _.first(args);
    var s = L.second(args);

    if (sz === 1) return h;
    if (sz === 2) return (fun(h) > fun(s)) ? h : s;

    return _.reduce(args,
      function(agg, e) {
        return L.maxKey(fun, agg, e);
      },
      L.maxKey(fun, h, s));
  };

  // L.keepIndexed(function(k, v) { return L.isOdd(k) ? v : undefined }, ['a', 'b', 'c', 'd', 'e'])
  // ['b', 'd']

  L.keepIndexed = function(pred, coll) {
    return _.filter(_.map(_.range(_.size(coll)), function(i) {
      return pred(i, coll[i]);
    }),
    L.existy);
  };

  // (1.2)
  L.mapcat = function(fun, coll) {
    return L.cat.apply(null, _.map(coll, fun));
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

  // var f = L.juxt(L.isPos, L.isEven, L.isZero);
  // f(1)
  // [true, false, false]

  L.juxt = function(/* funs */) {
    var funs = _.toArray(arguments);

    return function(arg) {
      return _.map(funs, function(f) {
        return f(arg);
      });
    };
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
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!L.truthy(pred(coll[index])))
        break;
    }

    return _.drop(coll, index);
  };

  L.takeWhile = function(pred, coll) {
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!L.truthy(pred(coll[index])))
        break;
    }

    return _.take(coll, index);
  };

  // HOFs
  // ----

  // (4.1)
   L.best = function(fun, coll) {
     return _.reduce(coll, function(x, y) {                                                         return fun(x, y) ? x : y;
    });
  };

  // closure (2.2)
  L.complement = function(pred) {
    return function() {
      return !pred.apply(null, _.toArray(arguments));
    };
  };

  // function hi(f,l) { alert("Hi there " + f + " " + l) }
  // hi('m', 'f')
  // var hiWithDefaultFirstName = L.fnull(hi, "Mike");
  // hiWithDefaultFirstName(null, "f")
  // var hiWithDefaultFirstAndLastName = L.fnull(hi, "Mike", "Fogus");
  // hiWithDefaultFirstAndLastName(null, null)
  // hiWithDefaultFirstAndLastName()

  L.fnull = L.funull = function(fun /*, args */) {
    var defaults = _.rest(arguments);

    return function(/*args*/) {
      var args = _.toArray(arguments);
      var sz = _.size(defaults);

      for(var i = 0; i < sz; i++) {
        if (!L.existy(args[i]))
          args[i] = defaults[i];
      }

      return fun.apply(null, args);
    };
  };

  // Delicious curry
  // ---------------

  L.curry2 = function(fun) {
    return function(last) {
      return function(first) {
        return fun(first, last);
      };
    };
  };

  L.curry3 = function(fun) {
    return function(last) {
      return function(middle) {
        return function(first) {
          return fun(first, middle, last);
        };
      };
    };
  };

  // ### Curried impls

  // L.frequencies(['a','a','b','a'])
  L.frequencies = L.curry2(_.countBy)(_.identity);

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
  };

  L.partial2 = function(fun, arg1, arg2) {
    return function() {
      return fun.apply(null, L.cat([arg1, arg2], _.toArray(arguments)));
    };
  };


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
          fail("Attempted to set invalid value " + newVal);

      this.__value__ = newVal;
      this.notify(oldVal, newVal);
      return this.__value__;
    },
    swap: function(fun /* , args... */) {
      return this.setValue(fun.apply(this, L.cons(this.__value__, _.rest(arguments))));
    },
    snapshot: function() {
      return L.snapshot(this.__value__);
    }
  };

  _.extend(L.Ref.prototype,
           L.RefProtocol,
           L.WatchableProtocol);

  L.setValue = L.meth(L.Ref.prototype.setValue);
  L.swap     = L.meth(L.Ref.prototype.swap);

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
