#include <node.h>
#include <node_buffer.h>

#include "NTRUMLS/src/fastrandombytes.h"
#include "NTRUMLS/src/params.h"
#include "NTRUMLS/src/pqerror.h"
#include "NTRUMLS/src/pqntrusign.h"
#include "NTRUMLS/src/pack.h"

#include <fcntl.h>
#ifdef __unix__
#include <unistd.h>
#endif
#if defined(WIN32) || defined(_WIN32) || defined(__WIN32) && !defined(__CYGWIN__)
#define WINDOWS 1
#include <Windows.h>
#endif
namespace ntru {

    PQ_PARAM_SET *P;
using namespace v8;

void GenKey(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  size_t publen;
  size_t privlen;

  pq_gen_key(P, &privlen, NULL, &publen, NULL);

  uint8_t* pubkey = new uint8_t[publen];
  uint8_t* privkey = new uint8_t[privlen];

  pq_gen_key(P, &privlen, privkey, &publen, pubkey);

  v8::Local<Object> obj = v8::Object::New(isolate);
  obj->Set(v8::String::NewFromUtf8(isolate,"private"), node::Encode(isolate,(const char*)privkey,privlen,node::encoding::BUFFER));
  obj->Set(v8::String::NewFromUtf8(isolate,"public"), node::Encode(isolate,(const char*)pubkey,publen,node::encoding::BUFFER));
  args.GetReturnValue().Set(obj);
  free(pubkey);
  free(privkey);
}
void signData(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  size_t dlen = node::Buffer::Length(args[0]);
  unsigned char* ptr = (unsigned char*)node::Buffer::Data(args[0]);

  size_t publen = node::Buffer::Length(args[1]);
  unsigned char* pubkey = (unsigned char*)node::Buffer::Data(args[1]);

  size_t privlen = node::Buffer::Length(args[2]);
  unsigned char* privkey = (unsigned char*)node::Buffer::Data(args[2]);

  size_t packed_sig_len = 0;
  pq_sign(&packed_sig_len, NULL, privlen, privkey, publen, pubkey, 0, NULL);
  
  v8::Local<v8::Value> outbuffer = node::Buffer::New(isolate, packed_sig_len).ToLocalChecked();
  pq_sign(&packed_sig_len, (unsigned char*)node::Buffer::Data(outbuffer), privlen, privkey, publen, pubkey, dlen, ptr);

  v8::Local<v8::Object> output = v8::Object::New(isolate);
  output->Set(String::NewFromUtf8(isolate,"buffer"),outbuffer);
  output->Set(String::NewFromUtf8(isolate,"length"),Int32::NewFromUnsigned(isolate,(uint32_t)packed_sig_len));
  args.GetReturnValue().Set(output);
  
}

void verifyData(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  size_t siglen = node::Buffer::Length(args[0]);
  unsigned char* sig = (unsigned char*)node::Buffer::Data(args[0]);

  size_t messageLen = node::Buffer::Length(args[1]);
  unsigned char* message = (unsigned char*)node::Buffer::Data(args[1]);

  size_t publen = node::Buffer::Length(args[2]);
  unsigned char* pubkey = (unsigned char*)node::Buffer::Data(args[2]);

  int ret = pq_verify(siglen, sig, publen, pubkey, messageLen, message);
  bool ok = ret == PQNTRU_OK;

  v8::Local<v8::Object> output = v8::Object::New(isolate);
  output->Set(0, v8::Boolean::New(isolate, ok));
  args.GetReturnValue().Set(output);
}

void init(Local<Object> exports) {
  rng_init();
  P = pq_get_param_set_by_id(XXX_20151024_907);
  NODE_SET_METHOD(exports, "genKey", GenKey);
  NODE_SET_METHOD(exports,"sign",signData);
  NODE_SET_METHOD(exports,"verify",verifyData);
}

NODE_MODULE(addon, init)
}
