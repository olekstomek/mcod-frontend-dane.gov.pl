import { Controller, Get } from '@nestjs/common';

/**
 * Mock Controller
 * Mocks Api
 */
@Controller('api/mock')
export class MockController {
    @Get()
    hello() {
        return 'Hello Mock Api';
    }
}
