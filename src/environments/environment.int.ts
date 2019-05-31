import * as config from '../../package.json';
import * as ENV from '../../env.json';


export const environment = {
    production: true,
    displayBuild: true,
    VERSION: config.version,
    HASH: ENV.COMMIT_HASH,
    DATE: ENV.COMMIT_DATE,
};
