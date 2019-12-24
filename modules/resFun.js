let json = (data)=>{
  return {
    type: 'json',
    data
  }
}

let views = ( path )=>{
  return {
    type: 'VIEWS',
    path
  }
}

exports = module.exports = {
  json,
  views
}