import { Controller, Get } from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import { ModalitiesService } from './modalities.service';

@Controller('v1/modalities')
export class ModalitiesController {
 constructor(private readonly   modalitiesService: ModalitiesService) {}

 @Public()
 @Get()
 async getAllModalities() {
   return this.modalitiesService.getAllModalities();
 }

}
