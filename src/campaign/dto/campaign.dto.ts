import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCuid } from '@app/common';

export class CreateCampaignDto {
  @ApiProperty({
    description: 'The name of the campaign',
    example: 'Campaign Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the campaign',
    example: 'This is a sample campaign description.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The ID of the model associated with the campaign',
    example: '1',
  })
  @IsCuid()
  modelId: string;

  @ApiProperty({
    description: 'The ID of the organization associated with the campaign',
    example: '1',
  })
  @IsCuid()
  @IsNotEmpty()
  organizationId: string;
}

export class UpdateCampaignDto {
  @ApiProperty({
    description: 'The name of the campaign',
    example: 'Updated Campaign Name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The description of the campaign',
    example: 'This is an updated campaign description.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
