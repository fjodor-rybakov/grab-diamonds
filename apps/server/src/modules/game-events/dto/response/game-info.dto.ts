import { Expose, plainToInstance, Transform } from 'class-transformer';
import { OpenedFieldDto } from './opened-field.dto';
import { Cell } from '../../../battlefield/services/battlefield.service';

export class GameInfoDto {
  @Expose()
  battlefieldSize: number;

  @Expose()
  diamondsCount: number;

  @Expose()
  makingMovePlayerId: string;

  // Пока что так сделал, чтобы сэкономить время
  @Expose()
  @Transform(({ value, options }) =>
    value.map((item: Cell[]) =>
      item.map((cell: Cell) =>
        plainToInstance(OpenedFieldDto, cell, {
          ...options,
          groups: cell.isOpened ? ['opened'] : [],
        }),
      ),
    ),
  )
  battlefield: OpenedFieldDto[][];
}
