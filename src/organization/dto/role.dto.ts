import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'The name of the role',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Administrator role with full access',
    description: 'A brief description of the role',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: { createUser: true, deleteUser: false },
    description: 'The permissions associated with the role',
  })
  @IsObject()
  @IsOptional()
  permissions: Record<string, boolean>;
}