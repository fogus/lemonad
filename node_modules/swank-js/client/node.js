var SwankJS = require('./swank-js'),
    SWANKJS_HOST = process.env.SWANKJS_HOST || "localhost",
    SWANKJS_PORT = process.env.SWANKJS_PORT || 8009;

SwankJS.setupNodeJSClient = function(host, port) {
  var serverURL = 'http://' + (host || SWANKJS_HOST) + ':' + (port || SWANKJS_PORT);
  this.setup(serverURL);
}

// making these objects available through eval for development purposes
global.module = module;
global.require = require;

// if required by another module just export and leave start to the module
if (module.parent) {
  module.exports = SwankJS;
} else {
  // otherwise make the connection now
  SwankJS.setupNodeJSClient();
}