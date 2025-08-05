import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCuid } from '@app/common';

export class UserOrganizationDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user',
  })
  @IsCuid()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'The ID of the organization',
  })
  @IsCuid()
  @IsNotEmpty()
  organizationId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
    description: 'The ID of the role (optional)',
  })
  @IsCuid()
  @IsOptional()
  roleId?: string;
}

export class AddUserToOrganizationDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The ID of the user',
  })
  @IsCuid()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
    description: 'The ID of the role (optional)',
  })
  @IsCuid()
  @IsOptional()
  roleId?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174002',
    description: 'The ID of the role',
  })
  @IsCuid()
  @IsNotEmpty()
  roleId: string;
}
