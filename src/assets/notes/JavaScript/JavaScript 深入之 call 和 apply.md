## call(thisArgs [,args...])

该方法可以传递一个 `thisArgs` 参数和一个参数列表，`thisArgs` 指定了函数在运行期的调用者，也就是函数中的 `this` 对象，而参数列表会被传入调用函数中。`thisArgs` 的取值有以下四种情况：

- 不传，或者传 `null`, `undefined`， 函数中的 `this` 指向 `window` 对象
- 传递另一个函数的函数名，函数中的 `this` 指向这个函数的引用
- 传递字符串、数值或布尔类型等基础类型，函数中的 `this` 指向其对应的包装对象，如 `String`、`Number`、`Boolean`
- 传递一个对象，函数中的 `this` 指向这个对象

来看一个最简单的例子：

```js
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call(foo); // 1
```

这是 `call` 的核心功能，它允许你在一个对象上调用该对象没有定义的方法，并且这个方法可以访问该对象中的属性，我们再来看一个例子：

``` js
var foo = {
 
  name: 'liangxwei', //定义a的属性

  say: function() { //定义a的方法
    console.log("Hi,I'm function a!");
  }
};
 
function bar(name) {
  console.log("Post params: "+ name);
  console.log("I'm "+ this.name);
  this.say();
}
 
bar.call(foo,'test');
>>
Post params: test
I'm liangxwei
I'm function a!
```

当执行 `b.call` 时，字符串 `test` 作为参数传递给了函数 `b` ,由于 `call` 的作用，函数 `b` 中的 `this` 指向了对象 `a` , 因此相当于调用了对象 `a` 上的函数 `b`,而实际上 `a` 中没有定义 `b` 。

## 模拟实现call

那么我们该怎么模拟实现 call 的效果呢？

### 第一步

试想当调用 call 的时候，把第一个例子中的 foo 对象改造成如下：

``` js
var foo = {
  value: 1,
  bar: function() {
    console.log(this.value)
  }
};

foo.bar(); // 1
```

这个时候 this 就指向了 foo，但是这样却给 foo 对象本身添加了一个属性，所以我们需要用 delete 再删除它。

所以我们模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

以上个例子为例，就是：

``` js
// 第一步
foo.fn = bar
// 第二步
foo.fn()
// 第三步
delete foo.fn
```

根据这个思路，我们可以尝试着去写第一版的 call2 函数：

``` js
// 第一版
Function.prototype.call2 = function(context) {
  // 首先要获取调用call的函数，用this可以获取
  context.fn = this;
  context.fn();
  delete context.fn;
}

// 测试一下
var foo = {
  value: 1
};

function bar() {
  console.log(this.value);
}

bar.call2(foo); // 1
```

### 第二步

最一开始也讲了，call 函数还能给定参数执行函数，而且传入的参数并不确定。

``` js
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value);
}

bar.call(foo, 'kevin', 18);
// kevin
// 18
// 1
```

我们可以从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

比如这样：

``` js
// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
  args.push('arguments[' + i + ']');
}

// 执行后 args 为 ["arguments[1]", "arguments[2]", "arguments[3]"]
```

不定长的参数问题解决了，我们接着要把这个参数数组放到要执行的函数的参数里面去。

``` js
eval('context.fn(' + args +')')
```

这里 args 会自动调用 Array.toString() 这个方法。

所以我们的第二版克服了两个大问题，代码如下：

``` js
// 第二版
Function.prototype.call2 = function(context) {
  context.fn = this;
  var args = [];
  for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
  }
  eval('context.fn(' + args +')');
  delete context.fn;
}

// 测试一下
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value);
}

bar.call2(foo, 'kevin', 18); 
// kevin
// 18
// 1
```

### 第三步

大部分功能已经完成，但是还有两个小点要注意：

1. this 参数可以传 null，当为 null 的时候，视为指向 window

2. 函数是可以有返回值的

``` js
// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

## apply(thisArgs [,args[]])

`apply` 和 `call` 的唯一区别是第二个参数的传递方式不同，`apply` 的第二个参数必须是一个数组（或者类数组），而 `call` 允许传递一个参数列表。值得你注意的是，虽然 `apply` 接收的是一个参数数组，但在传递给调用函数时，却是以参数列表的形式传递，我们看个简单的例子：

``` js
function baz(x,y,z){
  console.log(x,y,z);
}
 
baz.apply(null,[1,2,3]); // 1 2 3
```

## 模拟实现apply

直接给出模拟实现 apply 的代码：

```js
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```

> 参考链接：
> [深入理解 call，apply 和 bind](https://www.cnblogs.com/onepixel/p/5143863.html)
> [JavaScript深入之call和apply的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)