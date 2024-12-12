import { WsException } from '@nestjs/websockets';

export class IsNotYourTurnRightNowException extends WsException {
  constructor() {
    super('Сейчас не ваш ход');
  }
}
