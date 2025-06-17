import { Test, TestingModule } from '@nestjs/testing';
import { ModelesService } from './modeles.service';

describe('ModelesService', () => {
  let service: ModelesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelesService],
    }).compile();

    service = module.get<ModelesService>(ModelesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
