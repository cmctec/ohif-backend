import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class SendOptCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
  
  @ApiProperty()
  @IsString()
  doctor_iin: string;
}
