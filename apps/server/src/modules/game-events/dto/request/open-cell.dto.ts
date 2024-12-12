import { IsDefined, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class OpenCellDto {
  @IsNotEmpty()
  @IsString()
  gameId: string;

  @Min(0)
  @IsInt()
  @IsDefined()
  x: number;

  @Min(0)
  @IsInt()
  @IsDefined()
  y: number;
}
