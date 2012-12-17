lemonad
=======

a functional programming library built on, and extending, [Underscore.js](http://underscorejs.org) -- inspired by the [Clojure](http://www.clojure.org) core and contrib libraries.

![lemonad](https://raw.github.com/fogus/lemonad/master/docs/logo.png)

currently available functions:

```javascript
{ [Function]
  VERSION: '0.0.8',
  existy: [Function],
  truthy: [Function],
  isAssociative: [Function],
  isReference: [Function],
  isZero: [Function],
  isEven: [Function],
  isOdd: [Function],
  isPos: [Function],
  cat: [Function],
  cons: [Function],
  butLast: [Function],
  interpose: [Function],
  repeat: [Function],
  second: [Function],
  increasing: [Function],
  decreasing: [Function],
  increasingOrEq: [Function],
  decreasingOrEq: [Function],
  meth: [Function],
  assoc: [Function],
  k: [Function],
  constantly: [Function],
  t: [Function],
  thrush: [Function],
  pipeline: [Function],
  compose: [Function],
  everyPred: [Function],
  conjoin: [Function],
  someFun: [Function],
  disjoin: [Function],
  mapcat: [Function],
  complement: [Function],
  accessor: [Function],
  plucker: [Function],
  repeatedly: [Function],
  iterateUntil: [Function],
  reductions: [Function],
  dropWhile: [Function],
  takeWhile: [Function],
  curry2: [Function],
  curry3: [Function],
  '$': undefined,
  'partial$': [Function],
  partial: [Function],
  partial2: [Function],
  def: [Function],
  actions: [Function],
  WatchableProtocol:
   { notify: [Function],
     watch: [Function],
     unwatch: [Function] },
  addWatch: [Function],
  removeWatch: [Function],
  Ref: [Function],
  RefProtocol:
   { setValue: [Function],
     swap: [Function],
     snapshot: [Function] },
  setValue: [Function],
  swap: [Function],
  snapshot: [Function],
  CAS: [Function],
  CASProtocol: { compareAndSet: [Function] },
  compareAndSet: [Function],
  L: [Circular] }
```

Influences / References
-----------------------

* [Clojure and ClojureScript](http://www.clojuredocs.org)
* [Inheritance Patterns in JavaScript](http://bolinfest.com/javascript/inheritance.php) by Michael Bolin
* [Underscore.js](http://underscorejs.org/)
* [Functional JavaScript](http://osteele.com/sources/javascript/functional/) by Oliver Steele

Todo
-----

* Promises
* The rest of the things
* Moar monadology
* Other things that I can't think of right now
