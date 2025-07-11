import { environment } from '@env/environment';
import { HttpModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AngularUniversalModule } from '@nestjs/ng-universal';
import { join } from 'path';
import { AppServerModule } from '../src/main.server';
import { CsrfMiddleware } from './csrf-middleware';
import { MultiLanguageMiddleware } from './multi-language-middleware';

/**
 * Application Module
 */
@Module({
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
