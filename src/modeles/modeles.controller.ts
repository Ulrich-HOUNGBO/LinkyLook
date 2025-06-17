import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ModelesService } from './modeles.service';
import { CreateModelesDto } from './dto/modeles.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Modeles')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('modeles')
export class ModelesController {
  constructor(private readonly modelesService: ModelesService) {}

  @Get()
  async getAllModeles() {
    return this.modelesService.findAll();
  }

  @Post()
  async createModele(@Body() createModeleDto: CreateModelesDto) {
    return this.modelesService.createModel(createModeleDto);
  }

  @Get(':id')
  async getModeleById(@Param('id') id: string) {
    return this.modelesService.findById(id);
  }

  @Put(':id')
  async updateModele(
    @Param('id') id: string,
    @Body() updateModeleDto: Partial<CreateModelesDto>,
  ) {
    return this.modelesService.updateModel(id, updateModeleDto);
  }

  @Delete(':id')
  async deleteModele(@Param('id') id: string) {
    return this.modelesService.deleteModel(id);
  }

  @Get('organization/:organizationId')
  async getModelesByOrganizationId(
    @Param('organizationId') organizationId: string,
  ) {
    return this.modelesService.findByOrganizationId(organizationId);
  }
}
