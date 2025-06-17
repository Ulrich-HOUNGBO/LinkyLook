import { Test, TestingModule } from '@nestjs/testing';
import { ModelesController } from './modeles.controller';
import { ModelesService } from './modeles.service';

describe('ModelesController', () => {
  let controller: ModelesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelesController],
      providers: [ModelesService],
    }).compile();

    controller = module.get<ModelesController>(ModelesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
