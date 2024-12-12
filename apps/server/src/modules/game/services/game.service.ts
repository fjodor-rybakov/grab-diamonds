import { Injectable } from '@nestjs/common';
import { StartGameDto } from '../dto/request/start-game.dto';
import { DatabaseService } from '../../database/services/database.service';
import { InvalidBattlefieldSizeException } from '../exceptions/invalid-battlefield-size.exception';
import { InvalidDiamondsCountException } from '../exceptions/invalid-diamonds-count.exception';
import { isOdd } from '../../shared/is-odd';
import { BattlefieldService } from '../../battlefield/services/battlefield.service';
import { CreatedGameDto } from '../dto/response/created-game.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GameService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly battlefieldService: BattlefieldService,
  ) {}

  // Представим, что это всё берётся из переменных среды
  private readonly maxBattlefieldSize = 6;
  private readonly minBattlefieldSize = 2;

  private readonly minDiamondsCount = 1;

  public startGame(dto: StartGameDto): CreatedGameDto {
    // TODO: Уточнить минимальный размер поля
    if (
      dto.battlefieldSize < this.minBattlefieldSize ||
      dto.battlefieldSize > this.maxBattlefieldSize
    ) {
      throw new InvalidBattlefieldSizeException();
    }

    // TODO: Уточнить границы по кол-ву алмазов
    if (
      dto.diamondsCount < this.minDiamondsCount ||
      dto.diamondsCount > dto.battlefieldSize * dto.battlefieldSize ||
      !isOdd(dto.diamondsCount)
    ) {
      throw new InvalidDiamondsCountException();
    }

    const gameId = crypto.randomUUID();
    const battlefield = this.battlefieldService.generateField(
      dto.battlefieldSize,
      dto.diamondsCount,
    );

    this.databaseService.write(gameId, {
      battlefieldSize: dto.battlefieldSize,
      diamondsCount: dto.diamondsCount,
      battlefield,
    });

    return plainToInstance(
      CreatedGameDto,
      { gameId },
      { excludeExtraneousValues: true },
    );
  }
}
