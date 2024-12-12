import { WsException } from '@nestjs/websockets';

export class CoordsBeyondFieldSizeException extends WsException {
  constructor() {
    super('Коортинаты находятся за пределами карты');
  }
}
