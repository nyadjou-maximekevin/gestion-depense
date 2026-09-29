import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Depense } from './depense.entity.js';
import { DepensesController } from './depenses.controller.js';
import { DepensesService } from './depenses.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Depense])],
  controllers: [DepensesController],
  providers: [DepensesService],
})
export class DepensesModule {}
