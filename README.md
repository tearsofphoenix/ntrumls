# ntrumls.js

## Overview

The [NTRUMLS](https://en.wikipedia.org/wiki/NTRUEncrypt) post-quantum asymmetric
cipher compiled to WebAssembly using [Emscripten](https://github.com/kripken/emscripten).
A simple JavaScript wrapper is provided to make NTRU easy to use in web applications.

## Example Usage
```js
    const message = new Uint8Array([11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
            11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18,
            11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18, 11, 12, 13, 14, 15, 16, 17, 18])
    const keyPair = NTRUMLS.createKey()
    const sign = NTRUMLS.sign(message, keyPair.public, keyPair.private)
    const result = NTRUMLS.verify(sign, message, keyPair.public)
```

