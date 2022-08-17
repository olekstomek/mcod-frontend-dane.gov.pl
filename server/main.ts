import { environment } from '@env/environment';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request } from 'express';
import Helmet from 'helmet';
import { ApplicationModule } from './app.module';
import * as fs from 'fs';

const cookieParser = require('cookie-parser');
const requestProxy = require('express-request-proxy');

async function bootstrap() {
  let httpsOptions = null;
  const dev_env = environment.name === 'int' ? true : false;
  Logger.log('Environment: ' + environment.name);
  if (dev_env) {
    const keyPath = process.env.SSL_KEY_PATH || '/ssl/privkey.pem';
    const certPath = process.env.SSL_CERT_PATH || '/ssl/pubkey.pem';
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
    Logger.log('SSL certs loaded');
  }

  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, { httpsOptions });

  app.use(cookieParser());
  app.use(Helmet.hidePoweredBy());
  app.set('trust proxy', true);

  if (!environment.production) {
    app.use(
      '/api/ping',
      requestProxy({
        url: 'https://api.dev.dane.gov.pl/ping',
        originalQuery: true,
      }),
    );
    app.use('/api/*', (req: Request, res, next) => {
      if (req.baseUrl.includes('mock')) {
        next();
        return;
      }
      requestProxy({
        url: 'https://api.dev.dane.gov.pl/1.4/*',
        originalQuery: true,
      })(req, res, next);
    });
    app.use(
      '/cms/*',
      requestProxy({
        url: 'https://cms.dev.dane.gov.pl/*',
      }),
    );
  }

  app.enableCors({
    methods: 'GET',
    maxAge: 3600,
  });
  Logger.log('Starting APP');
  await app.listen(process.env.PORT || 4000);
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  bootstrap().catch(err => console.error(err));
}
