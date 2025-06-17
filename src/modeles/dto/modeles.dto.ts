import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateModelesDto {
  @ApiProperty({
    example: 'Model Name',
    description: 'The name of the model',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'This is a description of the model.',
    description: 'A brief description of the model',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  @MinLength(10)
  description?: string;

  @ApiProperty({
    example: '1',
    description: 'The ID of the organization to which the model belongs',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid UUID' })
  organizationId: string;
}
