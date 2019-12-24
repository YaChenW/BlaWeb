### BlaCat 是个基于Node.js的web框架

### 安装与使用

#### 克隆BlaCat到项目根路径
```
  git clone git@code.aliyun.com:BlaCat/BlaWeb.git
```

#### 创建服务器
```
const server = require( './express/server' )  // 创建web服务器
```

### server
server 使用 http.createServer() 创建, 除了 `<http.Server>` 自带的方法以外还有 server.get(), server.post(), server.use() 等方法

#### 设置路由 ( server.get, server.post )
```
//server.js

/** 设置post路由
  * param {String} url 请求路径
  * param {String} path 相对于项目跟目录的相对路径，设置路由页面或者api, api函数用@隔开
  */
server.post( url, path )

/** 设置get路由
  * param {String} url 请求路径
  * param {String} path 相对于项目跟目录的相对路径，设置路由页面或者api, api函数用@隔开
  */
server.get( url, path )
```
eg:
```
server.get( '/login', 'views/login.html' )

server.get( '/login', 'controller/userController@login' ) 

```
#### api接口
```
// controller/userController

/** api 接口会被传入  <http.IncomingMessage>,  <http.ServerResponse> 对象, 可以设置形参接收,
  *请求数据保存在 req.pramas 中, req.cookies 可以获得请求的 cookie
  */
let login = ( req, res )=>{
  console.log( req )
  console.log( res )
}

exports = module.exports = { login }
```

#### 设置静态路由 ( server.use )

```
/** 设置静态资源路由
  * param {String} url 请求路径前缀
  * param {String} path 相对于项目跟目录的相对路径前缀
  */
server.use( url, path )
```

eg:
```
server.use( '/css', 'public/css' )
```
