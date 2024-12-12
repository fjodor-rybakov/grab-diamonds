import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameEventModule } from '../exceptions/room-is-full.exception';
import { Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/services/database.service';
import { GameNotFoundException } from '../exceptions/game-not-found.exception';
import { plainToInstance } from 'class-transformer';
import { GameInfoDto } from '../dto/response/game-info.dto';
import { JoinGameDto } from '../dto/request/join-game.dto';
import { OpenCellDto } from '../dto/request/open-cell.dto';
import { IsNotGameParticipantException } from '../exceptions/is-not-game-participant.exception';
import { IsNotYourTurnRightNowException } from '../exceptions/is-not-your-turn-right-now.exception';
import { BattlefieldService } from '../../battlefield/services/battlefield.service';
import { CoordsBeyondFieldSizeException } from '../exceptions/coords-beyond-field-size.exception';
import { WinnerDto } from '../dto/response/winner.dto';
import { GameIsOverException } from '../exceptions/game-is-over.exception';
import { SavedGame } from '../../database/saved-game';

// TODO: Выделить бизнес логику в отдельный сервис
@WebSocketGateway({ namespace: 'game-events', transports: ['websocket'] })
export class GameEventGateway {
  private readonly logger: Logger = new Logger(GameEventGateway.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly battlefieldService: BattlefieldService,
  ) {}

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('joinGame')
  public async onJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: JoinGameDto,
  ): Promise<GameInfoDto> {
    const { gameId } = dto;
    const game = this.databaseService.get(gameId);

    if (!game) {
      throw new GameNotFoundException();
    }

    const clientsInRoom = await this.server.in(gameId).fetchSockets();

    if (clientsInRoom.length >= 2) {
      throw new GameEventModule();
    }

    await client.join(gameId);

    this.logger.debug(`Client ${client.id} was join to room ${gameId}`);

    if (!game.makingMovePlayerId) {
      game.makingMovePlayerId = client.id;
    }

    if (!game.playerInfo) {
      game.playerInfo = {};
    }

    game.playerInfo[client.id] = { diamondsCount: 0 };

    this.databaseService.write(gameId, game);

    return plainToInstance(GameInfoDto, game, {
      excludeExtraneousValues: true,
    });
  }

  @SubscribeMessage('openCell')
  public async onOpenCell(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: OpenCellDto,
  ): Promise<void> {
    const { gameId } = dto;
    const game = this.databaseService.get(gameId);

    if (!game) {
      throw new GameNotFoundException();
    }

    if (game.isOver) {
      throw new GameIsOverException();
    }

    const sockets = await this.server.in(gameId).fetchSockets();
    const socketsClientIds = sockets.map((socket) => socket.id);

    if (!socketsClientIds.includes(client.id)) {
      throw new IsNotGameParticipantException();
    }

    if (!this.battlefieldService.canMakeMove(game.battlefield, dto.x, dto.y)) {
      throw new CoordsBeyondFieldSizeException();
    }

    if (game.makingMovePlayerId !== client.id) {
      throw new IsNotYourTurnRightNowException();
    }

    const cellToOpen = this.battlefieldService.getCell(
      game.battlefield,
      dto.x,
      dto.y,
    );

    if (cellToOpen.isOpened) {
      return;
    }

    cellToOpen.isOpened = true;

    if (!cellToOpen.isDiamond) {
      game.makingMovePlayerId = this.switchPlayer(client.id, socketsClientIds);
    } else {
      game.playerInfo[client.id].diamondsCount++;
    }

    if (this.gameShouldBeOver(game)) {
      game.isOver = true;

      for (let i = 0; i < game.battlefield.length; i++) {
        for (let j = 0; j < game.battlefield[i].length; j++) {
          game.battlefield[i][j].isOpened = true;
        }
      }

      this.server.to(gameId).emit(
        'gameIsOver',
        plainToInstance(WinnerDto, {
          winnerClientId: this.findWinnerPlayerId(game),
        }),
      );
    }

    this.databaseService.write(gameId, game);

    this.server.to(gameId).emit(
      'openCell',
      plainToInstance(GameInfoDto, game, {
        excludeExtraneousValues: true,
      }),
    );
  }

  private switchPlayer(currentPlayerId: string, clientIds: string[]): string {
    return clientIds.find((id) => id !== currentPlayerId);
  }

  private gameShouldBeOver(game: SavedGame): boolean {
    const countFoundedDiamonds = Object.values(game.playerInfo).reduce(
      (sum, val) => sum + val.diamondsCount,
      0,
    );

    return countFoundedDiamonds === game.diamondsCount;
  }

  private findWinnerPlayerId(game: SavedGame): string {
    const [winnerClientId] = Object.entries(game.playerInfo).reduce(
      ([prevWinnerId, prevWinnerStats], [currentPlayerId, currentStats]) => {
        if (
          prevWinnerStats &&
          currentStats.diamondsCount > prevWinnerStats.diamondsCount
        ) {
          return [currentPlayerId, currentStats];
        }

        return [prevWinnerId, prevWinnerStats];
      },
      ['', { diamondsCount: 0 }],
    );

    return winnerClientId;
  }
}
