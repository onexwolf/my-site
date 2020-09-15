## 原型

我们创建的每一个函数都有一个 prototype 属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有示例共享的属性和方法。

如果按照字面意思来理解，那么 prototype 就是通过调用构造函数而创建的那个对象实例的原型对象。如下所示：

```js
function Person(){
	
}

Person.prototype.name = 'Oliver';
Person.prototype.sayName = function() {
	console.log(this.name);
}
var person1 = new Person();
person1.sayName();
var person2 = new Person();
person2.sayName();

console.log(person1.sayName === person2.sayName);
```

### 理解原型对象

无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个 constructor（构造函数）属性，这个属性包含一个指向 prototype 属性所在函数的指针。

创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性；至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针（内部属性），指向构造函数的原型对象。ECMA-262 第5 版中管这个指针叫[[Prototype]]。虽然在脚本中没有标准的方式访问[[Prototype]]，但 Firefox、Safari 和 Chrome 在每个对象上都支持一个属性 \_\_proto__；而在其他实现中，这个属性对脚本则是完全不可见的。不过，要明确的真正重要的一点就是，**这个连接存在于实例与构造函数的原型对象之间，而不是存在于实例与构造函数之间**。

下图展示了各个对象之间的关系：

![prototype](https://user-images.githubusercontent.com/21052717/56959594-7dad3500-6b80-11e9-94d1-659ee3ac2d08.PNG)

可以看到，Person.prototype 指向了原型对象，而 Person.prototype.constructor 又指回了 Person。Person 的两个实例都包含一个内部属性，指向了 Person.prototype。

## 原型链

简单回顾一下构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。那么，假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。

![prototype-chain](https://user-images.githubusercontent.com/21052717/56964258-6c1e5a00-6b8d-11e9-9301-cd479e621f2e.PNG)

可以看到，Person.prototype 也有一个 \_\_proto__ 属性，是因为 Person.prototype 本质上是由 Object 构造函数生成的，所以 Person.prototype.\_\_proto__ 便指向了 Object.prototype。

```js
Person.prototype.__proto__ === Object.prototype;    // true
```

而Object.prototype 的原型又指向 null。

```js
Object.prototype.__proto__ === null;    // true
```

这些相互关联的原型就组成了原型链。

可以用下图表示：

![prototype5](https://user-images.githubusercontent.com/21052717/56965293-85280a80-6b8f-11e9-9a89-23c2ff530ba5.png)

图片来自：[掘金](https://juejin.im/entry/58e5afbd44d904006d300243)

## 补充

### constructor

首先是 constructor 属性，我们看个例子：

```js
function Person() {

}
var person = new Person();
console.log(person.constructor === Person); // true
```

当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到 constructor 属性时，会从 person 的原型也就是 Person.prototype 中读取，正好原型中有该属性，所以：

```js
person.constructor === Person.prototype.constructor
```

### 继承

最后是关于继承，前面我们讲到“每一个对象都会从原型‘继承’属性”，实际上，继承是一个十分具有迷惑性的说法，引用《你不知道的JavaScript》中的话，就是：

继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。