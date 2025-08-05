import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsCuid } from '@app/common/validators';
import { Type } from 'class-transformer';
import { Organizations } from '../../organization/models/organization.entity';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Name of the role',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Administrator with full access',
    description: 'Description of the role',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: { read: true, write: true, delete: false },
    description: 'Permissions associated with the role',
    type: Object,
    required: false,
  })
  permissions?: Record<string, boolean>;

  @ApiProperty({
    example: 'org_12345',
    description: 'ID of the organization to which the role belongs',
  })
  @IsCuid()
  @Type(() => String)
  organization: Organizations;
}
