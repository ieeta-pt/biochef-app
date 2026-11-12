
![BioChef](img/BioChef.svg)

[![Downloads](https://img.shields.io/github/downloads/ieeta-pt/biochef-app/total)](https://github.com/ieeta-pt/biochef-app/releases)
[![License](https://img.shields.io/github/license/ieeta-pt/biochef-app)](LICENSE)
[![Version](https://img.shields.io/github/v/tag/ieeta-pt/biochef-app)](https://github.com/ieeta-pt/biochef-app/releases)

BioChef is a web application for building and running bioinformatics workflows. Tools are compiled to WebAssembly and run in the browser. This repository is the frontend, built with React, Material-UI and Webpack. It does not contain the tools themselves; it loads them from an OCI registry at runtime.

The application has two main pages:

- **Tools** (`/`): run a single tool on your input.
- **Workflow Builder** (`/workflow`): connect tools into a graph, where the output of one step feeds the next. Workflows can be exported and imported.

## Related repositories

| Repository | Role |
| --- | --- |
| biochef-app (this repository) | Web application. |
| [biochef-hub](https://github.com/ieeta-pt/biochef-hub) | Validates, builds, tests, signs and publishes recipes to the registry. |
| [biochef-recipes](https://github.com/ieeta-pt/biochef-recipes) | The recipes, one `biochef.yaml` per tool. |
| [biochef-agent](https://github.com/ieeta-pt/biochef-agent) | Execution service that runs BioChef workflows outside the browser, using tools from the registry. |

## How tools are loaded

1. The app fetches the catalog package `biochef-plugins-index` with tag `latest` from the registry set in `REGISTRY_URL`.
2. It verifies the catalog's ES256 signature against the public key in `src/utils/catalogTrust.js` and validates each entry.
3. When a tool is used, it downloads the tool's `bundle.json` and runtime files by digest and checks the SHA-256 of each file (`src/utils/artifactIntegrity.js`).
4. It runs the WebAssembly module in the browser with [Aioli](https://github.com/WildBunnie/aioli).

## Getting started

Requires Node.js 22.15 or later.

```bash
git clone https://github.com/ieeta-pt/biochef-app.git
cd biochef-app
npm ci
echo "REGISTRY_URL=https://registry.biochef.app" > .env
npm start
```

`npm start` serves the app at `http://localhost:8082` and opens it in your browser.

To build a production bundle in `dist/`:

```bash
npm run build
```

### Configuration

Values are read from the environment or from `.env` when Webpack runs, and are compiled into the bundle, so restart or rebuild after changing them. `example.env` is a template.

| Variable | Purpose |
| --- | --- |
| `REGISTRY_URL` | Registry to load tools from. Required. |
| `BIOCHEF_CATALOG_PACKAGE` | Catalog package. Defaults to `biochef-plugins-index`. |
| `BIOCHEF_CATALOG_PUBLIC_JWK` | Catalog public key. Defaults to the key in `src/utils/catalogTrust.js`. |
| `REPO_OWNER` | Repository owner. Used only with `ghcr.io`. |
| `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` | Registry credentials. |
| `BIOCHEF_ALLOW_UNSIGNED_LOCAL_CATALOG` | Set to `true` to load the unsigned development catalog. Accepted only with a loopback registry and the package `biochef-dev-plugins-index`. |

### Run with a local registry

`docker-compose.dev.yml` runs the app and a local registry, so you can try a recipe before it is published. Docker is required.

Start the app at `http://localhost:8082` and the registry at `localhost:5000`:

```bash
docker compose -f docker-compose.dev.yml up frontend registry
```

In another terminal, build a recipe from a checkout of biochef-recipes and publish it to the local registry:

```bash
./scripts/publish-local-recipe.sh --recipe ../biochef-recipes/recipes/edlib/biochef.yaml
```

The script runs the hub in a Docker image built from `Dockerfile.hub.dev`, which it builds on first use, and publishes an unsigned catalog that the local stack loads. Reload the page to see the tool.

| Option | Purpose |
| --- | --- |
| `--recipe PATH [PATH ...]` | One or more `biochef.yaml` files. |
| `--hub DIR` | Use a local biochef-hub clone instead of the one in the image. A `git worktree` fails at the SBOM step. |
| `--rebuild` | Rebuild the image. |

The browser must reach the registry on `localhost:5000`, but the compose file publishes it on `127.0.0.1` only. On macOS, AirPlay Receiver also listens on port 5000 and can answer `localhost:5000` over IPv6. The app then cannot read the catalog and shows no tools.

## Repository layout

```
src/
  App.js                    Routes
  components/               UI components
  contexts/                 React contexts
  pages/                    Tools, Workflow Builder and About pages
  utils/                    Tool loading, data types and workflow logic
public/                     Static files copied into the build
img/                        Logos
scripts/                    Publish recipes to the local registry
tests/                      Performance tests, see tests/README.md
docker-compose.dev.yml      Local app and registry
Dockerfile.hub.dev          Hub image for local builds
registry-config.yml         Local registry configuration
example.env                 Configuration template
.github/workflows/deploy.yml
```

A push to the `deploy` branch runs `.github/workflows/deploy.yml`, which publishes `dist/` to GitHub Pages with `npm run deploy`.

## Contributing

We welcome contributions to BioChef! Whether it's bug reports, feature requests, or code contributions, please refer to our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## License

This project is licensed under the Apache License 2.0; see [LICENSE](LICENSE) and [NOTICE](NOTICE).
Code written before the change was released under the MIT License; its notice is kept in [LICENSE-MIT](LICENSE-MIT).

## Acknowledgments

- The GTO (Genomic Toolkit) suite developers
- The Emscripten team for enabling C-to-WebAssembly compilation
- All contributors and users of BioChef
