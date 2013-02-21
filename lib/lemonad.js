//    Lemonad.js
//    http://www.functionaljs.org
//    (c) 2012 Fogus, Ariadne Softworks
//    Lemonad may be freely distributed under the MIT license

// *the secret JavaScript sauce*
(function() {
  // Setup
  // -----

  // Establish the root object, `window` in the browser, or `global` on the server.
  // *taken from [Underscore.js](http://underscorejs.org/)*

  var root = this;

  // The namespace object `L` is a function in its own right that returns
  // a partially applied function of an arbitrary number of arguments.

  var L = function(fun /*, args */) {
    var args = _.rest(arguments);

    // default to the native `bind` if available
    if (L.existy(fun.bind)) {
      return fun.bind.apply(fun, L.cons(undefined, args));
    }

    return function(/* arguments */) {
      return fun.apply(null, args.concat(_.toArray(arguments)));
    };
  };

  // Current version
  L.VERSION = '0.4.6';

  // Internal utilities
  // ------------------

  // A simple function to throw an `Error`
  function fail(str) {
    throw new Error(str);
  }

  // A portable way to get the prototype of an object based on
  // Dave Herman's excellent "Effective JavaScript"
  var getProto = (typeof Object.getPrototypeOf === 'undefined') ?
    (function(obj) {
        var t = typeof obj;

        if (!obj || (t !== 'object' && t !== 'function'))
          throw new TypeError("not an object");

        return obj.__proto__;
    })
    :
    (function(obj) { return Object.getPrototypeOf(obj) });

  // Clones an object. Based on the version by
  // [Keith Devens](http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone)
  // until I can find a more efficient way to do it.

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
    if (L.existy(thing.snapshot))
      return thing.snapshot();
    else
      return theClonusHorror(thing);
  };

  // Useful tools
  // ------------

  // Used as a unique value to signify certain conditions in Lemonad.
  // Also takes a number of args and returns an array of unique values.
  L.$ = function(){
    return _.uniq(arguments);
  };

  L.not = function(b){ return !b; };

  // increment, decrement and halve
  L.inc = function(n) { return n+1; };
  L.dec = function(n) { return n-1; };
  L.halve = function(n) { return n/2; };

  // type
  L.ctor = function(obj) {
    return L.existy(obj) ? obj.constructor : null;
  };

  // a function to get at an index into an array
  L.nth = function(a,index) {
    if (!_.isNumber(index)) fail("Expecting a integer as the index argument.");
    if (!L.isIndexed(a) && !_.isArguments(a)) fail("Indexing not supported on non-indexed types.");
    if ((index < 0) || (index > a.length - 1)) fail("Attempting to index outside the bounds of the array.");

    return a[index];
  };

  // 'explodes' a string into an array of chars
  L.explode = function(s) {
    return s.split('');
  };

  // 'implodes' and array of chars into a string
  L.implode = function(a) {
    return a.join('');
  };

  // Useful predicates
  // -----------------

  // Returns true if a value is 'existy', i.e. is not
  // `undefined` nor `null`
  L.existy = function(x) { return x != null; };

  // Everything but `false` and `null` are truthy
  L.truthy = function(x) { return (x !== false) && L.existy(x); };
  L.falsey = function(x) { return !L.truthy(x); };

  // ### Type predicates

  // A wrapper around instanceof
  L.isInst = function(x, t) { return (x instanceof t); };

  // An associative object is one where its elements are
  // accessed via a key or index. (i.e. array and object)
  L.isAssociative = function(x) { return _.isArray(x) || _.isObject(x); };

  // An indexed object is anything that allows numerical index for
  // accessing its elements (e.g. arrays and strings)
  L.isIndexed = function(data) {
    return _.isArray(data) || _.isString(data);
  };

  // A reference is something that derives from a Lemonad Hole object
  L.isReference = function(x) { 
    return (x instanceof L.Hole) || (x instanceof L.CAS);
  };

  // A seq is something considered a sequential composite type (i.e. arrays and `arguments`)
  L.isSeq = function(x) { return (_.isArray(x)) || (_.isArguments(x)); };

  // ### Numeric predicates

  // These do what you think that they do

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

  // Concatenates one or more arrays given as arguments
  L.cat = function() {
    var head = _.first(arguments);
    var args = _.rest(arguments);
    if (L.existy(head))
      return head.concat.apply(head, args);
    else
      return [];
  };

  // 'Pours' one or more arguments into an array
  L.pour = function() {
    if (!_.isArray(_.first(arguments))) fail("Cannot pour into a non-array.");

    return L.cat.apply(null, arguments);
  };

  // 'Pours' one array into another
  L.into = function(l, r) {
    if (!_.isArray(l) || !_.isArray(r)) fail("Cannot into a non-array into a non-array.");

    return L.cat.call(null, l, r);
  };

  // 'Constructs' an array by putting an element at its front
  L.cons = L.construct = function(head, tail) {
    return L.cat([head], tail);
  };

  // Returns all but the last element in an array
  L.butLast = function(coll) {
    if (!L.isSeq(coll)) fail("Cannot butLast a non-sequence");

    return _.toArray(coll).slice(0, -1);
  };

  // Merges two or more objects starting with the left-most and
  // applying the keys right-word
  L.merge = function(/* objs */){
    var dest = _.some(arguments) ? {} : null;

    if (L.truthy(dest))
      _.extend.apply(null, L.cons(dest, _.toArray(arguments)));

    return dest;
  };

  // Takes an array and parititions it some number of times with
  // sub-arrays of size n.  Allows and optional padding array as
  // the third argument to fill in the tail partition when n is
  // not sufficient to build paritions of the same size.
  L.partition = function(n, coll /*, pad */) {
    var pad = arguments[2];

    var p = function(coll) {
      if (!L.existy(coll)) return [];

      var part = _.take(coll, n);

      if (n === _.size(part))
        return L.cons(part, p(_.drop(coll, n)));
      else
        return pad ? [_.take(L.cat(part, pad), n)] : [];
    };

    return p(coll);
  };

  // Returns an array with some item between each element
  // of a given array
  L.interpose = function(inter, coll) {
    if (!_.isArray(coll)) fail("expected an array as the second arg.");
    var sz = _.size(coll);
    if (sz === 0) return coll;
    if (sz === 1) return coll;

    return L.butLast(L.mapcat(function(e) { return L.cons(e, [inter]); }, coll));
  };

  // Weaves two or more arrays together
  L.interleave = function(/* args */) {
    return _.filter(_.flatten(_.zip.apply(null, arguments)), L.existy);
  };

  // Returns an array of a value repeated a certain number of
  // times.
  L.repeat = function(times, elem) {
    if (!L.existy(times)) fail("expected a number as the first arg");

    return _.map(_.range(times), function(_) { return elem; });
  };

  L.cycle = function(times, elems) {
    if (!L.existy(times)) fail("expected a number as the first arg");

    return L.mapcat(function(_) {
      return elems;
    }, _.range(times));
  };

  // Returns the second element in an array
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
      if (!L.existy(target)) {
        return undefined;
      }

      var methodName = nom(method).trim();
      var targetMethod = target[methodName];
      var args = _.rest(arguments);

      if (L.existy(targetMethod) && (method === targetMethod)) {
        return targetMethod.apply(target, L.cat(pargs, args));
      }
      else {
        return undefined;
      }
    };
  };

  // Builds a polymorphic function. (more description TBD)
  L.poly = function (/* funs */) {
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
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

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
      if (L.existy(obj[old])) {
        o[nu] = obj[old];
        return o;
      }
      else
        return o;
    },
    _.omit.apply(null, L.cons(obj, _.keys(kobj))));
  };

  L.selectKeys = function (obj, ks){
    return _.pick.apply(null, L.cons(obj, ks));
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
    if (!L.existy(seed)) fail("Expected a seed value.")

    return _.reduce(_.rest(arguments),
                    function(l,r) { return r(l); },
                    seed);
  };

  // Composes a number of functions, right to left, into a single
  // function.
  L.compose = function(/* funs */) {
    var restFuns = L.butLast(arguments).reverse();
    var fun = _.last(arguments);

    return function(/* args */) {
      var callChain = L.cons(fun.apply(null, arguments), restFuns);
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

  // Updates the value at any depth in a nested object based on the
  // path described by the keys given.
  L.assoc = function(obj, keys, value) {
    return L.update(obj, keys, L.k(value));
  };

  // Returns an array of existy results of a function over an source array.
  L.keep = function(pred, coll) {
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    return _.filter(_.map(coll, function(e) {
      return pred(e);
    }),
    L.existy);
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
    L.existy);
  };

  // Maps a function over an array and concatenates all of the results.
  L.mapcat = function(fun, coll) {
    return L.cat.apply(null, _.map(coll, fun));
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
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!L.truthy(pred(coll[index])))
        break;
    }

    return _.drop(coll, index);
  };

  // Takes all items in an array while a given predicate returns truthy.
  L.takeWhile = function(pred, coll) {
    if (!L.isSeq(coll)) fail("expected an array for the second arg");

    var sz = _.size(coll);

    for (var index = 0; index < sz; index++) {
      if(!L.truthy(pred(coll[index])))
        break;
    }

    return _.take(coll, index);
  };

  // Takes an array and partitions it as the given predicate changes
  // truth sense.
  L.partitionBy = function(fun, coll){
    if (_.isEmpty(coll) || !L.existy(coll)) return [];

    var fst    = _.first(coll);
    var fstVal = fun(fst);
    var run    = L.cons(fst, L.takeWhile(function(e) {
      return _.isEqual(fstVal, fun(e));
    }, _.rest(coll)));

    return L.cons(run, L.partitionBy(fun, _.drop(coll, _.size(run))));
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
        var f = _.compose.apply(null, L.cat([L.not, pred], args));
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
        if (!L.existy(args[i]))
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
      if (L.truthy(fun(x, y)))
        return -1;
      else if (L.truthy(fun(y, x)))
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

    f.__original__ = fun;

    return f;
  };

  // Partially applies a function by one argument from left to right
  L.partial1 = function(fun, arg1) {
    return function() {
      return fun.apply(null, L.cons(arg1, _.toArray(arguments)));
    };
  };

  // Partially applies a function by two arguments from left to right
  L.partial2 = function(fun, arg1, arg2) {
    return function() {
      return fun.apply(null, L.cat([arg1, arg2], _.toArray(arguments)));
    };
  };

  // Flips the first two args of a function
  L.flip2 = function(fun) {
    return function(/* args */) {
      var args = _.toArray(arguments);
      var tmp = args[0];
      args[0] = args[1];
      args[1] = tmp;

      return fun.apply(fun, args);
    };
  };

  // ### Partially applied implementations

  // Monadology
  // ----------

  L.def = function(stateFun, valueFun) {
    return function(a) {
      return function(b) {
        return {value: valueFun(b,a), state: stateFun(b,a)};
      };
    };
  };

  // Takes a number of curried functions that modifies
  // an intermediate description of mutation.  The final
  // function in the sequence is meant to return the final
  // value in the chain.
  L.actions = function () {
    var args           = _.toArray(arguments);
    var continuation   = _.last(args);
    var acts = L.butLast(args);

    return function (state) {
      var init = { values: [], state: state };

      var finalState = _.reduce(acts,
        function (state, action) {
          var result = action(state.state);
          var values = L.cat(state.values, result.value);

          return { values: values, state: result.state };
        },
        init);

      var values = _.filter(finalState.values, L.existy);

      return continuation.apply(null, values)(finalState.state);
    };
  };

  // Ref-type protocol
  // -----------------

  // The Watchable protocol ancapsulates the Subscriber/Observer
  // pattern
  L.WatchableProtocol = (function () {
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
  L.addWatch    = L.meth(L.WatchableProtocol.watch);
  L.removeWatch = L.meth(L.WatchableProtocol.unwatch);

  // A hole is a mutable cell:
  //  * Takes an initial value
  //  * Accepts an optional validator
  L.Hole = function(init, validator) {
    if (validator && !validator(init))
      fail("Attempted to set invalid value " + init + " on construction");

    this.__value__ = init;
    this.__validator__ = validator;
  };

  // The Hole protocol describes the following change policy:
  //  * All value setting goes through the validator (if available)
  //  * Swaps take a function that accepts the current value and
  //    set the new value with its result
  //  * Snapshots should be values
  L.HoleProtocol = {
    setValue: function setValue(newVal) {
      var validate = this.__validator__;
      var oldVal   = this.__value__;

      if (L.existy(validate))
        if (!validate(newVal))
          fail("Attempted to set invalid value " + newVal);

      this.__value__ = newVal;
      this.notify(oldVal, newVal);
      return this.__value__;
    }
  };

  L.SwapProtocol = {
    swap: function swap(fun /* , args... */) {
      return this.setValue(fun.apply(this, L.cons(this.__value__, _.rest(arguments))));
     },
    // Delegate down to the L.snapshot function
    snapshot: function snapshot() {
      return L.snapshot(this.__value__);
    }
  };

  _.extend(L.Hole.prototype,
           L.HoleProtocol,
           L.SwapProtocol,
           L.WatchableProtocol);

  // The function delegates.
  L.setValue = L.meth(L.Hole.prototype.setValue);
  L.swap     = L.meth(L.Hole.prototype.swap);

  // CAS reference type
  // ------------------

  // A CAS is a Hole with compare-and-swap semantics
  L.CAS = function() {
    L.Hole.apply(this, arguments);
  };

  L.CASProtocol = {
    // A compareAndSwap expects the caller to supply a
    // value that it expects is the current value. Change
    // fails if these values do not match.
    compareAndSwap: function compareAndSwap(oldVal, f) {
      if (this.__value__ === oldVal) {
        this.setValue(f(this.__value__));
        return true;
      }
      else {
        return undefined;
      }
    }
  };

  _.extend(L.CAS.prototype, 
           L.CASProtocol,
           L.HoleProtocol,
           L.SwapProtocol,
           L.WatchableProtocol);

  // The CAS function delegate.
  L.compareAndSwap = L.meth(L.CAS.prototype.compareAndSwap);

  // Checkers and conditions
  // --------------------------

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
