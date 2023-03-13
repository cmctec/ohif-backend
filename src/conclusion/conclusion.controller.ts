import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
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

  @Get('/pdf/:id')
  @UseInterceptors(AnyFilesInterceptor())
  async getPDFSupabase(@Res() res, @Param() id: string) {
    const s3_PDF_URL = await this.conclusionService.supabaseGetPDFURL(
      Number(id),
    );
    return res.redirect(s3_PDF_URL);
  }
}
