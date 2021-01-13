# dom-client

## development

1. Make sure you have Nodejs & Rust is installed (we need cargo and npm)
2. Install wasm-pack with `cargo install wasm-pack`
3. build rust package. 
    1. `cd rust-wasm`
    2. `npm run build` ( you will need to run this everytime want changes to take effect in the react app)
    
4. install react client packages
    1. `cd ../` to go back to project root directory
    2. `cd react-client` to move into react directory
    3. `npm install` to install packages (the rust-wasm will also be installed as a package) 
