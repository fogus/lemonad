// Underscore-contrib (underscore.array.builders.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Mixing in the array builders
  // ----------------------------

  _.mixin({
    // Explodes a string into an array of chars
    explode: function(s) {
      return s.split('');
    },

    // Implodes and array of chars into a string
    implode: function(a) {
      return a.join('');
    }
  });
})(this);
