import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateCounterpartyDto } from '../types/counterparty.dto';
import { Counterparty } from '@prisma/client';

@Injectable()
export class CounterpartyService {
  constructor(private readonly prisma: PrismaService) {}

  async createCounterparty(data: CreateCounterpartyDto): Promise<Counterparty> {
    return this.prisma.counterparty.create({ data });
  }

  async getCounterpartyByName(name: string): Promise<Counterparty | null> {
    return this.prisma.counterparty.findFirst({
      where: { name },
    });
  }
}
