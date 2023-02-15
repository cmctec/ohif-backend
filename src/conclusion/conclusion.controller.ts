import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'nest-keycloak-connect';
import { ConclusionService } from './conclusion.service';
import { CreateNewConclusion } from './dto/createNewConclusion.dto';

@Controller('v1/conclusion')
export class ConclusionController {
  constructor(private readonly conclusionService: ConclusionService) {}

  @Public()
  @Put()
  @UseInterceptors(AnyFilesInterceptor())
  async createNewConclusion(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: CreateNewConclusion,
  ) {
    return this.conclusionService.createNewConclusion(data, files);
  }
}
