CARGO_TARGET_DIR=target cargo build --release --target wasm32-unknown-unknown
hc dna pack dnas/forum/workdir
WASM_LOG=warn cargo test