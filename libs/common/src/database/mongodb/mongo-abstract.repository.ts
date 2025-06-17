import { MongoAbstractDocument } from '@app/common/database/mongodb/mongo-abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class MongoAbstractRepository<
  TDocument extends MongoAbstractDocument,
> {
  protected readonly logger: Logger;
  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as TDocument;
  }

  async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filter).lean<TDocument[]>(true);
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filter).lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document with filter ${JSON.stringify(filter)} not found`,
      );
      throw new NotFoundException(
        `Document with id ${JSON.stringify(filter)} not found`,
      );
    }
    return document;
  }

  async findOneAndUpdate(
    id: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(id, update, { new: true })
      .lean<TDocument>();
    if (!document) {
      this.logger.warn(`Document with id ${JSON.stringify(id)} not found`);
      throw new NotFoundException(
        `Document with id ${JSON.stringify(id)} not found`,
      );
    }
    return document;
  }

  async findOneAndDelete(id: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOneAndDelete(id)
      .lean<TDocument>(true);
    if (!document) {
      this.logger.warn(
        `Document with id ${JSON.stringify(document)} not found`,
      );
      throw new NotFoundException(
        `Document with id ${JSON.stringify(id)} not found`,
      );
    }
    return document;
  }
}
