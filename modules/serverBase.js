const fs = require('fs')
const mime = require('mime')
const { roots } = require('../config') 
const { writeErrorLog } = require('../log/log')
const { getProxyData } = require('./doProxy') 
const querystring = require('querystring')

// 解耦
let resObject = {
  req: null,
  res: null,
  resolveMethod: '',
  code: '200',
  path: '',
  func: '',
  data: '',
  type: '',
  resData: null,
  protocol: '',
  hostname: '',
  port: ''
}

let initResObject = function( req, res, code ){
  let { path, func, resolveMethod, protocol, hostname, port } = req.resolveUrlObject 
  resObject.req = req
  resObject.res = res
  resObject.resolveMethod = resolveMethod || 'ERROR'   //  'STATIC' ,  'VIEWS', 'DATA', 'ERROR', 'PROXY'
  resObject.code = code || '200'
  resObject.path = path
  resObject.func = func
  resObject.protocol = protocol
  resObject.hostname = hostname
  resObject.port = port
}


//找文件文件
let findFile = async function(){
  let { req, res, code, path, resolveMethod, func, hostname, port } = resObject
  switch( resolveMethod ){
    case 'VIEWS':
      resObject.path = roots['ROOT'] + path
      break
    case 'STATIC':
      resObject.path = roots['ROOT'] + path
      break
    case 'DATA':
      path = resObject.path = roots['ROOT'] + path
      delete require.cache[path + '.js']    // require 导入模块的缓存在 cache 中 删除键来清除缓存
      let resData = resObject.resData = await require(path)[func]( req, res )
      if( resData.type === 'VIEWS' ){
        resObject.resolveMethod = resData.type
        resObject.path = resData.path
        findFile()
      }
      break
    case 'PROXY':
      resObject.resData = JSON.parse(
        await getProxyData( 
          {
            method: req.method,
            hostname,
            port,
            path,
          }, 
          querystring.stringify(req.params) 
        )
      )
      break
    case 'ERROR':
      resObject.path = roots['ERROR'] + `/${code}.html`
      break
  }
}

// 读文件
let readFile = async function(){
  try{
    let { resolveMethod, path, resData } = resObject
    switch( resolveMethod ){
      case 'VIEWS':
        resObject.data = fs.readFileSync( path)
        resObject.type = mime.getType( path )
        break;
      case 'STATIC':
        resObject.data = fs.readFileSync( path )
        resObject.type = mime.getType( path )
        break;
      case 'DATA':
        resObject.data = JSON.stringify(resData.data)
        resObject.type = resData.type
        break
      case 'PROXY':
        resObject.data = JSON.stringify(resData.data)
        resObject.type = resData.type
        break
      case 'ERROR':
        resObject.data = fs.readFileSync( path)
        resObject.type = mime.getType( path )
        break;
    }
  }catch( e ){
    writeErrorLog(e)
    resObject.data = fs.readFileSync( roots['ERROR'] + '/404.html' )
  }
}

// 返文件
let send = function(){
  try{
    let { res, code, type, data } = resObject
    res.writeHead( code, { 'Content-Type': type } )
    res.write(data)
    res.end()
  }catch(e){
    writeErrorLog(e)
  }
}



let webServerResponse = async function( req, res, code ){
  if( !req.resolveUrlObject ) return
  initResObject( req, res, code)
  await findFile()
  await readFile()
  send()
}

exports = module.exports = { send, webServerResponse }