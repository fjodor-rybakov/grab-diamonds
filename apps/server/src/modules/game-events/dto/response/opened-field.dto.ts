import { Expose } from 'class-transformer';

export class OpenedFieldDto {
  @Expose({ groups: ['opened'] })
  isDiamond: boolean;

  @Expose({ groups: ['opened'] })
  adjacentDiamonds: number;

  @Expose()
  isOpened: boolean;
}
