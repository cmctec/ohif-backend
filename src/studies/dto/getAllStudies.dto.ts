import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt } from 'class-validator';

export class GetAllStudiesDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public limit?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  offset?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  PatientName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  MRN?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  study_date?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  modality?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accesion?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;
}
