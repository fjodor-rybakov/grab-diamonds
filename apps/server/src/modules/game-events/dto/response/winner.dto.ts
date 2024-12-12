import { Expose } from 'class-transformer';

export class WinnerDto {
  @Expose()
  winnerClientId: string;
}
