什么是异步？

简单来说，就是我有一个任务，被分成了两段，先执行第一段任务，然后转而执行其他任务，等做好了准备，再执行第二段任务。

在 Web 浏览器中，Ajax 是很常用的异步，核心是 XHR。

Node.js 异步原理的核心是 Event Loop，当调用 Node.js API 的时候，它会把具体操作和回调函数交给 Event Loop 去执行，Event Loop 维护了一个回调队列，当异步函数执行时，回调函数会被放入这个队列。

## Node.js 自带的异步写法

Node.js 有两种事件处理方式，分别是 callback 和 EventEmitter。

callback 采用错误优先的回调方式，EventEmitter 则是事件驱动里的事件发射器。

### 错误优先的回调方式

这种方式有两种规则：

- 回调函数的第一个参数返回的是 error 对象，如果发生错误，该对象会作为第一个参数返回。如果执行正常，一般做法是返回 null。
- 回调函数的第二个参数返回的是所有成功响应的结果数据。如果结果正常，参数 err 就会被设置为 null，并在第二个参数返回成功响应的结果。

```js
function(err, res) {
  
}
```

#### API 写法约定

模块应该暴露错误优先的回调接口，例如下面的例子：

```js
module.exports = function (name, callback) {
  var person = createPerson(name);

  return callback(null, person);
}
```

```js
const { fstat } = require("fs");

function readJSON(filePath, callback) {
  fs.readFile(filePath, function (err, data) {
    var parsedJson;

    if (err) {
      return callback(err);
    }
    try {
      parsedJson = JSON.parse(data);
    } catch (exception){
      return callback(exception);
    }
    return callback(null, parsedJson);
  });
}
```

### EventEmitter

事件模块是 Node.js 内置的对观察者模式的实现，通过 EventEmitter 属性提供一个构造函数。

一个最简单的 例子：

```js
const EventEmitter = require('events');
const observer = new EventEmitter();

observer.on('topic', function(){
  console.log('topic has occured');
});

function main() {
  console.log('start');
  observer.emit('topic');
}

main();
```

