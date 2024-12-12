import { Injectable } from '@nestjs/common';
import { SavedGame } from '../saved-game';

// Представим себе, что это бд

@Injectable()
export class DatabaseService<TEntity = SavedGame> {
  private readonly db: Record<string, TEntity> = {};

  public write(key: string, value: TEntity) {
    this.db[key] = value;
  }

  public get(key: string): TEntity {
    return this.db[key];
  }
}
