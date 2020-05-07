//    lemonad.js
//    http://www.functionaljs.org
//    (c) 2013-2020 Fogus,
//    Lemonad may be freely distributed under the MIT license

// *Always start with the secret JavaScript sauce...*
;(function() {
  // Dependencies
  // ------------

  // Setup
  // -----

  // Establish the root object, `window` in the browser, or `global` on the server.

  var root = this;
  var Imm  = Immutable;
    

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
    var args = Imm.Seq(arguments).rest().toArray();

    if (L.has(args)) {
      return function(/* arguments */) {
	var localArgs = Imm.Seq(arguments).rest().toArray();
        return fun.apply(null, args.concat(localArgs));
      };
    }
    else return L.curry(fun);
  };

  L.toArray = function(thing) {
    return Imm.Seq(thing).toArray();
  }
  
  // Current version
  L.VERSION = '0.8.0-pre';

  // A simple function to throw an `Error`
  function fail(str) {
    throw new Error(str);
  }

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
