import { Injectable } from '@nestjs/common';

export type Cell = {
  isDiamond: boolean;
  adjacentDiamonds: number;
  isOpened: boolean;
};

export type Field = Cell[][];

@Injectable()
export class BattlefieldService {
  public generateField(size: number, diamondsCount: number): Field {
    const field: Field = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ({
        isDiamond: false,
        adjacentDiamonds: 0,
        isOpened: false,
      })),
    );

    let placedDiamonds = 0;
    while (placedDiamonds < diamondsCount) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);

      if (!field[row][col].isDiamond) {
        field[row][col].isDiamond = true;
        placedDiamonds++;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (
              newRow >= 0 &&
              newRow < size &&
              newCol >= 0 &&
              newCol < size &&
              !field[newRow][newCol].isDiamond
            ) {
              field[newRow][newCol].adjacentDiamonds++;
            }
          }
        }
      }
    }

    return field;
  }

  public canMakeMove(battlefield: Field, x: number, y: number): boolean {
    // Можем упростить проверку, т.к. карта имеет квадратный вид
    return battlefield.length > x || battlefield.length > y;
  }

  public getCell(battlefield: Field, x: number, y: number): Cell {
    return battlefield[y][x];
  }
}
