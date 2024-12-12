import { WsException } from '@nestjs/websockets';

export class IsNotGameParticipantException extends WsException {
  constructor() {
    super('Вы не являетесь участником данной игры');
  }
}
