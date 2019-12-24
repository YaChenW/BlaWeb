const fs = require( 'fs' )
const { log:{ error } } = require('../config')

let getDate = function(){
  let date = new Date()
  let dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return dateStr
}

let writeErrorLog = function( e, location ){
  let data = ''
  location = location || 'location is null'
  let options = {
    encoding: 'utf-8',
    flag: 'a'
  }

  data = data.concat('\n')
  .concat('[Error]:\n')
  .concat(`\t[Error Time]:     ${getDate()}\n`)
  // .concat(`\t[ERROR Location]  ${location}\n`)\
  .concat(`\t[Error Name]:     ${e.name}\n`)
  .concat(`\t[Error Message]:  ${e.message}\n`)
  .concat(`\t[Error Stack]:  \n\t\t${e.stack}\n`)
  .concat(`[Error]: end\n`)
  console.log(data)
  fs.writeFileSync( error, data, options )
}

exports = module.exports = { writeErrorLog }