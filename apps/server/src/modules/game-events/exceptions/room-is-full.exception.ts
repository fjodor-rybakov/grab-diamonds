import { WsException } from '@nestjs/websockets';

export class GameEventModule extends WsException {
  constructor() {
    super('Комната занята');
  }
}
