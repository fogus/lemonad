//    lemonad.js
//    http://www.functionaljs.org
//    (c) 2013 Fogus, Ariadne Softworks and Juxt Labs
//    Lemonad may be freely distributed under the MIT license

// *Always start with the secret JavaScript sauce...*
;(function() {
  // Dependencies
  // ------------

  // Setup
  // -----

  // Establish the root object, `window` in the browser, or `global` on the server.

  var root = this;

  // The namespace object `L` is a function in its own right that returns
  // a partially applied function of an arbitrary number of arguments.
  // For example, you can use `L` to partially apply the first argument to the
  // Underscore `_.template` function:
  //
  //     var hi = L(_.template, "Hello <%= name %>");
  //     L.map(hi, [{name: 'Joe'}, {name: 'Bob'}, {name: 'Cleveland'}]);
  //
  //     //=> ["Hello Joe", "Hello Bob", "Hello Cleveland"]
  //
  // *signature:* `(any* -> a) -> any* -> (any* -> a)`

  var L = function(fun /*, args */) {
    var args = L.tail(arguments);

    if (L.has(args)) {
      return function(/* arguments */) {
        return fun.apply(null, args.concat(L.toArray(arguments)));
      };
    }
    else return L.curry(fun);
  };

  // Current version
  L.VERSION = '0.7.4';

  // Internal utilities
  // ------------------

  var _slice  = Array.prototype.slice;
  var _concat = Array.prototype.concat;
  var _ary    = function() {
    var head = arguments[0];

    if (arguments.length == 1)
      if (L.isArguments(head))
        return _slice.call(head);
      else if (L.isArray(head))
        return head;

    return _slice.call(arguments);
  };

  // A simple function to throw an `Error`
  function fail(str) {
    throw new Error(str);
  }

  // A temporary way to derive the name of a function. I hope to
  // eliminate the need sooner rather than later.
  //
  // *signature:* `(a -> b) -> string`

  function _nom(fun) {
    var src = fun.toString();
    src = src.substr('function '.length);
    var n = src.substr(0, src.indexOf('('));

    if (!L.isFunction(fun)) fail("Cannot derive the name of a non-function.");
    if (fun.name && (fun.name === n)) return fun.name;
    if (n) return n;
    fail("Anonymous function has no name.");
  }

  // Delegates down to the snapshot method if an object has one
  // or clones the object outright if not.  This is not as robust
  // as it could be.  Explore the possibility of pulling in
  // Lo-Dash's impl.

  var snapshot = function(thing) {
    if (L.existy(thing) && L.existy(thing.snapshot))
      return thing.snapshot();
    else
      fail("snapshot not currently implemented")
      //return L.snapshot(thing);
  };

  // Combintaors
  // -----------

  L.not = function(pred) {
    return function() {
      return !L.truthy(pred.apply(null, arguments));
    };
  };

  // Useful tools
  // ------------

  var _existy = function(x) { return x != null; };

  var _truthy = function(x) {
    return (x !== false) && _existy(x);
  };

  L.existy = _existy;
  L.truthy = _truthy;
  L.falsey = L.not(L.truthy);

  var _kind = function(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
  };

  var _existyKind = function(type, thing) {
    return _existy(thing) && _kind(thing) === type;
  };

  var _nanKind = function(_, thing) {
    return    _existy(thing)
           && _kind(thing) === 'Number'
           && thing        !=  +thing;
  };

  var _isa = function(type) {
    if (type === 'NaN') return function(thing) {return _nanKind(type, thing);};
    return function(thing) {return _existyKind(type, thing);};
  };

  L.id = function(x) { return x };

  L.len = function(thing) {
    var count = 0;

    if (!L.existy(thing)) fail("Cannot check the length of a non-existent thing");
    if (L.isArray(thing) || L.isString(thing)) return thing.length;

    for (var key in thing) {
      if (L.existy(thing[key])) count++;
    }

    return count;
  };

  var _eq = function(lhs, rhs, sawL, sawR, compare) {
    var lhsClass = Object.prototype.toString.call(lhs);
    var rhsClass = Object.prototype.toString.call(rhs);
    var result  = true;

    if (compare)                    return L.truthy(compare(lhs, rhs));
    if (lhsClass != rhsClass)       return false;
    if (lhs === rhs)                return lhs !== 0 || (1 / lhs == 1 / rhs);
    if (lhs == null || rhs == null) return lhs === rhs;

    switch (lhsClass) {
      case '[object Date]' :
      case '[object Boolean]' :
        return +lhs == +rhs;
      case '[object RegExp]' :
      case '[object String]' :
        return lhs == String(rhs);
      case '[object Number]':
        return lhs != +lhs ? rhs != +rhs : (lhs === 0 ? 1 / lhs == 1 / rhs : lhs == +rhs);
    }

    if (typeof lhs != 'object' || typeof rhs != 'object') return false;

    var length = sawL.length;
    while (length--) if (sawL[length] == lhs) return sawR[length] == rhs;

    sawL.push(lhs);
    sawR.push(rhs);
    var size = 0;

    if (lhsClass == '[object Array]') {
      size = lhs.length;
      result = size == rhs.length;

      if (result) {
        while (size--) {
          if (!(result = _eq(lhs[size], rhs[size], sawL, sawR, compare))) break;
        }
      }
    }
    else {
      var lhsCtor = lhs.constructor;
      var rhsCtor = rhs.constructor;

      if (lhsCtor !== rhsCtor
          && !(L.isFunction(lhsCtor)
               && (lhsCtor instanceof lhsCtor)
               && L.isFunction(rhsCtor)
               && (rhsCtor instanceof rhsCtor))) {
        return false;
      }

      for (var key in lhs) {
        if (lhs.hasOwnProperty(key)) {
          size++;
          if (!(result = (rhs.hasOwnProperty(key)) && _eq(lhs[key], rhs[key], sawL, sawR, compare))) break;
        }
      }

      if (result) {
        for (key in rhs) {
          if ((rhs.hasOwnProperty(key)) && !(size--)) break;
        }
        result = !size;
      }
    }

    sawL.pop();
    sawR.pop();

    return result;
  };

  // Predicates
  // ----------

  L.isNumber    = _isa('Number');
  L.isString    = _isa('String');
  L.isNan       = _isa('NaN');
  L.isArray     = _isa('Array');
  L.isArguments = _isa('Arguments');
  L.isFunction  = _isa('Function');
  L.isObject    = _isa('Object');

  L.isInstanceOf = function(x, t) { return (x instanceof t) };

  L.isEmpty = function(thing) {
    // TODO: rewrite to not use L.len
    return L.len(thing) === 0;
  };

  L.isEven = function(n) {
    if (!L.isNumber(n)) fail("It doesn't make sense to ask if a non-number is even. Got: " + n);
    return (n % 2 === 0) ? true : false;
  };

  L.isOdd = L.not(L.isEven);

  // ### Failure

  L.fail = function(msg) {
    throw new Error(msg);
  };

  // Base-level functionality
  // ------------------------

  // ### Composition

  L.comp = function() {
    var funs = arguments;
    var length = funs.length;

    for (fun in funs) {
      if (!L.isFunction(funs[fun])) fail("L.comp expects a chain of functions, but received " + funs[fun]);
    }

    return function() {
      var args = arguments;
      var length = funs.length;

      while (length--) {
        args = [funs[length].apply(this, args)];
      }
      return args[0];
    };
  };

  // ### L.filter

  var _filter = function(fun) {
    return function(coll) {
      var results = [];
      if (coll == null) return results;

      coll.forEach(function(value, index, list) {
        if (_truthy(fun.call(null, value))) results.push(value);
      });

      return results;
    };
  };

  L.filter = function(fun) {
    var coll = arguments[1];
    if (_existy(coll)) return _filter(fun)(coll);

    return _filter(fun);
  };

  // ### L.map

  var _map = function(fun) {
    return function(coll) {
      var results = [];
      if (coll == null) return results;

      coll.forEach(function(value, index, list) {
        results.push(fun.call(null, value));
      });

      return results;
    };
  };

  L.map = function(fun) {
    var coll = arguments[1];
    if (_existy(coll)) return _map(fun)(coll);

    return _map(fun);
  };

  var _reduce = function(fun) {
    return function(seed) {
      var acc = seed;
      return function(coll) {
        coll.forEach(function(value) {
          acc = fun.call(null, acc, value);
        });
        return acc;
      };
    };
  };

  L.reduce = function(fun) {
    var count = arguments.length;
    var seed = arguments[1];
    var coll = arguments[2];
    var result;

    switch(count) {
    case 1:
      result = _reduce(fun);
      break;

    case 2:
      result = _reduce(fun)(seed);
      break;

    case 3:
      result = _reduce(fun)(seed)(coll);
      break;
    }

    return result;
  };

  // Array selectors
  // ---------------

  var _first = function(array) {
    if (array == null) return void 0;
    return array[0];
  };

  var _head = function(array) {
    if (array == null) return void 0;
    return _slice.call(array, 0, 1);
  };

  var _tail = function(array) {
    return _slice.call(array, 1);
  };

  L.first = _first;
  L.head  = _head;
  L.tail  = _tail;
  L.end   = function(n) {
    return function(array) {
      return _slice.call(array, Math.max(array.length - n, 0));
    };
  };

  L.last  = L.comp(L.first, L.end(1));

  // A function to get at an index into an array
  var _nth = function(index) {
    return function(array) {
      if ((index < 0) || (index > array.length - 1)) L.fail("L.nth failure: attempting to index outside the bounds of the given array.");
      return array[index];
    };
  };

  L.nth = function(index) {
    var array = arguments[1];
    if (!L.isNumber(index)) L.fail("L.nth expects a number as its index argument.")

    if (_existy(array)) return _nth(index)(array);
    return _nth(index);
  };

  var _has = function(pred) {
    return function(coll) {
      for (var key in coll) {
        if (_truthy(pred(coll[key]))) return coll[key];
      }

      return void 0;
    };
  };

  L.has = _has;

  // Array builders
  // --------------

  var _cat = function(left) {
    return function(right) {
      if (!L.isArray(right)) L.fail("L.cat expects an array argument on the RHS");

      return _concat.call(left, right);
    };
  };

  L.cat = function(l, r) {
    if (!L.isArray(l)) L.fail("L.cat expects an array argument on the LHS");

    if (!L.existy(r)) _cat(l);

    return _cat(l)(r);
  };

  var _cons = function(elem) {
    return function(array) {
      return _cat([elem])(array);
    };
  };

  L.cons = function(elem) {
    var array = arguments[1];
    if (_existy(array)) return _cons(elem)(array);

    return _cons(elem);

  };

  L.toArray = _ary;

  // Returns the type constructor
  //
  // *signature:* `{any: any} -> (any* -> any)`
  L.ctor = function(obj) {
    return L.existy(obj) ? obj.constructor : null;
  };

  // Useful predicates
  // -----------------

  // ### Type predicates

  // A reference is something that derives from a Lemonad Hole object
  //
  // *signature:* `a -> boolean`
  L.isReference = function(x) {
    return (x instanceof L.Hole) || (x instanceof L.CAS);
  };

  // Returns a function that will invoke the given method
  // on any object that it receives as an argument.
  L.meth = L.walterWhite = L.invoker = function(method /*, args*/) {
    var pargs = _tail(arguments);

    return function(target /* args ... */) {
      if (!_existy(target)) {
        return void 0;
      }

      var methodName = _nom(method).trim();
      var targetMethod = target[methodName];
      var args = _tail(arguments);

      if (_existy(targetMethod) && (method === targetMethod)) {
        return targetMethod.apply(target, _cat(pargs)(args));
      }
      else {
        return void 0;
      }
    };
  };

  // Builds a polymorphic function based on dispatch predicates.
  L.dispatcher = function (/* funs */) {
    var funs = L.toArray(arguments);
    var size = funs.length;

    return function(target /*, args */) {
      var ret = void 0;
      var args = L.tail(arguments);

      for (var funIndex = 0; funIndex < size; funIndex++) {
        var fun = funs[funIndex];
        ret = fun.apply(fun, cons(target, args));

        if (existy(ret)) return ret;
      }

      return ret;
    };
  };


  // Fixity
  // ------

  L._ = {cthulhu: true};

  var _fix = function(fun) {
    var fixedArgs   = L.tail(arguments);
    var fixedLength = L.reduce(function(total, a) {
      if (a === L._)
        return total + 1;
      else
        return total;
    }, 0, fixedArgs);

    var f = function() {
      var args = fixedArgs.slice();
      var arg = 0;

      if (fixedLength !== arguments.length) fail("Expected " + fixedLength + " arguments.")

      for ( var i = 0; i < args.length || arg < arguments.length; i++ ) {
        if ( args[i] === L._ ) args[i] = arguments[arg++];
      }

      return fun.apply(null, args);
    };

    f.Lemonad = {};
    f.Lemonad.original = fun;

    return f;
  };

  L.fix  = _fix;
  L.fix1 = _fix(_fix, L._, L._);
  L.fix2 = _fix(_fix, L._, L._, L._);
  L.fix3 = _fix(_fix, L._, L._, L._, L._);
  L.fix4 = _fix(_fix, L._, L._, L._, L._, L._);

  /*
    L.fix1(ary, 10)()
    //=> [10]

    L.fix1(ary, L._)()
    // Error: Expected 1 arguments.

    L.fix1(ary, L._)(1)
    //=> [1]
  */

  // Delicious curry
  // ---------------

  L.L = {direction: 'left'};
  L.R = {direction: 'right'};

  // Return functions having been partially applied with a single
  // argument, either as the first or last argument.
  //
  // *signature:* `(any* -> a) -> any* -> (any* -> a)`
  var bindRight = function(fun, arg) {
    return function(/* args... */) {
      return fun.apply({}, [].slice.call(arguments).concat(arg));
    };
  };

  var bindLeft = function(fun, arg) {
    return function(/* args... */) {
      return fun.apply({}, [arg].concat(L.toArray(arguments)));
    };
  };

  // Returns a function which will curry a function either
  // right to left or left to right.
  //
  // *signature:* `Number -> ((any* -> a) -> Number -> (any* -> a))`
  var currier = function(direction) {
    var binder = direction == L.L ? bindLeft : bindRight;

    return function(fun, count) {
      if( count === void 0 ) {
        // if no count was provided, parse the function to count arguments
        count = fun.length;
      }
      if( count === 0 ) {
        // if there are no more arguments to apply, return the value.
        return fun();
      }
      return function(arg) {
        return L.curry(binder(fun, arg), count-1);
      };
    };
  };

  // Returns the curried form of a function, either left to
  // right or right to left.
  //
  // *signature:* `(any* -> a) -> Number -> (any* -> a)`
  L.curry = currier(L.L);
  L.rcurry = currier(L.R);

  // Returns the partial application of a given
  // function, left to right.
  //
  // *signature:* `(any* -> a) -> any* -> (any* -> a)`
  L.partial = L;

  // Returns the partial application of a list of arguments on a
  // curried function.
  //
  // *signature:* `(any* -> a) -> any* -> [(any* ->] a)`
  L.uncurry = function(fun) {
    return function(/* args... */) {
      var resp = fun;
      [].forEach.call(arguments, function(arg) {
        resp = resp(arg);
      });
      return resp;
    };
  };

  // Curries a function of `n` parameters from left to right.
  L.curry1 = L.schonfinkel = function(f) {
    return function(x) { return f(x); };
  };

  L.curry2 = L.schonfinkel2 = function(f) {
    return function(a) {
      return function(b) {
        return f(a,b);
      };
    };
  };

  L.curry3 = L.schonfinkel3 = function(f) {
    return function(a) {
      return function(b) {
        return function(c) {
          return f(a,b,c);
        };
      };
    };
  };

  L.curry4 = L.schonfinkel4 = function(f) {
    return function(a) {
      return function(b) {
        return function(c) {
          return function(d) {
            return f(a,b,c,d);
          };
        };
      };
    };
  };

  // Curries a function of `n` parameters from right to left.
  L.rcurry1 = L.rschonfinkel = function(f) {
    return function(x) { return f(x); };
  };

  L.rcurry2 = L.rschonfinkel2 = function(f) {
    return function(b) {
      return function(a) {
        return f(a,b);
      };
    };
  };

  L.rcurry3 = L.rschonfinkel3 = function(f) {
    return function(c) {
      return function(b) {
        return function(a) {
          return f(a,b,c);
        };
      };
    };
  };

  L.rcurry4 = L.rschonfinkel4 = function(f) {
    return function(d) {
      return function(c) {
        return function(b) {
          return function(a) {
            return f(a,b,c,d);
          };
        };
      };
    };
  };

  // parses ints
  L.parseInt = L.rcurry2(parseInt);

  // Fluent operators
  // ----------------

  // greater-than and less-than
  L.gt      = L.rcurry2(function(lhs, rhs) { return lhs > rhs; });
  L.lt      = L.rcurry2(function(lhs, rhs) { return lhs < rhs; });
  L.gte     = L.rcurry2(function(lhs, rhs) { return lhs >= rhs; });
  L.lte     = L.rcurry2(function(lhs, rhs) { return lhs <= rhs; });

  L.is      = L.curry2(function(lhs, rhs) { return lhs === rhs; });
  L.oneOf   = L.curry2(function(lhs, set) { return L.has(L.eq(lhs))(set); });

  L.eq = function(lhs) {
    return function(rhs) {
      return _eq(lhs, rhs, [], [], void 0);
    };
  };


  // Some math functions
  L.add     = L.rcurry2(function(x, y) { return x + y; });
  L.sub     = L.rcurry2(function(x, y) { return x - y; });
  L.mul     = L.rcurry2(function(x, y) { return x * y; });
  L.div     = L.rcurry2(function(x, y) { return x / y; });

  // increment, decrement and halve
  //
  // *signature:* `number -> number`
  L.inc = function(n) {
    return n+1;
  };
  L.dec = function(n) { return n-1; };
  L.halve = function(n) { return n/2; };


  // Partial application
  // -------------------

  // Partially applies a function by one argument from left to right
  L.partial1 = L.partial;
  L.partial2 = L.partial;

  // Rotates the arguments of a function from r->l, in a circular way.
  // For example:
  //    L.rot(fun(a, b, c)) => fun(c, a, b)

  L.rot = function(fun) {
    return function(/* args */) {
      var last = L.end(1)(arguments);
      var butLast = _slice.call(arguments, 0, arguments.length - 1);
      return fun.apply(fun, L.cat(last, butLast));
    };
  };

  // Rotates the arguments of a function from l->r, in a circular way.
  // For example:
  //    L.rotL(fun(a, b, c)) => fun(b, c, a)

  L.rotL = function(fun) {
    return function(/* args */) {
      var first = L.head(arguments);
      var rest  = L.tail(arguments);
      return fun.apply(fun, L.cat(rest, first));
    };
  };

  // Drops the first argument.
  // Fro example:
  //    L.cede(fun(a, b, c)) => fun(b, c)

  L.cede = function(fun) {
    return function(/* args */) {
      var args = L.tail(arguments);
      return fun.apply(fun, args);
    };
  };

  L.flip = function(fun) {
    return function(/* args */) {
      var tmp = arguments[0];
      arguments[0] = arguments[1];
      arguments[1] = tmp;

      return fun.apply(fun, arguments);
    };
  };

  // Monadology
  // ----------

  // Creates a function that works within the context of the
  // `actions` logic.  `lift` accepts one or two functions:
  //
  // 1. a required answer function that serves as a way to calculate a
  //    result based on the given managed structure.
  // 2. an optional state function that 'modifies' the managed structure
  //    to represent its current state.
  //
  // If a state function is not given then the result given by the
  // answer function serves as the state value at each step.
  //
  L.lift = function(answerFun, stateFun) {
    return function(/* args */) {
      var args = L.toArray(arguments);

      return function(state) {
        var ans = answerFun.apply(null, L.cons(state)(args));
        // If no stateFun given, just carry the answer forward
        var s = L.existy(stateFun) ? stateFun(state) : ans;

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

      var intermediate = L.reduce(function (stateObj, action) {
        var result = action(stateObj.state);
        var values = L.cat(stateObj.values, [result.answer]);
        return { values: values, state: result.state };
      }, init, acts);

      var keep = L.filter(L.existy, intermediate.values);

      return done(keep, intermediate.state);
    };
  };

  // Ref-type mixin
  // -----------------

  var _destructiveMerge = function(target, mixins) {
    mixins.forEach(function(mixin) {
      if (mixin) {
        for (var prop in mixin) {
          target[prop] = mixin[prop];
        }
      }
    });
  };

  // Mixes into a target object (destructively)

  L.mix = function(target /*, mixins */) {
    var args = _tail(arguments);
    _destructiveMerge(target, args);
    return target;
  };

  L.merge = function(/* objs */){
    var dest = arguments[0];

    if (L.truthy(dest))
      _destructiveMerge.apply(null, [dest, L.tail(arguments)]);

    return dest;
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
	var count = 0;
        for (var key in watchers) {
	  var watcher = watchers[key];
          watcher.call(this, key, oldVal, newVal);
          count++;
        }

        return count;
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
        delete watchers[key];
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

      if (L.existy(validate))
        if (!validate(newVal))
          fail("Attempted to set invalid value " + newVal);

      this._value = newVal;
      this.notify(oldVal, newVal);
      return this._value;
    }
  };

  L.SwapMixin = {
    swap: function swap(fun /* , args... */) {
      return this.setValue(fun.apply(this, L.cons(this._value)(L.tail(arguments))));
    },
    // Delegate down to the snapshot function
    snapshot: function snapshot() {
      return snapshot(this._value);
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
        return void 0;
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

  function mapcat(f, xs) {
    return xs.map(f).reduce(function(a, b) {
      return a.concat(b);
    }, []);
  }

  function condition1(/* checkers */) {
    var checkers = L.toArray(arguments);

    return function(fun, arg) {
      var errors = mapcat(function(isValid) {
        return isValid(arg) ? [] : [isValid.message];
      }, checkers);

      if (!L.isEmpty(errors))
        throw new Error(errors.join(", "));

      return fun(arg);
    };
  };

  function getType(type) {
    if( typeof type == 'function' ) {
      // a constructor was passed
      if( type == Number ) {
        return {
          name: "Number",
          fun: function(x) { return typeof x == 'number' }
        };
      } else if( type == String ) {
        return {
          name: "String",
          fun: function(x) { return typeof x == 'string' }
        };
      } else {
        // arbitrary constructor type checker
        return {
          name: type.name,
          fun: function(x) { return x instanceof type; }
        };
      }
    } else if( typeof type == 'object' && type.map ) {
      // an array was passed
      return {
        name: "["+getType(type[0].name)+"]",
        fun: function(xs) {
          return xs.map(getType(type[0]).fun).reduce(function(a,b) {
            return a && b;
          });
        }
      };
    } else if( typeof type == 'object' ) {
      // a dictionary was passed. all dictionaries
      // are String => something.
      var valType = getType(type[Object.keys(type)[0]]);
      return {
        name: "{String => "+valType.name+"}",
        fun: function(xs) {
          var passed = !xs.map;
          for( var k in xs ) {
            passed = passed && valType.fun(xs[k]);
          }
          return passed;
        }
      };
    }
  }

  function argTypeChecker(type, argNum) {
    // form a checker function based on the provided type.
    var checker = getType(type);

    // define an error to display in the case of a type error.
    var msg = ["Expected argument at index ",
		argNum,
		" to be of type ",
		checker.name,
		"."].join("");

    // return a checker.
    return L.checker(msg, checker.fun);
  }

  L.typed = function(fun/*, types */) {
    var types = L.toArray(arguments).slice(1).map(argTypeChecker);

    return function(/* args */) {
      var args = L.toArray(arguments);
      var errors = mapcat(function(isValid) {
        var arg = args[0];
        args = args.slice(1);
        return isValid(arg) ? [] : [isValid.message];
      }, types);

      if (!L.isEmpty(errors))
        throw new Error(errors.join(", "));

      return fun.apply({}, arguments);
    };
  };

  // Pipeline

  L.pipeline = function(seed /*, args */) {
    return L.reduce(function(l,r) {
      return r(l);
    }, seed, L.tail(arguments));
  };

  // Misc

  L.shuffle = function (array) {
    var j, x;
    var a = _slice.call(array, 0);

    for (var i = a.length - 1; i >= 0; i--) {
      j = parseInt(Math.random() * i, 10);
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }

    return a;
  }

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
