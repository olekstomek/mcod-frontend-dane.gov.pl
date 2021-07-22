import * as config from "../../package.json";
import * as ENV from "../../env.json";

// Use this configuration, if you are operating on mcod.local domain.

export const environment = {
    production: true,
    displayBuild: true,
    VERSION: config.version,
    HASH: ENV.COMMIT_HASH,
    DATE: ENV.COMMIT_DATE,
    name: "local",
    PWA: false
};
