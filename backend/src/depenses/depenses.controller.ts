import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { JwtPayload } from '../auth/jwt-payload.js';
import { CATEGORIES } from './categories.js';
import { DepensesService } from './depenses.service.js';
import { CreateDepenseDto } from './dto/create-depense.dto.js';
import { FiltreDepensesDto } from './dto/filtre-depenses.dto.js';
import { UpdateDepenseDto } from './dto/update-depense.dto.js';

// Guard sur tout le contrôleur : chaque route exige un token valide
@Controller('depenses')
@UseGuards(JwtAuthGuard)
export class DepensesController {
  constructor(private readonly depensesService: DepensesService) {}

  @Get('categories')
  categories() {
    return CATEGORIES;
  }

  @Post()
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateDepenseDto) {
    return this.depensesService.create(user.sub, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload, @Query() filtre: FiltreDepensesDto) {
    return this.depensesService.findAll(user.sub, filtre);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.depensesService.findOne(user.sub, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepenseDto,
  ) {
    return this.depensesService.update(user.sub, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: JwtPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.depensesService.remove(user.sub, id);
  }
}
