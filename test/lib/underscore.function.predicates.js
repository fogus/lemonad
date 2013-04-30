// Underscore-contrib (underscore.function.predicates.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------


  // Mixing in the predicate functions
  // ---------------------------------

  _.mixin({
    // A wrapper around instanceof
    isInstanceOf: function(x, t) { return (x instanceof t); },

    // An associative object is one where its elements are
    // accessed via a key or index. (i.e. array and object)
    isAssociative: function(x) { return _.isArray(x) || _.isObject(x) || _.isArguments(x); },

    // An indexed object is anything that allows numerical index for
    // accessing its elements (e.g. arrays and strings). NOTE: Underscore
    // does not support cross-browser consistent use of strings as array-like
    // objects, so be wary in IE 8 when using  String objects and IE<8.
    // on string literals & objects.
    isIndexed: function(x) { return _.isArray(x) || _.isString(x) || _.isArguments(x); },

    // A seq is something considered a sequential composite type (i.e. arrays and `arguments`).
    isSequential: function(x) { return (_.isArray(x)) || (_.isArguments(x)); },

    // These do what you think that they do
    isZero: function(x) { return 0 === x; },
    isEven: function(x) { return (x != null) && ((x & 1) === 0); },
    isOdd: function(x) { return !_.isEven(x); },
    isPositive: function(x) { return x > 0; },
    isNegative: function(x) { return x < 0; },
    isValidDate: function(x) { return _.isDate(x) && !_.isNaN(x.getTime()); },

    // Returns true if its arguments are monotonically
    // increaing values; false otherwise.
    isIncreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return arguments[0] < arguments[1];

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] >= arguments[i]) {
          return false;
        }
      }

      return true;
    },

    // Returns true if its arguments are monotonically
    // decreaing values; false otherwise.
    isDecreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return arguments[0] > arguments[1];

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] <= arguments[i]) {
          return false;
        }
      }

      return true;
    }
  });

})(this);
