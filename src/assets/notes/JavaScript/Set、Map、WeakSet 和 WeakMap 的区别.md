# Set

## 基本用法

Set本身是一个构造函数，用来生成 Set 数据结构。

``` js
new Set([iterable])
```

举个例子：

``` js
const s = new Set();

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for (let i of s) {
  console.log(i);
}
// 2 3 5 4

// 去重数组的重复对象
let arr = [1, 2, 3, 2, 1, 1]
[... new Set(arr)]	// [1, 2, 3]
```

向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是向 Set 加入值时认为NaN等于自身，而精确相等运算符认为NaN不等于自身。

## Set 实例的属性和方法

Set 结构的实例有以下属性。

\- `Set.prototype.constructor`：构造函数，默认就是Set函数。
\- `Set.prototype.size`：返回Set实例的成员总数。

Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）

**操作方法**：

\- `Set.prototype.add(value)`：添加某个值，返回 Set 结构本身。
\- `Set.prototype.delete(value)`：删除某个值，返回一个布尔值，表示删除是否成功。
\- `Set.prototype.has(value)`：返回一个布尔值，表示该值是否为Set的成员。
\- `Set.prototype.clear()`：清除所有成员，没有返回值。

**遍历方法**：

\- ``Set.prototype.keys()``：返回键名的遍历器
\- ``Set.prototype.values()``：返回键值的遍历器
\- ``Set.prototype.entries()``：返回键值对的遍历器
\- ``Set.prototype.forEach()``：使用回调函数遍历每个成员

# WeakSet

## 含义

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值。

其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。WeakSet 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，WeakSet 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 WeakSet 里面的引用就会自动消失。

由于上面这个特点，WeakSet 的成员是不适合引用的，因为它会随时消失。另外，由于 WeakSet 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 WeakSet 不可遍历。

这些特点同样适用于本章后面要介绍的 WeakMap 结构。

## 语法

WeakSet 是一个构造函数，可以使用`new`命令，创建 WeakSet 数据结构。

``` js
const ws = new WeakSet();
```
作为构造函数，WeakSet 可以接受一个数组或类似数组的对象作为参数。（实际上，任何具有 Iterable 接口的对象，都可以作为 WeakSet 的参数。）该数组的所有成员，都会自动成为 WeakSet 实例对象的成员。

``` js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}
```

WeakSet 结构有以下三个方法。

\- `WeakSet.prototype.add(value)`：向 WeakSet 实例添加一个新成员。
\- `WeakSet.prototype.delete(value)`：清除 WeakSet 实例的指定成员。
\- `WeakSet.prototype.has(value)`：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

``` js
const ws = new WeakSet();
const obj = {};
const foo = {};

ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo);    // false

ws.delete(window);
ws.has(window);    // false
```

# Map

## 含义和基本用法

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

为了解决这个问题，ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

``` js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```

上面的例子展示了如何向 Map 添加成员。任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。

``` js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```

如果读取一个未知的键，则返回undefined。

## 实例的属性和操作方法

Map 结构的实例有以下属性和操作方法。

### （1）size 属性

`size` 属性返回 Map 结构的成员总数。

``` js
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```
### （2）Map.prototype.set(key, value)

`set`方法设置键名`key`对应的键值为`value，然后返回整个 Map 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。

`set` 方法返回的是当前的Map对象，因此可以采用链式写法。

``` js
let map = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');
```

### （3）Map.prototype.get(key)

`get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。

### （4）Map.prototype.has(key)

`has` 方法返回一个布尔值，表示某个键是否在当前 Map 对象之中。

### （5）Map.prototype.delete(key)

`delete`方法删除某个键，返回`true`。如果删除失败，返回`false`。

### （6）Map.prototype.clear()

`clear` 方法清除所有成员，没有返回值。

## 遍历方法

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

\- `Map.prototype.keys()`：返回键名的遍历器。
\- `Map.prototype.values()`：返回键值的遍历器。
\- `Map.prototype.entries()`：返回所有成员的遍历器。
\- `Map.prototype.forEach()`：遍历 Map 的所有成员。

# WeakMap

## 含义

WeakMap 结构与 Map 结构类似，也是用于生成键值对的集合。

``` js
// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

## 区别

\- WeakMap只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。
\- WeakMap的键名所指向的对象，不计入垃圾回收机制。

## 语法

属性：

\- `constructor`：构造函数

方法：

\- `has(key)`：判断是否有 `key` 关联对象
\- `get(key)`：返回key关联对象（没有则则返回 `undefined`）
\- `set(key)`：设置一组key关联对象
\- `delete(key)`：移除 key 的关联对象

# 总结

- Set
成员唯一、无序且不重复
[value, value]，键值与键名是一致的（或者说只有键值，没有键名）
可以遍历，方法有：add、delete、has
- WeakSet
成员都是对象
成员都是弱引用，可以被垃圾回收机制回收，可以用来保存DOM节点，不容易造成内存泄漏
不能遍历，方法有add、delete、has
- Map
本质上是键值对的集合，类似集合
可以遍历，方法很多可以跟各种数据格式转换
- WeakMap
只接受对象作为键名（null除外），不接受其他类型的值作为键名
键名是弱引用，键值可以是任意的，键名所指向的对象可以被垃圾回收，此时键名是无效的
不能遍历，方法有get、set、has、delete