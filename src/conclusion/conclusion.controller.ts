import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { ConclusionService } from './conclusion.service';
import { CreateNewConclusion } from './dto/createNewConclusion.dto';

@Controller('v1/conclusion')
export class ConclusionController {
  constructor(private readonly conclusionService: ConclusionService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async createNewConclusion(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: CreateNewConclusion,
    @AuthenticatedUser() user: { preferred_username: string },
  ) {
    return this.conclusionService.createNewConclusion(
      data,
      files,
      user.preferred_username,
    );
  }
}
