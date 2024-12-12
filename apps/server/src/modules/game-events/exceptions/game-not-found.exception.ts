import { WsException } from '@nestjs/websockets';

export class GameNotFoundException extends WsException {
  constructor() {
    super('Игра не найдена');
  }
}
