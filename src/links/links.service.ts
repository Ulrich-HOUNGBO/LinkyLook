import { Injectable } from '@nestjs/common';
import { LinksRepository } from './models/links.repository';
import { CreateLinkDto } from './dto/links.dto';
import { Links } from './models/links.entity';
import { Users } from '../users/models/users.entity';

@Injectable()
export class LinksService {
  constructor(private readonly linksRepository: LinksRepository) {}

  async createLink(
    createLinkDto: CreateLinkDto,
    currentUser: Users,
  ): Promise<Links> {
    const newLink = new Links(createLinkDto);
    newLink.createdBy = currentUser;
    Object.assign(newLink, createLinkDto);
    return await this.linksRepository.create(newLink);
  }

  async findAll(): Promise<Links[]> {
    return await this.linksRepository.find({});
  }

  async findById(id: string): Promise<Links | null> {
    return await this.linksRepository.findOne({ where: { id } });
  }

  async findLinks(
    organizationId?: string,
    campaignId?: string,
  ): Promise<Links[]> {
    return await this.linksRepository.find({
      where: {
        ...(organizationId && { organization: { id: organizationId } }),
        ...(campaignId && { campaign: { id: campaignId } }),
      },
      relations: ['createdBy', 'organization', 'campaign'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateLink(
    id: string,
    updateLinkDto: Partial<CreateLinkDto>,
  ): Promise<Links | null> {
    const existingLink = await this.linksRepository.findOne({ where: { id } });
    if (!existingLink) {
      throw new Error('Link not found');
    }
    Object.assign(existingLink, updateLinkDto);
    return await this.linksRepository.update({ id }, existingLink);
  }

  async deleteLink(id: string): Promise<void> {
    const existingLink = await this.linksRepository.findOne({ where: { id } });
    if (!existingLink) {
      throw new Error('Link not found');
    }
    await this.linksRepository.delete({ id: existingLink.id });
  }
}
