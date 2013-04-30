//    Lemonad.js
//    http://www.functionaljs.org
//    (c) 2013 Fogus, Ariadne Softworks
//    Lemonad may be freely distributed under the MIT license

// *Always start with the secret JavaScript sauce...*
(function() {
  // Dependencies
  // ------------

  // I want to require Underscore.js if it's not already available.
  var _ = this._ || require('underscore');

  // Setup
  // -----

  // Establish the root object, `window` in the browser, or `global` on the server.

  var root = this;

  // The namespace object `L` is a function in its own right that returns
  // a partially applied function of an arbitrary number of arguments.
  // For example, you can use `L` to partially apply the first argument to the
  // `_.template` function:
  //
  //     var hi = L(_.template, "Hello <%= name %>");
  //     _.map([{name: 'Joe'}, {name: 'Bob'}, {name: 'Cleveland'}], hi);
  //
  //     //=> ["Hello Joe", "Hello Bob", "Hello Cleveland"]
  //
  // *signature:* `(any* -> a) -> any* -> (any* -> a)`
  //
  var L = function(fun /*, args */) {
    var args = _.rest(arguments);

    if (_.some(args)) {
      // Default to the native `bind` if available
      if (_.exists(fun.bind)) {
        return fun.bind.apply(fun, _.cons(undefined, args));
      }

      return function(/* arguments */) {
        return fun.apply(null, args.concat(_.toArray(arguments)));
      };
    }
    else return L.curry(fun);
  };

  // Current version
  L.VERSION = '0.6.0';

  // Internal utilities
  // ------------------

  // A simple function to throw an `Error`
  function fail(str) {
    throw new Error(str);
  }

  // Clones an object. Based on the version by
  // [Keith Devens](http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone)
  // until I can find a more efficient and robust way to do it.
  function theClonusHorror(obj) {
    if(obj == null || typeof(obj) != 'object')
      return obj;

    var temp = new obj.constructor();
    for(var key in obj)
      temp[key] = theClonusHorror(obj[key]);

    return temp;
  }

  // A temporary way to derive the name of a function. I hope to
  // eliminate the need sooner rather than later.
  // (a -> b) -> string

  function nom(fun) {
    var src = fun.toString();
    src = src.substr('function '.length);
    var n = src.substr(0, src.indexOf('('));

    if (!_.isFunction(fun)) fail("Cannot derive the name of a non-function.");
    if (fun.name && (fun.name === n)) return fun.name;
    if (n) return n;
    fail("Anonymous function has no name.");
  }

  // Delegates down to the snapshot method if an object has one
  // or clones the object outright if not.

  L.snapshot = function(thing) {
    if (_.exists(thing) && _.exists(thing.snapshot))
      return thing.snapshot();
    else
      return theClonusHorror(thing);
  };

  // Useful tools
  // ------------

  // Used as a unique value to signify certain conditions in Lemonad.
  // Also takes a number of args and returns an array of unique values.
  //
  // *signature:* `any* -> [any*]`

  L.$ = function(){
    return _.uniq(arguments);
  };

  // increment, decrement and halve
  // *signature:* `number -> number`
  L.inc = function(n) { return n+1; };
  L.dec = function(n) { return n-1; };
  L.halve = function(n) { return n/2; };

  // Returns the type constrcutor
  // *signature:* `{any: any} -> (any* -> any)`
  L.ctor = function(obj) {
    return _.exists(obj) ? obj.constructor : null;
  };

  // Useful predicates
  // -----------------

  // ### Type predicates

  // A reference is something that derives from a Lemonad Hole object
  // a -> boolean
  L.isReference = function(x) {
    return (x instanceof L.Hole) || (x instanceof L.CAS);
  };

  // Basic functions
  // ---------------

  // Returns an array with some item between each element
  // of a given array
  // a -> [any] -> [any a]
  L.interpose = function(inter, coll) {
    if (!_.isArray(coll)) fail("expected an array as the second arg.");
    var sz = _.size(coll);
    if (sz === 0) return coll;
    if (sz === 1) return coll;

    return _.initial(L.mapcat(function(e) { return _.cons(e, [inter]); }, coll));
  };

  // Weaves two or more arrays together
  // [any]* -> [any]
  L.interleave = function(/* args */) {
    return _.filter(_.flatten(_.zip.apply(null, arguments)), _.exists);
  };

  // Returns an array of a value repeated a certain number of
  // times.
  // number -> a -> [a]
  L.repeat = function(times, elem) {
    if (!_.exists(times)) fail("expected a number as the first arg");

    return _.map(_.range(times), function(_) { return elem; });
  };

  // number -> [any] -> [any]
  L.cycle = function(times, elems) {
    if (!_.exists(times)) fail("expected a number as the first arg");

    return L.mapcat(function(_) {
      return elems;
    }, _.range(times));
  };

  // Returns the second element in an array
  // [a any] -> any
  L.second = function(coll) {
    if (!_.isArray(coll)) fail("cannot take the second element of a non-array");

    return _.first(_.rest(coll));
  };

  // Returns true if its arguments are monotonically
  // increaing values; false otherwise.
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

  // Returns true if its arguments are monotonically
  // decreaing values; false otherwise.
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

  // Returns true if its arguments are monotonically
  // increaing (or pairwise equal) values; false
  // otherwise.
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

  // Returns true if its arguments are monotonically
  // decreaing (or pairwise equal) values; false
  // otherwise.
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

  // Returns a function that will invoke the given method
  // on any object that it receives as a argument.
  L.meth = L.walterWhite = L.invoker = function(method /*, args*/) {
    var pargs = _.rest(arguments);

    return function(target /* args ... */) {
      if (!_.exists(target)) {
        return undefined;
      }

      var methodName = nom(method).trim();
      var targetMethod = target[methodName];
      var args = _.rest(arguments);

      if (_.exists(targetMethod) && (method === targetMethod)) {
        return targetMethod.apply(target, _.cat(pargs, args));
      }
      else {
        return undefined;
      }
    };
  };

  // Builds a polymorphic function based on dispatch predicates.
  L.dispatcher = function (/* funs */) {
    var funs = _.toArray(arguments);
    var size = funs.length;

    return function(target /*, args */) {
      var ret = undefined;
      var args = _.rest(arguments);

      for (var funIndex = 0; funIndex < size; funIndex++) {
        var fun = funs[funIndex];
        ret = fun.apply(fun, cons(target, args));

        if (existy(ret)) return ret;
      }

      return ret;
    };
  };

  // Returns an array with two internal arrays built from
  // taking an original array and spliting it at an index.
  L.splitAt = function(index, coll) {
    if (!_.isNumber(index)) fail("expected a number for the first arg");
    if (!_.isSequential(coll)) fail("expected an array for the second arg");

    return [_.take(coll, index), _.drop(coll, index)];
  };

  // Takes every nth item from an array, returning an array of
  // the results.
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

  // Takes an object and another object of strings to strings where the second
  // object describes the kete renaming to occur in the first object.
  L.renameKeys = function(obj, kobj) {
    return _.reduce(kobj, function(o, nu, old) {
      if (_.exists(obj[old])) {
        o[nu] = obj[old];
        return o;
      }
      else
        return o;
    },
    _.omit.apply(null, _.cons(obj, _.keys(kobj))));
  };

  L.selectKeys = function (obj, ks){
    return _.pick.apply(null, _.cons(obj, ks));
  };

  function constructPair(pair, rests) {
    return [_.cons(_.first(pair), _.first(rests)),
            _.cons(L.second(pair), L.second(rests))];
  }

  L.unzip = function(pairs) {
    if (_.isEmpty(pairs)) return [[],[]];
    return constructPair(_.first(pairs), L.unzip(_.rest(pairs)));
  };

  // Combinators
  // -----------

  // Takes a value and returns a function that always returns
  // said value.
  L.constantly = L.always = L.k = function(value) {
    return function() { return value; };
  };

  // Takes some value as its first argument and runs it through a
  // pipeline of functions given as the rest arguments.
  L.pipeline = L.thrush = L.t = function(seed /*, args */){
    if (!_.exists(seed)) fail("Expected a seed value.")

    return _.reduce(_.rest(arguments),
                    function(l,r) { return r(l); },
                    seed);
  };

  // Composes a number of functions, right to left, into a single
  // function.
  L.compose = function(/* funs */) {
    var restFuns = _.initial(arguments).reverse();
    var fun = _.last(arguments);

    return function(/* args */) {
      var callChain = _.cons(fun.apply(null, arguments), restFuns);
      return L.pipeline.apply(null, callChain);
    };
  };

  // Composes a bunch of predicates into a single predicate that
  // checks all elements of an array for conformance to all of the
  // original predicates.
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

  // Composes a bunch of predicates into a single predicate that
  // checks all elements of an array for conformance to any of the
  // original predicates.
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

  // Takes a function expecting regulars args and
  // returns a function that takes an array and
  // uses its elements as the args to  the original
  // function
  L.splat = function(fun) {
    return function(array) {
      return fun.apply(null, array);
    };
  };

  // Takes a function expecting an array and returns
  // a function that takes regular args and wraps all
  // in an array that is passed to the original function.
  L.unsplat = function(fun) {
    return function() {
      return fun.call(null, _.toArray(arguments));
    };
  };

  // Applicative functions
  // ---------------------

  // Returns an array with two internal arrays built from
  // taking an original array and spliting it at the index
  // where a given function goes falsey.
  L.splitWith = function(pred, coll) {
    // defer seq check to the *While functions
    return [L.takeWhile(pred, coll), L.dropWhile(pred, coll)];
  };

  // Updates the value at any depth in a nested object based on the
  // path described by the keys given.  The function provides is supplied
  // the current value and is expected to return a value for use as the
  // new value.
  L.update = function(obj, ks, fun) {
    if (!_.isAssociative(obj)) fail("Attempting to assoc a non-associative object.");

    var deepness = _.isArray(ks);
    var keys     = deepness ? ks : [ks];
    var ret      = deepness ? L.snapshot(obj) : _.clone(obj);
    var lastKey  = _.last(keys);
    var target   = ret;

    _.each(_.initial(keys), function(key) {
      target = target[key];
    });

    target[lastKey] = fun(target[lastKey]);
    return ret;
  };

  // Updates the value at any depth in a nested object based on the
  // path described by the keys given.
  L.assoc = function(obj, keys, value) {
    return L.update(obj, keys, L.k(value));
  };

  // Returns an array of existy results of a function over an source array.
  L.keep = function(pred, coll) {
    if (!_.isSequential(coll)) fail("expected an array for the second arg");

    return _.filter(_.map(coll, function(e) {
      return pred(e);
    }),
    _.exists);
  };

  // Removes all values from an array that result in a truthy
  // check of a given predicate.
  L.remove = function(pred, coll) {
    var notPred = L.complement(pred);

    return L.keep(function(e) {
      return (notPred(e)) ? e : undefined;
    }, coll);
  };

  // Returns the maximum value of its args based on the
  // result of a given function.
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

  // Returns an array of values found in an original array whose indexes
  // passed a truthy test by a given predicate.
  L.keepIndexed = function(pred, coll) {
    return _.filter(_.map(_.range(_.size(coll)), function(i) {
      return pred(i, coll[i]);
    }),
    _.exists);
  };

  // Maps a function over an array and concatenates all of the results.
  L.mapcat = function(fun, coll) {
    return _.cat.apply(null, _.map(coll, fun));
  };

  // Returns a function that will attempt to look up a named field
  // in any object that it's given.
  L.plucker = L.accessor = function(field) {
    return function(obj) {
      return (obj && obj[field]);
    };
  };

  // Returns an array of the given function called some number of times.
  L.repeatedly = function(times, fun) {
    return _.map(_.range(times), fun);
  };

  // Returns a function that returns an array of the calls to each
  // given function for some arguments.
  L.juxt = function(/* funs */) {
    var funs = _.toArray(arguments);

    return function(arg) {
      return _.map(funs, function(f) {
        return f(arg);
      });
    };
  };

  // Call a function recursively f(f(f(args))) until a second
  // given function goes falsey.  Expects a seed value to start.
  L.iterateUntil = function(doit, checkit, seed) {
    var ret = [];
    var result = doit(seed);

    while (checkit(result)) {
      ret.push(result);
      result = doit(result);
    }

    return ret;
  };

  // Redturns an array of each intermediate stage of a call to
  // `reduce`
  L.reductions = function(fun, init, coll) {
    var ret = [];
    var acc = init;

    _.each(coll, function(v,k) {
      acc = fun(acc, coll[k]);
      ret.push(acc);
    });

    return ret;
  };

  // Drops all items from an array while a given predicate returns truthy.
  L.dropWhile = function(pred, coll) {
    if (!_.isSequential(coll)) fail("expected an array for the second arg");

    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!_.truthy(pred(coll[index])))
        break;
    }

    return _.drop(coll, index);
  };

  // Takes all items in an array while a given predicate returns truthy.
  L.takeWhile = function(pred, coll) {
    if (!_.isSequential(coll)) fail("expected an array for the second arg");

    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!_.truthy(pred(coll[index])))
        break;
    }

    return _.take(coll, index);
  };

  // Takes an array and partitions it as the given predicate changes
  // truth sense.
  L.partitionBy = function(fun, coll){
    if (_.isEmpty(coll) || !_.exists(coll)) return [];

    var fst    = _.first(coll);
    var fstVal = fun(fst);
    var run    = _.cons(fst, L.takeWhile(function(e) {
      return _.isEqual(fstVal, fun(e));
    }, _.rest(coll)));

    return _.cons(run, L.partitionBy(fun, _.drop(coll, _.size(run))));
  };


  // HOFs
  // ----

  // Returns the 'best' value in an array based on the result of a
  // given function.
  L.best = function(fun, coll) {
    return _.reduce(coll, function(x, y) {
      return fun(x, y) ? x : y;
    });
  };

  // Returns a function that reverses the sense of a given predicate.
  L.complement = function(pred /*, more */) {
    var args = _.rest(arguments);

    if (_.some(args))
      return function() {
        var f = _.compose.apply(null, _.cat([_.not, pred], args));
        return f.apply(arguments);
      };
    else
      return function() {
        return !pred.apply(null, _.toArray(arguments));
      };
  };

  // Returns a function that protects a given function from receiving
  // non-existy values.  Each subsequent value provided to `fnull` acts
  // as the default to the original function should a call receive non-existy
  // values in the defaulted arg slots.
  L.fnull = L.funull = function(fun /*, args */) {
    var defaults = _.rest(arguments);

    return function(/*args*/) {
      var args = _.toArray(arguments);
      var sz = _.size(defaults);

      for(var i = 0; i < sz; i++) {
        if (!_.exists(args[i]))
          args[i] = defaults[i];
      }

      return fun.apply(null, args);
    };
  };

  //   [0, -1, -2].sort();
  //=> [-1, -2, 0]
  // Wat

  //   [0, -1, -2].sort(L.comparator(function(x,y) { return x < y }));
  //=> [-2, -1, 0]

  L.comparator = function(fun) {
    return function(x, y) {
      if (_.truthy(fun(x, y)))
        return -1;
      else if (_.truthy(fun(y, x)))
        return 1;
      else
        return 0;
    };
  };

  // Delicious curry
  // ---------------

  // Curries a function to one parameter.
  L.curry = L.curry1 = L.fix1 = L.schonfinkel = function(fun) {
    return function(arg) {
      return fun(arg);
    };
  };

  // Curries a function of two parameters from right to left.
  L.curry2 = L.fix2 = L.schonfinkel2 = function(fun) {
    return function(last) {
      return function(first) {
        return fun(first, last);
      };
    };
  };

  // Curries a function of three parameters from right to left.
  L.curry3 = L.fix3 = L.schonfinkel3 = function(fun) {
    return function(last) {
      return function(middle) {
        return function(first) {
          return fun(first, middle, last);
        };
      };
    };
  };

  // Curries a function of four parameters from right to left.
  L.curry4 = L.fix4 = L.schonfinkel4 = function(fun) {
    return function(fourth) {
      return function(third) {
        return function(second) {
          return function (first) {
            return fun(first, second, third, fourth);
          };
        };
      };
    };
  };

  // ### Curried impls

  // Returns an object where each element of an array is keyed to
  // the number of times that it occurred in said array.
  L.frequencies = L.curry2(_.countBy)(_.identity);

  // parses ints
  L.parseInt = L.curry(parseInt);

  // greater-than and less-than
  L.gt      = L.curry2(function(lhs, rhs) { return lhs > rhs; });
  L.lt      = L.curry2(function(lhs, rhs) { return lhs < rhs; });

  L.eq      = L.curry2(function(lhs, rhs) { return _.isEqual(lhs, rhs); });
  L.is      = L.curry2(function(lhs, rhs) { return lhs === rhs; });
  L.oneOf   = L.curry2(function(lhs, set) { return _.some(set, L.eq(lhs)); });

  // Partial application
  // -------------------

  // Partially applies a function based on the presense of the
  // L.$ placeholder.
  L.partial$ = function(fun) {
    var args = _.rest(arguments);
    var f = function() {
      var arg = 0;

      for ( var i = 0; i < args.length && arg < arguments.length; i++ )
        if ( args[i] === L.$ )
          args[i] = arguments[arg++];

      return fun.apply(null, args);
    };

    f._original = fun;

    return f;
  };

  // Partially applies a function by one argument from left to right
  L.partial1 = function(fun, arg1) {
    return function() {
      return fun.apply(null, _.cons(arg1, _.toArray(arguments)));
    };
  };

  // Partially applies a function by two arguments from left to right
  L.partial2 = function(fun, arg1, arg2) {
    return function() {
      return fun.apply(null, _.cat([arg1, arg2], _.toArray(arguments)));
    };
  };

  // Flips the first two args of a function
  L.flip = L.flip2 = function(fun) {
    return function(/* args */) {
      var args = _.toArray(arguments);
      var tmp = args[0];
      args[0] = args[1];
      args[1] = tmp;

      return fun.apply(fun, args);
    };
  };

  // Rotates the arguments of a function. For example:
  //    L.rot(fun(a, b, c)) => fun(b, c, a)

  L.rot = function(fun) {
    return function(/* args */) {
      var head = _.first(arguments);
      var more = _.rest(arguments);

      return fun.apply(fun, _.cat(more, [head]));
    };
  };

  // Monadology
  // ----------

  // Creates a function that works within the context of the
  // `actions` logic.  `lift` accepts 1 or two functions:
  //
  // 1. an answer function that serves as a way to calculate a
  //    result based on the given managed structure.
  // 2. a state function that 'modifies' the managed structure
  //    to represent its current state.
  //
  // If a state function is not given then the result given by the
  // answer function serves as the state value at each step.
  //
  L.lift = function(answerFun, stateFun) {
    return function(/* args */) {
      var args = _.toArray(arguments);

      return function(state) {
        var ans = answerFun.apply(null, _.cons(state, args));
        // If no stateFun given, just carry the answer forward
        var s = _.exists(stateFun) ? stateFun(state) : ans;

        return {answer: ans, state: s};
      };
    };
  };

  // Takes a number of curried functions that modifies
  // an intermediate description of mutation.  The final
  // function in the sequence is meant to return the final
  // value in the chain.
  L.actions = function (acts, done) {
    return function (seed) {
      var init = { values: [], state: seed };

      var intermediate = _.reduce(acts, function (stateObj, action) {
        var result = action(stateObj.state);
        var values = _.cat(stateObj.values, [result.answer]);
        return { values: values, state: result.state };
      }, init);

      var keep = _.filter(intermediate.values, _.exists);

      return done(keep, intermediate.state);
    };
  };

  // Ref-type mixin
  // -----------------

  // Mixes into a target object (destructively)

  L.mix = function(target /*, mixins */) {
    var args = _.rest(arguments);

    if (_.some(args))
      _.extend.apply(null, _.cons(target, args));

    return target;
  };

  // The Watchable mixin encapsulates the Subscriber/Observer
  // pattern
  L.WatchableMixin = (function () {
    var watchers = {};

    return {
      // The use of named function exprs is a temporary hack to make
      // these methods play nicely with `invoker`.  This is a non-portable
      // technique.
      notify: function notify(oldVal, newVal) {
        _.each(watchers, function(watcher, key) {
          watcher.call(this, key, oldVal, newVal);
        });

        return _.size(watchers);
      },
      // The watch function accepts a callback and
      // a descriptive key used for associating the
      // callback with a name of some sort.
      watch: function watch(key, fun) {
        watchers[key] = fun;
        return key;
      },
      // Takes the key and unsubscribes the watcher
      // associated with it.
      unwatch: function unwatch(key) {
        var old = watchers[key];
        watchers = _.omit(watchers, key);
        return old;
      }
    };
  })();

  // The functions for use with Watchable things
  L.addWatch    = L.meth(L.WatchableMixin.watch);
  L.removeWatch = L.meth(L.WatchableMixin.unwatch);

  // A hole is a mutable cell:
  //  * Takes an initial value
  //  * Accepts an optional validator
  L.Hole = function(init, validator) {
    if (validator && !validator(init))
      fail("Attempted to set invalid value " + init + " on construction");

    this._value = init;
    this._validator = validator;
  };

  // The Hole mixin describes the following change policy:
  //  * All value setting goes through the validator (if available)
  //  * Swaps take a function that accepts the current value and
  //    set the new value with its result
  //  * Snapshots should be values
  L.HoleMixin = {
    setValue: function setValue(newVal) {
      var validate = this._validator;
      var oldVal   = this._value;

      if (_.exists(validate))
        if (!validate(newVal))
          fail("Attempted to set invalid value " + newVal);

      this._value = newVal;
      this.notify(oldVal, newVal);
      return this._value;
    }
  };

  L.SwapMixin = {
    swap: function swap(fun /* , args... */) {
      return this.setValue(fun.apply(this, _.cons(this._value, _.rest(arguments))));
     },
    // Delegate down to the L.snapshot function
    snapshot: function snapshot() {
      return L.snapshot(this._value);
    }
  };

  L.mix(L.Hole.prototype,
        L.HoleMixin,
        L.SwapMixin,
        L.WatchableMixin);

  // The function delegates.
  L.setValue = L.meth(L.Hole.prototype.setValue);
  L.swap     = L.meth(L.Hole.prototype.swap);

  // CAS reference type
  // ------------------

  // A CAS is a Hole with compare-and-swap semantics
  L.CAS = function() {
    L.Hole.apply(this, arguments);
  };

  L.CASMixin = {
    // A compareAndSwap expects the caller to supply a
    // value that it expects is the current value. Change
    // fails if these values do not match.
    compareAndSwap: function compareAndSwap(oldVal, f) {
      if (this._value === oldVal) {
        this.setValue(f(this._value));
        return true;
      }
      else {
        return undefined;
      }
    }
  };

  L.mix(L.CAS.prototype,
        L.CASMixin,
        L.HoleMixin,
        L.SwapMixin,
        L.WatchableMixin);

  // The CAS function delegate.
  L.compareAndSwap = L.meth(L.CAS.prototype.compareAndSwap);

  // Checkers and conditions
  // --------------------------

  // *may get pulled out into another lib*

  // Creates a validation function: one that takes
  // some number of arguments and returns a truthy value
  // if it "looks good".  Checkers also have a `message`
  // field useful for building human-readble error messages.
  L.checker = function(message, fun) {
    var f = function(/* args */) {
      return fun.apply(fun, arguments);
    };

    f['message'] = message;
    return f;
  };

  function condition1(/* checkers */) {
    var checkers = _.toArray(arguments);

    return function(fun, arg) {
      var errors = mapcat(function(isValid) {
        return isValid(arg) ? [] : [isValid.message];
      }, checkers);

      if (!_.isEmpty(errors))
        throw new Error(errors.join(", "));

      return fun(arg);
    };
  };

  // Trampolining
  // ------------

  L.trampoline = function(fun /*, args */) {
    var result = fun.apply(fun, _.rest(arguments));

    while (_.isFunction(result)) {
      result = result();
    }

    return result;
  };

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
