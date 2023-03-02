import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import ValidationOpt from 'src/utilModules/config/ValidationOpt';
import { GetAllStudiesDto } from './dto/getAllStudies.dto';
import { StudiesService } from './studies.service';

@Controller('v1/studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}

  @Get(':id')
  async getStudies(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.studiesService.getStudies(id);
  }
  @Get()
  async getAllStudies(
    @Query(new ValidationPipe(ValidationOpt))
    queryParams: GetAllStudiesDto,
  ) {
    return this.studiesService.getAllStudies(queryParams);
  }
  @Post()
  async createStudies() {
    return this.studiesService.createSupabaseStudies();
  }
}
