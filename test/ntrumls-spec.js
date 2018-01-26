import assert from 'assert'
import NTRUMLS from '../'

console.log(NTRUMLS);

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

describe('NTRUMLS test', () => {
  it('should sign message', async () => {
    const message = new Uint8Array([11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
      11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
      11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18])
    const cipher = new NTRUMLS()
    console.log(cipher);
    const keyPair = await cipher.keyPair(NTRUMLS.XXX_20151024_907)
    console.log(17, keyPair.privateKey, keyPair.publicKey)
    const sign = await cipher.sign(message, keyPair.privateKey, keyPair.publicKey)
    const result = await cipher.verify(sign, keyPair.publicKey, message)
    console.log(sign, result)
  })
})
