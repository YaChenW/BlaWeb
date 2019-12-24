const { roots:{ ROOT } } = require( '../config' )

let socketEventArr = []

let doSocketEvent = ( socket, io )=>{
  for( let i in socketEventArr ){
    socketEventArr[i]( socket, io )
  }
}

let setSocketEvent = ( apiPath )=>{
  if( !apiPath ) return
  if( apiPath.split('@').length != 2 ) return
  let [ path, func ] = apiPath.split('@')
  let truePath = ROOT + path
  delete require.cache[truePath + '.js']
  let api = require(truePath)[func]
  socketEventArr.push( api )
}

exports = module.exports = {
  doSocketEvent,
  setSocketEvent
}