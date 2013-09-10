//    Lemonad.js
//    http://www.functionaljs.org
//    (c) 2013 Fogus, Ariadne Softworks
//    Lemonad may be freely distributed under the MIT license

// *Always start with the secret JavaScript sauce...*
;(function() {
  // Dependencies
  // ------------

  // I want to require Underscore.js if it's not already available.
  var _ = this._;

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
  L.VERSION = '0.7.0';

  // Internal utilities
  // ------------------

  var _slice  = Array.prototype.slice;
  var _concat = Array.prototype.concat;

  // A simple function to throw an `Error`
  function fail(str) {
    throw new Error(str);
  }

  // A temporary way to derive the name of a function. I hope to
  // eliminate the need sooner rather than later.
  //
  // *signature:* `(a -> b) -> string`

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
  // or clones the object outright if not.  This is not as robust
  // as it could be.  Explore the possibility of pulling in
  // Lo-Dash's impl.

  var snapshot = function(thing) {
    if (_.exists(thing) && _.exists(thing.snapshot))
      return thing.snapshot();
    else
      return _.snapshot(thing);
  };

  // Combintaors
  // -----------

  L.not = function(pred) {
    return function() {
      return !pred.apply(null, arguments);
    };
  }

  // Useful tools
  // ------------

  // Used as a unique value to signify certain conditions in Lemonad.
  // Also takes a number of args and returns an array of unique values.
  //
  // *signature:* `any* -> [any*]`

  L.$ = function(){
    return _.uniq(arguments);
  };

  var _existy = function(x) { return x != null; };

  var _truthy = function(x) { 
    return (x !== false) && exists(x); 
  };

  L.existy = _existy;
  L.truthy = _truthy;
  L.falsey = L.not(L.truthy);

  var _kind = function(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
  };

  var _existyKind = function(type, thing) {
    return    _existy(thing) && _kind(thing) === type;
  };

  var _nanKind = function(_, thing) {
    return    _existy(thing)
           && _kind(thing) === 'Number'
           && thing        !=  +thing;
  };

  var _isa = function(type) {
    if (type === 'NaN') return _nanKind.bind(undefined, type);
    return _existyKind.bind(undefined, type);
  };

  L.isNumber = _isa('Number');
  L.isString = _isa('String');
  L.isNan    = _isa('NaN');
  L.isArray  = _isa('Array');

  // ### Failure

  L.fail = function(msg) {
    throw new Error(msg);
  };

  // Base-level functionality
  // ------------------------

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

  // A function to get at an index into an array
  var _nth = function(index) {
    return function(array) {
      if ((index < 0) || (index > array.length - 1)) L.fail("L.nth failuer: attempting to index outside the bounds of the given array.");
      return array[index];      
    };
  };

  L.nth = function(index) {
    var array = arguments[1];
    if (!L.isNumber(index)) L.fail("L.nth expects a number as its index argument.")

    if (_existy(array)) return _nth(index)(array);
    return _nth(index);
  };

  // Array builders
  // --------------

  var _cat = function(left) {
    if (!L.isArray(left)) L.fail("L.cat expects an array argument on the LHS");

    return function(right) {
      if (!L.isArray(right)) L.fail("L.cat expects an array argument on the RHS");

      return _concat.call(left, right);
    };
  };

  L.cat = _cat;

  // increment, decrement and halve
  //
  // *signature:* `number -> number`
  L.inc = function(n) { return n+1; };
  L.dec = function(n) { return n-1; };
  L.halve = function(n) { return n/2; };

  // Returns the type constructor
  //
  // *signature:* `{any: any} -> (any* -> any)`
  L.ctor = function(obj) {
    return _.exists(obj) ? obj.constructor : null;
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
        return undefined;
      }

      var methodName = nom(method).trim();
      var targetMethod = target[methodName];
      var args = _tail(arguments);

      if (_existy(targetMethod) && (method === targetMethod)) {
        return targetMethod.apply(target, _cat(pargs)(args));
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

  // Delicious curry
  // ---------------
    
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
      return fun.apply({}, [arg].concat(_.toArray(arguments)));
    };
  };
  
  // Returns a function which will curry a function either
  // right to left or left to right.
  //
  // *signature:* `Number -> ((any* -> a) -> Number -> (any* -> a))`
  var currier = function(direction) {
  	var binder = direction == 1 ? bindLeft : bindRight;
  	return function(fun, count) { 
  	  if( count === undefined ) {
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
  L.curry = currier(-1);  
  L.leftCurry = currier(1);
  
  // Returns the partial application of a given
  // function, left to right.
  //
  // *signature:* `(any* -> a) -> any* -> (any* -> a)`
  L.partial = function(fun/*, args... */) {
    // partial applier of a given function
    return L.uncurry(L.uncurry(L.leftCurry(fun)).apply({}, [].slice.call(arguments, 1)));
  };  
  
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
  
  // Curries a function of `n` parameters from right to left.  
  L.curry1 = L.fix1 = L.schonfinkel = L.curry(L.curry)(1);  
  L.curry2 = L.fix2 = L.schonfinkel2 = L.curry(L.curry)(2);
  L.curry3 = L.fix3 = L.schonfinkel3 = L.curry(L.curry)(3);  
  L.curry4 = L.fix4 = L.schonfinkel4 = L.curry(L.curry)(4);

  // parses ints
  L.parseInt = L.curry1(parseInt);

  // greater-than and less-than
  L.gt      = L.curry2(function(lhs, rhs) { return lhs > rhs; });
  L.lt      = L.curry2(function(lhs, rhs) { return lhs < rhs; });

  L.eq      = L.curry2(function(lhs, rhs) { return _.isEqual(lhs, rhs); });
  L.is      = L.curry2(function(lhs, rhs) { return lhs === rhs; });
  L.oneOf   = L.curry2(function(lhs, set) { return _.some(set, L.eq(lhs)); });

  // Partial application
  // -------------------

  // Partially applies a function by one argument from left to right
  L.partial1 = L.partial;
  L.partial2 = L.partial;

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
    var args = _rest(arguments);

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
