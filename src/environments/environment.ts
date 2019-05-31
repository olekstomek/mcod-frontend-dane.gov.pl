// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import * as config from '../../package.json';
import * as ENV from '../../env.json';


export const environment = {
    production: false,
    displayBuild: true,
    VERSION: config.version,
    HASH: ENV.COMMIT_HASH,
    DATE: ENV.COMMIT_DATE,
};
