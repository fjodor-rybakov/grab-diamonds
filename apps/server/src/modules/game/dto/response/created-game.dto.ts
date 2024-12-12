import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatedGameDto {
  @ApiProperty()
  @Expose()
  gameId: string;
}
