
![BioChef](img/BioChef.svg)

[![Downloads](https://img.shields.io/github/downloads/ieeta-pt/biochef-app/total)](https://github.com/ieeta-pt/biochef-app/releases)
[![License](https://img.shields.io/github/license/ieeta-pt/biochef-app)](LICENSE)
[![Version](https://img.shields.io/github/v/tag/ieeta-pt/biochef-app)](https://github.com/ieeta-pt/biochef-app/releases)

BioChef is a powerful web-based application for genomic sequence analysis and manipulation. It provides a user-friendly interface to execute various genomic tools from the GTO (Genomics-Proteomics Toolkit) suite directly in your browser using WebAssembly technology.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Tools Available](#tools-available)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Tools Page (Individual Tool Testing)](#tools-page-individual-tool-testing)
  - [Workflow Page (Multi-step Analysis)](#workflow-page-multi-step-analysis)
- [Development](#development)
  - [Key Files](#key-files)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Dual Interface**: Individual tool testing page and advanced workflow builder for different use cases.
- **Real-time Workflow Execution**: Tools execute automatically as you build workflows, with live output streaming.
- **Smart Tool Filtering**: Available tools update dynamically based on current data type and workflow compatibility.
- **Interactive Workflow Builder**: Drag-and-drop interface to create custom genomic analysis workflows.
- **Wide Range of Tools**: Access to numerous GTO tools for sequence manipulation, format conversion, and analysis.
- **Live Data Type Detection**: Automatic detection and validation with real-time updates throughout workflows.
- **Multi-Input Support**: Work with single sequences or multiple files simultaneously.
- **Input/Output Management**: Easy-to-use panels for managing input data and viewing live results.
- **Recipe Persistence**: Save and load your custom workflows with automatic state management.
- **WebAssembly Performance**: Run complex genomic tools directly in the browser without server dependencies.

## Tools Available

BioChef includes a wide array of genomic tools, categorized for easy access:

1. Sequence Manipulation (e.g., FASTA extraction, reverse, complement)
2. Format Conversion (e.g., FASTA to SEQ, FASTQ to FASTA)
3. Genomic Operations (e.g., genomic complement, random DNA generation)
4. Amino Acid Operations
5. Information and Analysis
6. Mathematical Operations
7. Text Processing



## Getting Started

### Prerequisites

- Node.js (v22.15 or later)
- Emscripten SDK (preferably v3.1.65) - only needed for rebuilding WASM modules
- C compiler toolchain - only needed for rebuilding WASM modules
- Python 3.x - only needed for regenerating JavaScript wrappers for WASM modules
- Modern web browser with WebAssembly support (Chrome, Firefox, Safari, Edge) to run the application

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/ieeta-pt/biochef-app.git
   cd biochef-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install Emscripten SDK:
   Download and install the Emscripten SDK from the [official repository](https://github.com/emscripten-core/emsdk). (Preferably the 3.1.65 version)

4. Setup Emscripten Environment Variable:
   ```
   nano ~/.bashrc
   export EMSDK_PATH="/path/to/your/emsdk"
   source ~/.bashrc
   ```

5. Compile GTO tools to WebAssembly:
   ```
   npm run build-wasm
   ```

6. Start the development server:
   ```
   npm start
   ```

7. Open your browser and navigate to `http://localhost:8082`.

For more detailed installation instructions, including troubleshooting tips, please see our [Installation Guide](docs/INSTALLATION.md).

## Usage

BioChef offers two main interfaces for working with genomic tools:

### Tools Page (Individual Tool Testing)
Access via the main route (`/`) for testing individual tools:

1. **Select Tool**: Browse and click any tool from the categorized Operations Panel
2. **View Documentation**: The tool's help documentation will automatically load
3. **Input Data**: Enter your genomic sequence data in the Input Panel
4. **Configure Parameters**: Adjust tool-specific parameters in the Testing Panel
5. **Execute**: Run the tool and view results in the Output Panel
6. **Download Results**: Save output data as needed

### Workflow Page (Multi-step Analysis)
Access via `/workflow` for building complex analysis pipelines:

1. **Input Data**: Paste your genomic sequence or upload files in the Input Panel
2. **Build Workflow**: Add tools from the Operations Panel - available tools update dynamically based on your current data type
3. **Real-time Execution**: Tools execute automatically as you add them, with outputs flowing to the next step
4. **Smart Tool Filtering**: Only compatible tools are shown based on your workflow's current state
5. **Configure Parameters**: Adjust tool settings in the Recipe Panel - changes trigger automatic re-execution
6. **View Live Results**: Outputs update in real-time and can be viewed/saved at any step


## Development

- The project uses React for the frontend, with Material-UI for styling.
- WebAssembly modules are generated from C source code using Emscripten.
- Webpack is used for bundling and serving the application.

### Key Files

- `src/App.js`: Main application component
- `src/components/`: React components for various UI elements
- `src/utils/`: Utility functions including data type detection
- `src/gtoWasm.js`: WebAssembly module loading logic
- `compile-all-gto.sh`: Script for compiling GTO tools to WebAssembly
- `generate_wrapper.py`: Python script for generating JavaScript wrappers for WebAssembly modules


## Contributing

We welcome contributions to BioChef! Whether it's bug reports, feature requests, or code contributions, please refer to our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the Apache License 2.0; see [LICENSE](LICENSE) and [NOTICE](NOTICE).
Code written before the change was released under the MIT License; its notice is kept in [LICENSE-MIT](LICENSE-MIT).

## Acknowledgments

- The GTO (Genomic Toolkit) suite developers
- The Emscripten team for enabling C-to-WebAssembly compilation
- All contributors and users of BioChef
