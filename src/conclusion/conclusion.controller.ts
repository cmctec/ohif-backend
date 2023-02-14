import { Controller, Get } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { ConclusionService } from './conclusion.service';

@Controller('v1/conclusion')
export class ConclusionController {
  constructor(private readonly conclusionService: ConclusionService) {}

  @Public()
  @Get()
  async getAllModalities() {
    return this.conclusionService.getAllModalities();
  }
}
