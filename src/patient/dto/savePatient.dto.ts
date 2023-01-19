import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SavePatientDto {
  @ApiProperty()
  @IsString()
  orgID: string;

  @ApiProperty()
  @IsString()
  iin: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  email: string;
}
