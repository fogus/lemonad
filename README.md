lemonad
=======

A functional programming library built on, and extending, [Underscore.js](http://underscorejs.org) and [Underscore-contrib](https://www.github.com/documentcloud/underscore-contrib) -- inspired by [Clojure](http://www.clojure.org), [Haskell](http://www.haskell.org/), [SML](http://www.smlnj.org/) and [Forth](http://www.forth.com/forth/).

![lemonad](https://raw.github.com/fogus/lemonad/master/docs/logo.png)

currently available functions:

```javascript
[ '$',
  'CAS',
  'CASMixin',
  'L',
  'Hole',
  'RefMixin',
  'VERSION',
  'WatchableMixin',
  'actions',
  'addWatch',
  'compareAndSwap',
  'ctor',
  'curry',
  'curry2',
  'curry3',
  'curry4',
  'dec',
  'dispatcher',
  'eq',
  'gt',
  'invokeAll',
  'is',
  'isReference',
  'lift',
  'lt',
  'meth',
  'invoker',
  'walterWhite',
  'mix',
  'partial1',
  'partial2',
  'removeWatch',
  'rot',
  'setValue',
  'swap' ]
```

Influences / References
-----------------------

* [Clojure and ClojureScript](http://www.clojuredocs.org)
* [Inheritance Patterns in JavaScript](http://bolinfest.com/javascript/inheritance.php) by Michael Bolin
* [Underscore.js](http://underscorejs.org/)
* [Functional JavaScript](http://osteele.com/sources/javascript/functional/) by Oliver Steele
* Functional JavaScript (the book)

Todo
-----

* The rest of the things
* Promises/A-compatible functions (http://wiki.commonjs.org/wiki/Promises/A)
* Moar monadology
* Logic vars?
* Unification?
* Other things that I can't think of right now
* Generators / iterators?
* Futures?
* Laziness?
* Badass memoize
* Some data generators?
* merges
* walking
* rel alg
* `into` for objects
* make sure that anything that works for array also works for `arguments`
* Make sure I say, *sequence* on input and *array* on output
* yggdrasil
* undermine
* reb
* cljs
* tables
* bach.js
* datalog
* poems
* shape decls
* cheatsheet
* site

License
=======

This software is provided as-is under the [MIT license](http://opensource.org/licenses/MIT).
