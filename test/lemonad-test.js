var vows = require('vows'),
    assert = require('assert'),
    L = require('../lib/lemonad');

vows.describe('iterateUntil').addBatch({
    'with a function of zero args and no seed': {
        topic: function() {
            return L.iterateUntil(function() {
                                    return Math.floor(Math.random()*11);
                                  },
                                  function(n) { return n !== 0 });
        },
        'just check if it works at all': function(topic) {
            assert.isArray(topic);
        }
    },
    'with a function of one arg': {
        topic: function() {
            return L.iterateUntil(function(n) { return n-1 },
                                  function(n) { return n !== 0 },
                                  10);
        },
        'just check if it gives us the array we expect': function(topic) {
            assert.isArray(topic);
            assert.deepEqual(topic, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
        }
    }
}).export(module);
