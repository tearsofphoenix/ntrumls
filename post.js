;

function dataReturn(returnValue, result) {
  if (returnValue === 0) {
    return result;
  }
  else {
    throw new Error('NTRUMLS error: ' + returnValue);
  }
}

function dataResult(buffer, bytes) {
  return new Uint8Array(
      new Uint8Array(Module.HEAPU8.buffer, buffer, bytes)
  );
}

function dataFree(buffer) {
  try {
    Module._free(buffer);
  }
  catch (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  }
}

function NTRUMLS() {
  if (!this instanceof NTRUMLS) {
    return new NTRUMLS();
  }

  var that = this;
  const init = function(id) {
    Module.ready.then(function () {
      var ret = Module._ntrumls_init(id);
      that.publicKeyBytes = Module._ntrumls_get_publickey_len();
      that.privateKeyBytes = Module._ntrumls_get_privatekey_len();
      console.log(that, ret);
    });
  }

  this.keyPair = function (id) {
    if (!id) {
      id = NTRUMLS.XXX_20151024_907;
    }
    that.id = id;
    return init(id).then(function () {
      var publicKeyBuffer = Module._malloc(that.publicKeyBytes);
      var privateKeyBuffer = Module._malloc(that.privateKeyBytes);

      try {
        var returnValue = Module._ntrumls_gen_key(
            publicKeyBuffer,
            privateKeyBuffer
        );

        return dataReturn(returnValue, {
          publicKey: dataResult(publicKeyBuffer, that.publicKeyBytes),
          privateKey: dataResult(privateKeyBuffer, that.privateKeyBytes)
        });
      }
      finally {
        dataFree(publicKeyBuffer);
        dataFree(privateKeyBuffer);
      }
    });
  }

  this.sign = function (message, privateKey, publicKey) {
    return init(that.id).then(function () {
      var messageBuffer = Module._malloc(message.length);
      var publicKeyBuffer = Module._malloc(that.publicKeyBytes);
      var privateKeyBuffer = Module._malloc(that.privateKeyBytes);

      Module.writeArrayToMemory(message, messageBuffer);
      Module.writeArrayToMemory(publicKey, publicKeyBuffer);
      Module.writeArrayToMemory(privateKey, privateKeyBuffer);
      var signBuffer = null;
      try {
        Module._ntrumls_pre_sign(privateKeyBuffer, publicKeyBuffer);
        that.signBytes = Module._ntrumls_get_sig_len();
         signBuffer = Module._malloc(that.signBytes);

        var returnValue = Module._ntrumls_sign(
            privateKeyBuffer,
            publicKeyBuffer,
            messageBuffer,
            message.length,
            signBuffer
        );

        return dataReturn(
            returnValue,
            dataResult(signBuffer, that.signBytes)
        );
      }
      finally {
        dataFree(messageBuffer);
        dataFree(publicKeyBuffer);
        dataFree(privateKeyBuffer);
        dataFree(signBuffer);
      }
    });
  }

  this.verify = function (signed, publicKey, message) {
    return init(that.id).then(function () {
      try {
        return Module._ntrumls_verify(
            signed,
            signed.byteLength,
            publicKey,
            message,
            message.byteLength);
      } catch (e) {
        console.log(e)
      } finally {
        return false
      }
    });
  }

  this.dispose = function () {
    Module._ntrumls_dispose();
  }
}

NTRUMLS.XXX_20140508_401 = 0;
NTRUMLS.XXX_20140508_439 = 1;
NTRUMLS.XXX_20140508_593 = 2;
NTRUMLS.XXX_20140508_743 = 3;

NTRUMLS.XXX_20151024_401 = 4;
NTRUMLS.XXX_20151024_443 = 5;
NTRUMLS.XXX_20151024_563 = 6;
//XXX_20151024_509,
NTRUMLS.XXX_20151024_743 = 7;
NTRUMLS.XXX_20151024_907 = 8;

return NTRUMLS;
}());


if (typeof module !== 'undefined' && module.exports) {
    NTRUMLS.NTRUMLS		= NTRUMLS;
	module.exports	= NTRUMLS;
}
else {
	self.NTRUMLS		= NTRUMLS;
}
