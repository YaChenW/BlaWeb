const { webServerResponse } = require('../modules/serverBase')
const static = require('../static/static')
const router = require('../router/router')
const writeErrorLog = require( '../log/log' )


let setParams = async function (req, res, next){
  try{ 
    let params = req.params = {}
    let args = ""
    if (req.method == 'GET') {
      let catchArg = new RegExp(/\?.*/)
      args = catchArg.exec(req.url)
      args = args && args[0].split('&')
      req.url = req.url.replace(catchArg, '')
    }
  
    if (req.method == 'POST') {
      await req.on('data', (data) => {
        args += data
      })
      await req.on('end', () => { })
    }
  
    if (args){
      args = args.split('&')
      let arg = ''
      let value = ''
      for (let item in args) {
        [arg, value] = args[item].split('=')
        params[arg] = value
      }
    }
    next()
  } catch (e) {
    writeErrorLog(e)
  }
}

let setCookie = function (req, res, next){
  try {
    let cookies = req.cookies = res.cookies = {}
    if (cookItem = decodeURIComponent(req.headers.cookie)){
      cookItem = cookItem.split('; ')
      for (let item in cookItem) {
        [arg, value] = cookItem[item].split('=')
        if( !arg || !value ) break
        cookies[arg] = value
      }
    }
    res.cookie = function( key, value ){
      this.cookies[key] = value
      let setCookie = []
      for( let key in this.cookies ){
        setCookie.push( `${key}=${encodeURIComponent(this.cookies[key])}` )
      }
      res.setHeader( 'Set-Cookie', setCookie )
    }
    next()
  } catch (e) {
    writeErrorLog(e)
  }
}

let doStatic = function (req, res, next){
  try{
    let url = req.url
    let reg = ''
    for (let key in static) {
      reg = new RegExp('^' + key)
      if (reg.test(url)) {
        let path = url.replace(reg, static[key])
        let resolveMethod = 'STATIC'
        let func = ''
        req.resolveUrlObject = {
          path,
          resolveMethod,
          func
        }
        return
      }
    }
    next() 
  }catch (e){
    writeErrorLog(e)
  }
}

let doRouter = function (req, res, next) {
  try{
    let method = req.method.toLocaleUpperCase()
    let url = req.url
    if( router[method][url] ){
      let { path , resolveMethod, func } = router[method][url]
      req.resolveUrlObject = {
        path,
        resolveMethod,
        func
      }
    }
    next()
  }catch (e){
    writeErrorLog(e)
  }
}

let middleware =  [setParams, setCookie, doStatic, doRouter]

let use = ( func )=>{
  middleware.push( func )
}

exports = module.exports = {
  middleware,
  use
}

