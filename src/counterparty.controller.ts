import { Controller, Post, Body } from '@nestjs/common';
import { CounterpartyService } from './services/counterparty.service';
import { CreateCounterpartyDto } from './types/counterparty.dto';
import { Counterparty } from '@prisma/client';

@Controller('counterparties')
export class CounterpartyController {
  constructor(private readonly counterpartyService: CounterpartyService) {}

  @Post()
  async createCounterparty(
    @Body() createCounterpartyDto: CreateCounterpartyDto,
  ): Promise<Counterparty> {
    return this.counterpartyService.createCounterparty(createCounterpartyDto);
  }
}
