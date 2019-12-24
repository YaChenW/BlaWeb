const static = require( '../static/static' )

let setStatic = function( url, path ){

  /** 设置静态文件路由
   * @param {string} url 请求url路径
   * @param {string} path 路由路径
   * */

  static[url] = path
}

exports = module.exports = { setStatic }