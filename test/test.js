var NTRUMLS = require('../main');

console.log(NTRUMLS);

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}


var message = new Uint8Array([11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
  11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
  11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18])
var cipher = new NTRUMLS()

var keyPair = cipher.keyPair(NTRUMLS.XXX_20151024_907);
console.log(17, keyPair.privateKey, keyPair.publicKey)
var sign = cipher.sign(message, keyPair.privateKey, keyPair.publicKey);
cipher.verify(sign, keyPair.publicKey, message).then(console.log)
