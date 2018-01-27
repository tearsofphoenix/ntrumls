cmake_minimum_required(VERSION 3.5)
project(NTRUMLS)

set(CMAKE_CXX_STANDARD 11)

include_directories(NTRUMLS/src/)

add_library(ntrumls
        NTRUMLS/src/crypto_hash_sha512.c
        NTRUMLS/src/crypto_stream.c
        NTRUMLS/src/randombytes.c
        NTRUMLS/src/fastrandombytes.c
        NTRUMLS/src/shred.c
        NTRUMLS/src/convert.c
        NTRUMLS/src/pack.c
        NTRUMLS/src/pol.c
        NTRUMLS/src/params.c
        NTRUMLS/src/pqntrusign.c)

set_target_properties(ntrumls PROPERTIES
        ARCHIVE_OUTPUT_DIRECTORY "${PROJECT_SOURCE_DIR}/lib"
        LIBRARY_OUTPUT_DIRECTORY "${PROJECT_SOURCE_DIR}/lib"
        RUNTIME_OUTPUT_DIRECTORY "${PROJECT_SOURCE_DIR}/lib")