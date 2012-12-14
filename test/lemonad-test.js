var vows = require('vows'),
    assert = require('assert'),
    L = require('../lib/lemonad');

vows.describe('iterateUntil').addBatch({
    'with a function of zero args': {
        topic: function() {
            return L.iterateUntil(function() {
              return Math.floor(Math.random()*11);
            },
            function(n) { return n !== 0 });
        },
        'just check if it works at all': function(topic) {
            assert.isArray(topic);
        }
    }
}).export(module);
