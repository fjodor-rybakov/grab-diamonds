import { Field } from '../battlefield/services/battlefield.service';

export type SavedGame = {
  battlefieldSize: number;

  diamondsCount: number;

  battlefield: Field;

  isOver?: boolean;

  playerInfo?: {
    [id: string]: {
      diamondsCount: number;
    };
  };

  makingMovePlayerId?: string;
};
