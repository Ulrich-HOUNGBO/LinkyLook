import { Injectable } from '@nestjs/common';
import { ModelesRepository } from './models/modeles.repository';
import { CreateModelesDto } from './dto/modeles.dto';
import { Modeles } from './models/modeles.entity';

@Injectable()
export class ModelesService {
  constructor(private readonly modelesRepository: ModelesRepository) {}

  async createModel(createModeleDto: CreateModelesDto): Promise<Modeles> {
    const newModel = new Modeles(createModeleDto);
    Object.assign(newModel, createModeleDto);
    return await this.modelesRepository.create(newModel);
  }

  async findAll(): Promise<Modeles[]> {
    return await this.modelesRepository.find({});
  }

  async findById(id: string): Promise<Modeles | null> {
    return await this.modelesRepository.findOne({ where: { id } });
  }

  async updateModel(
    id: string,
    updateModeleDto: Partial<CreateModelesDto>,
  ): Promise<Modeles | null> {
    const existingModel = await this.modelesRepository.findOne({
      where: { id },
    });
    if (!existingModel) {
      throw new Error('Model not found');
    }
    Object.assign(existingModel, updateModeleDto);
    return await this.modelesRepository.update({ id }, existingModel);
  }

  async deleteModel(id: string): Promise<void> {
    const existingModel = await this.modelesRepository.findOne({
      where: { id },
    });
    if (!existingModel) {
      throw new Error('Model not found');
    }
    await this.modelesRepository.delete({ id: existingModel.id });
  }

  async findByOrganizationId(organizationId: string): Promise<Modeles[]> {
    return await this.modelesRepository.find({
      where: { organization: { id: organizationId } },
    });
  }
}
