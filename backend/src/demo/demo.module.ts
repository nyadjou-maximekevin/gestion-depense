import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller.js';
import { DemoService } from './demo.service.js';

// JwtService vient d'AuthModule (@Global) ; DataSource est fourni par TypeOrmModule
@Module({
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
