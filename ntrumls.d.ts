import {INTRUMLS} from "NTRUMLS";

declare module 'NTRUMLS' {
	interface INTRUMLS {
		/** Private key length. */
		privateKeyBytes: number;

		/** Public key length. */
		publicKeyBytes: number;

		/** sign message with privateKey & publicKey. */
		sign (message: Uint8Array|string, privateKey: Uint8Array, publicKey: Uint8Array) : Promise<Uint8Array>;

		/** verify message with publicKey. */
		verify (sign: Uint8Array|string, publicKey: Uint8Array, message: Uint8Array) : Promise<boolean>;

		/** Generates key pair. */
		keyPair (id?: number) : Promise<{privateKey: Uint8Array; publicKey: Uint8Array}>;

		/** Free data */
		dispose () : void;
	}

	const NTRUMLS: INTRUMLS;
}
