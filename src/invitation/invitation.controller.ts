import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationDto } from './dto/update-invitation.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Users } from '../users/models/users.entity';
import { ApiParam } from '@nestjs/swagger';

@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post()
  async create(
    @Body() createInvitationDto: CreateInvitationDto,
    @ActiveUser() user: Users,
  ) {
    return await this.invitationService.create(createInvitationDto, user);
  }

  @Get(':organizationId')
  @ApiParam({
    name: 'organizationId',
    required: true,
    description: 'The ID of the organization to fetch invitations for',
  })
  findAll(@Param('organizationId') organizationId: string) {
    return this.invitationService.findInvitationsByOrganizationId(
      organizationId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationService.findInvitationById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvitationDto: UpdateInvitationDto,
  ) {
    return this.invitationService.updateInvitation(id, updateInvitationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationService.deleteInvitation(id);
  }
}
