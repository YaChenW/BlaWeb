const http = require('http')
const proxy = require('../proxy/proxy')

let getProxyData =  async function( options, params ){
  return await new Promise(resolve=>{
    const req = http.request(options, res => {
      let data = ''
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve( data ));
    });
    req.write( params );
    req.end();
  })
}

let setProxy = function( url, host ){
  proxy[url] = host
}

exports = module.exports = { getProxyData, setProxy }
