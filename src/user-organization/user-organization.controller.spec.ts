import { Test, TestingModule } from '@nestjs/testing';
import { UserOrganizationController } from './user-organization.controller';
import { UserOrganizationService } from './user-organization.service';

describe('UserOrganizationController', () => {
  let controller: UserOrganizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserOrganizationController],
      providers: [UserOrganizationService],
    }).compile();

    controller = module.get<UserOrganizationController>(UserOrganizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
