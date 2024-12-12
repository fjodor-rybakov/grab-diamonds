import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, IsPositive } from 'class-validator';

export class StartGameDto {
  @ApiProperty({ description: 'Размер поля' })
  @IsInt()
  @IsPositive()
  @IsDefined()
  battlefieldSize: number;

  @ApiProperty({ description: 'Кол-во алмазов' })
  @IsInt()
  @IsPositive()
  @IsDefined()
  diamondsCount: number;
}
