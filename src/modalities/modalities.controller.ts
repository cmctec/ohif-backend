import { Controller, Get } from '@nestjs/common';
import { ModalitiesService } from './modalities.service';

@Controller('v1/modalities')
export class ModalitiesController {
  constructor(private readonly modalitiesService: ModalitiesService) {}

  @Get()
  async getAllModalities() {
    return this.modalitiesService.getAllModalities();
  }
}
