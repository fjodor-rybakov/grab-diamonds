import { BadRequestException } from '@nestjs/common';

export class InvalidDiamondsCountException extends BadRequestException {
  constructor() {
    super({ message: 'Не корректное кол-во алмазов' });
  }
}
