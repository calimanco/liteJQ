# liteJQ
一个仿jQuery的小工具库

学习《DOM启蒙》受到一些启发，一点点学习弄出来的东西。

由于使用了querySelector，所有只支持IE8+。  
现在只有选择器和each(),text(),html(),append()四个方法，用法和jq类似。

## 使用示例：
```
$('a')   //选择所有a标签的dom节点
$('.head')   //选择所有head类的dom节点
$('#foot')    //选择所有id是foot的dom节点

//遍历节点
$('a').each(function(){
	...
})

//text方法
$('a').text('abc')

//html方法
$('a').html('<div>a</div>')

//append方法
$('a').append('<div>a</div>')
```

## 注意：
扩展了全局String，添加了trim方法，用来去掉字符串左右两边的空白符。
