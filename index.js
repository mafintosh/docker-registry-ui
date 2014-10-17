var xhr = require('xhr')
var tree = require('tree-view')
var highlight = require('highlight.js')

var browser = tree()
var image = window.location.hash.slice(1) || 'fe4f71a4d666f85558a9fd638b6e3482b44ff25c367724a029011e6de86f09bb'

var onerror = function(err) {
  throw err
}

var cd = function(p) {
  xhr({
    timeout: 60*1000,
    method: 'GET',
    url: 'http://localhost:8000/v1/images/'+image+'/tree'+p,
    json: true
  }, function(err, response) {
    if (err) return onerror(err)
    browser.directory(p, response.body)
  })
}

var cat = function(p) {
  xhr({
    timeout: 60*1000,
    method: 'GET',
    url: 'http://localhost:8000/v1/images/'+image+'/blobs'+p
  }, function(err, response) {
    if (err) return onerror(err)

    var $code = document.querySelector('#code-view code')
    $code.className = 'hljs'
    $code.innerHTML = response.body
    highlight.highlightBlock($code)
  })
}

browser.on('directory', function(p) {
  cd(p)
})

browser.on('file', function(p) {
  cat(p)
})

browser.appendTo('#tree-view')
cd('/')