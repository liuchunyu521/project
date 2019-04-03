const config = require('../config')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')
const opn = require('opn')
const app = express()
const port = config.dev.port
const autoOpenBrowser = !!config.dev.autoOpenBrowser
const autoOpenUrl = config.dev.autoOpenUrl
// 处理代理
let proxyTable = config.dev.proxyTable
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  app.use(proxyMiddleware(options.filter || context, options))
});

app.use('/', express.static('./dist'))

let uri = 'http://localhost:' + port;
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    // opn(uri + '/wbalone/index.html')
    opn(uri + autoOpenUrl);
  }
})
