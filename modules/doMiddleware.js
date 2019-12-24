const { middleware } = require('../middleware/middleware')

let  doMiddleware = async function( req, res, machine ){
  for( let i in middleware ){
    machine.setStatus( false )
    await middleware[i]( req, res, machine.setStatus.bind(machine, true) )
    if( !machine.getStatus() ) return
  }
}

module.exports = doMiddleware