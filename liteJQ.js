"use strict";
(function(win) {
  // 为字符串扩展去除头尾空白字符的方法
  String.prototype.trim = function() {　　
    return this.replace(/(^\s*)|(\s*$)/g, "");　　
  };
  // 创建唯一作用域
  // 设置window和document对象的引用以加速IIFE（立即执行函数）中对这些对象的访问
  var global = win;
  var doc = window.document;
  // 使用$函数返回LiteJQ构造函数生成的实例
  var $ = function(params, context) {
    return new LiteJQ(params, context);
  }
  // 判断是否有html标签
  // ^\s*：匹配行首任意多个空白字符
  // \w：匹配包括下划线的任何单词字
  // (\w+|!)：匹配包含下划线的字符或感叹号(html注释)
  // [^>]*：匹配0个或多个不为>的字符
  var regXContainsTag = /^\s*<(\w+|!)[^>]*>/;
  // params是传入的操作目标，context是上下文
  var LiteJQ = function(params, context) {
    // 判断是否有上下文参数，没有则默认全局作用域
    // 有则判断是节点还是字符串，如果是字符串则使用选择器选中
    var currentContext = doc;
    if (context) {
      if (context.nodeType) {
        currentContext = context;
      } else {
        currentContext = doc.querySelector(context);
      }
    }
    // 如果没有传params，返回空的LiteJQ对象
    if (!params || params === '' || typeof params === 'string' && params.trim() === '') {
      this.length = 0;
      return this;
    }
    // 如果是HTML字符串,构造文档片段，填好对象，然后返回
    if (typeof params === 'string' && regXContainsTag.test(params)) {
      // 创建div和文档片段，附加div到文档片段，将div的innerHTML设成该字符串
      var divElm = currentContext.createElement('div');
      // divElm.className = 'hippo-doc-frag-wrapper';
      var docFrag = currentContext.createDocumentFragment();
      docFrag.appendChild(divElm);
      // var queryDiv = docFrag.querySelector('div');
      docFrag.innerHTML = params;
      var numberOfChildren = docFrag.children.length;
      // 遍历节点列表并填充对象，因为HTML字符串可能含有多个兄弟节点
      for (var z = 0; z < numberOfChildren; z++) {
        this[z] = docFrag.children[z];
      }
      // 设置对象的length
      this.length = numberOfChildren;
      // 返回object
      return this;
    }
    // 如果传入的单个节点引用，填好对象，返回
    if (typeof params === 'object' && params.nodeName) {
      this.length = 1;
      this[0] = params;
      return this;
    }

    // 如果是个对象但不是个节点则假设其为节点列表或者数组，甚或选择器字符串
    var nodes;
    if (typeof params !== 'string') {
      nodes = params;
    } else {
      nodes = currentContext.querySelectorAll(params.trim());
    }
    // 遍历前面创建的数组或者节点列表，填充返回
    var nodeLength = nodes.length;
    for (var i = 0; i < nodeLength; i++) {
      this[i] = nodes[i];
    }
    // 设置对象的length
    this.length = nodeLength;
    // 返回object
    return this;
  }
  // 暴露$到全局作用域
  global.$ = $;
  // prototype的捷径
  $.fn = LiteJQ.prototype;
  // each()方法
  $.fn.each = function(callback) {
    var len = this.length;
    for (var i = 0; i < len; i++) {
      callback.call(this[i], i, this[i]);
    }
    return this;
  }
  // html方法
  $.fn.html = function(htmlString) {
    if (htmlString) {
      return this.each(function() {
        this.innerHTML = htmlString;
      })
    } else {
      return this[0].innerHTML;
    }
  };
  // text方法
  $.fn.text = function(textString) {
    if (textString) {
      return this.each(function() {
        this.textContent = textString;
      });
    } else {
      return this[0].textContent.trim();
    }
  };
  // append方法
  $.fn.append = function(stringOrObject) {
    return this.each(function() {
      if (typeof stringOrObject === 'string') {
        this.insertAdjacentHTML('beforeend', stringOrObject);
      } else {
        var that = this;
        $(stringOrObject).each(function(name, value) {
          that.insertAdjacentHTML('beforeend', value.outerHTML)
        })
      }
    })
  }
})(window);
