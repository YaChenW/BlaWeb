ROOT = __dirname.replace( /node_modules\/blaweb$/ , "" )
module.exports = {
  roots:{
    ERROR: __dirname + '/errors',
    ROOT
  },
  log:{
    error: __dirname + '/log/error.log'
  }
}