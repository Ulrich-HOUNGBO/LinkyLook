import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrganizationDto {
  @ApiProperty({
    example: 'Tech Innovations',
    description: 'The name of the organization',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A leading tech company specializing in innovative solutions.',
    description: 'A brief description of the organization',
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateOrganizationDto {
  @ApiProperty({
    example: 'Tech Innovations',
    description: 'The name of the organization',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'A leading tech company specializing in innovative solutions.',
    description: 'A brief description of the organization',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
