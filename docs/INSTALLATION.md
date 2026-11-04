# Installation Guide

This guide provides detailed instructions for setting up GTO BioChef on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v22.15 or later)
- npm (usually comes with Node.js)
- Emscripten (for compiling C code to WebAssembly)

## Step-by-Step Installation

1. Clone the repository:
   ```
   git clone https://github.com/ieeta-pt/Biochef.git
   cd Biochef
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Compile GTO tools to WebAssembly:
   ```
   npm run build-wasm
   ```
   This step may take a few minutes as it compiles all the GTO tools to WebAssembly.

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:8082`.

## Troubleshooting

If you encounter any issues during installation, try the following:

1. Ensure all prerequisites are correctly installed and up to date.
2. Clear npm cache: `npm cache clean --force`
3. Delete the `node_modules` folder and `package-lock.json` file, then run `npm install` again.
4. If you have issues with the WebAssembly compilation, ensure Emscripten is correctly installed and configured.

If problems persist, please open an issue on our GitHub repository with detailed information about the error you're experiencing.

## Updating

To update GTO BioChef to the latest version:

1. Pull the latest changes from the repository:
   ```
   git pull origin main
   ```

2. Install any new dependencies:
   ```
   npm install
   ```

3. Recompile the WebAssembly modules:
   ```
   npm run build-wasm
   ```

4. Restart the development server:
   ```
   npm start
   ```

