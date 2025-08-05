import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { LinkTypes } from '@app/common/enums/link-types.enum';
import { IsCuid } from '@app/common';

export class CreateLinkDto {
  @ApiProperty({
    example: 'https://example.com',
    description: 'The URL of the link',
  })
  @IsNotEmpty({
    message: 'Target URL is required and must be a valid URL',
  })
  @IsUrl()
  target_url: string;

  @ApiProperty({
    example: 'Example Link',
    description: 'A brief title for the link',
  })
  @IsNotEmpty({
    message: 'Name is required and must be a string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'This is an example link for demonstration purposes.',
    description: 'A description of the link',
    required: false,
    type: String,
    default: '',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'true',
    description: 'Indicates whether the link is shielded (true or false)',
    required: true,
  })
  @IsNotEmpty({
    message:
      'Shielded is required and must be a boolean string ("true" or "false")',
  })
  @IsBooleanString({
    message: 'shielded must be a boolean string ("true" or "false")',
  })
  shielded: boolean;

  @ApiProperty({
    example: 'landing',
    description: 'The type of the link, e.g., "landing", "redirect", etc.',
    enum: LinkTypes,
    enumName: 'LinkTypes',
    required: true,
    type: String,
    default: LinkTypes.LANDING_PAGE,
  })
  @IsEnum({
    enum: LinkTypes,
    message: `Type must be one of the following: ${Object.values(LinkTypes).join(', ')}`,
  })
  @IsNotEmpty({
    message: 'Type is required and must be a valid enum value',
  })
  type: LinkTypes;

  @ApiProperty({
    example: 'org_12345',
    description: 'The ID of the organization to which the link belongs',
    required: false,
  })
  @IsCuid()
  organizationId?: string;

  @ApiProperty({
    example: 'camp_12345',
    description: 'The ID of the campaign associated with the link',
    required: false,
  })
  @IsCuid()
  campaignId?: string;
}
