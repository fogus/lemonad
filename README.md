lemonad
=======

A functional programming library for JavaScript inspired by [Clojure](http://www.clojure.org), [Haskell](http://www.haskell.org/), [SML](http://www.smlnj.org/) and [Forth](http://www.forth.com/forth/).

![lemonad](https://raw.github.com/fogus/lemonad/master/docs/logo.png)

## Using

Add the following to your 'package.json' file in the `"dependencies"` section:

    "lemonad": "0.7.4"

## Currently available functions

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
  'checker',
  'compareAndSwap',
  'ctor',
  'curry',
  'curry2',
  'curry3',
  'curry4',
  'dec',
  'dispatcher',
  'eq',
  'filter',
  'gt',
  'gte',
  'invokeAll',
  'is',
  'isArguments',
  'isArray',
  'isObject',
  'isReference',
  'isString',
  'lift',
  'lt',
  'lte',
  'map',
  'meth',
  'invoker',
  'walterWhite',
  'mix',
  'nth',
  'partial1',
  'partial2',
  'pipeline',
  'rcurry',
  'rcurry2',
  'rcurry3',
  'rcurry4',
  'reduce', 
  'removeWatch',
  'rot',
  'setValue',
  'swap', 
  'typed' ]
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
