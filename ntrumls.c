#include <stdlib.h>
#include <stdint.h>
#include <string.h>

#include "fastrandombytes.h"
#include "params.h"
#include "pqerror.h"
#include "pqntrusign.h"
#include "pack.h"
#include <memory.h>

static size_t privkey_blob_len;
static size_t pubkey_blob_len;
static size_t packed_sig_len;
static PQ_PARAM_SET *P;

size_t ntrumls_get_privatekey_len() {
    return privkey_blob_len;
}

size_t ntrumls_get_publickey_len() {
    return pubkey_blob_len;
}

size_t ntrumls_get_sig_len() {
    return packed_sig_len;
}

int ntrumls_init(PQ_PARAM_SET_ID id) {

    rng_init();

    if(!(P = pq_get_param_set_by_id(id))) {
        exit(EXIT_FAILURE);
    }

    return pq_gen_key(P, &privkey_blob_len, NULL, &pubkey_blob_len, NULL);
}

int ntrumls_gen_key(uint8_t* privkey_blob, uint8_t* pubkey_blob) {
    return pq_gen_key(P, &privkey_blob_len, privkey_blob, &pubkey_blob_len, pubkey_blob);
}

int ntrumls_pre_sign(uint8_t* privkey_blob, uint8_t* pubkey_blob) {
  return pq_sign(&packed_sig_len, NULL, privkey_blob_len, privkey_blob, pubkey_blob_len, pubkey_blob, 0, NULL);
}

int ntrumls_sign(uint8_t* privkey_blob, uint8_t* pubkey_blob, uint8_t *msg, size_t msg_len, uint8_t *sigs) {
  return pq_sign(&packed_sig_len, sigs, privkey_blob_len, privkey_blob,
                                    pubkey_blob_len, pubkey_blob,
                                    msg_len, msg);

}

int ntrumls_verify(uint8_t* sigs, size_t packed_sig_len, uint8_t* pubkey_blob, uint8_t *msg, size_t msg_len) {
    return pq_verify(packed_sig_len, sigs, pubkey_blob_len, pubkey_blob, msg_len, msg);
}

void ntrumls_dispose() {
  rng_cleanup();
}
