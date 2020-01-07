## BlaWeb 起步
`BlaWeb`是一个基于`node.js`内含`socket.io`的web框架，如果你还不熟悉如何使用`BlaWeb`，跟着以下来完成一个小`demo`会对你有帮助
### 安装
> 创建项目文件夹,并初始化项目
```
mkdir demo
cd demo
npm init
```
> 安装 BlaWeb 和 BlaWeb的依赖包 
```
npm i --save socket.io mime
git clone git@code.aliyun.com:BlaCat/BlaWeb.git
rm -rf BlaWeb/.git*
mv BlaWeb node_modules/
```
> 到此BlaWeb的安装的完成了
##### `demo`目录结构
```
demo
  |- node_modules
  |- package-lock.json
  |_ package.json
```

### 使用
> 在`demo`根路径下创建`server.js`, `+`表示添加文件或者文件夹，`-`表示删除
##### `demo`目录结构
``` 
demo
  |- node_modules
  |- package-lock.json
  |- package.json
 +|_ server.js
```
> 导入blaweb, 启动服务器
##### server.js
```
const blaweb = require('BlaWeb')

blaweb.listen( 8080, function(){
    console.log( 'server is running...' )
})
```
运行`node server.js`就可以启动服务器并会在终端输出`server is running...`。  
##### `blaweb.listen( port, listenHander )`
- blaweb的listen方法用于启动服务器
- port <Integer> 参数表示服务器监听的端口号
- listenHander <Function> :参数是回调函数，这个回调函数会在服务器启动成功的时候执行。
- return <http.Server>
tip: 尖括号里的内容表示参数的类型。比如，上面表示port是整型，listenHander 是一个方法。

### 处理`get`请求,`post`请求
#### 处理GET请求
> 创建 `views`文件夹, `index.html`文件
##### `demo`目录结构
``` 
demo
  |- node_modules
 +|- views
 +     |_ index.html
  |- package-lock.json
  |- package.json
  |_ server.js
```
##### index.html
> index.html 添加内容 
```
<h1> Hello BlaWeb!!! </h1>
```
##### blaweb.get( url, dataPath )
- balweb.get用于处理get请求，给客户端响应页面，或接口。
- url <string> 请求路径
- dataPaht <string> 数据路径
> get请求也可以设置接口，设置方法和post方法一样。设置post接口将在之后介绍。

##### server.html
> 修改server.js `+`表示添加的代码，`-`表示删除的代码
```
const blaweb = require('BlaWeb')

blaweb.listen( 8080, function(){
    console.log( 'server is running...' )
})

+ blaweb.get( '/index', 'views/index.html' )
```
> 修改完 server.html 后启动服务器,在浏览器中输入`http://localhost:8080/index`就可以访问之前卸载views文件夹下的index.html。

#### 处理post请求
> 创建 `controller文件夹`, `userController.js`,`login.html`
##### `demo`目录结构
``` 
demo
  |- node_modules
+ |- controller
+       |_ userController.js 
  |- views
        |- index.html
+       |_ login.html
  |- package-lock.json
  |- package.json
  |_ server.js
```


##### server.js
> 修改 server.js `+`表示添加的代码，`-`表示删除的代码
```
const blaweb = require('BlaWeb')

blaweb.listen( 8080, function(){
    console.log( 'server is running...' )
})

blaweb.get( '/index', 'views/index.html' )
+ blaweb.get( 'login', 'views/index.html' )
+ blaweb.post( '/login', 'controller/userController.js@login' )

```
##### blaweb.post( url, apiPath )
- balweb.get用于处理get请求，
- url <string> 请求路径
- apiPaht <string> api方法路径，api路径和接口名用@隔开
##### userController.js
> 在`contriller`文件夹下修改`userController.js`来添加api接口
```
var login = function( req, res  ){
    console.log( 'req.params = ', req.params )
    console.log( 'req.cookies = ', req.cookies )
    res.cookie( 'username', 'blaweb' )
    var data = { flag: 1 }  // JSON数据data
    
    //return res.json(data)  第一种响应方法，返回JSON数据
    return res.views( 'views/index.html' ) // 第二种响应的方法， 返回页面
}

exports = module.exports = {
    login
}
```
##### api接口的参数
- req <http.IncomingMessage> api接口的第一个形参，可以设置任意变量名来接收(通常用 res )  
- req.cookies <Object> 请求的cookie。
 req.params <Object> 请求的参数
- res <http.ServerResponse> api接口的第二个形参，同样可以设置任意变量名接收(通常用res)  
##### res.cookie( key, value )
- 设置cookie  
- key <String> cookie的键  
- value <String> cookie的值  
##### res.json( data )
- api方法的返回值，用于返回JSON数据对象
- data < Object > JSON对象数据
- return <Object> 服务器用于返回响应的数据对象

##### res.views( path )
- api方法的返回值，用于返回页面
- path <String> 相对于项目根路径的页面路径
- return <Object> 服务器用返回响应的数据对象

##### `login.html`
```
<form action="/login" method="POST">
  <input type="text" name="username" placeholder="username" >
  <input type="password" name="password" placeholder="password" >
  <input type="submit" value="login">
</form>
```
##### `index.html`
> 在`login.html`提交请求后会设置cookie并跳转到`index.html`页面。接下来我们要修改`index.html`页面使其能接收`cookie`并显示在页面上。
```
<h1>Hello BlaWeb !!!</h1>
+<h2></h2>
+<script>
+  var h2 = document.getElementsByTagName('h2')[0]
+  if( document.cookie ){
+    h2.innerText = 'cookies:' + document.cookie
+  }
+</script>

```
> 修改完成后启动服务器,在浏览器中输入`http://localhost:8080/login`访问`login.html`页面,输入用户名和密码比如:demo、demopwd。点击login按钮将会跳转到`index.html页面`。
#### 运行效果
##### 页面显示：
# Hello BlaWeb !!!
## cookies:username=blaweb。
##### 运行服务器的终端打印信息
```
server is running...
req.params =  { username: 'w913155964', password: '123456' }
req.cookies =  { username: 'blaweb' }
key =  username
```
### 设置静态文件
如果想用外部式来写js，css。或者想给网页引入图片就要设置静态文件夹。
> 创建 `public`、 `js`、`css`、`img`文件夹，`index.js`、`index.css`文件。`cat.png`可以是任意图片。
##### `demo`目录结构
``` 
demo
  |- node_modules
+ |- public
+       |- js
+           |_ index.js
+       |- css
+           |_ index.css
+       |- img
+           |_ cat.png 
  |- controller
        |_ userController.js 
  |- views
        |- index.html
        |_ login.html
  |- package-lock.json
  |- package.json
  |_ server.js
```
##### server.js
> 修改 server.js `+`表示添加的代码，`-`表示删除的代码
```
const blaweb = require('BlaWeb')

blaweb.listen( 8080, function(){
    console.log( 'server is running...' )
})

blaweb.get( '/index', 'views/index.html' )
blaweb.get( 'login', 'views/index.html' )
blaweb.post( '/login', 'controller/userController.js@login' )
 + blaweb.setStatic( '/css', 'public/css' )
 + blaweb.setStatic( '/js', 'public/js' )
 + blaweb.setStatic( '/img', 'public/img' )

```
##### blaweb.setStatic( url, staticPath )
- balweb.setStatic 用于设置静态文件路由，使相应的请求可以访问到服务器的静态文件。实现原理为：修改以url为前缀的请求路径的前缀为staticPath。比如 `url/index.css` => `staticPath/index.css`。
- url <string> 请求路径前缀
- apiPaht <string> api方法路径，api路径和接口名用@隔开
##### index.html
> 添加图片引入 `css` 和 `js`, `+`表示添加的代码，`-`表示删除的代码
```
+ <link rel="stylesheet" href="/css/index.css">
<h1>Hello BlaWeb !!!</h1>
<h2></h2>
-<script>
-  var h2 = document.getElementsByTagName('h2')[0]
-  if( document.cookie ){
-    h2.innerText = 'cookies:' + document.cookie
-  }
-</script>
+ <img src="/img/cat.png" >
+ <script src="/js/index.js"></script>

```
##### index.js
```
var h2 = document.getElementsByTagName('h2')[0]
if( document.cookie ){
  h2.innerText = 'cookies:' + document.cookie
}
```
##### css.js
```
body{
  background-color: pink;
}
```
> 修改完成后启动服务器,在浏览器中输入`http://localhost:8080/login`访问`login.html`页面。查看显示效果。 