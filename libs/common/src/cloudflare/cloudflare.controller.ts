import { Controller } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';

@Controller()
export class CloudflareController {
  constructor(private readonly cloudflareService: CloudflareService) {}
}
