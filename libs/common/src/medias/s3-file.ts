import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export default class AwsS3File {
  private s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: configService.getOrThrow('AWS_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow('AWS_SECRET_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const key = `${createId()}-${file.originalname}`;

    const params = {
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
    };

    const command = new PutObjectCommand(params);
    await this.s3.send(command);

    return `https://${this.configService.getOrThrow('AWS_BUCKET_NAME')}.s3.amazonaws.com/${key}`;
  }

  async deleteFile(path: string) {
    const key = path.split('.com/')[1];
    const params = {
      Bucket: this.configService.getOrThrow<string>('AWS_BUCKET_NAME'),
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    await this.s3.send(command);
    console.log(`Deleted file: ${path}`);
  }

  async updateFile(file: Express.Multer.File, path: string) {
    await this.deleteFile(path);
    return await this.uploadFile(file);
  }
}
