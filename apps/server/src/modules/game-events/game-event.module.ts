import { Module } from '@nestjs/common';
import { GameEventGateway } from './gateways/game-event.gateway';
import { DatabaseModule } from '../database/database.module';
import { BattlefieldModule } from '../battlefield/battlefield.module';

@Module({
  imports: [DatabaseModule, BattlefieldModule],
  providers: [GameEventGateway],
})
export class GameEventModule {}
