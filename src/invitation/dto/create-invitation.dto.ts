import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateInvitationDto {
  @ApiProperty({
    description: 'The ID of the organization to which the invitation is sent',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The ID of the organization to which the invitation is sent',
    type: String,
  })
  organizationId: string;

  @ApiProperty({
    description: 'The role assigned to the user in the organization',
    type: String,
  })
  role: string;
}
