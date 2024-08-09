import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Departure } from '@prisma/client';
import { DepartureDto } from 'src/types/departure.dto';

@Injectable()
export class DepartureService {
  constructor(private prisma: PrismaService) {}

  async createDeparture(data: DepartureDto): Promise<Departure> {
    const transformedData = {
      ...data,
      expectedArrivalDate: new Date(data.expectedArrivalDate).toISOString(),
    };
    return this.prisma.departure.create({
      data: transformedData,
    });
  }

  async getAllDepartures(): Promise<Departure[]> {
    return this.prisma.departure.findMany();
  }

  async getDeparturesByUser(userId: number): Promise<Departure[]> {
    return this.prisma.departure.findMany({
      where: { userId },
    });
  }

  async updateDeparture(
    id: number,
    data: Partial<DepartureDto>,
  ): Promise<Departure> {
    const transformedData = {
      ...data,
      expectedArrivalDate: data.expectedArrivalDate
        ? new Date(data.expectedArrivalDate).toISOString()
        : undefined,
    };
    return this.prisma.departure.update({
      where: { id },
      data: transformedData,
    });
  }
}
