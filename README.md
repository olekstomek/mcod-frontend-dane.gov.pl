# Otwarte Dane 2025 Frontend App

## Installation

Recommended node and npm versions 
- node > 20.10.0
- npm > 10.9.2

Main installation script is simply `npm install`. Other commands are optional, in case you need
Angular CLI for code generation or your Node Package Manager is outdated. Check your version
with `npm --version` command.

```shell
# Global installations are optional
npm install -g npm@latest
npm install -g @angular/cli
 
npm install
```

### Start application locally

To run your application locally, all you need to run is npm script. Script definition can be 
found inside `package.json`.

```shell
npm run start-local
```

### Building application for production

There are multiple scripts that builds frontend application, however only one of them creates
final production release code.

```shell
npm run build:prod
```

### API Proxy settings

Local frontend application does not serve API. Instead, frontend uses proxy to redirect request to running API instance.
Proxy settings are stored in `proxy.conf.json` file. This file is used when frontend is run on localhost with
`npm run start`.
Change the `target` path if you want services to refer to different API address. You can copy, rename and change
`proxy.conf.json` file contents according to your needs.

Usage:
Run local environment with local backend

```shell
npm run start-local 
```

Run local environment with dev backend

```shell
npm run start-dev
```

Run local environment with int backend

```shell
npm run start-int
```

Run local environment with preprod backend

```shell
npm run start-preprod
```

Proxy options:

- `target` - what is the target domain for that path
- `pathRewrite` - this option allows you to change parts of your local url to match API urls
- `secure` - determines if https requests are secure and signed with known authority, leave `false` for self-signed ssl
  certificates
- `logLevel` - verbosity of proxy server in your command line tool
- `changeOrigin` - important setting for cross origin calls, needs to stay `true` unless frontend and backend are served
  on the same domain

for example if your API stands on ```localhost:8000```, you need change `target` for `/api` in `proxy.conf.json` file,
for your cms you need
do the same; change `target` for `/cms` (in this example is `localhost:8001`).

Example `proxy.conf.json` file:

```shell
{
    "/api/**": {
        "target": "http://localhost:8000",
        "secure": false,
        "pathRewrite": {
            "^/api": ""
        },
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/media": {
        "target": "http://localhost:8000",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/flags": {
        "target": "https://dane.gov.pl/",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true
    },
    "/cms": {
        "target": "https://localhost:8001",
        "secure": false,
        "logLevel": "debug",
        "changeOrigin": true,
        "pathRewrite": {
            "^/cms": ""
        }
    }
}
```
## To connect the frontend with the
Modify the `docker-compose.yml` file to:

1. add a connection to the backend network
```yaml
# top level element
networks:
  frontend: # for completeness
  backend:
    name: backend_backend
    external: true
```
2. Connect the `serve` service to these networks
```yaml
  serve:
    networks:
      - frontend
      - backend
```

3. Amend `/etc/hosts` of the container
```yaml
  serve:
    extra_hosts:
      - "api.mcod.local:172.18.18.100"
      - "cms.mcod.local:172.18.18.100"
```

4. Change the *host* port to 4200
```yaml
  serve:
    ports:
      - "4200:4000"
```

The network name, port, and the addresses need to be coordinated with backend's `docker-compose.yml` and nginx config.
Warning: this configuration *requires* the backend network.
