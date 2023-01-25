import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SavePatientDto {
  @ApiProperty()
  @IsString()
  orgID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  iin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
