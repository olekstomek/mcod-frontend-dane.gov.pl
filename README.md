# Otwarte Dane 2018 Frontend App

## Installation

Recommended node and npm versions 
- node > 8.9.1
- npm > 6.4.1

Main installation script is simply `npm install`. Other commands are optional, in case you need 
Angular CLI for code generation or your Node Package Manager is outdated. Check your version 
with `npm --version` command.  

```shell
# Global installations are optional
npm install -g npm@latest
npm install -g @angular/cli
 
npm install
./create-env.sh
```

### Start application locally

To run your application locally, all you need to run is npm script. Script definition can be 
found inside `package.json`.

```shell
npm run start
```


### Building application for production 

There are multiple scripts that builds frontend application, however only one of them creates 
final production release code.    

```shell
npm run build:prod
```


### API Proxy settings

Local frontend application does not serve API. Instead, frontend uses proxy to redirect request to running API instance. 
Proxy settings are stored in `proxy.conf.json` file. This file is used when frontend is run on localhost with `npm run start`. 
Change the `target` path if you want services to refer to different API address. 

You can copy, rename and change `proxy.conf.json` file contents according to your needs. 
More extended documentation on how to use it, can be found on 
[Angular Cli Github](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md)

Usage:
```shell
ng serve --host 0.0.0.0 --proxy-config my-proxy.conf.json
```

Proxy options:
- `target` - what is the target domain for that path
- `pathRewrite` - this option allows you to change parts of your local url to match API urls
- `secure` - determines if https requests are secure and signed with known authority, leave `false` for self-signed ssl certificates
- `logLevel` - verbosity of proxy server in your command line tool
- `changeOrigin` - important setting for cross origin calls, needs to stay `true` unless frontend and backend are served on the same domain

### Generating new application version

This node scripts automatically creates new app version, and if `git-tag-version` is set to `true`
in `.npmrc` file, creates git tag with that version, and pushes it to remote branch. 

```shell
npm version {major|minor|patch}
```

How to remove git tag locally and remotely:
```
git push --delete origin tagname
git tag --delete tagname
```

How to add new tag manually:
```
git tag tagname -m "message"
git push origin tagname
```

where `tagname` is your version i.e.: v.1.1.5

### Saving git login credentials for https
Using GIT over HTTPS instead of SSH can be cumbersome. That's why newer versions of GIT 
introduced *Credential Helper*. With it you have to provide your Git Credentials only once.

More information can be found on 
[official GIT documentation](https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)

```
git config credential.helper store 
git pull
```

### Creating environment file

Environment file contains information about last build and last commit hash number, 
and looks like this:

**env.json**
```json
{
    "COMMIT_HASH":"826df9e2",
    "COMMIT_DATE":"10-10-2018 10:10:10"
}

```

You can create this file manually or simply run following script:

```shell
# Linux only command 
chmod +x create_env.sh

# Linux or Git Bash
./create-env.sh

# Windows CMD or PowerShell (double click might not work)
create-env.bat
```

If you want to get last commits hash, you can also run 
```
git rev-parse --short=8 HEAD
```
