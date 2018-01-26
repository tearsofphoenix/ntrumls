# ntrumls.js

## Overview

The [NTRUMLS](https://en.wikipedia.org/wiki/NTRUEncrypt) post-quantum asymmetric
cipher compiled to WebAssembly using [Emscripten](https://github.com/kripken/emscripten).
A simple JavaScript wrapper is provided to make NTRU easy to use in web applications.

## Example Usage

	(async () => {
		const keyPair /*: {privateKey: Uint8Array; publicKey: Uint8Array} */ =
			await ntru.keyPair()
		;

		const plaintext /*: Uint8Array */ =
			new Uint8Array([104, 101, 108, 108, 111, 0]) // "hello"
		;

		const encrypted /*: Uint8Array */ =
			await ntru.encrypt(plaintext, keyPair.publicKey)
		;

		const decrypted /*: Uint8Array */ =
			await ntru.decrypt(encrypted, keyPair.privateKey) // same as plaintext
		;

		console.log(keyPair);
		console.log(plaintext);
		console.log(encrypted);
		console.log(decrypted);
	})();

