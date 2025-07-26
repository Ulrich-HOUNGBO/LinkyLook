import { Injectable } from '@nestjs/common';
import { Client } from 'node-mailjet';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailJetStrategy {
  private readonly mailjet: Client;

  constructor(private readonly configService: ConfigService) {
    this.mailjet = new Client({
      apiKey: this.configService.getOrThrow<string>('MAILJET_API_KEY'),
      apiSecret: this.configService.getOrThrow<string>('MAILJET_API_SECRET'),
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      await this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email:
                this.configService.getOrThrow<string>('MAILJET_FROM_EMAIL'),
              Name: this.configService.getOrThrow<string>('MAILJET_FROM_NAME'),
            },
            To: [{ Email: to }],
            Subject: subject,
            TextPart: text,
            HTMLPart: html ?? '',
          },
        ],
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateId: number,
    variables: Record<string, string>,
  ): Promise<void> {
    try {
      await this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email:
                this.configService.getOrThrow<string>('MAILJET_FROM_EMAIL'),
              Name: this.configService.getOrThrow<string>('MAILJET_FROM_NAME'),
            },
            To: [{ Email: to }],
            Subject: subject,
            TemplateID: templateId,
            TemplateLanguage: true,
            Variables: variables,
          },
        ],
      });
    } catch (error) {
      console.error('Failed to send template email:', error);
      throw error;
    }
  }
}
