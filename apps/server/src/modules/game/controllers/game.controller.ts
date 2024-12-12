import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GameService } from '../services/game.service';
import { StartGameDto } from '../dto/request/start-game.dto';
import { CreatedGameDto } from '../dto/response/created-game.dto';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Создание игры' })
  @ApiCreatedResponse({ type: CreatedGameDto })
  public startGame(@Body() dto: StartGameDto): CreatedGameDto {
    return this.gameService.startGame(dto);
  }
}
