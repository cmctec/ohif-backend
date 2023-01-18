import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ParamsIsUUID {
  @ApiProperty()
  @IsUUID()
  id: string
}
