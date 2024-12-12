import { Module } from '@nestjs/common';
import { GameController } from './controllers/game.controller';
import { GameService } from './services/game.service';
import { DatabaseModule } from '../database/database.module';
import { BattlefieldModule } from '../battlefield/battlefield.module';

@Module({
  imports: [DatabaseModule, BattlefieldModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
