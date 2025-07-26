import { Controller } from '@nestjs/common';
import { UserOrganizationService } from './user-organization.service';

@Controller('user-organization')
export class UserOrganizationController {
  constructor(private readonly userOrganizationService: UserOrganizationService) {}
}
