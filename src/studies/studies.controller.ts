import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from 'nest-keycloak-connect';
import ValidationOpt from 'src/utilModules/config/ValidationOpt';
import { GetAllStudiesDto } from './dto/getAllStudies.dto';
import { StudiesService } from './studies.service';

@Controller('v1/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Public()
  @Get(':id')
  async getStudies(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.studiesService.getStudies(id);
  }
  @Public()
  @Get()
  async getAllStudies(
    @Query(new ValidationPipe(ValidationOpt))
    queryParams: GetAllStudiesDto,
  ) {
    return this.studiesService.getAllStudies(queryParams);
  }
}
