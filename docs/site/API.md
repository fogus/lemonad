<a name="L"></a>

## L : <code>object</code>
Lemonad public API.

**Kind**: global namespace  

* [L](#L) : <code>object</code>
    * [.not(pred)](#L.not) ⇒ <code>function</code>
    * [.map(fun, [coll])](#L.map) ⇒ <code>Array</code> \| <code>function</code>

<a name="L.not"></a>

### L.not(pred) ⇒ <code>function</code>
Returns a function that returns the logical negation of a predicate.

The returned function calls `pred` with its received arguments and
returns the opposite of Lemonad truthiness for the result.

**Kind**: static method of [<code>L</code>](#L)  
**Returns**: <code>function</code> - A predicate that returns `true` when `pred` returns a falsey value, and `false` otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| pred | <code>function</code> | Predicate function to negate. |

**Example**  
```js
L.not(L.isEven)(3)
//=> true
```
**Example**  
```js
var isNotString = L.not(L.isString);

isNotString(42)
//=> true
```
<a name="L.map"></a>

### L.map(fun, [coll]) ⇒ <code>Array</code> \| <code>function</code>
Applies a function to each element of a collection.

May be called with both arguments:

    L.map(L.inc, [1, 2, 3])
    //=> [2, 3, 4]

Or partially applied:

    L.map(L.inc)([1, 2, 3])
    //=> [2, 3, 4]

**Kind**: static method of [<code>L</code>](#L)  
**Returns**: <code>Array</code> \| <code>function</code> - An array when `coll` is supplied, otherwise a function expecting `coll`.  

| Param | Type | Description |
| --- | --- | --- |
| fun | <code>function</code> | Function applied to each element. |
| [coll] | <code>Array</code> | Optional collection to map over. |

