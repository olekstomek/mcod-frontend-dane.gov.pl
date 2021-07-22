import { environment } from '@env/environment';
import { HttpModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
import { AppServerModule } from '../src/main.server';
import { CsrfMiddleware } from './csrf-middleware';
import { LicensesController } from './licenses/licenses.controller';
import { MockController } from './mock/mock.controller';
import { MultiLanguageMiddleware } from './multi-language-middleware';

const controllers = environment.production ? [LicensesController] : [MockController, LicensesController];

/**
 * Application Module
 */
@Module({
    controllers: controllers,
    imports: [
        HttpModule,
        AngularUniversalModule.forRoot({
            bootstrap: AppServerModule,
            viewsPath: join(process.cwd(), 'dist/frontend'),
            cache: false
        }),
    ]
})
export class ApplicationModule {

    /**
     * Configures middlewares
     * @param consumer
     */
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CsrfMiddleware, MultiLanguageMiddleware)
            .forRoutes('*');
    }

}
