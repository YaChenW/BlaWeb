const router = require('../router/router')



let setRouter = ( method, url, routerPath )=>{
  let [path, func, resolveMethod] = [ routerPath, '', 'VIEWS' ]
  if( /@/.test( routerPath ) ){
    [ path, func ] = routerPath.split('@')
    resolveMethod = 'DATA'
  }
  router[method][url] = {
    path,
    func,
    resolveMethod,
  }
}

let get = function( url, routerPath ){
  setRouter( 'GET', url, routerPath )
}
let post = function(  url, routerPath ){
  setRouter( 'POST', url, routerPath )
}

module.exports = { get, post }