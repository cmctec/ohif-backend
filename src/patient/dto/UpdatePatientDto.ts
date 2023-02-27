import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdatePatientDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class UpdatePatientIINDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  iin: string;
}
