var os = require('os');
var oldpath = process.cwd();
process.chdir(module.filename.replace('main.js',''));
var addon = require('./lib/addon-'+os.platform()+'-'+os.arch());
process.chdir(oldpath);


module.exports = {
    createKey: function () {
        return addon.genKey();
    },
    sign: function (message, publicKey, privateKey) {
        var abi = addon.sign(message, publicKey, privateKey);
	return abi.buffer.slice(0, abi.length);
    },
    verify: function (signature, message, publicKey) {
        return addon.verify(signature, message, publicKey);
    }
};
