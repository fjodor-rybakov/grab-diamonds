import { WsException } from '@nestjs/websockets';

export class GameIsOverException extends WsException {
  constructor() {
    super('Игра окончена');
  }
}
