import { Module } from '@nestjs/common';
import { BattlefieldService } from './services/battlefield.service';

@Module({
  providers: [BattlefieldService],
  exports: [BattlefieldService],
})
export class BattlefieldModule {}
