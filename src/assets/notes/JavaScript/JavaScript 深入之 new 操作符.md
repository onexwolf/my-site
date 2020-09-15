和其他高级语言一样 JavaScript 也有 new 操作符，我们知道 new 可以用来实例化一个类，从而在内存中分配一个实例对象。 但在 JavaScript 中，万物皆对象，为什么还要通过 new 来产生对象？ 带着这个问题，我们一步步来分析和理解 new 的一些特性：

## 认识 new 操作符

``` js
function Animal(name){
    this.name = name;
}
Animal.color = 'black';
Animal.prototype.say = function() {
    console.log("I'm " + this.name);
};
var cat = new Animal('cat');

console.log(
    cat.name,  //cat
    cat.height //undefined
);
cat.say(); //I'm cat

console.log(
    Animal.name, //Animal
    Animal.color //back
);
Animal.say(); //Animal.say is not a function
```

代码解读如下：

1. 创建了一个函数 Animal，并在其 this 上定义了属性：name，name 的值是函数被执行时的形参
2. 在 Animal 对象（Animal本身是一个函数对象）上定义了一个静态属性: color,并赋值 'black'
3. 在 Animal 函数的原型对象 prototype 上定义了一个 say() 方法，say 方法输出了 this 的 name 值
4. 通过 new 关键字创建了一个新对象 cat
5. cat 对象尝试访问 name 和 color 属性，并调用 say 方法
6. Animal 对象尝试访问 name 和 color 属性，并调用 say 方法

## new 的内部原理

可以看到，Animal 本身只是一个普通函数，但当通过new来创建对象时，Animal 就是构造函数。

当 JavaScript 引擎在执行 `var cat = new Animal('cat');` 时，内部做了很多工作，用伪代码模拟其内部流程如下：

``` js
new Animal('cat')  = {
    var obj = {};
    obj.__proto__ = Animal.prototype;
    var result = Animal.call(obj, 'cat');
    return typeof result === 'object' ? result : obj;
};
```

将上述流程分为 4 个步骤来理解：

1. 创建一个空对象 obj
2. 把 obj 的 \_\_proto__ 指向构造函数 Animal 的原型对象 prototype，此时便建立了 obj 对象的原型链：obj -> Animal.prototype -> Object.prototype -> null
3. 在 obj 对象的执行环境调用 Animal 函数并传递参数 'cat' 。 相当于 `var result = obj.Animal('cat')`
4. 考察第 3 步的返回值，如果无返回值或者返回一个非对象值，则将 obj 作为新对象返回；否则会将 result 作为新对象返回

根据以上过程，我们发现 cat 其实就是第四步的返回值，因此我们对 cat 对象的认知就多了一些：

- cat 的原型链是 obj -> Animal.prototype -> Object.prototype -> null
- cat 上新增了一个属性 name

分析完了 cat 的生产过程，我们再分析一下输出结果：

- cat.name - 在第三步中，obj 对象就产生了 name 属性。因此 cat.name 就是这里的 obj.name
- cat.color - cat 对象首先会查找自身的 color 属性，**没有找到便会沿着原型链查找**，在上述例子中，我们仅在 Animal 对象上定义了 color，并没有在其原型上定义，因此找不到，返回 undefined。
- cat.say - cat 会首先查找自身的 say 方法，没有找到便会沿着原型链查找，在上述例子中，我们在 Animal 的 prototype 上定义了 say 方法，因此可以在原型链中找到。

另外，在 say 方法中还访问了 this.name，这里的 this 指向的是其调用者 obj，因此输出的是 obj.name 的值。

对于 Animal 来说，它本身也是一个对象，因此在访问属性和方法时也遵守上述规则。

需要注意的是，Animal 先查找自身的 name，找到了 name，但这个 name 并不是我们定义的 name，而是函数对象内置的属性，一般情况下，函数对象在产生时会内置 name 属性并将函数名作为赋值（仅函数对象）。

## 探索 new 的意义

对 new 运算符有了较深入的理解之后，我们再回到开篇提到的问题：在 JavaScript 中，万物皆对象，为什么还要通过 new 来产生对象？

要弄明白这个问题，我们首先要搞清楚 cat 和 Animal 的关系：

1. **cat 继承了 Animal 对象**

通过上面的分析我们发现， cat 通过原型链继承了 Animal 中的部分属性，因此我们可以简单的认为：Animal 和 cat 是继承关系。

2. **cat 是 Animal 的实例**

cat 是通过 new 产生的对象，那么 cat 到底是不是 Animal 的实例对象？ 我们先来了解一下 JS 是如何来定义实例对象：

``` js
A instanceof B
```

如果上述表达式为 true，JavaScript 认为 A 是 B 的实例对象，我们用这个方法来判断一下 cat 和 Animal 。

``` js
cat instanceof Animal; //true
```

从结果看，cat 确实是 Animal 实例，要想更加证实这个结果，我们再来了解一下 instanceof 的内部原理：

``` js
var L = A.__proto__;
var R = B.prototype;
if(L === R)
    return true;
```

如果 A 的 \_\_proto__ 等价于 B 的 prototype，就返回 true 。

在 new 的执行过程【2】中，cat 的 \_\_proto__ 指向了Animal 的 prototype，所以 cat 和 Animal 符合 instanceof 的判断结果。

**因此，通过 new 创建的 对象 和 构造函数 之间建立了一条原型链，原型链的建立，让原本孤立的对象有了依赖关系和继承能力，让JavaScript 对象能以更合适的方式来映射真实世界里的对象，这是面向对象的本质。**

## 模拟实现 new

因为 new 是关键字，所以无法像 bind 函数一样直接覆盖，所以我们写一个函数，命名为 objectFactory，来模拟 new 的效果。

``` js
function objectFactory() {

    // 新建一个对象 obj
    var obj = new Object(),

    // 取出第一个参数，也就是要传入的构造函数。
    // 此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
    Constructor = [].shift.call(arguments);

    // 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
    obj.__proto__ = Constructor.prototype;

    // 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
    var ret = Constructor.apply(obj, arguments);

    return typeof ret === 'object' ? ret : obj;

};
```

使用方式：

``` js
function Animal(name){
    this.name = name;
}

Animal.prototype.say = function() {
    console.log("I'm " + this.name);
};

var cat = objectFactory(Animal, 'cat');
```

## 参考链接

[深入理解 new 操作符](https://www.cnblogs.com/onepixel/p/5043523.html)
[JavaScript深入之new的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)

