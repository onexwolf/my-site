## bind(thisArgs [,args...])

bind 是 ES5 新增的一个方法，它的传参和 call 类似，但又和 call/apply 有着明显的不同，即调用 call 或 apply 都会自动执行对应的函数，而 bind 不会执行对应的函数，只是返回了对函数的引用。粗略一看，bind 似乎比 call/apply 要落后一些，那 ES5 为什么还要引入 bind 呢？

其实，ES5 引入 bind 的真正目的是为了弥补 call/apply 的不足，由于 call/apply 会对目标函数自动执行，从而导致它无法在事件绑定函数中使用，因为事件绑定函数不需要我们手动执行，它是在事件被触发时由 JS 内部自动执行的。而 bind 在实现改变函数 this 的同时又不会自动执行目标函数，因此可以完美的解决上述问题，看一个例子就能明白：

``` js
var obj = { name: 'liangxwei' };

document.addEventListener('click', onClick.bind(obj, 'p1', 'p2'), false);

function onClick(a, b) {
    console.log(this.name, a, b);   // liangxwei p1 p2
}
```

当点击网页时，onClick 被触发执行，输出 liangxwei p1 p2，说明 onClick 中的 this 被 bind 改变成了 obj 对象，为了对 bind 进行深入的理解，我们来手动实现一个 bind。

## 模拟实现bind

通过上面的例子可以看出 bind 以下两个特点：

1. 返回一个函数
2. 可以传入参数

### 返回函数的模拟实现

从第一个特点开始，我们举个例子：

``` js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

// 返回了一个函数
var bindFoo = bar.bind(foo);

bindFoo();  // 1
```

关于指定 this 的指向，可以使用 call 或 apply 实现。我们来写第一版的代码：

``` js
Function.prototype.bind = function(context) {
    var self = this;
    return function() {
        return self.apply(context);
    }
}
```

此外，之所以 return self.apply(context)，是考虑到绑定函数可能是有返回值的，依然是这个例子：

``` js
var foo = {
    value: 1
};

function bar() {
    return this.value;
}

var bindFoo = bar.bind(foo);

console.log(bindFoo()); // 1
```

### 传参的模拟实现

接下来看第二点，可以传入参数。需要注意的是，**我们既可以在 bind 的时候传参，也可以在执行返回的函数的时候传参，或者各传一部分**。来看一个例子：

``` js
var foo = {
    value: 1
};

function bar(name, age) {
    console.log(this.value);
    console.log(name);
    console.log(age);
}

var bindFoo = bar.bind(foo, 'liangxwei');

bindFoo('18');
// 1
// liangxwei
// 18
```

我们可以用 arguments 来实现这个特性：

``` js
Function.prototype.bind = function(context) {
    var self = this;
    // 获取bind2函数从第二个参数到最后一个参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function() {
        // 这个时候的arguments是指bind返回的函数传入的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(context, args.concat(bindArgs));
    }
}
```

### 构造函数效果的模拟实现

完成了这两点，最难的部分到啦！因为 bind 还有一个特点，就是

> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

也就是说当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。举个例子：

``` js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

注意：尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了，如果大家了解 new 的模拟实现，就会知道这个时候的 this 已经指向了 obj。

所以我们可以通过修改返回的函数的原型来实现，让我们写一下：

``` js
Function.prototype.bind = function(context) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fBound = function() {
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例，可以让实例获得来自绑定函数的值
        // 以上面的是 demo 为例，如果改成 `this instanceof fBound ? null : context`，实例只是一个空对象，将 null 改成 this ，实例会具有 habit 属性
        // 当作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
        return self.apply(this instanceof fBound ? this : context, args.concat(bindArgs));
    }
    // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    fBound.prototype = this.prototype;
    return fBound;
}
```

### 构造函数效果的优化实现

但是在这个写法中，我们直接将 `fBound.prototype = this.prototype`，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

``` js
// 第四版
Function.prototype.bind = function(context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

### 最终代码

``` js
Function.prototype.bind = Function.prototype.bind || function(context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

## 参考链接

[《深入理解 call，apply 和 bind》](https://www.cnblogs.com/onepixel/p/5143863.html)
[《JavaScript深入之bind的模拟实现》](https://github.com/mqyqingfeng/Blog/issues/12)