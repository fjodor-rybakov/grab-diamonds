import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { GameEventModule } from './game-events/game-event.module';

@Module({
  imports: [GameModule, GameEventModule],
})
export class AppModule {}
