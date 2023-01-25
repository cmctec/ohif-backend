import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class OptCodeVerifyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  doctor_iin: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  otp_code: string;
}
