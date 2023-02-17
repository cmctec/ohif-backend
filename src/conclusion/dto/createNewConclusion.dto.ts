import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateNewConclusion {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  study_id: string;

  @ApiProperty()
  @IsString()
  conclusion_text?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // conclusion_image?: string;
  // // по идее файл

  @ApiProperty()
  @IsString()
  @IsOptional()
  ohif_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  doctor_iin?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  doctor_fullname?: string;
}
