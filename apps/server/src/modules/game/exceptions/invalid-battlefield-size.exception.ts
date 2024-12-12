import { BadRequestException } from '@nestjs/common';

export class InvalidBattlefieldSizeException extends BadRequestException {
  constructor() {
    super({ message: 'Не корректный размер поля' });
  }
}
