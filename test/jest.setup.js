// Jest setup: expose the Lemonad library as a global so existing specs using
// the global `L` name keep working.

global.L = require('../lib/lemonad');
