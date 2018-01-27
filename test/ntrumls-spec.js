var assert = require('assert')
var NTRUMLS = require('../')

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

describe('NTRUMLS test', function () {
    it('should sign message', function() {
        const message = new Uint8Array([11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
            11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
            11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18])
        const keyPair = NTRUMLS.createKey()
        const sign = NTRUMLS.sign(message, keyPair.public, keyPair.private)
        const result = NTRUMLS.verify(sign, message, keyPair.public)
    })
})
