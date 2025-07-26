import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { Organizations } from '../../organization/models/organization.entity';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Name of the role',
  })
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
  @IsUUID()
  @Type(() => String)
  organization: Organizations;
}
