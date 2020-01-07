const http = require('http')

const { webServerResponse } = require('./modules/serverBase')
const doMiddleware = require('./modules/doMiddleware')
const { get, post } = require('./modules/doRouter')
const { setStatic } = require( './modules/doStatic' )
const { writeErrorLog } = require('./log/log')
const { use } = require('./middleware/middleware')
const resFun = require( './modules/resFun' )
const { doSocketEvent, setSocketEvent } = require( './modules/doSocket' )
const { setProxy } = require( './modules/doProxy' )

const machine = new (require('./modules/statusMachine'))()

const server = http.createServer()
const io = require( 'socket.io' )( server,{ pingTimeout: 5000000 } )

exports = module.exports = server

server.get = get
server.post = post
server.setStatic = setStatic
server.use = use
server.setSocketEvent = setSocketEvent
server.setProxy = setProxy

let requestHandle = async function( req, res ){
  try{
    res.json = resFun.json
    res.views = resFun.views
    await doMiddleware(req, res, machine)
    await machine.getStatus && webServerResponse(req, res)
  }catch(e){
    writeErrorLog(e)
    webServerResponse(req, res, 'error', 500)
    status = false
  }
}

let connectHandle = socket=>{
  doSocketEvent( socket, io )
}

io.on( 'connect', connectHandle)

server.on( 'request', requestHandle )